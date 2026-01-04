import { ChatOpenAI } from '@langchain/openai';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import type { AgentState, QueryAnalysis } from '../../types/database.types.js';

/**
 * Query Analyzer Node
 * Analyzes user query to extract intent, keywords, and filters
 */
export async function queryAnalyzerNode(state: AgentState): Promise<Partial<AgentState>> {
    logger.info('Query Analyzer: Analyzing query', { query: state.query });

    try {
        const llm = new ChatOpenAI({
            openAIApiKey: config.openai.apiKey,
            modelName: config.openai.model,
            temperature: 0.1,
        });

        const analysisPrompt = `Analyze the following user query and extract:
1. Query type (factual, timeline, decision, or technical)
2. Key keywords for search
3. Any specific timeframe mentioned
4. Any specific document or meeting names mentioned

User Query: "${state.query}"

Respond in JSON format:
{
  "queryType": "factual|timeline|decision|technical",
  "keywords": ["keyword1", "keyword2"],
  "timeframe": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" } (optional),
  "specificDocument": "document name" (optional),
  "specificMeeting": "meeting name" (optional)
}`;

        const response = await llm.invoke(analysisPrompt);
        const content = response.content as string;

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // Fallback to simple analysis
            const queryAnalysis: QueryAnalysis = {
                queryType: 'factual',
                keywords: state.query.toLowerCase().split(' ').filter(w => w.length > 3),
            };

            logger.info('Query Analyzer: Using fallback analysis', { queryAnalysis });
            return { queryAnalysis };
        }

        const queryAnalysis = JSON.parse(jsonMatch[0]) as QueryAnalysis;

        // Convert timeframe strings to Date objects if present
        if (queryAnalysis.timeframe) {
            queryAnalysis.timeframe = {
                start: new Date(queryAnalysis.timeframe.start as unknown as string),
                end: new Date(queryAnalysis.timeframe.end as unknown as string),
            };
        }

        logger.info('Query Analyzer: Analysis complete', { queryAnalysis });
        return { queryAnalysis };
    } catch (error) {
        logger.error('Query Analyzer: Failed to analyze query', error as Error);

        // Fallback to basic keyword extraction
        const queryAnalysis: QueryAnalysis = {
            queryType: 'factual',
            keywords: state.query.toLowerCase().split(' ').filter(w => w.length > 3),
        };

        return { queryAnalysis };
    }
}
