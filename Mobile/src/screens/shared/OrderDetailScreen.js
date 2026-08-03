// src/screens/shared/OrderDetailScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

import OrderProgressMap from "../../components/orders/OrderProgressMap";
import { getCropFallbackImage, getLocalizedCropName, getLocalizedCropDisplayName } from "../../constants/crops";
import { getLocalizedUnitName } from "../../constants/units";
import { formatNumber } from "../../utils/formatNumber";

const STATUS_CONFIG = {
  pending:   { bg: "#FEF3C7", text: "#B45309", icon: "time-outline",            labelKey: "buyerOrders.statusPending" },
  confirmed: { bg: "#E0F2FE", text: "#0284C7", icon: "checkmark-circle-outline", labelKey: "buyerOrders.statusConfirmed" },
  in_transit:{ bg: "#EFF6FF", text: "#1D4ED8", icon: "car-outline",             labelKey: "buyerOrders.statusInTransit" },
  delivered: { bg: "#ECFDF5", text: "#059669", icon: "bag-check-outline",        labelKey: "buyerOrders.statusDelivered" },
  completed: { bg: "#ECFDF5", text: "#059669", icon: "checkmark-done-outline",   labelKey: "statuses.completed" },
  cancelled: { bg: "#FEF2F2", text: "#DC2626", icon: "close-circle-outline",     labelKey: "buyerOrders.statusCancelled" },
};

