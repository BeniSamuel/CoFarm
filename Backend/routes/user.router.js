const userFunc = require("../controllers/user.controller");
const express = require("express");
const validateRequestToken = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", userFunc.getUsers);
router.get("/me", validateRequestToken, userFunc.getAsingleUser);

module.exports = router;
