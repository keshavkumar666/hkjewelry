require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB once and reuse
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
    product._id = result.insertedId; // Assign MongoDB generated ID
    res.status(201).json(product);   // Send back inserted product
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
