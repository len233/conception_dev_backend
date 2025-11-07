import { Request, Response } from 'express';
import { WarehouseModel } from '../models/Warehouse';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export class WarehouseController {

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const warehouses = await WarehouseModel.findAll();

      const response: ApiResponse = {
        success: true,
        data: warehouses
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

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID invalide'
        };
        res.status(400).json(response);
        return;
      }

      const warehouse = await WarehouseModel.findById(id);

      if (!warehouse) {
        const response: ApiResponse = {
          success: false,
          error: 'Entrepôt non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: warehouse
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
      const { name, location } = req.body;

      if (!name || !location) {
        const response: ApiResponse = {
          success: false,
          error: 'Le nom et l\'emplacement sont requis'
        };
        res.status(400).json(response);
        return;
      }

      const warehouse = await WarehouseModel.create({ name, location });

      const response: ApiResponse = {
        success: true,
        data: warehouse,
        message: 'Entrepôt créé avec succès'
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
      const { name, location } = req.body;

      if (isNaN(id)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID invalide'
        };
        res.status(400).json(response);
        return;
      }

      const existingWarehouse = await WarehouseModel.findById(id);
      if (!existingWarehouse) {
        const response: ApiResponse = {
          success: false,
          error: 'Entrepôt non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (location !== undefined) updateData.location = location;

      if (Object.keys(updateData).length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Aucune donnée à mettre à jour'
        };
        res.status(400).json(response);
        return;
      }

      const warehouse = await WarehouseModel.update(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: warehouse,
        message: 'Entrepôt modifié avec succès'
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
          error: 'ID invalide'
        };
        res.status(400).json(response);
        return;
      }

      const exists = await WarehouseModel.exists(id);
      if (!exists) {
        const response: ApiResponse = {
          success: false,
          error: 'Entrepôt non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const deleted = await WarehouseModel.delete(id);

      if (deleted) {
        const response: ApiResponse = {
          success: true,
          message: 'Entrepôt supprimé avec succès'
        };
        res.status(200).json(response);
      } else {
        const response: ApiResponse = {
          success: false,
          error: 'Échec de la suppression'
        };
        res.status(500).json(response);
      }
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Erreur interne du serveur'
      };

      res.status(500).json(response);
    }
  }
}
