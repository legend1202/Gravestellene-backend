import express from 'express';
import { get } from '../controllers/gravestone.controller';
import { errorWrap } from '../utils/error.utils';

const router = express.Router();

router.get('/:gravestoneName', errorWrap(get, 'Could not get gravestones'));
router.get('/create', errorWrap(get, 'Could not get gravestones'));

export default router;
