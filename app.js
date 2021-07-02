const express = require("express");
const morgan = require("morgan");
const path = require("path");
const AppError = require("./utils/appError");
const compression = require("compression");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRouter");
const tweetRouter = require("./routes/tweetRouter");

const authController = require("./controllers/authController");

// MIDDLEWARE
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.use(helmet());
app.use(compression());

app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES

// Protected route- adds currentUser to req object at authController.
app.use("/tweets/", authController.protect, tweetRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("public/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "build", "index.html"));
  });
}

app.all("*", (req, res, next) => {
  // If anything is passed into next(), express assumes it is an error and skip all other middlewares.
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // res.sendFile(path.join(__dirname + "/public/build/index.html"));
});

app.use(globalErrorHandler);

module.exports = app;
