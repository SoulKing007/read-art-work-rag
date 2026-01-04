import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import type { AgentState, EnrichedChunk } from '../../types/database.types.js';

/**
 * Context Ranker Node
 * Ranks chunks by relevance, recency, and source type
 */
export async function contextRankerNode(state: AgentState): Promise<Partial<AgentState>> {
    logger.info('Context Ranker: Ranking chunks', {
        chunkCount: state.enrichedChunks?.length || 0
    });

    if (!state.enrichedChunks || state.enrichedChunks.length === 0) {
        logger.warn('Context Ranker: No chunks to rank');
        return { rankedContext: [] };
    }

    // Calculate composite score for each chunk
    const scoredChunks = state.enrichedChunks.map(chunk => {
        let compositeScore = 0;

        // 1. Similarity score (weight: 0.6)
        compositeScore += chunk.similarityScore * 0.6;

        // 2. Recency score (weight: 0.2)
        const recencyScore = calculateRecencyScore(chunk);
        compositeScore += recencyScore * 0.2;

        // 3. Source type weight (weight: 0.2)
        // Meetings might be more recent/relevant than documents
        const sourceTypeScore = chunk.sourceType === 'meeting' ? 1.0 : 0.8;
        compositeScore += sourceTypeScore * 0.2;

        return {
            chunk,
            compositeScore
        };
    });

    // Sort by composite score (descending)
    scoredChunks.sort((a, b) => b.compositeScore - a.compositeScore);

    // Take top K
    const rankedContext = scoredChunks
        .slice(0, config.rag.topKContext)
        .map(item => item.chunk);

    logger.info('Context Ranker: Ranking complete', {
        originalCount: state.enrichedChunks.length,
        rankedCount: rankedContext.length,
        topScore: scoredChunks[0]?.compositeScore
    });

    return { rankedContext };
}

/**
 * Calculate recency score based on date
 * More recent = higher score (0-1)
 */
function calculateRecencyScore(chunk: EnrichedChunk): number {
    try {
        let dateStr: string | undefined;

        if (chunk.sourceType === 'document') {
            dateStr = (chunk.sourceMetadata as any).upload_date;
        } else if (chunk.sourceType === 'meeting') {
            dateStr = (chunk.sourceMetadata as any).meeting_date;
        }

        if (!dateStr) {
            return 0.5; // Neutral score if no date
        }

        const date = new Date(dateStr);
        const now = new Date();
        const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

        // Exponential decay: score = e^(-days/180)
        // After 180 days, score is ~0.37
        // After 365 days, score is ~0.14
        const recencyScore = Math.exp(-daysDiff / 180);

        return Math.max(0, Math.min(1, recencyScore));
    } catch (error) {
        logger.warn('Context Ranker: Failed to calculate recency score', { error });
        return 0.5;
    }
}
