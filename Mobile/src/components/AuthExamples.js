/**
 * OmishGo Auth Component Examples
 *
 * Real-world examples of how to build auth screens using the foundation components
 *
 * These are REFERENCE EXAMPLES ONLY - not production screens
 * Adapt to your specific needs and add business logic as required
 */

import {
  AppInput,
  AuthLayout,
  LogoCard,
  PrimaryButton,
  RememberMeCheckbox,
  SecondaryButton,
  Typography,
  gaps,
  getRoleColors,
  neutralColors,
  spacing,
} from "@/components";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: gaps.heroSection,
    alignItems: "center",
  },
  titleText: {
    marginBottom: spacing.sm,
  },
  subtitleText: {
    marginBottom: spacing.md,
  },
  formSection: {
    width: "100%",
    marginBottom: gaps.formGroup,
  },
  fieldGroup: {
    marginBottom: gaps.formField,
  },
  buttonGroup: {
    marginBottom: gaps.buttonGap,
  },
  footerLinksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  footerLink: {
    marginHorizontal: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: neutralColors.borderSubtle,
    marginVertical: gaps.formField,
  },
});

/**
 * EXAMPLE 1: Login Screen
 *
 * Shows:
 * - Basic form layout
 * - Email and password inputs
 * - Remember me checkbox
 * - Primary CTA button
 * - Secondary link button
 */
export function LoginScreenExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const userRole = "farmer";
  const roleColors = getRoleColors(userRole);

  const validateForm = () => {
    const newErrors = {};
    if (!email.includes("@")) newErrors.email = "Invalid email address";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Call login API
      // await loginUser(email, password, rememberMe);
      // TODO: Navigate to home screen
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      hero={<LogoCard source={require("@/assets/logo.png")} size="large" />}
      form={
        <View style={styles.formSection}>
          {/* Title */}
          <View style={styles.titleSection}>
            <Typography variant="title" style={styles.titleText}>
              Welcome Back
            </Typography>
            <Typography
              variant="body"
              color={neutralColors.textLight}
              style={styles.subtitleText}
            >
              Sign in to your account
            </Typography>
          </View>

          {/* Form Errors */}
          {errors.form && (
            <Typography variant="error" style={styles.fieldGroup}>
              {errors.form}
            </Typography>
          )}

          {/* Email Input */}
          <View style={styles.fieldGroup}>
            <AppInput
              label="Email Address"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              icon="mail"
              keyboardType="email-address"
              role={userRole}
              testID="login-email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.fieldGroup}>
            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              password
              error={errors.password}
              role={userRole}
              testID="login-password"
            />
          </View>

          {/* Remember Me */}
          <View style={styles.fieldGroup}>
            <RememberMeCheckbox
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
              label="Remember me for next time"
              role={userRole}
            />
          </View>

          {/* Login Button */}
          <View style={styles.buttonGroup}>
            <PrimaryButton
              label="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={!email || !password}
              size="large"
              role={userRole}
              testID="login-button"
            />
          </View>

          {/* Forgot Password Link */}
          <Typography
            variant="caption"
            color={roleColors.primary}
            style={{ textAlign: "center" }}
          >
            Forgot your password?
          </Typography>
        </View>
      }
      footer={
        <View>
          <View style={styles.divider} />
          <View style={styles.footerLinksContainer}>
            <Typography variant="caption">Don't have an account?</Typography>
            <Typography variant="caption" bold color={roleColors.primary}>
              Sign Up
            </Typography>
          </View>
        </View>
      }
    />
  );
}

/**
 * EXAMPLE 2: Role Selection Screen
 *
 * Shows:
 * - Multiple role options as cards/buttons
 * - Icon/illustration per role
 * - Description text
 * - Role-specific colors
 */
