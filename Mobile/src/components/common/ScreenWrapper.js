// src/components/common/ScreenWrapper.js
import React from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

const ScreenWrapper = ({
  children,
  scrollable = false,
  padding = true,
  disableKeyboardAvoid = false, // DESIGN FIX: Prevents layout breaking when nested inside AuthLayout
  style,
  contentContainerStyle,
}) => {
  const { theme } = useTheme();

  const basePadding = padding ? 16 : 0;
  const backgroundColor = theme.colors.background || "#F8F9FA";

  // Render Strategy A: Scrollable Layout
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          enabled={!disableKeyboardAvoid}
        >
          <ScrollView
            style={[styles.flex, style]}
            contentContainerStyle={[
              {
                flexGrow: 1,
                padding: basePadding, // DESIGN FIX: Keeps padding on the inner engine to avoid shadow clipping
              },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Render Strategy B: Fixed Static Layout (e.g., Maps, Full Dashboards)
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={!disableKeyboardAvoid}
      >
        <View
          style={[
            styles.flex,
            { padding: basePadding },
            style
          ]}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});

export default ScreenWrapper;