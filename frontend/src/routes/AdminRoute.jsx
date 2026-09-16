import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredUser, isAdmin, isAuthenticated } from "../utils/auth";
import { useToast } from "../context/ToastContext";

const AdminRoute = () => {
  const location = useLocation();
  const { showToast } = useToast();
  const [user, setUser] = useState(() => getStoredUser());
  const toastFiredRef = useRef(false);

  useEffect(() => {
    const handleUserChange = () => {
      setUser(getStoredUser());
    };
    window.addEventListener("userUpdated", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("userUpdated", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const authenticated = isAuthenticated(user);
  const userIsAdmin = isAdmin(user);

  useEffect(() => {
    if (!authenticated) {
      if (!toastFiredRef.current) {
        toastFiredRef.current = true;
        showToast.warning("Please sign in with administrator credentials to access the admin portal.");
      }
    } else if (!userIsAdmin) {
      if (!toastFiredRef.current) {
        toastFiredRef.current = true;
        showToast.error("Access denied. Administrator privileges are required.");
      }
    }
  }, [authenticated, userIsAdmin, showToast]);

  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!userIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
