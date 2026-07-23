// src/screens/SplashScreen.js
//
// OmishGo — "Living Emerald" splash screen.
// Premium, trusted, alive. Pure React Native — no required new deps.
// If `expo-linear-gradient` is installed it will be used automatically;
// otherwise it gracefully falls back to a solid background.

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import AppText from "../../components/common/AppText";
import { useTheme } from "../../hooks/useTheme";

// Optional gradient — used only if the package exists in the project.
let LinearGradient = null;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  LinearGradient = require("expo-linear-gradient").LinearGradient;
} catch (_) {
  LinearGradient = null;
}

// ---- Living Emerald palette ---------------------------------------------
const PALETTE = {
  deep: "#0B3B2E",
  emerald: "#0F5F45",
  jade: "#2FB47C",
  mist: "#EAF6EF",
  mistTop: "#F4FBF6",
  gold: "#C9A961",
  inkSoft: "#5B6B62",
  card: "#FFFFFF",
};

const WORDMARK = "OmishGo";

export default function SplashScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const colors = theme?.colors || {};
  const primary = colors.primary || PALETTE.emerald;
  const accent = colors.accent || PALETTE.jade;
  const background = colors.background || PALETTE.mist;

  // ---- Entrance values --------------------------------------------------
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(-6)).current; // degrees
  const logoPulse = useRef(new Animated.Value(1)).current;

  const letterAnims = useMemo(
    () => WORDMARK.split("").map(() => new Animated.Value(0)),
    [],
  );

  const hairlineWidth = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(12)).current;

  // Three phase-shifted rings (the "alive" signature)
  const rings = useRef([
    { scale: new Animated.Value(0), opacity: new Animated.Value(0) },
    { scale: new Animated.Value(0), opacity: new Animated.Value(0) },
    { scale: new Animated.Value(0), opacity: new Animated.Value(0) },
  ]).current;

  // Bottom three-dot bounce
  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Keep handles so we can .stop() on unmount
  const loopsRef = useRef([]);

  useEffect(() => {
    // --- Background fade ------------------------------------------------
    Animated.timing(bgOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // --- Rings enter (staggered), then breathe forever ------------------
    const ringTargets = [
      { scale: 1.0, opacity: 0.35 },
      { scale: 1.15, opacity: 0.18 },
      { scale: 1.35, opacity: 0.08 },
    ];

    rings.forEach((r, i) => {
      Animated.parallel([
        Animated.spring(r.scale, {
          toValue: ringTargets[i].scale,
          friction: 6,
          tension: 40,
          delay: 100 + i * 150,
          useNativeDriver: true,
        }),
        Animated.timing(r.opacity, {
          toValue: ringTargets[i].opacity,
          duration: 700,
          delay: 100 + i * 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Breathing loop, phase-shifted by index
        const breathe = Animated.loop(
          Animated.sequence([
            Animated.timing(r.scale, {
              toValue: ringTargets[i].scale + 0.08,
              duration: 2200,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(r.scale, {
              toValue: ringTargets[i].scale,
              duration: 2200,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        );
        loopsRef.current.push(breathe);
        breathe.start();
      });
    });

    // --- Logo entrance --------------------------------------------------
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        delay: 450,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 550,
        delay: 450,
        useNativeDriver: true,
      }),
      Animated.spring(logoRotate, {
        toValue: 0,
        friction: 5,
        tension: 50,
        delay: 450,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Micro-pulse forever, in sync with ring rhythm
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, {
            toValue: 1.02,
            duration: 2200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoPulse, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
      loopsRef.current.push(pulse);
      pulse.start();
    });

    // --- Wordmark: per-letter staggered rise ----------------------------
    Animated.stagger(
      45,
      letterAnims.map((a) =>
        Animated.timing(a, {
          toValue: 1,
          duration: 420,
          delay: 0,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
    // shift the whole stagger start
    letterAnims.forEach((a, i) => {
      a.setValue(0);
      Animated.timing(a, {
        toValue: 1,
        duration: 420,
        delay: 900 + i * 45,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    // --- Gold hairline draw --------------------------------------------
    Animated.timing(hairlineWidth, {
      toValue: 1,
      duration: 550,
      delay: 1300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width interpolation
    }).start();

    // --- Tagline --------------------------------------------------------
    Animated.parallel([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 520,
        delay: 1550,
        useNativeDriver: true,
      }),
      Animated.timing(taglineY, {
        toValue: 0,
        duration: 520,
        delay: 1550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // --- Three-dot bounce loop -----------------------------------------
    const dotLoop = Animated.loop(
      Animated.stagger(
        160,
        dots.map((d) =>
          Animated.sequence([
            Animated.timing(d, {
              toValue: 1,
              duration: 420,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(d, {
              toValue: 0,
              duration: 420,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    );
    loopsRef.current.push(dotLoop);
    setTimeout(() => dotLoop.start(), 1900);

    return () => {
      loopsRef.current.forEach((l) => l && l.stop && l.stop());
      loopsRef.current = [];
    };
  }, []);

  // ---- Derived interpolations -----------------------------------------
  const logoRotateDeg = logoRotate.interpolate({
    inputRange: [-6, 0],
    outputRange: ["-6deg", "0deg"],
  });

  const hairlineW = hairlineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 72],
  });

  // ---- Render ----------------------------------------------------------
  const Background = LinearGradient ? (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgOpacity }]}>
      <LinearGradient
        colors={[PALETTE.mistTop, PALETTE.mist, "#DDEEE3"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  ) : (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: background, opacity: bgOpacity },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PALETTE.mist} />
      {Background}

      <View style={styles.center}>
        {/* Three phase-shifted rings */}
        {rings.map((r, i) => (
          <Animated.View
            key={i}
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.ring,
              {
                borderColor: i === 0 ? primary : accent,
                opacity: r.opacity,
                transform: [{ scale: r.scale }],
              },
            ]}
          />
        ))}

        {/* Logo card */}
        <Animated.View
          style={[
            styles.logoCard,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, logoPulse) },
                { rotate: logoRotateDeg },
              ],
              shadowColor: PALETTE.deep,
            },
          ]}
        >
          <Image
            accessibilityRole="image"
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Wordmark — per-letter reveal */}
        <View accessibilityLabel={WORDMARK} style={styles.wordmarkRow}>
          {WORDMARK.split("").map((ch, i) => {
            const a = letterAnims[i];
            const translateY = a.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            });
            return (
              <Animated.View
                key={`${ch}-${i}`}
                style={{ opacity: a, transform: [{ translateY }] }}
              >
                <AppText style={[styles.brand, { color: PALETTE.deep }]}>
                  {ch}
                </AppText>
              </Animated.View>
            );
          })}
        </View>

        {/* Gold hairline */}
        <Animated.View
          style={[
            styles.hairline,
            { width: hairlineW, backgroundColor: PALETTE.gold },
          ]}
        />

        {/* Tagline */}
        <Animated.View
          style={{
            opacity: taglineOpacity,
            transform: [{ translateY: taglineY }],
          }}
        >
          <AppText style={styles.tagline}>{t("splash.subtitle")}</AppText>
        </Animated.View>
      </View>

      {/* Three-dot organic loader */}
      <View style={styles.loading}>
        {dots.map((d, i) => {
          const translateY = d.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -8],
          });
          const opacity = d.interpolate({
            inputRange: [0, 1],
            outputRange: [0.35, 1],
          });
          const scale = d.interpolate({
            inputRange: [0, 1],
            outputRange: [0.85, 1.1],
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === 1 ? PALETTE.jade : primary,
                  opacity,
                  transform: [{ translateY }, { scale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PALETTE.mist,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
  },
  logoCard: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: PALETTE.card,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
    elevation: 10,
  },
  logo: {
    width: 104,
    height: 104,
  },
  wordmarkRow: {
    flexDirection: "row",
    marginTop: 40,
    lineHeight: 40,
    padding:8
  },
  brand: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.4,
    lineHeight: 40
  },
  hairline: {
    height: 1.5,
    marginTop: 14,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 14.5,
    color: PALETTE.inkSoft,
    marginTop: 14,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  loading: {
    position: "absolute",
    bottom: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
