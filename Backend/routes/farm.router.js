const express = require("express");
const router = express.Router();
const farmController = require("../controllers/farm.controller");
const validateRequestToken = require("../middleware/auth.middleware");

// All routes require authentication
router.use(validateRequestToken);

// Create a new farm
router.post("/", farmController.createFarm);

// Get all farms for the authenticated user
router.get("/", farmController.getUserFarms);

// Get a single farm by ID
router.get("/:farmId", farmController.getFarmById);

// Update a farm
router.put("/:farmId", farmController.updateFarm);

// Delete a farm
router.delete("/:farmId", farmController.deleteFarm);

module.exports = router;
