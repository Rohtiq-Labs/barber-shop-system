import db from '../config/database.js';

class Barber {
  // Get all barbers (admin view - includes inactive)
  static async getAll(includeInactive = false) {
    try {
      const whereClause = includeInactive ? '' : 'WHERE is_active = 1';
      const [rows] = await db.execute(`
        SELECT 
          id, 
          name,
          COALESCE(phone, '') as phone,
          COALESCE(email, '') as email,
          COALESCE(image, '/images/default-barber.jpg') as profile_image,
          COALESCE(is_available, 1) as is_available,
          COALESCE(rating, 0.00) as rating,
          COALESCE(specialties, '[]') as specialties,
          created_at,
          updated_at,
          is_active
        FROM barbers 
        ${whereClause}
        ORDER BY name ASC
      `);
      return rows;
    } catch (error) {
      console.error('Barber.getAll error:', error);
      throw error;
    }
  }

  // Get barber by ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          id, 
          name,
          COALESCE(phone, '') as phone,
          COALESCE(email, '') as email,
          COALESCE(image, '/images/default-barber.jpg') as profile_image,
          COALESCE(is_available, 1) as is_available,
          COALESCE(rating, 0.00) as rating,
          COALESCE(specialties, '[]') as specialties,
          created_at,
          updated_at,
          is_active
        FROM barbers 
        WHERE id = ? AND is_active = 1
      `, [id]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Barber.getById error:', error);
      throw error;
    }
  }

  // Create new barber
  static async create(barberData) {
    try {
      const { name, phone, email, image, specialties, is_available = true, rating = 0.0 } = barberData;
      
      const [result] = await db.execute(`
        INSERT INTO barbers (name, phone, email, image, specialties, is_available, is_active, rating, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())
      `, [name, phone, email, image, specialties, is_available, rating]);
      
      return result.insertId;
    } catch (error) {
      console.error('Barber.create error:', error);
      throw error;
    }
  }

  // Update barber
  static async update(id, barberData) {
    try {
      const { name, phone, email, image, specialties, is_available, rating } = barberData;
      
      // Build dynamic query based on provided fields
      const updateFields = [];
      const updateValues = [];
      
      if (name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (phone !== undefined) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (image !== undefined) {
        updateFields.push('image = ?');
        updateValues.push(image);
      }
      if (specialties !== undefined) {
        updateFields.push('specialties = ?');
        updateValues.push(specialties);
      }
      if (is_available !== undefined) {
        updateFields.push('is_available = ?');
        updateValues.push(is_available);
      }
      if (rating !== undefined) {
        updateFields.push('rating = ?');
        updateValues.push(rating);
      }
      
      // Always update the updated_at field
      updateFields.push('updated_at = NOW()');
      
      // Add the id for the WHERE clause
      updateValues.push(id);
      
      const query = `
        UPDATE barbers 
        SET ${updateFields.join(', ')}
        WHERE id = ? AND is_active = 1
      `;
      
      console.log('Update query:', query);
      console.log('Update values:', updateValues);
      
      const [result] = await db.execute(query, updateValues);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Barber.update error:', error);
      throw error;
    }
  }

  // Delete barber (soft delete)
  static async delete(id) {
    try {
      const [result] = await db.execute(`
        UPDATE barbers 
        SET is_active = 0, updated_at = NOW()
        WHERE id = ?
      `, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Barber.delete error:', error);
      throw error;
    }
  }

  // Get available barbers for specific date
  static async getAvailableBarbers(date) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          id, 
          name,
          COALESCE(specialties, '[]') as specialties,
          COALESCE(image, '/images/default-barber.jpg') as profile_image,
          COALESCE(phone, '') as phone,
          COALESCE(email, '') as email,
          COALESCE(rating, 0.00) as rating,
          COALESCE(is_available, 1) as is_available
        FROM barbers 
        WHERE is_active = 1 AND is_available = 1
        ORDER BY name ASC
      `);
      return rows;
    } catch (error) {
      console.error('Barber.getAvailableBarbers error:', error);
      throw error;
    }
  }

  // Get barber schedule for specific date
  static async getSchedule(id, date) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.id,
          a.appointment_date,
          a.appointment_time,
          a.status,
          s.name as service_name,
          s.duration,
          c.name as customer_name,
          c.phone as customer_phone
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        LEFT JOIN customers c ON a.customer_id = c.id
        WHERE a.barber_id = ? AND a.appointment_date = ? AND a.is_active = 1
        ORDER BY a.appointment_time ASC
      `, [id, date]);
      
      return rows;
    } catch (error) {
      console.error('Barber.getSchedule error:', error);
      throw error;
    }
  }

  // Get barber statistics
  static async getStats(id) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          COUNT(a.id) as total_appointments,
          COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
          COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) as cancelled_appointments,
          AVG(a.rating) as average_rating,
          COUNT(CASE WHEN a.rating IS NOT NULL THEN 1 END) as total_reviews
        FROM appointments a
        WHERE a.barber_id = ? AND a.is_active = 1
      `, [id]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Barber.getStats error:', error);
      throw error;
    }
  }

  // Get working hours
  static async getWorkingHours(id) {
    try {
      // Default working hours - can be extended with a working_hours table
      return {
        monday: { start: '09:00', end: '18:00', is_working: true },
        tuesday: { start: '09:00', end: '18:00', is_working: true },
        wednesday: { start: '09:00', end: '18:00', is_working: true },
        thursday: { start: '09:00', end: '18:00', is_working: true },
        friday: { start: '09:00', end: '18:00', is_working: true },
        saturday: { start: '09:00', end: '16:00', is_working: true },
        sunday: { start: '10:00', end: '14:00', is_working: false }
      };
    } catch (error) {
      console.error('Barber.getWorkingHours error:', error);
      throw error;
    }
  }

  // Update availability
  static async updateAvailability(id, is_available) {
    try {
      const [result] = await db.execute(`
        UPDATE barbers 
        SET is_available = ?, updated_at = NOW()
        WHERE id = ? AND is_active = 1
      `, [is_available, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Barber.updateAvailability error:', error);
      throw error;
    }
  }
}

export default Barber;