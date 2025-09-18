import express from 'express';
const router = express.Router();
import ServiceController from '../controllers/serviceController.js';

// GET /api/services - Get all services
router.get('/', ServiceController.getAllServices);

// POST /api/services - Create new service
router.post('/', ServiceController.createService);

// GET /api/services/categories - Get all categories
router.get('/categories', ServiceController.getCategories);

// GET /api/services/category/:category - Get services by category
router.get('/category/:category', ServiceController.getServicesByCategory);

// GET /api/services/:id - Get service by ID
router.get('/:id', ServiceController.getServiceById);

// PUT /api/services/:id - Update service
router.put('/:id', ServiceController.updateService);

// DELETE /api/services/:id - Delete service
router.delete('/:id', ServiceController.deleteService);

// GET /api/services/debug/structure - Debug database structure
router.get('/debug/structure', ServiceController.getTableStructure);

export default router;