import { ChatOpenAI } from '@langchain/openai';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { LLMError } from '../../utils/errors.js';
import { SYSTEM_PROMPT, CONTEXT_PROMPT_TEMPLATE, CITATION_INSTRUCTION, NO_INFORMATION_PROMPT } from '../prompts.js';
import type { AgentState, EnrichedChunk, DocumentMetadata, MeetingMetadata } from '../../types/database.types.js';

/**
 * Response Generator Node
 * Generates answer using LLM with full context and citation instructions
 */
export async function responseGeneratorNode(state: AgentState): Promise<Partial<AgentState>> {
    logger.info('Response Generator: Generating answer');

    // Check if we have context
    if (!state.rankedContext || state.rankedContext.length === 0) {
        logger.warn('Response Generator: No context available');
        return {
            generatedAnswer: NO_INFORMATION_PROMPT,
            error: 'No relevant context found'
        };
    }

    try {
        const llm = new ChatOpenAI({
            openAIApiKey: config.openai.apiKey,
            modelName: config.openai.model,
            temperature: config.rag.llmTemperature,
        });

        // Format context with full metadata
        const formattedContext = formatContextForLLM(state.rankedContext);

        // Build prompt
        const prompt = `${SYSTEM_PROMPT}

${CONTEXT_PROMPT_TEMPLATE
                .replace('{context}', formattedContext)
                .replace('{query}', state.query)}

${CITATION_INSTRUCTION}`;

        logger.debug('Response Generator: Calling LLM', {
            contextChunks: state.rankedContext.length,
            promptLength: prompt.length
        });

        const response = await llm.invoke(prompt);
        const generatedAnswer = response.content as string;

        logger.info('Response Generator: Answer generated', {
            answerLength: generatedAnswer.length
        });

        return { generatedAnswer };
    } catch (error) {
        logger.error('Response Generator: Failed to generate answer', error as Error);
        throw new LLMError('Failed to generate response');
    }
}

/**
 * Format enriched chunks into context string for LLM
 */
function formatContextForLLM(chunks: EnrichedChunk[]): string {
    return chunks.map((chunk, index) => {
        const metadata = chunk.sourceMetadata;
        let contextBlock = `\n--- Source ${index + 1} ---\n`;

        if (chunk.sourceType === 'document') {
            const doc = metadata as DocumentMetadata;
            contextBlock += `Type: Document\n`;
            contextBlock += `Name: ${doc.document_name}\n`;
            contextBlock += `Date: ${doc.upload_date}\n`;
            contextBlock += `URL: ${doc.file_url}\n`;
            if (doc.category) contextBlock += `Category: ${doc.category}\n`;
            if (doc.uploaded_by) contextBlock += `Uploaded By: ${doc.uploaded_by}\n`;
            if (chunk.embeddingMetadata.page_number) {
                contextBlock += `Page: ${chunk.embeddingMetadata.page_number}\n`;
            }
        } else if (chunk.sourceType === 'meeting') {
            const meeting = metadata as MeetingMetadata;
            contextBlock += `Type: Meeting\n`;
            contextBlock += `Title: ${meeting.meeting_title}\n`;
            contextBlock += `Date: ${meeting.meeting_date}\n`;
            if (meeting.transcript_url) contextBlock += `URL: ${meeting.transcript_url}\n`;
            if (meeting.participants) {
                contextBlock += `Participants: ${Array.isArray(meeting.participants) ? meeting.participants.join(', ') : meeting.participants}\n`;
            }
            if (meeting.meeting_type) contextBlock += `Type: ${meeting.meeting_type}\n`;
            if (chunk.embeddingMetadata.timestamp) {
                contextBlock += `Timestamp: ${chunk.embeddingMetadata.timestamp}\n`;
            }
        }

        contextBlock += `\nContent:\n${chunk.content}\n`;
        contextBlock += `---\n`;

        return contextBlock;
    }).join('\n');
}
