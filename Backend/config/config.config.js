require("dotenv").config();

module.exports = {
  port: 4040,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
