const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const config = require("../config/config");

exports.loginUser = async (req, res) => {
    try {
        const Schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        const { error } = Schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User does not exist!");
        
        const passwordResult = await bcrypt.compare(req.body.password, user.password);
        if (!passwordResult) return res.status(400).send("Incorrect password");

        const token = jwt.sign({ email: req.body.email }, config.jwtSecretKey, { expiresIn: '15d' });
        res.setHeader("x-authToken", token);
        return res.send("User logged in successfully!");

    } catch (error) {
        console.log("internal server error due to", error); // Log the error for debugging
        return res.status(500).send("Internal server error");
    }
};
