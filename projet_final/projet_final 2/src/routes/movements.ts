import { Router } from 'express';
import { MovementController } from '../controllers/MovementController';

const router = Router();

router.get('/', MovementController.getAll);
router.post('/', MovementController.create);

export default router;
