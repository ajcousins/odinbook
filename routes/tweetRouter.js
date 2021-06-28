const express = require("express");
const tweetController = require("./../controllers/tweetController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, tweetController.getAllTweets)
  .post(authController.protect, tweetController.createTweet);

router
  .route("/:id")
  .get(tweetController.getTweet)
  .patch(tweetController.updateTweet)
  .delete(tweetController.deleteTweet);

router.route("/user/:userId").get(tweetController.getTweetsByUser);

router
  .route("/:id/like")
  .patch(authController.protect, tweetController.likeTweet);

router
  .route("/:id/unlike")
  .patch(authController.protect, tweetController.unlikeTweet);

module.exports = router;
