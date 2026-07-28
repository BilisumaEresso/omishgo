import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";

export default function NearbyFarmersList({ farmers = [], onFarmerPress }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textColor = theme?.colors?.textPrimary || "#0F172A";
  const textMuted = theme?.colors?.textSecondary || "#64748B";

  if (!farmers || farmers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {farmers.map((farmer) => {
          const fid = farmer._id || farmer.id;
          const locationText =
            [farmer.location?.region || farmer.location?.zone, farmer.distance]
              .filter(Boolean)
              .join(" • ") || t("common.unknownLocation", { defaultValue: "Location Not Provided" });

          return (
            <TouchableOpacity
              key={fid}
              style={[styles.card, { backgroundColor: surfaceColor }]}
              onPress={() => onFarmerPress && onFarmerPress(farmer)}
              activeOpacity={0.85}
            >
              <View style={styles.topRow}>
                {farmer.avatar ? (
                  <Image source={{ uri: farmer.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatarFallback, { backgroundColor: primaryColor + "15" }]}>
                    <Ionicons name="person" size={22} color={primaryColor} />
                  </View>
                )}

                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <AppText style={styles.ratingText}>
                    {farmer.rating || "4.9"}
                  </AppText>
                </View>
              </View>

              <AppText style={[styles.farmerName, { color: textColor }]} numberOfLines={1}>
                {farmer.name || t("farmerProfile.fallbackName", { defaultValue: "Farmer Producer" })}
              </AppText>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color={textMuted} />
                <AppText style={[styles.locationText, { color: textMuted }]} numberOfLines={1}>
                  {locationText}
                </AppText>
              </View>

              <View style={styles.specialtyPill}>
                <Ionicons name="leaf-outline" size={12} color={primaryColor} />
                <AppText style={[styles.specialtyText, { color: primaryColor }]} numberOfLines={1}>
                  {t("buyerDashboard.specialityDefault", { defaultValue: "Specializes in Teff & Onions" })}
                </AppText>
              </View>

              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: primaryColor }]}
                onPress={() => onFarmerPress && onFarmerPress(farmer)}
                activeOpacity={0.8}
              >
                <AppText style={styles.contactBtnText}>
                  {t("buyerDashboard.viewFarmStock", { defaultValue: "View Farm & Stock" })}
                </AppText>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContent: {
    gap: 12,
  },
  card: {
    width: 220,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  farmerName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
  specialtyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(21, 101, 192, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: "600",
  },
  contactBtn: {
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  contactBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
