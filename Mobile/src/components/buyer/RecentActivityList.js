import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function RecentActivityList({ activities }) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <AppText
        variant="headingSm"
        style={{ color: theme?.colors?.textPrimary, marginBottom: 12 }}
      >
        Recent Activity
      </AppText>
      {activities.map((activity) => (
        <AppCard key={activity.id} style={styles.card}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={
                activity.type === "order"
                  ? "cart-outline"
                  : "chatbubble-outline"
              }
              size={24}
              color={theme?.colors?.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText
              variant="bodyMd"
              style={{ fontWeight: "bold", color: theme?.colors?.textPrimary }}
            >
              {activity.title}
            </AppText>
            <AppText
              variant="caption"
              style={{ color: theme?.colors?.textSecondary }}
            >
              {activity.description}
            </AppText>
            <AppText
              variant="caption"
              style={{ color: theme?.colors?.textMuted, marginTop: 4 }}
            >
              {activity.time}
            </AppText>
          </View>
        </AppCard>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2ECF4",
    alignItems: "center",
    justifyContent: "center",
  },
});