export function RoleSelectionScreenExample() {
  const roles = [
    { id: "farmer", label: "I am a Farmer", description: "Buy & sell crops" },
    {
      id: "buyer",
      label: "I am a Buyer",
      description: "Purchase from farmers",
    },
    {
      id: "supplier",
      label: "I am a Supplier",
      description: "Sell farm inputs",
    },
    { id: "driver", label: "I am a Driver", description: "Provide delivery" },
  ];

  const [selectedRole, setSelectedRole] = useState("farmer");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // TODO: Navigate to auth with selected role
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      hero={<LogoCard source={require("@/assets/logo.png")} size="large" />}
      form={
        <View style={styles.formSection}>
          <View style={styles.titleSection}>
            <Typography variant="title" style={styles.titleText}>
              Who are you?
            </Typography>
            <Typography
              variant="body"
              color={neutralColors.textLight}
              style={styles.subtitleText}
            >
              Choose your role to get started
            </Typography>
          </View>

          {/* Role Buttons */}
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const roleColors = getRoleColors(role.id);

            return (
              <View key={role.id} style={styles.fieldGroup}>
                <SecondaryButton
                  label={`${role.label} • ${role.description}`}
                  role={role.id}
                  onPress={() => setSelectedRole(role.id)}
                  size="large"
                  style={{
                    borderWidth: isSelected ? 2 : 1.5,
                    backgroundColor: isSelected
                      ? roleColors.lighter
                      : "transparent",
                  }}
                />
              </View>
            );
          })}

          {/* Continue Button */}
          <View style={{ marginTop: gaps.formGroup }}>
            <PrimaryButton
              label="Continue"
              onPress={handleContinue}
              loading={isLoading}
              role={selectedRole}
              size="large"
              testID="role-continue"
            />
          </View>
        </View>
      }
    />
  );
}

/**
 * EXAMPLE 3: PIN Entry Screen
 *
 * Shows:
 * - PIN input with visibility
 * - Confirmation instructions
 * - Resend code option
 */
export function PINEntryScreenExample() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userRole = "farmer";
  const roleColors = getRoleColors(userRole);

  const handleVerify = async () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Verify PIN with backend
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      hero={<LogoCard source={require("@/assets/logo.png")} size="medium" />}
      form={
        <View style={styles.formSection}>
          <View style={styles.titleSection}>
            <Typography variant="title" style={styles.titleText}>
              Verify Your Phone
            </Typography>
            <Typography
              variant="body"
              color={neutralColors.textLight}
              style={styles.subtitleText}
            >
              We sent a 4-digit code to your phone
            </Typography>
          </View>

          {/* PIN Input */}
          <View style={styles.fieldGroup}>
            <AppInput
              label="Enter PIN Code"
              placeholder="0000"
              value={pin}
              onChangeText={setPin}
              pin
              maxLength={4}
              keyboardType="number-pad"
              error={error}
              role={userRole}
              testID="pin-input"
            />
          </View>

          {/* Verify Button */}
          <View style={styles.buttonGroup}>
            <PrimaryButton
              label="Verify"
              onPress={handleVerify}
              loading={isLoading}
              disabled={pin.length !== 4}
              size="large"
              role={userRole}
              testID="verify-button"
            />
          </View>

          {/* Resend Code */}
          <Typography
            variant="caption"
            color={roleColors.primary}
            style={{ textAlign: "center" }}
          >
            Didn't receive the code? Resend
          </Typography>
        </View>
      }
    />
  );
}

/**
 * EXAMPLE 4: Error State Handling
 *
 * Shows:
 * - Multiple field errors
 * - Form-level errors
 * - Visual error indicators
 */
export function FormWithErrorsExample() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const userRole = "farmer";

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.length < 3 ? "Name must be at least 3 characters" : "";
      case "email":
        return !value.includes("@") ? "Invalid email address" : "";
      case "password":
        return value.length < 8 ? "Password must be at least 8 characters" : "";
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : "";
      default:
        return "";
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = () => {
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // TODO: Submit form
    }
  };

  return (
    <AuthLayout
      form={
        <View style={styles.formSection}>
          <AppInput
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChangeText={(value) => handleChange("fullName", value)}
            error={errors.fullName}
            icon="person"
            role={userRole}
          />

          <AppInput
            label="Email Address"
            placeholder="john@email.com"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            error={errors.email}
            icon="mail"
            keyboardType="email-address"
            role={userRole}
          />

          <AppInput
            label="Password"
            placeholder="Enter password"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            error={errors.password}
            password
            role={userRole}
            helperText="Min 8 characters"
          />

          <AppInput
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            error={errors.confirmPassword}
            password
            role={userRole}
          />

          <View style={{ marginTop: gaps.formGroup }}>
            <PrimaryButton
              label="Create Account"
              onPress={handleSubmit}
              size="large"
              role={userRole}
            />
          </View>
        </View>
      }
    />
  );
}

export default {
  LoginScreenExample,
  RoleSelectionScreenExample,
  PINEntryScreenExample,
  FormWithErrorsExample,
};
