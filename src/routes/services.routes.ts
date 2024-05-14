import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { errorWrap } from '../utils/error.utils';
import { verifyAdmin, verifyCompany } from '../middleware/role.middleware';
import {
  create,
  update,
  deleteServices,
  setApprove,
  removeApprove,
} from '../controllers/services.controller';

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

router.put(
  '/update',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(update, 'Could not update services')
);

router.put(
  '/setApprove',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(setApprove, 'Could not approve the service')
);

router.put(
  '/removeApprove',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(removeApprove, 'Could not deactive approve the service')
);

router.delete(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyCompany,
    `Company user can delete only. This user can't delete service`
  ),
  errorWrap(deleteServices, 'Could not delete the service')
);

export default router;
