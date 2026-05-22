// src/screens/onboarding/OnboardingSupply.js
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";

export default function OnboardingSupply({ navigation }) {
  const { theme } = useTheme();

  return (
    <ScreenWrapper padding={false}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Top Header with Skip */}
        <View style={styles.header}>
          <AppButton
            title="Skip"
            variant="text"
            onPress={() => navigation.navigate("Welcome")}
          />
        </View>

        {/* Illustration Card */}
        <View style={styles.illustrationContainer}>
          <View
            style={[
              styles.imageCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Image
              //   source={require("../../assets/images/onboard_supply.png")}
              source={{
                uri: "https://images.unsplash.com/vector-1769320709000-bf5132293619?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Content text block and controls */}
        <View style={styles.content}>
          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            <View
              style={[styles.dot, { backgroundColor: theme.colors.border }]}
            />
            <View
              style={[styles.dot, { backgroundColor: theme.colors.border }]}
            />
            <View
              style={[styles.dot, { backgroundColor: theme.colors.border }]}
            />
            <View
              style={[
                styles.dot,
                { width: 32, backgroundColor: theme.colors.primary },
              ]}
            />
          </View>

          <AppText variant="headingMd" style={styles.title}>
            Power the Harvest
          </AppText>
          <AppText
            variant="bodyMd"
            color={theme.colors.textSecondary}
            style={styles.description}
          >
            Supply seeds, fertilizers, and tools directly to farmers in need.
          </AppText>

          {/* Action button */}
          <AppButton
            title="Get Started"
            fullWidth
            onPress={() => navigation.navigate("OnboardingTrack")}
            style={styles.button}
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
    paddingHorizontal: 16,
  },
  imageCard: {
    width: "100%",
    aspectRatio: 0.8,
    maxHeight: 380,
    borderRadius: 32,
    borderWidth: 1,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  image: { width: "100%", height: "100%" },
  content: { paddingHorizontal: 24, paddingBottom: 40, alignItems: "center" },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    height: 16,
  },
  dot: { height: 8, width: 8, borderRadius: 4, marginHorizontal: 4 },
  title: { marginBottom: 10, textAlign: "center" },
  description: { textAlign: "center", marginBottom: 32, maxWidth: 280 },
  button: { marginBottom: 20 },
});
