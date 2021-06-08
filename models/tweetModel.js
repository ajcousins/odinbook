const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const tweetSchema = new mongoose.Schema(
  {
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
      default: Date.now,
    },
    replies: {
      type: Number,
      default: 0,
    },
    retweets: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

// Time since tweet/ tweetAge
tweetSchema.virtual("tweetAge").get(function () {
  // Convert time to seconds.
  let time = Math.floor(
    (DateTime.now() - DateTime.fromJSDate(this.dateAdded)) / 1000
  );

  const currentYear = DateTime.now().year;

  if (time < 60) {
    // If time is less than 60 seconds
    return time + "s";
  } else if (time < 3600) {
    // If time is less than 60 minutes
    return Math.floor(time / 60) + "m";
  } else if (time < 86400) {
    // If time is less than 24 hours
    return Math.floor(time / 3600) + "h";
  } else {
    // If time is over 24 hours, return formatted date string.
    let formatted = DateTime.fromJSDate(this.dateAdded).toLocaleString(
      DateTime.DATE_MED
    );
    return formatted.split(" ")[2] == currentYear
      ? formatted.split(",")[0]
      : formatted;
  }
});

// Number formats
tweetSchema.virtual("replies_short").get(function () {
  return numberFormat(this.replies);
});

tweetSchema.virtual("retweets_short").get(function () {
  return numberFormat(this.retweets);
});

tweetSchema.virtual("likes_short").get(function () {
  return numberFormat(this.likes);
});

const numberFormat = (prop) => {
  let quantity = prop;
  return quantity > 999 ? Math.floor(quantity / 1000) + "K" : quantity;
};

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