export default function OrderDetailScreen({ route, navigation }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
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
      <DashboardLayout role="buyer" title={t("orderDetail.screenTitle", { defaultValue: "Order Detail" })} showBack onBackPress={() => navigation.goBack()}>
        <View style={styles.centered}>
          <Ionicons name="receipt-outline" size={48} color="#94A3B8" />
          <AppText style={{ color: textSecondary, marginTop: 12, fontSize: 15 }}>
            {t("orderDetail.orderNotFound", { defaultValue: "Order details not found." })}
          </AppText>
        </View>
      </DashboardLayout>
    );
  }

  const cropType = order.cropType || t("orders.defaultCropType", { defaultValue: "Agricultural Harvest" });
  const quantity = order.quantity ?? 1;
  const unit = order.unit || "q";
  const pricePerUnit = order.pricePerUnit ?? order.price ?? 0;
  const totalPrice = order.totalPrice ?? quantity * pricePerUnit;
  const rawStatus = order.status || "pending";
  const statusStyle = STATUS_CONFIG[rawStatus] || STATUS_CONFIG.pending;
  const statusLabel = t(statusStyle.labelKey, { defaultValue: rawStatus.toUpperCase() });

  const rawPhotoUrl = order.productId?.photos?.[0] || order.photos?.[0];
  const photoUrl = rawPhotoUrl || getCropFallbackImage(order.cropType || order.productId?.cropType);

  const orderIdRaw = order._id || order.id || "";
  const shortId = orderIdRaw ? orderIdRaw.substring(orderIdRaw.length - 6).toUpperCase() : "ORD";
  const orderIdDisplay = `#ORD-${shortId}`;

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : t("common.recently", { defaultValue: "Recently" });

  const buyerName = order.buyerId?.name || order.buyerName || t("orders.wholesaleBuyer", { defaultValue: "Wholesale Buyer" });
  const buyerPhone = order.buyerId?.phone || order.buyerPhone || null;
  const farmerName = order.farmerId?.name || order.farmerName || t("profile.verifiedProducer", { defaultValue: "Verified Local Producer" });
  const farmerPhone = order.farmerId?.phone || order.farmerPhone || null;
  const farmerId = order.farmerId?._id || order.farmerId;

  const handleCall = (phone) => {
    if (!phone) {
      Alert.alert(t("chat.phoneUnavailable", { defaultValue: "Phone Unavailable" }), t("chat.noPhoneProvided", { defaultValue: "No contact phone number provided." }));
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert(t("errorMessage.title", { defaultValue: "Error" }), t("chat.couldNotDial", { defaultValue: "Could not open dialer" })));
  };

  const handleMessagePartner = () => {
    const partnerId = role === "farmer" ? order.buyerId?._id || order.buyerId : farmerId;
    const partnerName = role === "farmer" ? buyerName : farmerName;
    if (!partnerId) {
      Alert.alert(t("chat.messagingUnavailable", { defaultValue: "Messaging Unavailable" }), t("chat.cannotOpenChat", { defaultValue: "Cannot open chat for this partner." }));
      return;
    }
    navigation.navigate("Chat", { userId: partnerId, userName: partnerName });
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === "cancelled") {
      Alert.alert(t("orderDetail.cancelOrderTitle", { defaultValue: "Cancel Order" }), t("orderDetail.cancelOrderConfirm", { defaultValue: "Are you sure you want to cancel this order?" }), [
        { text: t("buyerSaved.cancel", { defaultValue: "No" }), style: "cancel" },
        { text: t("common.yesCancel", { defaultValue: "Yes, Cancel" }), style: "destructive", onPress: () => doUpdate(newStatus) },
      ]);
    } else {
      doUpdate(newStatus);
    }
  };

  const doUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await api.patch(API_ENDPOINTS.orders.updateStatus(order._id), { status: newStatus });
      const updated = res.data?.data?.order;
      if (updated) setOrder(updated);
      Alert.alert(
        t("orderDetail.statusUpdated", { defaultValue: "Status Updated" }),
        t("orderDetail.statusChangedTo", { status: newStatus.toUpperCase(), defaultValue: "Order status changed to {{status}}" })
      );
    } catch (err) {
      Alert.alert(t("errorMessage.title", { defaultValue: "Update Error" }), err?.response?.data?.message || t("orderDetail.failedUpdate", { defaultValue: "Failed to update order status." }));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout
      role={role || "buyer"}
      title={t("orderDetail.screenTitle", { defaultValue: "Order Specification" })}
      showBack
      onBackPress={() => navigation.goBack()}
    >
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: statusStyle.bg }]}>
        <Ionicons name={statusStyle.icon} size={18} color={statusStyle.text} />
        <AppText style={[styles.statusBannerText, { color: statusStyle.text }]}>
          {statusLabel}
        </AppText>
      </View>

      {/* Order Meta Row: ID Pill + Date */}
      <View style={styles.orderMetaRow}>
        <View style={[styles.orderIdBadge, { backgroundColor: primaryColor + "15", borderColor: primaryColor + "35" }]}>
          <Ionicons name="receipt" size={13} color={primaryColor} />
          <AppText style={[styles.orderIdBadgeText, { color: primaryColor }]}>{orderIdDisplay}</AppText>
        </View>
        <AppText style={styles.orderDate}>{t("orderDetail.placedOn", { defaultValue: "Placed on" })} {date}</AppText>
      </View>

      {/* Order Progress Map */}
      <OrderProgressMap order={order} />

      {/* Product Details Card */}
      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        {photoUrl ? (
          <View style={styles.orderPhotoContainer}>
            <Image source={{ uri: photoUrl }} style={styles.orderHeroPhoto} resizeMode="cover" />
          </View>
        ) : null}
        <AppText style={[styles.cardTitle, { color: textPrimary }]}>
          {t("orderDetail.productInfo", { defaultValue: "Harvest Order Details" })}
        </AppText>
        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>{t("orderDetail.orderId", { defaultValue: "Order Ref ID" })}</AppText>
          <View style={styles.orderIdInfoWrap}>
            <Ionicons name="receipt-outline" size={13} color={primaryColor} />
            <AppText style={[styles.infoVal, { color: primaryColor, fontWeight: "800" }]}>{orderIdDisplay}</AppText>
          </View>
        </View>
        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>{t("orderDetail.cropType", { defaultValue: "Crop Type" })}</AppText>
          <AppText style={styles.infoVal}>{getLocalizedCropName(cropType, currentLang, t)}</AppText>
        </View>
        {(order.variety || order.productId?.variety) && (
          <View style={styles.infoRow}>
            <AppText style={styles.infoLabel}>{t("postProduct.varietyLabel", { defaultValue: "Variety / Cultivar" })}</AppText>
            <AppText style={styles.infoVal}>
              {t(`varieties.${order.variety || order.productId?.variety}`, { defaultValue: order.variety || order.productId?.variety })}
            </AppText>
          </View>
        )}
        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>{t("orderDetail.quantity", { defaultValue: "Order Volume" })}</AppText>
          <AppText style={styles.infoVal}>{quantity} {getLocalizedUnitName(unit, currentLang, t)}</AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>{t("orderDetail.unitPrice", { defaultValue: "Price per Quintal" })}</AppText>
          <AppText style={styles.infoVal}>ETB {formatNumber(pricePerUnit)}</AppText>
        </View>
        <View style={styles.totalRow}>
          <AppText style={styles.totalLabel}>{t("orderDetail.totalPrice", { defaultValue: "Total Wholesale Amount" })}</AppText>
          <AppText style={[styles.totalAmount, { color: primaryColor }]}>
            ETB {formatNumber(totalPrice)}
          </AppText>
        </View>
      </View>

      {/* Partner Info Card */}
      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        <AppText style={[styles.cardTitle, { color: textPrimary }]}>
          {role === "farmer"
            ? t("orderDetail.buyerContact", { defaultValue: "Buyer Contact" })
            : t("orderDetail.producerContact", { defaultValue: "Producer Contact" })}
        </AppText>
        <View style={styles.partnerRow}>
          <View style={[styles.partnerAvatar, { backgroundColor: primaryColor }]}>
            <Ionicons name="person" size={22} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.partnerName}>
              {role === "farmer" ? buyerName : farmerName}
            </AppText>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={13} color={primaryColor} />
              <AppText style={[styles.verifiedLabel, { color: primaryColor }]}>
                {role === "farmer"
                  ? t("orderDetail.verifiedBuyer", { defaultValue: "Registered Wholesale Buyer" })
                  : t("orderDetail.verifiedProducer", { defaultValue: "Verified Farmer Producer" })}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity
            style={[styles.contactBtn, { borderColor: primaryColor }]}
            onPress={handleMessagePartner}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={primaryColor} />
            <AppText style={[styles.contactBtnText, { color: primaryColor }]}>
              {t("orderDetail.message", { defaultValue: t("common.message", { defaultValue: "Message" }) })}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contactBtn, { borderColor: "#64748B" }]}
            onPress={() => handleCall(role === "farmer" ? buyerPhone : farmerPhone)}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={16} color="#64748B" />
            <AppText style={[styles.contactBtnText, { color: "#64748B" }]}>
              {t("orderDetail.call", { defaultValue: t("common.call", { defaultValue: "Call" }) })}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Farmer Action Buttons */}
      {role === "farmer" && rawStatus === "pending" && (
        <TouchableOpacity
          style={[styles.primaryActionBtn, { backgroundColor: primaryColor }]}
          onPress={() => handleUpdateStatus("confirmed")}
          disabled={updating}
          activeOpacity={0.85}
        >
          <AppText style={styles.primaryActionText}>
            {updating ? t("common.loading", { defaultValue: "Updating..." }) : t("orderDetail.acceptOrder", { defaultValue: "Accept & Confirm Harvest Order" })}
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
            {updating ? t("common.loading", { defaultValue: "Updating..." }) : t("orderDetail.dispatchShipment", { defaultValue: "Dispatch Shipment (In Transit)" })}
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
            {updating ? t("common.loading", { defaultValue: "Updating..." }) : t("orderDetail.markDelivered", { defaultValue: "Mark Order Delivered" })}
          </AppText>
        </TouchableOpacity>
      )}

      {/* Buyer Cancel */}
      {role === "buyer" && rawStatus === "pending" && (
        <TouchableOpacity
          style={styles.cancelActionBtn}
          onPress={() => handleUpdateStatus("cancelled")}
          disabled={updating}
          activeOpacity={0.85}
        >
          <AppText style={styles.cancelActionText}>{t("orderDetail.cancelOrder", { defaultValue: "Cancel Wholesale Order" })}</AppText>
        </TouchableOpacity>
      )}

      {updating && (
        <View style={{ marginTop: 12, alignItems: "center" }}>
          <ActivityIndicator size="small" color={primaryColor} />
        </View>
      )}

      <View style={{ height: 40 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 8,
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  orderMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  orderIdBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  orderIdBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  orderDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  orderIdInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  infoLabel: { fontSize: 13, color: "#64748B" },
  infoVal: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  totalLabel: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  totalAmount: { fontSize: 18, fontWeight: "900" },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  partnerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerName: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  verifiedLabel: { fontSize: 11, fontWeight: "600" },
  contactActions: { flexDirection: "row", gap: 10 },
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
  contactBtnText: { fontSize: 13, fontWeight: "700" },
  primaryActionBtn: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  primaryActionText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  cancelActionBtn: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelActionText: { color: "#DC2626", fontSize: 14, fontWeight: "700" },
  orderPhotoContainer: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: "#F1F5F9",
  },
  orderHeroPhoto: {
    width: "100%",
    height: "100%",
  },
});