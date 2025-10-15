const Admin = require("../models/Admin.js");
const Message = require("../models/Message.js");

const getAllMessages = async (req, res) => {
  try {
    const { userId, adminId } = req.params;

    // Fetch conversation both ways and sort by timestamp
    const messages = await Message.find({
      $or: [
        { senderId: adminId, receiverId: userId },
        { senderId: userId, receiverId: adminId },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({
      data: messages,
      success: true,
      message: "Messages fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: err.message,
    });
  }
};

const getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res
    .status(200)
    .json({ data: admins, message: "Fetched all admins", success: true });
};

module.exports = { getAllMessages, getAllAdmins };
