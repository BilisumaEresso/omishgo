// src/screens/shared/OrderDetailScreen.js
import { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import AppButton from "../../components/common/AppButton";
import { useTheme } from "../../hooks/useTheme";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";

// ─── Status colour map ────────────────────────────────────────────────────────
const STATUS_COLORS = {
  pending: "#F57F17",
  confirmed: "#1565C0",
  in_transit: "#6A1B9A",
  delivered: "#2E7D32",
  cancelled: "#C62828"
};
export default function OrderDetailScreen({
  route,
  navigation
}) {
  const {
    t
  } = useTranslation();
  const {
    theme
  } = useTheme();
  const {
    order: initialOrder,
    role
  } = route.params || {};
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);

  // Translated status labels
  const statusLabel = useMemo(() => ({
    pending: t("orderDetail.statusPending"),
    confirmed: t("orderDetail.statusConfirmed"),
    in_transit: t("orderDetail.statusInTransit"),
    delivered: t("orderDetail.statusDelivered"),
    cancelled: t("orderDetail.statusCancelled")
  }), [t]);

  // Allowed next statuses per role with translated button labels
  const farmerNext = useMemo(() => ({
    pending: [{
      label: t("orderDetail.confirmOrder"),
      value: "confirmed",
      variant: "primary"
    }],
    confirmed: [{
      label: t("orderDetail.markInTransit"),
      value: "in_transit",
      variant: "primary"
    }],
    in_transit: [{
      label: t("orderDetail.markDelivered"),
      value: "delivered",
      variant: "primary"
    }]
  }), [t]);
  const buyerNext = useMemo(() => ({
    pending: [{
      label: t("orderDetail.cancelOrder"),
      value: "cancelled",
      variant: "danger"
    }]
  }), [t]);
  if (!order) {
    return <View style={styles.centered}>
        <AppText>{t("orderDetail.orderNotFound")}</AppText>
      </View>;
  }

  // ── Safely extract fields from the real backend structure ─────────────────
  const cropType = order.cropType || "—";
  const quantity = order.quantity ?? 0;
  const unit = order.unit || "kg";
  const pricePerUnit = order.pricePerUnit ?? order.price ?? 0;
  const totalPrice = order.totalPrice ?? 0;
  const rawStatus = order.status || "pending";
  const translatedStatus = statusLabel[rawStatus] || rawStatus;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) : order.date || "—";

  // Buyer info (populated object or flat fields)
  const buyerName = order.buyerId?.name || order.buyerName || t("orderDetail.unknownBuyer");
  const buyerPhone = order.buyerId?.phone || order.buyerPhone || null;

  // Farmer info (populated object or flat fields)
  const farmerName = order.farmerId?.name || order.farmerName || t("orderDetail.unknownFarmer");
  const farmerPhone = order.farmerId?.phone || order.farmerPhone || null;
  const farmerId = order.farmerId?._id || order.farmerId || "mock";

  // ── Color helpers ─────────────────────────────────────────────────────────
  const bannerColor = STATUS_COLORS[rawStatus] || theme?.colors?.primary || "#2E7D32";
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F9FBF9";
  const border = theme?.colors?.border || "#E0E0E0";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const errorColor = theme?.colors?.error || "#C62828";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCall = phone => {
    if (!phone) {
      Alert.alert(t("orderDetail.noPhoneTitle"), t("orderDetail.noPhoneMessage"));
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert(t("orderDetail.errorTitle"), t("orderDetail.diallerError")));
  };
  const handleMessageFarmer = () => {
    navigation.navigate("Chat", {
      userId: farmerId,
      userName: farmerName
    });
  };
  const handleUpdateStatus = async newStatus => {
    if (newStatus === "cancelled") {
      Alert.alert(t("orderDetail.cancelTitle"), t("orderDetail.cancelMessage"), [{
        text: t("orderDetail.cancelNo"),
        style: "cancel"
      }, {
        text: t("orderDetail.cancelYes"),
        style: "destructive",
        onPress: () => doUpdate(newStatus)
      }]);
    } else {
      doUpdate(newStatus);
    }
  };
  const doUpdate = async newStatus => {
    setUpdating(true);
    try {
      const res = await api.patch(API_ENDPOINTS.orders.updateStatus(order._id), {
        status: newStatus
      });
      const updated = res.data?.data?.order;
      if (updated) setOrder(updated);
      Alert.alert(t("orderDetail.success"), t("orderDetail.orderStatusUpdated", {
        status: statusLabel[newStatus] || newStatus
      }));
    } catch (err) {
      Alert.alert(t("orderDetail.errorTitle"), err?.response?.data?.message || t("orderDetail.updateError"));
    } finally {
      setUpdating(false);
    }
  };

  // Get the action buttons for this role & status
  const nextActions = role === "farmer" ? farmerNext[rawStatus] || [] : buyerNext[rawStatus] || [];
  return <View style={[styles.container, {
    backgroundColor: background
  }]}>
      {/* Header */}
      <AppHeader title={t("orderDetail.screenTitle")} showBack={true} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status banner */}
        <View style={[styles.statusBanner, {
        backgroundColor: bannerColor
      }]}>
          <AppText style={styles.statusText}>
            {translatedStatus.toUpperCase()}
          </AppText>
        </View>

        {/* Product info card */}
        <View style={[styles.card, {
        backgroundColor: surface,
        borderColor: border
      }]}>
          <AppText style={[styles.sectionTitle, {
          color: textPrimary
        }]}>
            {t("orderDetail.productInfo")}
          </AppText>
          <InfoRow icon="leaf" label={t("orderDetail.cropType")} value={cropType} />
          <InfoRow icon="cube" label={t("orderDetail.quantity")} value={`${quantity} ${unit}`} />
          <InfoRow icon="cash" label={t("orderDetail.pricePerUnit")} value={`${pricePerUnit} ETB`} />
          <InfoRow icon="pricetag" label={t("orderDetail.total")} value={`${totalPrice} ETB`} />
          <InfoRow icon="calendar" label={t("orderDetail.date")} value={date} />
        </View>

        {/* Party info card */}
        <View style={[styles.card, {
        backgroundColor: surface,
        borderColor: border
      }]}>
          <AppText style={[styles.sectionTitle, {
          color: textPrimary
        }]}>
            {role === "farmer" ? t("orderDetail.buyerInfo") : t("orderDetail.farmerInfo")}
          </AppText>
          {role === "farmer" ? <>
              <InfoRow icon="person" label={t("orderDetail.name")} value={buyerName} />
              <PhoneRow label={t("orderDetail.phone")} phone={buyerPhone} textSecondary={textSecondary} textPrimary={textPrimary} primary={primary} onCall={() => handleCall(buyerPhone)} placeholder={t("orderDetail.notProvided")} />
            </> : <>
              <InfoRow icon="person" label={t("orderDetail.name")} value={farmerName} />
              <PhoneRow label={t("orderDetail.phone")} phone={farmerPhone} textSecondary={textSecondary} textPrimary={textPrimary} primary={primary} onCall={() => handleCall(farmerPhone)} placeholder={t("orderDetail.notProvided")} />
            </>}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {role === "buyer" && rawStatus !== "cancelled" && rawStatus !== "delivered" && <AppButton title={t("orderDetail.messageFarmer")} variant="primary" fullWidth onPress={handleMessageFarmer} style={styles.actionBtn} />}

          {nextActions.map(action => <AppButton key={action.value} title={updating ? t("orderDetail.updating") : action.label} variant={action.variant === "danger" ? "outline" : "primary"} fullWidth onPress={() => handleUpdateStatus(action.value)} disabled={updating} style={styles.actionBtn} textStyle={action.variant === "danger" ? {
          color: errorColor
        } : undefined} borderColor={action.variant === "danger" ? errorColor : undefined} />)}

          {/* Farmer can also cancel pending/confirmed orders */}
          {role === "farmer" && (rawStatus === "pending" || rawStatus === "confirmed") && <AppButton title={updating ? t("orderDetail.updating") : t("orderDetail.cancelOrder")} variant="outline" fullWidth onPress={() => handleUpdateStatus("cancelled")} disabled={updating} style={styles.actionBtn} textStyle={{
          color: errorColor
        }} borderColor={errorColor} />}
        </View>

        {updating && <View style={{
        alignItems: "center",
        marginTop: 8
      }}>
            <ActivityIndicator size="small" color={primary} />
          </View>}
      </ScrollView>
    </View>;
}

