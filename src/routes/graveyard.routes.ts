import express from 'express';
import { create } from '../controllers/graveyard.controller';
import { errorWrap } from '../utils/error.utils';

const router = express.Router();

router.get('/create', errorWrap(create, 'Could not create Graveyard'));

export default router;
