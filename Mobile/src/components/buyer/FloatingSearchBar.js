// src/components/buyer/FloatingSearchBar.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { getLocalizedUnitName } from "../../constants/units";
import { useTheme } from "../../hooks/useTheme";

export default function FloatingSearchBar({
  searchQuery,
  onSearchChange,
  onFilterPress,
  products = [],
  onSelectProduct,
  hasActiveFilters = false,
}) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textColor = theme?.colors?.textPrimary || "#0F172A";
  const placeholderColor = theme?.colors?.textSecondary || "#94A3B8";
  const borderColor = theme?.colors?.border || "#E2E8F0";

  // Real-time matching suggestions from real products list
  const filteredSuggestions = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          const crop = (p.cropType || p.name || "").toLowerCase();
          const farmer = (p.farmerId?.name || "").toLowerCase();
          const region = (p.location?.region || "").toLowerCase();
          return crop.includes(q) || farmer.includes(q) || region.includes(q);
        })
        .slice(0, 5)
    : [];

  const showDropdown = isFocused && filteredSuggestions.length > 0;

  return (
    <View style={styles.floatingWrapper}>
      <View
        style={[
          styles.searchCard,
          {
            backgroundColor: surfaceColor,
            borderColor: isFocused ? primaryColor : borderColor,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={21}
          color={isFocused ? primaryColor : placeholderColor}
          style={styles.searchIcon}
        />

        <TextInput
          placeholder={t("browse.searchPlaceholder", { defaultValue: "Search crops, farmers, regions (e.g. Teff, Onion)..." })}
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200);
          }}
          style={[styles.searchInput, { color: textColor }]}
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange("")}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={19} color="#94A3B8" />
          </TouchableOpacity>
        )}

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={onFilterPress}
          style={styles.filterBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={20} color={primaryColor} />
          {hasActiveFilters && <View style={[styles.filterBadgeDot, { backgroundColor: primaryColor }]} />}
        </TouchableOpacity>
      </View>

      {/* Autocomplete Real-Time Dropdown */}
      {showDropdown && (
        <View style={[styles.dropdownPanel, { backgroundColor: surfaceColor, borderColor }]}>
          {filteredSuggestions.map((item, idx) => (
            <TouchableOpacity
              key={item._id || idx}
              style={[
                styles.dropdownItem,
                idx < filteredSuggestions.length - 1 && styles.borderBottom,
              ]}
              onPress={() => {
                onSearchChange(item.cropType || item.name);
                setIsFocused(false);
                onSelectProduct?.(item);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.itemIconWrap}>
                <Ionicons name="leaf-outline" size={17} color={primaryColor} />
              </View>

              <View style={styles.itemInfo}>
                <AppText style={styles.itemCropTitle}>{item.cropType || item.name}</AppText>
                <AppText style={styles.itemSubtext}>
                  {item.farmerId?.name || t("browse.verifiedFarmer", { defaultValue: "Verified Farmer" })} • {[item.location?.wereda, item.location?.zone, item.location?.region].filter(Boolean).join(", ") || t("common.unknownLocation", { defaultValue: "Location Not Provided" })}
                </AppText>
              </View>

              <AppText style={styles.itemPrice}>
                ETB {item.price?.toLocaleString() || "N/A"}/{getLocalizedUnitName(item.unit || "kg", i18n.language || "en", t)}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    zIndex: 1000,
    position: "relative",
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    height: "100%",
  },
  clearBtn: {
    padding: 4,
    marginRight: 4,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },
  filterBtn: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Dropdown Panel */
  dropdownPanel: {
    position: "absolute",
    top: 66,
    left: 14,
    right: 14,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    zIndex: 2000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  itemIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(21, 101, 192, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemCropTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  itemSubtext: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1565C0",
  },
  filterBadgeDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
