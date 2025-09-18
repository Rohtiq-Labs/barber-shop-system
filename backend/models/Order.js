import db from '../config/database.js';

class Order {
  // Create new order (simple version for barber shop)
  static async create(orderData, orderItems) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Generate simple order number
      const orderNumber = `BH${Date.now()}`;

      // Create order - matching your exact database table structure
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (
          order_number, customer_name, customer_email, customer_phone, 
          billing_address, shipping_address, shipping_cost, notes,
          order_status, payment_id, payment_method, payment_status,
          subtotal, tax_amount, total_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderNumber,
        orderData.customer_name,
        orderData.customer_email,
        orderData.customer_phone,
        orderData.billing_address || orderData.shipping_address,
        orderData.shipping_address,
        0, // shipping_cost - free for barber shop
        orderData.notes || '',
        'pending', // order_status
        null, // payment_id
        orderData.payment_method || 'credit_card',
        'pending', // payment_status
        orderData.subtotal,
        orderData.tax_amount,
        orderData.total_amount,
        'pending' // status
      ]);

      const orderId = orderResult.insertId;

      // Add order items and update stock
      for (const item of orderItems) {
        // Add order item
        await connection.execute(`
          INSERT INTO order_items (order_id, product_id, quantity, price, total_price)
          VALUES (?, ?, ?, ?, ?)
        `, [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          item.total_price
        ]);

        // Update product stock (simple decrease)
        await connection.execute(`
          UPDATE products 
          SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [item.quantity, item.product_id]);
      }

      await connection.commit();
      return { orderId, orderNumber };
      
    } catch (error) {
      await connection.rollback();
      console.error('Order.create error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get order by ID (for email notifications)
  static async getById(id) {
    try {
      // Get order details
      const [orderRows] = await db.execute(`
        SELECT 
          id, order_number, customer_name, customer_email, customer_phone,
          shipping_address, total_amount, status, 
          payment_status, payment_method,
          subtotal, tax_amount,
          created_at, updated_at
        FROM orders WHERE id = ?
      `, [id]);

      if (orderRows.length === 0) return null;

      const order = orderRows[0];

      // Get order items with product details
      const [itemRows] = await db.execute(`
        SELECT oi.*, p.name as product_name, p.image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);

      // Convert relative image paths to full URLs
      order.items = itemRows.map(item => ({
        ...item,
        image: item.image && item.image.startsWith('/uploads/') 
          ? `http://localhost:5000${item.image}`
          : item.image
      }));
      return order;
    } catch (error) {
      console.error('Order.getById error:', error);
      throw error;
    }
  }

  // Get order by order number (for customer lookup)
  static async getByOrderNumber(orderNumber) {
    try {
      // Get order details
      const [orderRows] = await db.execute(`
        SELECT 
          id, order_number, customer_name, customer_email, customer_phone,
          shipping_address, total_amount, status, 
          payment_status, payment_method,
          subtotal, tax_amount,
          created_at, updated_at
        FROM orders WHERE order_number = ?
      `, [orderNumber]);

      if (orderRows.length === 0) return null;

      const order = orderRows[0];

      // Get order items with product details
      const [itemRows] = await db.execute(`
        SELECT oi.*, p.name as product_name, p.image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);

      // Convert relative image paths to full URLs
      order.items = itemRows.map(item => ({
        ...item,
        image: item.image && item.image.startsWith('/uploads/') 
          ? `http://localhost:5000${item.image}`
          : item.image
      }));
      return order;
    } catch (error) {
      console.error('Order.getByOrderNumber error:', error);
      throw error;
    }
  }

  // Get orders by customer email (simple customer lookup)
  static async getByCustomerEmail(email) {
    try {
      const [rows] = await db.execute(`
        SELECT id, order_number, customer_name, total_amount, 
               status, payment_status, created_at
        FROM orders 
        WHERE customer_email = ?
        ORDER BY created_at DESC
        LIMIT 10
      `, [email]);
      return rows;
    } catch (error) {
      console.error('Order.getByCustomerEmail error:', error);
      throw error;
    }
  }

  // Update order status (for admin)
  static async updateStatus(id, orderStatus, paymentStatus = null) {
    try {
      // Update both 'order_status' and 'status' columns to keep them synchronized
      const query = `UPDATE orders SET order_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const params = [orderStatus, orderStatus, id];

      const [result] = await db.execute(query, params);
      
      console.log(`🔄 Order status update: ID ${id} -> ${orderStatus} (affected rows: ${result.affectedRows})`);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Order.updateStatus error:', error);
      throw error;
    }
  }

  // Get all orders (for admin panel)
  static async getAll(limit = 50, offset = 0) {
    try {
      const [rows] = await db.execute(`
        SELECT o.*, 
               COUNT(oi.id) as total_items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Order.getAll error:', error);
      throw error;
    }
  }

  // Simple order analytics (for admin dashboard)
  static async getBasicStats() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          COUNT(*) as total_orders,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as average_order_value,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders
        FROM orders
      `);
      return rows[0];
    } catch (error) {
      console.error('Order.getBasicStats error:', error);
      throw error;
    }
  }

  // ADMIN METHODS (for admin panel)

  // Update order details (admin)
  static async update(id, orderData) {
    try {
      // Build dynamic query based on provided fields
      const fields = [];
      const values = [];
      
      if (orderData.customer_name !== undefined) {
        fields.push('customer_name = ?');
        values.push(orderData.customer_name);
      }
      if (orderData.customer_email !== undefined) {
        fields.push('customer_email = ?');
        values.push(orderData.customer_email);
      }
      if (orderData.customer_phone !== undefined) {
        fields.push('customer_phone = ?');
        values.push(orderData.customer_phone);
      }
      if (orderData.billing_address !== undefined) {
        fields.push('billing_address = ?');
        values.push(orderData.billing_address);
      }
      if (orderData.shipping_address !== undefined) {
        fields.push('shipping_address = ?');
        values.push(orderData.shipping_address);
      }
      if (orderData.notes !== undefined) {
        fields.push('notes = ?');
        values.push(orderData.notes);
      }
      if (orderData.order_status !== undefined) {
        fields.push('order_status = ?');
        values.push(orderData.order_status);
      }
      if (orderData.payment_method !== undefined) {
        fields.push('payment_method = ?');
        values.push(orderData.payment_method);
      }
      if (orderData.payment_status !== undefined) {
        fields.push('payment_status = ?');
        values.push(orderData.payment_status);
      }
      if (orderData.subtotal !== undefined) {
        fields.push('subtotal = ?');
        values.push(orderData.subtotal);
      }
      if (orderData.tax_amount !== undefined) {
        fields.push('tax_amount = ?');
        values.push(orderData.tax_amount);
      }
      if (orderData.total_amount !== undefined) {
        fields.push('total_amount = ?');
        values.push(orderData.total_amount);
      }
      if (orderData.status !== undefined) {
        fields.push('status = ?');
        values.push(orderData.status);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = CURRENT_TIMESTAMP');
      
      // Add the WHERE condition
      values.push(id);
      
      const query = `
        UPDATE orders 
        SET ${fields.join(', ')}
        WHERE id = ?
      `;
      
      const [result] = await db.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Order.update error:', error);
      throw error;
    }
  }

  // Delete order (admin)
  static async delete(id) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Delete order items first
      await connection.execute(`DELETE FROM order_items WHERE order_id = ?`, [id]);
      
      // Delete the order
      const [result] = await connection.execute(`DELETE FROM orders WHERE id = ?`, [id]);
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Order.delete error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get order items with product details (admin)
  static async getOrderItems(orderId) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, oi.total_price,
          p.name as product_name, p.description as product_description, p.image as product_image,
          p.sku as product_sku, p.stock_quantity as current_stock
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
        ORDER BY oi.id
      `, [orderId]);
      
      // Convert relative image paths to full URLs
      return rows.map(item => ({
        ...item,
        product_image: item.product_image && item.product_image.startsWith('/uploads/') 
          ? `http://localhost:5000${item.product_image}`
          : item.product_image
      }));
    } catch (error) {
      console.error('Order.getOrderItems error:', error);
      throw error;
    }
  }

  // Update order item (admin)
  static async updateOrderItem(itemId, itemData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get current item details
      const [currentItem] = await connection.execute(`
        SELECT oi.*, o.id as order_id 
        FROM order_items oi 
        JOIN orders o ON oi.order_id = o.id 
        WHERE oi.id = ?
      `, [itemId]);

      if (currentItem.length === 0) {
        throw new Error('Order item not found');
      }

      const oldQuantity = currentItem[0].quantity;
      const newQuantity = itemData.quantity || oldQuantity;
      const productId = currentItem[0].product_id;
      const orderId = currentItem[0].order_id;

      // Update the order item
      const [result] = await connection.execute(`
        UPDATE order_items 
        SET quantity = ?, total_price = price * ?
        WHERE id = ?
      `, [newQuantity, newQuantity, itemId]);

      // Update product stock (adjust for quantity change)
      const stockChange = newQuantity - oldQuantity;
      if (stockChange !== 0) {
        await connection.execute(`
          UPDATE products 
          SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [stockChange, productId]);
      }

      // Recalculate order totals
      await connection.execute(`
        UPDATE orders 
        SET 
          subtotal = (SELECT SUM(total_price) FROM order_items WHERE order_id = ?),
          tax_amount = (SELECT SUM(total_price) FROM order_items WHERE order_id = ?) * 0.0875,
          total_amount = (SELECT SUM(total_price) FROM order_items WHERE order_id = ?) * 1.0875,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [orderId, orderId, orderId, orderId]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Order.updateOrderItem error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Add item to existing order
  static async addOrderItem(orderId, productId, quantity) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get product details
      const [productRows] = await connection.execute(
        'SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_active = 1',
        [productId]
      );

      if (productRows.length === 0) {
        throw new Error('Product not found or inactive');
      }

      const product = productRows[0];

      // Check if product is already in the order
      const [existingRows] = await connection.execute(
        'SELECT id, quantity FROM order_items WHERE order_id = ? AND product_id = ?',
        [orderId, productId]
      );

      if (existingRows.length > 0) {
        // Update existing item quantity
        const newQuantity = existingRows[0].quantity + quantity;
        await connection.execute(
          'UPDATE order_items SET quantity = ?, total_price = ? * ? WHERE id = ?',
          [newQuantity, newQuantity, product.price, existingRows[0].id]
        );
      } else {
        // Add new item
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price, total_price) VALUES (?, ?, ?, ?, ?)',
          [orderId, productId, quantity, product.price, quantity * product.price]
        );
      }

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [quantity, productId]
      );

      // Recalculate order totals
      await connection.execute(`
        UPDATE orders 
        SET 
          subtotal = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?),
          tax_amount = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?) * 0.0875,
          total_amount = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?) * 1.0875,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [orderId, orderId, orderId, orderId]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Order.addOrderItem error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete order item (admin)
  static async deleteOrderItem(itemId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get item details before deletion
      const [itemDetails] = await connection.execute(`
        SELECT oi.*, o.id as order_id 
        FROM order_items oi 
        JOIN orders o ON oi.order_id = o.id 
        WHERE oi.id = ?
      `, [itemId]);

      if (itemDetails.length === 0) {
        throw new Error('Order item not found');
      }

      const item = itemDetails[0];
      const productId = item.product_id;
      const orderId = item.order_id;
      const quantity = item.quantity;

      // Delete the order item
      const [result] = await connection.execute(`DELETE FROM order_items WHERE id = ?`, [itemId]);

      // Restore product stock
      await connection.execute(`
        UPDATE products 
        SET stock_quantity = stock_quantity + ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [quantity, productId]);

      // Recalculate order totals
      await connection.execute(`
        UPDATE orders 
        SET 
          subtotal = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?),
          tax_amount = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?) * 0.0875,
          total_amount = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?) * 1.0875,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [orderId, orderId, orderId, orderId]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Order.deleteOrderItem error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Order;
