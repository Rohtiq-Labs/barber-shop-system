import db from '../config/database.js';

class Dashboard {
  // Get overall statistics for admin dashboard
  static async getOverallStats() {
    try {
      const [stats] = await db.execute(`
        SELECT 
          (SELECT COUNT(*) FROM appointments WHERE status = 'pending') as pending_appointments,
          (SELECT COUNT(*) FROM appointments WHERE status = 'confirmed') as confirmed_appointments,
          (SELECT COUNT(*) FROM appointments WHERE status = 'completed') as completed_appointments,
          (SELECT COUNT(*) FROM appointments WHERE status = 'cancelled') as cancelled_appointments,
          (SELECT COUNT(*) FROM appointments WHERE DATE(appointment_date) = CURDATE()) as today_appointments,
          (SELECT COUNT(*) FROM barbers WHERE is_active = TRUE) as total_barbers,
          (SELECT COUNT(*) FROM barbers WHERE is_active = TRUE AND is_available = TRUE) as available_barbers,
          (SELECT COUNT(*) FROM services WHERE is_active = TRUE) as total_services,
          (SELECT COALESCE(SUM(s.price), 0) 
           FROM appointments a
           JOIN appointment_services aps ON a.id = aps.appointment_id
           JOIN services s ON aps.service_id = s.id
           WHERE a.status = 'completed' AND DATE(a.appointment_date) = CURDATE()) as today_revenue,
          (SELECT COALESCE(SUM(s.price), 0) 
           FROM appointments a
           JOIN appointment_services aps ON a.id = aps.appointment_id
           JOIN services s ON aps.service_id = s.id
           WHERE a.status = 'completed' AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as monthly_revenue,
          (SELECT COUNT(*) 
           FROM appointments 
           WHERE appointment_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as weekly_appointments
      `);

      return stats[0] || null;
    } catch (error) {
      console.error('Dashboard.getOverallStats error:', error);
      throw error;
    }
  }

