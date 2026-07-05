import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function FeaturedProductsList({ products, onOrder }) {
  const { theme } = useTheme();
  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AppText
          variant="bodyMd"
          style={{ color: theme?.colors?.textSecondary, textAlign: "center" }}
        >
          No products match your search.
        </AppText>
      </View>
    );
  }
  return (
    <View style={styles.section}>
      {products.map((product) => (
        <AppCard key={product.id} style={styles.productCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            {product.isPremium && (
              <View
                style={[
                  styles.premiumBadge,
                  { backgroundColor: theme?.colors?.primary },
                ]}
              >
                <AppText variant="caption" style={{ color: "#FFF" }}>
                  Premium
                </AppText>
              </View>
            )}
            <TouchableOpacity style={styles.favButton}>
              <Ionicons
                name="heart-outline"
                size={20}
                color={theme?.colors?.error}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <View>
              <AppText
                variant="bodyMd"
                style={{ fontWeight: "bold", color: theme?.colors?.textPrimary }}
              >
                {product.name}
              </AppText>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={theme?.colors?.primary}
                />
                <AppText
                  variant="caption"
                  style={{ color: theme?.colors?.textSecondary }}
                >
                  {product.location}
                </AppText>
              </View>
            </View>
            <AppText
              variant="headingSm"
              style={{ color: theme?.colors?.primary }}
            >
              {product.price.toLocaleString()} ETB
            </AppText>
          </View>
          <View style={styles.footerRow}>
            <View style={styles.farmerRow}>
              <Image
                source={{ uri: product.farmerAvatar }}
                style={styles.farmerAvatar}
              />
              <AppText
                variant="caption"
                style={{ color: theme?.colors?.textPrimary }}
              >
                {product.farmerName}
              </AppText>
            </View>
            <TouchableOpacity
              style={[
                styles.orderButton,
                { backgroundColor: theme?.colors?.primary },
              ]}
              onPress={() => onOrder(product)}
            >
              <Ionicons name="cart-outline" size={16} color="#FFF" />
              <AppText
                variant="caption"
                style={{ color: "#FFF", marginLeft: 4 }}
              >
                Order
              </AppText>
            </TouchableOpacity>
          </View>
        </AppCard>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  productCard: { marginBottom: 12, padding: 0, overflow: "hidden" },
  imageContainer: { height: 160, position: "relative" },
  productImage: { width: "100%", height: "100%" },
  premiumBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  favButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    padding: 12,
  },
  farmerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  farmerAvatar: { width: 28, height: 28, borderRadius: 14 },
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  emptyContainer: { padding: 20, alignItems: "center", marginBottom: 24 },
});
