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
          details: { $ifNull: [{ $arrayElemAt: ["$detailRecords", 0] }, {}] },
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
    const product = await Product.aggregate([
      { $match: { id: Number(req.params.id) } },
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
          details: { $ifNull: [{ $arrayElemAt: ["$detailRecords", 0] }, {}] },
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
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.img;
    if (!imageUrl) return res.status(400).json({ message: "Product image is required" });
    const requestedId = Number(req.body.id);
    const latestProduct = await Product.findOne().sort({ id: -1 }).select("id").lean();

    const product = await Product.create({
      ...req.body,
      id: Number.isInteger(requestedId) && requestedId > 0
        ? requestedId
        : (latestProduct?.id || 0) + 1,
      category: parseArray(req.body.category),
      details: parseDetails(req.body),
      img: imageUrl,
    });
    res.status(201).json(product);
  } catch (error) {
    if (req.file) await removeStoredImage(`/uploads/${req.file.filename}`);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const previousImage = product.img;
    const updates = {
      ...req.body,
      category: req.body.category ? parseArray(req.body.category) : product.category,
      details: Object.keys(req.body).some((key) =>
        ["details", "description", "material", "occasion", "care", "highlights"].includes(key)
      )
        ? parseDetails(req)
        : product.details,
    };

    if (req.file) updates.img = `/uploads/${req.file.filename}`;
    delete updates.id;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    Object.assign(product, updates);
    await product.save();
    if (req.file && previousImage !== product.img) await removeStoredImage(previousImage);
    res.json(product);
  } catch (error) {
    if (req.file) await removeStoredImage(`/uploads/${req.file.filename}`);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: "Product not found" });
    await removeStoredImage(product.img);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
