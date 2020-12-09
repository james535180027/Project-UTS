const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const db_uri = "mongodb+srv://Audie:535180021@coffeeteria.wmc4g.mongodb.net/Coffeeteria?retryWrites=true&w=majority";
mongoose.connect(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB Connected");
});
const router = express.Router();
const user = require("../model/user");
const adm = require("../model/administrator");

router.get("/login", async (req, res) => {
  if (req.session.status === "admin") {
    res.redirect("/admin");
  } else if (req.session.status === "user") {
    res.redirect("/");
  } else {
    res.render("layouts/auth", {
      Template: "login",
    });
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let akunUser = user.find({ username: username });
  let akunAdm = adm.find({ username: username });

  if ((await akunAdm).length < 1 && (await akunUser).length < 1) {
    res.render("layouts/auth", {
      Template: "login",
      error: "Username tidak terdaftar",
    });
  } else {
    if ((await akunUser).length > 0) {
      user.find({ username: username }).exec((err, data) => {
        if (err) console.log(err);
        if (data) {
          console.log(`Find : ${JSON.stringify(data)}`);
          bcrypt.compare(password, data[0].password, (err, isMatch) => {
            if (err) console.log("empty");
            else if (!isMatch) {
              console.log("Password did not match");
              res.render("layouts/auth", {
                Template: "login",
                error: "Username atau Password salah",
              });
            } else {
              req.session.status = data[0].status;
              req.session.username = data[0].username;
              req.session.email = data[0].email;
              req.session.telp = data[0].no_tlp;
              res.redirect("/");
            }
          });
        }
      });
    } else {
      adm.find({ username: username }).exec((err, data) => {
        if (err) console.log(err);
        if (data) {
          console.log(`Find : ${JSON.stringify(data)}`);
          bcrypt.compare(password, data[0].password, (err, isMatch) => {
            if (err) console.log("empty");
            else if (!isMatch) {
              console.log("Password did not match");
              res.render("layouts/auth", {
                Template: "login",
                error: "Username atau Password salah",
              });
            } else {
              req.session.status = data[0].status;
              res.redirect("/admin");
            }
          });
        }
      });
    }
  }
});

router.get("/settings", async (req, res) => {
  res.render("layouts/auth", {
    Template: "pengaturan",
  });
});

router.get("/registrasi", async (req, res) => {
  res.render("layouts/auth", {
    Template: "registrasi",
  });
});

router.post("/registrasi", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const no_tlp = req.body.no_tlp;
  const password = req.body.password;
  const password2 = req.body.password2;

  let baris = user.find({ username: username, email: email });
  let barisAdm = adm.find({ username: username, email: email });
  if ((await baris).length > 0 || (await barisAdm).length > 0) {
    console.log("Username already taken");
    res.render("layouts/auth", {
      Template: "registrasi",
      error_username: "Username sudah terdaftar",
    });
  } else {
    if (password !== password2) {
      res.render("layouts/auth", {
        Template: "registrasi",
        error_password: "Konfirmasi password berbeda",
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          throw err;
        } else {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
              throw err;
            } else {
              console.log(hash);
              var user_insert = new user({
                username: username,
                email: email,
                no_tlp: no_tlp,
                password: hash,
              });
              user_insert.save((err, product) => {
                if (err) console.log(err);
                console.log(JSON.stringify(product));
                res.redirect("/auth/login");
              });
            }
          });
        }
      });
    }
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
