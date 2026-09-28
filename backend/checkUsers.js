const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/eternal-vastra")
.then(async () => {
  const users = await User.find({}, "email avatar");
  console.log("All users:", users);
  mongoose.disconnect();
})
.catch(err => console.error(err));
