// src/components/shared/analytics/DemandForecastCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../../common/AppText";

export default function DemandForecastCard({
  role = "buyer",
  primaryColor = "#1565C0",
}) {
  const isFarmer = role === "farmer";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={20} color="#D97706" />
        <AppText style={styles.title}>
          {isFarmer ? "Selling Opportunity" : "Market Sourcing Tip"}
        </AppText>
      </View>

      <AppText style={styles.bodyText}>
        {isFarmer
          ? "Wholesale onion prices in Adama are up +5.8% this week (ETB 4,500 / quintal). High demand from local markets makes now a good time to list your harvest."
          : "Sourcing Teff and Red Onion from Adama and Debre Zeit regional hubs currently offers ~8% lower prices compared to Addis Ababa Mercato."}
      </AppText>

      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <AppText style={styles.statLabel}>7-Day Trend</AppText>
          <AppText style={[styles.statValue, { color: "#10B981" }]}>+5.8% Rising</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <AppText style={styles.statLabel}>Market Activity</AppText>
          <AppText style={[styles.statValue, { color: primaryColor }]}>High Demand</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  bodyText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 19,
    marginBottom: 14,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#CBD5E1",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
  },
});
