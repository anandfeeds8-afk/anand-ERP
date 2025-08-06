import React from "react";
import { useUser } from "../hooks/useUser";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useUser();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
