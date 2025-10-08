import { Router } from 'express';
import userRoutes from './user.route';
import businessParentCategoryRoutes from './business-parent-category.route';
import businessCategoryRoutes from './business-category.route';
import businessRoutes from './business.route';
import businessAddressRoutes from './business-address.route';
import reviewRoutes from './review.route';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
router.use('/users', userRoutes);
router.use('/business-parent-categories', businessParentCategoryRoutes);
router.use('/business-categories', businessCategoryRoutes);
router.use('/businesses', businessRoutes);
router.use('/business-addresses', businessAddressRoutes);
router.use('/reviews', reviewRoutes);

export default router;
