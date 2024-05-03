import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { errorWrap } from '../utils/error.utils';
import { verifyAdmin, verifyCompany } from '../middleware/role.middleware';
import { create } from '../controllers/services.controller';

const router = express.Router();

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyCompany,
    `Company user can create only. This user can't create services`
  ),
  errorWrap(create, 'Could not create services')
);

export default router;
