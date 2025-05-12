const express = require("express");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {
  client,
  createUser,
  createProduct,
  createTables,
  fetchUsers,
  fetchProducts,
  fetchUserCart,
  addToCart,
  removeFromCart,
  fetchSingleProduct,
  fetchSingleUser,
  reduceCartQuantity,
} = require("./db");

const server = express();
client.connect();

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());


server.get("/", (req, res) => {
  res.json({
    message: "Welcome to the NFL E-commerce API",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      userCart: "/api/user_cart/:user_id",
      singleUser: "/api/user/:user_id",
      singleProduct: "/api/products/:product_id"
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.get("/api/users", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

server.get("/api/products", async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

server.get("/api/user_cart/:user_id", async (req, res, next) => {
  try {
    const userCart = await fetchUserCart(req.params.user_id);
    res.json(userCart);
  } catch (error) {
    next(error);
  }
});

server.get("/api/user/:user_id", async (req, res, next) => {
  try {
    const user = await fetchSingleUser(req.params.user_id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

server.get("/api/products/:product_id", async (req, res, next) => {
  try {
    const product = await fetchSingleProduct(req.params.product_id);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

server.post("/api/user_cart/:user_id", async (req, res, next) => {
  try {
    const userCart = await addToCart(req.params.user_id, req.body.product_id);
    res.json(userCart);
  } catch (error) {
    next(error);
  }
});

server.post("/api/users", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

server.post("/api/products", async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

server.delete("/api/user_cart/:user_id/:product_id", async (req, res, next) => {
  try {
    await removeFromCart(req.params.user_id, req.params.product_id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}); 

server.put("/api/user_cart/:user_id/:product_id", async (req, res, next) => {
  try {
    const updatedCart = await reduceCartQuantity(
      req.params.user_id, 
      req.params.product_id
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
});

server.post("/api/register", async (req, res, next) => {
  try {

    //registration input values
    const { username, password, name, mailing_address } = req.body;

    //default admin is false
    const user = await createUser(username, password, name, mailing_address);
    res.json(user);
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
});


server.post("/api/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const users = await fetchUsers();
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      process.env.JWT_SECRET || "your_secret_key_here",
    );

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});