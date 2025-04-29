const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/nfl_ecommerce');

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS user_products;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE products(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            price FLOAT NOT NULL,
            stock_quantity INTEGER NOT NULL
        );

        CREATE TABLE users(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT FALSE,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            address VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            state VARCHAR(2) NOT NULL,
            zip_code VARCHAR(10) NOT NULL,
            phone VARCHAR(20),
            billing_address VARCHAR(255)
        );

        CREATE TABLE user_products(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            quantity INTEGER NOT NULL,
            CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
        );
    `;

    await client.query(SQL);
};

const createUser = async (req, res, next) => {
    try {
        const { username, password, email, first_name, last_name, address, city, state, zip_code, phone, billing_address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const SQL = `
            INSERT INTO users (username, password, email, first_name, last_name, address, city, state, zip_code, phone, billing_address) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *
        `;
        const user = await client.query(SQL, [
            username, 
            hashedPassword, 
            email, 
            first_name, 
            last_name, 
            address, 
            city, 
            state, 
            zip_code, 
            phone, 
            billing_address
        ]);
        res.status(201).json(user.rows[0]);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { name, description, image_url, price, stock_quantity } = req.body;
        const SQL = `
            INSERT INTO products (name, description, image_url, price, stock_quantity) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const product = await client.query(SQL, [name, description, image_url, price, stock_quantity]);
        res.status(201).json(product.rows[0]);
    } catch (error) {
        next(error);
    }
};

const createUserCart = async (req, res, next) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        const SQL = `
            INSERT INTO user_products (user_id, product_id, quantity) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
        const userProduct = await client.query(SQL, [user_id, product_id, quantity]);
        res.status(201).json(userProduct.rows[0]);
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await client.query('SELECT * FROM products');
        res.status(200).json(products.rows);
    } catch (error) {
        next(error);
    }
};

const getUserCart = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const SQL = `
            SELECT p.*, up.quantity 
            FROM products p 
            JOIN user_products up ON p.id = up.product_id 
            WHERE up.user_id = $1
        `;
        const userProducts = await client.query(SQL, [user_id]);
        res.status(200).json(userProducts.rows);
    } catch (error) {
        next(error);
    }
};

const updateUserCart = async (req, res, next) => {
    try {
        const { user_id, product_id } = req.params;
        const { quantity } = req.body;
        const SQL = `
            UPDATE user_products 
            SET quantity = $1 
            WHERE user_id = $2 AND product_id = $3 
            RETURNING *
        `;
        const userProduct = await client.query(SQL, [quantity, user_id, product_id]);
        res.status(200).json(userProduct.rows[0]);
    } catch (error) {
        next(error);
    }
};

const deleteUserCart = async (req, res, next) => {
    try {
        const { user_id, product_id } = req.params;
        const SQL = `
            DELETE FROM user_products 
            WHERE user_id = $1 AND product_id = $2 
            RETURNING *
        `;
        const userProduct = await client.query(SQL, [user_id, product_id]);
        res.status(200).json(userProduct.rows[0]);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await client.query('SELECT * FROM users WHERE id = $1', [user_id]);
        res.status(200).json(user.rows[0]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart,
    getProducts,
    getUserCart,
    updateUserCart,
    deleteUserCart,
    getUser
}; 