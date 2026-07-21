import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROLE_TABS } from "../../constants/navigationTabs";
import { ROLES } from "../../constants/roles";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";

/* ── Design tokens ─────────────────────────────────────────── */
const BAR_BG = "#1A1C2E";
const BAR_TOP_HL = "rgba(255,255,255,0.05)";
const INACTIVE = "#6B7280";
const INACTIVE_STRONG = "#9AA3B2";
const HOME_SZ = 58;
const HOME_LIFT = 22;
const BAR_H = 64;

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

/* ── Motion helpers ────────────────────────────────────────── */
function useTabAnimations(tabs, activeTab) {
  // Persistent per-tab animated values keyed by label so tab set changes are safe.
  const store = useRef({}).current;

  tabs.forEach((t) => {
    if (!store[t.label]) {
      store[t.label] = {
        scale: new Animated.Value(1),
        progress: new Animated.Value(activeTab === t.label ? 1 : 0),
      };
    }
  });

  useEffect(() => {
    tabs.forEach((t) => {
      const v = store[t.label];
      if (!v) return;
      Animated.timing(v.progress, {
        toValue: activeTab === t.label ? 1 : 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab, tabs, store]);

  return store;
}

export default function BottomTabBar({ role, activeTab, onTabPress }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabs = ROLE_TABS[role] || ROLE_TABS[ROLES.FARMER];

  const primary = theme?.colors?.primary || "#2E7D32";
  const primaryLight = theme?.colors?.primaryLight || "#66BB6A";
  const screenBg = theme?.colors?.background || "#F9FBF9";

  const anim = useTabAnimations(tabs, activeTab);

  const pressIn = (label, to = 0.86) =>
    Animated.spring(anim[label].scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 220,
      bounciness: 3,
    }).start();

  const pressOut = (label) =>
    Animated.spring(anim[label].scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 200,
      bounciness: 6,
    }).start();

  /* Android system nav bar */
  useEffect(() => {
    if (Platform.OS !== "android") return;
    NavigationBar.setVisibilityAsync("hidden").catch(() => {});
    if (typeof NavigationBar.setBehaviorAsync === "function") {
      NavigationBar.setBehaviorAsync("overlay-swipe").catch(() => {});
    }
    if (typeof NavigationBar.setBackgroundColorAsync === "function") {
      NavigationBar.setBackgroundColorAsync("#00000000").catch(() => {});
    }
  }, []);

  const HOME_IDX = 2;
  const homeTab = tabs[HOME_IDX];
  const leftTabs = tabs.slice(0, HOME_IDX);
  const rightTabs = tabs.slice(HOME_IDX + 1);
  const homeActive = homeTab ? activeTab === homeTab.label : false;

  /* Home FAB: idle breathing while active + one-shot pop on activation */
  const homeBreath = useRef(new Animated.Value(1)).current;
  const homePop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop;
    if (homeActive) {
      homePop.setValue(0.92);
      Animated.spring(homePop, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 8,
      }).start();

      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(homeBreath, {
            toValue: 1.03,
            duration: 1600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(homeBreath, {
            toValue: 1,
            duration: 1600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    } else {
      homeBreath.setValue(1);
    }
    return () => loop && loop.stop();
  }, [homeActive, homeBreath, homePop]);

  const renderSide = (tab) => {
    const active = activeTab === tab.label;
    const [off, on] = ICON_PAIR[tab.label] || ICON_PAIR._default;
    const v = anim[tab.label];

    const pillOpacity = v.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const labelOpacity = v.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.75, 1],
    });
    const labelTranslate = v.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 0],
    });
    const dotScale = v.progress;

    const iconColor = active ? primaryLight : INACTIVE;
    const labelColor = active ? primaryLight : INACTIVE_STRONG;

    return (
      <Pressable
        key={tab.label}
        onPress={() => onTabPress?.(tab)}
        onPressIn={() => pressIn(tab.label, 0.82)}
        onPressOut={() => pressOut(tab.label)}
        style={styles.sideTab}
        android_ripple={null}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        pressRetentionOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityHint={`Switches to ${tab.label}`}
        accessibilityState={{ selected: active }}
      >
        <Animated.View
          style={{
            alignItems: "center",
            transform: [{ scale: v.scale }],
          }}
        >
          <View style={styles.iconPill}>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  borderRadius: 15,
                  backgroundColor: primary + "26",
                  opacity: pillOpacity,
                },
              ]}
            />
            <Ionicons name={active ? on : off} size={21} color={iconColor} />
          </View>
          <Animated.Text
            style={[
              styles.sideLabel,
              {
                color: labelColor,
                fontWeight: active ? "700" : "500",
                opacity: labelOpacity,
                transform: [{ translateY: labelTranslate }],
              },
            ]}
          >
            {SHORT[tab.label] || tab.label.toUpperCase()}
          </Animated.Text>
          <Animated.View
            style={[
              styles.activeDot,
              {
                backgroundColor: primary,
                opacity: v.progress,
                transform: [{ scale: dotScale }],
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    );
  };

  const homeProgress = useMemo(
    () => (homeTab ? anim[homeTab.label].progress : new Animated.Value(0)),
    [homeTab, anim],
  );

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {/* Home FAB */}
      {homeTab && (
        <Pressable
          onPress={() => onTabPress?.(homeTab)}
          onPressIn={() => pressIn(homeTab.label, 0.9)}
          onPressOut={() => pressOut(homeTab.label)}
          style={[
            styles.homeTouchArea,
            { top: -(HOME_SZ / 2 + HOME_LIFT) + BAR_H / 2 },
          ]}
          android_ripple={null}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Home"
          accessibilityHint="Switches to Home"
          accessibilityState={{ selected: homeActive }}
        >
          <Animated.View
            style={[
              styles.homeCircle,
              {
                backgroundColor: homeActive ? primary : "#252842",
                borderColor: screenBg,
                shadowColor: primary,
                transform: [
                  { scale: anim[homeTab.label].scale },
                  { scale: homeBreath },
                  { scale: homePop },
                ],
              },
            ]}
          >
            {/* Inner ring — fades in only when active */}
            <Animated.View
              pointerEvents="none"
              style={[styles.homeInnerRing, { opacity: homeProgress }]}
            />
            <Ionicons
              name="home"
              size={24}
              color={homeActive ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
            />
          </Animated.View>
          <Animated.Text
            style={[
              styles.homeLabel,
              {
                color: homeActive ? primary : "#8892A4",
                opacity: homeProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.75, 1],
                }),
              },
            ]}
          >
            HOME
          </Animated.Text>
        </Pressable>
      )}

      {/* Bar */}
      <View style={styles.bar}>
        <View pointerEvents="none" style={styles.barTopHighlight} />
        <View style={styles.side}>{leftTabs.map((t) => renderSide(t))}</View>
        <View style={styles.gap} />
        <View style={styles.side}>{rightTabs.map((t) => renderSide(t))}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center",
    width: "91%",
    maxWidth: 520,
    alignItems: "center",
  },
  bar: {
    width: "100%",
    height: BAR_H,
    backgroundColor: BAR_BG,
    borderRadius: BAR_H / 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 22,
      },
      android: { elevation: 22 },
    }),
  },
  barTopHighlight: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: BAR_TOP_HL,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  gap: { width: HOME_SZ + 20 },
  sideTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minWidth: 52,
    minHeight: 48,
  },
  iconPill: {
    width: 44,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sideLabel: {
    fontSize: 10,
    letterSpacing: 0.6,
    marginTop: 3,
    textAlign: "center",
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
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
    borderWidth: 4,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.32,
        shadowRadius: 16,
      },
      android: { elevation: 16 },
    }),
  },
  homeInnerRing: {
    position: "absolute",
    width: "92%",
    height: "92%",
    borderRadius: HOME_SZ / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  homeLabel: {
    fontSize: 10,
    letterSpacing: 0.7,
    fontWeight: "700",
    marginTop: 6,
  },
});
