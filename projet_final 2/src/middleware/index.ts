import { Request, Response, NextFunction } from 'express';

export * from './auth';
export * from './validation';
export * from './security';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erreur capturée par le middleware:', err);

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Données de requête invalides',
      details: err.message
    });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'JSON invalide dans la requête'
    });
    return;
  }

  if (err.name === 'PostgresError' || (err as any).code) {
    const pgError = err as any;
    
    if (pgError.code === '23505') {
      res.status(409).json({
        success: false,
        error: 'Violation de contrainte unique',
        details: 'Une entrée avec ces données existe déjà'
      });
      return;
    }

    if (pgError.code === '23503') {
      res.status(400).json({
        success: false,
        error: 'Référence invalide',
        details: 'L\'élément référencé n\'existe pas'
      });
      return;
    }
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    res.status(500).json({
      success: false,
      error: 'Erreur de base de données MongoDB'
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
};

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent') || 'Unknown',
      ip: req.ip || req.connection.remoteAddress
    };
    
    console.log(JSON.stringify(logData));
  });

  next();
};

export const validateJsonContent = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      res.status(400).json({
        success: false,
        error: 'Content-Type doit être application/json'
      });
      return;
    }
  }

  next();
};


