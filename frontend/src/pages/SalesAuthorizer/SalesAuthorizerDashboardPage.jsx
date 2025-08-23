import React, { useState } from "react";
import OrdersForAuthorizer from "../../components/SalesAuthorizer/OrderManagementForSalesAuthorizer/OrdersForAuthorizer";
import AssignmentHistory from "../../components/SalesAuthorizer/OrderManagementForSalesAuthorizer/AssignmentHistory";
import { Button, ButtonGroup } from "@mui/material";

const SalesAuthorizerDashboardPage = () => {
  const orderTypes = ["All Orders", "Assignment History"];
  const [isActive, setIsActive] = useState("All Orders");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">{isActive}</h1>
      </div>

      <div className="mb-5">
        <ButtonGroup aria-label="Medium-sized button group">
          {orderTypes.map((order) => (
            <Button
              key={order._id}
              disableElevation
              variant={isActive === order ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
              }}
              onClick={() => setIsActive(order)}
            >
              {order}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div>
        {isActive === "All Orders" && <OrdersForAuthorizer />}
        {isActive === "Assignment History" && <AssignmentHistory />}
      </div>
    </div>
  );
};

export default SalesAuthorizerDashboardPage;
