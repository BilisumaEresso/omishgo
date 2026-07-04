import React, { useRef, useEffect } from "react";
import { View, Pressable, StyleSheet, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { ROLE_TABS } from "../../constants/navigationTabs";
import { ROLES } from "../../constants/roles";
import * as NavigationBar from "expo-navigation-bar";

const BAR_BG = "#1A1C2E";
const INACTIVE = "#6B7280";
const HOME_SZ = 58;
const HOME_LIFT = 22;
const BAR_H = 66;

const ICON_PAIR = {
  Home: ["home-outline", "home"],
  Orders: ["receipt-outline", "receipt"],
  Products: ["leaf-outline", "leaf"],
  Insights: ["stats-chart-outline", "stats-chart"],
  Profile: ["person-outline", "person"],
  Marketplace: ["storefront-outline", "storefront"],
  Saved: ["bookmark-outline", "bookmark"],
  _default: ["apps-outline", "apps"],
};

const SHORT = {
  Home: "HOME",
  Orders: "ORDERS",
  Products: "SELL",
  Insights: "MARKET",
  Profile: "PROFILE",
  Marketplace: "BROWSE",
  Saved: "SAVED",
};

export default function BottomTabBar({ role, activeTab, onTabPress }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabs = ROLE_TABS[role] || ROLE_TABS[ROLES.FARMER];

  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryLight = theme?.colors?.primaryLight || "#66BB6A";
  const primaryDark = theme?.colors?.primaryDark || "#1B5E20";
  // Screen background color — used as the border around the Home circle so it
  // looks like it's punching through the bar
  const screenBg = theme?.colors?.background || "#F9FBF9";

  const scales = useRef(tabs.map(() => new Animated.Value(1))).current;
  const spring = (i, to) =>
    Animated.spring(scales[i], {
      toValue: to,
      useNativeDriver: true,
      speed: 180,
      bounciness: 5,
    }).start();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden").catch(() => {});
      if (typeof NavigationBar.setBehaviorAsync === "function") {
        NavigationBar.setBehaviorAsync("overlay-swipe").catch(() => {});
      }
    }
  }, []);

  const HOME_IDX = 2;
  const homeTab = tabs[HOME_IDX];
  const leftTabs = tabs.slice(0, HOME_IDX);
  const rightTabs = tabs.slice(HOME_IDX + 1);
  const homeActive = activeTab === homeTab?.label;

  const renderSide = (tab, absIdx) => {
    const active = activeTab === tab.label;
    const [off, on] = ICON_PAIR[tab.label] || ICON_PAIR._default;
    const iconColor = active ? primaryLight : INACTIVE;
    const labelColor = active ? primaryLight : INACTIVE;
    const pillBg = active ? primary + "2E" : "transparent"; // ~18% opacity

    return (
      <Pressable
        key={tab.label}
        onPress={() => onTabPress?.(tab)}
        onPressIn={() => spring(absIdx, 0.78)}
        onPressOut={() => spring(absIdx, 1)}
        style={styles.sideTab}
        android_ripple={null}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: active }}
      >
        <Animated.View
          style={{
            alignItems: "center",
            transform: [{ scale: scales[absIdx] }],
          }}
        >
          <View style={[styles.iconPill, { backgroundColor: pillBg }]}>
            <Ionicons name={active ? on : off} size={21} color={iconColor} />
          </View>
          <AppText
            style={[
              styles.sideLabel,
              { color: labelColor, fontWeight: active ? "700" : "400" },
            ]}
          >
            {SHORT[tab.label] || tab.label.toUpperCase()}
          </AppText>
          {active && (
            <View style={[styles.activeDot, { backgroundColor: primary }]} />
          )}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* Home circle — floats above bar center */}
      {homeTab && (
        <Pressable
          onPress={() => onTabPress?.(homeTab)}
          onPressIn={() => spring(HOME_IDX, 0.86)}
          onPressOut={() => spring(HOME_IDX, 1)}
          style={[
            styles.homeTouchArea,
            { top: -(HOME_SZ / 2 + HOME_LIFT) + BAR_H / 2 },
          ]}
          android_ripple={null}
          accessibilityRole="button"
          accessibilityLabel="Home"
          accessibilityState={{ selected: homeActive }}
        >
          <Animated.View
            style={[
              styles.homeCircle,
              {
                backgroundColor: homeActive ? primary : primaryDark,
                borderColor: screenBg,
                shadowColor: primary,
                transform: [{ scale: scales[HOME_IDX] }],
              },
            ]}
          >
            <Ionicons
              name="home"
              size={26}
              color={homeActive ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
            />
          </Animated.View>
          <AppText
            style={[
              styles.homeLabel,
              { color: homeActive ? primary : "#8892A4" },
            ]}
          >
            HOME
          </AppText>
        </Pressable>
      )}

      {/* Bar */}
      <View style={styles.bar}>
        <View style={styles.side}>
          {leftTabs.map((t, i) => renderSide(t, i))}
        </View>
        <View style={styles.gap} />
        <View style={styles.side}>
          {rightTabs.map((t, i) => renderSide(t, i + HOME_IDX + 1))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center",
    width: "91%",
    alignItems: "center",
  },
  bar: {
    width: "100%",
    height: BAR_H,
    backgroundColor: BAR_BG,
    borderRadius: BAR_H / 2,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 20,
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
  gap: { width: HOME_SZ + 16 },
  sideTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minWidth: 52,
  },
  iconPill: {
    width: 40,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sideLabel: {
    fontSize: 10,
    letterSpacing: 0.7,
    marginTop: 2,
    textAlign: "center",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
  homeTouchArea: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 20,
  },
  homeCircle: {
    width: HOME_SZ,
    height: HOME_SZ,
    borderRadius: HOME_SZ / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.38,
        shadowRadius: 12,
      },
      android: { elevation: 16 },
    }),
  },
  homeLabel: {
    fontSize: 10,
    letterSpacing: 0.7,
    fontWeight: "700",
    marginTop: 6,
  },
});
