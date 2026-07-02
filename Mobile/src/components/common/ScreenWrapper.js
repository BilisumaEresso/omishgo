// src/components/common/ScreenWrapper.js
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
    StatusBar,
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
  const backgroundColor = theme.colors.background;

  const inner = scrollable ? (
    <ScrollView
      style={[styles.flex, style]}
      contentContainerStyle={[{ flexGrow: 1, padding: basePadding }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { padding: basePadding }, style]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor }]}> 
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={!disableKeyboardAvoid}
      >
        {inner}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});

export default ScreenWrapper;
