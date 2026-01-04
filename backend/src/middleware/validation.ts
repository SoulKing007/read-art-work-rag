import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * Validate request body against Zod schema
 */
export function validateBody(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                logger.warn('Request validation failed', { errors: error.errors });
                next(new ValidationError('Invalid request body', error.errors));
            } else {
                next(error);
            }
        }
    };
}

/**
 * Validate query parameters against Zod schema
 */
export function validateQuery(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                logger.warn('Query validation failed', { errors: error.errors });
                next(new ValidationError('Invalid query parameters', error.errors));
            } else {
                next(error);
            }
        }
    };
}
