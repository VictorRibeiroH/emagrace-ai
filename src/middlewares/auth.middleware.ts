import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { UnauthorizedError } from '../utils/errors';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Attach user ID to request
    req.userId = user.id;

    next();
  } catch (error) {
    next(error);
  }
};
