import { StateGraph, END } from '@langchain/langgraph';
import { queryAnalyzerNode } from './nodes/query-analyzer.js';
import { retrievalAgentNode } from './nodes/retrieval-agent.js';
import { metadataEnricherNode } from './nodes/metadata-enricher.js';
import { contextRankerNode } from './nodes/context-ranker.js';
import { responseGeneratorNode } from './nodes/response-generator.js';
import { sourceFormatterNode } from './nodes/source-formatter.js';
import { logger } from '../utils/logger.js';
import type { AgentState } from '../types/database.types.js';

/**
 * LangGraph Workflow for RAG System
 * 
 * Flow:
 * START → Query Analyzer → Retrieval Agent → Metadata Enricher → 
 * Context Ranker → Response Generator → Source Formatter → END
 */

// Define the graph
const workflow = new StateGraph<AgentState>({
    channels: {
        query: null,
        queryAnalysis: null,
        retrievedChunks: null,
        enrichedChunks: null,
        rankedContext: null,
        generatedAnswer: null,
        formattedResponse: null,
        error: null,
    }
});

// Add nodes
workflow.addNode('queryAnalyzer', queryAnalyzerNode);
workflow.addNode('retrievalAgent', retrievalAgentNode);
workflow.addNode('metadataEnricher', metadataEnricherNode);
workflow.addNode('contextRanker', contextRankerNode);
workflow.addNode('responseGenerator', responseGeneratorNode);
workflow.addNode('sourceFormatter', sourceFormatterNode);

// Define edges (workflow sequence)
workflow.setEntryPoint('queryAnalyzer');
workflow.addEdge('queryAnalyzer', 'retrievalAgent');
workflow.addEdge('retrievalAgent', 'metadataEnricher');
workflow.addEdge('metadataEnricher', 'contextRanker');
workflow.addEdge('contextRanker', 'responseGenerator');
workflow.addEdge('responseGenerator', 'sourceFormatter');
workflow.addEdge('sourceFormatter', END);

// Compile the graph
export const ragGraph = workflow.compile();

/**
 * Execute the RAG workflow
 */
export async function executeRAGWorkflow(query: string): Promise<AgentState> {
    logger.info('RAG Workflow: Starting execution', { query });

    const initialState: AgentState = {
        query,
    };

    try {
        const result = await ragGraph.invoke(initialState);

        logger.info('RAG Workflow: Execution complete', {
            hasAnswer: !!result.formattedResponse?.answer,
            sourceCount: result.formattedResponse?.sources?.length || 0,
            confidence: result.formattedResponse?.confidence
        });

        return result;
    } catch (error) {
        logger.error('RAG Workflow: Execution failed', error as Error);
        throw error;
    }
}
