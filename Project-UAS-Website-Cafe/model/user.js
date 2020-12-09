const mongoose = require("mongoose");

var userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    no_tlp: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: { type: String, default: "user" },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("user", userSchema);
