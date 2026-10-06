const fs = require("fs/promises");
const path = require("path");
const Product = require("../models/Product");
const ProductDetail = require("../models/ProductDetail");
const cache = require("../utils/cache");

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

// High-speed lean product list with in-memory caching and zero redundant DB joins
const getProducts = async (_req, res, next) => {
  try {
    const cached = cache.get("products:all");
    if (cached) {
      return res.json(cached);
    }

    // Direct lean query with indexed sort for maximum throughput
    const products = await Product.find().sort({ createdAt: -1, id: -1 }).lean();

    // Check if any product has missing details and fallback to details collection if needed
    const needsDetailMerge = products.some(p => !p.details || Object.keys(p.details).length === 0 || !p.details.material);
    
    let finalProducts = products;
    if (needsDetailMerge) {
      const details = await ProductDetail.find().lean();
      const detailMap = new Map(details.map(d => [d.productId, d]));
      finalProducts = products.map(p => {
        const hasOwnDetails = p.details && (p.details.description || p.details.material);
        if (hasOwnDetails) return p;
        const matched = detailMap.get(p.id);
        return {
          ...p,
          details: matched ? {
            description: matched.description || "",
            material: matched.material || "",
            occasion: matched.occasion || "",
            care: matched.care || "",
            highlights: matched.highlights || [],
          } : (p.details || {}),
        };
      });
    }

    cache.set("products:all", finalProducts, 120);
    res.json(finalProducts);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const requestedId = Number(req.params.id);
    const cacheKey = `products:id:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const filter = Number.isInteger(requestedId) ? { id: requestedId } : { _id: req.params.id };
    const product = await Product.findOne(filter).lean();

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Fallback lookup if details subdocument is incomplete
    if (!product.details || (!product.details.description && !product.details.material)) {
      const detail = await ProductDetail.findOne({ productId: product.id }).lean();
      if (detail) {
        product.details = {
          description: detail.description || "",
          material: detail.material || "",
          occasion: detail.occasion || "",
          care: detail.care || "",
          highlights: detail.highlights || [],
        };
      }
    }

    cache.set(cacheKey, product, 180);
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

    // Invalidate product caches and admin stats cache
    cache.delPrefix("products:");
    cache.delPrefix("admin:");

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

    // Invalidate caches
    cache.delPrefix("products:");
    cache.delPrefix("admin:");

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

    // Invalidate caches
    cache.delPrefix("products:");
    cache.delPrefix("admin:");

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
