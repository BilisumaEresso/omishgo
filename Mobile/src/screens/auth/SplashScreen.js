// src/screens/SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated, StatusBar } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

export default function SplashScreen({ navigation }) {
  const { theme } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate logo entrance
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

    // Navigate after 2 seconds
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace("App"); // or your main navigator
      } else {
        navigation.replace("Auth"); // or "Login"
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const backgroundColor = theme?.colors?.background || "#FFFFFF";
  const primaryColor = theme?.colors?.primary || "#4CAF50";

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
