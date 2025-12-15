const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");
const validateRequestToken = require("../middleware/auth.middleware");

// All routes require authentication
router.use(validateRequestToken);

// Create a new group
router.post("/", groupController.createGroup);

// Get all groups for the authenticated user
router.get("/", groupController.getUserGroups);

// Get a single group by ID
router.get("/:groupId", groupController.getGroupById);

// Get messages for a group
router.get("/:groupId/messages", groupController.getGroupMessages);

// Send message to a group
router.post("/:groupId/messages", groupController.sendGroupMessage);

// Add members to a group
router.post("/:groupId/members", groupController.addMembersToGroup);

// Remove a member from a group
router.delete(
  "/:groupId/members/:memberId",
  groupController.removeMembersFromGroup
);

module.exports = router;
