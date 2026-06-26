import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppCard from "../common/AppCard";
import { useTheme } from "../../hooks/useTheme";

// Placeholder chart image – replace with your own or use a pure RN chart
const CHART_IMAGE =
  "https://images.unsplash.com/vector-1739803880008-09056660fbc7?w=600&auto=format";

export default function SalesSummaryWidget({ salesSum, onAddSale }) {
  const { theme } = useTheme();
  return (
    <AppCard style={styles.card}>
      <AppText
        variant="bodyMd"
        style={{ fontWeight: "bold", color: theme.colors.textPrimary }}
      >
        Sales Summary
      </AppText>
      <AppText
        variant="caption"
        style={{ color: theme.colors.textSecondary, marginBottom: 4 }}
      >
        Total Sales this Week
      </AppText>
      <AppText
        variant="headingLg"
        style={{ color: theme.colors.primary, marginBottom: 12 }}
      >
        {salesSum.toLocaleString()} ETB
      </AppText>

      <TouchableOpacity activeOpacity={0.9} onPress={onAddSale}>
        <ImageBackground
          source={{ uri: CHART_IMAGE }}
          style={styles.chart}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.chartOverlay}>
            <View style={styles.trendBadge}>
              <Ionicons
                name="trending-up"
                size={12}
                color={theme.colors.primary}
              />
              <AppText
                variant="caption"
                style={{
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  marginLeft: 4,
                }}
              >
                Trend Up (+12%)
              </AppText>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, padding: 16 },
  chart: { height: 120, borderRadius: 12, overflow: "hidden", marginTop: 8 },
  chartOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 8,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
});
