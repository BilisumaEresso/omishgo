import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
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
import { ROLE_TABS } from "../../constants/navigationTabs";
import { ROLES } from "../../constants/roles";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

/* ── Design tokens ─────────────────────────────────────────── */
const CENTER_SZ = 50;
const CENTER_LIFT = 0; // Sits lower & flush with tab bar
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

/* ── Motion helpers ────────────────────────────────────────── */
function useTabAnimations(tabs, activeTab) {
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
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab, tabs, store]);

  return store;
}

export default function BottomTabBar({ role, activeTab, onTabPress }) {
  const { theme } = useTheme();
  const { user, role: authRole } = useAuthStore();
  const insets = useSafeAreaInsets();

  const activeRole = role || authRole || user?.role || "farmer";
  const tabs = ROLE_TABS[activeRole] || ROLE_TABS[ROLES.FARMER];

  const activeColor =
    theme?.colors?.primary || (activeRole === "buyer" ? "#1565C0" : "#2E7D32");
  const primaryDark =
    theme?.colors?.primaryDark ||
    (activeRole === "buyer" ? "#0D47A1" : "#1B5E20");
  const gradientContainer =
    theme?.colors?.primaryContainer ||
    (activeRole === "buyer" ? "#E3F2FD" : "#E8F5E9");
  const inactiveColor = theme?.colors?.textSecondary || "#5A6072";

  const anim = useTabAnimations(tabs, activeTab);

  const pressIn = (label, to = 0.88) =>
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

  /* Android navigation bar setup with clean contrast */
  useEffect(() => {
    if (Platform.OS !== "android") return;
    NavigationBar.setVisibilityAsync("visible").catch(() => {});
    if (typeof NavigationBar.setBackgroundColorAsync === "function") {
      NavigationBar.setBackgroundColorAsync("#FFFFFF").catch(() => {});
    }
    if (typeof NavigationBar.setButtonStyleAsync === "function") {
      NavigationBar.setButtonStyleAsync("dark").catch(() => {});
    }
  }, []);

  const CENTER_IDX = 2;
  const centerTab = tabs[CENTER_IDX];
  const leftTabs = tabs.slice(0, CENTER_IDX);
  const rightTabs = tabs.slice(CENTER_IDX + 1);
  const centerActive = centerTab ? activeTab === centerTab.label : false;

  const centerPop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (centerActive) {
      centerPop.setValue(0.92);
      Animated.spring(centerPop, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 8,
      }).start();
    }
  }, [centerActive, centerPop]);

  const renderTabItem = (tab) => {
    const active = activeTab === tab.label;
    const [off, on] = ICON_PAIR[tab.label] || ICON_PAIR._default;
    const v = anim[tab.label];

    const iconColor = active ? activeColor : inactiveColor;
    const labelColor = active ? activeColor : inactiveColor;

    return (
      <Pressable
        key={tab.label}
        onPress={() => onTabPress?.(tab)}
        onPressIn={() => pressIn(tab.label)}
        onPressOut={() => pressOut(tab.label)}
        style={styles.sideTab}
        android_ripple={null}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: active }}
      >
        <Animated.View
          style={{
            alignItems: "center",
            transform: [{ scale: v.scale }],
          }}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={active ? on : off} size={24} color={iconColor} />
          </View>
          <Animated.Text
            style={[
              styles.sideLabel,
              {
                color: labelColor,
                fontWeight: active ? "700" : "500",
              },
            ]}
          >
            {tab.label}
          </Animated.Text>
        </Animated.View>
      </Pressable>
    );
  };

  const calculatedBottomPadding = Math.max(
    insets.bottom,
    Platform.OS === "android" ? 14 : 8,
  );

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={["#FFFFFF", gradientContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.barWrapper, { paddingBottom: calculatedBottomPadding }]}
      >
        {/* Center Floating Action Button with Gradient */}
        {centerTab && (
          <Pressable
            onPress={() => onTabPress?.(centerTab)}
            onPressIn={() => pressIn(centerTab.label, 0.9)}
            onPressOut={() => pressOut(centerTab.label)}
            style={[
              styles.centerTouchArea,
              { top: (BAR_H - CENTER_SZ) / 2 - CENTER_LIFT },
            ]}
            android_ripple={null}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={centerTab.label}
            accessibilityState={{ selected: centerActive }}
          >
            <Animated.View
              style={{
                transform: [
                  { scale: anim[centerTab.label].scale },
                  { scale: centerPop },
                ],
              }}
            >
              <LinearGradient
                colors={[activeColor, primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.centerCircle,
                  {
                    shadowColor: activeColor,
                  },
                ]}
              >
                <Ionicons
                  name={ICON_PAIR[centerTab.label]?.[1] || "scan-outline"}
                  size={25}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </Animated.View>
          </Pressable>
        )}

        {/* Bar */}
        <View style={styles.bar}>
          <View style={styles.side}>
            {leftTabs.map((t) => renderTabItem(t))}
          </View>
          <View style={styles.gap} />
          <View style={styles.side}>
            {rightTabs.map((t) => renderTabItem(t))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  barWrapper: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  bar: {
    width: "100%",
    height: BAR_H,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  gap: {
    width: CENTER_SZ + 16,
  },
  sideTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  sideLabel: {
    fontSize: 12,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  centerTouchArea: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 20,
  },
  centerCircle: {
    width: CENTER_SZ,
    height: CENTER_SZ,
    borderRadius: CENTER_SZ / 2,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});
