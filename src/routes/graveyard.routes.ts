import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { create } from '../controllers/graveyard.controller';
import { errorWrap } from '../utils/error.utils';

const router = express.Router();

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Graveyard')
);

export default router;
