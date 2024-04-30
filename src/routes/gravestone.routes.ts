import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { get, create, approve } from '../controllers/gravestone.controller';
import { errorWrap } from '../utils/error.utils';
import { verifyAdmin } from '../middleware/role.middleware';

const router = express.Router();

router.get('/getGravestones', errorWrap(get, 'Could not get gravestones'));
router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create gravestone')
);

router.post(
  '/approve',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can approve only. This user can't approve gravestone`
  ),
  errorWrap(approve, 'Could not create gravestone')
);

export default router;
