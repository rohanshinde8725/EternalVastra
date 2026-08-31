require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const ProductDetail = require("./models/ProductDetail");
const Order = require("./models/Order");
const Customer = require("./models/Customer");
const Category = require("./models/Category");
const BlogPost = require("./models/BlogPost");
const AdminProfile = require("./models/AdminProfile");
const Banner = require("./models/Banner");
const Review = require("./models/Review");
const StoreSettings = require("./models/StoreSettings");
const RecycleBin = require("./models/RecycleBin");
const User = require("./models/User");

const productsPath = path.join(__dirname, "data", "products", "products.json");
const detailsPath = path.join(__dirname, "data", "ProductsDetail", "details.json");
const adminDataPath = path.join(__dirname, "data", "admin");

const seed = async () => {
  await connectDB();
  const [products, details, orders, customers, categories, blog, profile, banners, reviews, settings] = await Promise.all([
    fs.readFile(productsPath, "utf8").then(JSON.parse),
    fs.readFile(detailsPath, "utf8").then(JSON.parse),
    fs.readFile(path.join(adminDataPath, "orders.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(adminDataPath, "customers.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(adminDataPath, "categories.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(adminDataPath, "blog.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(adminDataPath, "profile.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(adminDataPath, "banners.json"), "utf8").then(JSON.parse).catch(() => []),
    fs.readFile(path.join(adminDataPath, "reviews.json"), "utf8").then(JSON.parse).catch(() => []),
    fs.readFile(path.join(adminDataPath, "settings.json"), "utf8").then(JSON.parse).catch(() => ({})),
  ]);

  const documents = products.map((product) => {
    return { ...product, inventory: 8 + ((product.id * 7) % 32), details: {} };
  });
  const detailDocuments = details.map(({ productId, ...detail }) => ({ productId, ...detail }));

  await Product.deleteMany({});
  await ProductDetail.deleteMany({});
  await Product.insertMany(documents);
  await ProductDetail.insertMany(detailDocuments);
  await Promise.all([
    Order.deleteMany({}),
    Customer.deleteMany({}),
    Category.deleteMany({}),
    BlogPost.deleteMany({}),
    AdminProfile.deleteMany({}),
    Banner.deleteMany({}),
    Review.deleteMany({}),
    StoreSettings.deleteMany({}),
    RecycleBin.deleteMany({}),
    User.deleteMany({}),
  ]);
  await Promise.all([
    Order.insertMany(orders),
    Customer.insertMany(customers),
    Category.insertMany(categories),
    BlogPost.insertMany(blog),
    AdminProfile.create(profile),
    banners.length ? Banner.insertMany(banners) : Promise.resolve(),
    reviews.length ? Review.insertMany(reviews) : Promise.resolve(),
    StoreSettings.create(settings),
    // Seed Admin User as requested by the user
    User.create({
      name: "Rohan Shinde",
      email: "rohanshinde8725@gmail.com",
      password: "admin123",
      phone: "+91 98200 87250",
      role: "admin",
      avatar: "/images/testimonial/testimonial-1.png",
    }),
    User.create({
      name: "Ritika Sharma",
      email: "ritika.sharma@example.com",
      password: "patronpassword123",
      phone: "+91 98201 45678",
      role: "customer",
      avatar: "/images/testimonial/testimonial-2.png",
    }),
  ]);
  console.log(`Seeded ${documents.length} products into products`);
  console.log(`Seeded ${detailDocuments.length} records into ProductsDetail`);
  console.log(`Seeded admin user rohanshinde8725@gmail.com (role: admin, pass: admin123) and sample patrons.`);
  console.log(`Seeded ${orders.length} orders, ${customers.length} customers, ${categories.length} categories, ${banners.length} banners, ${reviews.length} reviews, and ${blog.length} blog posts into database.`);
  await Product.db.close();
};

seed().catch(async (error) => {
  console.error(`Seeding failed: ${error.message}`);
  await Product.db?.close();
  process.exit(1);
});
