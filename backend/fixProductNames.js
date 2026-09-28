require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('Connected to MongoDB.');
  
  const products = await Product.find({});
  let updatedCount = 0;

  for (const product of products) {
    if (product.title.includes("Silk")) {
      const mainCategory = product.category[0]; // e.g., "Cotton Sarees", "Paithani Sarees"
      if (mainCategory && mainCategory !== "Silk Sarees") {
        const replacementName = mainCategory.replace(" Sarees", "");
        product.title = product.title.replace("Silk", replacementName);
        await product.save();
        updatedCount++;
        console.log(`Updated product ID ${product.id} to: ${product.title}`);
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} products.`);
  mongoose.disconnect();
})
.catch((err) => {
  console.error(err);
});
