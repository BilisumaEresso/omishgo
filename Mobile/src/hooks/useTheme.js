// src/hooks/useTheme.js
import { getThemeByRole } from "../constants/theme/index.js";
import { useNavigation } from "../context/NavigationContext";
import { useThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
  // SYSTEM FIX: Extracted activeRole correctly from NavigationContext to match state parameters
  const { activeRole } = useNavigation();
  const { setTheme } = useThemeContext();

  // Dynamically resolve theme properties mapping back to the signed-in workspace
  const theme = activeRole
    ? getThemeByRole(activeRole)
    : getThemeByRole("farmer");

  return { theme, setTheme };
};
