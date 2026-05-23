// src/screens/auth/RegisterScreen.js
import { useState } from "react";
import { View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";
import AppText from "../../components/common/AppText";

const RegisterScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { register } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pin: "",
    confirmPin: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name) return setErrors({ name: "Name is required" });

    if (form.name.length < 3 || form.name.length > 25)
      return setErrors({
        name: "Name should be 3 to 25 characters long",
      });

    if (!form.phone)
      return setErrors({
        phone: "Enter phone number",
      });

    if (form.phone.length !== 10)
      return setErrors({
        phone: "Phone number must have 10 digits",
      });

    if (!form.phone.startsWith("09") && !form.phone.startsWith("07"))
      return setErrors({
        phone: "Enter valid phone number",
      });

    if (!form.pin)
      return setErrors({
        pin: "Insert PIN",
      });

    if (form.pin.length < 4 || form.pin.length > 6)
      return setErrors({
        pin: "PIN length must be between 4 and 6",
      });

    if (!form.confirmPin)
      return setErrors({
        confirmPin: "Confirm PIN",
      });

    if (form.pin !== form.confirmPin)
      return setErrors({
        confirmPin: "PINs do not match",
      });

    setLoading(true);
    const result = await register({ ...form });
    console.log(result);
    if (result.success) {
      navigation.replace("Success", {
        phone: form.phone,
        pin: form.pin,
      });
    } else {
      setErrors({ submit: result.message });
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper scrollable>
      <View style={{ padding: 24 }}>
        <AppText
          variant="headingLg"
          color={theme.colors.primary}
          style={{ fontWeight: "700", marginBottom:"20" }}

        >
          Create an account
        </AppText>
        <AppInput
          label="Full Name"
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
          error={errors.name}
          placeholder="Lema Bikila"
        />
        <AppInput
          label="Phone"
          value={form.phone}
          onChangeText={(t) => setForm({ ...form, phone: t })}
          keyboardType="phone-pad"
          error={errors.phone}
          placeholder="09xxxxxxxx"
        />
        <AppInput
          label="PIN"
          value={form.pin}
          onChangeText={(t) => setForm({ ...form, pin: t })}
          secureTextEntry
          keyboardType="number-pad"
          error={errors.pin}
          placeholder="xxxx"
        />
        <AppInput
          label="Confirm PIN"
          value={form.confirmPin}
          onChangeText={(t) => setForm({ ...form, confirmPin: t })}
          secureTextEntry
          keyboardType="number-pad"
          error={errors.confirmPin}
          placeholder="xxxx"
        />

        <AppButton
          title="Register"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
};
export default RegisterScreen;
