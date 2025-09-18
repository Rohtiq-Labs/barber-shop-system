import express from 'express';
const router = express.Router();
import AppointmentController from '../controllers/appointmentController.js';
import Validation from '../middleware/validation.js';

// POST /api/appointments - Create new appointment (guest booking)
router.post('/', Validation.validateAppointmentData, AppointmentController.createAppointment);

// GET /api/appointments - Get all appointments (admin dashboard)
router.get('/', AppointmentController.getAllAppointments);

// POST /api/appointments/check-availability - Check time slot availability
router.post('/check-availability', AppointmentController.checkAvailability);

// POST /api/appointments/check-duplicate - Check for duplicate bookings
router.post('/check-duplicate', AppointmentController.checkDuplicate);

// POST /api/appointments/auto-archive - Run auto-archive process (admin)
router.post('/auto-archive', AppointmentController.runAutoArchive);

// POST /api/appointments/validate-time - Validate appointment time only
router.post('/validate-time', AppointmentController.validateTime);

// GET /api/appointments/date/:date - Get appointments by date (MUST be before /:id)
router.get('/date/:date', AppointmentController.getAppointmentsByDate);

// GET /api/appointments/barber/:barberId - Get appointments by barber
router.get('/barber/:barberId', AppointmentController.getAppointmentsByBarber);

// GET /api/appointments/:id - Get appointment by ID (MUST be last among GET routes)
router.get('/:id', AppointmentController.getAppointmentById);

// PUT /api/appointments/:id/status - Update appointment status
router.put('/:id/status', AppointmentController.updateAppointmentStatus);

// PUT /api/appointments/:id - Update entire appointment
router.put('/:id', Validation.validateAppointmentData, AppointmentController.updateAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', AppointmentController.deleteAppointment);

export default router;
