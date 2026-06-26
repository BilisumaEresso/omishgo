import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LanguagePickerScreen from "../screens/onboarding/LanguagePickerScreen";
import OnboardingCarousel from "../screens/onboarding/OnboardingCarousel";

const Stack = createNativeStackNavigator();

const AuthNavigator = ({ route }) => {
  // showOnboarding is passed from RootNavigator on first launch
  const showOnboarding = route?.params?.showOnboarding ?? false;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      initialRouteName={showOnboarding ? "LanguagePicker" : "Login"}
    >
      <Stack.Screen name="LanguagePicker" component={LanguagePickerScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingCarousel} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
