const express = require("express");
const { getAllMessages, getAllAdmins } = require("../controllers/Messages");
const messageRouter = express.Router();

messageRouter.get("/:userId/:adminId", getAllMessages);
messageRouter.get("/get-all-admins", getAllAdmins);

module.exports = messageRouter;
