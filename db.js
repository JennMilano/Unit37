const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL || "postgres://localhost/nfl_ecommerce",
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

const createTables = async () => {
    SQL = `
        DROP TABLE IF EXISTS user_carts;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            name VARCHAR(255) NOT NULL,
            email_address VARCHAR(255),
            mailing_address VARCHAR(255) NOT NULL,
            phone_number VARCHAR(255),
            billing_address VARCHAR(255)
        );

        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            img_url VARCHAR(255) NOT NULL,
            price FLOAT NOT NULL
        );

        CREATE TABLE user_carts(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            quantity INTEGER NOT NULL,
            CONSTRAINT unique_cart UNIQUE (user_id, product_id)
        );
    `;

    await client.query(SQL);
};

const createUser = async (username, password, name, mailing_address, is_admin) => {
    const SQL = `INSERT INTO users (id, username, password, name, mailing_address, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await client.query(SQL, [
        uuid.v4(),
        username,
        hashedPassword,
        name,
        mailing_address,
        is_admin || false,
    ]);
    return response.rows[0];
};

const createProduct = async ({ name, description, img_url, price }) => {
  const SQL = `INSERT INTO products (id, name, description, img_url, price) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    description,
    img_url,
    price,
  ]);
  return response.rows[0];
};

const addToCart = async (user_id, product_id) => {
    // check if the item exists in the cart
    const checkSQL = `SELECT * FROM user_carts WHERE user_id = $1 AND product_id = $2`;
    const checkResponse = await client.query(checkSQL, [user_id, product_id]);
  
    if (checkResponse.rows.length > 0) {
      // item exists - increase quantity by 1
      const updateSQL = `UPDATE user_carts SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2 RETURNING *`;
      const updateResponse = await client.query(updateSQL, [user_id, product_id]);
      return updateResponse.rows[0];
    } else {
      // item doesn't exist - insert new row with quantity 1
      const insertSQL = `INSERT INTO user_carts (id, user_id, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *`;
      const insertResponse = await client.query(insertSQL, [
        uuid.v4(),
        user_id,
        product_id,
        1,
      ]);
      return insertResponse.rows[0];
    }
  };

const removeFromCart = async (user_id, product_id) => {
    const SQL = `DELETE FROM user_carts WHERE user_id = $1 AND product_id = $2`;
    await client.query(SQL, [user_id, product_id]);
};

const reduceCartQuantity = async (user_id, product_id) => {
    // get the current quantity first
    const checkSQL = `SELECT quantity FROM user_carts WHERE user_id = $1 AND product_id = $2`;
    const checkResponse = await client.query(checkSQL, [user_id, product_id]);
    
    if (checkResponse.rows.length === 0) {
      throw new Error('Item not found in cart');
    }
  
    const currentQuantity = checkResponse.rows[0].quantity;
    
    if (currentQuantity <= 1) {
      // if quantity is 1 or less then delete
return removeFromCart(user_id, product_id);
  }
  
  // Otherwise reduce quantity by 1
  const updateSQL = `
    UPDATE user_carts 
    SET quantity = quantity - 1 
    WHERE user_id = $1 AND product_id = $2 
    RETURNING *
  `;
  const response = await client.query(updateSQL, [user_id, product_id]);
  return response.rows[0];
};

const deleteProduct = async (product_id) => {
    // First delete all cart entries referencing this product
    const deleteCartSQL = `DELETE FROM user_carts WHERE product_id = $1`;
    await client.query(deleteCartSQL, [product_id]);
  
    // Then delete the product
    const deleteProductSQL = `DELETE FROM products WHERE id = $1 RETURNING *`;
    const response = await client.query(deleteProductSQL, [product_id]);
    return response.rows[0];
  };

const fetchUsers = async () => {
    const SQL = `SELECT * FROM users`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchSingleUser = async (user_id) => {
    const SQL = `SELECT * FROM users WHERE id = $1`;
    const response = await client.query(SQL, [user_id]);
    return response.rows[0];
};

const fetchProducts = async () => {
    const SQL = `SELECT * FROM products`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchSingleProduct = async (product_id) => {
    const SQL = `SELECT * FROM products WHERE id = $1`;
    const response = await client.query(SQL, [product_id]);
    return response.rows[0];
};

const clearCart = async (user_id) => {
    const SQL = `DELETE FROM user_carts WHERE user_id = $1`;
    await client.query(SQL, [user_id]);
  };

//join user_carts and products tables... makes all prodcut info available to cart page
const fetchUserCart = async (user_id) => {
    const SQL = `
      SELECT
        uc.id,
        uc.user_id,
        uc.product_id,
        uc.quantity,
        p.name,
        p.description,
        p.img_url,
        p.price
      FROM user_carts uc
      JOIN products p ON uc.product_id = p.id
      WHERE uc.user_id = $1
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
  };

module.exports = {
    client,
    createUser,
    createProduct,
    createTables,
    fetchUsers,
    fetchProducts,
    fetchUserCart,
    addToCart,
    removeFromCart,
    fetchSingleUser,
    fetchSingleProduct,
    reduceCartQuantity,
    deleteProduct,
    clearCart,
}; 