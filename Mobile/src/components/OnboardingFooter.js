import React from "react";
import { StyleSheet, View } from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import { spacing } from "../constants/layout";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import Typography from "./Typography";



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: neutralColors.backgroundLight,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonFull: {
    flex: 1,
  },
  buttonHalf: {
    flex: 0.5,
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepCounter: {
    alignItems: "flex-start",
  },
  skipContainer: {
    alignItems: "flex-end",
  },
  divider: {
    height: 1,
    backgroundColor: neutralColors.borderLight,
    marginBottom: spacing.xl,
  },
});

const OnboardingFooter = React.forwardRef(
  (
    {
      onNext,
      onBack,
      onSkip,
      nextLabel = "Next",
      backLabel = "Back",
      skipLabel = "Skip",
      isLastStep = false,
      currentStep = 1,
      totalSteps = 5,
      role = "farmer",
      showStepCounter = true,
      showSkip = true,
      nextLoading = false,
      backLoading = false,
      nextDisabled = false,
      backDisabled = false,
      style,
      containerStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    const roleColors = getRoleColors(role);

    return (
      <View
        ref={ref}
        style={[styles.container, containerStyle]}
        testID={testID}
        {...props}
      >
        {/* Divider */}
        <View style={styles.divider} testID={`${testID}-divider`} />

        {/* Buttons Row */}
        <View style={styles.buttonRow} testID={`${testID}-buttons`}>
          {/* Back Button */}
          {currentStep > 1 && (
            <View style={styles.buttonHalf}>
              <SecondaryButton
                label={backLabel}
                onPress={onBack}
                loading={backLoading}
                disabled={backDisabled}
                size="medium"
                role={role}
                testID={`${testID}-back`}
              />
            </View>
          )}

          {/* Next/Continue Button */}
          <View style={[styles.buttonHalf, !onBack && styles.buttonFull]}>
            <PrimaryButton
              label={isLastStep ? "Get Started" : nextLabel}
              onPress={onNext}
              loading={nextLoading}
              disabled={nextDisabled}
              size="medium"
              role={role}
              testID={`${testID}-next`}
            />
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo} testID={`${testID}-info`}>
          {/* Step Counter */}
          {showStepCounter && (
            <View style={styles.stepCounter} testID={`${testID}-counter`}>
              <Typography variant="caption" color={neutralColors.textLight}>
                Step {currentStep} of {totalSteps}
              </Typography>
            </View>
          )}

          {/* Skip Button */}
          {showSkip && currentStep < totalSteps && (
            <View
              style={styles.skipContainer}
              testID={`${testID}-skip-container`}
            >
              <Typography
                variant="caption"
                color={roleColors.primary}
                onPress={onSkip}
                style={{ paddingVertical: spacing.sm }}
              >
                {skipLabel}
              </Typography>
            </View>
          )}
        </View>
      </View>
    );
  },
);

OnboardingFooter.displayName = "OnboardingFooter";

export default OnboardingFooter;
