// src/components/layout/AppHeader.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation as useRNNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";
import { useNotificationStore } from "../../store/notification.store";

const ICON_SIZE = 24;
const TOUCHABLE_SIZE = 44;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// ---- Individual icon button: own animated state, so buttons never interfere ----
const HeaderIconButton = ({
  iconName,
  onPress,
  color,
  accessibilityLabel,
  badgeCount = 0,
  showBadge = false,
  badgeColor,
  surfaceColor,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const highlight = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(0)).current;
  const prevBadgeVisible = useRef(showBadge);

  useEffect(() => {
    if (showBadge && !prevBadgeVisible.current) {
      badgePulse.setValue(0);
      Animated.timing(badgePulse, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
    prevBadgeVisible.current = showBadge;
  }, [showBadge, badgePulse]);

  const onIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
        speed: 60,
        bounciness: 6,
      }),
      Animated.timing(highlight, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 8,
      }),
      Animated.timing(highlight, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const displayCount =
    badgeCount > 99 ? "99+" : badgeCount > 0 ? String(badgeCount) : null;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      onPressIn={onIn}
      onPressOut={onOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        style={[
          styles.iconButton,
          {
            backgroundColor: highlight.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(0,0,0,0)", `${color}14`],
            }),
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name={iconName} size={ICON_SIZE} color={color} />
          {showBadge && (
            <Animated.View
              style={[
                styles.badge,
                displayCount && styles.badgeWide,
                {
                  backgroundColor: badgeColor,
                  borderColor: surfaceColor,
                  transform: [
                    {
                      scale: badgePulse.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.4, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {displayCount && (
                <AppText style={styles.badgeText} numberOfLines={1}>
                  {displayCount}
                </AppText>
              )}
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

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

  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (showNotification) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [showNotification, fetchNotifications]);

  // NOTE: try/catch here intentionally guards against rendering outside a
  // NavigationContainer (e.g. in isolated screen previews/tests). The hook
  // itself is still called unconditionally on every render.
  let navigation = null;
  try {
    navigation = useRNNavigation();
  } catch (_) {}

  const primaryColor = theme?.colors?.primary || "#6B4EFF";
  const textColor = theme?.colors?.textPrimary || "#212121";
  const secondaryTextColor = theme?.colors?.textSecondary || "#757575";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const borderColor = theme?.colors?.border || "#E0E0E0";
  const notificationColor = theme?.colors?.notification || "#FF3B30";

  // Subtle entrance for title/subtitle on every mount (screen transition)
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(-6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslate, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, titleTranslate]);

  const profileScale = useRef(new Animated.Value(1)).current;
  const profileHighlight = useRef(new Animated.Value(0)).current;

  const onProfileIn = () => {
    Animated.parallel([
      Animated.spring(profileScale, {
        toValue: 0.9,
        useNativeDriver: true,
        speed: 60,
        bounciness: 6,
      }),
      Animated.timing(profileHighlight, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const onProfileOut = () => {
    Animated.parallel([
      Animated.spring(profileScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 8,
      }),
      Animated.timing(profileHighlight, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  };

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
              shadowOpacity: 0.07,
              shadowRadius: 10,
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
        {showBack && (
          <HeaderIconButton
            iconName="arrow-back"
            color={textColor}
            accessibilityLabel="Go back"
            onPress={onBackPress || (() => navigation?.goBack())}
          />
        )}
        {showMenu && (
          <HeaderIconButton
            iconName="menu"
            color={textColor}
            accessibilityLabel="Open menu"
            onPress={onMenuPress || (() => navigation?.openDrawer?.())}
          />
        )}

        <Animated.View
          style={[
            styles.titleContainer,
            {
              marginLeft: showBack || showMenu ? 14 : 0,
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            },
          ]}
        >
          <AppText
            variant="headingMd"
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: textColor,
              letterSpacing: 0.1,
            }}
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
                opacity: 0.75,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          ) : null}
        </Animated.View>
      </View>

      {/* ---- Right section ---- */}
      <View style={styles.right}>
        {rightComponent ? (
          rightComponent
        ) : (
          <>
            {showSearch && (
              <HeaderIconButton
                iconName="search"
                color={textColor}
                accessibilityLabel="Search"
                onPress={onSearchPress}
              />
            )}
            {showNotification && (
              <HeaderIconButton
                iconName="notifications-outline"
                color={textColor}
                accessibilityLabel={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
                onPress={onNotificationPress}
                showBadge={unreadCount > 0}
                badgeCount={unreadCount}
                badgeColor={notificationColor}
                surfaceColor={surfaceColor}
              />
            )}
            {showProfile && (
              <Pressable
                onPress={onProfilePress}
                hitSlop={HIT_SLOP}
                onPressIn={onProfileIn}
                onPressOut={onProfileOut}
                accessibilityRole="button"
                accessibilityLabel="Profile"
              >
                <Animated.View
                  style={[
                    styles.avatarButton,
                    {
                      backgroundColor: profileHighlight.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["rgba(0,0,0,0)", `${primaryColor}14`],
                      }),
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: primaryColor,
                        transform: [{ scale: profileScale }],
                      },
                    ]}
                  >
                    <Ionicons name="person" size={18} color="#fff" />
                  </Animated.View>
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
    borderRadius: TOUCHABLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeWide: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  avatarButton: {
    width: TOUCHABLE_SIZE,
    height: TOUCHABLE_SIZE,
    borderRadius: TOUCHABLE_SIZE / 2,
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
