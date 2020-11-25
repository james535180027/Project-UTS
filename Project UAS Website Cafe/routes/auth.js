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
const user = require("../model/user");

router.get("/login", async (req, res) => {
  if (req.session.user === "admin") {
    res.redirect("/admin");
  } else if (req.session.user === "user") {
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

  let baris = user.find({ username: username });
  if ((await baris).length < 1) {
    res.render("layouts/auth", {
      Template: "login",
      error: "Username does not exist",
    });
  } else {
    user.find({ username: username }).exec((err, data) => {
      if (err) {
        console.log("empty");
      }
      if (data) {
        console.log("Find : " + JSON.stringify(data));
        bcrypt.compare(password, data[0].password, function (err, isMatch) {
          if (err) {
            console.log("empty");
          } else if (!isMatch) {
            console.log("Password didn't match");
            res.render("layouts/auth", {
              Template: "login",
              error: "Wrong username or password",
            });
          } else {
            if (data[0].status == "user") {
              req.session.user = data[0].status;
              req.session.username = data[0].username;
              res.redirect("/");
            } else if (data[0].status == "admin") {
              req.session.user = data[0].status;
              res.redirect("/admin");
            }
          }
        });
      }
    });
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
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
