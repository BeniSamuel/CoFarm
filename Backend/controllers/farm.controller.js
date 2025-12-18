const Farm = require("../models/farm.model");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/farms";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "farm-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
}).array("images", 10); // Allow up to 10 images

// Create a new farm
exports.createFarm = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        area: Joi.number().positive().required(),
        location: Joi.string().min(3).max(200).required(),
        cropAmount: Joi.number().min(0).optional().default(0),
        cropCategories: Joi.array().items(Joi.string()).optional().default([]),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        // Clean up uploaded files if validation fails
        if (req.files) {
          req.files.forEach((file) => {
            fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({ message: error.details[0].message });
      }

      const { name, area, location, cropAmount, cropCategories } = req.body;
      const ownerId = req.user.userId || req.user._id;

      // Handle uploaded images
      const images = req.files
        ? req.files.map((file) => `/uploads/farms/${file.filename}`)
        : [];

      // Parse cropCategories if it's a JSON string
      let parsedCategories = [];
      if (cropCategories) {
        if (typeof cropCategories === "string") {
          try {
            parsedCategories = JSON.parse(cropCategories);
            if (!Array.isArray(parsedCategories)) {
              parsedCategories = cropCategories.split(",").map((c) => c.trim());
            }
          } catch {
            // If JSON parse fails, treat as comma-separated string
            parsedCategories = cropCategories
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);
          }
        } else if (Array.isArray(cropCategories)) {
          parsedCategories = cropCategories;
        }
      }

      const newFarm = new Farm({
        name,
        area: parseFloat(area),
        location,
        cropAmount: cropAmount ? parseFloat(cropAmount) : 0,
        cropCategories: parsedCategories,
        images,
        owner: ownerId,
      });

      const savedFarm = await newFarm.save();
      await savedFarm.populate("owner", "name email");

      res.status(201).json({
        message: "Farm created successfully!",
        farm: savedFarm,
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      console.error("Error creating farm:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  });
};

// Get all farms for a user
exports.getUserFarms = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const farms = await Farm.find({ owner: userId })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(farms);
  } catch (error) {
    console.error("Error fetching farms:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a single farm by ID
exports.getFarmById = async (req, res) => {
  try {
    const { farmId } = req.params;
    const userId = req.user.userId || req.user._id;

    const farm = await Farm.findOne({
      _id: farmId,
      owner: userId,
    }).populate("owner", "name email");

    if (!farm) {
      return res.status(404).json({ message: "Farm not found!" });
    }

    res.status(200).json(farm);
  } catch (error) {
    console.error("Error fetching farm:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a farm
exports.updateFarm = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { farmId } = req.params;
      const userId = req.user.userId || req.user._id;

      const farm = await Farm.findById(farmId);
      if (!farm) {
        return res.status(404).json({ message: "Farm not found!" });
      }

      // Check ownership
      if (farm.owner.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "You don't have permission to update this farm!" });
      }

      const schema = Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        area: Joi.number().positive().optional(),
        location: Joi.string().min(3).max(200).optional(),
        cropAmount: Joi.number().min(0).optional(),
        cropCategories: Joi.array().items(Joi.string()).optional(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        if (req.files) {
          req.files.forEach((file) => {
            fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({ message: error.details[0].message });
      }

      // Update fields
      if (req.body.name) farm.name = req.body.name;
      if (req.body.area) farm.area = parseFloat(req.body.area);
      if (req.body.location) farm.location = req.body.location;
      if (req.body.cropAmount !== undefined)
        farm.cropAmount = parseFloat(req.body.cropAmount);
      if (req.body.cropCategories) {
        farm.cropCategories =
          typeof req.body.cropCategories === "string"
            ? req.body.cropCategories.split(",").map((c) => c.trim())
            : req.body.cropCategories;
      }

      // Handle new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(
          (file) => `/uploads/farms/${file.filename}`
        );
        farm.images = [...(farm.images || []), ...newImages];
      }

      await farm.save();
      await farm.populate("owner", "name email");

      res.status(200).json({
        message: "Farm updated successfully!",
        farm,
      });
    } catch (error) {
      if (req.files) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      console.error("Error updating farm:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  });
};

// Delete a farm
exports.deleteFarm = async (req, res) => {
  try {
    const { farmId } = req.params;
    const userId = req.user.userId || req.user._id;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: "Farm not found!" });
    }

    // Check ownership
    if (farm.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this farm!" });
    }

    // Delete associated images
    if (farm.images && farm.images.length > 0) {
      farm.images.forEach((imagePath) => {
        const fullPath = path.join(__dirname, "..", imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Farm.findByIdAndDelete(farmId);

    res.status(200).json({ message: "Farm deleted successfully!" });
  } catch (error) {
    console.error("Error deleting farm:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
