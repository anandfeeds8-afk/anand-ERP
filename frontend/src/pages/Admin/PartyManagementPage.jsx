import React, { useState } from "react";
import { useAdminOrder } from "../../hooks/useAdminOrders";
import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import PartyToApproveForAdmin from "../../components/Admin/PartyManagement/PartyToApproveForAdmin";
import AllPartiesForAdmin from "../../components/Admin/PartyManagement/AllPartiesForAdmin";
import ApprovedPartiesForAdmin from "../../components/Admin/PartyManagement/ApprovedPartiesForAdmin";
import RejectedPartiesForAdmin from "../../components/Admin/PartyManagement/RejectedPartiesForAdmin";

const PartyManagementPage = () => {
  const partyTypes = [
    "All Parties",
    "Pending Approvals",
    "Approved Parties",
    "Rejected Parties",
  ];
  const [isActive, setIsActive] = useState("All Parties");
  const {
    partiesToApprove,
    partiesToApproveLoading,
    allParties,
    approvedParties,
    rejectedParties,
    rejectedPartiesLoading,
    approvedPartiesLoading,
    allPartiesLoading,
  } = useAdminOrder();

  if (
    partiesToApproveLoading ||
    allPartiesLoading ||
    approvedPartiesLoading ||
    rejectedPartiesLoading
  ) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">{isActive}</h1>
      </div>

      <div className="my-5">
        <ButtonGroup aria-label="Medium-sized button group">
          {partyTypes.map((party) => (
            <Button
              key={party}
              disableElevation
              variant={isActive === party ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
              }}
              onClick={() => setIsActive(party)}
            >
              {party}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {isActive === "All Parties" && (
        <div className="grid grid-cols-3 gap-7 mt-5 min-h-[200px]">
          {allParties?.length > 0 ? (
            allParties.map((party) => (
              <AllPartiesForAdmin party={party} key={party._id} />
            ))
          ) : (
            <div className="col-span-3 flex items-center justify-center text-gray-600 text-center">
              No parties found
            </div>
          )}
        </div>
      )}

      {isActive === "Pending Approvals" && (
        <div className="grid grid-cols-3 gap-7 mt-5 min-h-[200px]">
          {partiesToApprove?.length > 0 ? (
            partiesToApprove.map((party) => (
              <PartyToApproveForAdmin party={party} key={party._id} />
            ))
          ) : (
            <div className="col-span-3 flex items-center justify-center text-gray-600 text-center">
              No pending parties
            </div>
          )}
        </div>
      )}

      {isActive === "Approved Parties" && (
        <div className="grid grid-cols-3 gap-7 mt-5 min-h-[200px]">
          {approvedParties?.length > 0 ? (
            approvedParties.map((party) => (
              <ApprovedPartiesForAdmin party={party} key={party._id} />
            ))
          ) : (
            <div className="col-span-3 flex items-center justify-center text-gray-600 text-center">
              No approved parties
            </div>
          )}
        </div>
      )}

      {isActive === "Rejected Parties" && (
        <div className="grid grid-cols-3 gap-7 mt-5 min-h-[200px]">
          {rejectedParties?.length > 0 ? (
            rejectedParties.map((party) => (
              <RejectedPartiesForAdmin party={party} key={party._id} />
            ))
          ) : (
            <div className="col-span-3 flex items-center justify-center text-gray-600 text-center">
              No rejected parties
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PartyManagementPage;
