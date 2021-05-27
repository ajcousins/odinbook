const User = require("./../models/userModel");

// GET ALL
exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "Success",
    data: {
      users,
    },
  });
};

// GET ONE

// CREATE ONE
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
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

// DELETE ONE
