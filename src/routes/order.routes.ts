import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { errorWrap } from '../utils/error.utils';
import { create } from '../controllers/order.controller';

const router = express.Router();

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Order')
);

export default router;
