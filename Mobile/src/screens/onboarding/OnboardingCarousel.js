import React, { useRef, useState, useCallback } from "react";
import {
  View, FlatList, StyleSheet, Dimensions, TouchableOpacity,
  StatusBar, SafeAreaView, Animated, Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

// MVP: 2 slides (farmer + buyer only — driver/supplier removed)
const getSlides = (t) => [
  {
    id: "sell",
    emoji: "🌾",
    title: t("onboarding.slide1Title"),
    description: t("onboarding.slide1Desc"),
    color: "#2e7d32",
    bg: "#e8f5e9",
  },
  {
    id: "buy",
    emoji: "🛒",
    title: t("onboarding.slide2Title"),
    description: t("onboarding.slide2Desc"),
    color: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    id: "connect",
    emoji: "💬",
    title: t("onboarding.slide3Title"),
    description: t("onboarding.slide3Desc"),
    color: "#6a1b9a",
    bg: "#f3e5f5",
  },
];

const OnboardingCarousel = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const slides = getSlides(t);

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }, []);

  const onScroll = useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
      useNativeDriver: false,
    }),
    [scrollX],
  );

  const isLast = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigation.replace("Login");
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleSkip = () => navigation.replace("Login");

  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.bg }]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.slideTitle, { color: item.color }]}>{item.title}</Text>
      <Text style={styles.slideDesc}>{item.description}</Text>
    </View>
  );

  const renderDots = () =>
    slides.map((_, idx) => {
      const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
      const w = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: "clamp" });
      const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: "clamp" });
      const color = slides[idx].color;
      return (
        <Animated.View
          key={idx}
          style={[styles.dot, { width: w, opacity, backgroundColor: color }]}
        />
      );
    });

  const currentColor = slides[currentIndex]?.color || "#2e7d32";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>{t("common.skip") || "Skip"}</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        style={styles.flatList}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        <View style={styles.dots}>{renderDots()}</View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: currentColor }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>
            {isLast ? t("common.continue") : `${t("common.continue")} →`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  skipBtn: { position: "absolute", top: 16, right: 24, zIndex: 10, padding: 8 },
  skipText: { fontSize: 15, color: "#888", fontWeight: "600" },
  flatList: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emoji: { fontSize: 80, marginBottom: 32 },
  slideTitle: { fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 16 },
  slideDesc: { fontSize: 16, color: "#555", textAlign: "center", lineHeight: 24 },
  bottom: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 24,
  },
  dots: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default OnboardingCarousel;
