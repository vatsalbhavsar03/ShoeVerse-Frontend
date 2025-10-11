// src/Components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");

  if (!token || roleId !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;