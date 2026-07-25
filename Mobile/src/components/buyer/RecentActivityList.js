// src/components/buyer/RecentActivityList.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";

export default function RecentActivityList({ activities = [], onActivityPress }) {
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textColor = theme?.colors?.textPrimary || "#0F172A";
  const textMuted = theme?.colors?.textSecondary || "#64748B";

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText style={[styles.sectionTitle, { color: textColor }]}>
          Recent Orders & Activity
        </AppText>
      </View>

      {activities.map((activity) => {
        const isOrder = activity.type === "order";
        const iconName = isOrder ? "cube-outline" : "chatbubble-ellipses-outline";

        return (
          <TouchableOpacity
            key={activity.id}
            style={[styles.card, { backgroundColor: surfaceColor }]}
            onPress={() => onActivityPress && onActivityPress(activity)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, { backgroundColor: primaryColor + "12" }]}>
              <Ionicons name={iconName} size={20} color={primaryColor} />
            </View>

            <View style={styles.contentWrap}>
              <View style={styles.topRow}>
                <AppText style={[styles.title, { color: textColor }]} numberOfLines={1}>
                  {activity.title || "Order Activity"}
                </AppText>
                <AppText style={styles.timeText}>{activity.time || "Recent"}</AppText>
              </View>

              <AppText style={[styles.description, { color: textMuted }]} numberOfLines={1}>
                {activity.description || "Activity updated"}
              </AppText>

              {isOrder && (
                <View style={styles.orderFooter}>
                  <View style={styles.statusPill}>
                    <View style={styles.statusDot} />
                    <AppText style={styles.statusText}>Order Processing</AppText>
                  </View>

                  <AppText style={[styles.actionLink, { color: primaryColor }]}>
                    Track Details →
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
