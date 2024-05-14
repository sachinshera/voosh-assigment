import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { HttpException } from './../exceptions/HttpException';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const timestamp: Date = error.timestamp || new Date();

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message , timestamp});
  } catch (error) {
    next(error);
  }
};
