import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SupplierDashboardScreen from "../screens/supplier/SupplierDashboardScreen.js";

const Stack = createNativeStackNavigator();

const SupplierNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SupplierDashboard"
        component={SupplierDashboardScreen}
      />
    </Stack.Navigator>
  );
};

export default SupplierNavigator;
