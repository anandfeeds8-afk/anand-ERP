import React, { useState } from "react";
import OrdersForPlantHead from "../../components/Planthead/OrdersForPlantHead";
import { Button, ButtonGroup } from "@mui/material";
import DispatchedOrders from "../../components/Planthead/DispatchedOrders";

const PlantheadDashboardPage = () => {
  const orderTypes = ["All Orders", "Dispatched Orders"];
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
        {isActive === "All Orders" && <OrdersForPlantHead />}
        {isActive === "Dispatched Orders" && <DispatchedOrders />}
      </div>
    </div>
  );
};

export default PlantheadDashboardPage;
