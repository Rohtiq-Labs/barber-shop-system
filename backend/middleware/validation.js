// Validation middleware for appointment and other data validation

class Validation {
  // Validate appointment creation data
  static validateAppointmentData(req, res, next) {
    const {
      customer_name,
      customer_email,
      customer_phone,
      barber_id,
      appointment_date,
      appointment_time,
      services
    } = req.body;

    const errors = [];

    // Required fields validation
    if (!customer_name || customer_name.trim().length < 2) {
      errors.push('Customer name is required and must be at least 2 characters');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer_email || !emailRegex.test(customer_email)) {
      errors.push('Valid email address is required');
    }

    // Phone validation (basic) - more flexible
    const phoneRegex = /^[\+]?[\d]{10,15}$/;
    if (!customer_phone || !phoneRegex.test(customer_phone.replace(/[-\s\(\)\.]/g, ''))) {
      errors.push('Valid phone number is required (10-15 digits)');
    }

    // Barber ID validation
    if (!barber_id || !Number.isInteger(Number(barber_id)) || Number(barber_id) <= 0) {
      errors.push('Valid barber ID is required');
    }

    // Date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!appointment_date || !dateRegex.test(appointment_date)) {
      errors.push('Appointment date must be in YYYY-MM-DD format');
    } else {
      const appointmentDate = new Date(appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (appointmentDate < today) {
        errors.push('Appointment date cannot be in the past');
      }
    }

    // Time validation
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!appointment_time || !timeRegex.test(appointment_time)) {
      errors.push('Appointment time must be in HH:MM format');
    }

    // Services validation
    if (!services || !Array.isArray(services) || services.length === 0) {
      errors.push('At least one service must be selected');
    } else {
      const validServices = services.every(id => Number.isInteger(Number(id)) && Number(id) > 0);
      if (!validServices) {
        errors.push('All service IDs must be valid positive integers');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    next();
  }

  // Validate barber creation/update data
  static validateBarberData(req, res, next) {
    const {
      name,
      specialization,
      experience_years,
      phone,
      email,
      bio
    } = req.body;

    const errors = [];

    // Name validation
    if (!name || name.trim().length < 2) {
      errors.push('Barber name is required and must be at least 2 characters');
    }

    // Specialization validation
    if (!specialization || specialization.trim().length < 2) {
      errors.push('Specialization is required');
    }

    // Experience validation
    if (!experience_years || !Number.isInteger(Number(experience_years)) || Number(experience_years) < 0) {
      errors.push('Experience years must be a non-negative integer');
    }

    // Phone validation - more flexible
    const phoneRegex = /^[\+]?[\d]{10,15}$/;
    if (!phone || !phoneRegex.test(phone.replace(/[-\s\(\)\.]/g, ''))) {
      errors.push('Valid phone number is required (10-15 digits)');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Valid email address is required');
    }

    // Bio validation (optional but if provided, should have minimum length)
    if (bio && bio.trim().length < 10) {
      errors.push('Bio should be at least 10 characters if provided');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    next();
  }

  // Validate service data
  static validateServiceData(req, res, next) {
    const {
      name,
      description,
      price,
      duration,
      category
    } = req.body;

    const errors = [];

    // Name validation
    if (!name || name.trim().length < 2) {
      errors.push('Service name is required and must be at least 2 characters');
    }

    // Description validation
    if (!description || description.trim().length < 10) {
      errors.push('Service description is required and must be at least 10 characters');
    }

    // Price validation
    if (!price || !Number.isFinite(Number(price)) || Number(price) <= 0) {
      errors.push('Price must be a positive number');
    }

    // Duration validation
    if (!duration || !Number.isInteger(Number(duration)) || Number(duration) <= 0) {
      errors.push('Duration must be a positive integer (minutes)');
    }

    // Category validation
    const validCategories = ['HAIRCUTS', 'BEARD_GROOMING', 'HAIR_STYLING', 'TREATMENTS', 'PACKAGES'];
    if (!category || !validCategories.includes(category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    next();
  }

  // Validate ID parameter
  static validateId(req, res, next) {
    const { id } = req.params;
    
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID parameter'
      });
    }

    next();
  }

  // Validate date parameter
  static validateDate(req, res, next) {
    const { date } = req.params;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    if (!date || !dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date value'
      });
    }

    next();
  }
}

export default Validation;
