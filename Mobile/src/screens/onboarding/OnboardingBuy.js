// src/screens/onboarding/OnboardingBuy.js
import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";

export default function OnboardingBuy({ navigation }) {
  const { theme } = useTheme();

  return (
    <ScreenWrapper padding={false}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <AppText variant="headingSm" color={theme.colors.primary}>
              🌱 OmishGo
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("OnboardingSupply")}
          >
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
              // source={require("../../assets/images/onboard_market.png")}
              source={{
                uri: "https://images.unsplash.com/vector-1756861912336-60ea0bcd7c90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFybSUyMG1hcmtldHxlbnwwfHwwfHx8MA%3D%3D",
              }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.badge}>
              <AppText variant="caption" style={{ fontWeight: "600" }}>
                ✨ Verified Sellers
              </AppText>
            </View>
          </View>
        </View>

        {/* Content Box */}
        <View
          style={[styles.controlBox, { backgroundColor: theme.colors.surface }]}
        >
          <AppText variant="headingMd" style={styles.title}>
            Buy Fresh Local Produce
          </AppText>
          <AppText
            variant="bodyMd"
            color={theme.colors.textSecondary}
            style={styles.description}
          >
            Source quality crops from verified Ethiopian farmers at competitive
            prices.
          </AppText>

          {/* Pagination */}
          <View style={styles.dotsRow}>
            <View
              style={[
                styles.dot,
                styles.dotInactive,
                { backgroundColor: theme.colors.border },
              ]}
            />
            <View
              style={[
                styles.dot,
                { width: 32, backgroundColor: theme.colors.primary },
              ]}
            />
            <View
              style={[
                styles.dot,
                styles.dotInactive,
                { backgroundColor: theme.colors.border },
              ]}
            />
          </View>

          <AppButton
            title="Next ➔"
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
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
    borderRadius: 32,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  image: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  controlBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  title: { marginBottom: 12 },
  description: { textAlign: "center", marginBottom: 24, maxWidth: 300 },
  dotsRow: { flexDirection: "row", marginBottom: 24, height: 16 },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  dotInactive: { width: 8 },
  button: { marginBottom: 20 },
});
