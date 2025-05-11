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

server.post("/api/register", async (req, res, next) => {
  try {
    const { username, password, name, mailing_address } = req.body;
    const user = await createUser(username, password, name, mailing_address);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
