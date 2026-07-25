// src/components/farmer/FarmerActionHub.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function FarmerActionHub({
  draftCount = 0,
  unreadMessages = 0,
  onMessagesPress,
  onAlertsPress,
  onDraftsPress,
  onAnalyticsPress,
}) {
  const actions = [
    {
      id: "messages",
      label: "Buyer Chats",
      icon: "chatbubbles",
      color: "#2563EB",
      bgColor: "#EFF6FF",
      badge: unreadMessages > 0 ? unreadMessages : null,
      onPress: onMessagesPress,
    },
    {
      id: "alerts",
      label: "Notifications",
      icon: "notifications",
      color: "#D97706",
      bgColor: "#FEF3C7",
      badge: null,
      onPress: onAlertsPress,
    },
    {
      id: "drafts",
      label: draftCount > 0 ? `Drafts (${draftCount})` : "My Drafts",
      icon: "document-text",
      color: "#16A34A",
      bgColor: "#DCFCE7",
      badge: draftCount > 0 ? draftCount : null,
      onPress: onDraftsPress,
    },
    {
      id: "analytics",
      label: "Price Trends",
      icon: "stats-chart",
      color: "#7C3AED",
      bgColor: "#F3E8FF",
      badge: null,
      onPress: onAnalyticsPress,
    },
  ];

  return (
    <View style={styles.card}>
      <AppText style={styles.sectionTitle}>Producer Quick Actions</AppText>
      <View style={styles.grid}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            style={[styles.tile, { backgroundColor: act.bgColor }]}
            onPress={act.onPress}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={act.icon} size={20} color={act.color} />
              {act.badge !== null && (
                <View style={[styles.badgeDot, { backgroundColor: act.color }]}>
                  <AppText style={styles.badgeText}>{act.badge}</AppText>
                </View>
              )}
            </View>
            <AppText style={[styles.tileLabel, { color: "#0F172A" }]} numberOfLines={1}>
              {act.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    gap: 10,
  },
  tile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 16,
  },
  iconWrap: {
    position: "relative",
    marginBottom: 6,
  },
  badgeDot: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "900",
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
});
