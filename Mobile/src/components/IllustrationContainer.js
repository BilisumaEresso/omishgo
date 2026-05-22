import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { getRoleColors } from "../constants/colors";
import { borderRadius, gaps } from "../constants/layout";

/**
 * IllustrationContainer - Container for onboarding illustrations
 *
 * Supports:
 * - Display large illustrations/images
 * - Background color variants
 * - Aspect ratio preservation
 * - Role-based background tint
 * - Multiple sizes
 */

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: gaps.formGroup,
  },
  containerSmall: {
    height: 200,
  },
  containerMedium: {
    height: 280,
  },
  containerLarge: {
    height: 360,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

const IllustrationContainer = React.forwardRef(
  (
    {
      source, // Image source (require or uri)
      size = "medium", // 'small' | 'medium' | 'large'
      role = "farmer",
      backgroundColor, // Override background color
      overlayContent, // Optional overlay content
      overlayOpacity = 0.1,
      style,
      imageStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    const roleColors = getRoleColors(role);

    const containerSize = {
      small: styles.containerSmall,
      medium: styles.containerMedium,
      large: styles.containerLarge,
    }[size];

    const bgColor = backgroundColor || roleColors.lighter;

    const containerStyle = [
      styles.container,
      containerSize,
      {
        backgroundColor: bgColor,
      },
      style,
    ];

    return (
      <View ref={ref} style={containerStyle} testID={testID} {...props}>
        {/* Background Image */}
        {source && (
          <Image
            source={source}
            style={[styles.image, imageStyle]}
            testID={`${testID}-image`}
          />
        )}

        {/* Optional Overlay Content */}
        {overlayContent && (
          <View
            style={[
              styles.overlay,
              {
                backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
              },
            ]}
            testID={`${testID}-overlay`}
            pointerEvents="none"
          >
            <View style={styles.content} testID={`${testID}-content`}>
              {overlayContent}
            </View>
          </View>
        )}
      </View>
    );
  },
);

IllustrationContainer.displayName = "IllustrationContainer";

export default IllustrationContainer;
