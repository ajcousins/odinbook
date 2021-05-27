const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
  },
  handle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email address."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  joinedDate: {
    type: Date,
    required: [true, "A user must have a joined date"],
  },
  bio: {
    type: String,
    maxlength: 280,
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  photo: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
