import React from "react";
import { NavLink } from "react-router";

const Sidebar = () => {
  return (
    <div className="w-72 border-r">
      <div className="text-xl font-semibold text-center mt-5">
        Poultry <br /> Feed Management
      </div>
      <div className="mt-10 flex flex-col items-center justify-center m-2 gap-3">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-indigo-50 p-2 w-full text-left px-5 rounded-lg"
              : "transition-all hover:bg-indigo-200 hover:bg-opacity-10 p-2 w-full text-gray-800 rounded-lg text-left px-5"
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-4 font-semibold text-gray-800">
              Dashboard
            </span>
          )}
        </NavLink>

        <NavLink
          to="/admin/product-management"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-indigo-50 p-2 w-full text-left px-5 rounded-lg"
              : "transition-all hover:bg-indigo-200 hover:bg-opacity-10 p-2 w-full text-gray-800 rounded-lg text-left px-5"
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-4 font-semibold text-gray-800">
              Product Management
            </span>
          )}
        </NavLink>

        <NavLink
          to="/admin/employee-management"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-indigo-50 p-2 w-full text-left px-5 rounded-lg"
              : "transition-all hover:bg-indigo-200 hover:bg-opacity-10 p-2 w-full text-gray-800 rounded-lg text-left px-5"
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-4 font-semibold text-gray-800">
              Employee Management
            </span>
          )}
        </NavLink>

        <NavLink
          to="/admin/party-master"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-indigo-50 p-2 w-full text-left px-5 rounded-lg"
              : "transition-all hover:bg-indigo-200 hover:bg-opacity-10 p-2 w-full text-gray-800 rounded-lg text-left px-5"
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-4 font-semibold text-gray-800">
              Party Master
            </span>
          )}
        </NavLink>

        <NavLink
          to="/admin/reports-module"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-indigo-50 p-2 w-full text-left px-5 rounded-lg"
              : "transition-all hover:bg-indigo-200 hover:bg-opacity-10 p-2 w-full text-gray-800 rounded-lg text-left px-5"
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-4 font-semibold text-gray-800">
              Reports Module
            </span>
          )}
        </NavLink>
        <NavLink
          to="/admin/settings-security"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-indigo-50 p-2 w-full text-left px-5 rounded-lg"
              : "transition-all hover:bg-indigo-200 hover:bg-opacity-10 p-2 w-full text-gray-800 rounded-lg text-left px-5"
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-4 font-semibold text-gray-800">
              Settings & Security
            </span>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
