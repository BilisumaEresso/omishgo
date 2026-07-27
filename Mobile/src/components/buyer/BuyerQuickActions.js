import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CROP_TYPES, getLocalizedCropName } from "../../constants/crops";
import { useTheme } from "../../hooks/useTheme";

export default function BuyerQuickActions({
  searchQuery,
  onSearchChange,
  onFilterPress,
  suggestions,
}) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const activeSuggestions =
    suggestions ||
    CROP_TYPES.map((cropKey) =>
      getLocalizedCropName(cropKey, i18n.language || "en", t)
    );

  // Filter suggestions
  const filteredSuggestions = searchQuery
    ? activeSuggestions.filter(
        (s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase()) &&
          s.toLowerCase() !== searchQuery.toLowerCase()
      )
    : [];
  const showDropdown = isFocused && filteredSuggestions.length > 0;
  const handleSuggestionPress = item => {
    onSearchChange(item);
    setIsFocused(false);
  };
  return <View style={[styles.container, {
    zIndex: showDropdown ? 1000 : 1
  }]}>
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, {
        backgroundColor: theme?.colors?.surface,
        borderColor: isFocused ? theme?.colors?.primary : theme?.colors?.border
      }]}>
          <Ionicons name="search-outline" size={20} color={isFocused ? theme?.colors?.primary : theme?.colors?.textSecondary} style={styles.searchIcon} />
          <TextInput placeholder={t("browse.searchPlaceholder", { defaultValue: "Search tomato, teff, or onions..." })} placeholderTextColor={theme?.colors?.textSecondary} value={searchQuery} onChangeText={onSearchChange} onFocus={() => setIsFocused(true)} onBlur={() => {
          // Delay hiding so press on suggestion registers
          setTimeout(() => setIsFocused(false), 200);
        }} style={[styles.searchInput, {
          color: theme?.colors?.textPrimary
        }]} />
        </View>
      </View>

      {/* Autocomplete Dropdown */}
      {showDropdown && <View style={[styles.dropdown, {
      backgroundColor: theme?.colors?.surface,
      borderColor: theme?.colors?.border
    }]}>
          {filteredSuggestions.map((item, index) => <TouchableOpacity key={item} style={[styles.suggestionItem, index < filteredSuggestions.length - 1 && {
        borderBottomWidth: 1,
        borderBottomColor: theme?.colors?.border + "50"
      }]} onPress={() => handleSuggestionPress(item)}>
              <Ionicons name="search" size={16} color={theme?.colors?.textSecondary} style={{
          marginRight: 8
        }} />
              <Text style={{
          color: theme?.colors?.textPrimary,
          fontSize: 14
        }}>{item}</Text>
            </TouchableOpacity>)}
        </View>}
    </View>;
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative"
  },
  searchRow: {
    flexDirection: "row",
    gap: 12
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14
  },
  dropdown: {
    position: "absolute",
    top: 54,
    // below search bar
    left: 0,
    right: 0,
    // full width
    borderWidth: 1,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingVertical: 4
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12
  }
});