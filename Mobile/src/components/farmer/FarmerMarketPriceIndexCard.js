import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { getLocalizedCropName } from "../../constants/crops";

export default function FarmerMarketPriceIndexCard({
  trends = [],
  onSeeAllAnalytics,
  onListCropAtRate,
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const defaultTrends = [
    { crop: "Red Onion", region: "Addis Ababa", price: "4,500 ETB/q", demandChange: "+15%", isUp: true },
    { crop: "White Teff", region: "Regional Hub", price: "5,200 ETB/q", demandChange: "+8%", isUp: true },
    { crop: "Tomato", region: "Adama", price: "3,800 ETB/q", demandChange: "-2%", isUp: false },
  ];

  const list = trends.length > 0 ? trends : defaultTrends;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={styles.iconBg}>
            <Ionicons name="stats-chart" size={16} color="#15803D" />
          </View>
          <View>
            <AppText style={styles.title}>{t("farmerDashboard.ethiopianPriceIndex", { defaultValue: "Ethiopian Wholesale Price Index" })}</AppText>
            <AppText style={styles.subtitle}>{t("analytics.ratesPerQuintal", { defaultValue: "Real-time commodity demand & hub rates" })}</AppText>
          </View>
        </View>

        <TouchableOpacity onPress={onSeeAllAnalytics} activeOpacity={0.8}>
          <AppText style={styles.seeAllText}>{t("farmerDashboard.fullMarket", { defaultValue: "Full Market" })}</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {list.map((item, idx) => {
          const isLast = idx === list.length - 1;
          const isUp = item.isUp ?? !item.demandChange?.includes("-");
          const cropName = getLocalizedCropName(item.crop, currentLang, t);

          return (
            <View key={item.crop + idx} style={[styles.row, !isLast && styles.rowBorder]}>
              <View style={{ flex: 1 }}>
                <View style={styles.cropTitleRow}>
                  <AppText style={styles.cropName}>{cropName}</AppText>
                  <View style={[styles.badge, { backgroundColor: isUp ? "#DCFCE7" : "#FEE2E2" }]}>
                    <Ionicons name={isUp ? "trending-up" : "trending-down"} size={12} color={isUp ? "#16A34A" : "#DC2626"} />
                    <AppText style={[styles.badgeText, { color: isUp ? "#16A34A" : "#DC2626" }]}>
                      {item.demandChange}
                    </AppText>
                  </View>
                </View>

                <AppText style={styles.regionText}>
                  {t("farmerDashboard.marketHub", { defaultValue: "Market Hub:" })} <AppText style={styles.regionVal}>{item.region || "Addis Ababa"}</AppText>
                </AppText>
              </View>

              <View style={styles.actionCol}>
                <AppText style={styles.priceText}>{item.price}</AppText>
                <TouchableOpacity
                  style={styles.listBtn}
                  onPress={() => onListCropAtRate?.(item)}
                  activeOpacity={0.8}
                >
                  <AppText style={styles.listBtnText}>{t("farmerDashboard.listHarvest", { defaultValue: "List Harvest" })}</AppText>
                </TouchableOpacity>
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
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#DCFCE7",
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
    marginTop: 1,
  },
  seeAllText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#15803D",
  },
  list: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  cropTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  cropName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: "800",
  },
  regionText: {
    fontSize: 11.5,
    color: "#64748B",
  },
  regionVal: {
    fontWeight: "600",
    color: "#334155",
  },
  actionCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  priceText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  listBtn: {
    backgroundColor: "#15803D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  listBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
});
