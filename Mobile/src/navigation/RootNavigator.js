import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import SplashScreen from "../screens/auth/SplashScreen.js";
import { useAuthStore } from "../store/auth.store.js";
import AppNavigator from "./AppNavigator.js";
import AuthNavigator from "./AuthNavigator.js";

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, restoreSession } = useAuthStore();
  const [isReady, setIsReady] = useState(false); // Splash is showing
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      // Check if language has been selected before (first launch detection)
      const langSelected = await AsyncStorage.getItem("@language_selected");
      setShowOnboarding(!langSelected);

      // Restore persisted token/user from AsyncStorage
      await restoreSession();
      setIsReady(true);
    };
    bootstrap();
  }, []);

  // Show splash while bootstrapping
  if (!isReady) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            initialParams={{ showOnboarding }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
