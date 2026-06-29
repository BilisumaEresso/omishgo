import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BuyerDashboardScreen  from "../screens/buyer/BuyerDashboardScreen.js";
import BrowseScreen          from "../screens/buyer/BrowseScreen.js";
import ListingDetailScreen   from "../screens/buyer/ListingDetailScreen.js";
import ConversationsScreen   from "../screens/shared/ConversationsScreen.js";
import ChatScreen            from "../screens/shared/ChatScreen.js";

const Stack = createNativeStackNavigator();

const BuyerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuyerHome"  component={BuyerDashboardScreen} />
      <Stack.Screen name="Browse"          component={BrowseScreen} />
      <Stack.Screen name="ListingDetail"   component={ListingDetailScreen} />
      <Stack.Screen name="Conversations"   component={ConversationsScreen} />
      <Stack.Screen name="Chat"            component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default BuyerNavigator;
