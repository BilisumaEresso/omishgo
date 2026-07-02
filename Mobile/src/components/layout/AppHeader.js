// src/components/layout/AppHeader.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";

const ICON_SIZE = 24;
const TOUCHABLE_SIZE = 44;
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
  notificationCount = 0,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const primaryColor = theme.colors.primary || "#6B4EFF";
  const textColor = theme.colors.textPrimary || "#212121";
  const secondaryTextColor = theme.colors.textSecondary || "#757575";
  const surfaceColor = theme.colors.surface || "#FFFFFF";
  const borderColor = theme.colors.border || "#E0E0E0";

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

  // Renders an icon button with optional badge dot
  const renderIconButton = (iconName, onPress, { badge = false } = {}) => (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      onPressIn={animatePressIn}
      onPressOut={animatePressOut}
      accessibilityRole="button"
      accessibilityLabel={iconName}
      style={({ pressed }) => [
        styles.iconButton,
        { opacity: pressed ? 0.6 : 1 },
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
                borderColor: surfaceColor,
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
          paddingTop: insets.top + 6,
          paddingBottom: 10,
          paddingHorizontal: 14,
          backgroundColor: surfaceColor,
          borderBottomColor: borderColor,
          borderBottomWidth: StyleSheet.hairlineWidth,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
            },
            android: {
              elevation: 4,
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
            style={{ fontSize: 18, fontWeight: "700", color: textColor }}
            numberOfLines={1}
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              variant="bodySm"
              style={{
                fontSize: 13,
                color: secondaryTextColor,
                opacity: 0.7,
                marginTop: 2,
              }}
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
              renderIconButton("notifications-outline", onNotificationPress, {
                badge: notificationCount > 0,
              })}
            {showProfile && (
              <Pressable
                onPress={onProfilePress}
                hitSlop={HIT_SLOP}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                style={({ pressed }) => [
                  styles.avatarButton,
                  { opacity: pressed ? 0.6 : 1 },
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
                  <Ionicons name="person" size={18} color="#fff" />
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
    gap: 8,
  },
  iconButton: {
    width: TOUCHABLE_SIZE,
    height: TOUCHABLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
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
