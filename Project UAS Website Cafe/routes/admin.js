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
const user = require("../model/user.js");
const question = require("../model/question.js");
const reservation = require("../model/reservasi.js");
const booked = require("../model/booked.js");

router.get("/", async (req, res) => {
  if (req.session.user === "admin") {
    reservation.find({}, (err, data) => {
      res.render("layouts/admin", {
        Template: "admin_view",
        reservasi: data,
      });
    });
  } else {
    res.render("layouts/index", {
      Template: "index",
    });
  }
});

router.get("/rejected/:id", async (req, res) => {
  const id = req.params.id;
  await reservation.deleteMany({
    _id: id,
  });
  try {
    console.log("Success");
    res.redirect("/admin");
  } catch (err) {
    res.send(err);
  }
});

router.get("/confirmed/:id", async (req, res) => {
  const id = req.params.id;

  let datas = reservation.findById({ _id: id });
  datas.exec((err, data) => {
    if (data) {
      booked.insertMany(data);
      console.log(JSON.stringify(data));
    }
  });
  await reservation.deleteMany({
    _id: id,
  });
  try {
    console.log("Success");
    res.redirect("/admin");
  } catch (err) {
    res.send(err);
  }
});

router.get("/pertanyaan", async (req, res) => {
  if (req.session.user === "admin") {
    question.find({}, function (err, data) {
      res.render("layouts/admin", {
        Template: "tanya",
        pertanyaan: data,
      });
    });
  } else {
    res.render("layouts/index", {
      Template: "index",
    });
  }
});

router.get("/pertanyaan/:id", async (req, res) => {
  const id = req.params.id;
  await question.deleteMany({
    _id: id,
  });
  try {
    console.log("Success");
    res.redirect("/admin/pertanyaan");
  } catch (err) {
    res.send(err);
  }
});

router.get("/pesanan-diterima", async (req, res) => {
  if (req.session.user === "admin") {
    booked.find({}, function (err, data) {
      res.render("layouts/admin", {
        Template: "terima",
        booking: data,
      });
    });
  } else {
    res.render("layouts/index", {
      Template: "index",
    });
  }
});

module.exports = router;
