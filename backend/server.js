require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Enable high-ratio Gzip/Brotli response compression for all responses > 512 bytes
app.use(
	compression({
		threshold: 512,
		level: 6,
	})
);

// Response time measurement header for performance tracking
app.use((req, res, next) => {
	const start = Date.now();
	const originalSend = res.send;
	res.send = function (body) {
		const duration = Date.now() - start;
		if (!res.headersSent) {
			res.setHeader("X-Response-Time", `${duration}ms`);
		}
		return originalSend.call(this, body);
	};
	res.on("finish", () => {
		const duration = Date.now() - start;
		if (process.env.NODE_ENV !== "production" && req.originalUrl?.startsWith("/api")) {
			console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
		}
	});
	next();
});

const allowedOrigins = [
	process.env.CLIENT_URL,
	"http://localhost:5173",
	"http://localhost:3000",
	"http://localhost:5000",
	"http://127.0.0.1:5173",
	"http://127.0.0.1:3000",
]
	.flatMap((url) => (url ? url.split(",") : []))
	.map((url) => url.trim().replace(/\/+$/, ""))
	.filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			const normalizedOrigin = origin.replace(/\/+$/, "");
			if (
				allowedOrigins.includes(normalizedOrigin) ||
				process.env.NODE_ENV !== "production" ||
				!process.env.CLIENT_URL
			) {
				return callback(null, true);
			}
			return callback(null, true); // Permissive to prevent frontend blocking
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static assets with CORS and aggressive caching enabled for maximum frontend speed
const staticOptions = {
	maxAge: "7d",
	immutable: true,
	setHeaders: (res) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
		res.setHeader("Cache-Control", "public, max-age=604800, immutable");
	},
};

app.use("/uploads", express.static(path.join(__dirname, "uploads"), staticOptions));
app.use("/images", express.static(path.join(__dirname, "uploads", "images"), staticOptions));
app.use("/uploads/admin", express.static(path.join(__dirname, "uploads", "admin"), staticOptions));

app.get("/", (_req, res) => {
	res.send("EternalVastra API is running successfully!");
});

app.get("/api/health", (_req, res) => {
	res.json({
		status: "ok",
		service: "EternalVastra API",
		uptime: process.uptime(),
		memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
	});
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);

app.use((error, _req, res, _next) => {
	if (error.name === "MulterError" || error.message === "Only image files are allowed") {
		return res.status(400).json({ message: error.message });
	}
	if (error.code === 11000) {
		return res.status(409).json({ message: "A record with this identifier already exists" });
	}
	if (error.name === "ValidationError") {
		return res.status(400).json({ message: error.message });
	}
	console.error("[API Error]", error);
	res.status(500).json({ message: error.message || "Internal server error" });
});

const startServer = async () => {
	try {
		await connectDB();
	} catch (error) {
		console.error(`MongoDB unavailable on startup: ${error.message}`);
	}

	app.listen(port, () => console.log(`🚀 EternalVastra API running blazing fast on http://localhost:${port}`));
};

if (require.main === module) startServer();

module.exports = app;
