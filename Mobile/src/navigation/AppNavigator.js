import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "../store/auth.store.js";
import FarmerNavigator from "./FarmerNavigator.js";
import BuyerNavigator from "./BuyerNavigator.js";

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
  const role = useAuthStore((state) => state.user?.role);

  if (role === "admin") return <AdminMobileGuard />;
  if (!role) return null;

  // Each role navigator manages its own stack internally.
  // Wrapping them in a Stack.Navigator here lets us add
  // cross-role screens (e.g. Chat) at the root level if needed.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === "farmer" ? (
        <Stack.Screen name="FarmerRoot" component={FarmerNavigator} />
      ) : (
        <Stack.Screen name="BuyerRoot" component={BuyerNavigator} />
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
