const User = require("../models/user.model");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config.config");

exports.createUser = async (req, res) => {
  try {
    const Schema = Joi.object({
      name: Joi.string().min(4).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = Schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    newUser = await newUser.save();

    const token = await jwt.sign(
      { email: req.body.email },
      config.jwtSecretKey,
      { expiresIn: "15d" }
    );

    return res.status(201).json({ message: "User Created Successfully!!", access_token: token })
  } catch (error) {
    console.log("failed to make the following response", error);
    res.status(500).send("Internal Server Error");
  }
};
