import { Request, Response } from 'express';
import { MovementModel } from '../models/Movement';
import { ProductModel } from '../models/Product';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export class MovementController {

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const movements = await MovementModel.findAll();

      const response: ApiResponse = {
        success: true,
        data: movements
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Erreur interne du serveur'
      };

      res.status(500).json(response);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { type, quantity, product_id } = req.body;

      if (!type || !quantity || !product_id) {
        const response: ApiResponse = {
          success: false,
          error: 'Tous les champs sont obligatoires (type, quantity, product_id)'
        };
        res.status(400).json(response);
        return;
      }

      if (type !== 'IN' && type !== 'OUT') {
        const response: ApiResponse = {
          success: false,
          error: 'Le type doit être "IN" (entrée) ou "OUT" (sortie)'
        };
        res.status(400).json(response);
        return;
      }

      if (typeof quantity !== 'number' || quantity <= 0) {
        const response: ApiResponse = {
          success: false,
          error: 'La quantité doit être un nombre positif'
        };
        res.status(400).json(response);
        return;
      }

      const product = await ProductModel.findById(product_id);
      if (!product) {
        const response: ApiResponse = {
          success: false,
          error: 'Produit non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      if (type === 'OUT' && product.quantity < quantity) {
        const response: ApiResponse = {
          success: false,
          error: `Stock insuffisant. Stock actuel: ${product.quantity}, quantité demandée: ${quantity}`
        };
        res.status(400).json(response);
        return;
      }

      const movementData = {
        type: type as 'IN' | 'OUT',
        quantity: quantity,
        product_id: product_id
      };

      const movement = await MovementModel.create(movementData);

      const response: ApiResponse = {
        success: true,
        data: movement,
        message: 'Mouvement enregistré et stock mis à jour avec succès'
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Erreur interne du serveur'
      };

      res.status(500).json(response);
    }
  }
}
