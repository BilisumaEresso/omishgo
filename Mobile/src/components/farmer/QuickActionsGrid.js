import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

export default function QuickActionsGrid({
  productCount,
  onAddPress,
  onOrdersPress,
  onTrainingPress,
}) {
  const { theme } = useTheme();
  const primaryColor = theme.colors.primary;
  const surfaceColor = theme.colors.surface;
  const borderColor = theme.colors.border;
  const textPrimary = theme.colors.textPrimary;
  const textSecondary = theme.colors.textSecondary;

  return (
    <View style={styles.grid}>
      {/* Add Product */}
      <TouchableOpacity
        style={[styles.item, { backgroundColor: primaryColor }]}
        onPress={onAddPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={32} color="#FFF" />
        <AppText variant="bodyMd" style={[styles.label, { color: "#FFF" }]}>
          Add Product
        </AppText>
      </TouchableOpacity>

      {/* My Products */}
      <View
        style={[
          styles.item,
          { backgroundColor: surfaceColor, borderWidth: 1, borderColor },
        ]}
      >
        <Ionicons name="cube-outline" size={32} color={primaryColor} />
        <AppText
          variant="bodyMd"
          style={[styles.label, { color: textPrimary }]}
        >
          My Products ({productCount})
        </AppText>
      </View>

      {/* Orders */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: surfaceColor, borderWidth: 1, borderColor },
        ]}
        onPress={onOrdersPress}
        activeOpacity={0.7}
      >
        <Ionicons name="receipt-outline" size={32} color={primaryColor} />
        <AppText
          variant="bodyMd"
          style={[styles.label, { color: textPrimary }]}
        >
          Orders
        </AppText>
        <View style={styles.badge}>
          <AppText
            variant="caption"
            style={{ color: "#FFF", fontWeight: "bold" }}
          >
            3
          </AppText>
        </View>
      </TouchableOpacity>

      {/* Training */}
      <View
        style={[
          styles.item,
          { backgroundColor: surfaceColor, borderWidth: 1, borderColor },
        ]}
      >
        <Ionicons name="school-outline" size={32} color={primaryColor} />
        <AppText
          variant="bodyMd"
          style={[styles.label, { color: textPrimary }]}
        >
          Training
        </AppText>
        <AppText variant="caption" style={{ color: textSecondary }}>
          2 tutorials
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  item: {
    width: "48%",
    aspectRatio: 1.2,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 12,
    position: "relative",
  },
  label: { fontWeight: "600", marginTop: 8 },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#BA1A1A",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
