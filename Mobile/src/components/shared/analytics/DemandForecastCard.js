// src/components/shared/analytics/DemandForecastCard.js
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../../common/AppText";

export default function DemandForecastCard({
  role = "buyer",
  primaryColor = "#1565C0",
  cropName = "Red Onion",
}) {
  const { t } = useTranslation();
  const isFarmer = role === "farmer";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <Ionicons name="sparkles" size={16} color="#D97706" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={styles.title}>
            {isFarmer
              ? t("analytics.harvestSalesIntel", { defaultValue: "Harvest Sales Intelligence" })
              : t("analytics.marketSourcingIntel", { defaultValue: "Market Sourcing Intelligence" })}
          </AppText>
          <AppText style={styles.subtitle}>{t("analytics.actionableAdvisory", { defaultValue: "Actionable AI market advisory" })}</AppText>
        </View>
      </View>

      <AppText style={styles.bodyText}>
        {isFarmer
          ? t("analytics.farmerAdvisoryBody", { cropName, defaultValue: `Wholesale demand for ${cropName} in Addis Ababa & Adama is trending +5.8% higher this week (ETB 4,500/q). High buyer inquiry volume makes this an optimal window to publish your harvest listing.` })
          : t("analytics.buyerAdvisoryBody", { cropName, defaultValue: `Direct sourcing of ${cropName} from Adama and Debre Zeit regional producer hubs currently offers ~8% lower rates compared to Addis Ababa Mercato, saving logistics expenses.` })}
      </AppText>

      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <AppText style={styles.statLabel}>{t("analytics.sevenDayTrend", { defaultValue: "7-Day Trend" })}</AppText>
          <AppText style={[styles.statValue, { color: "#16A34A" }]}>{t("analytics.sevenDaySurge", { defaultValue: "+5.8% Surge" })}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <AppText style={styles.statLabel}>{t("analytics.demandIndex", { defaultValue: "Demand Index" })}</AppText>
          <AppText style={[styles.statValue, { color: primaryColor }]}>{t("analytics.highActivity", { defaultValue: "High Activity" })}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <AppText style={styles.statLabel}>{t("analytics.priceOutlook", { defaultValue: "Price Outlook" })}</AppText>
          <AppText style={[styles.statValue, { color: "#D97706" }]}>{t("analytics.bullish", { defaultValue: "Bullish" })}</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 11.5,
    color: "#64748B",
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
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: "#E2E8F0",
  },
  statLabel: {
    fontSize: 10.5,
    color: "#64748B",
    marginBottom: 2,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 12.5,
    fontWeight: "800",
  },
});
