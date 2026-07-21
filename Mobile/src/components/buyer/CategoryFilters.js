import "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
export default function CategoryFilters({
  categories,
  selected,
  onSelect
}) {
  const {
    theme
  } = useTheme();
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map(cat => {
      const isSelected = selected === cat;
      return <TouchableOpacity key={cat} onPress={() => onSelect(cat)} style={[styles.categoryItem, {
        backgroundColor: isSelected ? theme?.colors?.primary : theme?.colors?.surface,
        borderColor: isSelected ? theme?.colors?.primary : theme?.colors?.border
      }]}>
            <AppText style={[styles.categoryText, {
          color: isSelected ? "#FFF" : theme?.colors?.textSecondary
        }]}>
              {cat}
            </AppText>
          </TouchableOpacity>;
    })}
    </ScrollView>;
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600"
  }
});