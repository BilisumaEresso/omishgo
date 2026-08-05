// src/components/farmer/FarmerOrdersFulfillmentList.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { getOrderStatusConfig } from "../../constants/statuses";
import { getLocalizedCropName, getLocalizedCropDisplayName } from "../../constants/crops";
import { getLocalizedUnitName } from "../../constants/units";
import { formatNumber } from "../../utils/formatNumber";
import { formatLocalizedDate } from "../../utils/ethiopianDate";

export default function FarmerOrdersFulfillmentList({
  orders = [],
  onViewAllOrders,
  onOrderPress,
  onChatBuyer,
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>{t("farmerOrders.title", { defaultValue: "Buyer Orders & Fulfillment Feed" })}</AppText>
          <AppText style={styles.subtitle}>{t("farmerDashboard.recentOrders", { defaultValue: "Direct wholesale purchase requests" })}</AppText>
        </View>

        <TouchableOpacity onPress={onViewAllOrders} activeOpacity={0.8}>
          <AppText style={styles.viewAllText}>{t("farmerDashboard.viewAll", { defaultValue: "View All Orders" })}</AppText>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={32} color="#94A3B8" />
          <AppText style={styles.emptyText}>{t("farmerOrders.emptyNoOrders", { defaultValue: "No recent buyer orders yet" })}</AppText>
        </View>
      ) : (
        <View style={styles.list}>
          {orders.slice(0, 4).map((o, idx) => {
            const isLast = idx === Math.min(orders.length, 4) - 1;
            const statusConfig = getOrderStatusConfig(o.status, currentLang);
            const rawCrop = o.cropType || t("common.defaultHarvestCrop", { defaultValue: "Harvest Crop" });
            const cropName = getLocalizedCropName(rawCrop, currentLang, t);
            const unitLabel = getLocalizedUnitName(o.unit || "q", currentLang);
            const amount = o.totalPrice ? `${formatNumber(o.totalPrice)} ETB` : t("farmerProducts.priceUnavailable", { defaultValue: "Pending Quote" });
            
            const formattedDate = o.createdAt
              ? formatLocalizedDate(o.createdAt, currentLang, {
                  month: "short",
                  day: "numeric",
                })
              : (o.date || t("listingDetail.timeToday", { defaultValue: "Today" }));

            return (
              <TouchableOpacity
                key={o.id || o._id || idx}
                style={[styles.row, !isLast && styles.rowBorder]}
                onPress={() => onOrderPress?.(o)}
                activeOpacity={0.8}
              >
                <View style={styles.orderMain}>
                  <View style={styles.topMeta}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1 }}>
                      <AppText style={styles.cropTitle}>
                        {cropName} <AppText style={styles.volume}>({o.quantity || 1} {unitLabel})</AppText>
                      </AppText>
                      {(o.variety || o.productId?.variety) && (
                        <View style={styles.varietyBadge}>
                          <Ionicons name="pricetag" size={10} color="#15803D" />
                          <AppText style={styles.varietyBadgeText}>
                            {t(`varieties.${o.variety || o.productId?.variety}`, { defaultValue: o.variety || o.productId?.variety })}
                          </AppText>
                        </View>
                      )}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                      <AppText style={[styles.statusBadgeText, { color: statusConfig.color }]}>
                        {statusConfig.displayLabel}
                      </AppText>
                    </View>
                  </View>

                  <AppText style={styles.buyerText}>
                    {t("farmerOrders.buyer", { defaultValue: "Buyer" })}: <AppText style={styles.buyerName}>{o.buyerName || t("farmerOrders.unknownBuyer", { defaultValue: "Wholesale Buyer" })}</AppText> • {formattedDate}
                  </AppText>

                  <View style={styles.bottomMeta}>
                    <AppText style={styles.totalPrice}>{amount}</AppText>

                    {o.buyerId && (
                      <TouchableOpacity
                        style={styles.chatBtn}
                        onPress={() => onChatBuyer?.(o)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="chatbubble-ellipses" size={14} color="#15803D" />
                        <AppText style={styles.chatBtnText}>{t("buyerProfile.chatNow", { defaultValue: "Chat Buyer" })}</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#15803D",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#64748B",
  },
  list: {},
  row: {
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  orderMain: {
    gap: 6,
  },
  topMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cropTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  volume: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  buyerText: {
    fontSize: 12,
    color: "#64748B",
  },
  buyerName: {
    fontWeight: "600",
    color: "#334155",
  },
  bottomMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#15803D",
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D",
  },
  varietyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  varietyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },
});
