const Tweet = require("../models/tweetModel");
const User = require("../models/userModel");

// GET ALL
exports.getAllTweets = async (req, res) => {
  const currentUser = req.user;
  console.log("currentUser:", currentUser);

  // // Get all tweets from ALL users. Temporary.
  // const tweets = await Tweet.find().sort("-dateAdded").populate("user");

  // Get all tweets from users being followed by currentUser.
  const broadcast = currentUser.following;
  // Include currentUser's ID in list
  broadcast.push(currentUser._id);

  const tweets = await Tweet.find()
    .where("user")
    .in(broadcast)
    .sort("-dateAdded")
    .populate("user")
    .exec();

  res.status(200).json({
    status: "Success",
    data: {
      currentUser,
      tweets,
    },
  });
};

// GET TWEETS BY USER
exports.getTweetsByUser = async (req, res) => {
  const userTweets = await Tweet.find({
    user: req.params.userId,
  })
    .sort("-dateAdded")
    .populate("user");

  res.status(200).json({
    status: "Success",
    user: req.params.userId,
    userTweets,
  });
};

// GET ONE
exports.getTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        tweet,
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
exports.createTweet = async (req, res) => {
  try {
    const newTweet = await Tweet.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        tweet: newTweet,
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
exports.updateTweet = async (req, res) => {
  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      status: "Success",
      data: {
        updatedTweet,
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
exports.deleteTweet = async (req, res) => {
  try {
    await Tweet.findByIdAndDelete(req.params.id);

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

// LIKE TWEET
exports.likeTweet = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const tweetId = req.params.id;

    console.log("currentUserID", currentUserId);
    console.log("tweetId", tweetId);

    // Add tweet to user's list of likes
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $addToSet: { likedTweets: tweetId },
      },
      { new: true }
    );

    // Add user to tweet's list of users
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $addToSet: { likes: currentUserId },
      },
      { new: true }
    );
    // 'likes' property already existed in Tweet Model as a 'number' type instead of an array.
    // Wasn't able to add to set. Had to manually delete the field in mongo, before adding here.

    res.status(201).json({
      status: "Success",
      updatedUser,
      updatedTweet,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// LIKE TWEET
exports.unlikeTweet = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const tweetId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: { likedTweets: tweetId },
      },
      { new: true }
    );

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $pull: { likes: currentUserId },
      },
      { new: true }
    );

    res.status(201).json({
      status: "Success",
      updatedUser,
      updatedTweet,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};
