import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BuyerDashboardScreen from "../screens/buyer/BuyerDashboardScreen.js";

const Stack = createNativeStackNavigator();

const BuyerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BuyerDashboard" component={BuyerDashboardScreen} />
    </Stack.Navigator>
  );
};

export default BuyerNavigator;
