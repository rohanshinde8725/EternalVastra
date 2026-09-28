const express = require("express");
const { getProfile, updateProfile, updateAvatar, updatePassword } = require("../controllers/userController");
const upload = require("../middleware/upload");

const router = express.Router();

// User Profile routes
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.post("/profile/:id/avatar", upload.single("avatar"), updateAvatar);
router.put("/profile/:id/password", updatePassword);

module.exports = router;