import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productsRoutes from './routes/products.js';

dotenv.config();
const app = express();

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Test route - ADD THIS
app.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Server is working!' });
});

// Your existing routes
app.use('/api/products', productsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/test`);
});