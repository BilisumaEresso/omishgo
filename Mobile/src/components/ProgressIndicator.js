import React from "react";
import { StyleSheet, View } from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import { spacing } from "../constants/layout";

/**
 * ProgressIndicator - Step progress dots
 *
 * Supports:
 * - Multiple step indicators
 * - Completed, current, and pending states
 * - Role-based accent color for current step
 * - Customizable size and spacing
 */

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    borderRadius: 999,
    marginHorizontal: spacing.sm,
  },
  dotSmall: {
    width: 8,
    height: 8,
  },
  dotMedium: {
    width: 10,
    height: 10,
  },
  dotLarge: {
    width: 12,
    height: 12,
  },
  completed: {
    backgroundColor: neutralColors.success,
  },
  current: {
    backgroundColor: neutralColors.textDark,
  },
  pending: {
    backgroundColor: neutralColors.borderLight,
  },
});

const ProgressIndicator = React.forwardRef(
  (
    {
      currentStep = 0,
      totalSteps = 5,
      size = "medium", // 'small' | 'medium' | 'large'
      role = "farmer",
      style,
      containerStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    const roleColors = getRoleColors(role);

    const dotSize = {
      small: styles.dotSmall,
      medium: styles.dotMedium,
      large: styles.dotLarge,
    }[size];

    const containerStyles = [styles.container, containerStyle];

    return (
      <View ref={ref} style={containerStyles} testID={testID} {...props}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          let state = "pending";
          if (index < currentStep) {
            state = "completed";
          } else if (index === currentStep) {
            state = "current";
          }

          const dotColor = {
            completed: neutralColors.success,
            current: roleColors.primary,
            pending: neutralColors.borderLight,
          }[state];

          return (
            <View
              key={index}
              style={[
                styles.dot,
                dotSize,
                { backgroundColor: dotColor },
                style,
              ]}
              testID={`${testID}-dot-${index}`}
            />
          );
        })}
      </View>
    );
  },
);

ProgressIndicator.displayName = "ProgressIndicator";

export default ProgressIndicator;
