const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Category = require("../models/Category");
const BlogPost = require("../models/BlogPost");
const AdminProfile = require("../models/AdminProfile");
const Product = require("../models/Product");
const Banner = require("../models/Banner");
const Review = require("../models/Review");
const StoreSettings = require("../models/StoreSettings");
const RecycleBin = require("../models/RecycleBin");
const ContactMessage = require("../models/ContactMessage");
const User = require("../models/User");
const cache = require("../utils/cache");

const resources = {
  products: Product,
  orders: Order,
  customers: Customer,
  categories: Category,
  users: User,
  blog: BlogPost,
  banners: Banner,
  reviews: Review,
  recyclebin: RecycleBin,
  settings: StoreSettings,
  messages: ContactMessage,
  "contact-messages": ContactMessage,
};

const invalidateAdminCache = (resourceName = "") => {
  if (resourceName) {
    cache.delPrefix(`admin:${resourceName.toLowerCase()}`);
  }
  cache.del("admin:dashboard-stats");
  cache.delPrefix("products:");
};

const list = (Model, resourceName = "") => async (_req, res, next) => {
  try {
    const cacheKey = `admin:resource:${resourceName.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const items = await Model.find().sort({ createdAt: -1 }).lean();
    cache.set(cacheKey, items, 180);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const getOne = (Model) => async (req, res, next) => {
  try {
    const item = await Model.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Record not found" });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const create = (Model, resourceName = "") => async (req, res, next) => {
  try {
    const item = await Model.create(req.body);
    invalidateAdminCache(resourceName);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const update = (Model, resourceName = "") => async (req, res, next) => {
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Record not found" });
    invalidateAdminCache(resourceName);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const remove = (Model, resourceName = "") => async (req, res, next) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });
    invalidateAdminCache(resourceName);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getResource = (req, res, next) => {
  const resourceName = req.params.resource?.toLowerCase();
  const Model = resources[resourceName];
  return Model ? list(Model, resourceName)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const getSingleResource = (req, res, next) => {
  const resourceName = req.params.resource?.toLowerCase();
  const Model = resources[resourceName];
  return Model ? getOne(Model)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const createResource = (req, res, next) => {
  const resourceName = req.params.resource?.toLowerCase();
  const Model = resources[resourceName];
  return Model ? create(Model, resourceName)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const updateResource = (req, res, next) => {
  const resourceName = req.params.resource?.toLowerCase();
  const Model = resources[resourceName];
  return Model ? update(Model, resourceName)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const deleteResource = (req, res, next) => {
  const resourceName = req.params.resource?.toLowerCase();
  const Model = resources[resourceName];
  return Model ? remove(Model, resourceName)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

// Admin Profile Handlers
const getProfile = async (_req, res, next) => {
  try {
    const cached = cache.get("admin:profile");
    if (cached) return res.json(cached);

    const profile = (await AdminProfile.findOne().sort({ createdAt: -1 }).lean()) || {};
    cache.set("admin:profile", profile, 300);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const saveProfile = async (req, res, next) => {
  try {
    const updated = await AdminProfile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    cache.del("admin:profile");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const uploadAdminAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file uploaded" });
    const avatarUrl = `/uploads/admin/${req.file.filename}`;
    const profile = await AdminProfile.findOneAndUpdate(
      {},
      { avatar: avatarUrl },
      { new: true, upsert: true }
    );
    // Also update any matching admin users
    await User.updateMany({ role: "admin" }, { avatar: avatarUrl });
    cache.del("admin:profile");
    cache.delPrefix("admin:users");
    res.json({ message: "Admin avatar updated successfully", avatar: avatarUrl, profile });
  } catch (error) {
    next(error);
  }
};

// Store Settings Handlers
const getSettings = async (_req, res, next) => {
  try {
    const cached = cache.get("admin:settings");
    if (cached) return res.json(cached);

    const settings = (await StoreSettings.findOne().sort({ createdAt: -1 }).lean()) || {};
    cache.set("admin:settings", settings, 300);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const saveSettings = async (req, res, next) => {
  try {
    const updated = await StoreSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    cache.del("admin:settings");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// High speed Dashboard Stats with lean projections & in-memory caching
const getDashboardStats = async (_req, res, next) => {
  try {
    const cached = cache.get("admin:dashboard-stats");
    if (cached) {
      return res.json(cached);
    }

    // Parallel fetch with lean projections to minimize memory and bandwidth overhead
    const [orders, products, customerCount, categories, users] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).select("orderId customerName total status items createdAt").lean(),
      Product.find().sort({ createdAt: -1 }).select("id title category createdAt").lean(),
      Customer.countDocuments(),
      Category.find().select("name slug description banner count share").lean(),
      User.find().sort({ createdAt: -1 }).select("name email phone role isBlocked status avatar createdAt").lean()
    ]);

    const totalSales = orders.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;
    const totalOrdersCount = orders.length || 0;
    const totalCustomersCount = (customerCount + users.length) || 0;
    const totalProductsCount = products.length || 0;

    // Aggregate Orders by Status
    const ordersByStatus = {
      Delivered: 0,
      Processing: 0,
      Shipped: 0,
      Cancelled: 0,
      Pending: 0
    };
    orders.forEach(o => {
      const st = o.status || "Pending";
      if (ordersByStatus[st] !== undefined) {
        ordersByStatus[st]++;
      }
    });

    // Aggregate Sales by Category
    const salesByCategory = {};
    const productMap = {}; // name -> category
    products.forEach(p => {
      if (p.title && p.category && p.category.length > 0) {
        productMap[p.title] = p.category[0];
      }
    });

    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const cat = productMap[item.name] || "Other";
        const itemTotal = (item.price || 0) * (item.qty || 1);
        salesByCategory[cat] = (salesByCategory[cat] || 0) + itemTotal;
      });
    });

    // Format salesByCategory for the frontend donut chart
    const formattedSalesByCategory = Object.keys(salesByCategory).map(key => ({
      name: key,
      value: salesByCategory[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 categories

    // Generate Store Activity (mix of recent orders and products)
    const activities = [];
    orders.slice(0, 5).forEach(o => {
      activities.push({
        type: "order",
        iconBg: "bg-rose-50 text-rose-500",
        title: `New order #${o.orderId} received`,
        time: o.createdAt,
      });
    });
    products.slice(0, 3).forEach(p => {
      activities.push({
        type: "product",
        iconBg: "bg-emerald-50 text-emerald-500",
        title: `Product "${p.title}" added`,
        time: p.createdAt,
      });
    });
    // Sort activities by time descending
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    const totalUsersCount = users.length || 0;
    const activeUsersCount = users.filter((u) => !u.isBlocked && u.status !== "blocked").length;
    const blockedUsersCount = users.filter((u) => u.isBlocked || u.status === "blocked").length;
    const recentUsers = users.slice(0, 8).map((u) => ({
      id: u._id,
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isBlocked: !!u.isBlocked || u.status === "blocked",
      status: u.isBlocked || u.status === "blocked" ? "blocked" : "active",
      avatar: u.avatar,
      createdAt: u.createdAt,
    }));

    const responseData = {
      totalSales,
      totalOrdersCount,
      totalCustomersCount,
      totalProductsCount,
      totalUsersCount,
      activeUsersCount,
      blockedUsersCount,
      recentUsers,
      ordersByStatus,
      salesByCategory: formattedSalesByCategory,
      activities: activities.slice(0, 5),
      recentOrders: orders.slice(0, 5),
      categories,
    };

    cache.set("admin:dashboard-stats", responseData, 30);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

