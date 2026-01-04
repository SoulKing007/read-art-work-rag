import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseService } from '../services/supabase.service.js';
import { validateQuery } from '../middleware/validation.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Search query schema
const searchQuerySchema = z.object({
    q: z.string().min(1, 'Query cannot be empty'),
    type: z.enum(['document', 'meeting']).optional(),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional(),
});

/**
 * GET /api/documents/:id
 * Get document metadata by ID
 */
router.get('/:id', async (req: Request, res: Response, next) => {
    try {
        const { id } = req.params;

        logger.info('Fetching document metadata', { id });

        const document = await supabaseService.getDocumentMetadata(id);

        res.json(document);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/search?q=query&type=document
 * Search documents
 */
router.get('/', validateQuery(searchQuerySchema), async (req: Request, res: Response, next) => {
    try {
        const { q, type, limit } = req.query as z.infer<typeof searchQuerySchema>;

        // If type is specified and not 'document', return empty
        if (type && type !== 'document') {
            return res.json([]);
        }

        logger.info('Searching documents', { query: q, limit });

        const documents = await supabaseService.searchDocuments(q, limit || 10);

        res.json(documents);
    } catch (error) {
        next(error);
    }
});

export default router;
