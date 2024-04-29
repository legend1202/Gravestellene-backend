import express from 'express';
import authRoutes from './auth.routes';
import gravestoneRoutes from './gravestone.routes';
import graveyardRoutes from './graveyard.routes';

import { sendResponse } from '../utils/response.utils';

const router = express.Router();

router.get('/', (req, res) => sendResponse(res, 200, `API is running`));
router.use('/api/auth', authRoutes);
router.use('/api/gravestone', gravestoneRoutes);
router.use('/api/graveyard', graveyardRoutes);

export default router;
