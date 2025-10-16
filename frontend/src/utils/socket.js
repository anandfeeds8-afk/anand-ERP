import { io } from "socket.io-client";

const socket = io("https://poultry-feed-management-software-3.onrender.com", {
  transports: ["websocket"], // force websocket
  withCredentials: true, // agar auth/cookies use ho rahe ho
});

export default socket;
