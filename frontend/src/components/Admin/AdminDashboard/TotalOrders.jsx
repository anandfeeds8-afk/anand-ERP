import { CircularProgress } from "@mui/material";
import React from "react";
import { TbShoppingBag } from "react-icons/tb";

const TotalOrders = ({ totalOrders, ordersLoading }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col justify-center gap-1 h-full">
        <p className="text-left lg:font-semibold text-gray-600">Total Orders</p>
        {ordersLoading ? (
          <div className="m-3">
            <CircularProgress size={20} />
          </div>
        ) : (
          <div>
            <p className="lg:text-4xl text-left lg:font-semibold">
              {totalOrders}
            </p>
          </div>
        )}
      </div>
      <div className="p-3 bg-orange-100 rounded-full">
        <TbShoppingBag className="text-4xl opacity-70 text-orange-600" />
      </div>
    </div>
  );
};

export default TotalOrders;
