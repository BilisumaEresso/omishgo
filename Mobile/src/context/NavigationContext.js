import { createContext, useContext } from "react";
import { useAuthStore } from "../store/auth.store.js";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const { isAuthenticated, activeRole } = useAuthStore();

  return (
    <NavigationContext.Provider
      value={{
        activeRole: isAuthenticated ? activeRole : null,
      }}
    >
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
