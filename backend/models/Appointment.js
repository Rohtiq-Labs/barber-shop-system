import db from '../config/database.js';

class Appointment {
  // Create new appointment (guest booking)
  static async create(appointmentData, serviceIds) {
    console.log('🔧 Appointment.create called with:', { appointmentData, serviceIds });
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert into appointments table
      const [appointmentResult] = await connection.execute(`
        INSERT INTO appointments (
          customer_name, customer_email, customer_phone, 
          barber_id, appointment_date, appointment_time, 
          status, notes, tip_percentage, tip_amount, payment_method, total_amount, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, NOW())
      `, [
        appointmentData.customer_name,
        appointmentData.customer_email,
        appointmentData.customer_phone,
        appointmentData.barber_id,
        appointmentData.appointment_date,
        appointmentData.appointment_time,
        appointmentData.notes || null,
        appointmentData.tip_percentage || 0,
        appointmentData.tip_amount || 0,
        appointmentData.payment_method || 'Pay at Venue',
        appointmentData.total_amount || 0
      ]);
      
      const appointmentId = appointmentResult.insertId;
      
        // Insert services for this appointment
        if (serviceIds && serviceIds.length > 0) {
          for (const serviceId of serviceIds) {
            await connection.execute(`
              INSERT INTO appointment_services (appointment_id, service_id) VALUES (?, ?)
            `, [appointmentId, serviceId]);
          }
        }
      
      await connection.commit();
      return appointmentId;
      
    } catch (error) {
      await connection.rollback();
      console.error('Appointment.create error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Get appointment by ID with services
  static async getById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          b.name as barber_name,
          b.specialties as barber_specialties,
          GROUP_CONCAT(s.name) as service_names,
          GROUP_CONCAT(s.price) as service_prices,
          SUM(s.price) as total_price,
          SUM(s.duration) as total_duration
        FROM appointments a
        LEFT JOIN barbers b ON a.barber_id = b.id
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        WHERE a.id = ?
        GROUP BY a.id
      `, [id]);
      
      if (rows.length === 0) return null;
      
      const appointment = rows[0];
      // Convert comma-separated strings back to arrays
      if (appointment.service_names) {
        appointment.services = appointment.service_names.split(',').map((name, index) => ({
          name: name,
          price: parseFloat(appointment.service_prices.split(',')[index])
        }));
      }
      
      return appointment;
    } catch (error) {
      console.error('Appointment.getById error:', error);
      throw error;
    }
  }
  
  // Get appointments by date range (for admin)
  static async getByDateRange(startDate, endDate) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          b.name as barber_name,
          COUNT(aps.service_id) as service_count,
          SUM(s.price) as total_price
        FROM appointments a
        LEFT JOIN barbers b ON a.barber_id = b.id
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        WHERE DATE(a.appointment_date) BETWEEN ? AND ?
        GROUP BY a.id
        ORDER BY a.appointment_date, a.appointment_time
      `, [startDate, endDate]);
      
      return rows;
    } catch (error) {
      console.error('Appointment.getByDateRange error:', error);
      throw error;
    }
  }
  
  // Get appointments by barber ID
  static async getByBarberId(barberId, date = null) {
    try {
      let query = `
        SELECT 
          a.*,
          COUNT(aps.service_id) as service_count,
          SUM(s.price) as total_price
        FROM appointments a
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        WHERE a.barber_id = ?
      `;
      
      const params = [barberId];
      
      if (date) {
        query += ' AND DATE(a.appointment_date) = ?';
        params.push(date);
      }
      
      query += ' GROUP BY a.id ORDER BY a.appointment_date, a.appointment_time';
      
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Appointment.getByBarberId error:', error);
      throw error;
    }
  }
  
  // Update appointment status
  static async updateStatus(id, status) {
    try {
      const [result] = await db.execute(`
        UPDATE appointments 
        SET status = ?, updated_at = NOW() 
        WHERE id = ?
      `, [status, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Appointment.updateStatus error:', error);
      throw error;
    }
  }
  
  // Check time slot availability
  static async checkAvailability(barberId, date, time) {
    try {
      const [rows] = await db.execute(`
        SELECT COUNT(*) as count 
        FROM appointments 
        WHERE barber_id = ? 
        AND appointment_date = ? 
        AND appointment_time = ? 
        AND status != 'cancelled'
      `, [barberId, date, time]);
      
      return rows[0].count === 0; // true if available
    } catch (error) {
      console.error('Appointment.checkAvailability error:', error);
      throw error;
    }
  }
  
  // Check for duplicate bookings based on phone or email
  static async checkDuplicateBooking(phone, email, appointmentDate) {
    try {
      // Check for existing appointments with same phone OR email
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          b.name as barber_name,
          DATEDIFF(?, a.appointment_date) as days_diff
        FROM appointments a
        LEFT JOIN barbers b ON a.barber_id = b.id
        WHERE (a.customer_phone = ? OR a.customer_email = ?)
        AND a.status IN ('pending', 'confirmed')
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
        LIMIT 5
      `, [appointmentDate, phone, email]);
      
      if (rows.length === 0) {
        return { isDuplicate: false, appointments: [] };
      }
      
      // Check for same date booking (strict block)
      const sameDateBooking = rows.find(row => row.appointment_date === appointmentDate);
      if (sameDateBooking) {
        return {
          isDuplicate: true,
          type: 'same_date',
          message: `You already have an appointment on ${appointmentDate}`,
          existingAppointment: sameDateBooking,
          appointments: rows
        };
      }
      
      // Check for recent bookings (within 7 days - warning)
      const recentBookings = rows.filter(row => {
        const daysDiff = Math.abs(row.days_diff);
        return daysDiff <= 7;
      });
      
      if (recentBookings.length > 0) {
        return {
          isDuplicate: true,
          type: 'recent_booking',
          message: `You have a recent appointment within 7 days`,
          existingAppointment: recentBookings[0],
          appointments: rows
        };
      }
      
      return { isDuplicate: false, appointments: rows };
      
    } catch (error) {
      console.error('Appointment.checkDuplicateBooking error:', error);
      throw error;
    }
  }
  
  // Auto-archive past appointments
  static async autoArchivePastAppointments() {
    try {
      // Move past pending appointments to completed
      await db.execute(`
        UPDATE appointments 
        SET status = 'completed', updated_at = NOW()
        WHERE status = 'pending' 
        AND CONCAT(appointment_date, ' ', appointment_time) < NOW()
      `);
      
      // Archive appointments older than 30 days
      await db.execute(`
        UPDATE appointments 
        SET status = 'archived', updated_at = NOW()
        WHERE status = 'completed' 
        AND appointment_date < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      `);
      
      console.log('Auto-archive completed successfully');
      return true;
    } catch (error) {
      console.error('Appointment.autoArchivePastAppointments error:', error);
      throw error;
    }
  }

  // Get all appointments (for admin dashboard)
  static async getAll(limit = 50, offset = 0) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          b.name as barber_name,
          COUNT(aps.service_id) as service_count,
          SUM(s.price) as total_price
        FROM appointments a
        LEFT JOIN barbers b ON a.barber_id = b.id
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        GROUP BY a.id
        ORDER BY a.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      
      return rows;
    } catch (error) {
      console.error('Appointment.getAll error:', error);
      throw error;
    }
  }

  // Update entire appointment
  static async update(id, appointmentData) {
    console.log('🔧 Appointment.update called with:', { id, appointmentData });
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Build dynamic query based on provided fields
      const updateFields = [];
      const updateValues = [];
      
      if (appointmentData.customer_name !== undefined) {
        updateFields.push('customer_name = ?');
        updateValues.push(appointmentData.customer_name);
      }
      if (appointmentData.customer_email !== undefined) {
        updateFields.push('customer_email = ?');
        updateValues.push(appointmentData.customer_email);
      }
      if (appointmentData.customer_phone !== undefined) {
        updateFields.push('customer_phone = ?');
        updateValues.push(appointmentData.customer_phone);
      }
      if (appointmentData.barber_id !== undefined) {
        updateFields.push('barber_id = ?');
        updateValues.push(appointmentData.barber_id);
      }
      if (appointmentData.appointment_date !== undefined) {
        updateFields.push('appointment_date = ?');
        updateValues.push(appointmentData.appointment_date);
      }
      if (appointmentData.appointment_time !== undefined) {
        updateFields.push('appointment_time = ?');
        updateValues.push(appointmentData.appointment_time);
      }
      if (appointmentData.status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(appointmentData.status);
      }
      if (appointmentData.notes !== undefined) {
        updateFields.push('notes = ?');
        updateValues.push(appointmentData.notes || null);
      }
      if (appointmentData.tip_percentage !== undefined) {
        updateFields.push('tip_percentage = ?');
        updateValues.push(appointmentData.tip_percentage || 0);
      }
      if (appointmentData.tip_amount !== undefined) {
        updateFields.push('tip_amount = ?');
        updateValues.push(appointmentData.tip_amount || 0);
      }
      if (appointmentData.payment_method !== undefined) {
        updateFields.push('payment_method = ?');
        updateValues.push(appointmentData.payment_method || 'Pay at Venue');
      }
      if (appointmentData.total_amount !== undefined) {
        updateFields.push('total_amount = ?');
        updateValues.push(appointmentData.total_amount || 0);
      }
      
      // Always update the updated_at field
      updateFields.push('updated_at = NOW()');
      
      // Add the id for the WHERE clause
      updateValues.push(id);
      
      const query = `UPDATE appointments SET ${updateFields.join(', ')} WHERE id = ?`;
      
      console.log('Update query:', query);
      console.log('Update values:', updateValues);
      
      const [result] = await connection.execute(query, updateValues);
      
      if (result.affectedRows === 0) {
        await connection.rollback();
        return false;
      }
      
      // Update services for this appointment
      if (appointmentData.services && appointmentData.services.length > 0) {
        // Delete existing services
        await connection.execute(`
          DELETE FROM appointment_services WHERE appointment_id = ?
        `, [id]);
        
        // Insert new services
        for (const serviceId of appointmentData.services) {
          await connection.execute(`
            INSERT INTO appointment_services (appointment_id, service_id) VALUES (?, ?)
          `, [id, serviceId]);
        }
      }
      
      await connection.commit();
      return true;
      
    } catch (error) {
      await connection.rollback();
      console.error('Appointment.update error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete appointment
  static async delete(id) {
    console.log('🔧 Appointment.delete called with:', { id });
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete appointment services first (foreign key constraint)
      await connection.execute(`
        DELETE FROM appointment_services WHERE appointment_id = ?
      `, [id]);
      
      // Delete appointment
      const [result] = await connection.execute(`
        DELETE FROM appointments WHERE id = ?
      `, [id]);
      
      await connection.commit();
      return result.affectedRows > 0;
      
    } catch (error) {
      await connection.rollback();
      console.error('Appointment.delete error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Appointment;
