import farmerTheme from "./farmerTheme";
import buyerTheme from "./buyerTheme";
import supplierTheme from "./supplierTheme";
import driverTheme from "./driverTheme";

export const THEMES = {
  farmer: farmerTheme,
  buyer: buyerTheme,
  supplier: supplierTheme,
  driver: driverTheme,
};

export const getThemeByRole = (role) => {
  return THEMES[role] || farmerTheme;
};
