import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";
import BottomTabBar from "../components/layout/BottomTabBar";
import { ROLES } from "../constants/roles";
import BrowseScreen from "../screens/buyer/BrowseScreen";
import BuyerDashboardScreen from "../screens/buyer/BuyerDashboardScreen";
import BuyerOrdersScreen from "../screens/buyer/BuyerOrdersScreen";
import BuyerProfileScreen from "../screens/buyer/BuyerProfileScreen";
import BuyerSavedScreen from "../screens/buyer/BuyerSavedScreen";
import ListingDetailScreen from "../screens/buyer/ListingDetailScreen";
import ChatScreen from "../screens/shared/ChatScreen";
import ConversationsScreen from "../screens/shared/ConversationsScreen";

const Stack = createNativeStackNavigator();

const TAB_SCREENS = {
  Orders: BuyerOrdersScreen,
  Marketplace: BrowseScreen,
  Home: BuyerDashboardScreen,
  Saved: BuyerSavedScreen,
  Profile: BuyerProfileScreen,
};

const BuyerTabShell = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const ActiveScreen = TAB_SCREENS[activeTab] || BuyerDashboardScreen;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ActiveScreen navigation={navigation} onSwitchTab={setActiveTab} />
      </View>
      <View style={{ paddingTop: 34, backgroundColor: "transparent" }}>
        <BottomTabBar
          role={ROLES.BUYER}
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab.label)}
        />
      </View>
    </View>
  );
};

const BuyerNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BuyerTabs" component={BuyerTabShell} />
    <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
    <Stack.Screen name="Conversations" component={ConversationsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

export default BuyerNavigator;
