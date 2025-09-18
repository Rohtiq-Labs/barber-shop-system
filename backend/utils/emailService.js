// Simple email service for order confirmations
// For production, integrate with services like SendGrid, Mailgun, or AWS SES

class EmailService {
  // Simple email template for order confirmation
  static generateOrderConfirmationHTML(orderData, orderItems) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - B&H Barber Shop</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #000; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; }
    .order-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 18px; color: #d97706; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>B&H Barber Shop</h1>
      <h2>Order Confirmation</h2>
    </div>
    
    <div class="content">
      <h3>Thank you for your order, ${orderData.customer_name}!</h3>
      <p>We've received your order and will prepare it for pickup. You'll receive another email when your order is ready.</p>
      
      <div class="order-details">
        <h4>Order Details</h4>
        <p><strong>Order Number:</strong> ${orderData.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
        <p><strong>Customer:</strong> ${orderData.customer_name}</p>
        <p><strong>Email:</strong> ${orderData.customer_email}</p>
        <p><strong>Phone:</strong> ${orderData.customer_phone}</p>
        
        <h4>Shipping Address</h4>
        <p>${orderData.shipping_address}</p>
        
        <h4>Items Ordered</h4>
        ${orderItems.map(item => `
          <div class="item">
            <span>${item.product_name} × ${item.quantity}</span>
            <span>$${item.total_price.toFixed(2)}</span>
          </div>
        `).join('')}
        
        <div class="item total">
          <span>Total Amount</span>
          <span>$${orderData.total_amount.toFixed(2)}</span>
        </div>
      </div>
      
      <h4>What's Next?</h4>
      <ul>
        <li>We'll prepare your order within 24 hours</li>
        <li>You'll receive a call when your order is ready for pickup</li>
        <li>Visit our shop at your convenience to collect your items</li>
      </ul>
      
      <p>If you have any questions about your order, please contact us:</p>
      <ul>
        <li>Phone: (555) 123-4567</li>
        <li>Email: orders@bhbarbershop.com</li>
        <li>Address: 123 Main Street, East Village, NYC</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing B&H Barber Shop!</p>
      <p>This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  // Send order confirmation email (mock implementation)
  static async sendOrderConfirmation(orderData, orderItems) {
    try {
      console.log('📧 ORDER CONFIRMATION EMAIL');
      console.log('================================');
      console.log('To:', orderData.customer_email);
      console.log('Subject: Order Confirmation - ' + orderData.order_number);
      console.log('Order Number:', orderData.order_number);
      console.log('Customer:', orderData.customer_name);
      console.log('Total:', '$' + orderData.total_amount.toFixed(2));
      console.log('Items:', orderItems.length);
      
      // Log items
      orderItems.forEach(item => {
        console.log(`  - ${item.product_name} × ${item.quantity} = $${item.total_price.toFixed(2)}`);
      });
      
      console.log('================================');
      
      // In production, replace this with actual email sending:
      // 
      // Example with SendGrid:
      // const msg = {
      //   to: orderData.customer_email,
      //   from: 'orders@bhbarbershop.com',
      //   subject: `Order Confirmation - ${orderData.order_number}`,
      //   html: this.generateOrderConfirmationHTML(orderData, orderItems)
      // };
      // await sgMail.send(msg);
      
      // Example with Nodemailer:
      // const transporter = nodemailer.createTransporter({...});
      // await transporter.sendMail({
      //   from: '"B&H Barber Shop" <orders@bhbarbershop.com>',
      //   to: orderData.customer_email,
      //   subject: `Order Confirmation - ${orderData.order_number}`,
      //   html: this.generateOrderConfirmationHTML(orderData, orderItems)
      // });
      
      return {
        success: true,
        message: 'Order confirmation email sent successfully',
        emailData: {
          to: orderData.customer_email,
          subject: `Order Confirmation - ${orderData.order_number}`,
          orderNumber: orderData.order_number
        }
      };
      
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Failed to send confirmation email',
        error: error.message
      };
    }
  }

  // Send order ready notification (when admin marks order as ready)
  static async sendOrderReadyNotification(orderData) {
    try {
      console.log('📧 ORDER READY NOTIFICATION');
      console.log('============================');
      console.log('To:', orderData.customer_email);
      console.log('Subject: Your Order is Ready - ' + orderData.order_number);
      console.log('Customer:', orderData.customer_name);
      console.log('============================');
      
      return {
        success: true,
        message: 'Order ready notification sent successfully'
      };
      
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Failed to send ready notification',
        error: error.message
      };
    }
  }

  // Admin notification for new orders
  static async sendAdminOrderNotification(orderData, orderItems) {
    try {
      console.log('📧 ADMIN ORDER NOTIFICATION');
      console.log('=============================');
      console.log('New order received: ' + orderData.order_number);
      console.log('Customer: ' + orderData.customer_name);
      console.log('Phone: ' + orderData.customer_phone);
      console.log('Total: $' + orderData.total_amount.toFixed(2));
      console.log('Items: ' + orderItems.length);
      orderItems.forEach(item => {
        console.log(`  - ${item.product_name} × ${item.quantity}`);
      });
      console.log('=============================');
      
      return {
        success: true,
        message: 'Admin notification sent successfully'
      };
      
    } catch (error) {
      console.error('Admin notification error:', error);
      return {
        success: false,
        message: 'Failed to send admin notification',
        error: error.message
      };
    }
  }
}

export default EmailService;
