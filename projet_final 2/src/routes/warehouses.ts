import { Router } from 'express';
import { WarehouseController } from '../controllers/WarehouseController';
import { authMiddleware } from '../middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 */

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Récupérer tous les entrepôts
 *     tags: [Warehouses]
 *     responses:
 *       200:
 *         description: Liste des entrepôts
 */
router.get('/', WarehouseController.getAll);

/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: Récupérer un entrepôt par ID
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'entrepôt
 *       404:
 *         description: Entrepôt non trouvé
 */
router.get('/:id', WarehouseController.getById);

/**
 * @swagger
 * /warehouses:
 *   post:
 *     summary: Créer un nouvel entrepôt
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Entrepôt créé avec succès
 *       401:
 *         description: Non autorisé
 */
router.post('/', authMiddleware, WarehouseController.create);

/**
 * @swagger
 * /warehouses/{id}:
 *   put:
 *     summary: Mettre à jour un entrepôt
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrepôt mis à jour avec succès
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', authMiddleware, WarehouseController.update);

/**
 * @swagger
 * /warehouses/{id}:
 *   delete:
 *     summary: Supprimer un entrepôt
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrepôt supprimé avec succès
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', authMiddleware, WarehouseController.delete);

export default router;
