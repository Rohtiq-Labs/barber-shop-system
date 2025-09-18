import db from '../config/database.js';

class Product {
  // Get all active products (simple)
  static async getAll() {
    try {
      const [rows] = await db.execute(`
        SELECT id, name, description, price, image, stock_quantity, 
               is_featured, sku, created_at, updated_at
        FROM products 
        WHERE is_active = 1
        ORDER BY display_order ASC, name ASC
      `);
      
      // Convert price from string to number
      return rows.map(row => ({
        ...row,
        price: parseFloat(row.price)
      }));
    } catch (error) {
      console.error('Product.getAll error:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT id, name, description, price, image, stock_quantity, 
               is_featured, sku, created_at, updated_at
        FROM products 
        WHERE id = ? AND is_active = 1
      `, [id]);
      
      if (rows[0]) {
        return {
          ...rows[0],
          price: parseFloat(rows[0].price)
        };
      }
      return null;
    } catch (error) {
      console.error('Product.getById error:', error);
      throw error;
    }
  }

  // Get featured products only
  static async getFeatured() {
    try {
      const [rows] = await db.execute(`
        SELECT id, name, description, price, image, stock_quantity, 
               is_featured, sku
        FROM products 
        WHERE is_active = 1 AND is_featured = 1
        ORDER BY display_order ASC
      `);
      
      // Convert price from string to number
      return rows.map(row => ({
        ...row,
        price: parseFloat(row.price)
      }));
    } catch (error) {
      console.error('Product.getFeatured error:', error);
      throw error;
    }
  }

  // Simple stock check
  static async checkStock(productId, requestedQuantity) {
    try {
      const [rows] = await db.execute(`
        SELECT stock_quantity FROM products 
        WHERE id = ? AND is_active = 1
      `, [productId]);
      
      if (rows.length === 0) return false;
      return rows[0].stock_quantity >= requestedQuantity;
    } catch (error) {
      console.error('Product.checkStock error:', error);
      throw error;
    }
  }

  // Update stock after order (simple)
  static async updateStock(id, quantity) {
    try {
      const [result] = await db.execute(`
        UPDATE products 
        SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND is_active = 1
      `, [quantity, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Product.updateStock error:', error);
      throw error;
    }
  }

  // Admin: Create new product (for admin panel later)
  static async create(productData) {
    try {
      const [result] = await db.execute(`
        INSERT INTO products (name, description, price, image, stock_quantity, sku, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        productData.name,
        productData.description,
        productData.price,
        productData.image,
        productData.stock_quantity || 0,
        productData.sku,
        productData.is_featured || 0
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Product.create error:', error);
      throw error;
    }
  }

  // Admin: Update product
  static async update(id, productData) {
    try {
      // Build dynamic query based on provided fields
      const fields = [];
      const values = [];
      
      if (productData.name !== undefined) {
        fields.push('name = ?');
        values.push(productData.name);
      }
      if (productData.description !== undefined) {
        fields.push('description = ?');
        values.push(productData.description);
      }
      if (productData.price !== undefined) {
        fields.push('price = ?');
        values.push(productData.price);
      }
      if (productData.image !== undefined) {
        fields.push('image = ?');
        values.push(productData.image);
      }
      if (productData.stock_quantity !== undefined) {
        fields.push('stock_quantity = ?');
        values.push(productData.stock_quantity);
      }
      if (productData.is_featured !== undefined) {
        fields.push('is_featured = ?');
        values.push(productData.is_featured);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = CURRENT_TIMESTAMP');
      
      // Add the WHERE condition
      values.push(id);
      
      const query = `
        UPDATE products 
        SET ${fields.join(', ')}
        WHERE id = ? AND is_active = 1
      `;
      
      const [result] = await db.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Product.update error:', error);
      throw error;
    }
  }

  // Admin: Delete product (hard delete)
  static async delete(id) {
    try {
      const [result] = await db.execute(`
        DELETE FROM products 
        WHERE id = ?
      `, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Product.delete error:', error);
      throw error;
    }
  }
}

export default Product;
