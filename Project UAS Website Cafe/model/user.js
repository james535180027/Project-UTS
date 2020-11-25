const mongoose = require("mongoose");

var userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    no_tlp: String,
    password: String,
    status: { type: String, default: "user" },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("user", userSchema);
