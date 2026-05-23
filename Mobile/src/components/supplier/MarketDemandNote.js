import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

export default function MarketDemandNote() {
  const { theme } = useTheme();
  return (
    <AppCard
      style={[
        styles.card,
        { backgroundColor: "#DAE2FF", borderColor: "#B2C5FF" },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name="trending-up" size={16} color="#0052CC" />
        <AppText
          variant="caption"
          style={{ color: "#0052CC", fontWeight: "bold", marginLeft: 6 }}
        >
          Market Demand Note
        </AppText>
      </View>
      <AppText
        variant="bodyMd"
        style={{ fontWeight: "bold", color: "#001848", marginTop: 8 }}
      >
        High demand for Urea Fertilizer in Adama regional warehouse.
      </AppText>
      <AppText
        variant="caption"
        style={{ color: "#001848", opacity: 0.8, marginTop: 4 }}
      >
        Prices predicted up 12% this week based on regional stock drops.
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, padding: 16, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center" },
});
