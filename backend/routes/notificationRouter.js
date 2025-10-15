const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const notificationRouter = express.Router();
const {
  getNotifications,
  clearNotifications,
} = require("../controllers/Notification");

notificationRouter.get("/:userId", verifyToken, getNotifications);
notificationRouter.delete(
  "/clearNotifications",
  verifyToken,
  clearNotifications
);

module.exports = notificationRouter;
