const Admin = require("../models/Admin.js");
const Message = require("../models/Message.js");

const getAllMessages = async (req, res) => {
  const { userId, adminId } = req.params;
  const messages = await Message.find({
    senderId: adminId,
    receiverId: userId,
  });

  if (!messages) {
    return res.status(404).json({ message: "No messages found" });
  }

  res.status(200).json({
    data: messages,
    success: true,
    message: "Messages fetched successfully",
  });
};

const getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res
    .status(200)
    .json({ data: admins, message: "Fetched all admins", success: true });
};

module.exports = { getAllMessages, getAllAdmins };
