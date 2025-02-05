import { ZodError } from "zod";

export interface ValidationErrorItem {
    field: string;
    message: string;
}

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code: string = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    public errors: ValidationErrorItem[];

    constructor(error: ZodError | string | ValidationErrorItem[]) {
        super('Validation failed', 422, 'VALIDATION_ERROR');
        
        if (error instanceof ZodError) {
            
            this.errors = error.errors.map(err => ({
                field: String(err.path[err.path.length-1]),
                message: err.message
            }));
        } else if (Array.isArray(error)) {
            this.errors = error;
        } else {
            this.errors = [{
                field: 'general',
                message: error
            }];
        }
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
} 