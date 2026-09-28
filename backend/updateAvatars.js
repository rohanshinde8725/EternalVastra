require('dotenv').config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("Connected to MongoDB.");
  const result = await User.updateMany(
    { avatar: "/images/testimonial/testimonial-1.png" },
    { $set: { avatar: "/images/default-avatar.png" } }
  );
  console.log("Update result:", result);
  mongoose.disconnect();
})
.catch((err) => {
  console.error(err);
});
