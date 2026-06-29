// src/components/layout/FloatingActionButton.js
import React, { useRef } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

const FloatingActionButton = ({
  icon = "add",
  onPress,
  bottom = 24,
  right = 24,
}) => {
  const { theme } = useTheme();

  // --- spring animation for press feedback ---
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 100,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 100,
      bounciness: 10,
    }).start();
  };

  const primaryColor = theme.colors.primary || "#4CAF50";
  const shadowColor = theme.colors.shadow || "#000";
  const iconColor = theme.colors.textInverse || "#FFFFFF";

  return (
    <Animated.View
      style={[
        styles.fabWrapper,
        {
          bottom,
          right,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: primaryColor,
            // subtle darkening when pressed (optional)
            opacity: pressed ? 0.9 : 1,
            // shadow uses theme shadow color
            shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={icon === "add" ? "Add new product" : "Action"}
      >
        <Ionicons name={icon} size={28} color={iconColor} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    // wrapper ensures the animated scale doesn't clip shadow
    overflow: "visible",
  },
  fab: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FloatingActionButton;
