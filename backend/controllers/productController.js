const fs = require("fs/promises");
const path = require("path");
const Product = require("../models/Product");
const ProductDetail = require("../models/ProductDetail");

const uploadsDirectory = path.join(__dirname, "..", "uploads");

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

const parseDetails = (body) => {
  const details = body.details || {};
  const parsedDetails = typeof details === "string" ? JSON.parse(details) : details;

  return {
    description: parsedDetails.description || body.description || "",
    material: parsedDetails.material || body.material || "",
    occasion: parsedDetails.occasion || body.occasion || "",
    care: parsedDetails.care || body.care || "",
    highlights: parseArray(parsedDetails.highlights || body.highlights),
  };
};

const removeStoredImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const filename = path.basename(imageUrl);
  await fs.unlink(path.join(uploadsDirectory, filename)).catch(() => {});
};

const getProducts = async (_req, res, next) => {
  try {
    const products = await Product.aggregate([
      { $sort: { createdAt: -1, id: -1, _id: -1 } },
      {
        $lookup: {
          from: "ProductsDetail",
          localField: "id",
          foreignField: "productId",
          as: "detailRecords",
        },
      },
      {
        $set: {
          details: {
            $cond: {
              if: { $gt: [{ $size: "$detailRecords" }, 0] },
              then: { $arrayElemAt: ["$detailRecords", 0] },
              else: { $ifNull: ["$details", {}] },
            },
          },
        },
      },
      { $unset: "detailRecords" },
    ]);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const requestedId = Number(req.params.id);
    const filter = Number.isInteger(requestedId) ? { id: requestedId } : { _id: req.params.id };

    const product = await Product.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "ProductsDetail",
          localField: "id",
          foreignField: "productId",
          as: "detailRecords",
        },
      },
      {
        $set: {
          details: {
            $cond: {
              if: { $gt: [{ $size: "$detailRecords" }, 0] },
              then: { $arrayElemAt: ["$detailRecords", 0] },
              else: { $ifNull: ["$details", {}] },
            },
          },
        },
      },
      { $unset: "detailRecords" },
    ]).then((items) => items[0]);

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.img;
    if (!imageUrl) return res.status(400).json({ message: "Product image is required" });

    // Normalize category array
    const categoryList = parseArray(req.body.category);
    if (categoryList.length === 0) {
      categoryList.push("Silk Sarees");
    }

    // Determine sequential or provided ID
    const requestedId = Number(req.body.id);
    const latestProduct = await Product.findOne({ id: { $lt: 1000000000 } }).sort({ id: -1 }).select("id").lean();
    const newId = Number.isInteger(requestedId) && requestedId > 0 && requestedId < 1000000000
      ? requestedId
      : ((latestProduct?.id || 0) + 1);

    const productDetails = parseDetails(req.body);

    const product = await Product.create({
      ...req.body,
      id: newId,
      title: req.body.title?.trim() || "Untitled Saree",
      category: categoryList,
      discountPrice: Number(req.body.discountPrice),
      actualPrice: Number(req.body.actualPrice || req.body.discountPrice),
      inventory: Number(req.body.inventory || req.body.stock || 20),
      tag: req.body.tag?.trim() || "New",
      rating: Number(req.body.rating || 5.0),
      ratings: String(req.body.ratings || "24"),
      details: productDetails,
      img: imageUrl,
    });

    // Also persist in ProductsDetail collection so standalone lookups match
    await ProductDetail.findOneAndUpdate(
      { productId: newId },
      { productId: newId, ...productDetails },
      { upsert: true, new: true }
    ).catch(() => {});

    res.status(201).json(product);
  } catch (error) {
    if (req.file) await removeStoredImage(`/uploads/${req.file.filename}`);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const numericId = Number(req.params.id);
    const product = Number.isInteger(numericId)
      ? await Product.findOne({ id: numericId })
      : await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const previousImage = product.img;
    const parsedDetails = parseDetails(req.body);

    const updates = {
      ...req.body,
      category: req.body.category ? parseArray(req.body.category) : product.category,
      details: parsedDetails,
    };

    if (req.body.discountPrice !== undefined) updates.discountPrice = Number(req.body.discountPrice);
    if (req.body.actualPrice !== undefined) updates.actualPrice = Number(req.body.actualPrice);
    if (req.body.stock !== undefined || req.body.inventory !== undefined) {
      updates.inventory = Number(req.body.inventory || req.body.stock);
    }
    if (req.file) updates.img = `/uploads/${req.file.filename}`;

    delete updates.id;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    Object.assign(product, updates);
    await product.save();

    // Also update ProductsDetail collection
    await ProductDetail.findOneAndUpdate(
      { productId: product.id },
      { productId: product.id, ...parsedDetails },
      { upsert: true, new: true }
    ).catch(() => {});

    if (req.file && previousImage !== product.img) await removeStoredImage(previousImage);
    res.json(product);
  } catch (error) {
    if (req.file) await removeStoredImage(`/uploads/${req.file.filename}`);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const numericId = Number(req.params.id);
    const product = Number.isInteger(numericId)
      ? await Product.findOneAndDelete({ id: numericId })
      : await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await ProductDetail.findOneAndDelete({ productId: product.id }).catch(() => {});
    await removeStoredImage(product.img);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
