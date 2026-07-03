import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as NavigationBar from "expo-navigation-bar";
import { NavigationProvider } from "./src/context/NavigationContext.js";
import { ThemeProvider } from "./src/context/ThemeContext.js";
import "./src/locales/i18n.js";
import RootNavigator from "./src/navigation/RootNavigator.js";
import { getDeviceId } from "./src/utils/deviceId.js";

export default function App() {
  useEffect(() => {
    // Initialize and log device ID for testing
    const initializeDevice = async () => {
      try {
        const deviceId = await getDeviceId();
        console.log("🔧 APP INITIALIZED - DEVICE_ID:", deviceId);
      } catch (error) {
        console.error("Failed to get device ID:", error);
      }
    };
    initializeDevice();

    const setSystemUi = async () => {
      try {
        if (typeof NavigationBar.setVisibilityAsync === "function") {
          await NavigationBar.setVisibilityAsync("hidden");
        }
        if (typeof NavigationBar.setBehaviorAsync === "function") {
          await NavigationBar.setBehaviorAsync("overlay-swipe");
        }
        setStatusBarStyle("dark");
      } catch (error) {
        console.warn("Failed to configure navigation/status bar:", error);
      }
    };
    setSystemUi();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationProvider>
          <RootNavigator />
          <StatusBar barStyle="dark-content" />
        </NavigationProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
