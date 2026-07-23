// Mobile/src/screens/onboarding/OnboardingCarousel.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";

import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import { useTheme } from "../../hooks/useTheme";

const { width, height } = Dimensions.get("window");

export default function OnboardingCarousel({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const flatListRef = useRef(null);

  const scrollX = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo(
    () => [
      {
        id: "1",
        image: require("../../assets/images/onboard_farmer.png"),
        title: t("onboarding.slide1Title"),
        description: t("onboarding.slide1Desc"),
        accent: "#2E7D32",
      },

      {
        id: "2",
        image: require("../../assets/images/onboard_market.png"),
        title: t("onboarding.slide2Title"),
        description: t("onboarding.slide2Desc"),
        accent: "#1565C0",
      },

      {
        id: "3",
        image: require("../../assets/images/onboard_supply.png"),
        title: t("onboarding.slide3Title"),
        description: t("onboarding.slide3Desc"),
        accent: "#EF8C00",
      },

      {
        id: "4",
        image: require("../../assets/images/onboard_track.png"),
        title: t("onboarding.slide4Title"),
        description: t("onboarding.slide4Desc"),
        accent: "#00897B",
      },
    ],
    [t],
  );

  const surface = theme?.colors?.surface || "#FFFFFF";

  const textPrimary = theme?.colors?.textPrimary || "#16351A";

  const textSecondary = theme?.colors?.textSecondary || "#557055";

  const isLast = currentIndex === slides.length - 1;

  const buttonColor = scrollX.interpolate({
    inputRange: slides.map((_, index) => index * width),

    outputRange: slides.map((slide) => slide.accent),

    extrapolate: "clamp",
  });

  const handleFinish = async () => {
    await AsyncStorage.setItem("@onboarding_done", "true");

    navigation.replace("Login");
  };

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

  const onScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);

    setCurrentIndex(index);
  }, []);

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],

    {
      useNativeDriver: false,
    },
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsRow}>
        {slides.map((slide, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],

            outputRange: [0.3, 1, 0.3],

            extrapolate: "clamp",
          });

          const dotWidth = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],

            outputRange: [8, 26, 8],

            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={slide.id}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: slide.accent,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderSlide = ({ item, index }) => {
    const imageScale = scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],

      outputRange: [0.94, 1, 0.94],

      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],

      outputRange: [0, 1, 0],

      extrapolate: "clamp",
    });

    return (
      <View
        style={[
          styles.slide,
          {
            width,
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={item.image}
            resizeMode="cover"
            style={[
              styles.image,
              {
                transform: [
                  {
                    scale: imageScale,
                  },
                ],
              },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity,
            },
          ]}
        >
          <AppText
            style={[
              styles.title,
              {
                color: textPrimary,
              },
            ]}
          >
            {item.title}
          </AppText>

          <AppText
            style={[
              styles.description,
              {
                color: textSecondary,
              },
            ]}
          >
            {item.description}
          </AppText>
        </Animated.View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surface,
        },
      ]}
    >
      <View style={styles.skip}>
        {!isLast && (
          <TouchableOpacity onPress={handleFinish}>
            <AppText
              style={{
                color: slides[currentIndex].accent,
                fontWeight: "700",
              }}
            >
              {t("onboarding.skip")}
            </AppText>
          </TouchableOpacity>
        )}
      </View>

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
        bounces={false}
      />

      <View style={styles.bottom}>
        {renderDots()}

        <View style={{ height: 25 }} />

        <Animated.View
          style={{
            width: "100%",
            backgroundColor: buttonColor,
            borderRadius: 18,

            transform: [
              {
                scale: scrollX.interpolate({
                  inputRange: [
                    currentIndex * width - width,
                    currentIndex * width,
                    currentIndex * width + width,
                  ],

                  outputRange: [0.96, 1, 0.96],

                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <AppButton
            title={
              isLast ? t("onboarding.getStarted") : t("onboarding.continue")
            }
            onPress={handleNext}
            fullWidth
            variant="primary"
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "transparent",
            }}
            textStyle={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "700",
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  skip: {
    position: "absolute",

    top: Platform.OS === "ios" ? 60 : 35,

    right: 24,

    zIndex: 20,
  },

  slide: {
    flex: 1,
  },

  imageWrapper: {
    height: "58%",

    width: "100%",

    overflow: "hidden",

    borderBottomLeftRadius: 40,

    borderBottomRightRadius: 40,
  },

  image: {
    width: "100%",

    height: "100%",
  },

  content: {
    paddingHorizontal: 32,

    paddingTop: 35,

    alignItems: "center",
  },

  title: {
    fontSize: 30,

    fontWeight: "800",

    textAlign: "center",

    marginBottom: 15,
    padding: 5,
    lineHeight:30
  },

  description: {
    fontSize: 17,

    lineHeight: 27,

    textAlign: "center",

    maxWidth: "85%",
  },

  bottom: {
    position: "absolute",

    bottom: 35,

    left: 24,

    right: 24,

    alignItems: "center",
  },

  dotsRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,
  },

  dot: {
    height: 8,

    borderRadius: 10,
  },
});
