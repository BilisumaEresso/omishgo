// src/hooks/useTheme.js
import farmerTheme from "../constants/theme/farmerTheme";
import { getThemeByRole } from "../constants/theme/index.js";
import { useNavigation } from "../context/NavigationContext";

export const useTheme = () => {
  let activeRole = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ctx = useNavigation();
    activeRole = ctx?.activeRole ?? null;
  } catch (_) {
    activeRole = null;
  }
  const theme = getThemeByRole(activeRole || "farmer") ?? farmerTheme;
  return { theme };
};
