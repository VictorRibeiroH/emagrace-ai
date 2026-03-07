import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle custom application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Database error',
      code: 'DATABASE_ERROR',
    });
  }

  // Log unexpected errors
  // eslint-disable-next-line no-console
  console.error('Unexpected error:', err);

  // Default error response
  return res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
};
