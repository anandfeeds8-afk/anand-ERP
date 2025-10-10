import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex flex-col h-screen transition-all duration-300 ${
          isCollapsed ? "w-full" : "w-[calc(100%-250px)]"
        }`}
      >
        <div className="h-14">
          <Header />
        </div>
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
