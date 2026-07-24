import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "./common/AppText";
import { useTheme } from "../hooks/useTheme";

const SummaryCard = ({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  color = "#4CAF50",
  onPress,
  loading = false,
}) => {
  const { theme } = useTheme();
  const textPrimary = theme?.colors?.textPrimary || "#333";
  const textSecondary = theme?.colors?.textSecondary || "#666";
  const textMuted = theme?.colors?.textMuted || "#888";

  const isDisabled = loading || !onPress;

  // Entrance
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const shineX = useRef(new Animated.Value(-1)).current;

  // Press
  const pressScale = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 9,
          bounciness: 6,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 10,
          bounciness: 10,
        }),
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(shineX, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scale, opacity, iconScale, iconRotate, shineX]);

  const handlePressIn = () => {
    if (isDisabled) return;
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 60,
        bounciness: 3,
      }),
      Animated.timing(contentOpacity, {
        toValue: 0.8,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 8,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const cardColors = useMemo(
    () => ({
      tintBg: color + "16",
      border: color + "2E",
    }),
    [color],
  );

  const iconSpin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
  });

  const shineTranslate = shineX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-80, 140],
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity,
          transform: [{ scale: Animated.multiply(scale, pressScale) }],
        },
      ]}
    >
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: cardColors.tintBg,
            borderColor: cardColors.border,
            shadowColor: color,
            opacity: isDisabled && !loading ? 0.55 : 1,
          },
        ]}
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${prefix}${value}${suffix}`}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {/* gloss sweep */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shine,
            {
              transform: [{ translateX: shineTranslate }, { rotate: "20deg" }],
            },
          ]}
        />

        <Animated.View
          style={{
            opacity: contentOpacity,
            alignItems: "center",
            transform: [{ scale: contentOpacity }],
          }}
        >
          <Animated.View
            style={[
              styles.iconCircle,
              {
                backgroundColor: color,
                shadowColor: color,
                transform: [{ scale: iconScale }, { rotate: iconSpin }],
              },
            ]}
          >
            <Ionicons name={icon} size={16} color="#fff" />
          </Animated.View>

          <AppText
            style={[styles.label, { color: textSecondary }]}
            numberOfLines={1}
          >
            {label}
          </AppText>

          <View style={styles.valueRow}>
            {loading ? (
              <ActivityIndicator size="small" color={color} />
            ) : (
              <>
                {prefix ? (
                  <AppText style={[styles.prefix, { color: textPrimary }]}>
                    {prefix}
                  </AppText>
                ) : null}
                <AppText
                  style={[styles.value, { color: textPrimary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {value}
                </AppText>
                {suffix ? (
                  <AppText style={[styles.suffix, { color: textMuted }]}>
                    {suffix}
                  </AppText>
                ) : null}
              </>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  shine: {
    position: "absolute",
    top: -20,
    width: 40,
    height: 120,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 3,
    textAlign: "center",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  prefix: {
    fontSize: 11,
    fontWeight: "600",
  },
  value: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  suffix: {
    fontSize: 10,
    marginLeft: 2,
  },
});

export default React.memo(SummaryCard);
