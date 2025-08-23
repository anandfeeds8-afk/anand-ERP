import React, { useState } from "react";
import OrdersForManager from "../../components/SalesManager/OrderManagementForSalesManager/OrdersForManager";
import ForwardedOrders from "../../components/SalesManager/OrderManagementForSalesManager/ForwardedOrders";
import { Button, ButtonGroup } from "@mui/material";

const SalesManagerDashboardPage = () => {
  const orderTypes = ["All Orders", "Forwarded Orders"];
  const [isActive, setIsActive] = useState("All Orders");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Sales Manager</h1>
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
        {isActive === "All Orders" && <OrdersForManager />}
        {isActive === "Forwarded Orders" && <ForwardedOrders />}
      </div>
    </div>
  );
};

export default SalesManagerDashboardPage;
