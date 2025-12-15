const User = require("../models/user.model");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords from response

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error!", error: error.message });
  }
};

exports.getAsingleUser = async (req, res) => {
  try {
    let user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user = await User.findOne({ email: user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
