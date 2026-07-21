// src/screens/role/RoleSelectionModal.js
import { useState } from "react";
import { View, Modal, StyleSheet } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import { useAuthStore } from "../../store/auth.store";
const RoleSelectionModal = () => {
  const {
    requestRole,
    switchRole,
    isLoading
  } = useAuthStore();
  const [error, setError] = useState(null);
  const handleSelect = async role => {
    // 1. Request the role (Backend logic handles status: active vs pending)
    const reqRes = await requestRole(role);
    if (!reqRes.success) return setError(reqRes.message);

    // 2. Switch to the role (If active)
    const switchRes = await switchRole(role);
    if (!switchRes.success) setError(switchRes.message);
  };
  return <Modal visible={true} transparent>
      <View style={styles.container}>
        <AppText variant="headingMd">Choose your Role</AppText>
        <AppButton title="Buyer" onPress={() => handleSelect("buyer")} loading={isLoading} />
        <AppButton title="Supplier" onPress={() => handleSelect("supplier")} loading={isLoading} />
        {error && <AppText style={{
        color: "red"
      }}>{error}</AppText>}
      </View>
    </Modal>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff"
  }
});
export default RoleSelectionModal;