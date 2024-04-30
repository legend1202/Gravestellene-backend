import express from 'express';
import multer from '../services/multer.services';
import verifyToken from '../middleware/auth.middleware';

import { errorWrap } from '../utils/error.utils';
import { uploadImage } from '../controllers/upload.controller';

const router = express.Router();

router.post(
  '/images',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  multer.array('images'),
  errorWrap(uploadImage, 'Could not upload images')
);

export default router;