  // Get daily revenue for the last 30 days
  static async getDailyRevenue(days = 30) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          DATE(a.appointment_date) as date,
          COALESCE(SUM(s.price), 0) as revenue,
          COUNT(a.id) as appointments_count
        FROM appointments a
        JOIN appointment_services aps ON a.id = aps.appointment_id
        JOIN services s ON aps.service_id = s.id
        WHERE a.status = 'completed' 
        AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(a.appointment_date)
        ORDER BY date DESC
      `, [days]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getDailyRevenue error:', error);
      throw error;
    }
  }

  // Get top performing barbers
  static async getTopBarbers(limit = 5) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          b.id, b.name, b.image,
          COUNT(a.id) as total_appointments,
          COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
          COALESCE(SUM(CASE WHEN a.status = 'completed' THEN s.price END), 0) as total_revenue,
          b.rating, 0 as total_reviews
        FROM barbers b
        LEFT JOIN appointments a ON b.id = a.barber_id
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        WHERE b.is_active = TRUE
        GROUP BY b.id
        ORDER BY completed_appointments DESC, total_revenue DESC
        LIMIT ?
      `, [limit]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getTopBarbers error:', error);
      throw error;
    }
  }

  // Get popular services
  static async getPopularServices(limit = 10) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          s.id, s.name, s.category, s.price,
          COUNT(aps.service_id) as booking_count,
          COALESCE(SUM(s.price), 0) as total_revenue
        FROM services s
        LEFT JOIN appointment_services aps ON s.id = aps.service_id
        LEFT JOIN appointments a ON aps.appointment_id = a.id
        WHERE s.is_active = TRUE 
        AND (a.status IS NULL OR a.status = 'completed')
        GROUP BY s.id
        ORDER BY booking_count DESC, total_revenue DESC
        LIMIT ?
      `, [limit]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getPopularServices error:', error);
      throw error;
    }
  }

  // Get recent appointments
  static async getRecentAppointments(limit = 10) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.id, a.customer_name, a.customer_email, a.customer_phone,
          a.appointment_date, a.appointment_time, a.status,
          b.name as barber_name,
          GROUP_CONCAT(s.name) as service_names,
          COALESCE(SUM(s.price), 0) as total_price,
          a.created_at
        FROM appointments a
        LEFT JOIN barbers b ON a.barber_id = b.id
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        GROUP BY a.id
        ORDER BY a.created_at DESC
        LIMIT ?
      `, [limit]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getRecentAppointments error:', error);
      throw error;
    }
  }

  // Get appointment status distribution
  static async getAppointmentStatusDistribution() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          status,
          COUNT(*) as count,
          ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM appointments)), 2) as percentage
        FROM appointments
        GROUP BY status
        ORDER BY count DESC
      `);

      return rows;
    } catch (error) {
      console.error('Dashboard.getAppointmentStatusDistribution error:', error);
      throw error;
    }
  }

  // Get monthly trends
  static async getMonthlyTrends(months = 12) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          DATE_FORMAT(a.appointment_date, '%Y-%m') as month,
          COUNT(a.id) as appointments_count,
          COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_count,
          COALESCE(SUM(CASE WHEN a.status = 'completed' THEN s.price END), 0) as revenue
        FROM appointments a
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        WHERE a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
        GROUP BY DATE_FORMAT(a.appointment_date, '%Y-%m')
        ORDER BY month DESC
      `, [months]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getMonthlyTrends error:', error);
      throw error;
    }
  }

  // Get order statistics
  static async getOrderStats() {
    try {
      const [stats] = await db.execute(`
        SELECT 
          (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
          (SELECT COUNT(*) FROM orders WHERE status = 'processing') as processing_orders,
          (SELECT COUNT(*) FROM orders WHERE status = 'delivered') as delivered_orders,
          (SELECT COUNT(*) FROM orders WHERE status = 'cancelled') as cancelled_orders,
          (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) as today_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered' AND DATE(created_at) = CURDATE()) as today_order_revenue,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as monthly_order_revenue,
          (SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as weekly_orders
      `);

      return stats[0] || null;
    } catch (error) {
      console.error('Dashboard.getOrderStats error:', error);
      throw error;
    }
  }

  // Get daily order revenue for the last 30 days
  static async getDailyOrderRevenue(days = 30) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          DATE(created_at) as date,
          COALESCE(SUM(total_amount), 0) as revenue,
          COUNT(id) as orders_count
        FROM orders
        WHERE status = 'delivered'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, [days]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getDailyOrderRevenue error:', error);
      throw error;
    }
  }

  // Get top selling products
  static async getTopSellingProducts(limit = 10) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          p.id, p.name, p.category, p.price, p.image,
          SUM(oi.quantity) as total_sold,
          COUNT(DISTINCT oi.order_id) as order_count,
          COALESCE(SUM(oi.total_price), 0) as total_revenue
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE p.is_active = TRUE 
        AND (o.status IS NULL OR o.status = 'delivered')
        GROUP BY p.id
        ORDER BY total_sold DESC, total_revenue DESC
        LIMIT ?
      `, [limit]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getTopSellingProducts error:', error);
      throw error;
    }
  }

  // Get recent orders
  static async getRecentOrders(limit = 10) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          o.id, o.order_number, o.customer_name, o.customer_email,
          o.order_status, o.payment_method, o.total_amount,
          o.created_at,
          COUNT(oi.id) as items_count
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT ?
      `, [limit]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getRecentOrders error:', error);
      throw error;
    }
  }

  // Get order status distribution
  static async getOrderStatusDistribution() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          status,
          COUNT(*) as count,
          ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders)), 2) as percentage
        FROM orders
        GROUP BY status
        ORDER BY count DESC
      `);

      return rows;
    } catch (error) {
      console.error('Dashboard.getOrderStatusDistribution error:', error);
      throw error;
    }
  }

  // Get combined revenue (appointments + orders)
  static async getCombinedRevenue(days = 30) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          DATE(COALESCE(a.appointment_date, o.created_at)) as date,
          COALESCE(SUM(CASE WHEN a.status = 'completed' THEN s.price END), 0) as appointment_revenue,
          COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount END), 0) as order_revenue,
          COALESCE(SUM(CASE WHEN a.status = 'completed' THEN s.price END), 0) + 
          COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount END), 0) as total_revenue
        FROM (
          SELECT appointment_date, status, id FROM appointments
          WHERE appointment_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
          UNION ALL
          SELECT created_at as appointment_date, status, id FROM orders
          WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        ) combined
        LEFT JOIN appointments a ON combined.id = a.id AND combined.appointment_date = a.appointment_date
        LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
        LEFT JOIN services s ON aps.service_id = s.id
        LEFT JOIN orders o ON combined.id = o.id AND combined.appointment_date = o.created_at
        GROUP BY DATE(COALESCE(a.appointment_date, o.created_at))
        ORDER BY date DESC
      `, [days, days]);

      return rows;
    } catch (error) {
      console.error('Dashboard.getCombinedRevenue error:', error);
      throw error;
    }
  }

  // Get customer statistics
  static async getCustomerStats() {
    try {
      const [stats] = await db.execute(`
        SELECT 
          (SELECT COUNT(DISTINCT customer_email) FROM appointments) as total_appointment_customers,
          (SELECT COUNT(DISTINCT customer_email) FROM orders) as total_order_customers,
          (SELECT COUNT(DISTINCT customer_email) 
           FROM (
             SELECT customer_email FROM appointments
             UNION
             SELECT customer_email FROM orders
           ) combined) as total_unique_customers,
          (SELECT COUNT(DISTINCT customer_email) 
           FROM appointments 
           WHERE appointment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as new_appointment_customers_30d,
          (SELECT COUNT(DISTINCT customer_email) 
           FROM orders 
           WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as new_order_customers_30d
      `);

      return stats[0] || null;
    } catch (error) {
      console.error('Dashboard.getCustomerStats error:', error);
      throw error;
    }
  }
}

export default Dashboard;
