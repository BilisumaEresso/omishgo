import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppCard from "./AppCard";
import AppText from "./AppText";

export default function AgriPriceChangeWidget({
  productName = "Teff",
  currentPrice = "5,200 ETB/q",
  changePercent = 12.5,
  changeLabel,
  onPress,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const textPrimary = theme?.colors?.textPrimary || "#1F2937";
  const textSecondary = theme?.colors?.textSecondary || "#6B7280";
  const success = theme?.colors?.success || "#4CAF50";
  const danger = theme?.colors?.danger || "#F44336";
  const successBg = theme?.colors?.successBg || "#E8F5E9";
  const dangerBg = theme?.colors?.dangerBg || "#FFEBEE";
  const dividerColor = theme?.colors?.border || "#E0E0E0";

  const isPositive = changePercent > 0;
  const changeColor = isPositive ? success : danger;
  const bgColor = isPositive ? successBg : dangerBg;
  const iconName = isPositive ? "trending-up" : "trending-down";
  const isSignificant = Math.abs(changePercent) >= 10;

  const label = changeLabel || t("agriPriceChangeWidget.todaysChange");

  // Entrance
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(12)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const percentAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  const [displayPercent, setDisplayPercent] = useState("0.0");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        delay: 150,
        useNativeDriver: true,
        speed: 10,
        bounciness: 10,
      }),
      Animated.timing(percentAnim, {
        toValue: changePercent,
        duration: 700,
        delay: 200,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    const listener = percentAnim.addListener(({ value }) => {
      setDisplayPercent(Math.abs(value).toFixed(1));
    });

    let pulseLoop;
    if (isSignificant) {
      pulseLoop = Animated.loop(
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
    }

    return () => {
      percentAnim.removeListener(listener);
      if (pulseLoop) pulseLoop.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePercent, isSignificant]);

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(pressScale, {
      toValue: 0.97,
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

  const formattedPercent = isPositive
    ? `+${displayPercent}%`
    : `-${displayPercent}%`;

  const Wrapper = onPress ? Pressable : View;

  return (
    <Animated.View
      style={{
        opacity: cardOpacity,
        transform: [{ translateY: cardTranslateY }, { scale: pressScale }],
      }}
    >
      <Wrapper
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={`${productName}, ${currentPrice}, ${label} ${formattedPercent}`}
      >
        <AppCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.left}>
              <View style={styles.iconWrapper}>
                {isSignificant && (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.pulseRing,
                      {
                        backgroundColor: changeColor,
                        opacity: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.35, 0],
                        }),
                        transform: [
                          {
                            scale: pulseAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.4],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                )}
                <Animated.View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: bgColor,
                      transform: [{ scale: iconScale }],
                    },
                  ]}
                >
                  <Ionicons name={iconName} size={28} color={changeColor} />
                </Animated.View>
              </View>

              <View style={styles.textCol}>
                <AppText
                  variant="caption"
                  style={{ color: textSecondary }}
                  numberOfLines={1}
                >
                  {productName}
                </AppText>
                <AppText
                  variant="headingMd"
                  style={{ color: textPrimary }}
                  numberOfLines={1}
                >
                  {currentPrice}
                </AppText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            <View style={styles.right}>
              <AppText
                variant="caption"
                style={{ color: textSecondary }}
                numberOfLines={1}
              >
                {label}
              </AppText>
              <AppText
                variant="headingSm"
                style={{ color: changeColor, fontWeight: "bold" }}
                numberOfLines={1}
              >
                {formattedPercent}
              </AppText>
            </View>
          </View>
        </AppCard>
      </Wrapper>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textCol: {
    flexShrink: 1,
    marginLeft: 12,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  right: {
    alignItems: "flex-end",
  },
});
