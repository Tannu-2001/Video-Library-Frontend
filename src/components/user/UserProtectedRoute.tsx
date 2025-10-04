import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

type JwtPayloadLike = {
  role?: string;
  [key: string]: any;
};

const decodeToken = (token?: string): JwtPayloadLike | null => {
  try {
    if (!token) return null;
    // use jwt-decode package which works in browser
    return jwtDecode<JwtPayloadLike>(token);
  } catch (err) {
    console.error("JWT decode failed:", err);
    return null;
  }
};

const UserProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // read token from localStorage (only in browser)
  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
  const payload = decodeToken(token ?? undefined);

  // No token or decode failed -> go to user login
  if (!token || !payload) {
    return <Navigate to="/user-login" replace />;
  }

  // If token has role and it's not "user"
  if (payload.role && payload.role !== "user") {
    // if role is admin, send to admin dashboard
    if (payload.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    // anything else -> not authorized for user area
    return <Navigate to="/user-login" replace />;
  }

  // Token present and role is "user" (or no explicit role) -> render wrapped children
  return <>{children}</>;
};

export default UserProtectedRoute;