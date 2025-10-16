// socket.js
const { Server } = require("socket.io");
const Message = require("../models/Message");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://poultry-feed-management-software-4.onrender.com",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // Handle joining rooms
    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`📌 Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle join chat room
    socket.on("joinChatRoom", (roomId) => {
      socket.join(roomId);
      console.log(`📌 employee ${socket.id} joined room ${roomId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      try {
        console.log("📨 Received message:", data);

        // Save message to database
        const message = new Message(data);
        await message.save();

        io.to(data.senderId).emit("receiveMessage", data);
        io.to(data.receiverId).emit("receiveMessage", data);
      } catch (error) {
        console.error("❌ Error handling message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle leaving rooms
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`👋 Socket ${socket.id} left room ${roomId}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Helper function to emit notifications
const emitNotification = (userId, event, data) => {
  if (!io) {
    console.error("Socket.io not initialized!");
    return;
  }

  console.log(`📢 Emitting ${event} to user ${userId}`);
  io.to(userId).emit(event, data);
};

module.exports = { getIO, initSocket, emitNotification };
