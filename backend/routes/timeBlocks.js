import express from 'express';
const router = express.Router();
import TimeBlockController from '../controllers/timeBlockController.js';

// POST /api/time-blocks - Create new time block
router.post('/', TimeBlockController.createTimeBlock);

// GET /api/time-blocks - Get all time blocks
router.get('/', TimeBlockController.getAllTimeBlocks);

// GET /api/time-blocks/date/:date - Get time blocks for specific date
router.get('/date/:date', TimeBlockController.getTimeBlocksByDate);

// GET /api/time-blocks/range - Get time blocks within date range
router.get('/range', TimeBlockController.getTimeBlocksByRange);

// GET /api/time-blocks/check - Check if time slot is blocked
router.get('/check', TimeBlockController.checkTimeBlock);

// DELETE /api/time-blocks/:id - Delete time block
router.delete('/:id', TimeBlockController.deleteTimeBlock);

export default router;
