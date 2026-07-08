export const ProductCard = ({ product, onView, theme, isSaved, onToggleSave }) => {
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
          onPress={() => onToggleSave(product._id)}
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
          {product.price} ETB / {product.unit || "kg"}
        </AppText>
      </View>

      {/* Quantity + category badge */}
      <View style={styles.quantityRow}>
        <AppText variant="bodyMd" style={{ color: textSecondary }}>
          {product.quantity} {product.unit || "kg"}
        </AppText>
        {product.category ? (
          <View
            style={[styles.categoryBadge, { backgroundColor: primaryCont }]}
          >
            <AppText
              style={{ color: primary, fontSize: 12, fontWeight: "600" }}
            >
              {product.category}
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
        title="View"
        variant="outline"
        onPress={() => onView(product)}
        style={styles.viewBtn}
      />
    </View>
  );
};