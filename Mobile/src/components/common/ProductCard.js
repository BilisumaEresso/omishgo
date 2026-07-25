// src/components/common/ProductCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppButton from "./AppButton";
import AppText from "./AppText";

export const ProductCard = ({
  product,
  onView,
  theme,
  isSaved,
  onToggleSave,
}) => {
  const farmer = product.farmerId || {};
  const loc = product.location || {};

  const primary = theme?.colors?.primary || "#1565C0";
  const primaryCont = theme?.colors?.primaryContainer || "#E3F2FD";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const border = theme?.colors?.border || "#E2E8F0";

  const unit = product.unit || "q";
  const formattedPrice = product.price
    ? `ETB ${Number(product.price).toLocaleString()} / ${unit}`
    : "Price on Request";

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
          <AppText style={[styles.cropTitle, { color: textPrimary }]}>
            {product.cropType || product.name || "Agricultural Produce"}
          </AppText>
          <View style={styles.verifiedRow}>
            <Ionicons name="checkmark-circle" size={14} color={primary} />
            <AppText style={[styles.verifiedText, { color: primary }]}>
              Verified Producer
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
          <AppText style={styles.priceLabel}>Wholesale Price</AppText>
          <AppText style={[styles.priceValue, { color: primary }]}>
            {formattedPrice}
          </AppText>
        </View>

        <View style={[styles.stockBadge, { backgroundColor: primaryCont }]}>
          <AppText style={[styles.stockText, { color: primary }]}>
            {product.quantity ? `${product.quantity} ${unit} in stock` : "Available"}
          </AppText>
        </View>
      </View>

      {/* Location & Farmer Details */}
      <View style={styles.infoMetaRow}>
        {loc.region || loc.zone ? (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={textSecondary} />
            <AppText style={[styles.metaText, { color: textSecondary }]}>
              {[loc.region, loc.zone].filter(Boolean).join(", ") || "Ethiopia"}
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
        title="View Produce Details"
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
});
