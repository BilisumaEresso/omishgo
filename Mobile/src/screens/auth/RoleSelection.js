// src/screens/auth/RoleSelection.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import { ROLES } from "../../constants/roles";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

export default function RoleSelection({ navigation }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(null);

  const { requestRole, switchRole } = useAuthStore();

  const primaryColor = theme?.colors?.primary || "#15803D";

  const roles = [
    {
      id: ROLES.FARMER,
      title: t("roleSelection.farmerTitle", {
        defaultValue: "Farmer / Producer",
      }),
      desc: t("roleSelection.farmerDesc", {
        defaultValue: "List harvests and sell directly to commercial buyers",
      }),
      iconName: "leaf",
      accentColor: "#15803D",
      bgColor: "#DCFCE7",
    },
    {
      id: ROLES.BUYER,
      title: t("roleSelection.buyerTitle", { defaultValue: "Wholesale Buyer" }),
      desc: t("roleSelection.buyerDesc", {
        defaultValue: "Source crops directly from Ethiopian farmers in bulk",
      }),
      iconName: "cart",
      accentColor: "#1565C0",
      bgColor: "#E0F2FE",
    },
    {
      id: ROLES.SUPPLIER,
      title: t("roleSelection.supplierTitle", {
        defaultValue: "Agricultural Supplier",
      }),
      desc: t("roleSelection.supplierDesc", {
        defaultValue: "Supply seeds, fertilizers, and equipment to farmers",
      }),
      iconName: "storefront",
      accentColor: "#D97706",
      bgColor: "#FEF3C7",
    },
    {
      id: ROLES.DRIVER,
      title: t("auth.roleDriver", { defaultValue: "Logistics Driver" }),
      desc: t("auth.roleDriverDesc", {
        defaultValue: "Manage produce transport and dispatches",
      }),
      iconName: "bus",
      accentColor: "#7C3AED",
      bgColor: "#F3E8FF",
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;

    try {
      if (selectedRole === ROLES.FARMER) {
        const result = await switchRole("farmer");
        if (!result.success) return;

        navigation.reset({
          index: 0,
          routes: [{ name: "FarmerTabs" }],
        });
        return;
      }

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
                selectedRole === ROLES.BUYER ? "BuyerTabs" : "DriverDashboard",
            },
          ],
        });
        return;
      }

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
        <View style={styles.header}>
          <AppText style={styles.heading}>
            {t("roleSelection.title", {
              defaultValue: "Choose Your Platform Role",
            })}
          </AppText>
          <AppText style={styles.subtext}>
            {t("roleSelection.subtitle", {
              defaultValue:
                "Select how you want to trade and operate on OmishGo.",
            })}
          </AppText>
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {roles.map((item) => {
            const isSelected = selectedRole === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedRole(item.id)}
                activeOpacity={0.85}
                style={[
                  styles.card,
                  isSelected && {
                    borderColor: item.accentColor,
                    backgroundColor: item.bgColor + "40",
                  },
                ]}
              >
                <View
                  style={[styles.iconBox, { backgroundColor: item.bgColor }]}
                >
                  <Ionicons
                    name={item.iconName}
                    size={24}
                    color={item.accentColor}
                  />
                </View>

                <View style={styles.cardInfo}>
                  <AppText style={styles.roleTitle}>{item.title}</AppText>
                  <AppText style={styles.roleDesc}>{item.desc}</AppText>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    isSelected && {
                      borderColor: item.accentColor,
                      backgroundColor: item.accentColor,
                    },
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title={t("roleSelection.continueBtn", { defaultValue: "Continue" })}
            disabled={!selectedRole}
            onPress={handleContinue}
            fullWidth
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtext: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  roleDesc: {
    fontSize: 12.5,
    color: "#64748B",
    lineHeight: 18,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
});
