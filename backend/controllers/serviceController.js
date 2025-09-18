import Service from '../models/Service.js';

class ServiceController {
  // GET /api/services - Get all services
  static async getAllServices(req, res) {
    try {
      const services = await Service.getAll();
      res.json({
        success: true,
        message: 'Services fetched successfully',
        data: services
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services',
        error: error.message
      });
    }
  }

  // GET /api/services/categories - Get all categories
  static async getCategories(req, res) {
    try {
      const categories = await Service.getCategories();
      res.json({
        success: true,
        message: 'Categories fetched successfully',
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  }

  // GET /api/services/category/:category - Get services by category
  static async getServicesByCategory(req, res) {
    try {
      const { category } = req.params;
      const services = await Service.getByCategory(category);
      res.json({
        success: true,
        message: `Services in ${category} category fetched successfully`,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services by category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services',
        error: error.message
      });
    }
  }

  // GET /api/services/:id - Get service by ID
  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.getById(id);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service fetched successfully',
        data: service
      });
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch service',
        error: error.message
      });
    }
  }

  // POST /api/services - Create new service
  static async createService(req, res) {
    try {
      const { name, description, price, duration, category } = req.body;

      console.log('Received service data:', { name, description, price, duration, category });

      // Basic validation
      if (!name || !price || !duration) {
        return res.status(400).json({
          success: false,
          message: 'Name, price, and duration are required'
        });
      }

      if (!category || category.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Category is required'
        });
      }

      // Don't default to 'General' - let the category be what the user provides
      const cleanCategory = category?.trim() || '';
      
      const serviceData = {
        name: name.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        duration: parseInt(duration),
        category: cleanCategory
      };

      console.log('Processed service data:', serviceData);

      const serviceId = await Service.create(serviceData);
      
      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: { id: serviceId, ...serviceData }
      });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create service',
        error: error.message
      });
    }
  }

  // PUT /api/services/:id - Update service
  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, duration, category } = req.body;

      // Check if service exists
      const existingService = await Service.getById(id);
      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // Basic validation
      if (!name || !price || !duration) {
        return res.status(400).json({
          success: false,
          message: 'Name, price, and duration are required'
        });
      }

      if (!category || category.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Category is required'
        });
      }

      const serviceData = {
        name: name.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        duration: parseInt(duration),
        category: category.trim()
      };

      await Service.update(id, serviceData);
      
      res.json({
        success: true,
        message: 'Service updated successfully',
        data: { id, ...serviceData }
      });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update service',
        error: error.message
      });
    }
  }

  // DELETE /api/services/:id - Delete service
  static async deleteService(req, res) {
    try {
      const { id } = req.params;

      // Check if service exists
      const existingService = await Service.getById(id);
      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      await Service.delete(id);
      
      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete service',
        error: error.message
      });
    }
  }

  // GET /api/services/debug/structure - Get table structure for debugging
  static async getTableStructure(req, res) {
    try {
      const structure = await Service.getTableStructure();
      const foreignKeys = await Service.getForeignKeys();
      
      res.json({
        success: true,
        data: {
          structure,
          foreignKeys,
          recommendations: Service.getCategoryRecommendations(structure, foreignKeys)
        }
      });
    } catch (error) {
      console.error('Error getting table structure:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get table structure',
        error: error.message
      });
    }
  }
}

export default ServiceController;