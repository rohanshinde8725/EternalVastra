const express = require("express");
const upload = require("../middleware/upload");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getProducts).post(upload.single("image"), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(upload.single("image"), updateProduct)
  .delete(deleteProduct);

module.exports = router;
