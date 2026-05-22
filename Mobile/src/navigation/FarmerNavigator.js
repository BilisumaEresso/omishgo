import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FarmerDashboardScreen from "../screens/farmer/FarmerDashboardScreen.js";

const Stack = createNativeStackNavigator();

const FarmerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FarmerDashboard" component={FarmerDashboardScreen} />
    </Stack.Navigator>
  );
};

export default FarmerNavigator;
