const express = require("express");
const path = require("path");
const upload = require("../middleware/upload");
const {
  getResource,
  getSingleResource,
  createResource,
  updateResource,
  deleteResource,
  getProfile,
  saveProfile,
  uploadAdminAvatar,
  getSettings,
  saveSettings,
  getDashboardStats,
  toggleBlockUser,
  deleteUser,
  getRecycleBin,
  addToRecycleBin,
  restoreFromRecycleBin,
  deletePermanentFromRecycleBin,
  emptyRecycleBin,
} = require("../controllers/adminController");

const router = express.Router();

// Dashboard Summary Stats
router.get("/dashboard-stats", getDashboardStats);

// Custom User management actions
router.patch("/users/:id/toggle-block", toggleBlockUser);
router.put("/users/:id/toggle-block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

// Image Upload (admin uploads from device)
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  // Return a publicly accessible URL
  const imageUrl = `/uploads/admin/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", saveProfile);
router.post("/profile/avatar", upload.single("avatar"), uploadAdminAvatar);

// Store Settings
router.get("/settings", getSettings);
router.put("/settings", saveSettings);

// Recycle Bin
router.get("/recycle-bin", getRecycleBin);
router.post("/recycle-bin", addToRecycleBin);
router.delete("/recycle-bin", emptyRecycleBin);
router.post("/recycle-bin/:id/restore", restoreFromRecycleBin);
router.delete("/recycle-bin/:id", deletePermanentFromRecycleBin);

// Generic Resource Routes (orders, products, customers, categories, banners, reviews, blog)
router.route("/:resource").get(getResource).post(createResource);
router
  .route("/:resource/:id")
  .get(getSingleResource)
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;
