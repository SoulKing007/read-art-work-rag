import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { executeRAGWorkflow } from '../agents/graph.js';
import { validateBody } from '../middleware/validation.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Request schema
const chatQuerySchema = z.object({
    query: z.string().min(1, 'Query cannot be empty'),
    conversationId: z.string().optional(),
    filters: z.object({
        dateRange: z.object({
            start: z.string(),
            end: z.string(),
        }).optional(),
        documentTypes: z.array(z.string()).optional(),
        meetingTypes: z.array(z.string()).optional(),
    }).optional(),
});

/**
 * POST /api/chat/query
 * Main chat endpoint - executes RAG workflow
 */
router.post('/query', validateBody(chatQuerySchema), async (req: Request, res: Response, next) => {
    try {
        const { query, conversationId } = req.body;

        logger.info('Chat query received', { query, conversationId });

        // Execute RAG workflow
        const result = await executeRAGWorkflow(query);

        // Return formatted response
        res.json({
            answer: result.formattedResponse?.answer || 'Unable to generate answer',
            sources: result.formattedResponse?.sources || [],
            confidence: result.formattedResponse?.confidence || 'low',
            conversationId: conversationId || `conv_${Date.now()}`,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
