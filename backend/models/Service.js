import db from '../config/database.js';



class Service {
  // Get all active services
  static async getAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM services WHERE is_active = TRUE ORDER BY category, name'
      );
      return rows;
    } catch (error) {
      console.error('Service.getAll error:', error);
      throw error;
    }

  }

  // Get services by category
  static async getByCategory(category) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM services WHERE category = ? AND is_active = TRUE ORDER BY name',
        [category]
      );
      return rows;
    } catch (error) {
      console.error('Service.getByCategory error:', error);
      throw error;
    }
  }

  // Get service by ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM services WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Service.getById error:', error);
      throw error;
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const [rows] = await db.execute(
        'SELECT DISTINCT category FROM services WHERE is_active = TRUE AND category IS NOT NULL AND category != "" ORDER BY category'
      );
      return rows.map(row => row.category).filter(cat => cat && cat.trim() !== '');
    } catch (error) {
      console.error('Service.getCategories error:', error);
      throw error;
    }
  }

  // Create new service
  static async create(serviceData) {
    try {
      const { name, description, price, duration, category } = serviceData;
      const [result] = await db.execute(
        `INSERT INTO services (name, description, price, duration, category, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, TRUE, NOW(), NOW())`,
        [name, description, price, duration, category]
      );
      return result.insertId;
    } catch (error) {
      console.error('Service.create error:', error);
      throw error;
    }
  }

  // Update service
  static async update(id, serviceData) {
    try {
      // Build dynamic query based on provided fields
      const updateFields = [];
      const updateValues = [];
      
      if (serviceData.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(serviceData.name);
      }
      if (serviceData.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(serviceData.description);
      }
      if (serviceData.price !== undefined) {
        updateFields.push('price = ?');
        updateValues.push(serviceData.price);
      }
      if (serviceData.duration !== undefined) {
        updateFields.push('duration = ?');
        updateValues.push(serviceData.duration);
      }
      if (serviceData.category !== undefined) {
        updateFields.push('category = ?');
        updateValues.push(serviceData.category);
      }
      
      // Always update the updated_at field
      updateFields.push('updated_at = NOW()');
      
      // Add the id for the WHERE clause
      updateValues.push(id);
      
      const query = `UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`;
      
      console.log('Service update query:', query);
      console.log('Service update values:', updateValues);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Service.update error:', error);
      throw error;
    }
  }

  // Delete service (soft delete - set is_active to FALSE)
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'UPDATE services SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Service.delete error:', error);
      throw error;
    }
  }

  // Debug methods to check database structure
  static async getTableStructure() {
    try {
      const [rows] = await db.execute('DESCRIBE services');
      return rows;
    } catch (error) {
      console.error('Service.getTableStructure error:', error);
      throw error;
    }
  }

  static async getForeignKeys() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          CONSTRAINT_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'services' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
      `);
      return rows;
    } catch (error) {
      console.error('Service.getForeignKeys error:', error);
      return [];
    }
  }

  static getCategoryRecommendations(structure, foreignKeys) {
    const categoryColumn = structure.find(col => col.Field === 'category');
    const categoryForeignKeys = foreignKeys.filter(fk => fk.COLUMN_NAME === 'category');
    
    return {
      currentCategoryType: categoryColumn ? categoryColumn.Type : 'Not found',
      hasForeignKeys: categoryForeignKeys.length > 0,
      foreignKeyReferences: categoryForeignKeys,
      recommendations: categoryForeignKeys.length > 0 
        ? [
            'Category column has foreign key constraints',
            'Consider creating a separate categories table',
            'Use category_id instead of category name',
            'This explains why direct category updates may fail'
          ]
        : [
            'No foreign key constraints found on category column',
            'Direct category updates should work',
            'Consider checking for triggers or other constraints'
          ]
    };
  }
}

export default Service;