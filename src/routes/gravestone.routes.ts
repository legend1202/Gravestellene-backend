import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  get,
  create,
  approve,
  update,
  deleteGravestone,
  getByGraveyardId,
  getById,
  seed
} from '../controllers/gravestone.controller';
import { errorWrap } from '../utils/error.utils';
import { verifyAdmin, verifyFellesraad } from '../middleware/role.middleware';

const router = express.Router();

router.get('/getGravestones', errorWrap(get, 'Could not get gravestones'));
router.get(
  '/getByGraveyardId/:graveyardId',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(getByGraveyardId, 'Could not get gravestones')
);
router.get(
  '/getById/:gravestoneId',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(getById, 'Could not get gravestone')
);
router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create gravestone')
);

router.put(
  '/approve',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can approve only. This user can't approve gravestone`
  ),
  errorWrap(approve, 'Could not create gravestone')
);

router.put(
  '/update',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyFellesraad,
    `Fellesraad can update only. This user can't update gravestone`
  ),
  errorWrap(update, 'Could not update gravestone')
);

router.delete(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyFellesraad,
    `Fellesraad can delete only. This user can't delete gravestone`
  ),
  errorWrap(deleteGravestone, 'Could not delete gravestone')
);

router.get(
  '/seed',
  // errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(seed, 'Could not seed graveyard')
);

export default router;
