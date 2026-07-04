import React from "react";
import { View, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

export default function DriverOnlineToggle({ isOnline, onToggle }) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          <Ionicons
            name="person-circle-outline"
            size={32}
            color={theme?.colors?.primary}
          />
        </View>
        <AppText
          variant="headingLg"
          style={{ color: theme?.colors?.textPrimary }}
        >
          OmishGo
        </AppText>
      </View>
      <View style={styles.toggleRow}>
        <Switch
          value={isOnline}
          onValueChange={onToggle}
          trackColor={{
            false: theme?.colors?.border,
            true: theme?.colors?.primary,
          }}
          thumbColor="#FFF"
        />
        <AppText
          variant="bodyMd"
          style={{ color: theme?.colors?.textSecondary, marginLeft: 8 }}
        >
          {isOnline ? "Online" : "Offline"}
        </AppText>
      </View>
      <AppText
        variant="bodySm"
        style={{ color: theme?.colors?.textSecondary, marginTop: 8 }}
      >
        {isOnline
          ? "You're dispatch-ready. Ready for today's deliveries?"
          : "Go online to start receiving cargo assignments."}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
