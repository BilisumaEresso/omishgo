// Mobile/src/screens/buyer/FarmerProfileScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../components/common/AppText";
import { ProductCard } from "../../components/common/ProductCard";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useSavedStore } from "../../store/saved.store";

export default function FarmerProfileScreen({ route, navigation }) {
  const { farmerId } = route.params || {};
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const savedIds = useSavedStore((s) => s.savedIds);
  const toggleSave = useSavedStore((s) => s.toggleSave);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  useEffect(() => {
    const fetchData = async () => {
      if (!farmerId) {
        setLoading(false);
        return;
      }
      try {
        const [farmerRes, productsRes] = await Promise.all([
          api.get(API_ENDPOINTS.users.detail(farmerId)),
          api.get(`${API_ENDPOINTS.products.list}?farmerId=${farmerId}`),
        ]);
        setFarmer(farmerRes.data?.data?.user);
        setProducts(productsRes.data?.data?.products || []);
      } catch (err) {
        setError(t("farmerProfile.errorLoadProfile") || "Failed to load producer profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmerId]);

  if (loading) {
    return (
      <DashboardLayout role="buyer" title="Producer Profile" showBack={true}>
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={primaryColor} />
          <AppText style={{ marginTop: 8, color: textSecondary }}>Loading farm profile...</AppText>
        </View>
      </DashboardLayout>
    );
  }

  if (error || !farmer) {
    return (
      <DashboardLayout role="buyer" title="Producer Profile" showBack={true}>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>Producer Profile Not Found</AppText>
          <AppText style={styles.emptySub}>{error || "This farmer profile is unavailable."}</AppText>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: primaryColor }]} onPress={() => navigation.goBack()}>
            <AppText style={styles.backBtnText}>Return to Marketplace</AppText>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="buyer" title={farmer.name || "Farmer Producer"} showBack={true}>
      {/* Producer Hero Header Card */}
      <View style={[styles.heroCard, { backgroundColor: surfaceColor }]}>
        <View style={[styles.avatarWrap, { backgroundColor: primaryColor }]}>
          <Ionicons name="person" size={38} color="#FFFFFF" />
        </View>

        <AppText style={[styles.farmerName, { color: textPrimary }]}>
          {farmer.name}
        </AppText>

        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color={primaryColor} />
          <AppText style={[styles.verifiedText, { color: primaryColor }]}>
            Verified Local Producer
          </AppText>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={textSecondary} />
          <AppText style={[styles.locationText, { color: textSecondary }]}>
            {[farmer.location?.region, farmer.location?.zone].filter(Boolean).join(", ") || "Oromia Region • 14 km away"}
          </AppText>
        </View>

        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <AppText style={styles.ratingText}>4.9 Rating (38 Wholesale Delivery Orders)</AppText>
        </View>

        <TouchableOpacity
          style={[styles.chatBtn, { backgroundColor: primaryColor }]}
          onPress={() => navigation.navigate("Chat", { userId: farmer._id, userName: farmer.name })}
          activeOpacity={0.88}
        >
          <Ionicons name="chatbubble-ellipses" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
          <AppText style={styles.chatBtnText}>Message & Negotiate Price</AppText>
        </TouchableOpacity>
      </View>

      {/* Farm Produce Listings Section */}
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>
          Active Harvest Listings ({products.length})
        </AppText>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={40} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>No Active Harvest Listings</AppText>
          <AppText style={styles.emptySub}>This producer has no active crop listings at the moment.</AppText>
        </View>
      ) : (
        <View style={styles.productsGrid}>
          {products.map((item) => (
            <ProductCard
              key={item._id || item.id}
              product={item}
              theme={theme}
              isSaved={savedIds.has(item._id || item.id)}
              onToggleSave={toggleSave}
              onView={(p) => navigation.navigate("ListingDetail", { product: p })}
            />
          ))}
        </View>
      )}

      <View style={{ height: 80 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  centerLoading: {
    padding: 40,
    alignItems: "center",
  },
  heroCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  farmerName: {
    fontSize: 20,
    fontWeight: "800",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "500",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 14,
  },
  chatBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  productsGrid: {
    gap: 12,
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});