const mongoose = require("mongoose");

var reservasiSchema = mongoose.Schema(
  {
    nama: String,
    email: String,
    no_telp: String,
    pengunjung: Number,
    waktu: Date,
  },
  {
    collection: "reservations",
  }
);

module.exports = mongoose.model("reservasi", reservasiSchema);
