const aws = require("aws-sdk");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const AppError = require("../utils/appError");
// const { findById } = require("./../models/userModel");
const User = require("./../models/userModel");
// const { Stream } = require("stream");

// Uploaded saved into memory as buffer. Accessible at req.file.buffer.
// const multerStorage = multer.memoryStorage();

const s3 = new aws.S3({ apiVersion: "2006-03-01" });
// Needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

const multerFilter = (req, file, cb) => {
  // Test if uploaded file is an image. Pass true into callback function if image, otherwise false if not.
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image!", 400), false);
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "odinbookb7cecf36981344ffaa9c96650af9d3fc102443-dev",
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: "original",
        key: function (req, file, cb) {
          cb(null, req.filename);
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(400, 400).jpeg());
        },
      },
    ],
  }),
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.applyFilename = (req, res, next) => {
  req.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  next();
};

// GET USER IMAGES
exports.getUserImages = async (req, res, next) => {
  try {
    const bucket = "odinbookb7cecf36981344ffaa9c96650af9d3fc102443-dev";

    aws.config.setPromisesDependency();
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "eu-west-1",
    });

    // Retrieve list of object keys
    const s3 = new aws.S3();
    const response = await s3
      .listObjectsV2({
        Bucket: bucket,
      })
      .promise();

    // Retrieve signed URLs
    let imageKeys = await Promise.all(
      response.Contents.map(async (k) => {
        let url = await s3.getSignedUrlPromise("getObject", {
          Bucket: bucket,
          Key: k.Key,
          Expires: 3600,
        });
        // console.log(url);
        return { Key: k.Key, url };
      })
    );

    res.status(200).json({
      status: "Success",
      data: {
        imageKeys,
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

// // UPDATE ONE
// exports.updateUser = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(201).json({
//       status: "Success",
//       data: {
//         updatedUser,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "Fail",
//       message: "Invalid data sent",
//       error: err,
//     });
//   }
// };

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
    if (req.file) filteredBody.photo = req.filename;

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

// WHO TO FOLLOW
// Get users that are not followed by currentUser. Order by activity (followers * tweets), limit by 5.
exports.whoToFollow = async (req, res) => {
  try {
    const limit = req.query.limit;
    console.log("params:", limit);

    const currentUser = req.user;

    const allUsers = await User.find().select(
      "-joinedDate -likedTweets -email -bio"
    );

    const whoToFollow = await allUsers
      // Remove users already being followed and currentUser
      .filter((user) => {
        return !(
          currentUser.following.includes(user._id) ||
          String(user._id).valueOf() === String(currentUser._id).valueOf()
        );
      })

      // Sort by number of followers.
      .sort((a, b) => {
        if (a.followers.length > b.followers.length) return -1;
        if (a.followers.length < b.followers.length) return 1;
        else return 0;
      })

      // Set limit.
      .slice(0, limit);

    res.status(201).json({
      status: "Success",
      currentUserId: currentUser._id,
      whoToFollow,
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
