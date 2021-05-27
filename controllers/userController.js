// const User = require("./../models/userModel");

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "Oh hey!",
    },
  });
};
