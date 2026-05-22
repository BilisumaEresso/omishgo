import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store.js";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(null);
  const { isAuthenticated, user } = useAuthStore();

  // Sync NavigationContext with auth store state
  useEffect(() => {
    if (isAuthenticated && user?.activeRole) {
      setActiveRole(user.activeRole);
    } else {
      setActiveRole(null);
    }
  }, [isAuthenticated, user?.activeRole]);

  return (
    <NavigationContext.Provider value={{ activeRole, setActiveRole }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider");
  }
  return context;
};
