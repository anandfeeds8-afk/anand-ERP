import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const StockItems = ({ stockItems }) => {
  return (
    <div className="bg-white rounded-lg  md:p-3 lg:p-5 sm:p-3 p-3 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left font-semibold text-gray-600 lg:text-base md:text-sm sm:text-sm text-sm">
          Total Stock Items
        </p>
        <p className="lg:text-3xl md:text-2xl sm:text-2xl text-xl text-left font-semibold">
          {stockItems}
        </p>
      </div>
      <div className="p-3 bg-blue-100 rounded-full">
        <FaBoxOpen className="lg:text-4xl md:text-3xl sm:text-2xl text-2xl opacity-70 text-blue-600" />
      </div>
    </div>
  );
};

export default StockItems;
