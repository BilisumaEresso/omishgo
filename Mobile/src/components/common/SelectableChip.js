import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";

const SelectableChip = ({
  active,
  onPress,
  icon,
  label,
  primary,
  border,
  textSecondary,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const bg = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(bg, {
      toValue: active ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const backgroundColor = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0)", primary + "15"],
  });
  const borderColor = bg.interpolate({
    inputRange: [0, 1],
    outputRange: [border, primary],
  });

  const handleIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  const handleOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handleIn}
      onPressOut={handleOut}
      style={styles.container}
    >
      {/* Outer node: ONLY the native-driven transform lives here */}
      <Animated.View style={[styles.scaleWrapper, { transform: [{ scale }] }]}>
        {/* Inner node: ONLY the JS-driven color interpolations live here */}
        <Animated.View style={[styles.chip, { backgroundColor, borderColor }]}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={active ? primary : textSecondary}
              style={styles.icon}
            />
          )}
          <AppText
            style={[styles.label, { color: active ? primary : textSecondary }]}
          >
            {label}
          </AppText>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scaleWrapper: { flex: 1 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  icon: { marginRight: 6 },
  label: { fontWeight: "600", fontSize: 15 },
});

export default SelectableChip;
