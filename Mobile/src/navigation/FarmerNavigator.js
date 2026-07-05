import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";
import BottomTabBar from "../components/layout/BottomTabBar";
import { ROLES } from "../constants/roles";
import FarmerAnalyticsScreen from "../screens/farmer/FarmerAnalyticsScreen";
import FarmerDashboardScreen from "../screens/farmer/FarmerDashboardScreen";
import FarmerOrdersScreen from "../screens/farmer/FarmerOrdersScreen";
import FarmerProductsScreen from "../screens/farmer/FarmerProductsScreen";
import FarmerProfileScreen from "../screens/farmer/FarmerProfileScreen";
import PostProductScreen from "../screens/farmer/PostProductScreen";
import ChatScreen from "../screens/shared/ChatScreen";
import ConversationsScreen from "../screens/shared/ConversationsScreen";
import NotificationsScreen from "../screens/shared/NotificationsScreen";
import OrderDetailScreen from "../screens/shared/OrderDetailScreen";

const Stack = createNativeStackNavigator();

const TAB_SCREENS = {
  Orders: FarmerOrdersScreen,
  Products: FarmerProductsScreen,
  Home: FarmerDashboardScreen,
  Insights: FarmerAnalyticsScreen,
  Profile: FarmerProfileScreen,
};

const FarmerTabShell = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const ActiveScreen = TAB_SCREENS[activeTab] || FarmerDashboardScreen;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ActiveScreen navigation={navigation} onSwitchTab={setActiveTab} />
      </View>
      <View style={{ paddingTop: 34, backgroundColor: "transparent" }}>
        <BottomTabBar
          role={ROLES.FARMER}
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab.label)}
        />
      </View>
    </View>
  );
};

const FarmerNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FarmerTabs" component={FarmerTabShell} />
    <Stack.Screen name="PostProduct" component={PostProductScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    <Stack.Screen name="EditProduct" component={PostProductScreen} />
    <Stack.Screen name="Conversations" component={ConversationsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

export default FarmerNavigator;
