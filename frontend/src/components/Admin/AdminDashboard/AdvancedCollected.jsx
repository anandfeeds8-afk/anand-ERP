import React from "react";
import { GiCash } from "react-icons/gi";
import { CircularProgress } from "@mui/material";
import { formatRupee } from "../../../utils/formatRupee.js";

const AdvancedCollected = ({ advance, ordersLoading }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col justify-center gap-1 h-full">
        <p className="text-left lg:font-semibold text-gray-600">
          Total Advance Collected
        </p>
        {ordersLoading ? (
          <div className="m-3">
            <CircularProgress size={20} />
          </div>
        ) : (
          <div>
            <p className="lg:text-4xl text-left lg:font-semibold">
              {formatRupee(advance)}
            </p>
          </div>
        )}
      </div>
      <div className="p-3 bg-indigo-100 rounded-full">
        <GiCash className="text-4xl opacity-70 text-indigo-600" />
      </div>
    </div>
  );
};

export default AdvancedCollected;
