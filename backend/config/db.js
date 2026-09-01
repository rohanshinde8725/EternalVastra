const dns = require("dns");
const mongoose = require("mongoose");

// Fallback to Google DNS to avoid querySrv ECONNREFUSED on local ISPs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore if not supported in environment
}

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

  await mongoose.connect(mongoUri, { dbName: "EternalVastra" });
  console.log('MongoDB connected to "EternalVastra"');
};

module.exports = connectDB;

