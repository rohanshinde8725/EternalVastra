require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "uploads", "images")));
app.use("/uploads/admin", express.static(path.join(__dirname, "uploads", "admin")));

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok", service: "EternalVastra API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, _req, res, _next) => {
	if (error.name === "MulterError" || error.message === "Only image files are allowed") {
		return res.status(400).json({ message: error.message });
	}
	if (error.code === 11000) {
		return res.status(409).json({ message: "A product with this id already exists" });
	}
	if (error.name === "ValidationError") {
		return res.status(400).json({ message: error.message });
	}
	console.error(error);
	res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
	app.listen(port, () => console.log(`API running on http://localhost:${port}`));

	try {
		await connectDB();
	} catch (error) {
		console.error(`MongoDB unavailable: ${error.message}`);
		console.error("Images and /api/health remain available; start MongoDB and run npm run seed.");
	}
};

if (require.main === module) startServer();

module.exports = app;
