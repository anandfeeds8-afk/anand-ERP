import React from "react";
import { IoMdTime } from "react-icons/io";
import { formatRupee } from "../../../utils/formatRupee";
import { CircularProgress } from "@mui/material";

const DueAmount = ({ due, ordersLoading }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col justify-center gap-1 h-full">
        <p className="text-left lg:font-semibold text-gray-600">Due Amount</p>
        {ordersLoading ? (
          <div className="m-3">
            <CircularProgress size={20} />
          </div>
        ) : (
          <div>
            <p className="lg:text-4xl text-left lg:font-semibold">
              {formatRupee(due)}
            </p>
          </div>
        )}
      </div>
      <div className="p-3 bg-red-100 rounded-full">
        <IoMdTime className="text-4xl opacity-70 text-red-600" />
      </div>
    </div>
  );
};

export default DueAmount;
