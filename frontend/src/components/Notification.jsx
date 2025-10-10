import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser.js";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import Avatar from "./Avatar.jsx";
import { SendHorizontal } from "lucide-react";
import useMessages from "../hooks/useMessages.js";
import socket from "../utils/socket.js";

const Notification = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const { admins, loadingAdmins } = useMessages();

  const [notifications, setNotifications] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState({});

  const [activeTab, setActiveTab] = useState("notifications");

  console.log("Notifications:", notifications);
  console.log("Messages:", messages);

  // Fetch notifications history
  useEffect(() => {
    if (!user?._id) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/notifications/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?._id, token]);

  // Fetch message history
  useEffect(() => {
    if (!user?._id) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/messages/${user._id}/${selectedAdmin._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(res.data.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    queryClient.invalidateQueries(["notifications", user._id]);
  }, [selectedAdmin]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect(); // connect only if not already connected
    }

    socket.emit("joinChatRoom", user._id);

    const notificationEvents = [
      "orderCreated",
      "forwardedToAuthorizer",
      "plantAssigned",
      "plantApproved",
      "dispatched",
      "advancePaymentSentForApproval",
      "invoiceGenerated",
      "dueSentForApproval",
    ];

    const handleNotification = (data) => {
      console.log("📩 New notification received", data);
      setNotifications((prev) => [...prev, data]);
    };

    const handleMessage = (data) => {
      console.log("💬 New message received", data);
      setMessages((prev) => [...prev, data]);
    };

    // Attach listeners only once
    notificationEvents.forEach((event) => socket.on(event, handleNotification));
    socket.on("receiveMessage", handleMessage);

    console.log("Listener count:", socket.listeners("orderCreated").length);

    // Proper cleanup
    return () => {
      notificationEvents.forEach((event) =>
        socket.off(event, handleNotification)
      );
      socket.off("receiveMessage", handleMessage);
    };
  }, [user?._id]);

  if (loading || loadingAdmins) return <p>Loading...</p>;

  return (
    <div className="absolute flex-1 lg:w-[50%] md:w-[90%] h-[90%] overflow-hidden p-5 flex items-start flex-col bg-white top-14 right-10 shadow-md rounded-lg z-[9999] transition-all">
      <div className="flex items-center w-full mb-2">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`text-center w-1/2 cursor-pointer transition-all p-2 ${
            activeTab === "notifications"
              ? "bg-[#1565C0] text-white border-blue-500 border"
              : "hover:border-blue-500 border hover:text-[#1565C0]"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`text-center w-1/2 cursor-pointer transition-all p-2 ${
            activeTab === "messages"
              ? "bg-[#1565C0] text-white border-blue-500 border"
              : "hover:border-blue-500 border hover:text-[#1565C0]"
          }`}
        >
          Admin Messages
        </button>
      </div>

      {/* notifications */}
      <div className="overflow-auto w-full">
        {activeTab === "notifications" && (
          <div className="w-full">
            {notifications.length > 0 ? (
              <div>
                {notifications?.map((n, i) => (
                  <div
                    key={n?._id || `notification-${i}`}
                    className="p-2 px-3 text-gray-800 border-2 border-gray-100 text-sm mb-2 rounded-xl relative pb-5"
                  >
                    <p>{n?.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-gray-500 flex items-center justify-center">
                No notifications
              </div>
            )}
          </div>
        )}
      </div>

      {/* messages */}
      {activeTab === "messages" && (
        <div className="flex items-start w-full">
          <div className="flex flex-col items-start w-32">
            {admins.map((admin) => (
              <div
                key={admin?._id}
                className={`${
                  selectedAdmin._id === admin._id
                    ? `bg-[#1565C0] text-white`
                    : `hover:bg-gray-100`
                } p-2 w-full cursor-pointer`}
                onClick={() => setSelectedAdmin(admin)}
              >
                {admin?.name}
              </div>
            ))}
          </div>
          <div className="w-full relative flex-1">
            <div>
              <div className="p-2 bg-gray-50 w-full flex items-center gap-2">
                <Avatar size={40} name={selectedAdmin?.name} />
                <div className="flex flex-col">
                  <p className="font-semibold">{selectedAdmin.name}</p>
                  <p className="text-xs">{selectedAdmin.role}</p>
                </div>
              </div>
            </div>
            <div className="p-2 overflow-y-auto bg-gray-50 shadow-inner h-96">
              {messages.length > 0 ? (
                <div className="flex flex-col items-start">
                  {messages?.map((m, i) => (
                    <div
                      key={`message-${m?.timestamp || i}`}
                      className={`p-1 px-2 text-gray-800 shadow bg-white text-sm mb-2 rounded-xl relative max-w-[70%] ml-auto`}
                    >
                      <div className="flex flex-col">
                        <p className="w-full break-words whitespace-pre-wrap">
                          {m?.message}
                        </p>
                        {m?.timestamp && (
                          <p className="text-[10px] flex items-center justify-end text-gray-500">
                            {format(m.timestamp, "dd MMM yyyy, h:mm a")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">Chat seems empty</div>
              )}
            </div>
            <div className="w-full bg-gray-100 py-2">
              <form className="flex items-center gap-1 px-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full p-2 px-4 rounded-full focus:outline-none"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#1565C0] hover:bg-[#1565C0]/90 transition-all active:scale-95 rounded-full text-white p-2.5"
                >
                  <SendHorizontal size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
