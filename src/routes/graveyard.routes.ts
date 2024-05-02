import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  create,
  approve,
  update,
  deleteGraveyard,
  getByToken,
} from '../controllers/graveyard.controller';
import { errorWrap } from '../utils/error.utils';
import { verifyAdmin, verifyFellesraad } from '../middleware/role.middleware';

const router = express.Router();

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyFellesraad,
    `Fellesraad can create only. This user can't create graveyard`
  ),
  errorWrap(create, 'Could not create Graveyard')
);

router.put(
  '/approve',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can approve only. This user can't approve graveyard`
  ),
  errorWrap(approve, 'Could not approve gravestone')
);

router.put(
  '/update',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyFellesraad,
    `Fellesraad can update only. This user can't update graveyard`
  ),
  errorWrap(update, 'Could not update graveyard')
);

router.delete(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyFellesraad,
    `Fellesraad can delete only. This user can't delete graveyard`
  ),
  errorWrap(deleteGraveyard, 'Could not delete graveyard')
);

router.get(
  '/getByToken',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(getByToken, 'Could not get graveyards')
);

export default router;
