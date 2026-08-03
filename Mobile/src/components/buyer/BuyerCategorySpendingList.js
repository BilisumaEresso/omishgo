// Mobile/src/components/buyer/BuyerCategorySpendingList.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { getLocalizedCropName } from "../../constants/crops";
import { useTheme } from "../../hooks/useTheme";
import { formatNumber } from "../../utils/formatNumber";
import AppText from "../common/AppText";

export default function BuyerCategorySpendingList({
  categories = [],
  currency = "ETB",
  onCategoryPress,
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { theme } = useTheme();

  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const border = theme?.colors?.border || "#E2E8F0";

  // Fallback localized category items using crops/shared constants
  const defaultCategories = [
    {
      id: "c1",
      category: t("analytics.catVegetables", { defaultValue: "Vegetables & Roots" }),
      icon: "leaf",
      bgColor: "#E0F2FE",
      iconColor: "#0284C7",
      amount: 18500,
      date: t("buyerDashboard.thisMonth", { defaultValue: "This Month" }),
      method: t("buyerDashboard.mobileMoney", { defaultValue: "Mobile Money" }),
    },
    {
      id: "c2",
      category: t("analytics.catCereals", { defaultValue: "Cereals & Grains" }),
      icon: "nutrition",
      bgColor: "#EDE9FE",
      iconColor: "#7C3AED",
      amount: 14200,
      date: t("buyerDashboard.thisMonth", { defaultValue: "This Month" }),
      method: t("buyerDashboard.bankTransfer", { defaultValue: "Bank Transfer" }),
    },
    {
      id: "c3",
      category: t("analytics.catCashCrops", { defaultValue: "Cash Crops & Pulses" }),
      icon: "cube",
      bgColor: "#FEF3C7",
      iconColor: "#D97706",
      amount: 8100,
      date: t("buyerDashboard.thisMonth", { defaultValue: "This Month" }),
      method: t("buyerDashboard.cbeBirr", { defaultValue: "CBE Birr" }),
    },
  ];

  const displayList = categories.length > 0 ? categories : defaultCategories;

  return (
    <View style={styles.container}>
      <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
        {t("buyerDashboard.procurementCategories", {
          defaultValue: "Procurement Categories",
        })}
      </AppText>

      <View style={styles.list}>
        {displayList.map((item) => {
          const localizedCategory = item.cropType
            ? getLocalizedCropName(item.cropType, currentLang, t)
            : item.category;

          return (
            <TouchableOpacity
              key={item.id || item.category}
              style={[
                styles.itemCard,
                { backgroundColor: surfaceColor, borderColor: border },
              ]}
              onPress={() => onCategoryPress?.(item)}
              activeOpacity={0.85}
            >
              <View style={styles.leftRow}>
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: item.bgColor || "#E0F2FE" },
                  ]}
                >
                  <Ionicons
                    name={item.icon || "leaf"}
                    size={20}
                    color={item.iconColor || "#0284C7"}
                  />
                </View>

                <View style={styles.info}>
                  <AppText style={[styles.categoryTitle, { color: textPrimary }]}>
                    {localizedCategory}
                  </AppText>
                  <AppText style={[styles.dateText, { color: textSecondary }]}>
                    {item.date}
                  </AppText>
                </View>
              </View>

              <View style={styles.rightRow}>
                <AppText style={[styles.amountText, { color: textPrimary }]}>
                  {currency} {formatNumber(item.amount)}
                </AppText>
                <AppText style={[styles.methodText, { color: textSecondary }]}>
                  {item.method}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  itemCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  dateText: {
    fontSize: 11.5,
    marginTop: 2,
  },
  rightRow: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "800",
  },
  methodText: {
    fontSize: 11,
    marginTop: 2,
  },
});
