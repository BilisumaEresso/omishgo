import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ---- Local animated number hook ----
const useAnimatedNumber = (target, duration = 800) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  }, [target]);
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, target],
  });
};

// ---- Summary Card ----
const SummaryCard = ({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  color = "#4CAF50",
  onPress,
}) => {
  const animatedNumber = useAnimatedNumber(value);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color + "15" }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.prefix}>{prefix}</Text>
        <Animated.Text style={styles.value}>
          {animatedNumber.interpolate({
            inputRange: [0, value],
            outputRange: [0, value].map((v) => Math.round(v).toString()),
          })}
        </Animated.Text>
        <Text style={styles.suffix}>{suffix}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1, // cards share the row equally
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  prefix: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  suffix: {
    fontSize: 12,
    color: "#888",
    marginLeft: 2,
  },
});

export default SummaryCard;
