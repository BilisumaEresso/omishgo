// src/components/farmer/FarmerMarketOpportunityCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function FarmerMarketOpportunityCard({
  cropName = "Red Onion",
  demandChange = "+15%",
  targetHub = "Addis Ababa",
  suggestedPrice = 4500,
  onSellNow,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.sparkIconBg}>
          <Ionicons name="trending-up" size={18} color="#D97706" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={styles.title}>High Crop Wholesale Demand Alert</AppText>
          <AppText style={styles.subtitle}>
            Wholesale demand for <AppText style={styles.highlight}>{cropName}</AppText> is up{" "}
            <AppText style={styles.changeText}>{demandChange}</AppText> in {targetHub}.
          </AppText>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <AppText style={styles.priceLabel}>Suggested Listing Price</AppText>
          <AppText style={styles.priceVal}>ETB {Number(suggestedPrice).toLocaleString()} / q</AppText>
        </View>

        <TouchableOpacity style={styles.sellBtn} onPress={onSellNow} activeOpacity={0.85}>
          <AppText style={styles.sellBtnText}>List Harvest Now</AppText>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFBEB",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FCD34D",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  sparkIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#92400E",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12.5,
    color: "#78350F",
    lineHeight: 18,
  },
  highlight: {
    fontWeight: "800",
    color: "#B45309",
  },
  changeText: {
    fontWeight: "800",
    color: "#059669",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 14,
  },
  priceLabel: {
    fontSize: 11,
    color: "#92400E",
    fontWeight: "600",
  },
  priceVal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#78350F",
    marginTop: 1,
  },
  sellBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D97706",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sellBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
