import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

export default function BuyerProfileScreen({ route, navigation }) {
  const { buyerId } = route.params;
  const { t } = useTranslation();
  const { theme } = useTheme();

  const primary = theme?.colors?.primary || "#1565C0";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F5F8FF";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.users.detail(buyerId));
        setBuyer(res.data?.data?.user);
      } catch (err) {
        setError(t("buyerProfile.errorLoadProfile") || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchBuyer();
  }, [buyerId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (error || !buyer) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <AppText style={{ color: textSecondary }}>
          {error || t("buyerProfile.notFound") || "Buyer not found"}
        </AppText>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <AppText style={{ color: primary }}>{t("common.goBack") || "Go Back"}</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const phone = buyer.phone || "+251 900 000000";
  const location = buyer.location || { region: "Unknown", zone: "Unknown" };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title={t("buyerProfile.title") || "Buyer Profile"} showBack={true} onBackPress={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileHeader, { backgroundColor: surface }]}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={primary} />
          </View>
          <AppText variant="headingMd" style={{ color: textPrimary, textAlign: "center" }}>
            {buyer.name}
          </AppText>
          <View style={styles.rolePill}>
            <AppText style={[styles.roleText, { color: primary }]}>
              {t("buyerProfile.roleBuyer") || "BUYER"}
            </AppText>
          </View>
          
          <View style={styles.chatButtonContainer}>
            <AppButton 
              title={t("buyerProfile.chatNow") || "Chat Now"} 
              onPress={() => navigation.navigate("Chat", { userId: buyer._id, userName: buyer.name })} 
            />
          </View>
        </View>

        <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
          {t("buyerProfile.sectionAccountInfo") || "Account Info"}
        </AppText>
        <View style={[styles.infoCard, { backgroundColor: surface }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={textSecondary} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, { color: textMuted }]}>
                {t("buyerProfile.infoLocation") || "Location"}
              </AppText>
              <AppText style={[styles.infoValue, { color: textPrimary }]}>
                {location.region}, {location.zone}
              </AppText>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme?.colors?.border || "#D0DEF5" }]} />
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={textSecondary} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, { color: textMuted }]}>
                {t("buyerProfile.infoPhone") || "Phone Number"}
              </AppText>
              <AppText style={[styles.infoValue, { color: textPrimary }]}>
                {phone}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 24 },
  profileHeader: {
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  avatarContainer: { marginBottom: 12 },
  rolePill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    marginTop: 8
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  chatButtonContainer: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 8
  },
  infoCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500"
  },
  divider: {
    height: 1,
    marginHorizontal: 12
  }
});
