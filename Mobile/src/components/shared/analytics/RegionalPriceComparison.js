import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import AppText from "../../common/AppText";
import { getLocalizedUnitName } from "../../../constants/units";

export default function RegionalPriceComparison({
  hubs = [
    { city: "Addis Ababa (Mercato Hub)", region: "Capital", price: "4,850", rawPrice: 4850, unit: "q", supply: "normal", distance: "Capital Center" },
    { city: "Adama Central Hub", region: "Oromia", price: "4,600", rawPrice: 4600, unit: "q", supply: "high", distance: "95 km" },
    { city: "Hawassa Market Hub", region: "Sidama", price: "4,400", rawPrice: 4400, unit: "q", supply: "high", distance: "275 km" },
    { city: "Bahir Dar Grain Hub", region: "Amhara", price: "4,700", rawPrice: 4700, unit: "q", supply: "normal", distance: "560 km" },
    { city: "Mekelle Terminal Hub", region: "Tigray", price: "4,950", rawPrice: 4950, unit: "q", supply: "scarcity", distance: "780 km" },
  ],
  primaryColor = "#15803D",
  isFarmer = true,
}) {
  const { t, i18n } = useTranslation();
  // Find highest price hub & lowest price hub
  const maxPriceObj = hubs.reduce((max, h) => (h.rawPrice > max.rawPrice ? h : max), hubs[0]);
  const minPriceObj = hubs.reduce((min, h) => (h.rawPrice < min.rawPrice ? h : min), hubs[0]);

  const getSupplyBadge = (supply) => {
    if (supply === "high") {
      return { label: t("analytics.highVolume", { defaultValue: "High Volume" }), color: "#16A34A", bg: "#DCFCE7" };
    }
    if (supply === "scarcity") {
      return { label: t("analytics.lowSupply", { defaultValue: "Low Supply" }), color: "#DC2626", bg: "#FEF2F2" };
    }
    return { label: t("analytics.stableSupply", { defaultValue: "Stable Supply" }), color: "#2563EB", bg: "#EFF6FF" };
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <AppText style={styles.title}>{t("analytics.regionalHubs", { defaultValue: "Ethiopian Regional Market Hubs" })}</AppText>
          <View style={styles.hubsBadge}>
            <Ionicons name="earth" size={13} color={primaryColor} />
            <AppText style={[styles.hubsBadgeText, { color: primaryColor }]}>{t("analytics.regionalHubsCount", { count: hubs.length, defaultValue: "{{count}} Regional Hubs" })}</AppText>
          </View>
        </View>
        <AppText style={styles.subtitle}>
          {t("analytics.ratesPerQuintal", { defaultValue: "Wholesale commodity rates per quintal (100 kg) across regional market centers" })}
        </AppText>
      </View>

      <View style={styles.list}>
        {hubs.map((hub, idx) => {
          const badge = getSupplyBadge(hub.supply);
          const isHighest = hub.city === maxPriceObj.city;
          const isLowest = hub.city === minPriceObj.city;

          return (
            <View key={hub.city} style={[styles.hubRow, idx < hubs.length - 1 && styles.borderBottom]}>
              <View style={styles.leftGroup}>
                <View style={styles.nameTagRow}>
                  <AppText style={styles.cityName}>{hub.city}</AppText>

                  {isHighest && isFarmer && (
                    <View style={styles.recommendTag}>
                      <Ionicons name="sparkles" size={10} color="#15803D" />
                      <AppText style={styles.recommendTagText}>{t("analytics.bestHubToSell", { defaultValue: "Best Hub to Sell" })}</AppText>
                    </View>
                  )}

                  {isLowest && !isFarmer && (
                    <View style={[styles.recommendTag, { backgroundColor: "#E0F2FE" }]}>
                      <Ionicons name="pricetag" size={10} color="#1565C0" />
                      <AppText style={[styles.recommendTagText, { color: "#1565C0" }]}>{t("analytics.bestHubToBuy", { defaultValue: "Best Hub to Buy" })}</AppText>
                    </View>
                  )}
                </View>

                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={13} color="#64748B" />
                  <AppText style={styles.distanceText}>{hub.distance}</AppText>
                  <View style={[styles.supplyBadge, { backgroundColor: badge.bg }]}>
                    <AppText style={[styles.supplyText, { color: badge.color }]}>{badge.label}</AppText>
                  </View>
                </View>
              </View>

              <View style={styles.rightGroup}>
                <AppText style={[styles.priceText, { color: primaryColor }]}>
                  ETB {hub.price}
                </AppText>
                <AppText style={styles.unitText}>/ {getLocalizedUnitName(hub.unit || "quintal", i18n.language || "en", t)}</AppText>
              </View>
            </View>
          );
        })}
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
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  hubsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  hubsBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
  },
  list: {
    gap: 2,
  },
  hubRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  leftGroup: {
    flex: 1,
  },
  nameTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  cityName: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  recommendTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recommendTagText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#15803D",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  distanceText: {
    fontSize: 11.5,
    color: "#64748B",
    marginRight: 6,
  },
  supplyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  supplyText: {
    fontSize: 10.5,
    fontWeight: "800",
  },
  rightGroup: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "900",
  },
  unitText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
});
