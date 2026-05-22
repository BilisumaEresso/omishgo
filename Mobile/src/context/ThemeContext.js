import { createContext, useContext, useState } from "react";
import farmerTheme from "../constants/theme/farmerTheme.js";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(farmerTheme);

  // Note: We use farmerTheme as default
  // When a role is selected in NavigationContext, useTheme() will use getThemeByRole()
  // This keeps themes in sync with the current user role

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }
  return context;
};
