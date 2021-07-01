const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 35,
    },
    handle: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email address."],
      unique: [true, "Email already registered"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 4,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm password."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password does not match confirmation.",
      },
    },
    passwordChangeAt: {
      // TO DO: Logic for setting password change date to be implemented.
      type: Date,
    },
    joinedDate: {
      type: Date,
      required: [true, "A user must have a joined date"],
      default: Date.now(),
    },
    bio: {
      type: String,
      maxlength: 160,
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    photo: {
      type: String,
      default: "default.jpg",
    },
    likedTweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
    retweetedTweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
  },
  {
    toJSON: { virtuals: true },
  }
);

// DOCUMENT MIDDLEWARE FUNCTIONS

// Pre-save/ document middleware
// Between getting data and saving it to the database.
userSchema.pre("save", async function (next) {
  // Only update when password field has changed.
  if (!this.isModified("password")) return next();

  // Hash password with cost of "12" CPU
  this.password = await bcrypt.hash(this.password, 12);

  // Reset passwordConfirm field so that it is not persisted in database.
  this.passwordConfirm = undefined;

  next();
});

// Instance method- available on all user documents.
// Compares encrypted passwords.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

// Follow~ quantities
userSchema.virtual("following_length").get(function () {
  return this.following.length;
});

userSchema.virtual("followers_length").get(function () {
  return this.followers.length;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
