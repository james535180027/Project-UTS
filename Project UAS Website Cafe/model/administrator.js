const mongoose = require("mongoose");

var adminSchema = mongoose.Schema(
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
    status: { type: String, default: "admin" },
  },
  {
    collection: "admins",
  }
);

module.exports = mongoose.model("administrator", adminSchema);
