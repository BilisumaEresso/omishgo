import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "./AppText";

const ErrorBanner = ({ message, errorColor }) => (
  <View
    style={[
      styles.banner,
      {
        backgroundColor: errorColor + "15",
        borderColor: errorColor + "30",
      },
    ]}
  >
    <Ionicons name="alert-circle" size={16} color={errorColor} />
    <AppText style={[styles.text, { color: errorColor }]}>{message}</AppText>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  text: { fontSize: 13, flex: 1 },
});

export default ErrorBanner;
