// src/navigation/AuthNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RoleSelection from "../screens/auth/RoleSelection";
import SuccessScreen from "../screens/auth/SuccessScreen";
import DeviceBlockedScreen from "../screens/auth/DeviceBlockedScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";

// Import your onboarding screens
import OnboardingSell from "../screens/onboarding/OnboardingSell";
import OnboardingBuy from "../screens/onboarding/OnboardingBuy";
import OnboardingSupply from "../screens/onboarding/OnboardingSupply";
import OnboardingTrack from "../screens/onboarding/OnboardingTrack";

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
      <Stack.Screen name="OnboardingSell" component={OnboardingSell} />
      <Stack.Screen name="OnboardingBuy" component={OnboardingBuy} />
      <Stack.Screen name="OnboardingSupply" component={OnboardingSupply} />
      <Stack.Screen name="OnboardingTrack" component={OnboardingTrack} />

      {/* Auth & Role Flow */}
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
