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
////
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
// const methodOverride = require("method-override");
const crypto = require("crypto");
////

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

//// --- FOR IMAGES ---
const mongoURI = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

////

// ROUTES
//// --- FOR IMAGES ---

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), (req, res) => {
  // res.json({ file: req.file });
  // Temporary refresh
  res.redirect("/");
});

// /files - Return array of files in json.
app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }
    // Files exist
    return res.json(files);
  });
});

// /files/:filename Return file in json.
app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exist",
      });
    }
    // File Exists
    return res.json(file);
  });
});

// /image/:filename Return image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exist",
      });
    }
    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

////

// Protected route- adds currentUser to req object at authController.
app.use("/tweets/", authController.protect, tweetRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.all("*", (req, res, next) => {
  // If anything is passed into next(), express assumes it is an error and skip all other middlewares.
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // res.sendFile(path.join(__dirname + "/public/build/index.html"));
});

app.use(globalErrorHandler);

module.exports = app;
