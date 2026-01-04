export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class SupabaseError extends AppError {
    constructor(message: string, public originalError?: unknown) {
        super(500, `Supabase Error: ${message}`);
        this.name = 'SupabaseError';
    }
}

export class LLMError extends AppError {
    constructor(message: string, public originalError?: unknown) {
        super(500, `LLM Error: ${message}`);
        this.name = 'LLMError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public validationErrors?: unknown) {
        super(400, `Validation Error: ${message}`);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(404, `${resource} not found`);
        this.name = 'NotFoundError';
    }
}

export class RetrievalError extends AppError {
    constructor(message: string) {
        super(500, `Retrieval Error: ${message}`);
        this.name = 'RetrievalError';
    }
}
