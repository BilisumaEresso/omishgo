import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";

const LocationPicker = ({
  label,
  value,
  displayLabel,
  options,
  onSelect,
  visible,
  onToggle,
  disabled,
  error,
  primary,
  border,
  textPrimary,
  textSecondary,
  errorColor,
}) => {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={styles.inputGroup}>
      <AppText style={[styles.label, { color: textSecondary }]}>
        {label}
      </AppText>
      <TouchableOpacity
        onPress={handleToggle}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.pickerButton,
          {
            borderColor: error ? errorColor : border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <AppText
          style={{ color: value ? textPrimary : textSecondary, flex: 1 }}
        >
          {displayLabel || label}
        </AppText>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={20}
          color={primary}
        />
      </TouchableOpacity>

      {visible && options.length > 0 && (
        <View
          style={[
            styles.dropdownContainer,
            { backgroundColor: "white", borderColor: border },
          ]}
        >
          <ScrollView
            nestedScrollEnabled
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator
          >
            {options.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  onSelect(item.value);
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                }}
                style={[
                  styles.dropdownItem,
                  {
                    borderBottomColor: border,
                    backgroundColor:
                      value === item.value ? primary + "12" : "transparent",
                  },
                ]}
              >
                <AppText
                  style={{
                    color: value === item.value ? primary : textPrimary,
                    fontWeight: value === item.value ? "600" : "400",
                  }}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={errorColor} />
          <AppText style={[styles.errorText, { color: errorColor }]}>
            {error}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  dropdownContainer: {
    borderRadius: 10,
    borderWidth: 1,
    maxHeight: 200,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  errorText: { fontSize: 12, flex: 1 },
});

export default LocationPicker;
