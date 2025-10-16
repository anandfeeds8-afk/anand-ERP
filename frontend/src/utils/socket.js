import { io } from "socket.io-client";

const socket = io("https://poultry-feed-management-software-3.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
