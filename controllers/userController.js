const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/appError");
const { findById } = require("./../models/userModel");
const User = require("./../models/userModel");

// Uploaded saved into memory as buffer. Accessible at req.file.buffer.
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // Test if uploaded file is an image. Pass true into callback function if image, otherwise false if not.
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image!", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

// GET ALL
exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "Success",
    data: {
      users,
    },
  });
};

exports.currentUser = (req, res) => {
  try {
    const currentUser = req.user;
    console.log(req.user);

    res.status(200).json({
      status: "Success",
      data: {
        currentUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// GET ONE
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// CREATE ONE
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// UPDATE ONE
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// DELETE ONE
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
      status: "Success",
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// FOLLOW USER
exports.followUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const userToFollow = req.body.userToFollow;

    // $addToSet NOT $push... to ensure unique id.
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $addToSet: { following: userToFollow },
      },
      { new: true }
    );

    const userBeingFollowed = await User.findByIdAndUpdate(
      userToFollow,
      {
        $addToSet: { followers: currentUser._id },
      },
      { new: true }
    );

    res.status(201).json({
      status: "Success",
      updatedUser: {
        _id: updatedUser._id,
        name: updatedUser.name,
        following: updatedUser.following,
      },
      userBeingFollowed: {
        _id: userBeingFollowed._id,
        name: userBeingFollowed.name,
        followers: userBeingFollowed.followers,
      },
      // updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// UNFOLLOW USER
exports.unfollowUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const userToUnfollow = req.body.userToUnfollow;

    // $addToSet NOT $push... to ensure unique id.
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $pull: { following: userToUnfollow },
      },
      { new: true }
    );

    const userBeingUnfollowed = await User.findByIdAndUpdate(
      userToUnfollow,
      {
        $pull: { followers: currentUser._id },
      },
      { new: true }
    );

    res.status(201).json({
      status: "Success",
      updatedUser: {
        _id: updatedUser._id,
        name: updatedUser.name,
        following: updatedUser.following,
      },
      userBeingUnfollowed: {
        _id: userBeingUnfollowed._id,
        name: userBeingUnfollowed.name,
        followers: userBeingUnfollowed.followers,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// GET FOLLOWERS LIST
exports.followersList = async (req, res) => {
  try {
    const selectedUser = await User.findById(req.params.id);
    const followersInfo = await User.find()
      .where("_id")
      .in(selectedUser.followers)
      .exec();

    res.status(201).json({
      status: "Success",
      followersInfo,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// GET FOLLOWING LIST
exports.followingList = async (req, res) => {
  try {
    const selectedUser = await User.findById(req.params.id);
    const followingInfo = await User.find()
      .where("_id")
      .in(selectedUser.following)
      .exec();

    res.status(201).json({
      status: "Success",
      followingInfo,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// UPDATE USER
exports.updateUser = async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req.body);

    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email", "bio");
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// Delete all redundant profile photos in filesystem
exports.redundantPhotos = async (req, res) => {
  try {
    const allUsers = await User.find();
    const photosInUse = allUsers.map((user) => user.photo);

    const directoryPath = path.join(__dirname, "./../public/img/users");
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return console.log("Unable to scan directory: ", err);
      }
      files.forEach((file) => {
        if (photosInUse.includes(file)) return;
        if (file === "default.jpg") return;
        else {
          console.log(file);
          fs.unlink(`${directoryPath}/${file}`, (err) => {
            if (err) throw err;
            console.log(file, "deleted");
          });
        }
      });
    });

    res.status(201).json({
      status: "Success",
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// WHO TO FOLLOW
// Get users that are not followed by currentUser. Order by activity (followers * tweets), limit by 5.
exports.whoToFollow = async (req, res) => {
  try {
    const currentUser = req.user;

    const allUsers = await User.find().select(
      "-joinedDate -likedTweets -email"
    );

    // Remove users already being followed and currentUser
    const notFollowing = await allUsers.filter((user) => {
      return !(
        currentUser.following.includes(user._id) ||
        String(user._id).valueOf() === String(currentUser._id).valueOf()
      );
    });

    // Reorder by followers.
    // Limit by 5.

    res.status(201).json({
      status: "Success",
      currentUserId: currentUser._id,
      // following: currentUser.following,
      // allUsers,
      notFollowing,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

////  UTIL FUNCTIONS
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
