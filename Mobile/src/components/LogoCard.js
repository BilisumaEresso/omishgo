import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { neutralColors } from "../constants/colors";



const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: neutralColors.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardSmall: {
    padding: 16,
    borderRadius: 12,
  },
  cardLarge: {
    padding: 32,
    borderRadius: 20,
  },
  image: {
    resizeMode: "contain",
  },
  imageSizeSmall: {
    width: 60,
    height: 60,
  },
  imageSizeMedium: {
    width: 80,
    height: 80,
  },
  imageSizeLarge: {
    width: 120,
    height: 120,
  },
});

const LogoCard = React.forwardRef(
  (
    {
      source, // Image source (require or uri)
      size = "medium", // 'small' | 'medium' | 'large'
      style,
      imageStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    const cardSizeStyle = {
      small: styles.cardSmall,
      medium: styles.card,
      large: styles.cardLarge,
    }[size];

    const imageSizeStyle = {
      small: styles.imageSizeSmall,
      medium: styles.imageSizeMedium,
      large: styles.imageSizeLarge,
    }[size];

    const cardStyle = [styles.card, cardSizeStyle, style];

    const computedImageStyle = [styles.image, imageSizeStyle, imageStyle];

    return (
      <View style={styles.container}>
        <View ref={ref} style={cardStyle} testID={testID} {...props}>
          {source && (
            <Image
              source={source}
              style={computedImageStyle}
              testID={`${testID}-image`}
            />
          )}
        </View>
      </View>
    );
  },
);

LogoCard.displayName = "LogoCard";

export default LogoCard;
