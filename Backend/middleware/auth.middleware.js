const jwt = require("jsonwebtoken");
const config = require("../config/config.config");

async function validateRequestToken(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res
        .status(401)
        .json({ message: "Authorization header not found!" });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not found!" });
    }

    const verify = jwt.verify(token, config.jwtSecretKey);
    req.user = verify;
    next();
  } catch (ex) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
}

module.exports = validateRequestToken;
