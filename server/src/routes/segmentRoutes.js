import express from 'express';
import { getSegments, getSegmentByCode } from '../controllers/segmentController.js';

const router = express.Router();

router.get('/', getSegments);
router.get('/:segment', getSegmentByCode);

export default router;
