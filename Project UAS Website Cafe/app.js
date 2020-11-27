const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();

// view engine
app.set("view engine", "ejs");

// body-parser to parse request body
app.use(bodyParser.urlencoded());

// static files
app.use(express.static(path.join(__dirname, "./public/assets")));

// enabling session
app.use(
  session({
    secret: "some_secret_key",
    cookie: {},
  })
);

// routes
const index = require("./routes/main");
const auth = require("./routes/auth");
const adm = require("./routes/admin");

app.use("/", index);
app.use("/auth", auth);
app.use("/admin", adm);

app.listen(3000);
console.log("Server runs at port 3000...");
