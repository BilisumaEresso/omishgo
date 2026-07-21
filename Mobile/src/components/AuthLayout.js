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



const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: neutralColors.backgroundLight,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 12,
  },
  formSection: {
    width: "100%",
    marginBottom: 20,
  },
  footerSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

const AuthLayout = React.forwardRef(
  (
    {
      children,
      hero,
      form,
      footer,
      scrollable = true,
      style,
      testID,
      ...props
    },
    ref,
  ) => {
    const content = (
      <View style={[styles.content, style]}>
        {/* Hero Section */}
        {hero && (
          <View style={styles.heroSection} testID={`${testID}-hero`}>
            {hero}
          </View>
        )}

        {/* Form Section */}
        {form && (
          <View style={styles.formSection} testID={`${testID}-form`}>
            {form}
          </View>
        )}

        {/* Children (if used without sections) */}
        {children && !form && !hero && !footer && children}

        {/* Footer Section */}
        {footer && (
          <View style={styles.footerSection} testID={`${testID}-footer`}>
            {footer}
          </View>
        )}
      </View>
    );

    return (
      <SafeAreaView style={styles.wrapper}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          {scrollable ? (
            <ScrollView
              ref={ref}
              contentContainerStyle={styles.scrollContent}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              testID={testID}
              {...props}
            >
              {content}
            </ScrollView>
          ) : (
            <View
              ref={ref}
              style={[styles.scrollContent, styles.container]}
              testID={testID}
              {...props}
            >
              {content}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  },
);

AuthLayout.displayName = "AuthLayout";

export default AuthLayout;
