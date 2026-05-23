// src/navigation/AuthNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RoleSelection from "../screens/auth/RoleSelection";
import SuccessScreen from "../screens/auth/SuccessScreen";
import DeviceBlockedScreen from "../screens/auth/DeviceBlockedScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";

// Import your onboarding screens
import OnboardingCarousel from "../screens/onboarding/OnboardingCarousel";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Onboarding Sequence */}
      <Stack.Screen name="OnboardingSell" component={OnboardingCarousel} />

      {/* Auth & Role Flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />

      {/* Utilities */}
      <Stack.Screen name="DeviceBlocked" component={DeviceBlockedScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
