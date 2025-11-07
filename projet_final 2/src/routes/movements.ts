import { Router } from 'express';
import { MovementController } from '../controllers/MovementController';
import { authMiddleware, validateMovement } from '../middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [IN, OUT]
 *         quantity:
 *           type: integer
 *         reason:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     MovementInput:
 *       type: object
 *       required:
 *         - product_id
 *         - type
 *         - quantity
 *       properties:
 *         product_id:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [IN, OUT]
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         reason:
 *           type: string
 *           maxLength: 255
 */

/**
 * @swagger
 * /movements:
 *   get:
 *     summary: Récupérer tous les mouvements de stock
 *     tags: [Movements]
 *     responses:
 *       200:
 *         description: Liste des mouvements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movement'
 */
router.get('/', MovementController.getAll);

/**
 * @swagger
 * /movements:
 *   post:
 *     summary: Créer un nouveau mouvement de stock
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovementInput'
 *     responses:
 *       201:
 *         description: Mouvement créé avec succès
 *       401:
 *         description: Non autorisé
 */
router.post('/', authMiddleware, validateMovement, MovementController.create);

export default router;
