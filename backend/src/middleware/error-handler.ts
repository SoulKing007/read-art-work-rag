import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * Global error handling middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Log error
    logger.error('Request error', err, {
        method: req.method,
        path: req.path,
        query: req.query,
    });

    // Handle operational errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                statusCode: err.statusCode,
                ...(err instanceof Error && { name: err.name }),
            },
        });
    }

    // Handle unknown errors
    return res.status(500).json({
        error: {
            message: 'Internal server error',
            statusCode: 500,
        },
    });
}

/**
 * 404 handler
 */
export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        error: {
            message: `Route ${req.method} ${req.path} not found`,
            statusCode: 404,
        },
    });
}
