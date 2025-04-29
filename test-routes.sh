#!/bin/bash

echo "Testing API Routes..."
echo "===================="

echo "\n1. Testing GET /api/products"
curl -X GET http://localhost:3000/api/products

echo "\n\n2. Testing GET /api/products/1"
curl -X GET http://localhost:3000/api/products/1

echo "\n\n3. Testing POST /api/users/register"
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass","email":"test@test.com","first_name":"Test","last_name":"User","address":"123 Test St","city":"Test City","state":"CA","zip_code":"12345","phone":"123-456-7890"}'

echo "\n\n4. Testing POST /api/users/login"
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

echo "\n\n5. Testing GET /api/cart"
curl -X GET http://localhost:3000/api/cart

echo "\n\n6. Testing POST /api/cart"
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":1}'

echo "\n\n7. Testing PUT /api/cart/1"
curl -X PUT http://localhost:3000/api/cart/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity":2}'

echo "\n\n8. Testing DELETE /api/cart/1"
curl -X DELETE http://localhost:3000/api/cart/1

echo "\n\n9. Testing GET /api/admin/products"
curl -X GET http://localhost:3000/api/admin/products

echo "\n\n10. Testing GET /api/admin/users"
curl -X GET http://localhost:3000/api/admin/users

echo "\n\nTesting completed!" 