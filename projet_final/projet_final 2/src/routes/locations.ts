import { Router } from 'express';
import { LocationController } from '../controllers/LocationController';

const router = Router();

router.get('/warehouses/:id/locations', LocationController.getByWarehouse);
router.post('/warehouses/:id/locations', LocationController.create);
router.put('/warehouses/:id/locations', LocationController.update);
router.get('/locations/:binCode/exists', LocationController.checkBinExists);

export default router;
