// Mobile/src/screens/buyer/ListingDetailScreen.js
import React from "react";
import { View, StyleSheet, ScrollView, Linking, Alert, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import { useTheme } from "../../hooks/useTheme";

// ─── Info Row helper ──────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, theme }) => (
  <View style={[styles.infoRow, { borderBottomColor: theme.colors.border || "#f0f0f0" }]}>
    <AppText style={styles.infoIcon}>{icon}</AppText>
    <View style={styles.infoContent}>
      <AppText variant="label" style={{ color: theme.colors.textSecondary || "#888" }}>{label}</AppText>
      <AppText variant="bodyMd" style={{ color: theme.colors.textPrimary || "#333" }}>{value || "—"}</AppText>
    </View>
  </View>
);

export default function ListingDetailScreen({ route, navigation }) {
  const { t }     = useTranslation();
  const { theme } = useTheme();

  // Product is passed via navigation params from BrowseScreen
  const { product } = route.params || {};

  if (!product) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <AppText variant="headingSm">{t("browse.notFound") || "Listing not found"}</AppText>
          <AppButton title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </View>
      </ScreenWrapper>
    );
  }

  const farmer     = product.farmerId || {};         // populated: { name, phone, location }
  const loc        = product.location  || {};
  const farmerName = farmer.name  || t("browse.unknownFarmer") || "Unknown Farmer";
  const farmerPhone = farmer.phone || null;

  const handleMessageFarmer = () => {
    if (!farmer._id) {
      Alert.alert(t("common.error") || "Error", "Farmer information unavailable");
      return;
    }
    navigation.navigate("Chat", {
      userId:   farmer._id,
      userName: farmerName,
    });
  };

  const handleCallFarmer = () => {
    if (!farmerPhone) {
      Alert.alert(
        t("browse.noPhone") || "No phone number",
        t("browse.noPhoneDesc") || "This farmer has not provided a phone number."
      );
      return;
    }
    Linking.openURL(`tel:${farmerPhone}`).catch(() =>
      Alert.alert(t("common.error") || "Error", "Could not open the dialler")
    );
  };

  return (
    <ScreenWrapper scrollable padding>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <AppText variant="headingMd">←  {t("browse.title") || "Browse"}</AppText>
      </TouchableOpacity>

      {/* Crop type headline */}
      <AppText variant="headingLg" style={[styles.cropTitle, { color: theme.colors.textPrimary }]}>
        {product.cropType}
      </AppText>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: statusColor(product.status) }]}>
        <AppText variant="label" style={{ color: "#fff" }}>
          {product.status?.toUpperCase() || "ACTIVE"}
        </AppText>
      </View>

      {/* Price banner */}
      <View style={[styles.priceBanner, { backgroundColor: theme.colors.primary || "#2e7d32" }]}>
        <AppText variant="headingMd" style={{ color: "#fff" }}>
          {product.price} ETB  ·  {product.quantity} {product.unit || "kg"}
        </AppText>
      </View>

      {/* Details */}
      <View style={[styles.detailCard, { backgroundColor: theme.colors.surface || "#fff", borderColor: theme.colors.border || "#eee" }]}>
        <InfoRow icon="🌾" label={t("product.cropTypeLabel") || "Crop Type"} value={product.cropType} theme={theme} />
        <InfoRow icon="⚖️" label={t("product.quantityLabel") || "Quantity"} value={`${product.quantity} ${product.unit || "kg"}`} theme={theme} />
        <InfoRow icon="💰" label={t("product.priceLabel") || "Price"} value={`${product.price} ETB`} theme={theme} />
        <InfoRow icon="📍" label={t("auth.regionLabel") || "Region"} value={loc.region} theme={theme} />
        <InfoRow icon="🗺️" label={t("auth.zoneLabel")   || "Zone"}   value={loc.zone}   theme={theme} />
        {product.description ? (
          <InfoRow icon="📝" label={t("product.descLabel") || "Description"} value={product.description} theme={theme} />
        ) : null}
      </View>

      {/* Farmer section */}
      <View style={[styles.farmerCard, { backgroundColor: theme.colors.surface || "#fff", borderColor: theme.colors.border || "#eee" }]}>
        <AppText variant="headingSm" style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t("browse.farmerTitle") || "Farmer"}
        </AppText>
        <InfoRow icon="👤" label={t("auth.nameLabel") || "Name"}  value={farmerName} theme={theme} />
        <InfoRow icon="📞" label={t("auth.phoneLabel") || "Phone"} value={farmerPhone || t("browse.noPhone") || "Not provided"} theme={theme} />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <AppButton
          title={t("browse.messageBtn") || "Message Farmer"}
          variant="primary"
          fullWidth
          onPress={handleMessageFarmer}
          style={styles.actionBtn}
        />
        <AppButton
          title={`📞  ${t("browse.callBtn") || "Call Farmer"}`}
          variant="outline"
          fullWidth
          onPress={handleCallFarmer}
          style={styles.actionBtn}
          disabled={!farmerPhone}
        />
      </View>
    </ScreenWrapper>
  );
}

const statusColor = (status) => {
  switch (status) {
    case "sold":  return "#c62828";
    case "draft": return "#888";
    default:      return "#2e7d32"; // active
  }
};

const styles = StyleSheet.create({
  backBtn: { marginBottom: 16 },
  cropTitle: { marginBottom: 6 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  priceBanner: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
  },
  farmerCard: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
  },
  sectionTitle: { padding: 16, paddingBottom: 0 },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  infoIcon: { fontSize: 18, marginTop: 2 },
  infoContent: { flex: 1, gap: 2 },
  actions: { gap: 10, paddingBottom: 32 },
  actionBtn: {},
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
});
