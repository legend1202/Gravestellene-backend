import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { create, approve } from '../controllers/graveyard.controller';
import { errorWrap } from '../utils/error.utils';
import { verifyAdmin } from '../middleware/role.middleware';

const router = express.Router();

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Graveyard')
);

router.post(
  '/approve',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can approve only. This user can't approve graveyard`
  ),
  errorWrap(approve, 'Could not create gravestone')
);

export default router;
