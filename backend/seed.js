require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const ProductDetail = require("./models/ProductDetail");

const productsPath = path.join(__dirname, "data", "products", "products.json");
const detailsPath = path.join(__dirname, "data", "ProductsDetail", "details.json");

const seed = async () => {
  await connectDB();
  const [products, details] = await Promise.all([
    fs.readFile(productsPath, "utf8").then(JSON.parse),
    fs.readFile(detailsPath, "utf8").then(JSON.parse),
  ]);

  const documents = products.map((product) => {
    return { ...product, details: {} };
  });
  const detailDocuments = details.map(({ productId, ...detail }) => ({ productId, ...detail }));

  await Product.deleteMany({});
  await ProductDetail.deleteMany({});
  await Product.insertMany(documents);
  await ProductDetail.insertMany(detailDocuments);
  console.log(`Seeded ${documents.length} products into products`);
  console.log(`Seeded ${detailDocuments.length} records into ProductsDetail`);
  await Product.db.close();
};

seed().catch(async (error) => {
  console.error(`Seeding failed: ${error.message}`);
  await Product.db?.close();
  process.exit(1);
});
