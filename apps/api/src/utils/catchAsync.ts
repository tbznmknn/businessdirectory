import { Request, Response, NextFunction } from 'express';

/**
 * Catch async errors and pass them to Express error handler
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Type-safe version for authenticated routes
 */
export const catchAsyncAuth = <T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 