// Simple branded splash — shown by RootNavigator during bootstrap.
// No navigation logic here; RootNavigator handles all routing after restoreSession.
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>OmishGo</Text>
      <Text style={styles.tagline}>Connecting Farmers and Markets</Text>
      <ActivityIndicator size="large" color="#2e7d32" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  brand: {
    fontSize: 42,
    fontWeight: "900",
    color: "#2e7d32",
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    marginBottom: 48,
  },
  loader: {
    marginTop: 16,
  },
});
