import Order from '../models/Order.js';
import Product from '../models/Product.js';

class OrderController {
  // POST /api/orders - Create new order (simple)
  static async createOrder(req, res) {
    try {
      const { orderData, items } = req.body;

      // Basic validation
      if (!orderData.customer_name || !orderData.customer_email || !items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: customer_name, customer_email, and items'
        });
      }

      // Prepare order items and calculate totals
      const orderItems = [];
      let calculatedSubtotal = 0;

      for (const item of items) {
        // Get product details to verify price
        const product = await Product.getById(item.product_id);
        
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product_id}`
          });
        }

        const itemTotal = product.price * item.quantity;
        calculatedSubtotal += itemTotal;

        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
          total_price: itemTotal
        });
      }

      // Simple tax calculation (8.75%)
      const taxAmount = calculatedSubtotal * 0.0875;
      const totalAmount = calculatedSubtotal + taxAmount;

      // Prepare final order data
      const finalOrderData = {
        ...orderData,
        subtotal: calculatedSubtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount
      };

      // Create order
      const { orderId, orderNumber } = await Order.create(finalOrderData, orderItems);

      console.log(`✅ Order created successfully: ${orderNumber} (ID: ${orderId})`);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          order_id: orderId,
          order_number: orderNumber,
          total_amount: totalAmount
        }
      });

    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message
      });
    }
  }

  // GET /api/orders/lookup/:orderNumber - Get order by order number
  static async getOrderByNumber(req, res) {
    try {
      const { orderNumber } = req.params;
      const order = await Order.getByOrderNumber(orderNumber);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order fetched successfully',
        data: order
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      });
    }
  }

  // POST /api/orders/customer-lookup - Get orders by customer email
  static async getCustomerOrders(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const orders = await Order.getByCustomerEmail(email);
      
      res.json({
        success: true,
        message: 'Customer orders fetched successfully',
        data: orders
      });
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer orders',
        error: error.message
      });
    }
  }

  // ADMIN METHODS (for admin panel)

  // GET /api/orders - Get all orders (admin)
  static async getAllOrders(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const orders = await Order.getAll(parseInt(limit), parseInt(offset));
      
      res.json({
        success: true,
        message: 'Orders fetched successfully',
        data: orders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  }

  // PUT /api/orders/:id/status - Update order status (admin)
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { order_status, payment_status, notify_customer } = req.body;
      
      
      const updated = await Order.updateStatus(id, order_status, payment_status);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      console.log(`✅ Order status updated: ${id} -> ${order_status}`);

      res.json({
        success: true,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error.message
      });
    }
  }

  // GET /api/orders/stats - Get basic order statistics (admin)
  static async getOrderStats(req, res) {
    try {
      const stats = await Order.getBasicStats();
      
      res.json({
        success: true,
        message: 'Order statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order stats',
        error: error.message
      });
    }
  }

  // GET /api/orders/:id - Get order by ID (admin)
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.getById(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order fetched successfully',
        data: order
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      });
    }
  }

  // PUT /api/orders/:id - Update order (admin)
  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const orderData = req.body;
      
      // Convert numeric fields if provided
      if (orderData.subtotal) {
        orderData.subtotal = parseFloat(orderData.subtotal);
      }
      if (orderData.tax_amount) {
        orderData.tax_amount = parseFloat(orderData.tax_amount);
      }
      if (orderData.total_amount) {
        orderData.total_amount = parseFloat(orderData.total_amount);
      }

      const updated = await Order.update(id, orderData);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order updated successfully'
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order',
        error: error.message
      });
    }
  }

  // DELETE /api/orders/:id - Delete order (admin)
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Order.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete order',
        error: error.message
      });
    }
  }

  // GET /api/orders/:id/items - Get order items (admin)
  static async getOrderItems(req, res) {
    try {
      const { id } = req.params;
      const items = await Order.getOrderItems(id);
      
      res.json({
        success: true,
        message: 'Order items fetched successfully',
        data: items
      });
    } catch (error) {
      console.error('Error fetching order items:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order items',
        error: error.message
      });
    }
  }

  // PUT /api/orders/items/:id - Update order item (admin)
  static async updateOrderItem(req, res) {
    try {
      const { id } = req.params;
      const itemData = req.body;
      
      // Convert quantity to integer if provided
      if (itemData.quantity) {
        itemData.quantity = parseInt(itemData.quantity);
      }

      const updated = await Order.updateOrderItem(id, itemData);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Order item not found'
        });
      }

      res.json({
        success: true,
        message: 'Order item updated successfully'
      });
    } catch (error) {
      console.error('Error updating order item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order item',
        error: error.message
      });
    }
  }

  // POST /api/orders/:id/items - Add item to order (admin)
  static async addOrderItem(req, res) {
    try {
      const { id } = req.params;
      const { product_id, quantity } = req.body;
      
      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and valid quantity are required'
        });
      }

      const added = await Order.addOrderItem(id, product_id, quantity);
      
      if (!added) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or product not available'
        });
      }

      res.json({
        success: true,
        message: 'Item added to order successfully'
      });
    } catch (error) {
      console.error('Error adding order item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add item to order',
        error: error.message
      });
    }
  }

  // DELETE /api/orders/items/:id - Delete order item (admin)
  static async deleteOrderItem(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Order.deleteOrderItem(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Order item not found'
        });
      }

      res.json({
        success: true,
        message: 'Order item deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting order item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete order item',
        error: error.message
      });
    }
  }
}

export default OrderController;
