import { supabaseService } from '../../services/supabase.service.js';
import { logger } from '../../utils/logger.js';
import type { AgentState, EnrichedChunk } from '../../types/database.types.js';

/**
 * Metadata Enricher Node
 * CRITICAL: Fetches complete metadata from original tables
 * This solves the n8n problem by doing explicit SQL queries
 */
export async function metadataEnricherNode(state: AgentState): Promise<Partial<AgentState>> {
    logger.info('Metadata Enricher: Enriching chunks with full metadata', {
        chunkCount: state.retrievedChunks?.length || 0
    });

    if (!state.retrievedChunks || state.retrievedChunks.length === 0) {
        logger.warn('Metadata Enricher: No chunks to enrich');
        return { enrichedChunks: [] };
    }

    const enrichedChunks: EnrichedChunk[] = [];

    for (const chunk of state.retrievedChunks) {
        try {
            const { source_id, source_type } = chunk.metadata;

            if (!source_id || !source_type) {
                logger.warn('Metadata Enricher: Missing source_id or source_type', { metadata: chunk.metadata });
                continue;
            }

            let sourceMetadata;

            // Fetch complete metadata from original table
            if (source_type === 'document') {
                sourceMetadata = await supabaseService.getDocumentMetadata(source_id);
            } else if (source_type === 'meeting') {
                sourceMetadata = await supabaseService.getMeetingMetadata(source_id);
            } else {
                logger.warn('Metadata Enricher: Unknown source type', { source_type });
                continue;
            }

            // Create excerpt (first 200 chars of content)
            const excerpt = chunk.content.length > 200
                ? chunk.content.substring(0, 200) + '...'
                : chunk.content;

            const enrichedChunk: EnrichedChunk = {
                content: chunk.content,
                excerpt,
                similarityScore: chunk.similarityScore,
                sourceType: source_type,
                sourceMetadata,
                embeddingMetadata: chunk.metadata,
            };

            enrichedChunks.push(enrichedChunk);

            logger.debug('Metadata Enricher: Enriched chunk', {
                sourceType: source_type,
                sourceId: source_id,
                score: chunk.similarityScore
            });
        } catch (error) {
            logger.error('Metadata Enricher: Failed to enrich chunk', error as Error, {
                metadata: chunk.metadata
            });
            // Continue with other chunks even if one fails
            continue;
        }
    }

    logger.info('Metadata Enricher: Enrichment complete', {
        originalCount: state.retrievedChunks.length,
        enrichedCount: enrichedChunks.length
    });

    return { enrichedChunks };
}
