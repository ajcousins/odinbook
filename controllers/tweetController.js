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
    .where("replyParent")
    .equals(null)
    .sort("-dateAdded")
    .populate("user")
    .populate({ path: "retweetChild", populate: { path: "user" } })
    // .populate("retweetedTweets")
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
    .populate("user")
    .populate({ path: "retweetChild", populate: { path: "user" } })
    .exec();

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
    // Is the new tweet a retweet? Is there a 'retweetChild' in req.body?
    if (req.body.retweetChild) {
      const currentUserId = req.user._id;

      // RETWEET
      const newTweet = await Tweet.create(req.body);

      // Add tweet to user's list of retweets
      // Should add resulting parent tweet- as this can be populated and can also have access to child.
      const updatedUser = await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { retweetedTweets: newTweet } },
        { new: true }
      );

      // Add user id to retweet array of child.
      const updatedTweet = await Tweet.findByIdAndUpdate(
        req.body.retweetChild,
        {
          $addToSet: { retweets: currentUserId },
        },
        { new: true }
      );

      res.status(201).json({
        status: "Success. Retweet",
        data: {
          tweet: newTweet,
          child: updatedTweet,
          updatedUser,
        },
      });
    } else {
      // NORMAL TWEET
      const newTweet = await Tweet.create(req.body);
      const replyParent = await Tweet.findByIdAndUpdate(
        req.body.replyParent,
        {
          $addToSet: {
            replies: newTweet._id,
          },
        },
        { new: true }
      );

      res.status(201).json({
        status: "Success",
        data: {
          tweet: newTweet,
          replyParent,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// UNDO RETWEET
exports.undoRetweet = async (req, res) => {
  console.log("undoRetweet");
  try {
    const currentUserId = req.user._id;
    const tweetId = req.body.retweetParent; //<-- ID of wrapper tweet/ parent.

    const parentTweet = await Tweet.findById(tweetId);

    // // 0. Get childTweet.
    // const childTweet = await Tweet.findById(parentTweet.retweetChild);

    // 2. Remove user ID from child array (tweet that was retweeted).
    const updatedChildTweet = await Tweet.findByIdAndUpdate(
      parentTweet.retweetChild,
      { $pull: { retweets: currentUserId } },
      { new: true }
    );

    // const tweetId = req.body.retweetParent; //<-- ID of original tweet that was retweeted.

    // 1. Remove childTweet from user's list of retweets.
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { retweetedTweets: req.body.retweetParent } },
      { new: true }
    );

    // 3. Delete parent tweet (wrapper tweet with no text content).
    await Tweet.findByIdAndDelete(parentTweet._id);

    res.status(201).json({
      status: "Success. Undo retweet.",
      data: {
        // tweet: newTweet,
        // replyParent,
        updatedUser,
        updatedChildTweet,
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
    // Check if tweet has a replyParent.
    const tweet = await Tweet.findById(req.params.id);
    console.log(tweet.replyParent);

    const parent = await Tweet.findByIdAndUpdate(
      tweet.replyParent,
      {
        $pull: {
          replies: req.params.id,
        },
      },
      { new: true }
    );

    await Tweet.findByIdAndDelete(req.params.id);

    res.status(201).json({
      status: "Success",
      tweet,
      parent,
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

// GET REPLIES
exports.getReplies = async (req, res) => {
  const replyParent = req.params.id;

  const tweets = await Tweet.find()
    .where("replyParent")
    .equals(replyParent)
    .sort("dateAdded")
    .populate("user")
    .exec();

  res.status(200).json({
    status: "Success",
    data: {
      tweets,
    },
  });
};
