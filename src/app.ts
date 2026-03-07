import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './utils/errorHandler';

// Import routes
import userRoutes from './modules/users/users.routes';
import bodyMetricRoutes from './modules/body-metrics/body-metrics.routes';
import progressPhotoRoutes from './modules/progress-photos/progress-photos.routes';
import dietRoutes from './modules/diets/diets.routes';
import mealRoutes from './modules/meals/meals.routes';
import goalRoutes from './modules/goals/goals.routes';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.cors.origin,
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  });

  // API routes
  app.use('/api', userRoutes);
  app.use('/api', bodyMetricRoutes);
  app.use('/api', progressPhotoRoutes);
  app.use('/api', dietRoutes);
  app.use('/api', mealRoutes);
  app.use('/api', goalRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Route not found',
      code: 'NOT_FOUND',
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};
