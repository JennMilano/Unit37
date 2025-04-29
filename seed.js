const { client, createTables } = require('./db');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    await client.connect();
    
    // Create the uuid-ossp extension if it doesn't exist
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create tables
    await createTables();

    // Insert NFL quarterbacks as users
    const quarterbacks = [
      {
        username: 'pmahomes',
        password: await bcrypt.hash('password123', 10),
        email: 'patrick.mahomes@chiefs.com',
        first_name: 'Patrick',
        last_name: 'Mahomes',
        address: '1 Arrowhead Drive',
        city: 'Kansas City',
        state: 'MO',
        zip_code: '64129',
        phone: '816-920-9300',
        billing_address: '1 Arrowhead Drive, Kansas City, MO 64129'
      },
      {
        username: 'jallen',
        password: await bcrypt.hash('password123', 10),
        email: 'josh.allen@bills.com',
        first_name: 'Josh',
        last_name: 'Allen',
        address: '1 Bills Drive',
        city: 'Orchard Park',
        state: 'NY',
        zip_code: '14127',
        phone: '716-648-1800',
        billing_address: '1 Bills Drive, Orchard Park, NY 14127'
      },
      {
        username: 'jburrow',
        password: await bcrypt.hash('password123', 10),
        email: 'joe.burrow@bengals.com',
        first_name: 'Joe',
        last_name: 'Burrow',
        address: '1 Paul Brown Stadium',
        city: 'Cincinnati',
        state: 'OH',
        zip_code: '45202',
        phone: '513-455-4800',
        billing_address: '1 Paul Brown Stadium, Cincinnati, OH 45202'
      }
    ];

    for (const qb of quarterbacks) {
      await client.query(`
        INSERT INTO users (username, password, email, first_name, last_name, address, city, state, zip_code, phone, billing_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [qb.username, qb.password, qb.email, qb.first_name, qb.last_name, qb.address, qb.city, qb.state, qb.zip_code, qb.phone, qb.billing_address]);
    }

    // Insert football-related products
    const products = [
      {
        name: 'NFL Official Game Football',
        description: 'Authentic NFL game football, perfect for collectors and players alike.',
        price: 99.99,
        image_url: 'https://example.com/football.jpg',
        stock_quantity: 50
      },
      {
        name: 'NFL Team Jersey',
        description: 'Official NFL team jersey, available in all team colors and sizes.',
        price: 129.99,
        image_url: 'https://example.com/jersey.jpg',
        stock_quantity: 100
      },
      {
        name: 'NFL Helmet Replica',
        description: 'Authentic NFL team helmet replica, perfect for display.',
        price: 199.99,
        image_url: 'https://example.com/helmet.jpg',
        stock_quantity: 25
      },
      {
        name: 'NFL Team Cap',
        description: 'Official NFL team cap, available in all team colors.',
        price: 29.99,
        image_url: 'https://example.com/cap.jpg',
        stock_quantity: 200
      }
    ];

    for (const product of products) {
      await client.query(`
        INSERT INTO products (name, description, price, image_url, stock_quantity)
        VALUES ($1, $2, $3, $4, $5)
      `, [product.name, product.description, product.price, product.image_url, product.stock_quantity]);
    }

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    client.end();
  }
};

seedDatabase(); 