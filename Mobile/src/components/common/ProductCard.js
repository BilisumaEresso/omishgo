// src/components/common/ProductCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppButton from "./AppButton";
import AppText from "./AppText";
import { getLocalizedCropName } from "../../constants/crops";
import { getLocalizedUnitName } from "../../constants/units";

import { getLocalizedWeredaName, getLocalizedZoneName, getLocalizedRegionName } from "../../constants/locations";
import { formatNumber } from "../../utils/formatNumber";

export const ProductCard = ({
  product,
  onView,
  theme,
  isSaved,
  onToggleSave,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const farmer = product.farmerId || {};
  const loc = product.location || {};

  const primary = theme?.colors?.primary || "#1565C0";
  const primaryCont = theme?.colors?.primaryContainer || "#E3F2FD";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const border = theme?.colors?.border || "#E2E8F0";

  const rawUnit = product.unit || "q";
  const localizedUnit = getLocalizedUnitName(rawUnit, currentLang);
  const rawCrop = product.cropType || product.name || t("common.defaultHarvestCrop", { defaultValue: "Harvest Crop" });
  const localizedCrop = getLocalizedCropName(rawCrop, currentLang);

  const localizedWereda = getLocalizedWeredaName(loc.wereda, currentLang);
  const localizedZone = getLocalizedZoneName(loc.zone, currentLang);
  const localizedRegion = getLocalizedRegionName(loc.region, currentLang);

  const rawId = product.customId || product._id || product.id || "";
  const shortId = rawId.startsWith("PRD-")
    ? rawId
    : rawId
    ? `PRD-${rawId.substring(rawId.length - 6).toUpperCase()}`
    : "PRD";

  const formattedPrice = product.price
    ? `${formatNumber(product.price)} ETB / ${localizedUnit}`
    : t("farmerProducts.priceUnavailable", { defaultValue: "Price on Request" });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: surface,
          borderColor: border,
        },
      ]}
    >
      {/* Top Header: Crop Name & Bookmark Heart */}
      <View style={styles.cardHeader}>
        <View style={styles.cropTitleWrap}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <AppText style={[styles.cropTitle, { color: textPrimary }]}>
              {localizedCrop}
            </AppText>
            <AppText style={styles.refText}>#{shortId}</AppText>
          </View>
          <View style={styles.verifiedRow}>
            <Ionicons name="checkmark-circle" size={14} color={primary} />
            <AppText style={[styles.verifiedText, { color: primary }]}>
              {t("buyerProfile.statusVerified", { defaultValue: "Verified Producer" })}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onToggleSave(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.bookmarkBtn}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={primary}
          />
        </TouchableOpacity>
      </View>

      {/* Pricing & Stock Row */}
      <View style={styles.pricingRow}>
        <View>
          <AppText style={styles.priceLabel}>{t("browse.avgPrice", { defaultValue: "Wholesale Price" })}</AppText>
          <AppText style={[styles.priceValue, { color: primary }]}>
            {formattedPrice}
          </AppText>
        </View>

        <View style={[styles.stockBadge, { backgroundColor: primaryCont }]}>
          <AppText style={[styles.stockText, { color: primary }]}>
            {product.quantity
              ? t("productCard.inStockText", { qty: product.quantity, unit: localizedUnit, defaultValue: "{{qty}} {{unit}} in stock" })
              : t("statuses.active", { defaultValue: "Available" })}
          </AppText>
        </View>
      </View>

      {/* Location & Farmer Details */}
      <View style={styles.infoMetaRow}>
        {loc.wereda || loc.zone || loc.region ? (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={textSecondary} />
            <AppText style={[styles.metaText, { color: textSecondary }]} numberOfLines={1}>
              {[localizedWereda, localizedZone, localizedRegion].filter(Boolean).join(", ") || t("common.unknownLocation", { defaultValue: "Location Not Provided" })}
            </AppText>
          </View>
        ) : null}

        {farmer.name ? (
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color={textSecondary} />
            <AppText style={[styles.metaText, { color: textSecondary }]}>
              {farmer.name}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Action Button */}
      <AppButton
        title={t("buyerSaved.viewListing", { defaultValue: "View Produce Details" })}
        variant="outline"
        onPress={() => onView(product)}
        style={styles.viewBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cropTitleWrap: {
    flex: 1,
  },
  cropTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookmarkBtn: {
    padding: 2,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  viewBtn: {
    borderRadius: 12,
  },
  refText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    overflow: "hidden",
  },
});
