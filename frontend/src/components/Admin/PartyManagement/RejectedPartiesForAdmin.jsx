import React from "react";
import { formatRupee } from "../../../utils/formatRupee.js";

const RejectedPartiesForAdmin = ({ party }) => {
  return (
    <div className="shadow bg-white rounded-lg md:p-3 lg:p-4 sm:p-3 p-3 lg:flex lg:flex-col justify-between hover:shadow-md transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-left lg:text-lg md:text-base sm:text-base text-base font-semibold">
            {party.companyName}
          </p>
          {party?.partyStatus === "rejected" && (
            <p className="p-1 px-3 text-xs text-red-700 font-semibold bg-red-100 rounded-full">
              Rejected
            </p>
          )}
        </div>
        <div className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-2 lg:text-sm md:text-xs sm:text-xs text-xs">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Address:
              </span>
              <span className="text-right">{party?.address}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Contact Person Number:
              </span>
              {party?.contactPersonNumber}
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Limit:
              </span>
              {formatRupee(party?.limit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedPartiesForAdmin;
