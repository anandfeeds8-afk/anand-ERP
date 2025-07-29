import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const SalesmanLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="flex flex-col h-screen w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default SalesmanLayout;
