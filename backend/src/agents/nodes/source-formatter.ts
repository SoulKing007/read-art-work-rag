import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import type { AgentState, ChatResponse, Source, DocumentMetadata, MeetingMetadata } from '../../types/database.types.js';

/**
 * Source Formatter Node
 * Formats the final response with structured sources and metadata
 */
export async function sourceFormatterNode(state: AgentState): Promise<Partial<AgentState>> {
    logger.info('Source Formatter: Formatting response');

    if (!state.generatedAnswer) {
        logger.warn('Source Formatter: No answer to format');
        return {
            formattedResponse: {
                answer: 'Unable to generate answer',
                sources: [],
                confidence: 'low'
            }
        };
    }

    // If no context, return answer with no sources
    if (!state.rankedContext || state.rankedContext.length === 0) {
        return {
            formattedResponse: {
                answer: state.generatedAnswer,
                sources: [],
                confidence: 'low'
            }
        };
    }

    // Format sources from ranked context
    const sources: Source[] = state.rankedContext.map(chunk => {
        const metadata = chunk.sourceMetadata;

        if (chunk.sourceType === 'document') {
            const doc = metadata as DocumentMetadata;
            return {
                type: 'document' as const,
                name: doc.document_name,
                date: doc.upload_date,
                url: doc.file_url,
                excerpt: chunk.excerpt,
                metadata: {
                    uploadedBy: doc.uploaded_by,
                    category: doc.category,
                    pageNumber: chunk.embeddingMetadata.page_number,
                    fileType: doc.file_type,
                    pageCount: doc.page_count,
                },
                relevanceScore: chunk.similarityScore,
            };
        } else {
            const meeting = metadata as MeetingMetadata;
            return {
                type: 'meeting' as const,
                name: meeting.meeting_title,
                date: meeting.meeting_date,
                url: meeting.transcript_url || meeting.recording_url || '',
                excerpt: chunk.excerpt,
                metadata: {
                    participants: meeting.participants,
                    meetingType: meeting.meeting_type,
                    timestamp: chunk.embeddingMetadata.timestamp,
                    durationMinutes: meeting.duration_minutes,
                },
                relevanceScore: chunk.similarityScore,
            };
        }
    });

    // Calculate confidence based on similarity scores
    const avgScore = sources.reduce((sum, s) => sum + s.relevanceScore, 0) / sources.length;
    const confidence = calculateConfidence(avgScore, sources.length);

    const formattedResponse: ChatResponse = {
        answer: state.generatedAnswer,
        sources,
        confidence,
    };

    logger.info('Source Formatter: Formatting complete', {
        sourceCount: sources.length,
        confidence,
        avgScore
    });

    return { formattedResponse };
}

/**
 * Calculate confidence level based on average similarity score and source count
 */
function calculateConfidence(avgScore: number, sourceCount: number): 'high' | 'medium' | 'low' {
    // High confidence: good score + multiple sources
    if (avgScore >= config.rag.confidenceThresholdHigh && sourceCount >= 2) {
        return 'high';
    }

    // Medium confidence: decent score or single good source
    if (avgScore >= config.rag.confidenceThresholdMedium || sourceCount >= 3) {
        return 'medium';
    }

    // Low confidence: poor score or very few sources
    return 'low';
}
