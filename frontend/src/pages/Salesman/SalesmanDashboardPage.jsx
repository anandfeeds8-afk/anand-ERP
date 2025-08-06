import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const SalesmanDashboardPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Order Management</h1>
        <Button
          disableElevation
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
        >
          Add Order
        </Button>
      </div>
    </div>
  );
};

export default SalesmanDashboardPage;
