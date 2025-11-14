require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

// ---------- CORS setup: dynamic whitelist ----------
/*
  Set ALLOWED_ORIGINS in Railway variables, e.g.:
  ALLOWED_ORIGINS=https://fulfilling-imagination-production.up.railway.app,https://hkjewelry.vercel.app
*/
const allowed = (process.env.ALLOWED_ORIGINS || 'https://hkjewelry.vercel.app')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow server-to-server or tools like curl (no origin)
    if (!origin) return callback(null, true);

    if (allowed.length === 0) {
      // defensive: reject if no origins configured
      return callback(new Error('CORS not configured'), false);
    }

    if (allowed.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

// ---------- Middleware ----------
app.use(express.json()); // Parse JSON bodies

// lightweight request logger to verify incoming traffic (safe for dev)
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.url} - origin: ${req.headers.origin || 'no-origin'}`);
  next();
});

// ---------- MongoDB ----------
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not set. Exiting.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  // optional: tune these if you need
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // uses database from connection string
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // fail fast so we don't serve without DB
  }
}

// ---------- Routes ----------
app.get('/', (req, res) => res.send('OK'));

app.get('/api/products', async (req, res) => {
  try {
    const products = await db.collection('products').find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

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

// ---------- Start server after DB connects ----------
connectDB().then(() => {
  const PORT = process.env.PORT; // intentionally not falling back here to catch misconfiguration
  const HOST = '0.0.0.0';

  if (!PORT) {
    console.error('PORT env var is not set. Ensure this is a Web service (Railway) and that PORT is provided.');
    process.exit(1);
  }

  console.log('RAILWAY PORT env value:', PORT);

  app.listen(PORT, HOST, () => {
    console.log(`Server running on host ${HOST} port ${PORT}`);
  });
});

// ---------- Graceful shutdown ----------
async function shutdown(signal) {
  console.log(`${signal} received: closing MongoDB client`);
  try {
    await client.close(false);
    console.log('MongoDB client closed');
  } catch (e) {
    console.error('Error closing MongoDB client', e);
  }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
