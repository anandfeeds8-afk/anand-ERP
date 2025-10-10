import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useUser } from "../hooks/useUser";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Power, PowerOff, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import Notification from "./Notification.jsx";
import AdminNotification from "./AdminNotification.jsx";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { changeStatus, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.error("You are logged out!");
  };

  return (
    <div className="dark:border-gray-700 dark:bg-gray-900 transition-all ease-in-out border-b border-neutral-100 h-full z-50">
      <div className="flex justify-end items-center gap-8 h-full px-10">
        <div>
          <p className="dark:text-gray-300">{user?.role}</p>
        </div>

        <IconButton onClick={() => setIsOpenNotification(!isOpenNotification)}>
          <NotificationsIcon className="dark:text-gray-300" />
        </IconButton>

        {isOpenNotification && (
          <div>
            {user?.role === "Admin" ? <AdminNotification /> : <Notification />}
          </div>
        )}

        <div className="rounded-full p-1 dark:bg-gray-500 flex items-center bg-gray-300">
          <div
            onClick={() => setTheme("light")}
            className={`${
              theme === "light"
                ? "bg-gray-100 text-orange-600 transition-all"
                : "cursor-pointer hover:bg-gray-400 transition-all"
            } p-1.5 rounded-full `}
          >
            <Sun size={14} />
          </div>
          <div
            onClick={() => setTheme("dark")}
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-gray-200 transition-all "
                : "cursor-pointer hover:bg-gray-400 transition-all"
            } p-1.5 rounded-full`}
          >
            <Moon size={14} />
          </div>
          <div
            onClick={() => setTheme("system")}
            className={`${
              theme === "system"
                ? "bg-gray-800 text-gray-200 transition-all "
                : "cursor-pointer hover:bg-gray-400 transition-all"
            } p-1.5 rounded-full`}
          >
            <Monitor size={14} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Avatar
            alt={user?.name}
            src="/static/images/avatar/1.jpg"
            size={40}
            name={user?.name}
            online={user?.isActive}
          />
          {isOpen ? (
            <div
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 transition-all rounded-full dark:hover:bg-gray-600 dark:text-gray-300"
            >
              <KeyboardArrowUpIcon />
            </div>
          ) : (
            <div
              onClick={() => setIsOpen(true)}
              className="hover:bg-gray-100 transition-all rounded-full dark:hover:bg-gray-600 dark:text-gray-300"
            >
              <KeyboardArrowDownIcon />
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40">
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-14 right-3 bg-white shadow-md rounded-lg z-50"
          >
            <div className="flex flex-col py-2 w-64">
              <div className="mx-2 p-2 border-b border-gray-100 flex items-center gap-3 mb-2">
                <Avatar
                  alt={user?.name}
                  src="/static/images/avatar/1.jpg"
                  size={40}
                  name={user?.name}
                  online={user?.isActive}
                />
                <div className="flex flex-col">
                  <p className="text-sm">{user?.name}</p>
                  <p className="text-xs">{user?.email}</p>
                </div>
              </div>
              {user?.role !== "Admin" && (
                <Button
                  startIcon={
                    user.isActive ? <PowerOff size={15} /> : <Power size={15} />
                  }
                  onClick={() => changeStatus(user.role)}
                  color="black"
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    paddingLeft: "1.5rem",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  {user.isActive ? "Deactivate account" : "Activate account"}
                </Button>
              )}
              <Button
                startIcon={<LogOut size={15} />}
                onClick={handleLogout}
                color="error"
                sx={{
                  textTransform: "none",
                  borderRadius: "0px",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  paddingLeft: "1.5rem",
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
