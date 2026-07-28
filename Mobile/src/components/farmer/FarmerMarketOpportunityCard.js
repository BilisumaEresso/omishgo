import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { getLocalizedCropName } from "../../constants/crops";
import { getLocalizedUnitName } from "../../constants/units";
import {
  getLocalizedWeredaName,
  getLocalizedZoneName,
  getLocalizedRegionName,
} from "../../constants/locations";
import { formatNumber } from "../../utils/formatNumber";

export default function FarmerMarketOpportunityCard({
  cropName = "Red Onion",
  demandChange = "+15%",
  targetHub = "Addis Ababa",
  suggestedPrice = 4500,
  onSellNow,
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const localizedCrop = getLocalizedCropName(cropName, currentLang, t);
  const localizedHub =
    getLocalizedWeredaName(targetHub, currentLang) ||
    getLocalizedZoneName(targetHub, currentLang) ||
    getLocalizedRegionName(targetHub, currentLang) ||
    targetHub;
  const localizedUnit = getLocalizedUnitName("q", currentLang, t);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.sparkIconBg}>
          <Ionicons name="trending-up" size={18} color="#D97706" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={styles.title}>{t("farmerDashboard.wholesaleDemandAlert", { defaultValue: "High Crop Wholesale Demand Alert" })}</AppText>
          <AppText style={styles.subtitle}>
            {t("farmerDashboard.wholesaleDemandFor", { defaultValue: "Wholesale demand for" })} <AppText style={styles.highlight}>{localizedCrop}</AppText> {t("farmerDashboard.isUp", { defaultValue: "is up" })}{" "}
            <AppText style={styles.changeText}>{demandChange}</AppText> {t("farmerDashboard.inLocation", { defaultValue: "in" })} {localizedHub}.
          </AppText>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <AppText style={styles.priceLabel}>{t("farmerDashboard.suggestedPrice", { defaultValue: "Suggested Listing Price" })}</AppText>
          <AppText style={styles.priceVal}>ETB {formatNumber(suggestedPrice)} / {localizedUnit}</AppText>
        </View>

        <TouchableOpacity style={styles.sellBtn} onPress={onSellNow} activeOpacity={0.85}>
          <AppText style={styles.sellBtnText}>{t("farmerDashboard.listHarvestNow", { defaultValue: "List Harvest Now" })}</AppText>
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
