import { Request, Response } from 'express';
import { LocationModel } from '../models/Location';
import { WarehouseModel } from '../models/Warehouse';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export class LocationController {

  static async getByWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const warehouseId = parseInt(req.params.id);
      
      if (isNaN(warehouseId)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID d\'entrepôt invalide'
        };
        res.status(400).json(response);
        return;
      }

      const warehouseExists = await WarehouseModel.exists(warehouseId);
      if (!warehouseExists) {
        const response: ApiResponse = {
          success: false,
          error: 'Entrepôt non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const location = await LocationModel.findByWarehouseId(warehouseId);
      
      if (!location) {
        const response: ApiResponse = {
          success: false,
          error: 'Structure d\'entrepôt non trouvée'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: location
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
      const warehouseId = parseInt(req.params.id);
      
      if (isNaN(warehouseId)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID d\'entrepôt invalide'
        };
        res.status(400).json(response);
        return;
      }

      const warehouse = await WarehouseModel.findById(warehouseId);
      if (!warehouse) {
        const response: ApiResponse = {
          success: false,
          error: 'Entrepôt non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const existingLocation = await LocationModel.findByWarehouseId(warehouseId);
      if (existingLocation) {
        const response: ApiResponse = {
          success: false,
          error: 'Une structure existe déjà pour cet entrepôt'
        };
        res.status(409).json(response);
        return;
      }

      const { layout, code, metadata } = req.body;

      let locationData;
      if (!layout || layout.length === 0) {
        locationData = await LocationModel.createSampleStructure(warehouseId);
      } else {
        if (!Array.isArray(layout)) {
          const response: ApiResponse = {
            success: false,
            error: 'Le layout doit être un tableau'
          };
          res.status(400).json(response);
          return;
        }

        locationData = {
          warehouse_id: warehouseId,
          code: code || `WH${warehouseId}-001`,
          layout,
          metadata: metadata || { tempControlled: false }
        };
      }

      const location = typeof locationData === 'object' && 'warehouse_id' in locationData 
        ? await LocationModel.create(locationData)
        : locationData;

      const response: ApiResponse = {
        success: true,
        data: location,
        message: 'Structure d\'entrepôt créée avec succès'
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
      const warehouseId = parseInt(req.params.id);
      
      if (isNaN(warehouseId)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID d\'entrepôt invalide'
        };
        res.status(400).json(response);
        return;
      }

      const warehouseExists = await WarehouseModel.exists(warehouseId);
      if (!warehouseExists) {
        const response: ApiResponse = {
          success: false,
          error: 'Entrepôt non trouvé'
        };
        res.status(404).json(response);
        return;
      }

      const existingLocation = await LocationModel.findByWarehouseId(warehouseId);
      if (!existingLocation) {
        const response: ApiResponse = {
          success: false,
          error: 'Aucune structure trouvée pour cet entrepôt. Utilisez POST pour en créer une.'
        };
        res.status(404).json(response);
        return;
      }

      const { layout, code, metadata } = req.body;
      const updateData: any = {};

      if (layout !== undefined) {
        if (!Array.isArray(layout)) {
          const response: ApiResponse = {
            success: false,
            error: 'Le layout doit être un tableau'
          };
          res.status(400).json(response);
          return;
        }
        updateData.layout = layout;
      }

      if (code !== undefined) {
        updateData.code = code;
      }

      if (metadata !== undefined) {
        updateData.metadata = metadata;
      }

      if (Object.keys(updateData).length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Aucune donnée à mettre à jour'
        };
        res.status(400).json(response);
        return;
      }

      const location = await LocationModel.update(warehouseId, updateData);

      if (!location) {
        const response: ApiResponse = {
          success: false,
          error: 'Échec de la mise à jour'
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: location,
        message: 'Structure d\'entrepôt mise à jour avec succès'
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

  static async checkBinExists(req: Request, res: Response): Promise<void> {
    try {
      const binCode = req.params.binCode;
      const warehouseId = parseInt(req.query.warehouse_id as string);
      
      if (!binCode) {
        const response: ApiResponse = {
          success: false,
          error: 'Code de bac requis'
        };
        res.status(400).json(response);
        return;
      }

      if (isNaN(warehouseId)) {
        const response: ApiResponse = {
          success: false,
          error: 'ID d\'entrepôt requis et valide'
        };
        res.status(400).json(response);
        return;
      }

      const exists = await LocationModel.binExists(binCode);

      const response: ApiResponse = {
        success: true,
        data: {
          exists,
          bin_code: binCode,
          warehouse_id: warehouseId
        },
        message: exists ? 'Le bac existe' : 'Le bac n\'existe pas'
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
