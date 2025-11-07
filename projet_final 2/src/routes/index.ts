import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import movementRoutes from './movements';
import locationRoutes from './locations';
import warehouseRoutes from './warehouses';

const router = Router();

router.use('/auth', authRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/products', productRoutes);
router.use('/movements', movementRoutes);
router.use('/', locationRoutes); 
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé',
    path: req.originalUrl,
    method: req.method
  });
});

export default router;
