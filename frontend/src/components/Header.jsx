import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Avatar, IconButton } from "@mui/material";
import { useUser } from "../hooks/useUser";

const Header = () => {
  const { user } = useUser();
  // console.log(user);

  return (
    <div className="border-b border-neutral-100 h-full">
      <div className="flex justify-end items-center gap-8 h-full px-10">
        <div>
          <p>{user?.role}</p>
        </div>
        <IconButton>
          <NotificationsIcon />
        </IconButton>

        <Avatar alt={user?.name} src="/static/images/avatar/1.jpg" />
      </div>
    </div>
  );
};

export default Header;
