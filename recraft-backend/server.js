import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js'; // <-- IMPORT product routes
import inspirationPostRoutes from './routes/inspirationPostRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // <-- USE cors to allow requests from your frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- ROUTES ---
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Recraft API" });
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // <-- USE the product routes
app.use('/api/posts', inspirationPostRoutes)

app.use('/api/orders', orderRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});