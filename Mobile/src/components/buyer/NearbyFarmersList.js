import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function NearbyFarmersList({ farmers }) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <AppText
        variant="headingSm"
        style={{ color: theme.colors.textPrimary, marginBottom: 12 }}
      >
        Nearby Farmers
      </AppText>
      <View style={styles.grid}>
        {farmers.map((farmer) => (
          <AppCard key={farmer.id} style={styles.card}>
            <Image source={{ uri: farmer.avatar }} style={styles.avatar} />
            <AppText
              variant="bodyMd"
              style={{
                fontWeight: "bold",
                color: theme.colors.textPrimary,
                marginTop: 8,
              }}
            >
              {farmer.name}
            </AppText>
            <AppText
              variant="caption"
              style={{ color: theme.colors.textSecondary }}
            >
              {farmer.distance}
            </AppText>
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <AppText
                variant="caption"
                style={{ color: theme.colors.textPrimary }}
              >
                {farmer.rating}
              </AppText>
            </View>
          </AppCard>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  grid: { flexDirection: "row", gap: 12 },
  card: { flex: 1, alignItems: "center", padding: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 6,
  },
});
