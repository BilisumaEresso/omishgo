import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";
import BottomTabBar from "../components/layout/BottomTabBar";
import { ROLES } from "../constants/roles";
import { SidebarProvider } from "../context/SidebarContext";
import BrowseScreen from "../screens/buyer/BrowseScreen";
import BuyerDashboardScreen from "../screens/buyer/BuyerDashboardScreen";
import BuyerOrdersScreen from "../screens/buyer/BuyerOrdersScreen";
import BuyerProfileScreen from "../screens/buyer/BuyerProfileScreen";
import BuyerSavedScreen from "../screens/buyer/BuyerSavedScreen";
import FarmerProfileScreen from "../screens/buyer/FarmerProfileScreen";
import ListingDetailScreen from "../screens/buyer/ListingDetailScreen";
import ChatScreen from "../screens/shared/ChatScreen";
import ConversationsScreen from "../screens/shared/ConversationsScreen";
import HelpScreen from "../screens/shared/HelpScreen";
import NotificationsScreen from "../screens/shared/NotificationsScreen";
import OrderDetailScreen from "../screens/shared/OrderDetailScreen";

const Stack = createNativeStackNavigator();

const TAB_SCREENS = {
  Home: BuyerDashboardScreen,
  Marketplace: BrowseScreen,
  Orders: BuyerOrdersScreen,
  Saved: BuyerSavedScreen,
  Profile: BuyerProfileScreen,
};

const BuyerTabShell = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const ActiveScreen = TAB_SCREENS[activeTab] || BuyerDashboardScreen;
  return (
    <SidebarProvider
      role={ROLES.BUYER}
      navigation={navigation}
      onSwitchTab={setActiveTab}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ActiveScreen navigation={navigation} onSwitchTab={setActiveTab} />
        </View>
        <BottomTabBar
          role={ROLES.BUYER}
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab.label)}
        />
      </View>
    </SidebarProvider>
  );
};

const BuyerNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BuyerTabs" component={BuyerTabShell} />
    <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
    <Stack.Screen name="FarmerProfile" component={FarmerProfileScreen} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    <Stack.Screen name="Conversations" component={ConversationsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

export default BuyerNavigator;
