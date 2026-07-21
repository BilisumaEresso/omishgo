import React from "react";
import { StyleSheet, View } from "react-native";
import { getRoleColors, neutralColors } from "../constants/colors";
import { borderRadius, gaps, shadows, spacing } from "../constants/layout";
import Typography from "./Typography";



const styles = StyleSheet.create({
  card: {
    backgroundColor: neutralColors.cardBg,
    borderRadius: borderRadius.lg,
    padding: gaps.cardPadding,
    marginVertical: spacing.lg,
    ...shadows.md,
  },
  cardCompact: {
    padding: spacing.xl,
  },
  cardSpacious: {
    padding: gaps.heroSection,
  },
  iconArea: {
    alignItems: "center",
    marginBottom: gaps.formGroup,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  contentArea: {
    marginBottom: gaps.formField,
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    marginBottom: spacing.lg,
  },
  pointsContainer: {
    marginTop: gaps.formField,
  },
  point: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  pointBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    marginTop: spacing.sm,
  },
  pointText: {
    flex: 1,
  },
  accentBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
});

const OnboardingCard = React.forwardRef(
  (
    {
      title,
      description,
      icon,
      points = [],
      role = "farmer",
      variant = "default", // 'default' | 'compact' | 'spacious'
      showAccent = true,
      style,
      containerStyle,
      testID,
      ...props
    },
    ref,
  ) => {
    const roleColors = getRoleColors(role);

    const cardVariant = {
      default: styles.card,
      compact: [styles.card, styles.cardCompact],
      spacious: [styles.card, styles.cardSpacious],
    }[variant];

    const cardStyle = [cardVariant, style];

    return (
      <View
        ref={ref}
        style={[cardStyle, containerStyle]}
        testID={testID}
        {...props}
      >
        {/* Accent Bar */}
        {showAccent && (
          <View
            style={[styles.accentBar, { backgroundColor: roleColors.primary }]}
            testID={`${testID}-accent`}
          />
        )}

        {/* Icon Area */}
        {icon && (
          <View style={styles.iconArea} testID={`${testID}-icon`}>
            {typeof icon === "number" ? (
              // React Native Image
              <Typography variant="title" style={{ fontSize: 60 }}>
                {icon}
              </Typography>
            ) : (
              icon
            )}
          </View>
        )}

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Title */}
          {title && (
            <Typography
              variant="title"
              style={styles.title}
              color={neutralColors.textDark}
              testID={`${testID}-title`}
            >
              {title}
            </Typography>
          )}

          {/* Description */}
          {description && (
            <Typography
              variant="body"
              style={styles.description}
              color={neutralColors.textMedium}
              testID={`${testID}-description`}
            >
              {description}
            </Typography>
          )}

          {/* Points */}
          {points.length > 0 && (
            <View style={styles.pointsContainer} testID={`${testID}-points`}>
              {points.map((point, index) => (
                <View key={index} style={styles.point}>
                  <View
                    style={[
                      styles.pointBullet,
                      { backgroundColor: roleColors.lighter },
                    ]}
                    testID={`${testID}-point-${index}-bullet`}
                  >
                    <Typography
                      variant="caption"
                      bold
                      color={roleColors.primary}
                    >
                      ✓
                    </Typography>
                  </View>
                  <View style={styles.pointText}>
                    <Typography
                      variant="body"
                      color={neutralColors.textMedium}
                      testID={`${testID}-point-${index}-text`}
                    >
                      {point}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  },
);

OnboardingCard.displayName = "OnboardingCard";

export default OnboardingCard;
