// src/components/buyer/BuyerFilterModal.js
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { CROP_TYPES, getLocalizedCropName } from "../../constants/crops";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";

const CATEGORIES = ["All", "Vegetables", "Grains", ...CROP_TYPES];
const REGIONS = ["All Regions", "Adama", "Debre Zeit", "Ziway", "Bishoftu", "Hawassa"];

export default function BuyerFilterModal({
  visible,
  onClose,
  selectedCategory = "All",
  onSelectCategory,
  selectedRegion = "All Regions",
  onSelectRegion,
  sortBy = "newest",
  onSelectSortBy,
  onReset,
}) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";

  const SORT_OPTIONS = [
    { id: "newest", label: t("browse.sortNewest", { defaultValue: "Newest First" }) },
    { id: "price_asc", label: t("browse.sortPriceAsc", { defaultValue: "Price: Low to High" }) },
    { id: "price_desc", label: t("browse.sortPriceDesc", { defaultValue: "Price: High to Low" }) },
  ];

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedRegion !== "All Regions" ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.bottomSheet, { backgroundColor: surfaceColor }]}>
          {/* Top Drag Pill Indicator */}
          <View style={styles.dragHandleWrap}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <AppText style={styles.title}>
              {t("buyerDashboard.filterProduce", { defaultValue: "Filter Produce & Farmers" })}
            </AppText>
            <View style={styles.headerRight}>
              {activeFilterCount > 0 && (
                <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
                  <AppText style={[styles.resetText, { color: primaryColor }]}>
                    {t("buyerDashboard.resetFilters", { defaultValue: "Reset" })}
                  </AppText>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Category Filter Section */}
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>
                {t("postProduct.cropType", { defaultValue: "Crop Category" })}
              </AppText>
              <View style={styles.pillContainer}>
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  const displayCat = getLocalizedCropName(cat, i18n.language || "en", t);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.pill,
                        active && { backgroundColor: primaryColor, borderColor: primaryColor },
                      ]}
                      onPress={() => onSelectCategory(cat)}
                      activeOpacity={0.8}
                    >
                      <AppText
                        style={[
                          styles.pillText,
                          active && styles.activePillText,
                        ]}
                      >
                        {displayCat}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Region Filter Section */}
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>
                {t("browse.filterRegion", { defaultValue: "Sourcing Region" })}
              </AppText>
              <View style={styles.pillContainer}>
                {REGIONS.map((reg) => {
                  const active = selectedRegion === reg;
                  const displayReg = reg === "All Regions" ? t("browse.allRegions", { defaultValue: "All Regions" }) : reg;
                  return (
                    <TouchableOpacity
                      key={reg}
                      style={[
                        styles.pill,
                        active && { backgroundColor: primaryColor, borderColor: primaryColor },
                      ]}
                      onPress={() => onSelectRegion(reg)}
                      activeOpacity={0.8}
                    >
                      <AppText
                        style={[
                          styles.pillText,
                          active && styles.activePillText,
                        ]}
                      >
                        {displayReg}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Sort By Section */}
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>
                {t("browse.sort", { defaultValue: "Sort By" })}
              </AppText>
              <View style={styles.sortList}>
                {SORT_OPTIONS.map((opt) => {
                  const active = sortBy === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.sortRow,
                        active && { backgroundColor: primaryColor + "12" },
                      ]}
                      onPress={() => onSelectSortBy(opt.id)}
                      activeOpacity={0.8}
                    >
                      <AppText
                        style={[
                          styles.sortLabel,
                          active && { color: primaryColor, fontWeight: "700" },
                        ]}
                      >
                        {opt.label}
                      </AppText>
                      {active && (
                        <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Action Button extending completely over bottom tab bar area */}
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 24) + 30 },
            ]}
          >
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: primaryColor }]}
              onPress={onClose}
              activeOpacity={0.88}
            >
              <AppText style={styles.applyBtnText}>
                {t("common.apply", { defaultValue: "Apply Filters" })}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    zIndex: 99999,
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingTop: 10,
    marginBottom: -30,
    zIndex: 100000,
  },
  dragHandleWrap: {
    alignItems: "center",
    paddingVertical: 6,
  },
  dragHandle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resetBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
  },
  activePillText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  sortList: {
    gap: 8,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  applyBtn: {
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
