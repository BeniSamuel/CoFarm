require("dotenv").config;

module.export = {
  port: 4040,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
