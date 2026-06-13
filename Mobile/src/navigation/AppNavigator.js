import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "../store/auth.store.js";
import FarmerDashboardScreen from "../screens/farmer/FarmerDashboardScreen.js";
import ListingFormScreen from "../screens/farmer/ListingFormScreen.js";
import BuyerBrowseScreen from "../screens/buyer/BuyerBrowseScreen.js";
import MessagingScreen from "../screens/messaging/MessagingScreen.js";

const Stack = createNativeStackNavigator();

// Friendly screen for admin role on mobile
const AdminMobileGuard = () => (
  <View style={styles.guard}>
    <Text style={styles.guardIcon}>🖥️</Text>
    <Text style={styles.guardTitle}>Admin Access</Text>
    <Text style={styles.guardBody}>
      The admin panel is only available on the web.{"\n"}
      Please visit the OmishGo AdminWeb dashboard on a desktop browser.
    </Text>
  </View>
);

const AppNavigator = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  // Admin should see a friendly guard, not crash
  if (role === "admin") {
    return <AdminMobileGuard />;
  }

  if (!role) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === "farmer" ? (
        <>
          <Stack.Screen name="FarmerHome" component={FarmerDashboardScreen} />
          <Stack.Screen name="ListingForm" component={ListingFormScreen} />
          <Stack.Screen name="BuyerBrowse" component={BuyerBrowseScreen} />
          <Stack.Screen name="Messaging" component={MessagingScreen} />
        </>
      ) : (
        // buyer
        <>
          <Stack.Screen name="BuyerBrowse" component={BuyerBrowseScreen} />
          <Stack.Screen name="Messaging" component={MessagingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  guard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f9fafb",
  },
  guardIcon: { fontSize: 64, marginBottom: 16 },
  guardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  guardBody: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default AppNavigator;
