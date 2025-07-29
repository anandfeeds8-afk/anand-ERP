import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, IconButton } from "@mui/material";

const Header = () => {
  return (
    <div className="bg-slate-200 h-14">
      <div className="flex justify-end items-center gap-8 h-full px-10">
        <IconButton>
          <NotificationsIcon />
        </IconButton>

        <AccountCircleIcon fontSize="large" />
      </div>
    </div>
  );
};

export default Header;
