import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverDashboardScreen from "../screens/driver/DriverDashboardScreen.js";

const Stack = createNativeStackNavigator();

const DriverNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
    </Stack.Navigator>
  );
};

export default DriverNavigator;
