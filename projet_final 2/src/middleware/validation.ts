import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const handleValidationError = (error: Joi.ValidationError, res: Response) => {
  const errorMessage = error.details.map(detail => detail.message).join(', ');
  res.status(400).json({
    success: false,
    error: 'Données invalides',
    details: errorMessage
  });
};

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Le nom d\'utilisateur doit contenir uniquement des caractères alphanumériques',
      'string.min': 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
      'string.max': 'Le nom d\'utilisateur ne doit pas dépasser 30 caractères',
      'any.required': 'Le nom d\'utilisateur est requis'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis'
    }),
  role: Joi.string()
    .valid('user', 'admin')
    .default('user')
    .messages({
      'any.only': 'Le rôle doit être "user" ou "admin"'
    })
});

const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Le nom d\'utilisateur est requis'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Le mot de passe est requis'
    })
});

const productSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Le nom du produit ne peut pas être vide',
      'string.max': 'Le nom du produit ne doit pas dépasser 100 caractères',
      'any.required': 'Le nom du produit est requis'
    }),
  reference: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'La référence ne peut pas être vide',
      'string.max': 'La référence ne doit pas dépasser 50 caractères',
      'any.required': 'La référence est requise'
    }),
  quantity: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.integer': 'La quantité doit être un nombre entier',
      'number.min': 'La quantité ne peut pas être négative'
    }),
  warehouse_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'L\'ID de l\'entrepôt doit être un nombre entier',
      'number.positive': 'L\'ID de l\'entrepôt doit être positif',
      'any.required': 'L\'ID de l\'entrepôt est requis'
    })
});

const movementSchema = Joi.object({
  product_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'L\'ID du produit doit être un nombre entier',
      'number.positive': 'L\'ID du produit doit être positif',
      'any.required': 'L\'ID du produit est requis'
    }),
  type: Joi.string()
    .valid('IN', 'OUT')
    .required()
    .messages({
      'any.only': 'Le type doit être "IN" ou "OUT"',
      'any.required': 'Le type de mouvement est requis'
    }),
  quantity: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'La quantité doit être un nombre entier',
      'number.positive': 'La quantité doit être positive',
      'any.required': 'La quantité est requise'
    }),
  reason: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'La raison ne doit pas dépasser 255 caractères'
    })
});

// Middlewares de validation
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    handleValidationError(error, res);
    return;
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    handleValidationError(error, res);
    return;
  }
  next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    handleValidationError(error, res);
    return;
  }
  next();
};

export const validateMovement = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = movementSchema.validate(req.body);
  if (error) {
    handleValidationError(error, res);
    return;
  }
  next();
};
