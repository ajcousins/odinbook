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
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        user,
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
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Success",
      data: {
        updatedUser,
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

// DELETE ONE
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
      status: "Success",
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// FOLLOW USER
exports.followUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const userToFollow = req.body.userToFollow;

    // $addToSet NOT $push... to ensure unique id.
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $addToSet: { following: userToFollow },
      },
      { new: true }
    );

    const userBeingFollowed = await User.findByIdAndUpdate(
      userToFollow,
      {
        $addToSet: { followers: currentUser._id },
      },
      { new: true }
    );

    res.status(201).json({
      status: "Success",
      updatedUser: {
        _id: updatedUser._id,
        name: updatedUser.name,
        following: updatedUser.following,
      },
      userBeingFollowed: {
        _id: userBeingFollowed._id,
        name: userBeingFollowed.name,
        followers: userBeingFollowed.followers,
      },
      // updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid data sent",
      error: err,
    });
  }
};

// UNFOLLOW USER
exports.unfollowUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const userToUnfollow = req.body.userToUnfollow;

    // $addToSet NOT $push... to ensure unique id.
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $pull: { following: userToUnfollow },
      },
      { new: true }
    );

    const userBeingUnfollowed = await User.findByIdAndUpdate(
      userToUnfollow,
      {
        $pull: { followers: currentUser._id },
      },
      { new: true }
    );

    res.status(201).json({
      status: "Success",
      updatedUser: {
        _id: updatedUser._id,
        name: updatedUser.name,
        following: updatedUser.following,
      },
      userBeingUnfollowed: {
        _id: userBeingUnfollowed._id,
        name: userBeingUnfollowed.name,
        followers: userBeingUnfollowed.followers,
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
