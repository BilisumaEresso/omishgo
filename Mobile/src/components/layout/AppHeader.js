// src/components/layout/AppHeader.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation as useRNNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
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
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";
import AppText from "../common/AppText";

const ICON_SIZE = 23;
const TOUCHABLE_SIZE = 42;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// ---- Role-themed Header Icon Button with animated badge ----
const HeaderIconButton = ({
  iconName,
  onPress,
  color = "#FFFFFF",
  accessibilityLabel,
  badgeCount = 0,
  showBadge = false,
  badgeColor = "#FF3B30",
  surfaceColor = "#FFFFFF",
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const highlight = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(showBadge ? 1 : 0)).current;
  const badgePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showBadge) {
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(badgePulse, {
            toValue: 1.18,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(badgePulse, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    } else {
      Animated.timing(badgeScale, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [showBadge, badgeScale, badgePulse]);

  const onIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.88,
        useNativeDriver: true,
        speed: 60,
        bounciness: 4,
      }),
      Animated.timing(highlight, {
        toValue: 1,
        duration: 100,
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
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const displayCount =
    badgeCount > 99 ? "99+" : badgeCount > 0 ? String(badgeCount) : "";

  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      onPressIn={onIn}
      onPressOut={onOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.pressableContainer}
    >
      <Animated.View
        style={[
          styles.iconButton,
          {
            backgroundColor: highlight.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,0.2)"],
            }),
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }], alignItems: "center", justifyContent: "center" }}>
          <Ionicons name={iconName} size={ICON_SIZE} color={color} />
        </Animated.View>

        {/* Floating Notification Badge */}
        {showBadge && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.badgeContainer,
              displayCount ? styles.badgeCountPill : styles.badgeDotOnly,
              {
                backgroundColor: badgeColor,
                borderColor: surfaceColor,
                transform: [
                  { scale: badgeScale },
                  { scale: badgePulse },
                ],
              },
            ]}
          >
            {displayCount ? (
              <AppText style={styles.badgeText} numberOfLines={1}>
                {displayCount}
              </AppText>
            ) : null}
          </Animated.View>
        )}
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
  const { user, role: authRole } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { unreadCount, fetchNotifications } = useNotificationStore();

  // Always keep notification count fresh — every screen benefits
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Shake animation — triggers when unreadCount goes up
  const bellShake = useRef(new Animated.Value(0)).current;
  const prevCountRef = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      Animated.sequence([
        Animated.timing(bellShake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(bellShake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(bellShake, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(bellShake, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(bellShake, { toValue: 3, duration: 40, useNativeDriver: true }),
        Animated.timing(bellShake, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount, bellShake]);

  let navigation = null;
  try {
    navigation = useRNNavigation();
  } catch (_) {}

  // Determine active role theme colors
  const activeRole = authRole || user?.role || "farmer";
  const primaryColor = theme?.colors?.primary || (activeRole === "buyer" ? "#1565C0" : "#2E7D32");
  const primaryDark = theme?.colors?.primaryDark || (activeRole === "buyer" ? "#0D47A1" : "#1B5E20");
  const textColor = "#FFFFFF";
  const secondaryTextColor = "rgba(255, 255, 255, 0.85)";
  const notificationColor = "#FF355E";

  // Entrance animation for title
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(-6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslate, {
        toValue: 0,
        duration: 240,
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
        bounciness: 4,
      }),
      Animated.timing(profileHighlight, {
        toValue: 1,
        duration: 100,
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
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // Always attempt navigation — useRNNavigation() gives us access from any screen
      try { navigation?.navigate("Notifications"); } catch (_) {}
    }
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else if (navigation) {
      navigation.navigate("Marketplace");
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else if (navigation) {
      navigation.navigate("Profile");
    }
  };

  return (
    <LinearGradient
      colors={[primaryColor, primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top + 4, 14),
          paddingBottom: 16,
          paddingHorizontal: 18,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          ...Platform.select({
            ios: {
              shadowColor: primaryDark,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      ]}
    >
      {/* Decorative Orbs */}
      <View style={styles.orbLarge} pointerEvents="none" />
      <View style={styles.orbSmall} pointerEvents="none" />

      {/* ---- Left section ---- */}
      <View style={styles.left}>
        {showBack && (
          <HeaderIconButton
            iconName="chevron-back"
            color={textColor}
            accessibilityLabel="Go back"
            onPress={onBackPress || (() => navigation?.goBack())}
          />
        )}
        {showMenu && (
          <HeaderIconButton
            iconName="menu-outline"
            color={textColor}
            accessibilityLabel="Open menu"
            onPress={onMenuPress || (() => navigation?.openDrawer?.())}
          />
        )}

        <Animated.View
          style={[
            styles.titleContainer,
            {
              marginLeft: showBack || showMenu ? 10 : 0,
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            },
          ]}
        >
          <AppText
            variant="headingMd"
            style={{
              fontSize: 19,
              fontWeight: "700",
              color: textColor,
              letterSpacing: -0.2,
            }}
            numberOfLines={1}
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              variant="bodySm"
              style={{
                fontSize: 12,
                color: secondaryTextColor,
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
                iconName="search-outline"
                color={textColor}
                accessibilityLabel="Search"
                onPress={handleSearchPress}
              />
            )}

            {/* Notification bell — always visible on non-back screens */}
            {!showBack && (
              <Animated.View style={{ transform: [{ translateX: bellShake }] }}>
                <HeaderIconButton
                  iconName={unreadCount > 0 ? "notifications" : "notifications-outline"}
                  color={textColor}
                  accessibilityLabel={
                    unreadCount > 0
                      ? `${unreadCount} unread notifications`
                      : "Notifications"
                  }
                  onPress={handleNotificationPress}
                  showBadge={unreadCount > 0}
                  badgeCount={unreadCount}
                  badgeColor={notificationColor}
                  surfaceColor={primaryDark}
                />
              </Animated.View>
            )}

            {showProfile && (
              <Pressable
                onPress={handleProfilePress}
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
                        outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,0.2)"],
                      }),
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: "rgba(255,255,255,0.25)",
                        transform: [{ scale: profileScale }],
                      },
                    ]}
                  >
                    <Ionicons name="person" size={17} color="#FFFFFF" />
                  </Animated.View>
                </Animated.View>
              </Pressable>
            )}
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  orbLarge: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -40,
    right: -30,
  },
  orbSmall: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -20,
    left: -10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  titleContainer: {
    flexShrink: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pressableContainer: {
    position: "relative",
  },
  iconButton: {
    width: TOUCHABLE_SIZE,
    height: TOUCHABLE_SIZE,
    borderRadius: TOUCHABLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: 2,
    right: 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#FF355E",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  badgeDotOnly: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  badgeCountPill: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  avatarButton: {
    width: TOUCHABLE_SIZE,
    height: TOUCHABLE_SIZE,
    borderRadius: TOUCHABLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
});

export default AppHeader;
