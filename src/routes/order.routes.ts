import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { errorWrap } from '../utils/error.utils';
import { approve, create, get } from '../controllers/order.controller';
import { verifyAdmin } from '../middleware/role.middleware';

const router = express.Router();

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Order')
);

router.put(
  '/approve',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can approve only. This user can't approve order`
  ),
  errorWrap(approve, 'Could not approve order')
);

router.get('/get', errorWrap(get, 'Could not get orders'));

export default router;
