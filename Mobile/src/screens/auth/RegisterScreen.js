// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import AppText from '../../components/common/AppText';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/auth.store';

const RegisterScreen = ({ navigation, route }) => {
  const { role } = route.params || {}; // Receive role from selection
  const { theme } = useTheme();
  const { register } = useAuthStore();

  const [form, setForm] = useState({ fullName: '', phone: '', email: '', pin: '', confirmPin: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (form.pin !== form.confirmPin) return setErrors({ confirmPin: "PINs do not match" });

    setLoading(true);
    const result = await register({ ...form, role });

    if (result.success) {
      navigation.navigate('Success');
    } else {
      setErrors({ submit: result.message });
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <View style={{ padding: 24 }}>
        <AppText variant="headingMd">Create {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''} Account</AppText>

        <AppInput label="Full Name" value={form.fullName} onChangeText={(t) => setForm({...form, fullName: t})} />
        <AppInput label="Phone" value={form.phone} onChangeText={(t) => setForm({...form, phone: t})} keyboardType="phone-pad" />
        <AppInput label="PIN" value={form.pin} onChangeText={(t) => setForm({...form, pin: t})} secureTextEntry keyboardType="number-pad" />
        <AppInput label="Confirm PIN" value={form.confirmPin} onChangeText={(t) => setForm({...form, confirmPin: t})} secureTextEntry keyboardType="number-pad" error={errors.confirmPin} />

        <AppButton title="Register" onPress={handleSubmit} loading={loading} fullWidth />
      </View>
    </ScreenWrapper>
  );
};
export default RegisterScreen;