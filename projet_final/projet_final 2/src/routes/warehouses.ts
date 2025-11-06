import { Router } from 'express';
import { WarehouseController } from '../controllers/WarehouseController';

const router = Router();

router.get('/', WarehouseController.getAll);
router.get('/:id', WarehouseController.getById);
router.post('/', WarehouseController.create);
router.put('/:id', WarehouseController.update);
router.delete('/:id', WarehouseController.delete);

export default router;
