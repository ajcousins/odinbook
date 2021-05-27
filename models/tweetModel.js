const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  textContent: {
    type: String,
    required: true,
    maxlength: 280,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateAdded: {
    type: Date,
    required: [true, "An item must have a dateAdded"],
    default: Date.now(),
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
