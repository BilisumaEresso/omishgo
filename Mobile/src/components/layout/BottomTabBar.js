import React, { useRef, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { ROLE_TABS } from "../../constants/navigationTabs";
import { ROLES } from "../../constants/roles";
import * as NavigationBar from "expo-navigation-bar";

const BAR_BG       = "#1A1C2E";   // dark navy — consistent across both roles
const INACTIVE_CLR = "#6B7280";   // neutral grey — readable on dark
const ACTIVE_CLR   = "#FFFFFF";   // active non-home tabs are WHITE on dark bg
const HOME_SIZE    = 58;          // home circle diameter
const HOME_LIFT    = 24;          // how many px the home circle rises above bar top
const BAR_HEIGHT   = 68;          // taller than before — easier touch targets

// ── Icon pairs [outline, filled] for each tab label ──────────────────────
const ICON_PAIR = {
  Home:        ["home-outline",        "home"],
  Orders:      ["receipt-outline",     "receipt"],
  Products:    ["leaf-outline",        "leaf"],
  Insights:    ["stats-chart-outline", "stats-chart"],
  Profile:     ["person-outline",      "person"],
  Marketplace: ["storefront-outline",  "storefront"],
  Saved:       ["bookmark-outline",    "bookmark"],
  _fallback:   ["apps-outline",        "apps"],
};

// ── Short readable labels — farmer-friendly, all caps ────────────────────
const LABEL = {
  Home:        "HOME",
  Orders:      "ORDERS",
  Products:    "SELL",
  Insights:    "MARKET",
  Profile:     "PROFILE",
  Marketplace: "BROWSE",
  Saved:       "SAVED",
};

export default function BottomTabBar({ role, activeTab, onTabPress }) {
  const { theme }   = useTheme();
  const insets      = useSafeAreaInsets();
  const tabs        = ROLE_TABS[role] || ROLE_TABS[ROLES.FARMER];

  // Pull only the role-specific colors — rest of bar is hardcoded dark
  const primary      = theme?.colors?.primary      || "#2E7D32";
  const primaryLight = theme?.colors?.primaryLight || "#66BB6A";
  const primaryDark  = theme?.colors?.primaryDark  || "#1B5E20";

  // Per-tab scale springs
  const scales = useRef(tabs.map(() => new Animated.Value(1))).current;
  const spring = (i, to) =>
    Animated.spring(scales[i], {
      toValue: to,
      useNativeDriver: true,
      speed: 160,
      bounciness: 6,
    }).start();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      if (typeof NavigationBar.setBehaviorAsync === "function") {
        NavigationBar.setBehaviorAsync("overlay-swipe");
      }
    }
  }, []);

  // Home is always at index 2 (center). Left = [0,1], Right = [3,4]
  const homeIndex = 2;
  const homeTab   = tabs[homeIndex];
  const leftTabs  = tabs.slice(0, homeIndex);
  const rightTabs = tabs.slice(homeIndex + 1);
  const homeActive = activeTab === homeTab?.label;

  // ── Render a regular (non-home) side tab ─────────────────────────────
  const renderTab = (tab, absIndex) => {
    const active  = activeTab === tab.label;
    const [off, on] = ICON_PAIR[tab.label] || ICON_PAIR._fallback;
    const iconClr  = active ? ACTIVE_CLR : INACTIVE_CLR;
    const labelClr = active ? ACTIVE_CLR : INACTIVE_CLR;

    return (
      <Pressable
        key={tab.label}
        onPress={() => onTabPress?.(tab)}
        onPressIn={() => spring(absIndex, 0.80)}
        onPressOut={() => spring(absIndex, 1)}
        style={styles.sideTab}
        android_ripple={null}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: active }}
      >
        <Animated.View
          style={{
            alignItems: "center",
            gap: 4,
            transform: [{ scale: scales[absIndex] }],
          }}
        >
          {/* Icon — with a subtle tinted bg when active */}
          <View style={[
            styles.iconWrap,
            active && { backgroundColor: primary + "28" },
          ]}>
            <Ionicons
              name={active ? on : off}
              size={24}
              color={iconClr}
            />
          </View>

          {/* Label */}
          <AppText style={[
            styles.sideLabel,
            { color: labelClr, fontWeight: active ? "700" : "400" },
          ]}>
            {LABEL[tab.label] || tab.label.toUpperCase()}
          </AppText>

          {/* Active dot — role primary color */}
          {active && (
            <View style={[styles.dot, { backgroundColor: primary }]} />
          )}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.outerWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>

      {/* ── Home circle — rises above the bar ── */}
      {homeTab && (
        <Pressable
          onPress={() => onTabPress?.(homeTab)}
          onPressIn={() => spring(homeIndex, 0.87)}
          onPressOut={() => spring(homeIndex, 1)}
          style={styles.homeTouchArea}
          android_ripple={null}
          accessibilityRole="button"
          accessibilityLabel="Home"
          accessibilityState={{ selected: homeActive }}
        >
          <Animated.View style={[
            styles.homeCircle,
            {
              backgroundColor: homeActive ? primaryLight : primary,
              shadowColor: primaryDark,
              transform: [{ scale: scales[homeIndex] }],
            },
          ]}>
            <Ionicons
              name={homeActive ? "home" : "home-outline"}
              size={28}
              color="#FFFFFF"
            />
          </Animated.View>
          {/* Home label below circle, inside bar */}
          <AppText style={[styles.homeLabel, { color: homeActive ? primaryLight : ACTIVE_CLR }]}>
            HOME
          </AppText>
        </Pressable>
      )}

      {/* ── Dark pill bar ── */}
      <View style={[styles.bar, { shadowColor: primaryDark }]}>
        {/* Left 2 tabs */}
        <View style={styles.side}>
          {leftTabs.map((tab, i) => renderTab(tab, i))}
        </View>

        {/* Gap in the middle for the home circle */}
        <View style={styles.homeGap} />

        {/* Right 2 tabs */}
        <View style={styles.side}>
          {rightTabs.map((tab, i) => renderTab(tab, i + homeIndex + 1))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    alignSelf: "center",
    width: "90%",
    alignItems: "center",
  },
  bar: {
    width: "100%",
    height: BAR_HEIGHT,
    backgroundColor: BAR_BG,
    borderRadius: BAR_HEIGHT / 2,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
      },
      android: { elevation: 22 },
    }),
  },
  side: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  homeGap: {
    width: HOME_SIZE + 16,
  },
  sideTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minWidth: 52,
  },
  iconWrap: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sideLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  // Home circle
  homeTouchArea: {
    position: "absolute",
    top: -(HOME_SIZE / 2 + HOME_LIFT - BAR_HEIGHT / 2),
    alignSelf: "center",
    alignItems: "center",
    zIndex: 20,
  },
  homeCircle: {
    width: HOME_SIZE,
    height: HOME_SIZE,
    borderRadius: HOME_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: BAR_BG,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: { elevation: 16 },
    }),
  },
  homeLabel: {
    fontSize: 10,
    letterSpacing: 0.6,
    fontWeight: "700",
    marginTop: HOME_SIZE / 2 + HOME_LIFT - BAR_HEIGHT / 2 + 8,
  },
});
