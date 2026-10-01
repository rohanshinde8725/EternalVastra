const User = require("../models/User");
const Order = require("../models/Order");

// Get user profile details (including recent orders)
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // Try fetching orders for this user by email
    const orders = await Order.find({ "customer.email": user.email })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      user,
      recentOrders: orders || []
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update user profile details
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, dob, gender, addresses } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dob !== undefined) user.dob = dob;
    if (gender !== undefined) user.gender = gender;
    if (addresses !== undefined) user.addresses = addresses;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Update user avatar
exports.updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: "No image file uploaded" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const avatarUrl = `/uploads/admin/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    if (user.role === "admin" || user.email === "rohanshinde8725@gmail.com") {
      await require("../models/AdminProfile").findOneAndUpdate({}, { avatar: avatarUrl }, { upsert: true });
    }

    res.json({
      message: "Avatar updated successfully",
      avatar: avatarUrl,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Server error updating avatar" });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== currentPassword) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error updating password" });
  }
};
