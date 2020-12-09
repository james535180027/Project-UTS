const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const db_uri =
  "mongodb+srv://Audie:535180021@coffeeteria.wmc4g.mongodb.net/Coffeeteria?retryWrites=true&w=majority";
mongoose.connect(db_uri, {
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
const { getMaxListeners } = require("../model/question.js");
require("dotenv").config();
const nodemailer = require("nodemailer");

router.get("/", async (req, res) => {
  if (req.session.status === "admin") {
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
  let datas = reservation.findById({ _id: id });

  datas.exec((err, data) => {
    if (data) {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      ejs.renderFile(
        path.join(__dirname, "../", "/views/layouts/rejectreservasi.ejs"),
        {
          nama: `${data.nama}`,
          pengunjung: `${data.pengunjung}`,
          waktu: `${data.waktu}`,
          telepon: `${data.no_telp}`,
        },
        function (err, datatemplate1) {
          let mailOptions = {
            from: "no-reply@dummyCoffe.com",
            to: `${JSON.stringify(data.email)}`,
            subject: `Notifikasi Reservasi Gagal`,
            html: datatemplate1,
          };

          transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
              console.log("Error");
            } else {
              console.log("Send");
            }
          });
        }
      );
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

router.get("/confirmed/:id", async (req, res) => {
  const id = req.params.id;

  let datas = reservation.findById({ _id: id });

  datas.exec((err, data) => {
    if (data) {
      booked.insertMany(data);
      console.log(JSON.stringify(data));
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      ejs.renderFile(
        path.join(__dirname, "../", "/views/layouts/acceptreservasi.ejs"),
        {
          nama: `${data.nama}`,
          pengunjung: `${data.pengunjung}`,
          waktu: `${data.waktu}`,
          telepon: `${data.no_telp}`,
        },
        function (err, datatemplate) {
          if (err) {
            console.log(err);
          } else {
            let mailOptions = {
              from: "no-reply@dummyCoffe.com",
              to: `${JSON.stringify(data.email)}`,
              subject: `Konfirmasi penerimaan reservasi`,
              html: datatemplate,
            };

            transporter.sendMail(mailOptions, function (err, data) {
              if (err) {
                console.log("Error");
              } else {
                console.log("Send");
              }
            });
          }
        }
      );
    } //bagian data
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
  if (req.session.status === "admin") {
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
  if (req.session.status === "admin") {
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

router.get("/pesanan-diterima/:id", async (req, res) => {
  const id = req.params.id;
  await booked.deleteMany({
    _id: id,
  });
  try {
    console.log("Success");
    res.redirect("/admin/pesanan-diterima");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
