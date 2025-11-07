import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';
import { WarehouseModel } from '../models/Warehouse';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export class ProductController {

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductModel.findAll();

      const response: ApiResponse = {
        success: true,
        data: products
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
      const { name, reference, quantity, warehouse_id } = req.body;

      if (!name || !reference || quantity === undefined || !warehouse_id) {
        const response: ApiResponse = {
          success: false,
          error: 'Tous les champs sont obligatoires (name, reference, quantity, warehouse_id)'
        };
        res.status(400).json(response);
        return;
      }

      if (typeof quantity !== 'number' || quantity < 0) {
        const response: ApiResponse = {
          success: false,
          error: 'La quantité doit être un nombre positif'
        };
        res.status(400).json(response);
        return;
      }

      const warehouseExists = await WarehouseModel.exists(warehouse_id);
      if (!warehouseExists) {
        const response: ApiResponse = {
          success: false,
          error: 'Entrepôt non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const productData = {
        name: name.trim(),
        reference: reference.trim(),
        quantity: quantity,
        warehouse_id: parseInt(warehouse_id)
      };

      const product = await ProductModel.create(productData);

      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Produit créé avec succès'
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

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID de produit invalide'
        };
        res.status(400).json(response);
        return;
      }

      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        const response: ApiResponse = {
          success: false,
          error: 'Produit non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const { name, reference, quantity, warehouse_id } = req.body;
      const updateData: any = {};

      if (name !== undefined) {
        updateData.name = name.trim();
      }

      if (reference !== undefined) {
        updateData.reference = reference.trim();
      }

      if (quantity !== undefined) {
        if (typeof quantity !== 'number' || quantity < 0) {
          const response: ApiResponse = {
            success: false,
            error: 'La quantité doit être un nombre positif'
          };
          res.status(400).json(response);
          return;
        }
        updateData.quantity = quantity;
      }

      if (warehouse_id !== undefined) {
        const warehouseExists = await WarehouseModel.exists(warehouse_id);
        if (!warehouseExists) {
          const response: ApiResponse = {
            success: false,
            error: 'Entrepôt non trouvé'
          };
          res.status(404).json(response);
          return;
        }
        updateData.warehouse_id = parseInt(warehouse_id);
      }

      if (Object.keys(updateData).length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Aucune donnée à mettre à jour'
        };
        res.status(400).json(response);
        return;
      }

      const product = await ProductModel.update(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Produit mis à jour avec succès'
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

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID de produit invalide'
        };
        res.status(400).json(response);
        return;
      }

      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        const response: ApiResponse = {
          success: false,
          error: 'Produit non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const success = await ProductModel.delete(id);
      
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'Erreur lors de la suppression du produit'
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Produit supprimé avec succès'
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
}
