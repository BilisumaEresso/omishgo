import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

export default function SupplierQuickActions({ onAddSale }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[
          styles.buttonPrimary,
          { backgroundColor: theme?.colors?.secondary || "#FF9800" },
        ]}
        onPress={onAddSale}
      >
        <Ionicons name="add-circle-outline" size={18} color="#FFF" />
        <AppText
          variant="caption"
          style={{ color: "#FFF", fontWeight: "bold", marginLeft: 6 }}
        >
          Add Sale
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttonSecondary,
          {
            backgroundColor: theme?.colors?.surface,
            borderColor: theme?.colors?.border,
          },
        ]}
      >
        <Ionicons
          name="layers-outline"
          size={18}
          color={theme?.colors?.primary}
        />
        <AppText
          variant="caption"
          style={{ color: theme?.colors?.textPrimary, marginLeft: 6 }}
        >
          View Stock
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttonSecondary,
          {
            backgroundColor: theme?.colors?.surface,
            borderColor: theme?.colors?.border,
          },
        ]}
      >
        <Ionicons
          name="document-text-outline"
          size={18}
          color={theme?.colors?.primary}
        />
        <AppText
          variant="caption"
          style={{ color: theme?.colors?.textPrimary, marginLeft: 6 }}
        >
          Orders
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  buttonPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
});
