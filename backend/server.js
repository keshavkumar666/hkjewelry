require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.use(cors({
  origin: "https://hkjewelry-iazi7h6aj-honeys-projects-d69e5116.vercel.app", // Replace with your frontend URL
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // Uses database set in connection string
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

// API endpoint to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.collection('products').find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// API endpoint to create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    product.createdAt = new Date();
    const result = await db.collection('products').insertOne(product);
    product._id = result.insertedId;
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Start server after DB connection
connectDB().then(() => {
  const PORT = process.env.PORT || 8080; // fallback for local dev only
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

