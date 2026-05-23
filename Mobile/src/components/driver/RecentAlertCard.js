import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function RecentAlertCard() {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <AppText
        variant="headingSm"
        style={{ color: theme.colors.textPrimary, marginBottom: 12 }}
      >
        Recent Updates
      </AppText>
      <AppCard
        style={[
          styles.alertCard,
          { backgroundColor: "#FFDAD6", borderColor: "#FF847C" },
        ]}
      >
        <View style={styles.alertRow}>
          <View
            style={[styles.alertIcon, { backgroundColor: theme.colors.error }]}
          >
            <Ionicons name="alert-circle-outline" size={18} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText
              variant="bodyMd"
              style={{ fontWeight: "bold", color: "#93000A" }}
            >
              Traffic Alert: Gotera Interchange
            </AppText>
            <AppText
              variant="caption"
              style={{ color: "#93000A", marginTop: 4 }}
            >
              Heavy congestion reported by local traffic wardens. Consider
              alternative expressway routes via Bole Ring Road.
            </AppText>
            <AppText
              variant="caption"
              style={{ color: "#BA1A1A", marginTop: 8, fontWeight: "bold" }}
            >
              10 mins ago
            </AppText>
          </View>
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  alertCard: { padding: 16, borderWidth: 1 },
  alertRow: { flexDirection: "row", gap: 12 },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});
