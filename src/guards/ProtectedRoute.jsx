import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../services/api/apiClient";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

