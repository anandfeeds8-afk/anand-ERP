import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex flex-col h-screen transition-all duration-300 ${
          isCollapsed
            ? "w-full"
            : "lg:w-[calc(100%-250px)] md:w-full sm:w-full w-full"
        }`}
      >
        <div className="h-14">
          <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div className="lg:p-5 md:p-5 sm:p-5 p-2 overflow-y-auto flex-1 md:w-full bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
