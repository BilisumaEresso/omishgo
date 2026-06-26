// src/components/RoleGuard.js
import React from "react";
import { useAuthStore } from "../store/auth.store";
import RoleSelectionModal from "../screens/role/RoleSelectionModal";

const RoleGuard = ({ children }) => {
  const { user } = useAuthStore();

  // If the user is logged in but hasn't picked a role yet
  if (user && !user.activeRole) {
    return <RoleSelectionModal />;
  }

  return children;
};

export default RoleGuard;
