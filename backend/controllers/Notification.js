const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ receiverId: userId });

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
};

const clearNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.deleteMany({ receiverId: userId });

    res.status(200).json({
      success: true,
      message: "Notifications cleared successfully",
      data: notifications,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to clear notifications",
      error: err.message,
    });
  }
};

module.exports = { getNotifications, clearNotifications };
