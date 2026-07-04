import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

export default function BuyerQuickActions({
  searchQuery,
  onSearchChange,
  onFilterPress,
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.searchRow}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme?.colors?.surface,
            borderColor: theme?.colors?.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={theme?.colors?.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search tomato, teff, or onions..."
          placeholderTextColor={theme?.colors?.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          style={[styles.searchInput, { color: theme?.colors?.textPrimary }]}
        />
      </View>
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: theme?.colors?.primary }]}
        onPress={onFilterPress}
      >
        <Ionicons name="options-outline" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
