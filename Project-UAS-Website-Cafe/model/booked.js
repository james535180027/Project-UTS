const mongoose = require("mongoose");

var bookedSchema = mongoose.Schema(
  {
    nama: String,
    email: String,
    no_telp: String,
    pengunjung: Number,
    waktu: Date,
  },
  {
    collection: "booked",
  }
);

module.exports = mongoose.model("booked", bookedSchema);
