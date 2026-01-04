import { supabaseService } from '../../services/supabase.service.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { RetrievalError } from '../../utils/errors.js';
import type { AgentState, ChunkWithMetadata, EmbeddingMetadata } from '../../types/database.types.js';

/**
 * Retrieval Agent Node
 * Performs vector similarity search in Supabase
 */
export async function retrievalAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    logger.info('Retrieval Agent: Starting vector search', {
        query: state.query,
        keywords: state.queryAnalysis?.keywords
    });

    try {
        const vectorStore = await supabaseService.getVectorStore();

        // Perform similarity search
        const results = await vectorStore.similaritySearchWithScore(
            state.query,
            config.rag.topKRetrieval
        );

        if (results.length === 0) {
            logger.warn('Retrieval Agent: No results found', { query: state.query });
            return {
                retrievedChunks: [],
                error: 'No relevant information found in the knowledge base.'
            };
        }

        // Transform results to ChunkWithMetadata
        const retrievedChunks: ChunkWithMetadata[] = results.map(([doc, score]) => ({
            content: doc.pageContent,
            metadata: doc.metadata as EmbeddingMetadata,
            similarityScore: score,
        }));

        logger.info('Retrieval Agent: Retrieved chunks', {
            count: retrievedChunks.length,
            avgScore: retrievedChunks.reduce((sum, c) => sum + c.similarityScore, 0) / retrievedChunks.length
        });

        return { retrievedChunks };
    } catch (error) {
        logger.error('Retrieval Agent: Failed to retrieve chunks', error as Error);
        throw new RetrievalError('Failed to perform vector search');
    }
}
