// Mobile/src/screens/buyer/ListingDetailScreen.js
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import { useTheme } from "../../hooks/useTheme";

// ─── Helper: relative time ────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ iconName, label, value, theme }) => (
  <View
    style={[
      styles.infoRow,
      { borderBottomColor: theme?.colors?.border || "#f0f0f0" },
    ]}
  >
    <Ionicons
      name={iconName}
      size={20}
      color={theme?.colors?.primary || "#2e7d32"}
      style={{ marginTop: 2 }}
    />
    <View style={styles.infoContent}>
      <AppText
        variant="label"
        style={{ color: theme?.colors?.textSecondary || "#888" }}
      >
        {label}
      </AppText>
      <AppText
        variant="bodyMd"
        style={{ color: theme?.colors?.textPrimary || "#333" }}
      >
        {value || "—"}
      </AppText>
    </View>
  </View>
);

export default function ListingDetailScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { product } = route.params || {};
  const [isSaved, setIsSaved] = useState(false);

  if (!product) {
    return (
      <View style={styles.fallbackContainer}>
        <AppText variant="headingSm">
          {t("browse.notFound") || "Listing not found"}
        </AppText>
        <AppButton
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  const farmer = product.farmerId || {};
  const loc = product.location || {};
  const farmerName =
    farmer.name || t("browse.unknownFarmer") || "Unknown Farmer";
  const farmerPhone = farmer.phone || null;
  const unit = product.unit || "kg";

  // Mock market insights
  const avgMarketPrice = Math.round(
    product.price * (0.85 + Math.random() * 0.3),
  );
  const demandLevel = Math.random() > 0.6 ? "High" : "Medium";
  const listedTime = timeAgo(product.createdAt || new Date().toISOString());

  const handleMessageFarmer = () => {
    if (!farmer._id) {
      Alert.alert(
        t("common.error") || "Error",
        "Farmer information unavailable",
      );
      return;
    }
    navigation.navigate("Chat", { userId: farmer._id, userName: farmerName });
  };

  const handleCallFarmer = () => {
    if (!farmerPhone) {
      Alert.alert(
        t("browse.noPhone") || "No phone number",
        t("browse.noPhoneDesc") ||
          "This farmer has not provided a phone number.",
      );
      return;
    }
    Linking.openURL(`tel:${farmerPhone}`).catch(() =>
      Alert.alert(t("common.error") || "Error", "Could not open the dialler"),
    );
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme?.colors?.surface || "#fff",
            borderBottomColor: theme?.colors?.border || "#eee",
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 24) + 12
                : 54,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme?.colors?.primary || "#2e7d32"}
          />
        </TouchableOpacity>
        <AppText
          variant="headingMd"
          numberOfLines={1}
          style={{
            flex: 1,
            textAlign: "center",
            color: theme?.colors?.textPrimary,
            marginHorizontal: 10,
          }}
        >
          {product.cropType}
        </AppText>
        <TouchableOpacity
          onPress={() => setIsSaved(!isSaved)}
          style={styles.saveBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color={theme?.colors?.primary || "#2e7d32"}
          />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Crop title & status */}
        <AppText
          variant="headingLg"
          style={[styles.cropTitle, { color: theme?.colors?.textPrimary }]}
        >
          {product.cropType}
        </AppText>
        <View
          style={[
            styles.badge,
            { backgroundColor: statusColor(product.status) },
          ]}
        >
          <AppText variant="label" style={{ color: "#fff" }}>
            {product.status?.toUpperCase() || "ACTIVE"}
          </AppText>
        </View>

        {/* Price banner */}
        <View
          style={[
            styles.priceBanner,
            { backgroundColor: theme?.colors?.primary || "#2e7d32" },
          ]}
        >
          <AppText
            variant="headingMd"
            style={{ color: "#fff", fontWeight: "700" }}
          >
            {product.price} ETB
          </AppText>
          <AppText style={{ color: "#fff", fontSize: 14, marginTop: 2 }}>
            per {unit} · {product.quantity} {unit} available
          </AppText>
        </View>

        {/* Market insights card */}
        <View
          style={[
            styles.insightsCard,
            {
              backgroundColor: theme?.colors?.surface,
              borderColor: theme?.colors?.border,
            },
          ]}
        >
          <AppText
            variant="headingSm"
            style={{ color: theme?.colors?.textPrimary, marginBottom: 8 }}
          >
            📊 Market Insights
          </AppText>
          <View style={styles.insightsRow}>
            <View style={styles.insightItem}>
              <AppText
                variant="label"
                style={{ color: theme?.colors?.textSecondary }}
              >
                Avg Price
              </AppText>
              <AppText
                style={{ color: theme?.colors?.primary, fontWeight: "700" }}
              >
                {avgMarketPrice} ETB/{unit}
              </AppText>
            </View>
            <View style={styles.insightItem}>
              <AppText
                variant="label"
                style={{ color: theme?.colors?.textSecondary }}
              >
                Demand
              </AppText>
              <AppText
                style={{ color: demandColor(demandLevel), fontWeight: "700" }}
              >
                {demandLevel}
              </AppText>
            </View>
            <View style={styles.insightItem}>
              <AppText
                variant="label"
                style={{ color: theme?.colors?.textSecondary }}
              >
                Listed
              </AppText>
              <AppText style={{ color: theme?.colors?.textPrimary }}>
                {listedTime}
              </AppText>
            </View>
          </View>
        </View>

        {/* Product details */}
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: theme?.colors?.surface,
              borderColor: theme?.colors?.border,
            },
          ]}
        >
          <InfoRow
            iconName="leaf-outline"
            label={t("product.cropTypeLabel") || "Crop Type"}
            value={product.cropType}
            theme={theme}
          />
          <InfoRow
            iconName="scale-outline"
            label={t("product.quantityLabel") || "Quantity"}
            value={`${product.quantity} ${unit}`}
            theme={theme}
          />
          <InfoRow
            iconName="cash-outline"
            label={t("product.priceLabel") || "Price"}
            value={`${product.price} ETB / ${unit}`}
            theme={theme}
          />
          <InfoRow
            iconName="location-outline"
            label={t("auth.regionLabel") || "Region"}
            value={loc.region}
            theme={theme}
          />
          <InfoRow
            iconName="map-outline"
            label={t("auth.zoneLabel") || "Zone"}
            value={loc.zone}
            theme={theme}
          />
          {product.description ? (
            <InfoRow
              iconName="document-text-outline"
              label={t("product.descLabel") || "Description"}
              value={product.description}
              theme={theme}
            />
          ) : null}
        </View>

        {/* Farmer info */}
        <View
          style={[
            styles.farmerCard,
            {
              backgroundColor: theme?.colors?.surface,
              borderColor: theme?.colors?.border,
            },
          ]}
        >
          <AppText
            variant="headingSm"
            style={[styles.sectionTitle, { color: theme?.colors?.textPrimary }]}
          >
            {t("browse.farmerTitle") || "Farmer"}
          </AppText>
          <InfoRow
            iconName="person-outline"
            label={t("auth.nameLabel") || "Name"}
            value={farmerName}
            theme={theme}
          />
          <InfoRow
            iconName="call-outline"
            label={t("auth.phoneLabel") || "Phone"}
            value={farmerPhone || t("browse.noPhone") || "Not provided"}
            theme={theme}
          />
        </View>

        {/* Actions */}
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
      </ScrollView>
    </View>
  );
}

const statusColor = (status) => {
  switch (status) {
    case "sold":
      return "#c62828";
    case "draft":
      return "#888";
    default:
      return "#2e7d32";
  }
};

const demandColor = (level) => {
  switch (level) {
    case "High":
      return "#2e7d32";
    case "Medium":
      return "#f57f17";
    default:
      return "#666";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
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
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  insightsCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  insightsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  insightItem: {
    alignItems: "center",
    flex: 1,
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
  infoContent: { flex: 1, gap: 2 },
  actions: { gap: 10 },
  actionBtn: {},
});
