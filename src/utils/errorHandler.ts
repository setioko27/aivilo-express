import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError, ValidationError,NotFoundError, UnauthorizedError } from '@/utils/error';
import logger from '@/utils/logger';

export const errorHandler: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log error
    logger.error({
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        user: req.user?.id
    });

    // Handle specific errors
    if (error instanceof ValidationError) {
        res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
            errors: error.errors
        });
        return;
    }

    if (error instanceof NotFoundError) {
        res.status(404).json({
            success: false,
            code: 'NOT_FOUND',
            message: error.message
        });
        return;
    }

    if (error instanceof UnauthorizedError) {
        res.status(401).json({
            success: false,
            code: 'UNAUTHORIZED',
            message: error.message
        });
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message
        });
        return;
    }

    // Handle Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
        res.status(400).json({
            success: false,
            code: 'DATABASE_ERROR',
            message: 'Database operation failed'
        });
        return;
    }

    // Default error
    res.status(500).json({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
    });
}; 