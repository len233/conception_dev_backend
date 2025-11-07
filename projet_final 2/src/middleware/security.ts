import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export const globalRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    error: 'Trop de requêtes de cette IP, veuillez réessayer dans 1 minute.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

export const authRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 1 minute.'
  },
  skipSuccessfulRequests: true,
});