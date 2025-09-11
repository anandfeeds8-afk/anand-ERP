import React from "react";
import { CgDollar } from "react-icons/cg";
import { formatRupee } from "../../../utils/formatRupee.js";
import { CircularProgress } from "@mui/material";

const TotalSales = ({ total, ordersLoading }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col justify-center gap-1 h-full">
        <p className="text-left lg:font-semibold text-gray-600">Total Sales</p>
        {ordersLoading ? (
          <div className="m-3">
            <CircularProgress size={20} />
          </div>
        ) : (
          <div>
            <p className="lg:text-4xl text-left lg:font-semibold">
              {formatRupee(total)}
            </p>
          </div>
        )}
      </div>
      <div className="p-3 bg-green-100 rounded-full">
        <CgDollar className="text-4xl opacity-70 text-green-600" />
      </div>
    </div>
  );
};

export default TotalSales;
