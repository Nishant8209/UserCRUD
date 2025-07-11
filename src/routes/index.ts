import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// Define user Routes
router.use('/users', userRoutes);

export default router; 