import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppButton from "./AppButton";
import AppText from "./AppText";
import { getLocalizedCropName, getLocalizedCropDisplayName, getCropFallbackImage } from "../../constants/crops";
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
  const localizedUnit = getLocalizedUnitName(rawUnit, currentLang, t);
  const rawCrop = product.cropType || product.name || t("common.defaultHarvestCrop", { defaultValue: "Harvest Crop" });
  const localizedCrop = getLocalizedCropName(rawCrop, currentLang, t);

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

  const rawPhotoUrl = Array.isArray(product.photos) && product.photos.length > 0 ? product.photos[0] : null;
  const photoUrl = rawPhotoUrl || getCropFallbackImage(product.cropType);

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
      {/* Top Header: Crop Photo + Crop Name & Bookmark Heart */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeftRow}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.thumbImage} resizeMode="cover" />
          ) : (
            <View style={[styles.thumbFallback, { backgroundColor: primaryCont }]}>
              <Ionicons name="leaf" size={26} color={primary} />
            </View>
          )}
          <View style={styles.cropTitleWrap}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <AppText style={[styles.cropTitle, { color: textPrimary }]}>
                {localizedCrop}
              </AppText>
              <AppText style={styles.refText}>#{shortId}</AppText>
            </View>
            <View style={styles.subMetaRow}>
              {product.variety ? (
                <View style={[styles.varietyBadge, { backgroundColor: primary + "15" }]}>
                  <Ionicons name="pricetag" size={10} color={primary} />
                  <AppText style={[styles.varietyBadgeText, { color: primary }]}>
                    {t(`varieties.${product.variety}`, { defaultValue: product.variety })}
                  </AppText>
                </View>
              ) : null}
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={13} color={primary} />
                <AppText style={[styles.verifiedText, { color: primary }]}>
                  {t("buyerProfile.statusVerified", { defaultValue: "Verified Producer" })}
                </AppText>
              </View>
            </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeftRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thumbImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },
  thumbFallback: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
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
    padding: 4,
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
    paddingVertical: 6,
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
    paddingVertical: 2,
    borderRadius: 6,
  },
  subMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
    flexWrap: "wrap",
  },
  varietyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  varietyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
