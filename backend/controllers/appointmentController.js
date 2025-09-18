

import Appointment from '../models/Appointment.js';

class AppointmentController {
  // POST /api/appointments - Create new appointment (guest booking)
  static async createAppointment(req, res) {
    try {
      console.log('📝 Creating appointment with data:', req.body);
      
      const {
        customer_name,
        customer_email,
        customer_phone,
        barber_id,
        appointment_date,
        appointment_time,
        services, // Array of service IDs
        notes,
        tip_percentage,
        tip_amount,
        payment_method,
        total_amount
      } = req.body;

      // Basic validation
      if (!customer_name || !customer_email || !customer_phone || !barber_id || !appointment_date || !appointment_time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: customer_name, customer_email, customer_phone, barber_id, appointment_date, appointment_time'
        });
      }

      if (!services || services.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one service must be selected'
        });
      }

      // Time validation logic
      const timeValidation = AppointmentController.validateAppointmentTime(appointment_date, appointment_time);
      if (!timeValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: timeValidation.message,
          suggestion: timeValidation.suggestion || null
        });
      }

      // Check for duplicate bookings
      const duplicateCheck = await Appointment.checkDuplicateBooking(customer_phone, customer_email, appointment_date);
      if (duplicateCheck.isDuplicate) {
        if (duplicateCheck.type === 'same_date') {
          // Strict block for same date
          return res.status(409).json({
            success: false,
            message: duplicateCheck.message,
            type: 'duplicate_same_date',
            existingAppointment: {
              date: duplicateCheck.existingAppointment.appointment_date,
              time: duplicateCheck.existingAppointment.appointment_time,
              barber: duplicateCheck.existingAppointment.barber_name,
              status: duplicateCheck.existingAppointment.status
            }
          });
        } else if (duplicateCheck.type === 'recent_booking') {
          // Warning for recent booking - allow override
          return res.status(409).json({
            success: false,
            message: duplicateCheck.message,
            type: 'duplicate_recent',
            existingAppointment: {
              date: duplicateCheck.existingAppointment.appointment_date,
              time: duplicateCheck.existingAppointment.appointment_time,
              barber: duplicateCheck.existingAppointment.barber_name,
              status: duplicateCheck.existingAppointment.status
            },
            allowOverride: true
          });
        }
      }

      // Check availability first
      const isAvailable = await Appointment.checkAvailability(barber_id, appointment_date, appointment_time);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: 'Time slot is not available'
        });
      }

      // Create appointment
      const appointmentData = {
        customer_name,
        customer_email,
        customer_phone,
        barber_id,
        appointment_date,
        appointment_time,
        notes,
        tip_percentage: tip_percentage || 0,
        tip_amount: tip_amount || 0,
        payment_method: payment_method || 'Pay at Venue',
        total_amount: total_amount || 0
      };

      const appointmentId = await Appointment.create(appointmentData, services);

      // Simple success response - avoid potential data access issues
      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: {
          appointment_id: appointmentId,
          customer_name: appointmentData.customer_name,
          appointment_date: appointmentData.appointment_date,
          appointment_time: appointmentData.appointment_time
        }
      });

    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create appointment',
        error: error.message
      });
    }
  }

  // GET /api/appointments/:id - Get appointment by ID
  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.getById(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.json({
        success: true,
        message: 'Appointment fetched successfully',
        data: appointment
      });

    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointment',
        error: error.message
      });
    }
  }

  // GET /api/appointments/barber/:barberId - Get appointments by barber
  static async getAppointmentsByBarber(req, res) {
    try {
      const { barberId } = req.params;
      const { date } = req.query; // Optional date filter

      const appointments = await Appointment.getByBarberId(barberId, date);

      res.json({
        success: true,
        message: `Appointments for barber ${barberId} fetched successfully`,
        data: appointments
      });

    } catch (error) {
      console.error('Error fetching appointments by barber:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments',
        error: error.message
      });
    }
  }

  // GET /api/appointments - Get all appointments (admin)
  static async getAllAppointments(req, res) {
    try {
      const { limit = 50, offset = 0, start_date, end_date } = req.query;

      let appointments;
      
      if (start_date && end_date) {
        appointments = await Appointment.getByDateRange(start_date, end_date);
      } else {
        appointments = await Appointment.getAll(parseInt(limit), parseInt(offset));
      }

      res.json({
        success: true,
        message: 'Appointments fetched successfully',
        data: appointments
      });

    } catch (error) {
      console.error('Error fetching all appointments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments',
        error: error.message
      });
    }
  }

  // GET /api/appointments/date/:date - Get appointments for specific date
  static async getAppointmentsByDate(req, res) {
    try {
      const { date } = req.params;
      const { barber_id } = req.query; // Optional barber filter

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!date || !dateRegex.test(date)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      let appointments;
      if (barber_id) {
        appointments = await Appointment.getByBarberId(barber_id, date);
      } else {
        appointments = await Appointment.getByDateRange(date, date);
      }

      res.json({
        success: true,
        message: `Appointments for ${date} fetched successfully`,
        data: appointments
      });
    } catch (error) {
      console.error('AppointmentController.getAppointmentsByDate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments for date'
      });
    }
  }

  // PUT /api/appointments/:id/status - Update appointment status
  static async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: pending, confirmed, completed, cancelled'
        });
      }

      const updated = await Appointment.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.json({
        success: true,
        message: 'Appointment status updated successfully',
        data: { id, status }
      });

    } catch (error) {
      console.error('Error updating appointment status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update appointment status',
        error: error.message
      });
    }
  }

  // POST /api/appointments/check-availability - Check time slot availability
  static async checkAvailability(req, res) {
    try {
      const { barber_id, appointment_date, appointment_time } = req.body;

      if (!barber_id || !appointment_date || !appointment_time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: barber_id, appointment_date, appointment_time'
        });
      }

      const isAvailable = await Appointment.checkAvailability(barber_id, appointment_date, appointment_time);

      res.json({
        success: true,
        message: 'Availability checked successfully',
        data: {
          available: isAvailable,
          barber_id,
          appointment_date,
          appointment_time
        }
      });

    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check availability',
        error: error.message
      });
    }
  }

  // POST /api/appointments/check-duplicate - Check for duplicate bookings
  static async checkDuplicate(req, res) {
    try {
      const { customer_phone, customer_email, appointment_date } = req.body;

      if (!customer_phone || !customer_email || !appointment_date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: customer_phone, customer_email, appointment_date'
        });
      }

      const duplicateCheck = await Appointment.checkDuplicateBooking(customer_phone, customer_email, appointment_date);

      res.json({
        success: true,
        message: 'Duplicate check completed',
        data: duplicateCheck
      });

    } catch (error) {
      console.error('Error checking duplicates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check duplicates',
        error: error.message
      });
    }
  }

  // POST /api/appointments/auto-archive - Run auto-archive process
  static async runAutoArchive(req, res) {
    try {
      await Appointment.autoArchivePastAppointments();
      
      res.json({
        success: true,
        message: 'Auto-archive process completed successfully'
      });

    } catch (error) {
      console.error('Error running auto-archive:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to run auto-archive process',
        error: error.message
      });
    }
  }

  // POST /api/appointments/validate-time - Validate appointment time only
  static async validateTime(req, res) {
    try {
      const { appointment_date, appointment_time } = req.body;

      if (!appointment_date || !appointment_time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: appointment_date, appointment_time'
        });
      }

      // Use the existing time validation logic
      const timeValidation = AppointmentController.validateAppointmentTime(appointment_date, appointment_time);
      if (!timeValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: timeValidation.message,
          suggestion: timeValidation.suggestion || null
        });
      }

      // Time validation passed
      res.json({
        success: true,
        message: 'Appointment time is valid'
      });

    } catch (error) {
      console.error('Error validating time:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate time',
        error: error.message
      });
    }
  }

  // Time validation helper method
  static validateAppointmentTime(appointmentDate, appointmentTime) {
    try {
      // Business hours: 9:00 AM - 7:30 PM (9:00 - 19:30)
      const OPENING_TIME = { hour: 9, minute: 0 };
      const CLOSING_TIME = { hour: 19, minute: 30 };
      const CUTOFF_MINUTES = 60; // Stop bookings 1 hour before closing

      // Get current date and time
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Parse appointment date and time
      const [appointmentYear, appointmentMonth, appointmentDay] = appointmentDate.split('-').map(Number);
      const [appointmentHour, appointmentMinute] = appointmentTime.split(':').map(Number);

      // Create appointment datetime
      const appointmentDateTime = new Date(appointmentYear, appointmentMonth - 1, appointmentDay, appointmentHour, appointmentMinute);
      const appointmentDateOnly = new Date(appointmentYear, appointmentMonth - 1, appointmentDay);
      
      // Today's date (without time)
      const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrowDateOnly = new Date(todayDateOnly);
      tomorrowDateOnly.setDate(tomorrowDateOnly.getDate() + 1);

      // Check if appointment is in the past
      if (appointmentDateTime < now) {
        return {
          isValid: false,
          message: 'Cannot book appointments in the past',
          suggestion: null
        };
      }

      // Check if appointment is outside business hours
      if (appointmentHour < OPENING_TIME.hour || 
          (appointmentHour === OPENING_TIME.hour && appointmentMinute < OPENING_TIME.minute)) {
        return {
          isValid: false,
          message: `Appointment time is before business hours. Business opens at ${OPENING_TIME.hour}:${OPENING_TIME.minute.toString().padStart(2, '0')} AM`,
          suggestion: null
        };
      }

      if (appointmentHour > CLOSING_TIME.hour || 
          (appointmentHour === CLOSING_TIME.hour && appointmentMinute > CLOSING_TIME.minute)) {
        return {
          isValid: false,
          message: `Appointment time is after business hours. Business closes at ${CLOSING_TIME.hour - 12}:${CLOSING_TIME.minute.toString().padStart(2, '0')} PM`,
          suggestion: null
        };
      }

      // If booking for today, implement smart time slot logic
      if (appointmentDateOnly.getTime() === todayDateOnly.getTime()) {
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        const closingTimeMinutes = CLOSING_TIME.hour * 60 + CLOSING_TIME.minute;
        const appointmentTimeMinutes = appointmentHour * 60 + appointmentMinute;

        // If trying to book a slot that has already passed today
        if (appointmentTimeMinutes <= currentTimeMinutes) {
          // Find next available slot today or suggest tomorrow
          const nextSlotMinutes = Math.ceil((currentTimeMinutes + 30) / 30) * 30; // Round up to next 30-min slot
          
          // If we can still fit a slot today (at least 30 min before closing)
          if (nextSlotMinutes < (closingTimeMinutes - 30)) {
            const nextSlotHour = Math.floor(nextSlotMinutes / 60);
            const nextSlotMin = nextSlotMinutes % 60;
            const display12Hour = nextSlotHour > 12 ? nextSlotHour - 12 : (nextSlotHour === 0 ? 12 : nextSlotHour);
            const ampm = nextSlotHour >= 12 ? 'PM' : 'AM';
            
            return {
              isValid: false,
              message: `Time slot has passed. Next available slot today: ${display12Hour}:${nextSlotMin.toString().padStart(2, '0')} ${ampm}`,
              suggestion: {
                date: appointmentDate, // Same day
                time: `${nextSlotHour.toString().padStart(2, '0')}:${nextSlotMin.toString().padStart(2, '0')}`,
                display_time: `${display12Hour}:${nextSlotMin.toString().padStart(2, '0')} ${ampm}`
              }
            };
          } else {
            // Suggest tomorrow's opening time
            const nextDayDate = new Date(tomorrowDateOnly);
            const nextDayString = nextDayDate.getFullYear() + '-' + 
                                  String(nextDayDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                  String(nextDayDate.getDate()).padStart(2, '0');
            
            return {
              isValid: false,
              message: `Time slot has passed and too close to closing. Redirected to tomorrow's opening time.`,
              suggestion: {
                date: nextDayString,
                time: `${OPENING_TIME.hour.toString().padStart(2, '0')}:${OPENING_TIME.minute.toString().padStart(2, '0')}`,
                display_time: `${OPENING_TIME.hour}:${OPENING_TIME.minute.toString().padStart(2, '0')} AM`
              }
            };
          }
        }

        // If current time is too close to closing (e.g., after 6:30 PM), redirect to tomorrow
        if (currentTimeMinutes >= (closingTimeMinutes - CUTOFF_MINUTES)) {
          const nextDayDate = new Date(tomorrowDateOnly);
          const nextDayString = nextDayDate.getFullYear() + '-' + 
                                String(nextDayDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(nextDayDate.getDate()).padStart(2, '0');
          
          return {
            isValid: false,
            message: `Too close to closing time (after 6:30 PM). Redirected to tomorrow's opening time.`,
            suggestion: {
              date: nextDayString,
              time: `${OPENING_TIME.hour.toString().padStart(2, '0')}:${OPENING_TIME.minute.toString().padStart(2, '0')}`,
              display_time: `${OPENING_TIME.hour}:${OPENING_TIME.minute.toString().padStart(2, '0')} AM`
            }
          };
        }
      }

      // All validations passed
      return {
        isValid: true,
        message: 'Appointment time is valid'
      };

    } catch (error) {
      console.error('Error in time validation:', error);
      return {
        isValid: false,
        message: 'Error validating appointment time',
        suggestion: null
      };
    }
  }

  // PUT /api/appointments/:id - Update entire appointment
  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const {
        customer_name,
        customer_email,
        customer_phone,
        barber_id,
        appointment_date,
        appointment_time,
        services,
        notes,
        tip_percentage,
        tip_amount,
        payment_method,
        total_amount,
        status
      } = req.body;

      console.log('📝 Updating appointment:', id, 'with data:', req.body);

      // Check if appointment exists
      const existingAppointment = await Appointment.getById(id);
      if (!existingAppointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      // Time validation logic
      const timeValidation = AppointmentController.validateAppointmentTime(appointment_date, appointment_time);
      if (!timeValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: timeValidation.message,
          suggestion: timeValidation.suggestion || null
        });
      }

      // Check for duplicate booking (excluding current appointment)
      const duplicateCheck = await AppointmentController.checkDuplicateBooking(
        customer_email,
        appointment_date,
        appointment_time,
        id // Exclude current appointment
      );

      if (duplicateCheck.isDuplicate) {
        return res.status(400).json({
          success: false,
          message: duplicateCheck.message,
          suggestion: duplicateCheck.suggestion || null
        });
      }

      // Update the appointment
      const updated = await Appointment.update(id, {
        customer_name,
        customer_email,
        customer_phone,
        barber_id,
        appointment_date,
        appointment_time,
        services,
        notes,
        tip_percentage,
        tip_amount,
        payment_method,
        total_amount,
        status: status || existingAppointment.status
      });

      if (!updated) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update appointment'
        });
      }

      console.log('✅ Appointment updated successfully:', id);

      res.json({
        success: true,
        message: 'Appointment updated successfully',
        data: { id }
      });

    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update appointment',
        error: error.message
      });
    }
  }

  // DELETE /api/appointments/:id - Delete appointment
  static async deleteAppointment(req, res) {
    try {
      const { id } = req.params;

      console.log('🗑️ Deleting appointment:', id);

      // Check if appointment exists
      const existingAppointment = await Appointment.getById(id);
      if (!existingAppointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      // Delete the appointment
      const deleted = await Appointment.delete(id);

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete appointment'
        });
      }

      console.log('✅ Appointment deleted successfully:', id);

      res.json({
        success: true,
        message: 'Appointment deleted successfully',
        data: { id }
      });

    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete appointment',
        error: error.message
      });
    }
  }
}

export default AppointmentController;
