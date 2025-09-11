import { CircularProgress } from "@mui/material";
import React from "react";
import { FiUserCheck } from "react-icons/fi";

const ActiveEmployees = ({ totalActiveEmployees, ordersLoading }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col justify-center gap-1 h-full">
        <p className="text-left lg:font-semibold text-gray-600">
          Active Employees
        </p>
        {ordersLoading ? (
          <div className="m-3">
            <CircularProgress size={20} />
          </div>
        ) : (
          <div>
            <p className="lg:text-4xl text-left lg:font-semibold">
              {totalActiveEmployees}
            </p>
          </div>
        )}
      </div>
      <div className="p-3 bg-violet-100 rounded-full">
        <FiUserCheck className="text-4xl opacity-70 text-violet-600" />
      </div>
    </div>
  );
};

export default ActiveEmployees;
