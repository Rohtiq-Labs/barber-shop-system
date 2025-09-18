# 🪒 Barber Shop Management System

A complete full-stack barber shop management system with admin panel, booking system, and e-commerce features.

## 🚀 Features

### **Frontend (Next.js + TypeScript)**
- **Modern UI/UX** with Tailwind CSS
- **Responsive Design** for all devices
- **Admin Dashboard** with comprehensive management tools
- **Booking System** with real-time availability
- **E-commerce** with shopping cart and checkout
- **Global Search** across all data
- **Export Functionality** for reports

### **Backend (Node.js + Express)**
- **RESTful API** with comprehensive endpoints
- **MySQL Database** with proper relationships
- **File Upload** for images (barbers, products)
- **Authentication & Authorization**
- **Data Validation** and error handling
- **Email Service** integration

### **Admin Panel Features**
- **Dashboard Analytics** with key metrics
- **Appointment Management** (view, edit, delete)
- **Barber Management** (CRUD operations)
- **Service Management** (pricing, duration)
- **Product Management** (inventory, pricing)
- **Order Management** (status tracking)
- **Quick Actions** with modal forms
- **Global Search** across all entities

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management
- **Axios** - HTTP client

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Multer** - File uploads
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 📁 Project Structure

```
Barber/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/             # API controllers
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── barberController.js
│   │   ├── dashboardController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── serviceController.js
│   │   └── timeBlockController.js
│   ├── middleware/              # Custom middleware
│   │   ├── upload.js
│   │   ├── uploadBarberImage.js
│   │   └── validation.js
│   ├── models/                  # Database models
│   │   ├── Appointment.js
│   │   ├── Barber.js
│   │   ├── Dashboard.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── Service.js
│   ├── routes/                  # API routes
│   │   ├── admin.js
│   │   ├── appointments.js
│   │   ├── barbers.js
│   │   ├── dashboard.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── services.js
│   │   └── timeBlocks.js
│   ├── uploads/                 # File uploads
│   │   ├── barbers/
│   │   └── products/
│   ├── utils/
│   │   └── emailService.js
│   ├── package.json
│   └── server.js               # Main server file
├── frontend/
│   ├── src/app/                # Next.js app directory
│   │   ├── admin/              # Admin panel
│   │   ├── booking/            # Booking system
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout process
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React context
│   │   ├── products/           # Product catalog
│   │   └── services/           # Service listings
│   ├── public/                 # Static assets
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/barber-shop-system.git
   cd barber-shop-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Start the server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Database Setup**
   - Create a MySQL database
   - Import the database schema
   - Update database credentials in backend/.env

### **Environment Variables**

Create a `.env` file in the backend directory:

```env
# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=barber_shop

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📊 Database Schema

### **Tables**
- **users** - User accounts
- **barbers** - Barber information
- **services** - Available services
- **appointments** - Booking records
- **products** - E-commerce products
- **orders** - Order management
- **order_items** - Order details
- **time_blocks** - Available time slots

## 🔧 API Endpoints

### **Admin Routes**
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/appointments` - All appointments
- `PUT /api/admin/appointments/:id` - Update appointment
- `DELETE /api/admin/appointments/:id` - Delete appointment

### **Barber Routes**
- `GET /api/barbers` - Get all barbers
- `POST /api/barbers` - Create barber
- `PUT /api/barbers/:id` - Update barber
- `DELETE /api/barbers/:id` - Delete barber

### **Service Routes**
- `GET /api/services` - Get all services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### **Product Routes**
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### **Order Routes**
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

## 🎨 Admin Panel Features

### **Dashboard**
- Total appointments, barbers, services, products
- Recent appointments and orders
- Quick action buttons
- Export functionality

### **Management Sections**
- **Appointments**: View, edit, delete bookings
- **Barbers**: Manage barber profiles and images
- **Services**: Set pricing and duration
- **Products**: Inventory and e-commerce management
- **Orders**: Track order status and details

### **Global Search**
- Search across all entities
- Real-time filtering
- Quick access to records

## 🚀 Deployment

### **Backend Deployment**
1. Set up a cloud server (AWS, DigitalOcean, etc.)
2. Install Node.js and MySQL
3. Clone the repository
4. Install dependencies: `npm install`
5. Set up environment variables
6. Start the server: `npm start`

### **Frontend Deployment**
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API endpoints in the frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email syedmuhammadashhadufaridi@rohtiqlabs.com or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Customer reviews and ratings
- [ ] Loyalty program
- [ ] Inventory management
- [ ] Staff scheduling
- [ ] Customer management system

---

**Built with ❤️ for modern barber shops**
