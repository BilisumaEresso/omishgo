import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationProvider } from "./src/context/NavigationContext.js";
import { ThemeProvider } from "./src/context/ThemeContext.js";
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
