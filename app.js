const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productsRoute = require("./routes/products-routes");
const usersRoute = require("./routes/users-routes");
const passportRoute = require("./routes/passport-routes");
const HttpError = require("./models/http-error");

require("dotenv").config();

const passportSetup = require("./passport");
//
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");

const app = express();

app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "session",
    keys: ["danny"],
    maxAge: 1000 * 60 * 30,
    sameSite: "none",
    secure: true,
  })
);

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.SERVER_URL,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use("/api/products", productsRoute);

app.use("/api/users", usersRoute);

app.use("/auth", passportRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 401);
  throw error;
});

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen("choco-chair-backend.herokuapp.com/");
  })
  .catch((error) => {});
