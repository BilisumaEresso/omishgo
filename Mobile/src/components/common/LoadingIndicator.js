// src/components/common/LoadingIndicator.js
import "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
export const LoadingIndicator = ({
  size = "large",
  color,
  overlay = false,
  style
}) => {
  const {
    theme
  } = useTheme();
  const finalColor = color || theme?.colors?.primary || "#6B4EFF";

  // Variant A: Fixed full-bleed overlay intercepting interactions during a submission
  if (overlay) {
    return <View style={[styles.overlay, {
      backgroundColor: theme?.colors?.background ? `${theme?.colors?.background}CC` : "rgba(0,0,0,0.5)"
    }, style]} pointerEvents="auto">
        <View style={[styles.indicatorBox, {
        backgroundColor: theme?.colors?.surface || "#1A1A1A"
      }]}>
          <ActivityIndicator size={size} color={finalColor} />
        </View>
      </View>;
  }

  // Variant B: Flexible container block (inline inside an element or stretching full screen via prop styles)
  return <View style={[styles.center, style]}>
      <ActivityIndicator size={size} color={finalColor} />
    </View>;
};
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999 // Layer above all inputs, headers, and floating action buttons
  },
  indicatorBox: {
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  }
});
export default LoadingIndicator;