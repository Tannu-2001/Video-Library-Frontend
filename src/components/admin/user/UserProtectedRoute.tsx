import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const UserProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/user-login" replace />;
  }

  return <>{children}</>;
};

export default UserProtectedRoute;