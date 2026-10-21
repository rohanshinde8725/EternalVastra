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

const parseSpecifications = (body, parsedDetails = {}) => {
  let specs = body.specifications || parsedDetails.specifications || {};
  if (typeof specs === "string") {
    try {
      specs = JSON.parse(specs);
    } catch {
      specs = {};
    }
  }

  const fabric = specs.fabric || body.fabric || parsedDetails.material || body.material || "";
  const sareeLength = specs.sareeLength || body.sareeLength || "5.5 Meters";
  const blousePiece = specs.blousePiece || body.blousePiece || "Included (0.8 Meter Unstitched)";
  const color = specs.color || body.color || "";
  const pattern = specs.pattern || body.pattern || "";
  const workType = specs.workType || body.workType || "Zari Woven Border & Pallu";
  const occasion = specs.occasion || body.occasion || parsedDetails.occasion || body.occasion || "Festive & Wedding Celebrations";
  const care = specs.care || body.care || parsedDetails.care || body.care || "Dry clean only. Store folded in a cool, dry place.";

  return {
    fabric,
    sareeLength,
    blousePiece,
    color,
    pattern,
    workType,
    occasion,
    care,
  };
};

const parseDetails = (body) => {
  const details = body.details || {};
  const parsedDetails = typeof details === "string" ? JSON.parse(details) : details;
  const specifications = parseSpecifications(body, parsedDetails);

  return {
    description: parsedDetails.description || body.description || "",
    shortDescription: parsedDetails.shortDescription || body.shortDescription || "",
    material: parsedDetails.material || body.material || specifications.fabric || "",
    occasion: parsedDetails.occasion || body.occasion || specifications.occasion || "",
    care: parsedDetails.care || body.care || specifications.care || "",
    highlights: parseArray(parsedDetails.highlights || body.highlights),
    specifications,
    shippingInfo: parsedDetails.shippingInfo || body.shippingInfo || "Free insured shipping across India. Dispatched within 24-48 hours.",
    returnInfo: parsedDetails.returnInfo || body.returnInfo || "7-day hassle-free exchange & return policy for unused sarees with original tags.",
  };
};

const removeStoredImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const filename = path.basename(imageUrl);
  await fs.unlink(path.join(uploadsDirectory, filename)).catch(() => {});
};

