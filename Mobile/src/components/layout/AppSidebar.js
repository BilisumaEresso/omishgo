// Mobile/src/components/layout/AppSidebar.js
//
// IMPORTANT INTEGRATION NOTE:
// This component no longer uses React Native's <Modal>. It renders as a
// normal absolutely-positioned overlay so touches work on the very first
// tap (native Modals on Android can silently eat the first touch after
// opening — that was the cause of the "works on second press" bug) and so
// it can detect edge swipes coming from underlying screens.
// Because of this, mount <AppSidebar /> as a sibling AFTER your main
// navigator in the root tree (e.g. in App.js), not inside a single screen.
// Wire the new `onSwipeOpen` prop to the same function your hamburger
// button uses, e.g.:
//   <AppSidebar visible={visible} onClose={closeSidebar} onSwipeOpen={openSidebar} ... />

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/auth.store";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

const EDGE_ZONE_WIDTH = 24;
const SWIPE_OPEN_THRESHOLD = 45;
const SWIPE_CLOSE_THRESHOLD = 45;

const ROLE_MENU_ITEM_KEYS = {
  [ROLES.FARMER]: [
    { key: "products", icon: "leaf-outline", route: "FarmerProducts" },
    { key: "orders", icon: "cart-outline", route: "FarmerOrders" },
    { key: "insights", icon: "stats-chart-outline", route: "FarmerAnalytics" },
  ],
  [ROLES.BUYER]: [
    {
      key: "marketplace",
      icon: "storefront-outline",
      route: "BuyerMarketplace",
    },
    { key: "orders", icon: "cart-outline", route: "BuyerOrders" },
    { key: "saved", icon: "bookmark-outline", route: "BuyerSaved" },
  ],
  [ROLES.SUPPLIER]: [
    { key: "inventory", icon: "cube-outline", route: "SupplierInventory" },
    { key: "orders", icon: "cart-outline", route: "SupplierOrders" },
    { key: "reports", icon: "document-text-outline", route: "SupplierReports" },
  ],
  [ROLES.DRIVER]: [
    { key: "deliveries", icon: "bicycle-outline", route: "DriverDeliveries" },
    { key: "history", icon: "time-outline", route: "DriverHistory" },
  ],
};

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "አማርኛ", native: "Amharic" },
  { code: "om", label: "Afaan Oromoo", native: "Afan Oromo" },
];

// ----- Pressable row with press-scale + a real (now wired-up) press tint -----
const Row = ({
  children,
  onPress,
  style,
  accessibilityLabel,
  accessibilityRole = "button",
  pressTint = "rgba(0,0,0,0.045)",
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const bg = useRef(new Animated.Value(0)).current;

  const onIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }),
      Animated.timing(bg, {
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
        speed: 30,
        bounciness: 6,
      }),
      Animated.timing(bg, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={onIn}
      onPressOut={onOut}
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={{ borderRadius: 14 }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {/* Press-tint overlay — previously tracked but never rendered */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 14,
              backgroundColor: bg.interpolate({
                inputRange: [0, 1],
                outputRange: ["rgba(0,0,0,0)", pressTint],
              }),
            },
          ]}
        />
        {children}
      </Animated.View>
    </Pressable>
  );
};

