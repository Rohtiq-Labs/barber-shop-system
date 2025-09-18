import express from 'express';
const router = express.Router();
import BarberController from '../controllers/barberController.js';
import { handleUploadError } from '../middleware/upload.js';
import { uploadBarberImage } from '../middleware/upload.js';

// GET /api/barbers - Get all barbers
router.get('/', BarberController.getAllBarbers);

// POST /api/barbers - Create new barber (admin)
router.post('/', uploadBarberImage, handleUploadError, BarberController.createBarber);

// GET /api/barbers/available/:date - Get available barbers for specific date
router.get('/available/:date', BarberController.getAvailableBarbers);

// GET /api/barbers/:id - Get barber by ID
router.get('/:id', BarberController.getBarberById);

// PUT /api/barbers/:id - Update barber profile (admin)
router.put('/:id', uploadBarberImage, handleUploadError, BarberController.updateBarberProfile);

// DELETE /api/barbers/:id - Delete barber (admin)
router.delete('/:id', BarberController.deleteBarber);

// GET /api/barbers/:id/schedule/:date - Get barber's schedule for specific date
router.get('/:id/schedule/:date', BarberController.getBarberSchedule);

// GET /api/barbers/:id/stats - Get barber statistics
router.get('/:id/stats', BarberController.getBarberStats);

// GET /api/barbers/:id/working-hours - Get barber's working hours
router.get('/:id/working-hours', BarberController.getWorkingHours);

// PUT /api/barbers/:id/availability - Update barber availability (admin)
router.put('/:id/availability', BarberController.updateAvailability);

export default router;
