import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "./common/AppText";

const SummaryCard = ({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  color = "#1565C0",
  onPress,
  loading = false,
}) => {
  const isDisabled = loading || !onPress;

  // Entrance
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  // Press
  const pressScale = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 6,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 10,
        }),
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scale, opacity, iconScale, iconRotate]);

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
        toValue: 0.85,
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
      bg: color,
      border: "rgba(255, 255, 255, 0.4)",
      iconBg: "rgba(255, 255, 255, 0.25)",
      glowColor: color,
    }),
    [color],
  );

  const iconSpin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
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
            backgroundColor: cardColors.bg,
            borderColor: cardColors.border,
            shadowColor: cardColors.glowColor,
            opacity: isDisabled && !loading ? 0.6 : 1,
          },
        ]}
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        <Animated.View
          style={{
            opacity: contentOpacity,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Glowing Translucent Icon Badge */}
          <Animated.View
            style={[
              styles.iconCircle,
              {
                backgroundColor: cardColors.iconBg,
                transform: [{ scale: iconScale }, { rotate: iconSpin }],
              },
            ]}
          >
            <Ionicons name={icon || "leaf"} size={20} color="#FFFFFF" />
          </Animated.View>

          {/* Label with explicit white color prop */}
          <AppText
            color="#FFFFFF"
            style={styles.label}
            numberOfLines={1}
          >
            {label}
          </AppText>

          {/* Value Row with explicit white color props */}
          <View style={styles.valueRow}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                {prefix ? (
                  <AppText color="#FFFFFF" style={styles.prefix}>
                    {prefix}
                  </AppText>
                ) : null}
                <AppText
                  color="#FFFFFF"
                  style={styles.value}
                  numberOfLines={1}
                >
                  {value}
                </AppText>
                {suffix ? (
                  <AppText color="rgba(255, 255, 255, 0.9)" style={styles.suffix}>
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
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  prefix: {
    fontSize: 12,
    fontWeight: "800",
    marginRight: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  suffix: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 2,
  },
});

export default React.memo(SummaryCard);
