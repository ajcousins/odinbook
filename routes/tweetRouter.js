const express = require("express");
const tweetController = require("./../controllers/tweetController");

const router = express.Router();

router
  .route("/")
  .get(tweetController.getAllTweets)
  .post(tweetController.createTweet);

router
  .route("/:id")
  .get(tweetController.getTweet)
  .patch(tweetController.updateTweet)
  .delete(tweetController.deleteTweet);

module.exports = router;
