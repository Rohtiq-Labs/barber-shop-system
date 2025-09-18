import Product from '../models/Product.js';

class ProductController {
  // GET /api/products - Get all products
  static async getAllProducts(req, res) {
    try {
      const products = await Product.getAll();
      
      // Convert relative image paths to full URLs
      const productsWithFullUrls = products.map(product => ({
        ...product,
        image: product.image && product.image.startsWith('/uploads/') 
          ? `http://localhost:5000${product.image}`
          : product.image
      }));
      
      res.json({
        success: true,
        message: 'Products fetched successfully',
        data: productsWithFullUrls
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }
  }

  // GET /api/products/:id - Get product by ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Convert relative image path to full URL
      const productWithFullUrl = {
        ...product,
        image: product.image && product.image.startsWith('/uploads/') 
          ? `http://localhost:5000${product.image}`
          : product.image
      };

      res.json({
        success: true,
        message: 'Product fetched successfully',
        data: productWithFullUrl
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      });
    }
  }

  // GET /api/products/featured - Get featured products only
  static async getFeaturedProducts(req, res) {
    try {
      const products = await Product.getFeatured();
      
      // Convert relative image paths to full URLs
      const productsWithFullUrls = products.map(product => ({
        ...product,
        image: product.image && product.image.startsWith('/uploads/') 
          ? `http://localhost:5000${product.image}`
          : product.image
      }));
      
      res.json({
        success: true,
        message: 'Featured products fetched successfully',
        data: productsWithFullUrls
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured products',
        error: error.message
      });
    }
  }

  // POST /api/products/check-stock - Check stock availability (enhanced)
  static async checkStock(req, res) {
    try {
      const { items } = req.body; // Array of {product_id, quantity}
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required'
        });
      }

      const stockResults = [];
      for (const item of items) {
        // Get product details including current stock
        const product = await Product.getById(item.product_id);
        
        if (!product) {
          stockResults.push({
            product_id: item.product_id,
            requested_quantity: item.quantity,
            available: false,
            available_quantity: 0,
            message: 'Product not found'
          });
          continue;
        }

        const isAvailable = product.stock_quantity >= item.quantity;
        stockResults.push({
          product_id: item.product_id,
          requested_quantity: item.quantity,
          available: isAvailable,
          available_quantity: product.stock_quantity,
          message: isAvailable 
            ? 'Stock available' 
            : `Only ${product.stock_quantity} available, requested ${item.quantity}`
        });
      }

      res.json({
        success: true,
        message: 'Stock checked successfully',
        data: stockResults
      });
    } catch (error) {
      console.error('Error checking stock:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check stock',
        error: error.message
      });
    }
  }

  // ADMIN METHODS (for admin panel later)
  
  // POST /api/products - Create new product (admin)
  static async createProduct(req, res) {
    try {
      console.log('=== CREATE PRODUCT DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('Request headers:', req.headers);
      
      const productData = req.body;
      
      // Basic validation
      const requiredFields = ['name', 'price', 'stock_quantity'];
      const missingFields = requiredFields.filter(field => !productData[field]);
      
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Handle image upload
      if (req.file) {
        productData.image = `http://localhost:5000/uploads/products/${req.file.filename}`;
      } else {
        productData.image = 'http://localhost:5000/images/default-product.jpg';
      }

      // Convert price and stock_quantity to numbers
      productData.price = parseFloat(productData.price);
      productData.stock_quantity = parseInt(productData.stock_quantity);
      productData.is_featured = productData.is_featured ? 1 : 0;

      const productId = await Product.create(productData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { id: productId }
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message
      });
    }
  }

  // PUT /api/products/:id - Update product (admin)
  static async updateProduct(req, res) {
    try {
      console.log('=== UPDATE PRODUCT DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const { id } = req.params;
      const productData = req.body;
      
      // Handle image upload - only update if new file is uploaded
      if (req.file) {
        productData.image = `http://localhost:5000/uploads/products/${req.file.filename}`;
      } else {
        // If no new file, remove image from update data to keep existing image
        delete productData.image;
      }

      // Convert price and stock_quantity to numbers if provided
      if (productData.price) {
        productData.price = parseFloat(productData.price);
      }
      if (productData.stock_quantity) {
        productData.stock_quantity = parseInt(productData.stock_quantity);
      }
      if (productData.is_featured !== undefined) {
        productData.is_featured = productData.is_featured ? 1 : 0;
      }

      const updated = await Product.update(id, productData);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  }

  // DELETE /api/products/:id - Delete product (admin)
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Product.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }
}

export default ProductController;



