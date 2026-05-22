// src/screens/onboarding/OnboardingSell.js
import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";

export default function OnboardingSell({ navigation }) {
  const { theme } = useTheme();
  // Using a success-themed color for the Sell onboarding flow
  const successColor = theme.colors.success || "#4CAF50";

  return (
    <ScreenWrapper padding={false}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
            <AppText variant="bodyMd" color={theme.colors.textSecondary}>
              Skip
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View
            style={[
              styles.imageCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Image
              // source={require("../../assets/images/onboard_farmer.png")}
              source={{
                uri: "https://images.unsplash.com/vector-1757327112287-47e121f8f0bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFybWVyfGVufDB8fDB8fHww",
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <AppText variant="headingMd" style={styles.title}>
            Sell Agricultural Products Easily
          </AppText>
          <AppText
            variant="bodyMd"
            color={theme.colors.textSecondary}
            style={styles.description}
          >
            Directly connect with buyers from East Shewa to Addis Ababa.
          </AppText>

          {/* Pagination */}
          <View style={styles.dotsRow}>
            <View
              style={[styles.dot, { width: 32, backgroundColor: successColor }]}
            />
            <View
              style={[styles.dot, { backgroundColor: theme.colors.border }]}
            />
            <View
              style={[styles.dot, { backgroundColor: theme.colors.border }]}
            />
          </View>

          <AppButton
            title="Next"
            fullWidth
            onPress={() => navigation.navigate("OnboardingBuy")}
            style={{ backgroundColor: successColor }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  imageCard: {
    width: "100%",
    aspectRatio: 0.8,
    maxHeight: 400,
    borderRadius: 48,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  image: { width: "100%", height: "100%" },
  content: { paddingHorizontal: 24, paddingBottom: 40, alignItems: "center" },
  title: { marginBottom: 16, textAlign: "center" },
  description: { textAlign: "center", marginBottom: 24, maxWidth: 280 },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    height: 24,
  },
  dot: { height: 8, width: 8, borderRadius: 4, marginHorizontal: 4 },
});
