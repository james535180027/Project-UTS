const mongoose = require("mongoose");

var questionSchema = mongoose.Schema(
  {
    nama: String,
    email: String,
    pesan: String,
  },
  {
    collection: "questions",
  }
);

module.exports = mongoose.model("question", questionSchema);
