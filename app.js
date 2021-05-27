const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

const userRouter = require("./routes/userRouter");
const tweetRouter = require("./routes/tweetRouter");

const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(compression());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ROUTES

// Temporary redirect
app.route("/").get((req, res) => {
  res.redirect("/api/v1/users");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);

module.exports = app;
