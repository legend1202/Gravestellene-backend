import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { create, approve, update } from '../controllers/graveyard.controller';
import { errorWrap } from '../utils/error.utils';
import { verifyAdmin, verifyFellesraad } from '../middleware/role.middleware';

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
  errorWrap(approve, 'Could not approve gravestone')
);

router.post(
  '/update',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyFellesraad,
    `Fellesraad can update only. This user can't update graveyard`
  ),
  errorWrap(update, 'Could not update gravestone')
);

export default router;
