const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const notificationRouter = express.Router();
const { getNotifications } = require("../controllers/Notification");

notificationRouter.get("/:userId", verifyToken, getNotifications);

module.exports = notificationRouter;
