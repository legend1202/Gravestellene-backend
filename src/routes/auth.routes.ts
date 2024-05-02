import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { assignRole, create, login } from '../controllers/auth.controller';
import { errorWrap } from '../utils/error.utils';
import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.post('/register', errorWrap(create, 'Could not create user'));
router.post(
  '/login',
  withTransaction(errorWrap(login, 'Could not login user'))
);

router.put(
  '/assign-role',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(assignRole, 'Could not assign user role'))
);

export default router;
