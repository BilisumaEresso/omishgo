// src/components/layout/AppHeader.js
import React, { useRef } from "react";
import { View, Pressable, StyleSheet, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";

const ICON_SIZE = 32;
const TOUCHABLE_SIZE = 48; // explicit minimum touch target
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

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
  const navigation = useNavigation();

  const primaryColor = theme.colors.primary || "#6B4EFF";
  const textColor = theme.colors.textPrimary || "#212121";
  const secondaryTextColor = theme.colors.textSecondary || "#757575";
  const backgroundColor = theme.colors.background || "#FFFFFF";
  const borderColor = theme.colors.border || "#F0F0F0";

  // ---- Pro touch feedback (scale + opacity) ----
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animatePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 100,
      bounciness: 10,
    }).start();
  };
  const animatePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 100,
      bounciness: 10,
    }).start();
  };

  const renderIconButton = (iconName, onPress, badge = false) => (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      onPressIn={animatePressIn}
      onPressOut={animatePressOut}
      accessibilityRole="button"
      accessibilityLabel={iconName}
      style={({ pressed }) => [
        styles.iconButton,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name={iconName} size={ICON_SIZE} color={textColor} />
        {badge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.colors.notification || "#FF3B30",
                borderColor: backgroundColor,
              },
            ]}
          />
        )}
      </Animated.View>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 10,
          paddingBottom: 14,
          paddingHorizontal: 16,
          backgroundColor,
          borderBottomColor: borderColor,
          // subtle shadow for depth (pro feel)
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            },
            android: {
              elevation: 3,
            },
          }),
        },
      ]}
    >
      {/* ---- Left section ---- */}
      <View style={styles.left}>
        {showBack &&
          renderIconButton(
            "arrow-back",
            onBackPress || (() => navigation.goBack()),
          )}
        {showMenu &&
          renderIconButton(
            "menu",
            onMenuPress || (() => navigation.openDrawer?.()),
          )}

        <View
          style={[
            styles.titleContainer,
            { marginLeft: showBack || showMenu ? 14 : 0 },
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
              style={{ color: secondaryTextColor, opacity: 0.8, marginTop: 2 }}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      {/* ---- Right section ---- */}
      <View style={styles.right}>
        {rightComponent ? (
          rightComponent
        ) : (
          <>
            {showSearch && renderIconButton("search", onSearchPress)}
            {showNotification &&
              renderIconButton(
                "notifications-outline",
                onNotificationPress,
                true,
              )}
            {showProfile && (
              <Pressable
                onPress={onProfilePress}
                hitSlop={HIT_SLOP}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                style={({ pressed }) => [
                  styles.avatarButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Profile"
              >
                <Animated.View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: primaryColor,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Ionicons name="person" size={20} color="#fff" />
                </Animated.View>
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
    gap: 8, // consistent spacing between right icons
  },
  iconButton: {
    width: TOUCHABLE_SIZE,
    height: TOUCHABLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
    // marginLeft is now handled by gap
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  avatarButton: {
    width: TOUCHABLE_SIZE,
    height: TOUCHABLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppHeader;
