import Dashboard from '../models/Dashboard.js';

class DashboardController {
  // Get dashboard overview with all key metrics
  static async getOverview(req, res) {
    try {
      const [
        overallStats,
        orderStats,
        customerStats,
        topBarbers,
        popularServices,
        topProducts,
        recentAppointments,
        recentOrders
      ] = await Promise.all([
        Dashboard.getOverallStats(),
        Dashboard.getOrderStats(),
        Dashboard.getCustomerStats(),
        Dashboard.getTopBarbers(5),
        Dashboard.getPopularServices(5),
        Dashboard.getTopSellingProducts(5),
        Dashboard.getRecentAppointments(5),
        Dashboard.getRecentOrders(5)
      ]);

      res.json({
        success: true,
        data: {
          overall: overallStats,
          orders: orderStats,
          customers: customerStats,
          topBarbers,
          popularServices,
          topProducts,
          recentAppointments,
          recentOrders
        }
      });
    } catch (error) {
      console.error('DashboardController.getOverview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard overview',
        error: error.message
      });
    }
  }

  // Get revenue analytics
  static async getRevenueAnalytics(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      
      const [
        dailyRevenue,
        dailyOrderRevenue,
        combinedRevenue,
        monthlyTrends
      ] = await Promise.all([
        Dashboard.getDailyRevenue(days),
        Dashboard.getDailyOrderRevenue(days),
        Dashboard.getCombinedRevenue(days),
        Dashboard.getMonthlyTrends(12)
      ]);

      res.json({
        success: true,
        data: {
          dailyRevenue,
          dailyOrderRevenue,
          combinedRevenue,
          monthlyTrends
        }
      });
    } catch (error) {
      console.error('DashboardController.getRevenueAnalytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue analytics',
        error: error.message
      });
    }
  }

  // Get appointment analytics
  static async getAppointmentAnalytics(req, res) {
    try {
      const [
        statusDistribution,
        monthlyTrends,
        topBarbers,
        popularServices
      ] = await Promise.all([
        Dashboard.getAppointmentStatusDistribution(),
        Dashboard.getMonthlyTrends(12),
        Dashboard.getTopBarbers(10),
        Dashboard.getPopularServices(10)
      ]);

      res.json({
        success: true,
        data: {
          statusDistribution,
          monthlyTrends,
          topBarbers,
          popularServices
        }
      });
    } catch (error) {
      console.error('DashboardController.getAppointmentAnalytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointment analytics',
        error: error.message
      });
    }
  }

  // Get order analytics
  static async getOrderAnalytics(req, res) {
    try {
      const [
        statusDistribution,
        topProducts,
        recentOrders,
        dailyOrderRevenue
      ] = await Promise.all([
        Dashboard.getOrderStatusDistribution(),
        Dashboard.getTopSellingProducts(10),
        Dashboard.getRecentOrders(10),
        Dashboard.getDailyOrderRevenue(30)
      ]);

      res.json({
        success: true,
        data: {
          statusDistribution,
          topProducts,
          recentOrders,
          dailyOrderRevenue
        }
      });
    } catch (error) {
      console.error('DashboardController.getOrderAnalytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order analytics',
        error: error.message
      });
    }
  }

  // Get customer analytics
  static async getCustomerAnalytics(req, res) {
    try {
      const customerStats = await Dashboard.getCustomerStats();

      res.json({
        success: true,
        data: {
          customerStats
        }
      });
    } catch (error) {
      console.error('DashboardController.getCustomerAnalytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer analytics',
        error: error.message
      });
    }
  }

  // Get performance metrics
  static async getPerformanceMetrics(req, res) {
    try {
      const [
        overallStats,
        orderStats,
        topBarbers,
        popularServices,
        topProducts
      ] = await Promise.all([
        Dashboard.getOverallStats(),
        Dashboard.getOrderStats(),
        Dashboard.getTopBarbers(10),
        Dashboard.getPopularServices(10),
        Dashboard.getTopSellingProducts(10)
      ]);

      // Calculate performance metrics
      const totalRevenue = (overallStats?.monthly_revenue || 0) + (orderStats?.monthly_order_revenue || 0);
      const totalAppointments = overallStats?.completed_appointments || 0;
      const totalOrders = orderStats?.delivered_orders || 0;
      const avgRevenuePerAppointment = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;
      const avgRevenuePerOrder = totalOrders > 0 ? (orderStats?.monthly_order_revenue || 0) / totalOrders : 0;

      res.json({
        success: true,
        data: {
          performance: {
            totalRevenue,
            totalAppointments,
            totalOrders,
            avgRevenuePerAppointment,
            avgRevenuePerOrder,
            completionRate: overallStats?.completed_appointments > 0 ? 
              (overallStats.completed_appointments / (overallStats.completed_appointments + overallStats.cancelled_appointments)) * 100 : 0,
            orderDeliveryRate: orderStats?.delivered_orders > 0 ? 
              (orderStats.delivered_orders / (orderStats.delivered_orders + orderStats.cancelled_orders)) * 100 : 0
          },
          topBarbers,
          popularServices,
          topProducts
        }
      });
    } catch (error) {
      console.error('DashboardController.getPerformanceMetrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch performance metrics',
        error: error.message
      });
    }
  }

  // Get recent activity
  static async getRecentActivity(req, res) {
    try {
      const [
        recentAppointments,
        recentOrders
      ] = await Promise.all([
        Dashboard.getRecentAppointments(10),
        Dashboard.getRecentOrders(10)
      ]);

      // Combine and sort by date
      const combinedActivity = [
        ...recentAppointments.map(apt => ({
          ...apt,
          type: 'appointment',
          date: apt.created_at
        })),
        ...recentOrders.map(order => ({
          ...order,
          type: 'order',
          date: order.created_at
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

      res.json({
        success: true,
        data: {
          recentActivity: combinedActivity
        }
      });
    } catch (error) {
      console.error('DashboardController.getRecentActivity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recent activity',
        error: error.message
      });
    }
  }
}

export default DashboardController;