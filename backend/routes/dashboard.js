import express from 'express';
import DashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Dashboard overview - all key metrics
router.get('/overview', DashboardController.getOverview);

// Revenue analytics
router.get('/revenue', DashboardController.getRevenueAnalytics);

// Appointment analytics
router.get('/appointments', DashboardController.getAppointmentAnalytics);

// Order analytics
router.get('/orders', DashboardController.getOrderAnalytics);

// Customer analytics
router.get('/customers', DashboardController.getCustomerAnalytics);

// Performance metrics
router.get('/performance', DashboardController.getPerformanceMetrics);

// Recent activity
router.get('/recent-activity', DashboardController.getRecentActivity);

export default router;