import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FarmerDashboardScreen  from "../screens/farmer/FarmerDashboardScreen.js";
import PostProductScreen      from "../screens/farmer/PostProductScreen.js";
import ConversationsScreen    from "../screens/shared/ConversationsScreen.js";
import ChatScreen             from "../screens/shared/ChatScreen.js";

const Stack = createNativeStackNavigator();

const FarmerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FarmerDashboard"  component={FarmerDashboardScreen} />
      <Stack.Screen name="PostProduct"      component={PostProductScreen} />
      <Stack.Screen name="Conversations"    component={ConversationsScreen} />
      <Stack.Screen name="Chat"             component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default FarmerNavigator;
