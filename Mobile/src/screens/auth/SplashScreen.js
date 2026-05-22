// src/screens/auth/SplashScreen.js
import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import AppText from "../../components/common/AppText";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

export default function SplashScreen({ navigation }) {
  const { theme } = useTheme();
  const { restoreSession, user } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      // Small delay to ensure the design splash renders properly
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const sessionRestored = await restoreSession();

      if (sessionRestored && user?.activeRole) {
        // NavigationContext will handle routing via AppNavigator
      } else {
        navigation.replace("OnboardingSell");
      }
    };

    initializeApp();
  }, []);

  return (
    <ScreenWrapper padding={false}>
      <View
        style={[styles.content, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.brandContainer}>
          <AppText variant="displayLg" color={theme.colors.primary}>
            OmishGo
          </AppText>
        </View>

        <View
          style={[
            styles.logoWrapper,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.taglineWrapper}>
          <AppText variant="bodyLg" color={theme.colors.textSecondary}>
            Connecting Farmers and Markets
          </AppText>
        </View>

        <View style={styles.loaderContainer}>
          <View
            style={[
              styles.dot,
              { backgroundColor: theme.colors.primary, opacity: 0.3 },
            ]}
          />
          <View
            style={[
              styles.dot,
              {
                backgroundColor: theme.colors.primary,
                transform: [{ scale: 1.2 }],
              },
            ]}
          />
          <View
            style={[
              styles.dot,
              { backgroundColor: theme.colors.primary, opacity: 0.3 },
            ]}
          />
        </View>

        <AppText variant="caption" color={theme.colors.textSecondary}>
          Loading environment...
        </AppText>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  brandContainer: { marginTop: 40 },
  logoWrapper: {
    width: 250,
    height: 250,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: { width: "100%", height: "100%" },
  taglineWrapper: { marginVertical: 16 },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
});

