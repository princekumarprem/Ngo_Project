import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import connectDB from './config/db.js';
import paymentRoutes from './route/payment.route.js';
import subscriberRoutes from './route/subscriber.routes.js';


connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);



app.use('/api/payments', paymentRoutes);
app.use("/api/subscribers", subscriberRoutes);



app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
