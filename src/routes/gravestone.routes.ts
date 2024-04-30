import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { get, create } from '../controllers/gravestone.controller';
import { errorWrap } from '../utils/error.utils';

const router = express.Router();

router.get('/getGravestones', errorWrap(get, 'Could not get gravestones'));
router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create gravestone')
);

export default router;
