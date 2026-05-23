// src/screens/auth/RoleSelection.js
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { useTheme } from "../../hooks/useTheme";
import { ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/auth.store";

export default function RoleSelection({ navigation }) {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = useState(null);

  const { requestRole, switchRole } = useAuthStore();

  const roles = [
    {
      id: ROLES.FARMER,
      title: "Farmer",
      desc: "Sell your crops directly to buyers.",
      icon: "🚜",
    },
    {
      id: ROLES.BUYER,
      title: "Buyer",
      desc: "Purchase fresh produce seamlessly.",
      icon: "🛒",
    },
    {
      id: ROLES.SUPPLIER,
      title: "Supplier",
      desc: "Provide equipment and fertilizers.",
      icon: "🏪",
    },
    {
      id: ROLES.DRIVER,
      title: "Driver",
      desc: "Manage logistics and deliveries.",
      icon: "🚚",
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;

    try {
      // 🌾 FARMER (DEFAULT ROLE - NO REQUEST NEEDED)
      if (selectedRole === ROLES.FARMER) {
        const result = await switchRole("farmer");

        if (!result.success) return;

        navigation.reset({
          index: 0,
          routes: [{ name: "FarmerDashboard" }],
        });

        return;
      }

      // 🛒 BUYER OR 🚚 DRIVER (ACTIVE AFTER REQUEST + SWITCH)
      if (selectedRole === ROLES.BUYER || selectedRole === ROLES.DRIVER) {
        const request = await requestRole(selectedRole);

        if (!request.success) return;

        const switchRes = await switchRole(selectedRole);

        if (!switchRes.success) return;

        navigation.reset({
          index: 0,
          routes: [
            {
              name:
                selectedRole === ROLES.BUYER
                  ? "BuyerDashboard"
                  : "DriverDashboard",
            },
          ],
        });

        return;
      }

      // 🏪 SUPPLIER (PENDING APPROVAL FLOW)
      if (selectedRole === ROLES.SUPPLIER) {
        const request = await requestRole("supplier");

        if (!request.success) return;

        navigation.navigate("SupplierPending");

        return;
      }
    } catch (error) {
      console.log("Role selection error:", error);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="headingMd" style={styles.heading}>
          Choose Your Role
        </AppText>

        <AppText
          variant="bodyMd"
          color={theme.colors.textSecondary}
          style={styles.subtext}
        >
          Select how you want to use OmishGo.
        </AppText>

        <ScrollView contentContainerStyle={styles.list}>
          {roles.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedRole(item.id)}
              style={[
                styles.card,
                selectedRole === item.id && {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primary + "10",
                },
              ]}
            >
              <View style={styles.iconBox}>
                <AppText variant="displaySm">{item.icon}</AppText>
              </View>

              <View style={styles.cardInfo}>
                <AppText variant="bodyLg" style={{ fontWeight: "600" }}>
                  {item.title}
                </AppText>

                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  {item.desc}
                </AppText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <AppButton
          title="Continue"
          disabled={!selectedRole}
          onPress={handleContinue}
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtext: {
    textAlign: "center",
    marginBottom: 24,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e6e0e9",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
});
