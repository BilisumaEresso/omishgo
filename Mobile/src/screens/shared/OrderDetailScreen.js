// src/screens/shared/OrderDetailScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

const STATUS_CONFIG = {
  pending: { bg: "#FEF3C7", text: "#B45309", label: "PENDING CONFIRMATION" },
  confirmed: { bg: "#E0F2FE", text: "#0284C7", label: "CONFIRMED & PREPARING" },
  in_transit: { bg: "#EFF6FF", text: "#1D4ED8", label: "IN TRANSIT TO BUYER" },
  delivered: { bg: "#ECFDF5", text: "#059669", label: "DELIVERED & COMPLETED" },
  completed: { bg: "#ECFDF5", text: "#059669", label: "COMPLETED" },
  cancelled: { bg: "#FEF2F2", text: "#DC2626", label: "CANCELLED ORDER" },
};

export default function OrderDetailScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { order: initialOrder, role } = route.params || {};

  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  if (!order) {
    return (
      <View style={styles.centered}>
        <AppText style={{ color: textSecondary }}>Order details not found.</AppText>
      </View>
    );
  }

  const cropType = order.cropType || "Agricultural Harvest";
  const quantity = order.quantity ?? 1;
  const unit = order.unit || "q";
  const pricePerUnit = order.pricePerUnit ?? order.price ?? 0;
  const totalPrice = order.totalPrice ?? quantity * pricePerUnit;
  const rawStatus = order.status || "pending";

  const statusStyle = STATUS_CONFIG[rawStatus] || STATUS_CONFIG.pending;

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const buyerName = order.buyerId?.name || order.buyerName || "Wholesale Buyer";
  const buyerPhone = order.buyerId?.phone || order.buyerPhone || null;

  const farmerName = order.farmerId?.name || order.farmerName || "Verified Local Producer";
  const farmerPhone = order.farmerId?.phone || order.farmerPhone || null;
  const farmerId = order.farmerId?._id || order.farmerId;

  const handleCall = (phone) => {
    if (!phone) {
      Alert.alert("Phone Unavailable", "No contact phone number provided.");
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert("Error", "Could not open dialer"));
  };

  const handleMessagePartner = () => {
    const partnerId = role === "farmer" ? order.buyerId?._id || order.buyerId : farmerId;
    const partnerName = role === "farmer" ? buyerName : farmerName;
    if (!partnerId) {
      Alert.alert("Messaging Unavailable", "Cannot open chat for this partner.");
      return;
    }
    navigation.navigate("Chat", { userId: partnerId, userName: partnerName });
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === "cancelled") {
      Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
        { text: "No", style: "cancel" },
        { text: "Yes, Cancel", style: "destructive", onPress: () => doUpdate(newStatus) },
      ]);
    } else {
      doUpdate(newStatus);
    }
  };

  const doUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await api.patch(API_ENDPOINTS.orders.updateStatus(order._id), {
        status: newStatus,
      });
      const updated = res.data?.data?.order;
      if (updated) setOrder(updated);
      Alert.alert("Status Updated", `Order status changed to ${newStatus.toUpperCase()}`);
    } catch (err) {
      Alert.alert("Update Error", err?.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Order Specification" showBack={true} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Pill Card */}
        <View style={[styles.statusBanner, { backgroundColor: statusStyle.bg }]}>
          <Ionicons name="information-circle" size={18} color={statusStyle.text} />
          <AppText style={[styles.statusBannerText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </AppText>
        </View>

        {/* Product Details Card */}
        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <AppText style={[styles.cardTitle, { color: textPrimary }]}>Harvest Order Details</AppText>

          <View style={styles.infoRow}>
            <AppText style={styles.infoLabel}>Crop Type</AppText>
            <AppText style={styles.infoVal}>{cropType}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.infoLabel}>Order Volume</AppText>
            <AppText style={styles.infoVal}>{quantity} {unit}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.infoLabel}>Price per Quintal</AppText>
            <AppText style={styles.infoVal}>ETB {Number(pricePerUnit).toLocaleString()}</AppText>
          </View>

          <View style={styles.totalRow}>
            <AppText style={styles.totalLabel}>Total Wholesale Amount</AppText>
            <AppText style={[styles.totalAmount, { color: primaryColor }]}>
              ETB {Number(totalPrice).toLocaleString()}
            </AppText>
          </View>
        </View>

        {/* Partner Info Card */}
        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <AppText style={[styles.cardTitle, { color: textPrimary }]}>
            {role === "farmer" ? "Buyer Contact" : "Producer Contact"}
          </AppText>

          <View style={styles.partnerRow}>
            <View style={[styles.partnerAvatar, { backgroundColor: primaryColor }]}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={styles.partnerName}>
                {role === "farmer" ? buyerName : farmerName}
              </AppText>
              <AppText style={styles.partnerRole}>
                {role === "farmer" ? "Registered Wholesale Buyer" : "Verified Farmer Producer"}
              </AppText>
            </View>
          </View>

          <View style={styles.contactActions}>
            <TouchableOpacity
              style={[styles.contactBtn, { borderColor: primaryColor }]}
              onPress={handleMessagePartner}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={primaryColor} />
              <AppText style={[styles.contactBtnText, { color: primaryColor }]}>Message Chat</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactBtn, { borderColor: "#64748B" }]}
              onPress={() => handleCall(role === "farmer" ? buyerPhone : farmerPhone)}
              activeOpacity={0.8}
            >
              <Ionicons name="call-outline" size={16} color="#64748B" />
              <AppText style={[styles.contactBtnText, { color: "#64748B" }]}>Call Contact</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Status Controls */}
        {role === "farmer" && rawStatus === "pending" && (
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: primaryColor }]}
            onPress={() => handleUpdateStatus("confirmed")}
            disabled={updating}
            activeOpacity={0.85}
          >
            <AppText style={styles.primaryActionText}>
              {updating ? "Updating..." : "Accept & Confirm Harvest Order"}
            </AppText>
          </TouchableOpacity>
        )}

        {role === "farmer" && rawStatus === "confirmed" && (
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: "#1D4ED8" }]}
            onPress={() => handleUpdateStatus("in_transit")}
            disabled={updating}
            activeOpacity={0.85}
          >
            <AppText style={styles.primaryActionText}>
              {updating ? "Updating..." : "Dispatch Shipment (In Transit)"}
            </AppText>
          </TouchableOpacity>
        )}

        {role === "farmer" && rawStatus === "in_transit" && (
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: "#059669" }]}
            onPress={() => handleUpdateStatus("delivered")}
            disabled={updating}
            activeOpacity={0.85}
          >
            <AppText style={styles.primaryActionText}>
              {updating ? "Updating..." : "Mark Order Delivered"}
            </AppText>
          </TouchableOpacity>
        )}

        {role === "buyer" && rawStatus === "pending" && (
          <TouchableOpacity
            style={styles.cancelActionBtn}
            onPress={() => handleUpdateStatus("cancelled")}
            disabled={updating}
            activeOpacity={0.85}
          >
            <AppText style={styles.cancelActionText}>Cancel Wholesale Order</AppText>
          </TouchableOpacity>
        )}

        {updating && (
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <ActivityIndicator size="small" color={primaryColor} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: "800",
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  infoVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: "900",
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  partnerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  partnerRole: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  contactActions: {
    flexDirection: "row",
    gap: 10,
  },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  primaryActionBtn: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  cancelActionBtn: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelActionText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});