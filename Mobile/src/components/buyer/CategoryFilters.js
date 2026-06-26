import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

const categoryIcons = {
  All: "apps-outline",
  Tomato: "restaurant-outline",
  Teff: "leaf-outline",
  Onion: "ellipse-outline",
  Garlic: "ellipse-outline",
};

export default function CategoryFilters({ categories, selected, onSelect }) {
  const { theme } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          onPress={() => onSelect(cat)}
          style={[
            styles.categoryItem,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
            selected === cat && {
              backgroundColor: theme.colors.primaryLight,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <Ionicons
            name={categoryIcons[cat] || "apps-outline"}
            size={24}
            color={
              selected === cat
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <AppText
            variant="caption"
            style={{
              color:
                selected === cat
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              marginTop: 4,
            }}
          >
            {cat}
          </AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  categoryItem: {
    alignItems: "center",
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 70,
  },
});
