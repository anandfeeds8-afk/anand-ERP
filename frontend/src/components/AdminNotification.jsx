import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser.js";
import { CircularProgress } from "@mui/material";
import useEmployees from "../hooks/useEmployees.js";
import Avatar from "./Avatar.jsx";
import { SendHorizontal } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../utils/socket.js";

const AdminNotification = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const { salesman, salesmanager, salesauthorizer, planthead, accountant } =
    useEmployees();

  const [selectedTab, setSelectedTab] = useState("all-dashboards");
  const [selectedDashboard, setSelectedDashboard] = useState("All");
  const [activeTab, setActiveTab] = useState("notifications");
  const [typedMessage, setTypedMessage] = useState("");
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoize all employees array
  const allEmployees = useMemo(
    () => [
      ...(salesman || []),
      ...(salesmanager || []),
      ...(salesauthorizer || []),
      ...(planthead || []),
      ...(accountant || []),
    ],
    [salesman, salesmanager, salesauthorizer, planthead, accountant]
  );

  // Memoize selected employee
  const selectedEmployee = useMemo(() => {
    if (selectedTab === "all-dashboards") return "all-dashboards";
    return allEmployees.find((e) => e._id === selectedTab) || null;
  }, [selectedTab, allEmployees]);

  const joinChatRoom = (empId) => {
    setSelectedTab(empId);
    setSelectedDashboard("");
    socket.emit("joinChatRoom", empId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const data = {
      senderId: user._id,
      senderName: user.name,
      receiverId: selectedEmployee._id,
      receiverName: selectedEmployee.name,
      message: typedMessage,
      roomId: selectedEmployee._id,
      timestamp: new Date(),
      type: "message",
    };
    socket.emit("sendMessage", data);
    setTypedMessage("");
  };

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
        setNotifications(res.data.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    queryClient.invalidateQueries(["notifications", user._id]);
  }, [user?._id, token, queryClient]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    const notificationEvents = [
      "orderCreated",
      "orderForwardedToAuthorizer",
      "plantAssigned",
      "plantApproved",
      "dispatched",
      "invoiceGenerated",
      "delivered",
    ];

    notificationEvents.forEach((event) => {
      socket.on(event, (data) => {
        console.log("📩 New notification:", data);
        setNotifications((prev) => [...prev, data]);
      });
    });

    return () => {
      notificationEvents.forEach((event) => {
        socket.off(event, (data) => {
          console.log("data from off socket", data);
        });
      });
    };
  }, [user?._id]);

  // Filter button component
  const FilterButton = ({ filter, label }) => (
    <button
      onClick={() => setNotificationFilter(filter)}
      className={`p-1 px-2 text-xs rounded-full transition-all ${
        notificationFilter === filter
          ? "bg-[#1565C0] text-white border-[#1565C0] border"
          : "text-[#1565C0] border-[#1565C0] border"
      }`}
    >
      {label}
    </button>
  );

  // Employee list component
  const EmployeeList = ({ title, employees }) => (
    <div className="flex flex-col items-start w-full">
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      {employees?.map((emp) => (
        <button
          key={emp._id}
          onClick={() => joinChatRoom(emp._id)}
          className={`p-1 px-3 w-full text-left transition-all ${
            selectedTab === emp._id
              ? "bg-[#1565C0] text-white"
              : "text-gray-800 hover:bg-gray-100"
          }`}
        >
          {emp.name}
        </button>
      ))}
    </div>
  );

  // Dashboard button component
  const DashboardButton = ({ dashboard, label }) => (
    <button
      onClick={() => setSelectedDashboard(dashboard)}
      className={`p-1 px-3 w-full text-left transition-all ${
        selectedDashboard === dashboard
          ? "bg-[#1565C0] text-white"
          : "text-gray-800 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="absolute lg:w-[70%] md:w-[90%] h-[90%] overflow-hidden p-5 flex items-start flex-col bg-white top-14 right-10 shadow-md rounded-lg z-[9999] transition-all">
      {user?.role === "Admin" && (
        <div className="w-full h-full">
          {/* Tab Buttons */}
          <div className="flex items-center w-full">
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
              Messages
            </button>
          </div>

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="w-full flex flex-col h-full">
              {/* Filters */}
              <div className="flex my-3 items-center gap-3 transition-all justify-start cursor-pointer">
                <FilterButton filter="all" label="All" />
                <FilterButton filter="orders" label="Orders" />
                <FilterButton filter="plants" label="Plants" />
                <FilterButton filter="products" label="Products" />
                <FilterButton filter="employees" label="Employees" />
              </div>

              {/* Scrollable notifications */}
              <div className="flex-1 overflow-y-auto rounded-xl pt-1">
                {!loading ? (
                  <div>
                    {notifications?.length === 0 ? (
                      <div className="w-full text-gray-500 flex items-center justify-center">
                        No notifications
                      </div>
                    ) : (
                      notifications?.map((n, i) => (
                        <div
                          key={`notification-${i}`}
                          className="p-2 px-3 text-gray-800 border-2 border-gray-100 text-sm mb-2 rounded-xl relative pb-5"
                        >
                          <p>{n?.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="flex w-full h-full items-center justify-center">
                    <CircularProgress />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="flex w-full flex-1 h-full overflow-auto mt-2">
              {/* Employee List Sidebar */}
              <div className="overflow-y-auto min-w-48">
                <div className="flex flex-col items-start gap-2 w-full">
                  <button
                    onClick={() => {
                      setSelectedTab("all-dashboards");
                      setSelectedDashboard("All");
                      if (currentRoomId) {
                        socket.emit("leaveRoom", currentRoomId);
                        setCurrentRoomId(null);
                      }
                    }}
                    className={`p-1 px-3 w-full text-left transition-all ${
                      selectedTab === "all-dashboards"
                        ? "bg-[#1565C0] text-white"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    All Employees
                  </button>
                  <EmployeeList title="Salesmen" employees={salesman} />
                  <EmployeeList title="Managers" employees={salesmanager} />
                  <EmployeeList
                    title="Authorizers"
                    employees={salesauthorizer}
                  />
                  <EmployeeList title="Plant Heads" employees={planthead} />
                  <EmployeeList title="Accountants" employees={accountant} />
                </div>
              </div>

              {/* Dashboard Filter */}
              {selectedTab === "all-dashboards" && (
                <div className="min-w-36 max-w-36 border-r transition-all">
                  <DashboardButton dashboard="All" label="All Employees" />
                  <DashboardButton dashboard="Salesman" label="Salesmen" />
                  <DashboardButton dashboard="Managers" label="Managers" />
                  <DashboardButton
                    dashboard="Authorizers"
                    label="Authorizers"
                  />
                  <DashboardButton dashboard="Plantheads" label="Plant Heads" />
                  <DashboardButton
                    dashboard="Accountants"
                    label="Accountants"
                  />
                </div>
              )}

              {/* Chat Area */}
              <div className="w-full h-full transition-all relative">
                <div className="p-2 bg-gray-50 w-full flex items-center gap-2">
                  {selectedDashboard ? (
                    <Avatar size={40} name={selectedDashboard} />
                  ) : (
                    <Avatar size={40} name={selectedEmployee?.name} />
                  )}
                  <div className="flex flex-col">
                    {selectedDashboard && (
                      <p className="font-semibold">{selectedDashboard}</p>
                    )}
                    {selectedEmployee &&
                      selectedEmployee !== "all-dashboards" && (
                        <>
                          <p className="font-semibold">
                            {selectedEmployee.name}
                          </p>
                          <p className="text-xs">{selectedEmployee.role}</p>
                        </>
                      )}
                  </div>
                </div>
                <div className="bg-black/10 w-full h-full"></div>
                <div className="absolute bottom-0 right-0 w-full">
                  <form
                    className="flex items-center gap-1 px-1"
                    onSubmit={handleSendMessage}
                  >
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
      )}
    </div>
  );
};

export default AdminNotification;
