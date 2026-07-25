// src/components/buyer/BuyerHeroBudgetCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function BuyerHeroBudgetCard({
  totalSpend = 0,
  monthlyBudget = 50000,
  currency = "ETB",
  onSeeDetails,
}) {
  const formattedSpend = Number(totalSpend || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedBudget = Number(monthlyBudget || 50000).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  );

  const progressPercent = Math.min(
    100,
    Math.max(0, (totalSpend / monthlyBudget) * 100)
  );

  return (
    <View style={styles.container}>
      {/* Upper Hero Card */}
      <View style={styles.heroCard}>
        {/* Background Geometric Abstract Shapes */}
        <View style={styles.abstractContainer} pointerEvents="none">
          <View style={[styles.leafShape, styles.leafCyan]} />
          <View style={[styles.leafShape, styles.leafPink]} />
          <View style={[styles.circleShape, styles.circleYellow]} />
          <View style={[styles.circleShape, styles.circleBlue]} />
        </View>

        <View style={styles.heroContent}>
          <AppText style={styles.label}>Available Procurement Spend</AppText>
          <AppText style={styles.amount}>
            {currency} {formattedSpend}
          </AppText>

          <TouchableOpacity
            onPress={onSeeDetails}
            activeOpacity={0.8}
            style={styles.seeDetailsBtn}
          >
            <AppText style={styles.seeDetailsText}>See details</AppText>
            <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lower Budget Bar Strip Card */}
      <View style={styles.budgetStripCard}>
        <View style={styles.stripHeader}>
          <View>
            <AppText style={styles.stripTitle}>Procurement Budget</AppText>
            <AppText style={styles.stripSubtitle}>Monthly Allocation</AppText>
          </View>
          <AppText style={styles.stripAmount}>
            {currency} {formattedBudget}
          </AppText>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  heroCard: {
    backgroundColor: "#1E1B4B", // Deep Indigo/Navy matching Image 1
    borderRadius: 24,
    padding: 22,
    position: "relative",
    overflow: "hidden",
    minHeight: 155,
    justifyContent: "center",
  },
  abstractContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    bottom: 10,
    width: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  leafShape: {
    position: "absolute",
    width: 50,
    height: 70,
    borderRadius: 35,
  },
  leafCyan: {
    backgroundColor: "#38BDF8", // Cyan leaf
    top: 10,
    right: 50,
    transform: [{ rotate: "-45deg" }],
  },
  leafPink: {
    backgroundColor: "#F43F5E", // Pink leaf
    bottom: 15,
    right: 15,
    transform: [{ rotate: "35deg" }],
  },
  circleShape: {
    position: "absolute",
    borderRadius: 999,
  },
  circleYellow: {
    width: 32,
    height: 32,
    backgroundColor: "#FBBF24", // Yellow circle
    top: 5,
    right: 25,
  },
  circleBlue: {
    width: 24,
    height: 24,
    backgroundColor: "#818CF8", // Soft purple circle
    bottom: 5,
    right: 70,
  },
  heroContent: {
    zIndex: 2,
    maxWidth: "68%",
  },
  label: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.75)",
    fontWeight: "500",
    marginBottom: 6,
  },
  amount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  seeDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* Budget Strip */
  budgetStripCard: {
    backgroundColor: "#2E2A68",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 10,
  },
  stripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  stripTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stripSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.65)",
    marginTop: 2,
  },
  stripAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  progressTrack: {
    height: 6,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FBBF24", // Yellow progress indicator
    borderRadius: 3,
  },
});
