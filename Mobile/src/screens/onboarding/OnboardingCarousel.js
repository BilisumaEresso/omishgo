// src/screens/onboarding/OnboardingCarousel.js
import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppText from "../../components/common/AppText";
import { getThemeByRole } from "../../constants/theme";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "buy",
    role: "buyer",
    title: "Buy Fresh Local Produce",
    description:
      "Source quality crops from verified Ethiopian farmers at competitive prices.",
    imageUri:
      "https://images.unsplash.com/vector-1756861912336-60ea0bcd7c90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFybSUyMG1hcmtldHxlbnwwfHwwfHx8MA%3D%3D",
    badge: "✨ Verified Sellers",
  },
  {
    id: "sell",
    role: "farmer",
    title: "Sell Agricultural Products Easily",
    description: "Directly connect with buyers from East Shewa to Addis Ababa.",
    imageUri:
      "https://images.unsplash.com/vector-1757327112287-47e121f8f0bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFybWVyfGVufDB8fDB8fHww",
    badge: null,
  },
  {
    id: "supply",
    role: "supplier",
    title: "Power the Harvest",
    description:
      "Supply seeds, fertilizers, and tools directly to farmers in need.",
    imageUri:
      "https://images.unsplash.com/vector-1769320709000-bf5132293619?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: null,
  },
  {
    id: "track",
    role: "driver",
    title: "Track and Grow",
    description: "Manage logistics and deliveries with real-time tracking.",
    imageUri:
      "https://images.unsplash.com/vector-1739803880008-09056660fbc7?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: null,
  },
];

const BUTTON_HEIGHT = 52;

const OnboardingCarousel = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Theme & UI state
  const [currentTheme, setCurrentTheme] = useState(
    getThemeByRole(slides[0].role),
  );
  const [displayedTitle, setDisplayedTitle] = useState(slides[0].title);
  const [displayedDescription, setDisplayedDescription] = useState(
    slides[0].description,
  );
  const [isLastScreen, setIsLastScreen] = useState(false);

  // Animation values for smooth transitions
  const textFade = useRef(new Animated.Value(1)).current;
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(1)).current;
  const buttonBgColor = useRef(new Animated.Value(0)).current; // 0 → 1 for color transition

  // Helper: animate text content change
  const animateTextChange = (newTitle, newDescription) => {
    Animated.parallel([
      Animated.timing(textFade, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 10,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDisplayedTitle(newTitle);
      setDisplayedDescription(newDescription);
      Animated.parallel([
        Animated.timing(textFade, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Animate button background color transition
  const animateButtonColor = (newColorHex) => {
    // We'll interpolate from 0→1 and use a custom color interpolation
    // For simplicity, we crossfade the button instead of complex RGB animation
    Animated.sequence([
      Animated.timing(buttonFade, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Update everything when slide changes (after scroll ends)
  const onScrollEnd = useCallback(
    (event) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      if (index !== currentIndex) {
        const newTheme = getThemeByRole(slides[index].role);
        setCurrentTheme(newTheme);
        animateTextChange(slides[index].title, slides[index].description);
        animateButtonColor(newTheme.colors.primary);
        setCurrentIndex(index);
        setIsLastScreen(index === slides.length - 1);
      }
    },
    [currentIndex],
  );

  // Track scroll for image animations & dots
  const onScroll = useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
      useNativeDriver: false, // needed for scrollX interpolation
    }),
    [scrollX],
  );

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const goToWelcome = () => {
    navigation.navigate("Welcome");
  };

  const isLast = currentIndex === slides.length - 1;

  // Extract current theme colors (with fallbacks)
  const primaryColor = currentTheme?.colors?.primary || "#4CAF50";
  const textInverse = currentTheme?.colors?.textInverse || "#FFFFFF";
  const bgColor = currentTheme?.colors?.background || "#F5F5F5";
  const surfaceColor = currentTheme?.colors?.surface || "#FFFFFF";
  const borderColor = currentTheme?.colors?.border || "#E0E0E0";
  const textPrimary = currentTheme?.colors?.textPrimary || "#212121";
  const textSecondary = currentTheme?.colors?.textSecondary || "#757575";

  // Image animation (scale + parallax)
  const renderImageItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.96, 1, 0.96],
      extrapolate: "clamp",
    });
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.1, 0, -width * 0.1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.imageSlide}>
        <Animated.View
          style={[
            styles.imageCard,
            {
              backgroundColor: surfaceColor,
              borderColor: borderColor,
              transform: [{ scale }, { translateX }],
            },
          ]}
        >
          <Image
            source={{ uri: item.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          {item.badge && (
            <View style={styles.badge}>
              <AppText variant="caption" style={{ fontWeight: "600" }}>
                {item.badge}
              </AppText>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  // Animated pagination dots (width & scale)
  const renderDots = () => {
    return slides.map((_, idx) => {
      const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
      const widthAnim = scrollX.interpolate({
        inputRange,
        outputRange: [8, 28, 8],
        extrapolate: "clamp",
      });
      const opacityAnim = scrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: "clamp",
      });
      const scaleAnim = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1.1, 0.8],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          key={idx}
          style={[
            styles.dot,
            {
              backgroundColor: primaryColor,
              width: widthAnim,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      );
    });
  };

  // Button press animation
  const buttonScale = useRef(new Animated.Value(1)).current;
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleButtonPress = () => {
    animateButtonPress();
    if (isLast) {
      goToWelcome();
    } else {
      goToNext();
    }
  };

  // Background crossfade for smooth theme transition
  const bgOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    // Animate background color change by fading a overlay
    // We keep two layers: main background (instant) + overlay that fades out
    // For simplicity, we'll use a short fade on the whole screen? Not needed.
    // Instead, we rely on button color animation and text animation.
  }, [bgColor]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={bgColor} />

      {/* Skip button (only on non-last screens) */}
      {!isLast && (
        <TouchableOpacity
          onPress={goToWelcome}
          style={styles.skipButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <AppText variant="bodyMd" style={{ color: textSecondary }}>
            Skip
          </AppText>
        </TouchableOpacity>
      )}

      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderImageItem}
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
        />
      </View>

      {/* Bottom Section – Animated Text & Button */}
      <View style={styles.bottomSection}>
        <View style={styles.dotsRow}>{renderDots()}</View>

        <Animated.View
          style={{
            opacity: textFade,
            transform: [{ translateY: textTranslateY }],
          }}
        >
          <AppText
            variant="headingMd"
            style={[styles.title, { color: textPrimary }]}
          >
            {displayedTitle}
          </AppText>
          <AppText
            variant="bodyMd"
            style={[styles.description, { color: textSecondary }]}
          >
            {displayedDescription}
          </AppText>
        </Animated.View>

        {/* Single button with crossfade text */}
        <Animated.View
          style={{
            transform: [{ scale: buttonScale }],
            width: "100%",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={[
              styles.button,
              {
                backgroundColor: primaryColor,
                opacity: buttonFade,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleButtonPress}
              activeOpacity={1}
              style={styles.buttonInner}
            >
              <Animated.Text
                style={[
                  styles.buttonText,
                  { color: textInverse, fontWeight: "600" },
                ]}
              >
                {isLast ? "Get Started" : "Next →"}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 16,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  carouselContainer: {
    height: height * 0.5,
    marginTop: 40,
  },
  imageSlide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  imageCard: {
    width: "100%",
    aspectRatio: 0.8,
    maxHeight: height * 0.4,
    borderRadius: 32,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    height: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
    minWidth: 200,
  },
  buttonInner: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default OnboardingCarousel;
