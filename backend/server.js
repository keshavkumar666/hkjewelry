require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  // optional: use unified topology/keepAlive options if needed
  // useUnifiedTopology: true
});

app.use(cors({
  origin: "https://hkjewelry.vercel.app", // Replace with your frontend URL (or use an array/or function)
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
    // Fail fast so process doesn't start without DB (optional)
    process.exit(1);
  }
}

// health check - Railway/Load balancer can probe this
app.get('/', (req, res) => res.send('OK'));

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
  const PORT = process.env.PORT || 8080; // Railway will provide PORT
  const HOST = '0.0.0.0';                // must bind to 0.0.0.0 in containers

  app.listen(PORT, HOST, () => {
    console.log(`Server running on host ${HOST} port ${PORT}`);
  });
});

// Graceful shutdown (optional but useful)
process.on('SIGINT', () => {
  console.log('SIGINT received: closing MongoDB client');
  client.close(false).then(() => process.exit(0));
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing MongoDB client');
  client.close(false).then(() => process.exit(0));
});
