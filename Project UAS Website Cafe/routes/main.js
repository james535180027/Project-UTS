const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Coffeeteria", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB Connected");
});
const router = express.Router();
const question = require("../model/question.js");
const reservation = require("../model/reservasi.js");

router.get("/", async (req, res) => {
  if (req.session.user === "user") {
    res.render("layouts/index", {
      Template: "index",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.user === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "index",
      logged: false,
    });
  }
});

router.get("/menu", async (req, res) => {
  if (req.session.user === "user") {
    res.render("layouts/index", {
      Template: "menu",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.user === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "menu",
      logged: false,
    });
  }
});

router.get("/reservasi", async (req, res) => {
  if (req.session.user === "user") {
    res.render("layouts/index", {
      Template: "reservasi",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.user === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "reservasi",
      logged: false,
    });
  }
});

router.post("/reservasi", async (req, res) => {
  const nama = req.body.nama;
  const email = req.body.email;
  const telp = req.body.telepon;
  const jumlah = req.body.pengunjung;
  const tanggal = req.body.waktu;

  var reserv_insert = new reservation({
    nama: nama,
    email: email,
    no_telp: telp,
    pengunjung: jumlah,
    waktu: tanggal,
  });

  reserv_insert.save((err, product) => {
    if (err) console.log(err);
    console.log(JSON.stringify(product));
    res.redirect("/reservasi");
  });
});

router.get("/lokasi", async (req, res) => {
  if (req.session.user === "user") {
    res.render("layouts/index", {
      Template: "lokasi",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.user === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "lokasi",
      logged: false,
    });
  }
});

router.get("/gallery", async (req, res) => {
  if (req.session.user === "user") {
    res.render("layouts/index", {
      Template: "gallery",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.user === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "gallery",
      logged: false,
    });
  }
});

router.get("/kontak", async (req, res) => {
  if (req.session.user === "user") {
    res.render("layouts/index", {
      Template: "kontak",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.user === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "kontak",
      logged: false,
    });
  }
});

router.post("/kontak", async (req, res) => {
  const nama = req.body.nama;
  const email = req.body.email;
  const pesan = req.body.pesan;

  var question_insert = new question({
    nama: nama,
    email: email,
    pesan: pesan,
  });

  question_insert.save((err, product) => {
    if (err) console.log(err);
    console.log(JSON.stringify(product));
    res.redirect("/kontak");
  });
});

router.get("/settings", async (req, res) => {
  res.render("layouts/auth", {
    Template: "pengaturan",
    user: req.session.username,
    email: req.session.email,
    telp: req.session.telp,
    id: req.session.id,
  });
});

module.exports = router;
