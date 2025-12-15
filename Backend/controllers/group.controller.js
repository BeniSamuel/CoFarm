const Group = require("../models/group.model");
const GroupMessage = require("../models/groupMessage.model");
const Joi = require("joi");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      description: Joi.string().max(200).optional().allow(""),
      memberIds: Joi.array().items(Joi.string()).min(2).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, description, memberIds } = req.body;
    const userId = req.user.userId || req.user._id;

    // Add creator to members
    const members = [...new Set([userId, ...memberIds])];

    const newGroup = new Group({
      name,
      description: description || "",
      members,
      createdBy: userId,
    });

    const savedGroup = await newGroup.save();
    await savedGroup.populate("members", "name email");
    await savedGroup.populate("createdBy", "name email");

    res.status(201).json({
      message: "Group created successfully!",
      group: savedGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all groups for a user
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const groups = await Group.find({
      members: userId,
    })
      .populate("members", "name email")
      .populate("createdBy", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId || req.user._id;

    const group = await Group.findOne({
      _id: groupId,
      members: userId,
    })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add members to a group
exports.addMembersToGroup = async (req, res) => {
  try {
    const schema = Joi.object({
      memberIds: Joi.array().items(Joi.string()).min(1).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { groupId } = req.params;
    const { memberIds } = req.body;
    const userId = req.user.userId || req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }

    // Check if user is a member
    if (!group.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group!" });
    }

    // Add new members (avoid duplicates)
    const uniqueMembers = [...new Set([...group.members, ...memberIds])];
    group.members = uniqueMembers;
    await group.save();

    await group.populate("members", "name email");

    res.status(200).json({
      message: "Members added successfully!",
      group,
    });
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Remove members from a group
exports.removeMembersFromGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user.userId || req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }

    // Only creator can remove members
    if (group.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only group creator can remove members!" });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    await group.save();

    await group.populate("members", "name email");

    res.status(200).json({
      message: "Member removed successfully!",
      group,
    });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get messages for a group
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId || req.user._id;

    // Check if user is a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }

    if (!group.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group!" });
    }

    const messages = await GroupMessage.find({ groupId })
      .populate("senderId", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages || []);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Send message to a group
exports.sendGroupMessage = async (req, res) => {
  try {
    const schema = Joi.object({
      message: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { groupId } = req.params;
    const { message } = req.body;
    const senderId = req.user.userId || req.user._id;

    // Check if user is a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }

    if (!group.members.includes(senderId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group!" });
    }

    const newMessage = new GroupMessage({
      groupId,
      senderId,
      message,
    });

    const savedMessage = await newMessage.save();
    await savedMessage.populate("senderId", "name email");

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
