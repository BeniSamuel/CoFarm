const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const config = require("../config/config.config");

exports.loginUser = async (req, res) => {
  try {
    const Schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = Schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User does not exist!");

    const passwordResult = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordResult) return res.status(400).send("Incorrect password");

    const token = jwt.sign(
      { userId: user._id, email: req.body.email },
      config.jwtSecretKey,
      { expiresIn: "1h" }
    );
    return res.json({
      message: "Login successful",
      access_token: token,
    });
  } catch (error) {
    console.log("internal server error due to", error); // Log the error for debugging
    return res.status(500).send("Internal server error");
  }
};
