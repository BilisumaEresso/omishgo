import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

const DEFAULT_DATA_KEYS = [
  { key: "dayMon", fallback: "Mon", value: 0.42 },
  { key: "dayTue", fallback: "Tue", value: 0.65 },
  { key: "dayWed", fallback: "Wed", value: 0.51 },
  { key: "dayThu", fallback: "Thu", value: 0.78 },
  { key: "dayToday", fallback: "Today", value: 0.92 },
];

export default function PriceTrendWidget({
  price = 12050,
  change = "+4.2%",
  currency = "ETB",
  title,
  marketLabel,
  data: dataProp,
  onPress,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const scheme = useColorScheme();

  const primary = theme?.colors?.primary || "#2563EB";
  const success = theme?.colors?.success || "#16A34A";
  const danger = theme?.colors?.danger || "#EF4444";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const text = theme?.colors?.text || "#1F2937";
  const textMuted = theme?.colors?.textMuted || "#6B7280";
  const isDark = scheme === "dark";

  const isPositive = useMemo(
    () => !String(change).trim().startsWith("-"),
    [change],
  );
  const trendColor = isPositive ? success : danger;

  const data = useMemo(
    () =>
      dataProp ||
      DEFAULT_DATA_KEYS.map((d) => ({
        label: t(d.key, d.fallback),
        value: d.value,
      })),
    [dataProp, t],
  );

  const maxValue = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value));
    return max > 0 ? max : 1;
  }, [data]);

  // Animated values
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(16)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const priceAnim = useRef(new Animated.Value(0)).current;

  const barAnims = useRef(data.map(() => new Animated.Value(0))).current;

  const [displayPrice, setDisplayPrice] = useState("0");

  useEffect(() => {
    const numericPrice = Number(String(price).replace(/[^0-9.-]/g, "")) || 0;

    // Staggered entrance
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(badgeScale, {
        toValue: 1,
        duration: 400,
        delay: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.6)),
      }),
      Animated.timing(priceAnim, {
        toValue: numericPrice,
        duration: 900,
        delay: 150,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
   const priceListener = priceAnim.addListener(({ value }) => {
     setDisplayPrice(String(Math.round(value)));
   });

    // Bars grow with stagger
    Animated.stagger(
      80,
      barAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 700,
          delay: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ),
    ).start();

    // Pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
      ]),
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
      priceAnim.removeListener(priceListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(pressScale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const resolvedTitle = title || t("priceTrend", "Price Trend");
  const resolvedMarketLabel =
    marketLabel || t("marketLabel", "Global market index");

  const CardWrapper = onPress ? Pressable : View;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslateY }, { scale: pressScale }],
        },
      ]}
    >
      <CardWrapper
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={`${resolvedTitle}, ${currency} ${displayPrice}, ${change}`}
      >
        <AppCard style={[styles.card, { backgroundColor: surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View
                style={[styles.iconPill, { backgroundColor: `${primary}15` }]}
              >
                <Ionicons name="trending-up" size={18} color={primary} />
              </View>
              <View style={styles.titleText}>
                <AppText
                  variant="body"
                  style={[styles.title, { color: text }]}
                  numberOfLines={1}
                >
                  {resolvedTitle}
                </AppText>
                <AppText
                  variant="caption"
                  style={[styles.marketLabel, { color: textMuted }]}
                  numberOfLines={1}
                >
                  {resolvedMarketLabel}
                </AppText>
              </View>
            </View>

            <Animated.View
              style={[
                styles.badge,
                {
                  backgroundColor: `${trendColor}15`,
                  transform: [{ scale: badgeScale }],
                },
              ]}
            >
              <Ionicons
                name={isPositive ? "arrow-up" : "arrow-down"}
                size={11}
                color={trendColor}
                style={styles.badgeIcon}
              />
              <AppText
                variant="caption"
                style={[styles.badgeText, { color: trendColor }]}
              >
                {change}
              </AppText>
            </Animated.View>
          </View>

          {/* Price row */}
          <View style={styles.priceRow}>
            <View style={styles.liveDot}>
              <View style={[styles.dot, { backgroundColor: primary }]} />
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    backgroundColor: primary,
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 0],
                    }),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <AppText variant="heading" style={[styles.price, { color: text }]}>
              {currency} {displayPrice}
            </AppText>
          </View>

          {/* Chart */}
          <View style={styles.chart}>
            {data.map((point, index) => {
              const barHeight = Math.max(14, (point.value / maxValue) * 80);

              return (
                <View key={`${point.label}-${index}`} style={styles.barColumn}>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: isDark ? `${primary}10` : "#F1F5F9" },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.barFill,
                        {
                          height: barHeight,
                          backgroundColor: primary,
                          borderRadius: barHeight / 2,
                          transformOrigin: "bottom",
                          transform: [{ scaleY: barAnims[index] }],
                          opacity: barAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.6, 1],
                          }),
                        },
                      ]}
                    />
                  </View>
                  <AppText
                    variant="caption"
                    style={[styles.axisLabel, { color: textMuted }]}
                    numberOfLines={1}
                  >
                    {point.label}
                  </AppText>
                </View>
              );
            })}
          </View>
        </AppCard>
      </CardWrapper>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  card: {
    padding: 30,
    borderRadius: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleText: {
    flexShrink: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  marketLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeIcon: {
    marginRight: 3,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  liveDot: {
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  pulseRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  price: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,padding:5
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 110,
    paddingTop: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 6,
  },
  barTrack: {
    width: "100%",
    height: 80,
    borderRadius: 16,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
  barFill: {
    width: 12,
  },
  axisLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "500",
  },
});
