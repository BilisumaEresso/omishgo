// src/components/common/AppCard.js
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

const AppCard = ({ children, style, onPress, disabled = false }) => {
  const { theme } = useTheme();

  const cardStyles = [
    styles.card,
    {
      backgroundColor: theme.colors.surface || "#FFFFFF",
      borderColor: theme.colors.border || "#F0F0F0",
      borderWidth: theme.colors.border ? 1 : 0.5,
    },
    style,
  ];

  // If onPress is provided, swap out the View for an interactive Pressable element
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          ...cardStyles,
          {
            opacity: pressed && !disabled ? 0.9 : 1,
            transform: [{ scale: pressed && !disabled ? 0.99 : 1 }],
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default AppCard;
