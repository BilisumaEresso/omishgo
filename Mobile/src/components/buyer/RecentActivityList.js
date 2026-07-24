import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

export default function RecentActivityList({ activities, onActivityPress }) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      {activities.map((activity) => (
        <AppCard key={activity.id} style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onActivityPress && onActivityPress(activity)}
            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
          >
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
                style={{
                  fontWeight: "bold",
                  color: theme?.colors?.textPrimary,
                }}
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
          </TouchableOpacity>
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
