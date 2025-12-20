require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4040,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};