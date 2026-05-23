// src/navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROLES } from "../constants/roles.js";
import { useAuthStore } from "../store/auth.store.js";
import BuyerNavigator from "./BuyerNavigator.js";
import DriverNavigator from "./DriverNavigator.js";
import FarmerNavigator from "./FarmerNavigator.js";
import SupplierNavigator from "./SupplierNavigator.js";
import RoleSelectionModal from "../screens/role/RoleSelectionModal.js";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const user = useAuthStore((state) => state.user);
  const activeRole = user?.activeRole;

  if (!activeRole) {
    return <RoleSelectionModal />;
  }

  if (!activeRole) {
    return null;
  }

  // SYSTEM FIX: Render navigators inside safe wrapper components to ensure strict navigation tree stability
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {activeRole === ROLES.BUYER && (
        <Stack.Screen name="BuyerWorkspace" component={BuyerNavigator} />
      )}
      {activeRole === ROLES.FARMER && (
        <Stack.Screen name="FarmerWorkspace" component={FarmerNavigator} />
      )}
      {activeRole === ROLES.DRIVER && (
        <Stack.Screen name="DriverWorkspace" component={DriverNavigator} />
      )}
      {activeRole === ROLES.SUPPLIER && (
        <Stack.Screen name="SupplierWorkspace" component={SupplierNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
