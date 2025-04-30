const { client, createTables } = require('./db');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    await client.connect();

        await createTables();

 
    const quarterbacks = [
      {
        username: 'pmahomes',
        password: await bcrypt.hash('password123', 10),
        name: 'Patrick Mahomes',
        email_address: 'patrick.mahomes@chiefs.com',
        mailing_address: '1 Arrowhead Drive, Kansas City, MO 64129',
        phone_number: '816-920-9300',
        billing_address: '1 Arrowhead Drive, Kansas City, MO 64129',
        is_admin: false
      },
      {
        username: 'jallen',
        password: await bcrypt.hash('password123', 10),
        name: 'Josh Allen',
        email_address: 'josh.allen@bills.com',
        mailing_address: '1 Bills Drive, Orchard Park, NY 14127',
        phone_number: '716-648-1800',
        billing_address: '1 Bills Drive, Orchard Park, NY 14127',
        is_admin: false
      },
      {
        username: 'jburrow',
        password: await bcrypt.hash('password123', 10),
        name: 'Joe Burrow',
        email_address: 'joe.burrow@bengals.com',
        mailing_address: '1 Paul Brown Stadium, Cincinnati, OH 45202',
        phone_number: '513-455-4800',
        billing_address: '1 Paul Brown Stadium, Cincinnati, OH 45202',
        is_admin: false
      }
    ];

    for (const qb of quarterbacks) {
      await client.query(`
        INSERT INTO users (username, password, name, email_address, mailing_address, phone_number, billing_address, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [qb.username, qb.password, qb.name, qb.email_address, qb.mailing_address, qb.phone_number, qb.billing_address, qb.is_admin]);
    }


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