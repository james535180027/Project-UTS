const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const db_uri = 'mongodb+srv://Audie:535180021@coffeeteria.wmc4g.mongodb.net/Coffeeteria?retryWrites=true&w=majority';
mongoose.connect(db_uri, {
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
const user = require("../model/user.js");

router.get("/", async (req, res) => {
  if (req.session.status === "user") {
    res.render("layouts/index", {
      Template: "index",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.status === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "index",
      logged: false,
    });
  }
});

router.get("/menu", async (req, res) => {
  if (req.session.status === "user") {
    res.render("layouts/index", {
      Template: "menu",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.status === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "menu",
      logged: false,
    });
  }
});

router.get("/reservasi", async (req, res) => {
  if (req.session.status === "user") {
    res.render("layouts/index", {
      Template: "reservasi",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.status === "admin") {
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
  if (req.session.status === "user") {
    res.render("layouts/index", {
      Template: "lokasi",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.status === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "lokasi",
      logged: false,
    });
  }
});

router.get("/gallery", async (req, res) => {
  if (req.session.status === "user") {
    res.render("layouts/index", {
      Template: "gallery",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.status === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/index", {
      Template: "gallery",
      logged: false,
    });
  }
});

router.get("/kontak", async (req, res) => {
  if (req.session.status === "user") {
    res.render("layouts/index", {
      Template: "kontak",
      logged: true,
      user: req.session.username,
    });
  } else if (req.session.status === "admin") {
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
  if (req.session.status === "user") {
    res.render("layouts/auth", {
      Template: "pengaturan",
      username: req.session.username,
      email: req.session.email,
      telp: req.session.telp,
      id: req.session.id,
    });
  } else if (req.session.status === "admin") {
    res.redirect("/admin");
  } else {
    res.render("layouts/auth", {
      Template: "login",
      logged: false,
    });
  }
});

router.post("/settings", async (req, res) => {
  const username = req.session.username;
  const newPass1 = req.body.ubahPassword1;
  const newPass2 = req.body.ubahPassword2;
  if (newPass1 !== newPass2) {
    console.log("Konfirmasi password berbeda");
    res.render("layouts/auth", {
      Template: "pengaturan",
      error_updatePassword: "Konfirmasi password berbeda",
      username: req.session.username,
      email: req.session.email,
      telp: req.session.telp,
      id: req.session.id,
    });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        throw err;
      } else {
        bcrypt.hash(newPass1, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            console.log(hash);
            user.updateOne(
              { username: username },
              { $set: { password: hash } },
              (err, data) => {
                if (err) {
                  console.log("Error");
                } else {
                  console.log(data);
                  req.session.destroy();
                  res.redirect("/auth/login");
                }
              }
            );
          }
        });
      }
    });
  }
});

module.exports = router;
