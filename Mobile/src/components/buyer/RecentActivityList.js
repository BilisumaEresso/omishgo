import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";
import { getLocalizedCropName, CROP_TYPES, getCropFallbackImage } from "../../constants/crops";
import { getLocalizedUnitName, UNITS } from "../../constants/units";

export default function RecentActivityList({ activities = [], onActivityPress }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textColor = theme?.colors?.textPrimary || "#0F172A";
  const textMuted = theme?.colors?.textSecondary || "#64748B";

  if (!activities || activities.length === 0) {
    return null;
  }

  const localizeText = (text) => {
    if (!text || typeof text !== "string") return text;
    let result = text;
    CROP_TYPES.forEach((crop) => {
      if (result.includes(crop)) {
        const localized = getLocalizedCropName(crop, currentLang, t);
        if (localized && localized !== crop) {
          result = result.replace(new RegExp(crop, "g"), localized);
        }
      }
    });
    UNITS.forEach((unit) => {
      const localized = getLocalizedUnitName(unit, currentLang, t);
      if (localized && localized !== unit) {
        result = result.replace(new RegExp(`\\b${unit}\\b`, "gi"), localized);
      }
    });
    return result;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return t("common.recent", { defaultValue: "Recent" });
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return localizeText(timeStr);
      return d.toLocaleDateString(currentLang === "am" ? "am-ET" : currentLang === "om" ? "om-ET" : "en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return localizeText(timeStr);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText style={[styles.sectionTitle, { color: textColor }]}>
          {t("buyerDashboard.recentActivityTitle", { defaultValue: "Recent Orders & Activity" })}
        </AppText>
      </View>

      {activities.map((activity) => {
        const isOrder = activity.type === "order";
        const iconName = isOrder ? "cube-outline" : "chatbubble-ellipses-outline";
        const rawCrop = activity.order?.cropType || activity.order?.productId?.cropType || "";
        const photo = activity.order?.product?.photos?.[0] || activity.order?.productId?.photos?.[0] || activity.order?.photos?.[0] || getCropFallbackImage(rawCrop);
        const status = activity.order?.status || activity.status || "processing";

        let titleText = localizeText(activity.title) || t("buyerOrders.orderActivity", { defaultValue: "Order Activity" });
        let descriptionText = localizeText(activity.description) || t("buyerOrders.activityUpdated", { defaultValue: "Activity updated" });

        if (isOrder && activity.order) {
          const quantity = activity.order.quantity || 0;
          const rawUnit = activity.order.unit || "kg";
          const localizedUnit = getLocalizedUnitName(rawUnit, currentLang, t);
          const localizedCrop = getLocalizedCropName(rawCrop, currentLang, t);
          const farmerName = activity.order.farmerId?.name || t("buyerDashboard.defaultFarmer", { defaultValue: "Farmer" });

          titleText = t("buyerDashboard.orderTitle", { crop: localizedCrop, defaultValue: `Order: ${localizedCrop}` });
          descriptionText = t("buyerDashboard.orderShortDesc", {
            quantity,
            unit: localizedUnit,
            farmer: farmerName,
            defaultValue: `Ordered ${quantity} ${localizedUnit} from ${farmerName}`
          });
        }

        return (
          <TouchableOpacity
            key={activity.id}
            style={[styles.card, { backgroundColor: surfaceColor }]}
            onPress={() => onActivityPress && onActivityPress(activity)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, { backgroundColor: primaryColor + "12", overflow: 'hidden' }]}>
              {photo ? (
                <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Ionicons name={iconName} size={20} color={primaryColor} />
              )}
            </View>

            <View style={styles.contentWrap}>
              <View style={styles.topRow}>
                <AppText style={[styles.title, { color: textColor }]} numberOfLines={1}>
                  {titleText}
                </AppText>
                <AppText style={styles.timeText}>{formatTime(activity.time || activity.createdAt)}</AppText>
              </View>

              <AppText style={[styles.description, { color: textMuted }]} numberOfLines={1}>
                {descriptionText}
              </AppText>

              {isOrder && (
                <View style={styles.orderFooter}>
                  <View style={styles.statusPill}>
                    <View style={styles.statusDot} />
                    <AppText style={styles.statusText}>
                      {t(`statuses.${status}`, { defaultValue: status.charAt(0).toUpperCase() + status.slice(1) })}
                    </AppText>
                  </View>

                  <AppText style={[styles.actionLink, { color: primaryColor }]}>
                    {t("buyerOrders.trackDetails", { defaultValue: "Track Details →" })}
                  </AppText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrap: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
  },
  actionLink: {
    fontSize: 12,
    fontWeight: "700",
  },
});
