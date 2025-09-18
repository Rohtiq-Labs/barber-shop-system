import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";


import servicesRoutes from "./routes/services.js";
import appointmentRoutes from "./routes/appointments.js";
import barberRoutes from "./routes/barbers.js";
import dashboardRoutes from "./routes/dashboard.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import timeBlockRoutes from "./routes/timeBlocks.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/time-blocks", timeBlockRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
