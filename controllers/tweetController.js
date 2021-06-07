const Tweet = require("../models/tweetModel");
const User = require("../models/userModel");

// GET ALL
exports.getAllTweets = async (req, res) => {
  const tweets = await Tweet.find().populate("user");

  res.status(200).json({
    status: "Success",
    data: {
      tweets,
    },
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
