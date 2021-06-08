// const path = require("path");
const express = require("express");
// const session = require("express-session");
// const passport = require("passport");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const compression = require("compression");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRouter");
const tweetRouter = require("./routes/tweetRouter");

const authController = require("./controllers/authController");

const { promisify } = require("util");
const jwt = require("jsonwebtoken");

// MIDDLEWARE
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(helmet());
app.use(compression());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(function (req, res, next) {
//   res.locals.currentUser = req.user;
//   next();
// });

app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ROUTES

// // Temporary root. Check login/ token. Redirect to get all users.
// app.route("/tweets/").get(authController.protect, (req, res) => {
//   res.redirect("/api/v1/tweets");
// });

app.use("/tweets/", authController.protect, tweetRouter);

// // Add current user from jwt/cookie to req obj
// app.use(async (req, res, next) => {
//   const decoded = await promisify(jwt.verify)(
//     req.cookies.jwt,
//     process.env.JWT_SECRET
//   );
//   req.currentUser = decoded.id;
//   next();
// });

// // Temporary root.
// app.route("/users/").get((req, res) => {
//   res.send({ message: "API is working! Testing test 123." });
// });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);

app.all("*", (req, res, next) => {
  // If anything is passed into next(), express assumes it is an error and skip all other middlewares.
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
