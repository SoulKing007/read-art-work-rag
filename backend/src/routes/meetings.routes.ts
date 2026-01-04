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
 * GET /api/meetings/:id
 * Get meeting metadata by ID
 */
router.get('/:id', async (req: Request, res: Response, next) => {
    try {
        const { id } = req.params;

        logger.info('Fetching meeting metadata', { id });

        const meeting = await supabaseService.getMeetingMetadata(id);

        res.json(meeting);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/search?q=query&type=meeting
 * Search meetings
 */
router.get('/', validateQuery(searchQuerySchema), async (req: Request, res: Response, next) => {
    try {
        const { q, type, limit } = req.query as z.infer<typeof searchQuerySchema>;

        // If type is specified and not 'meeting', return empty
        if (type && type !== 'meeting') {
            return res.json([]);
        }

        logger.info('Searching meetings', { query: q, limit });

        const meetings = await supabaseService.searchMeetings(q, limit || 10);

        res.json(meetings);
    } catch (error) {
        next(error);
    }
});

export default router;
