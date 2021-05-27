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
    unique: [true, "Handle already exists"],
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
  },
  joinedDate: {
    type: Date,
    required: [true, "A user must have a joined date"],
    default: Date.now(),
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
