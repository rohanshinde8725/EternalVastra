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

const resources = {
  products: Product,
  orders: Order,
  customers: Customer,
  categories: Category,
  blog: BlogPost,
  banners: Banner,
  reviews: Review,
  recyclebin: RecycleBin,
  settings: StoreSettings,
  messages: ContactMessage,
  "contact-messages": ContactMessage,
};

const list = (Model) => async (_req, res, next) => {
  try {
    res.json(await Model.find().sort({ createdAt: -1 }).lean());
  } catch (error) {
    next(error);
  }
};

const getOne = (Model) => async (req, res, next) => {
  try {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const create = (Model) => async (req, res, next) => {
  try {
    res.status(201).json(await Model.create(req.body));
  } catch (error) {
    next(error);
  }
};

const update = (Model) => async (req, res, next) => {
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Record not found" });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const remove = (Model) => async (req, res, next) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getResource = (req, res, next) => {
  const Model = resources[req.params.resource?.toLowerCase()];
  return Model ? list(Model)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const getSingleResource = (req, res, next) => {
  const Model = resources[req.params.resource?.toLowerCase()];
  return Model ? getOne(Model)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const createResource = (req, res, next) => {
  const Model = resources[req.params.resource?.toLowerCase()];
  return Model ? create(Model)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const updateResource = (req, res, next) => {
  const Model = resources[req.params.resource?.toLowerCase()];
  return Model ? update(Model)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

const deleteResource = (req, res, next) => {
  const Model = resources[req.params.resource?.toLowerCase()];
  return Model ? remove(Model)(req, res, next) : res.status(404).json({ message: "Resource not found" });
};

// Admin Profile Handlers
const getProfile = async (_req, res, next) => {
  try {
    res.json((await AdminProfile.findOne().sort({ createdAt: -1 }).lean()) || {});
  } catch (error) {
    next(error);
  }
};

const saveProfile = async (req, res, next) => {
  try {
    res.json(
      await AdminProfile.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
        runValidators: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Store Settings Handlers
const getSettings = async (_req, res, next) => {
  try {
    res.json((await StoreSettings.findOne().sort({ createdAt: -1 }).lean()) || {});
  } catch (error) {
    next(error);
  }
};

const saveSettings = async (req, res, next) => {
  try {
    res.json(
      await StoreSettings.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
        runValidators: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Dashboard Stats Live Aggregation
const getDashboardStats = async (_req, res, next) => {
  try {
    const [orders, products, customers, categories, users] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).lean(),
      Product.find().sort({ createdAt: -1 }).lean(),
      Customer.find().sort({ createdAt: -1 }).lean(),
      Category.find().lean(),
      require("../models/User").find().sort({ createdAt: -1 }).lean()
    ]);

    const totalSales = orders.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;
    const totalOrdersCount = orders.length || 0;
    const totalCustomersCount = (customers.length + users.length) || 0;
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

    res.json({
      totalSales,
      totalOrdersCount,
      totalCustomersCount,
      totalProductsCount,
      ordersByStatus,
      salesByCategory: formattedSalesByCategory,
      activities: activities.slice(0, 5),
      recentOrders: orders.slice(0, 5),
      categories,
    });
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
    }

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
    }

    await RecycleBin.findByIdAndDelete(req.params.id);
    res.json({ message: "Item restored successfully", item });
  } catch (error) {
    next(error);
  }
};

const deletePermanentFromRecycleBin = async (req, res, next) => {
  try {
    const item = await RecycleBin.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Recycle bin item not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const emptyRecycleBin = async (_req, res, next) => {
  try {
    await RecycleBin.deleteMany({});
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
  getProfile,
  saveProfile,
  getSettings,
  saveSettings,
  getDashboardStats,
  getRecycleBin,
  addToRecycleBin,
  restoreFromRecycleBin,
  deletePermanentFromRecycleBin,
  emptyRecycleBin,
};
