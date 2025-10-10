import React, { useState } from "react";
import {
  X,
  Bell,
  Send,
  Search,
  Users,
  Leaf,
  ShoppingCart,
  CreditCard,
  Megaphone,
} from "lucide-react";

const NotificationModal = ({ role = "admin" }) => {
  const [activeTab, setActiveTab] = useState("notifications"); // notifications | messages
  const [activeSection, setActiveSection] = useState("plants");
  const [activeGroup, setActiveGroup] = useState("group1");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[1000px] h-[650px] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-blue-600 text-white">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Bell className="w-5 h-5" />
            Notifications & Messages
          </div>
          <button className="p-2 hover:bg-blue-500 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b text-sm font-medium bg-gray-50">
          {["notifications", "messages"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-1">
          {/* Left Sidebar: Sections */}
          <div className="w-48 border-r bg-gray-100">
            <h3 className="px-4 py-3 font-semibold text-gray-700">Sections</h3>
            <div className="flex flex-col">
              {[
                {
                  id: "plants",
                  label: "Plants",
                  icon: <Leaf className="w-4 h-4" />,
                },
                {
                  id: "orders",
                  label: "Orders",
                  icon: <ShoppingCart className="w-4 h-4" />,
                },
                {
                  id: "payments",
                  label: "Payments",
                  icon: <CreditCard className="w-4 h-4" />,
                },
                {
                  id: "users",
                  label: "Users",
                  icon: <Users className="w-4 h-4" />,
                },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center justify-between px-4 py-2 text-sm ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {section.icon} {section.label}
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    3
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Sidebar: Groups */}
          <div className="w-64 border-r flex flex-col">
            <div className="p-3 border-b bg-gray-50">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="text-sm w-full outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {["group1", "group2", "group3", "group4", "group5"].map((grp) => (
                <button
                  key={grp}
                  onClick={() => setActiveGroup(grp)}
                  className={`w-full text-left px-4 py-3 border-b ${
                    activeGroup === grp
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{grp.toUpperCase()}</span>
                    <span className="text-xs text-gray-500">11:00 AM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    Latest message preview...
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {activeTab === "notifications" ? (
              <>
                {/* Admin Broadcast Box */}
                {role === "admin" && (
                  <div className="p-4 border-b bg-white flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write a notification for everyone..."
                      className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      <Megaphone className="w-4 h-4" />
                      Send to All
                    </button>
                  </div>
                )}

                {/* Notifications Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-white rounded-lg border hover:shadow transition"
                    >
                      <p className="text-gray-800 font-medium">
                        Order #{i} dispatched successfully
                      </p>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                  <div>
                    <h3 className="font-semibold">
                      {activeGroup.toUpperCase()}
                    </h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="self-start bg-white px-4 py-2 rounded-xl max-w-xs border">
                    Hello, your order is ready.
                  </div>
                  <div className="self-end bg-blue-600 text-white px-4 py-2 rounded-xl max-w-xs">
                    Thanks! I’ll pick it soon 🚜
                  </div>
                </div>
                {/* Input */}
                <div className="border-t bg-white p-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
