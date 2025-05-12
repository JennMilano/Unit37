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

const seed = async () => {
  await client.connect();

  await createTables();
  console.log("Tables created");

  const [
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    user9,
    user10,
  ] = await Promise.all([
    createUser("test@test.com", "password123", "Test User", "TestAddress", false),
    createUser("admin@admin.com", "password123", "Admin User", "AdminAddress", true),
    // createUser("user1", 'password123', 'Patrick Mahomes', '1 Arrowhead Drive, Kansas City, MO 64129'),
    // createUser("user2", 'password123', 'Josh Allen', '1 Bills Drive, Orchard Park, NY 14127'),
    // createUser("user3", 'password123', 'Joe Burrow', '1 Paul Brown Stadium, Cincinnati, OH 45202'),
    // createUser("user4", 'password123', 'Justin Herbert', '1 SoFi Stadium, Los Angeles, CA 90045'),
    // createUser("user5", 'password123', 'Lamar Jackson', '1 M&T Bank Stadium, Baltimore, MD 21201'),
    // createUser("user6", 'password123', 'Trevor Lawrence', '1 TIAA Bank Field, Jacksonville, FL 32202'),
    // createUser("user7", 'password123', 'Kyler Murray', '1 State Farm Stadium, Glendale, AZ 85305'),
    
  ]);

  console.log("Users created");
  console.log(await fetchUsers());

  const [
    football,
    jersey, 
    helmet,
    cap
  ] = await Promise.all([
    createProduct(
      "NFL Official Game Football", 
      "Authentic NFL game football, perfect for collectors and players.", 
      "https://i5.walmartimages.com/seo/Wilson-The-Duke-NFL-Football_d5908cdb-74bb-4b22-9dbe-056823b52f68.01f80822f0e5d1c489edf76db36fd693.jpeg", 
      99.99),

    createProduct(
      "NFL Team Jersey",
      "Official NFL team jersey, available in all team colors and sizes.", 
      "https://i01.hsncdn.com/is/image/HomeShoppingNetwork/rocs1200/officially-licensed-nfl-youth-brian-dawkins-2004-retire-d-20230720205237867~21582107w_alt3.jpg", 
      129.99),
    createProduct(
      "NFL Helmet Replica", 
      "Authentic NFL team helmet replica, perfect for display.", 
      "https://www.greengridiron.com/cdn/shop/products/BaltimoreRavensRiddellSpeedAuthentic01_1024x1024.jpg?v=1653507086", 
      199.99),
    createProduct(
      "NFL Team Cap",
      "Official NFL team cap, available in all team colors.",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ECfLKW5dukBcuRC3kPHFf-WKzQbwS6kazw&s",
      29.99)
  ])

  console.log("Products created");
  console.log(await fetchProducts());

  await client.end();
};

seed().catch((error) => {
  console.error("Error seeding database:", error);
});