const AppSidebar = ({
  visible,
  onClose,
  onSwipeOpen,
  role,
  onItemPress,
  activeRoute = "",
}) => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const langAnim = useRef(new Animated.Value(0)).current;

  const [showModal, setShowModal] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  // Refs so PanResponder closures (created once) always see fresh values
  const showModalRef = useRef(showModal);
  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);

  const menuItems = useMemo(() => {
    const rawItems = role ? ROLE_MENU_ITEM_KEYS[role] || [] : [];
    return rawItems.map((item) => ({
      label: t(`appSidebar.${item.key}`),
      icon: item.icon,
      route: item.route,
    }));
  }, [role, t]);

  const staticItems = useMemo(
    () => [
      {
        label: t("appSidebar.myProfile"),
        route: "Profile",
        icon: "person-outline",
      },
      {
        label: t("appSidebar.settings"),
        route: "Settings",
        icon: "settings-outline",
      },
      {
        label: t("appSidebar.help"),
        route: "Help",
        icon: "help-circle-outline",
      },
      {
        label: t("appSidebar.chat"),
        route: "Conversations",
        icon: "chatbubble-outline",
      },
    ],
    [t],
  );

  const roleDisplay = role
    ? t(
        `appSidebar.role${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`,
      )
    : t("appSidebar.roleUser");

  const openAnim = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        stiffness: 180,
        mass: 0.9,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 380,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAnim = (cb) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      setLanguageOpen(false);
      langAnim.setValue(0);
      cb && cb();
    });
  };

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      requestAnimationFrame(openAnim);
    } else if (showModal) {
      closeAnim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    Animated.timing(langAnim, {
      toValue: languageOpen ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [languageOpen, langAnim]);

  const handleClose = () => closeAnim(() => onClose && onClose());
  const handleCloseRef = useRef(handleClose);
  useEffect(() => {
    handleCloseRef.current = handleClose;
  });

  const handleItem = (item) =>
    closeAnim(() => onItemPress && onItemPress(item));

  const performLogout = () => closeAnim(() => logout());

  const confirmLogout = () => {
    Alert.alert(
      t("appSidebar.logoutConfirmTitle", "Log out?"),
      t(
        "appSidebar.logoutConfirmMessage",
        "Are you sure you want to log out of your account?",
      ),
      [
        { text: t("appSidebar.cancel", "Cancel"), style: "cancel" },
        {
          text: t("appSidebar.logout"),
          style: "destructive",
          onPress: performLogout,
        },
      ],
    );
  };

  // Android hardware back button closes the drawer instead of the screen
  useEffect(() => {
    if (!showModal) return undefined;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleClose();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code).catch(() => {});
    setLanguageOpen(false);
  };

  const primaryColor = theme?.colors?.primary || "#2E7D32";
  const primaryDark = theme?.colors?.primaryDark || "#1B5E20";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const borderColor = theme?.colors?.border || "#D0E8CE";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const errorColor = theme?.colors?.error || "#C62828";

  const currentLang = i18n.language || "en";
  const currentLangLabel =
    LANGUAGES.find((l) => l.code === currentLang)?.label || "English";

  const itemStyle = (index) => {
    const translateX = contentAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-16 - index * 2, 0],
    });
    const opacity = contentAnim.interpolate({
      inputRange: [0, 0.4 + Math.min(index, 8) * 0.05, 1],
      outputRange: [0, 0.2, 1],
    });
    return { opacity, transform: [{ translateX }] };
  };

  const langHeight = langAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, LANGUAGES.length * 46 + 8],
  });

  // ---- Swipe-to-open (edge zone, only active while closed) ----
  const edgeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !showModalRef.current,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        !showModalRef.current &&
        gestureState.dx > 8 &&
        Math.abs(gestureState.dy) < 30,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_OPEN_THRESHOLD) {
          onSwipeOpen && onSwipeOpen();
        }
      },
    }),
  ).current;

  // ---- Swipe-to-close (over the backdrop, while open) ----
  const backdropResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 6 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderRelease: (evt, gestureState) => {
        const moved = Math.abs(gestureState.dx) + Math.abs(gestureState.dy);
        if (gestureState.dx < -SWIPE_CLOSE_THRESHOLD) {
          handleCloseRef.current();
        } else if (moved < 6) {
          // treated as a plain tap outside the drawer
          handleCloseRef.current();
        }
      },
    }),
  ).current;

  const renderRow = (
    item,
    i,
    { active = false, icon, color, danger = false } = {},
  ) => (
    <Animated.View style={itemStyle(i)} key={item.route || item.label}>
      <Row
        onPress={item.onPress}
        accessibilityLabel={item.label}
        style={[
          styles.menuItem,
          active && {
            backgroundColor: primaryColor + "14",
          },
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            active && { backgroundColor: primaryColor + "1F" },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={danger ? errorColor : active ? primaryColor : textSecondary}
          />
        </View>
        <AppText
          style={[
            styles.menuLabel,
            {
              color: danger ? errorColor : active ? primaryColor : textPrimary,
              fontWeight: active ? "700" : "500",
            },
          ]}
          numberOfLines={1}
        >
          {item.label}
        </AppText>
        {active && (
          <View style={[styles.activeDot, { backgroundColor: primaryColor }]} />
        )}
      </Row>
    </Animated.View>
  );

  return (
    <View style={styles.rootOverlay} pointerEvents="box-none">
      {/* Only render status bar override while the drawer is actually open */}
      {showModal && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
      )}

      {/* Thin edge strip to catch swipe-open gestures when closed */}
      {!showModal && (
        <View
          style={styles.edgeZone}
          {...edgeResponder.panHandlers}
          pointerEvents="box-only"
        />
      )}

      {showModal && (
        <View style={styles.overlay} pointerEvents="auto">
          {/* Backdrop — tap or swipe-left to close */}
          <Animated.View
            style={[styles.backdrop, { opacity: fadeAnim }]}
            {...backdropResponder.panHandlers}
          />

          {/* Drawer */}
          <Animated.View
            style={[
              styles.drawer,
              {
                backgroundColor: surface,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[primaryColor, primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.profileHeader, { paddingTop: insets.top + 18 }]}
            >
              <View style={styles.orbLarge} pointerEvents="none" />
              <View style={styles.orbSmall} pointerEvents="none" />

              <Pressable
                onPress={() =>
                  handleItem({ label: "Profile", route: "Profile" })
                }
                style={({ pressed }) => [
                  styles.profilePressable,
                  pressed && { opacity: 0.85 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={t("appSidebar.viewProfile")}
              >
                <View style={styles.avatarRing}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={30} color={primaryColor} />
                  </View>
                </View>

                <View style={styles.profileInfo}>
                  <AppText style={styles.userName} numberOfLines={1}>
                    {user?.name || t("appSidebar.fallbackUserName")}
                  </AppText>
                  <View style={styles.rolePill}>
                    <View style={styles.roleDot} />
                    <AppText style={styles.roleText} numberOfLines={1}>
                      {roleDisplay}
                    </AppText>
                  </View>
                </View>

                <View style={styles.chevronCircle}>
                  <Ionicons name="chevron-forward" size={16} color="#FFF" />
                </View>
              </Pressable>
            </LinearGradient>

            <ScrollView
              style={styles.menuScroll}
              contentContainerStyle={styles.menuContent}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.length > 0 && (
                <AppText
                  style={[styles.sectionLabel, { color: textSecondary }]}
                >
                  {roleDisplay}
                </AppText>
              )}

              {menuItems.map((item, i) =>
                renderRow({ ...item, onPress: () => handleItem(item) }, i, {
                  active: activeRoute === item.route,
                  icon: item.icon,
                }),
              )}

              <View
                style={[styles.divider, { backgroundColor: borderColor }]}
              />

              <AppText style={[styles.sectionLabel, { color: textSecondary }]}>
                {t("appSidebar.myProfile")}
              </AppText>

              {staticItems.map(({ label, route, icon }, i) =>
                renderRow(
                  {
                    label,
                    route,
                    onPress: () => handleItem({ label, route }),
                  },
                  menuItems.length + i,
                  { active: activeRoute === route, icon },
                ),
              )}

              {/* Language */}
              <Animated.View
                style={[
                  itemStyle(menuItems.length + staticItems.length),
                  { marginTop: 4 },
                ]}
              >
                <Row
                  onPress={() => setLanguageOpen((v) => !v)}
                  accessibilityLabel={t("appSidebar.changeLanguage")}
                  style={styles.menuItem}
                >
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name="globe-outline"
                      size={20}
                      color={textSecondary}
                    />
                  </View>
                  <AppText
                    style={[styles.menuLabel, { color: textPrimary, flex: 1 }]}
                  >
                    {currentLangLabel}
                  </AppText>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: langAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "180deg"],
                          }),
                        },
                      ],
                    }}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={textSecondary}
                    />
                  </Animated.View>
                </Row>

                <Animated.View
                  style={[
                    styles.languageSubmenu,
                    {
                      height: langHeight,
                      opacity: langAnim,
                      borderLeftColor: borderColor,
                    },
                  ]}
                >
                  {LANGUAGES.map((lang) => {
                    const active = currentLang === lang.code;
                    return (
                      <Pressable
                        key={lang.code}
                        onPress={() => changeLanguage(lang.code)}
                        accessibilityRole="button"
                        accessibilityLabel={lang.native}
                        style={({ pressed }) => [
                          styles.languageOption,
                          active && { backgroundColor: primaryColor + "14" },
                          pressed && { opacity: 0.7 },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.languageOptionText,
                            {
                              color: active ? primaryColor : textPrimary,
                              fontWeight: active ? "700" : "500",
                            },
                          ]}
                        >
                          {lang.native}
                        </AppText>
                        {active && (
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={primaryColor}
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </Animated.View>
              </Animated.View>
            </ScrollView>

            <View
              style={[
                styles.logoutContainer,
                {
                  borderTopColor: borderColor,
                  paddingBottom: Math.max(insets.bottom, 12) + 8,
                },
              ]}
            >
              <Row
                onPress={confirmLogout}
                accessibilityLabel={t("appSidebar.logout")}
                style={[
                  styles.logoutButton,
                  { backgroundColor: errorColor + "10" },
                ]}
              >
                <Ionicons name="log-out-outline" size={20} color={errorColor} />
                <AppText style={[styles.logoutLabel, { color: errorColor }]}>
                  {t("appSidebar.logout")}
                </AppText>
              </Row>
              <AppText style={[styles.version, { color: textSecondary }]}>
                v1.0.0
              </AppText>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: Platform.OS === "android" ? 9999 : 0,
  },
  edgeZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: EDGE_ZONE_WIDTH,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 20, 12, 0.45)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: "100%",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.22,
        shadowRadius: 24,
      },
      android: { elevation: 24 },
    }),
  },

  profileHeader: {
    paddingBottom: 22,
    paddingHorizontal: 18,
    overflow: "hidden",
  },
  orbLarge: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -60,
    right: -60,
  },
  orbSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -30,
    left: -20,
  },
  profilePressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    padding: 3,
    marginRight: 14,
  },
  avatar: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: { flex: 1, justifyContent: "center" },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#B9F6CA",
    marginRight: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  menuScroll: { flex: 1 },
  menuContent: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 10,
    marginBottom: 2,
    borderRadius: 14,
    overflow: "hidden",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14.5,
    flex: 1,
    letterSpacing: 0.1,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
    marginHorizontal: 12,
  },

  languageSubmenu: {
    marginLeft: 30,
    marginTop: 4,
    borderLeftWidth: 1,
    paddingLeft: 8,
    overflow: "hidden",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  languageOptionText: {
    fontSize: 13.5,
  },

  logoutContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    overflow: "hidden",
  },
  logoutLabel: {
    fontSize: 14.5,
    fontWeight: "700",
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  version: {
    fontSize: 10.5,
    textAlign: "center",
    marginTop: 10,
    letterSpacing: 1,
  },
});

export default AppSidebar;
