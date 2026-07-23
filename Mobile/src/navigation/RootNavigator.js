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
  const [isReady, setIsReady] = useState(false); // Bootstrapping auth and language
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const langSelected = await AsyncStorage.getItem("@language_selected");
      setShowOnboarding(!langSelected);

      await restoreSession();
      setIsReady(true);
    };
    bootstrap();
  }, [restoreSession]);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, [isReady]);

  if (!isReady || showSplash) {
    return <SplashScreen />;
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
