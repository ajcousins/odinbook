const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
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

const Message = mongoose.model("Message", userSchema);

module.exports = Message;
