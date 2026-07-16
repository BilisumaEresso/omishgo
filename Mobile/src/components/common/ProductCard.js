import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppButton from "./AppButton";
import AppText from "./AppText";

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontWeight: "700" },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  farmerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  viewBtn: {
    marginTop: 12,
    alignSelf: "stretch",
    borderRadius: 10,
    paddingVertical: 10,
  },
});

export const ProductCard = ({
  product,
  onView,
  theme,
  isSaved,
  onToggleSave,
}) => {
  const { t } = useTranslation();
  const farmer = product.farmerId || {};
  const loc = product.location || {};

  // Extract theme colors
  const primary = theme?.colors?.primary || "#1565C0";
  const primaryCont = theme?.colors?.primaryContainer || "#E3F2FD";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const border = theme?.colors?.border || "#D0DEF5";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: surface,
          borderColor: border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
    >
      {/* Top row: crop type + bookmark + price */}
      <View style={styles.cardHeader}>
        <AppText variant="headingSm" style={{ color: textPrimary, flex: 1 }}>
          {product.cropType}
        </AppText>
        <TouchableOpacity
          onPress={() => onToggleSave(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginRight: 6 }}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={primary}
          />
        </TouchableOpacity>
        <AppText variant="headingSm" style={[styles.price, { color: primary }]}>
          {t("productCard.priceFormat", {
            price: product.price,
            unit: product.unit || "kg",
          })}
        </AppText>
      </View>

      {/* Quantity + category badge */}
      <View style={styles.quantityRow}>
        <AppText variant="bodyMd" style={{ color: textSecondary }}>
          {product.quantity} {product.unit || "kg"}
        </AppText>
        {product.category || product.cropType ? (
          <View
            style={[styles.categoryBadge, { backgroundColor: primaryCont }]}
          >
            <AppText
              style={{ color: primary, fontSize: 12, fontWeight: "600" }}
            >
              {product.category || product.cropType}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Location – icon replaces emoji */}
      {loc.region || loc.zone ? (
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={textSecondary}
            style={{ marginRight: 4 }}
          />
          <AppText variant="bodySm" style={{ color: textSecondary }}>
            {[loc.region, loc.zone].filter(Boolean).join(", ")}
          </AppText>
        </View>
      ) : null}

      {/* Farmer name – icon replaces emoji */}
      {farmer.name ? (
        <View style={styles.farmerRow}>
          <Ionicons
            name="person-outline"
            size={14}
            color={textSecondary}
            style={{ marginRight: 4 }}
          />
          <AppText variant="bodySm" style={{ color: textSecondary }}>
            {farmer.name}
          </AppText>
        </View>
      ) : null}

      {/* View button – full width */}
      <AppButton
        title={t("productCard.view")}
        variant="outline"
        onPress={() => onView(product)}
        style={styles.viewBtn}
      />
    </View>
  );
};
