// Mobile/src/screens/onboarding/OnboardingCarousel.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import { useTheme } from "../../hooks/useTheme";

const { width } = Dimensions.get("window");

export default function OnboardingCarousel({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slides = useMemo(
    () => [
      {
        id: "1",
        image: require("../../assets/images/onboard_farmer.png"),
        title: t("onboarding.slide1Title"),
        description: t("onboarding.slide1Desc"),
      },
      {
        id: "2",
        image: require("../../assets/images/onboard_market.png"),
        title: t("onboarding.slide2Title"),
        description: t("onboarding.slide2Desc"),
      },
      {
        id: "3",
        image: require("../../assets/images/onboard_supply.png"),
        title: t("onboarding.slide3Title"),
        description: t("onboarding.slide3Desc"),
      },
      {
        id: "4",
        image: require("../../assets/images/onboard_track.png"),
        title: t("onboarding.slide4Title"),
        description: t("onboarding.slide4Desc"),
      },
    ],
    [t],
  );

  // Theme colors
  const primary = theme?.colors?.primary || "#2E7D32";
  const border = theme?.colors?.border || "#D0E8CE";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";

  const isLast = currentIndex === slides.length - 1;

  const onScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }, []);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => handleFinish();

  const handleFinish = async () => {
    await AsyncStorage.setItem("@onboarding_done", "true");
    navigation.replace("Login");
  };

  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: surface }]}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <AppText style={[styles.title, { color: textPrimary }]}>
        {item.title}
      </AppText>
      <AppText style={[styles.description, { color: textSecondary }]}>
        {item.description}
      </AppText>
    </View>
  );

  const renderDots = () =>
    slides.map((_, idx) => {
      const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [8, 24, 8],
        extrapolate: "clamp",
      });
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.4, 1, 0.4],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          key={idx}
          style={[
            styles.dot,
            {
              width: dotWidth,
              opacity,
              backgroundColor: idx === currentIndex ? primary : border,
            },
          ]}
        />
      );
    });

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      {/* Skip button */}
      {!isLast && (
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppText style={{ color: primary, fontWeight: "600", fontSize: 15 }}>
            {t("onboarding.skip")}
          </AppText>
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
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        style={styles.flatList}
      />

      {/* Bottom section */}
      <View style={styles.bottom}>
        <View style={styles.dotsContainer}>{renderDots()}</View>
        <AppButton
          title={t("onboarding.continue")}
          onPress={handleNext}
          fullWidth
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 20,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  flatList: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  image: {
    width: width * 0.85,
    height: 280,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  bottom: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
