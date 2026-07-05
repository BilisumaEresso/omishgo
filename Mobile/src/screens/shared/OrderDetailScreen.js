// src/screens/shared/OrderDetailScreen.js
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import AppButton from "../../components/common/AppButton";
import { useTheme } from "../../hooks/useTheme";

// ─── Status colour map ────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending: "#F57F17",
  Confirmed: "#1565C0",
  Completed: "#2E7D32",
  Cancelled: "#C62828",
};

export default function OrderDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { order, role } = route.params || {};

  if (!order) {
    return (
      <View style={styles.centered}>
        <AppText>Order not found</AppText>
      </View>
    );
  }

  // Extract safe values – handles both flat and nested object structures
  const cropType = order.cropType || "—";
  const quantity = order.quantity ?? 0;
  const unit = order.unit || "kg";
  const price = order.price ?? order.totalPrice ?? 0;
  const status = order.status || "Pending";
  const date = order.date || order.orderedDate || "—";

  const buyerName = order.buyer?.name || order.buyerName || "Unknown buyer";
  const buyerPhone = order.buyer?.phone || order.buyerPhone || null;

  const farmerName = order.farmer?.name || order.farmerName || "Unknown farmer";
  const farmerPhone = order.farmer?.phone || order.farmerPhone || null;
  const farmerId = order.farmer?._id || order.farmerId || "mock";

  const isActive = status !== "Completed" && status !== "Cancelled";

  // ── Color helpers ─────────────────────────────────────────────────────────
  const bannerColor =
    STATUS_COLORS[status] || theme.colors.primary || "#2E7D32";
  const primary = theme.colors.primary || "#2E7D32";
  const surface = theme.colors.surface || "#FFFFFF";
  const background = theme.colors.background || "#F9FBF9";
  const border = theme.colors.border || "#E0E0E0";
  const textPrimary = theme.colors.textPrimary || "#1A2E1A";
  const textSecondary = theme.colors.textSecondary || "#4A6741";
  const errorColor = theme.colors.error || "#C62828";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCall = (phone) => {
    if (!phone) {
      Alert.alert(
        "No phone number",
        "This user has not provided a phone number.",
      );
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Could not open dialler"),
    );
  };

  const handleMessageFarmer = () => {
    navigation.navigate("Chat", {
      userId: farmerId,
      userName: farmerName,
    });
  };

  const comingSoon = () =>
    Alert.alert("Coming soon", "This feature will be available soon.");

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* Header */}
      <AppHeader
        title="Order Details"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status banner */}
        <View style={[styles.statusBanner, { backgroundColor: bannerColor }]}>
          <AppText style={styles.statusText}>{status.toUpperCase()}</AppText>
        </View>

        {/* Product info card */}
        <View
          style={[
            styles.card,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
            Product Information
          </AppText>
          <InfoRow icon="leaf" label="Crop Type" value={cropType} />
          <InfoRow icon="cube" label="Quantity" value={`${quantity} ${unit}`} />
          <InfoRow icon="cash" label="Price" value={`${price} ETB`} />
          <InfoRow icon="calendar" label="Date" value={date} />
        </View>

        {/* Party info card */}
        <View
          style={[
            styles.card,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
            {role === "farmer" ? "Buyer Information" : "Farmer Information"}
          </AppText>
          {role === "farmer" ? (
            <>
              <InfoRow icon="person" label="Name" value={buyerName} />
              <View style={styles.partyRow}>
                <Ionicons name="call-outline" size={20} color={textSecondary} />
                <AppText style={[styles.partyLabel, { color: textSecondary }]}>
                  Phone
                </AppText>
                <AppText style={[styles.partyValue, { color: textPrimary }]}>
                  {buyerPhone || "Not provided"}
                </AppText>
                <TouchableOpacity
                  onPress={() => handleCall(buyerPhone)}
                  disabled={!buyerPhone}
                  style={[styles.callButton, { opacity: buyerPhone ? 1 : 0.4 }]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="call" size={18} color={primary} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <InfoRow icon="person" label="Name" value={farmerName} />
              <View style={styles.partyRow}>
                <Ionicons name="call-outline" size={20} color={textSecondary} />
                <AppText style={[styles.partyLabel, { color: textSecondary }]}>
                  Phone
                </AppText>
                <AppText style={[styles.partyValue, { color: textPrimary }]}>
                  {farmerPhone || "Not provided"}
                </AppText>
                <TouchableOpacity
                  onPress={() => handleCall(farmerPhone)}
                  disabled={!farmerPhone}
                  style={[
                    styles.callButton,
                    { opacity: farmerPhone ? 1 : 0.4 },
                  ]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="call" size={18} color={primary} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Action buttons (only for active orders) */}
        {isActive && (
          <View style={styles.actions}>
            {role === "farmer" ? (
              <>
                <AppButton
                  title="Mark as Confirmed"
                  variant="primary"
                  fullWidth
                  onPress={comingSoon}
                  style={styles.actionBtn}
                />
                <AppButton
                  title="Cancel Order"
                  variant="outline"
                  fullWidth
                  onPress={comingSoon}
                  style={styles.actionBtn}
                  textStyle={{ color: errorColor }}
                  borderColor={errorColor}
                />
              </>
            ) : (
              <>
                <AppButton
                  title="Message Farmer"
                  variant="primary"
                  fullWidth
                  onPress={handleMessageFarmer}
                  style={styles.actionBtn}
                />
                <AppButton
                  title="Cancel Order"
                  variant="outline"
                  fullWidth
                  onPress={comingSoon}
                  style={styles.actionBtn}
                  textStyle={{ color: errorColor }}
                  borderColor={errorColor}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Reusable Info Row ────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color="#666" style={styles.infoIcon} />
    <AppText style={styles.infoLabel}>{label}</AppText>
    <AppText style={styles.infoValue}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  statusBanner: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  card: {
    borderRadius: 12,
    margin: 16,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  partyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  partyLabel: {
    fontSize: 14,
    width: 60,
  },
  partyValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  callButton: {
    padding: 6,
    borderRadius: 20,
  },
  actions: {
    marginHorizontal: 16,
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {},
});
