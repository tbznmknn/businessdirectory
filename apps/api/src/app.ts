import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as path from 'path';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import morganMiddleware from './middlewares/loggerMiddleware';
import { AppError } from './utils/AppError';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging
  app.use(morganMiddleware);

  // Static files
  app.use('/assets', express.static(path.join(__dirname, 'assets')));

  // API routes
  app.use('/api/v1', routes);

  // Root route
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Business Directory API',
      version: '1.0.0',
      endpoints: {
        health: '/api/v1/health',
        users: '/api/v1/users',
        businessCategories: '/api/v1/business-categories',
        businesses: '/api/v1/businesses',
        businessAddresses: '/api/v1/business-addresses',
        reviews: '/api/v1/reviews',
      },
    });
  });

  // 404 handler
  app.all('*', (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
