// src/screens/SplashScreen.js
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, StatusBar, StyleSheet, View } from "react-native";
import AppText from "../../components/common/AppText";
import { useTheme } from "../../hooks/useTheme";

export default function SplashScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const colors = theme?.colors || {};
  const backgroundColor = colors.background || "#FFFFFF";
  const primaryColor = colors.primary || "#4CAF50";
  const textSecondaryColor = colors.textSecondary || "#757575";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <AppText style={[styles.title, { color: primaryColor }]}>
          {t("splash.title")}
        </AppText>
        <AppText style={[styles.subtitle, { color: textSecondaryColor }]}>
          {t("splash.subtitle")}
        </AppText>
      </Animated.View>

      {/* Subtle loading dots */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, { backgroundColor: primaryColor }]} />
        <View
          style={[
            styles.dot,
            styles.dotCenter,
            { backgroundColor: primaryColor },
          ]}
        />
        <View style={[styles.dot, { backgroundColor: primaryColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    bottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.4,
  },
  dotCenter: {
    opacity: 0.8,
  },
});