// ─── Reusable Info Row (labels passed as translated strings) ──────────────────
const InfoRow = ({
  icon,
  label,
  value
}) => <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color="#666" style={styles.infoIcon} />
    <AppText style={styles.infoLabel}>{label}</AppText>
    <AppText style={styles.infoValue}>{value || "—"}</AppText>
  </View>;

// ─── Phone Row with call button (label & placeholder translated) ──────────────
const PhoneRow = ({
  phone,
  textSecondary,
  textPrimary,
  primary,
  onCall,
  label,
  placeholder
}) => <View style={styles.partyRow}>
    <Ionicons name="call-outline" size={20} color={textSecondary} />
    <AppText style={[styles.partyLabel, {
    color: textSecondary
  }]}>
      {label}
    </AppText>
    <AppText style={[styles.partyValue, {
    color: textPrimary
  }]}>
      {phone || placeholder}
    </AppText>
    <TouchableOpacity onPress={onCall} disabled={!phone} style={[styles.callButton, {
    opacity: phone ? 1 : 0.4
  }]} hitSlop={{
    top: 8,
    bottom: 8,
    left: 8,
    right: 8
  }}>
      <Ionicons name="call" size={18} color={primary} />
    </TouchableOpacity>
  </View>;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scrollContent: {
    paddingBottom: 32
  },
  statusBanner: {
    height: 52,
    justifyContent: "center",
    alignItems: "center"
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF"
  },
  card: {
    borderRadius: 12,
    margin: 16,
    padding: 16,
    borderWidth: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8
  },
  infoIcon: {
    marginRight: 8
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 80
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1
  },
  partyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8
  },
  partyLabel: {
    fontSize: 14,
    width: 60
  },
  partyValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1
  },
  callButton: {
    padding: 6,
    borderRadius: 20
  },
  actions: {
    marginHorizontal: 16,
    gap: 10,
    marginTop: 8
  },
  actionBtn: {}
});