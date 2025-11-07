import { Router } from 'express';
import { LocationController } from '../controllers/LocationController';
import { authMiddleware } from '../middleware';

const router = Router();

/**
 * @swagger
 * /warehouses/{id}/locations:
 *   get:
 *     summary: Récupérer les emplacements d'un entrepôt
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des emplacements
 */
router.get('/warehouses/:id/locations', LocationController.getByWarehouse);

/**
 * @swagger
 * /warehouses/{id}/locations:
 *   post:
 *     summary: Créer un emplacement dans un entrepôt
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Emplacement créé avec succès
 *       401:
 *         description: Non autorisé
 */
router.post('/warehouses/:id/locations', authMiddleware, LocationController.create);

/**
 * @swagger
 * /warehouses/{id}/locations:
 *   put:
 *     summary: Mettre à jour un emplacement
 *     tags: [Locations]
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
 *         description: Emplacement mis à jour avec succès
 *       401:
 *         description: Non autorisé
 */
router.put('/warehouses/:id/locations', authMiddleware, LocationController.update);

/**
 * @swagger
 * /locations/{binCode}/exists:
 *   get:
 *     summary: Vérifier si un bac existe
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: binCode
 *         required: true
 *         schema:
 *           type: string
 *         example: "A1-R1-L2-B03"
 *     responses:
 *       200:
 *         description: Résultat de la vérification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                 binCode:
 *                   type: string
 */
router.get('/locations/:binCode/exists', LocationController.checkBinExists);

export default router;
