const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { 
  client,
  createUser,
  createProduct,
  createUserCart,
  getProducts,
  getUserCart,
  updateUserCart,
  deleteUserCart,
  getUser
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT = process.env.JWT || 'shhh';

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT);
    const user = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    
    if (!user.rows[0]) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Admin middleware
const isAdmin = async (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Products routes
app.get('/api/products', async (req, res, next) => {
  try {
    const result = await getProducts(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Users routes
app.post('/api/users/register', async (req, res, next) => {
  try {
    await createUser(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post('/api/users/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT);
    res.json({ token, user: { ...user, password: undefined } });
  } catch (err) {
    next(err);
  }
});

// Cart routes
app.get('/api/cart', authenticate, async (req, res, next) => {
  try {
    req.params.user_id = req.user.id;
    await getUserCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post('/api/cart', authenticate, async (req, res, next) => {
  try {
    req.body.user_id = req.user.id;
    await createUserCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.put('/api/cart/:product_id', authenticate, async (req, res, next) => {
  try {
    req.params.user_id = req.user.id;
    await updateUserCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/cart/:product_id', authenticate, async (req, res, next) => {
  try {
    req.params.user_id = req.user.id;
    await deleteUserCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Admin routes
app.post('/api/admin/products', authenticate, isAdmin, async (req, res, next) => {
  try {
    await createProduct(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/products', authenticate, isAdmin, async (req, res, next) => {
  try {
    const result = await getProducts(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/users', authenticate, isAdmin, async (req, res, next) => {
  try {
    const result = await client.query('SELECT id, username, email, is_admin, first_name, last_name FROM users');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await client.connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer(); 