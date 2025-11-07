import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware, isAdmin, validateProduct } from '../middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         reference:
 *           type: string
 *         quantity:
 *           type: integer
 *         warehouse_id:
 *           type: integer
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - reference
 *         - warehouse_id
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         reference:
 *           type: string
 *           maxLength: 50
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         warehouse_id:
 *           type: integer
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', ProductController.getAll);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       401:
 *         description: Non autorisé
 */
router.post('/', authMiddleware, validateProduct, ProductController.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Mettre à jour un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Produit non trouvé
 */
router.put('/:id', authMiddleware, validateProduct, ProductController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprimer un produit (Admin uniquement)
 *     tags: [Products]
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
 *         description: Produit supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Privilèges administrateur requis
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/:id', authMiddleware, isAdmin, ProductController.delete);

export default router;