// Custom User Handlers
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.email === "rohanshinde8725@gmail.com") {
      return res.status(400).json({ message: "Master Admin account cannot be blocked." });
    }

    user.isBlocked = !user.isBlocked;
    user.status = user.isBlocked ? "blocked" : "active";
    await user.save();

    invalidateAdminCache("users");

    res.json({
      message: user.isBlocked ? `User ${user.name} has been blocked.` : `User ${user.name} is now active.`,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isBlocked: user.isBlocked,
        status: user.status,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.email === "rohanshinde8725@gmail.com") {
      return res.status(400).json({ message: "Master Admin account cannot be deleted." });
    }

    // Backup to RecycleBin
    await RecycleBin.create({
      itemType: "user",
      originalId: String(user._id),
      itemTitle: user.name || "Registered User",
      itemSubtitle: `${user.email} • ${user.role}`,
      image: user.avatar || "/images/default-avatar.webp",
      data: user.toObject(),
      deletedAt: new Date(),
    }).catch(() => {});

    await User.findByIdAndDelete(req.params.id);
    invalidateAdminCache("users");
    invalidateAdminCache("recyclebin");

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Recycle Bin Specific Handlers
const getRecycleBin = async (_req, res, next) => {
  try {
    const items = await RecycleBin.find().sort({ deletedAt: -1 }).lean();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const addToRecycleBin = async (req, res, next) => {
  try {
    const { itemType, originalId, itemTitle, itemSubtitle, image, data } = req.body;
    const entry = await RecycleBin.create({
      itemType,
      originalId: String(originalId || ""),
      itemTitle: itemTitle || "Unnamed item",
      itemSubtitle: itemSubtitle || "",
      image: image || "",
      data: data || {},
      deletedAt: new Date(),
    });

    if (itemType === "product" && originalId) {
      await Product.findOneAndDelete({ $or: [{ id: Number(originalId) }, { _id: originalId }] }).catch(() => {});
    } else if (itemType === "category" && originalId) {
      await Category.findByIdAndDelete(originalId).catch(() => {});
    } else if (itemType === "banner" && originalId) {
      await Banner.findByIdAndDelete(originalId).catch(() => {});
    } else if (itemType === "review" && originalId) {
      await Review.findByIdAndDelete(originalId).catch(() => {});
    } else if (itemType === "user" && originalId) {
      await User.findByIdAndDelete(originalId).catch(() => {});
    }

    invalidateAdminCache(itemType);
    invalidateAdminCache("recyclebin");

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

const restoreFromRecycleBin = async (req, res, next) => {
  try {
    const item = await RecycleBin.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Recycle bin item not found" });

    const { itemType, data } = item;

    if (itemType === "product") {
      const highest = await Product.findOne().sort({ id: -1 }).select("id").lean();
      const productPayload = {
        ...data,
        id: data.id || (highest?.id || 0) + 1,
      };
      delete productPayload._id;
      delete productPayload.createdAt;
      delete productPayload.updatedAt;
      await Product.create(productPayload);
    } else if (itemType === "category") {
      const categoryPayload = { ...data };
      delete categoryPayload._id;
      await Category.create(categoryPayload);
    } else if (itemType === "banner") {
      const bannerPayload = { ...data };
      delete bannerPayload._id;
      await Banner.create(bannerPayload);
    } else if (itemType === "review") {
      const reviewPayload = { ...data };
      delete reviewPayload._id;
      await Review.create(reviewPayload);
    } else if (itemType === "user") {
      const userPayload = { ...data };
      delete userPayload._id;
      await User.create(userPayload);
    }

    await RecycleBin.findByIdAndDelete(req.params.id);
    invalidateAdminCache(itemType);
    invalidateAdminCache("recyclebin");

    res.json({ message: "Item restored successfully", item });
  } catch (error) {
    next(error);
  }
};

const deletePermanentFromRecycleBin = async (req, res, next) => {
  try {
    const item = await RecycleBin.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Recycle bin item not found" });
    invalidateAdminCache("recyclebin");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const emptyRecycleBin = async (_req, res, next) => {
  try {
    await RecycleBin.deleteMany({});
    invalidateAdminCache("recyclebin");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResource,
  getSingleResource,
  createResource,
  updateResource,
  deleteResource,
  toggleBlockUser,
  deleteUser,
  getProfile,
  saveProfile,
  uploadAdminAvatar,
  getSettings,
  saveSettings,
  getDashboardStats,
  getRecycleBin,
  addToRecycleBin,
  restoreFromRecycleBin,
  deletePermanentFromRecycleBin,
  emptyRecycleBin,
};
