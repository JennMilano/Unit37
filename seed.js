const {
    createUser,
    createProduct,
    createTables,
    fetchUsers,
    fetchProducts,
  } = require("./db");
  
  const seed = async () => {
    await client.connect();
  
    await createTables();
    console.log("Tables created");
  
    await Promise.all([
      createUser(
        "test@test.com",
        "password123",
        "Test User",
        "TestAddress",
        false
      ),
      createUser(
        "admin@admin.com",
        "password123",
        "Admin User",
        "AdminAddress",
        true
      ),
      createUser("pmahomes@gmail.com", 'password123', 'Patrick Mahomes', '1 Arrowhead Drive, Kansas City, MO 64129', false),
      createUser("joshallen@gmail.com", 'password123', 'Josh Allen', '1 Bills Drive, Orchard Park, NY 14127', false),
      createUser("joeburrow@gmail.com", 'password123', 'Joe Burrow', '1 Paul Brown Stadium, Cincinnati, OH 45202', false),
      createUser("justinherbert@gmail.com", 'password123', 'Justin Herbert', '1 SoFi Stadium, Los Angeles, CA 90045', false),
      createUser("lamarjackson@gmail.com", 'password123', 'Lamar Jackson', '1 M&T Bank Stadium, Baltimore, MD 21201', false),
      createUser("trevorlawrence@gmail.com", 'password123', 'Trevor Lawrence', '1 TIAA Bank Field, Jacksonville, FL 32202', false),
      createUser("kylermurray@gmail.com", 'password123', 'Kyler Murray', '1 State Farm Stadium, Glendale, AZ 85305', false),
  
    ]);
  
    console.log("Users created");
    console.log(await fetchUsers());
  
await Promise.all([
      createProduct({
        name: "NFL Official Game Football",
        description:
          "Authentic NFL game football, perfect for collectors and players.",
        img_url:
          "https://i5.walmartimages.com/seo/Wilson-The-Duke-NFL-Football_d5908cdb-74bb-4b22-9dbe-056823b52f68.01f80822f0e5d1c489edf76db36fd693.jpeg",
        price: 99.99,
      }),
  
      createProduct({
        name: "NFL Team Jersey",
        description:
          "Official NFL team jersey, available in all team colors and sizes.",
        img_url:
          "https://i01.hsncdn.com/is/image/HomeShoppingNetwork/rocs1200/officially-licensed-nfl-youth-brian-dawkins-2004-retire-d-20230720205237867~21582107w_alt3.jpg",
        price: 129.99,
      }),
      createProduct({
        name: "NFL Helmet Replica",
        description: "Authentic NFL team helmet replica, perfect for display.",
        img_url:
          "https://www.greengridiron.com/cdn/shop/products/BaltimoreRavensRiddellSpeedAuthentic01_1024x1024.jpg?v=1653507086",
        price: 199.99,
      }),
      createProduct({
        name: "NFL Team Cap",
        description: "Official NFL team cap, available in all team colors.",
        img_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ECfLKW5dukBcuRC3kPHFf-WKzQbwS6kazw&s",
        price: 29.99,
      }),
    ]);
  
    console.log("Products created");
    console.log(await fetchProducts());
  
    await client.end();
  };
  
  seed().catch((error) => {
    console.error("Error seeding database:", error);
  });