import Barber from '../models/Barber.js';

class BarberController {
  // GET /api/barbers - Get all barbers
  static async getAllBarbers(req, res) {
    try {
      const barbers = await Barber.getAll();
      
      // Convert relative image paths to full URLs
      const barbersWithFullUrls = barbers.map(barber => ({
        ...barber,
        profile_image: barber.profile_image && barber.profile_image.startsWith('/uploads/') 
          ? `http://localhost:5000${barber.profile_image}`
          : barber.profile_image
      }));
      
      res.json({
        success: true,
        message: 'Barbers fetched successfully',
        data: barbersWithFullUrls
      });
    } catch (error) {
      console.error('Error fetching barbers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch barbers',
        error: error.message
      });
    }
  }

  // GET /api/barbers/:id - Get barber by ID
  static async getBarberById(req, res) {
    try {
      const { id } = req.params;
      const barber = await Barber.getById(id);

      if (!barber) {
        return res.status(404).json({
          success: false,
          message: 'Barber not found'
        });
      }

      // Convert relative image path to full URL
      const barberWithFullUrl = {
        ...barber,
        profile_image: barber.profile_image && barber.profile_image.startsWith('/uploads/') 
          ? `http://localhost:5000${barber.profile_image}`
          : barber.profile_image
      };

      res.json({
        success: true,
        message: 'Barber fetched successfully',
        data: barberWithFullUrl
      });
    } catch (error) {
      console.error('Error fetching barber:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch barber',
        error: error.message
      });
    }
  }

  // GET /api/barbers/available/:date - Get available barbers for specific date
  static async getAvailableBarbers(req, res) {
    try {
      const { date } = req.params;
      
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      const barbers = await Barber.getAvailableBarbers(date);
      
      // Convert relative image paths to full URLs
      const barbersWithFullUrls = barbers.map(barber => ({
        ...barber,
        profile_image: barber.profile_image && barber.profile_image.startsWith('/uploads/') 
          ? `http://localhost:5000${barber.profile_image}`
          : barber.profile_image
      }));
      
      res.json({
        success: true,
        message: `Available barbers for ${date} fetched successfully`,
        data: barbersWithFullUrls
      });
    } catch (error) {
      console.error('Error fetching available barbers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch available barbers',
        error: error.message
      });
    }
  }

  // GET /api/barbers/:id/schedule/:date - Get barber's schedule for specific date
  static async getBarberSchedule(req, res) {
    try {
      const { id, date } = req.params;
      
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      const schedule = await Barber.getSchedule(id, date);
      res.json({
        success: true,
        message: `Schedule for barber ${id} on ${date} fetched successfully`,
        data: schedule
      });
    } catch (error) {
      console.error('Error fetching barber schedule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch barber schedule',
        error: error.message
      });
    }
  }

  // GET /api/barbers/:id/stats - Get barber statistics
  static async getBarberStats(req, res) {
    try {
      const { id } = req.params;
      const stats = await Barber.getStats(id);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Barber not found or no statistics available'
        });
      }

      res.json({
        success: true,
        message: 'Barber statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching barber stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch barber statistics',
        error: error.message
      });
    }
  }

  // GET /api/barbers/:id/working-hours - Get barber's working hours
  static async getWorkingHours(req, res) {
    try {
      const { id } = req.params;
      const workingHours = await Barber.getWorkingHours(id);

      res.json({
        success: true,
        message: 'Barber working hours fetched successfully',
        data: workingHours
      });
    } catch (error) {
      console.error('Error fetching working hours:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch working hours',
        error: error.message
      });
    }
  }

  // PUT /api/barbers/:id/availability - Update barber availability (admin)
  static async updateAvailability(req, res) {
    try {
      const { id } = req.params;
      const { is_available } = req.body;

      if (typeof is_available !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'is_available must be a boolean value'
        });
      }

      const updated = await Barber.updateAvailability(id, is_available);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Barber not found'
        });
      }

      res.json({
        success: true,
        message: 'Barber availability updated successfully',
        data: { id, is_available }
      });
    } catch (error) {
      console.error('Error updating barber availability:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update barber availability',
        error: error.message
      });
    }
  }

  // PUT /api/barbers/:id - Update barber profile (admin)
  static async updateBarberProfile(req, res) {
    try {
      console.log('=== UPDATE BARBER DEBUG ===');
      console.log('Request params:', req.params);
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const { id } = req.params;
      const profileData = req.body;

      // Basic validation
      const requiredFields = ['name', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !profileData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Handle image upload - only update if new image is provided
      if (req.file) {
        profileData.image = `/uploads/barbers/${req.file.filename}`;
      } else {
        // If no new image, don't include image field in update to preserve existing
        delete profileData.image;
      }

      // ✅ Handle specialties - convert string to JSON array
      if (profileData.specialties) {
        // If it's a string, try to parse it or split by comma
        if (typeof profileData.specialties === 'string') {
          if (profileData.specialties.trim() === '') {
            profileData.specialties = JSON.stringify([]);
          } else {
            // Split by comma and clean up each specialty
            const specialtiesArray = profileData.specialties
              .split(',')
              .map(s => s.trim())
              .filter(s => s.length > 0);
            profileData.specialties = JSON.stringify(specialtiesArray);
          }
        }
      } else {
        profileData.specialties = JSON.stringify([]);
      }

      // ✅ Convert is_available to boolean
      profileData.is_available = profileData.is_available === '1' || profileData.is_available === true;

      // ✅ Convert rating to number
      profileData.rating = parseFloat(profileData.rating) || 0.0;

      const updated = await Barber.update(id, profileData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Barber not found'
        });
      }

      res.json({
        success: true,
        message: 'Barber profile updated successfully',
        data: { id, ...profileData }
      });
    } catch (error) {
      console.error('Error updating barber profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update barber profile',
        error: error.message
      });
    }
  }

  // POST /api/barbers - Create new barber (admin)
  static async createBarber(req, res) {
    try {
      console.log('=== CREATE BARBER DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const barberData = req.body;

      // ✅ Basic validation
      const requiredFields = ['name', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !barberData[field]);

      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // ✅ Handle image upload
      if (req.file) {
        barberData.image = `/uploads/barbers/${req.file.filename}`;
      } else {
        barberData.image = '/images/default-barber.jpg';
      }

      // ✅ Handle specialties - convert string to JSON array
      if (barberData.specialties) {
        // If it's a string, try to parse it or split by comma
        if (typeof barberData.specialties === 'string') {
          if (barberData.specialties.trim() === '') {
            barberData.specialties = JSON.stringify([]);
          } else {
            // Split by comma and clean up each specialty
            const specialtiesArray = barberData.specialties
              .split(',')
              .map(s => s.trim())
              .filter(s => s.length > 0);
            barberData.specialties = JSON.stringify(specialtiesArray);
          }
        }
      } else {
        barberData.specialties = JSON.stringify([]);
      }

      // ✅ Convert is_available to boolean
      barberData.is_available = barberData.is_available === '1' || barberData.is_available === true;

      // ✅ Convert rating to number
      barberData.rating = parseFloat(barberData.rating) || 0.0;

      const barberId = await Barber.create(barberData);

      return res.status(201).json({
        success: true,
        message: 'Barber created successfully',
        data: { id: barberId, ...barberData }
      });
    } catch (error) {
      console.error('Error creating barber:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create barber',
        error: error.message
      });
    }
  }

  // DELETE /api/barbers/:id - Delete barber (admin)
  static async deleteBarber(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Barber.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Barber not found'
        });
      }

      res.json({
        success: true,
        message: 'Barber deleted successfully',
        data: { id }
      });
    } catch (error) {
      console.error('Error deleting barber:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete barber',
        error: error.message
      });
    }
  }
}

export default BarberController;
