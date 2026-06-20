import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lit_db';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Get all products or filtered products
app.get('/api/products', async (req, res) => {
  try {
    const { category, newArrivals, bestSellers } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      if (category === 'new-drops') {
        filter.isNewArrival = true;
      } else {
        filter.category = category;
      }
    }

    if (newArrivals === 'true') {
      filter.isNewArrival = true;
    }

    if (bestSellers === 'true') {
      filter.isBestSeller = true;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
});

// Get a single product by custom ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { shippingDetails, paymentDetails, items, subtotal, shipping, grandTotal } = req.body;

    if (!shippingDetails || !items || items.length === 0 || subtotal === undefined || grandTotal === undefined) {
      return res.status(400).json({ message: 'Invalid order data. Please check shipping details and items.' });
    }

    // Generate a unique order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `LIT-${randomNum}`;

    const newOrder = new Order({
      orderId,
      shippingDetails,
      paymentDetails,
      items,
      subtotal,
      shipping: shipping || 0,
      grandTotal
    });

    await newOrder.save();
    console.log(`Order created successfully: ${orderId}`);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