const formatProductOutput = (p) => {
  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.img ? [p.img] : []);
  const mainImg = p.img || images[0] || "/images/silk/silk-1.webp";
  const specs = p.specifications && p.specifications.fabric ? p.specifications : parseSpecifications(p, p.details || {});

  return {
    ...p,
    img: mainImg,
    images: images.length > 0 ? images : [mainImg],
    specifications: specs,
    shortDescription: p.shortDescription || p.details?.shortDescription || "",
    sku: p.sku || `EV-${String(p.id).padStart(3, "0")}`,
    status: p.status || "Published",
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : (p.tag ? [p.tag] : ["Handcrafted"]),
    relatedProductIds: Array.isArray(p.relatedProductIds) ? p.relatedProductIds : [],
    details: {
      description: p.details?.description || p.description || "",
      shortDescription: p.details?.shortDescription || p.shortDescription || "",
      material: p.details?.material || p.material || specs.fabric || "",
      occasion: p.details?.occasion || p.occasion || specs.occasion || "",
      care: p.details?.care || p.care || specs.care || "",
      highlights: Array.isArray(p.details?.highlights) && p.details.highlights.length > 0 ? p.details.highlights : [],
      specifications: specs,
      shippingInfo: p.details?.shippingInfo || "Free insured shipping across India. Dispatched within 24-48 hours.",
      returnInfo: p.details?.returnInfo || "7-day hassle-free exchange & return policy for unused sarees with original tags.",
    },
  };
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
            shortDescription: matched.shortDescription || "",
            material: matched.material || "",
            occasion: matched.occasion || "",
            care: matched.care || "",
            highlights: matched.highlights || [],
            specifications: matched.specifications || {},
            shippingInfo: matched.shippingInfo || "",
            returnInfo: matched.returnInfo || "",
          } : (p.details || {}),
        };
      });
    }

    const formatted = finalProducts.map(formatProductOutput);

    cache.set("products:all", formatted, 120);
    res.json(formatted);
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
          shortDescription: detail.shortDescription || "",
          material: detail.material || "",
          occasion: detail.occasion || "",
          care: detail.care || "",
          highlights: detail.highlights || [],
          specifications: detail.specifications || {},
          shippingInfo: detail.shippingInfo || "",
          returnInfo: detail.returnInfo || "",
        };
      }
    }

    const formatted = formatProductOutput(product);

    cache.set(cacheKey, formatted, 180);
    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    let rawImages = parseArray(req.body.images);
    if (req.file) {
      rawImages.unshift(`/uploads/${req.file.filename}`);
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach(f => rawImages.push(`/uploads/${f.filename}`));
    }

    let imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : (req.body.img || rawImages[0]);

    if (!imageUrl && rawImages.length === 0) {
      return res.status(400).json({ message: "Product image is required" });
    }

    if (!imageUrl && rawImages.length > 0) {
      imageUrl = rawImages[0];
    }
    if (rawImages.length === 0 && imageUrl) {
      rawImages.push(imageUrl);
    }

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
    const specifications = productDetails.specifications;
    const title = req.body.title?.trim() || "Untitled Saree";
    const slug = req.body.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const sku = req.body.sku?.trim() || `EV-${String(newId).padStart(3, "0")}-${(categoryList[0] || "SR").substring(0, 3).toUpperCase()}`;
    const status = req.body.status || "Published";
    const shortDescription = req.body.shortDescription?.trim() || productDetails.shortDescription || "";
    const tags = parseArray(req.body.tags || (req.body.tag ? [req.body.tag] : ["New"]));
    const relatedProductIds = parseArray(req.body.relatedProductIds).map(Number).filter(n => Number.isInteger(n) && n !== newId);

    const product = await Product.create({
      ...req.body,
      id: newId,
      title,
      slug,
      sku,
      status,
      shortDescription,
      tags,
      category: categoryList,
      discountPrice: Number(req.body.discountPrice),
      actualPrice: Number(req.body.actualPrice || req.body.discountPrice),
      inventory: Number(req.body.inventory || req.body.stock || 20),
      tag: req.body.tag?.trim() || (tags[0] || "New"),
      rating: Number(req.body.rating || 5.0),
      ratings: String(req.body.ratings || "24"),
      images: rawImages,
      img: imageUrl,
      specifications,
      details: productDetails,
      relatedProductIds,
    });

    // Also persist in ProductsDetail collection so standalone lookups match
    await ProductDetail.findOneAndUpdate(
      { productId: newId },
      { productId: newId, ...productDetails, images: rawImages },
      { upsert: true, new: true }
    ).catch(() => {});

    // Invalidate product caches and admin stats cache
    cache.delPrefix("products:");
    cache.delPrefix("admin:");

    res.status(201).json(formatProductOutput(product.toObject()));
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
    const specifications = parsedDetails.specifications;

    const updates = {
      ...req.body,
      category: req.body.category ? parseArray(req.body.category) : product.category,
      specifications,
      details: parsedDetails,
    };

    if (req.body.discountPrice !== undefined) updates.discountPrice = Number(req.body.discountPrice);
    if (req.body.actualPrice !== undefined) updates.actualPrice = Number(req.body.actualPrice);
    if (req.body.stock !== undefined || req.body.inventory !== undefined) {
      updates.inventory = Number(req.body.inventory || req.body.stock);
    }
    if (req.body.images !== undefined) {
      updates.images = parseArray(req.body.images);
      if (updates.images.length > 0 && !req.body.img) {
        updates.img = updates.images[0];
      }
    }
    if (req.file) {
      updates.img = `/uploads/${req.file.filename}`;
      if (updates.images && updates.images.length > 0) {
        updates.images[0] = updates.img;
      } else {
        updates.images = [updates.img];
      }
    }
    if (req.body.tags !== undefined) {
      updates.tags = parseArray(req.body.tags);
    }
    if (req.body.status) {
      updates.status = req.body.status;
    }
    if (req.body.sku) {
      updates.sku = req.body.sku;
    }
    if (req.body.shortDescription !== undefined) {
      updates.shortDescription = req.body.shortDescription;
    }
    if (req.body.relatedProductIds !== undefined) {
      updates.relatedProductIds = parseArray(req.body.relatedProductIds).map(Number).filter(n => Number.isInteger(n) && n !== product.id);
    }

    delete updates.id;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    Object.assign(product, updates);
    await product.save();

    // Also update ProductsDetail collection
    await ProductDetail.findOneAndUpdate(
      { productId: product.id },
      { productId: product.id, ...parsedDetails, images: product.images },
      { upsert: true, new: true }
    ).catch(() => {});

    if (req.file && previousImage !== product.img) await removeStoredImage(previousImage);

    // Invalidate caches
    cache.delPrefix("products:");
    cache.delPrefix("admin:");

    res.json(formatProductOutput(product.toObject()));
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
