import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { neutralColors } from "../constants/colors";
import { gaps, spacing } from "../constants/layout";



const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: neutralColors.backgroundLight,
  },
  keyboardAvoid: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: gaps.formGroup,
    paddingBottom: spacing.lg,
  },
  bodyContainer: {
    flex: 1,
  },
  illustrationSection: {
    alignItems: "center",
    marginBottom: gaps.formGroup,
  },
  contentSection: {
    marginBottom: gaps.formField,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: neutralColors.borderLight,
    backgroundColor: neutralColors.cardBg,
  },
});

const OnboardingLayout = React.forwardRef(
  (
    {
      header, // Progress indicator or skip button
      illustration,
      content, // Main content (card, text, etc.)
      footer, // Navigation footer
      scrollable = true,
      style,
      containerStyle,
      headerStyle,
      contentStyle,
      footerStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.wrapper, containerStyle]}>
            {/* Header */}
            {header && (
              <View
                style={[styles.headerContainer, headerStyle]}
                testID={`${testID}-header`}
              >
                {header}
              </View>
            )}

            {/* Body - Scrollable */}
            {scrollable ? (
              <ScrollView
                ref={ref}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                testID={testID}
                {...props}
              >
                {/* Illustration */}
                {illustration && (
                  <View
                    style={styles.illustrationSection}
                    testID={`${testID}-illustration`}
                  >
                    {illustration}
                  </View>
                )}

                {/* Content */}
                {content && (
                  <View
                    style={[styles.contentSection, contentStyle]}
                    testID={`${testID}-content`}
                  >
                    {content}
                  </View>
                )}
              </ScrollView>
            ) : (
              <View
                ref={ref}
                style={styles.bodyContainer}
                testID={testID}
                {...props}
              >
                {/* Illustration */}
                {illustration && (
                  <View
                    style={styles.illustrationSection}
                    testID={`${testID}-illustration`}
                  >
                    {illustration}
                  </View>
                )}

                {/* Content */}
                {content && (
                  <View
                    style={[styles.contentSection, contentStyle]}
                    testID={`${testID}-content`}
                  >
                    {content}
                  </View>
                )}
              </View>
            )}

            {/* Footer */}
            {footer && (
              <View
                style={[styles.footerContainer, footerStyle]}
                testID={`${testID}-footer`}
              >
                {footer}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  },
);

OnboardingLayout.displayName = "OnboardingLayout";

export default OnboardingLayout;
