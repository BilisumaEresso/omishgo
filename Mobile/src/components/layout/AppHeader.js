// src/components/layout/AppHeader.js
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";

const ICON_SIZE = 22;

const AppHeader = ({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showNotification = false,
  showSearch = false,
  showProfile = false,
  onBackPress,
  onMenuPress,
  onNotificationPress,
  onSearchPress,
  onProfilePress,
  rightComponent,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const textColor = theme.colors.textPrimary || "#212121";
  const secondaryTextColor = theme.colors.textSecondary || "#757575";

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: theme.spacing?.md || 16,
          backgroundColor: theme.colors.background || "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border || "#F0F0F0",
        },
      ]}
    >
      {/* Left section */}
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={onBackPress}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="arrow-back" size={ICON_SIZE} color={textColor} />
          </Pressable>
        )}
        {showMenu && (
          <Pressable
            onPress={onMenuPress}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="menu" size={ICON_SIZE} color={textColor} />
          </Pressable>
        )}

        <View
          style={[
            styles.titleContainer,
            { marginLeft: showBack || showMenu ? 12 : 0 },
          ]}
        >
          <AppText
            variant="headingMd"
            style={{ color: textColor, fontWeight: "700" }}
            numberOfLines={1}
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              variant="bodySm"
              style={{ color: secondaryTextColor, opacity: 0.7 }}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      {/* Right section */}
      <View style={styles.right}>
        {rightComponent ? (
          rightComponent
        ) : (
          <>
            {showSearch && (
              <Pressable
                onPress={onSearchPress}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.iconButton,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Ionicons name="search" size={ICON_SIZE} color={textColor} />
              </Pressable>
            )}
            {showNotification && (
              <Pressable
                onPress={onNotificationPress}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.iconButton,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={ICON_SIZE}
                  color={textColor}
                />
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.error || "#FF3B30" },
                  ]}
                />
              </Pressable>
            )}
            {showProfile && (
              <Pressable
                onPress={onProfilePress}
                hitSlop={8}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.primary || "#6B4EFF" },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={18}
                    color={theme.colors.background || "#FFFFFF"}
                  />
                </View>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  titleContainer: {
    flexShrink: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
});

export default AppHeader;
