const dns = require("dns");
const mongoose = require("mongoose");

// Fallback to Google and Cloudflare DNS to avoid querySrv ECONNREFUSED on local ISPs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  // Ignore if not supported in environment
}

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

  const options = {
    dbName: "EternalVastra",
    maxPoolSize: 25,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    family: 4,
  };

  await mongoose.connect(mongoUri, options);
  console.log('MongoDB connected to "EternalVastra" (connection pool ready)');
};

module.exports = connectDB;
