# NFL E-commerce API

![image](https://github.com/user-attachments/assets/0817a912-79ea-479f-bf5c-5a0ce149cea5)



A RESTful API for an NFL e-commerce platform built with Express.js and PostgreSQL.

## Prerequisites

- Node.js
- PostgreSQL
- A code editor (VS Code recommended)

## Local Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd <your-project-directory>

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in your project root with the following variables:

```
PORT=3000
DATABASE_URL=postgresql://localhost:5432/your_database_name
JWT_SECRET=your_secret_key_here
```

### 3. Database Setup

```bash
# Create your database
createdb your_database_name

# Run database setup (if you have a setup script)
npm run setup-db
```

### 4. Running the API

```bash
# Start the server
npm start
# or
node index.js
```

For development with auto-reload:
```bash
# Install nodemon globally
npm install -g nodemon

# Run with nodemon
nodemon index.js
```

## API Endpoints

The API will be running at `http://localhost:3000`

### Available Endpoints

- `GET /api/products` - Get all products
- `GET /api/users` - Get all users
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/user_cart/:user_id` - Get user's cart
- `GET /api/products/:product_id` - Get single product
- `GET /api/user/:user_id` - Get single user

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Check database name exists

2. **Port Conflicts**
   - Change PORT in .env file if 3000 is in use

3. **CORS Errors**
   - API is configured to accept requests from:
     - http://localhost:5174
     - http://localhost:5173
     - http://localhost:3000
     - https://capstone-d9iz.onrender.com

### Development Tips

- Check console for error messages
- API uses Morgan middleware for request logging
- Use Postman or similar tool for testing endpoints

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Example: Get all products
curl http://localhost:3000/api/products

# Example: Register a new user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","name":"Test User","mailing_address":"123 Test St"}'
```

## Security Notes

- Never commit your .env file
- Keep your JWT_SECRET secure
- Use strong passwords in production
- Regularly update dependencies

## Support

For issues or questions, please open an issue in the repository.
