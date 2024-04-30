import express from 'express';
import { create } from '../controllers/graveyard.controller';
import { errorWrap } from '../utils/error.utils';
import verifyToken from '../middleware/auth.middleware';

const router = express.Router();

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Graveyard')
);

export default router;
