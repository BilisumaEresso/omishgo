import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from "react-native";
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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const farmerObj = farmerRes.data?.data?.user;
        setFarmer(farmerObj);
        setProducts(productsRes.data?.data?.products || []);

        if (farmerObj?.customId || farmerId) {
          try {
            const revRes = await api.get(API_ENDPOINTS.reviews.user(farmerObj?.customId || farmerId));
            if (revRes.data?.success) {
              setReviews(revRes.data?.data?.reviews || []);
            }
          } catch (_) {}
        }
      } catch (err) {
        setError(t("farmerProfile.errorLoadProfile", { defaultValue: "Failed to load producer profile" }));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmerId]);

  if (loading) {
    return (
      <DashboardLayout role="buyer" title={t("listingDetail.producerProfile", { defaultValue: "Producer Profile" })} showBack={true}>
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={primaryColor} />
          <AppText style={{ marginTop: 8, color: textSecondary }}>{t("profile.loadingFarm", { defaultValue: "Loading farm profile..." })}</AppText>
        </View>
      </DashboardLayout>
    );
  }

  if (error || !farmer) {
    return (
      <DashboardLayout role="buyer" title={t("listingDetail.producerProfile", { defaultValue: "Producer Profile" })} showBack={true}>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>{t("profile.producerNotFound", { defaultValue: "Producer Profile Not Found" })}</AppText>
          <AppText style={styles.emptySub}>{error || t("farmerProfile.unavailable", { defaultValue: "This farmer profile is unavailable." })}</AppText>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: primaryColor }]} onPress={() => navigation.goBack()}>
            <AppText style={styles.backBtnText}>{t("profile.returnToMarket", { defaultValue: "Return to Marketplace" })}</AppText>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="buyer" title={farmer.name || t("farmerProfile.defaultProducerName", { defaultValue: "Farmer Producer" })} showBack={true}>
      {/* Producer Hero Header Card */}
      <View style={[styles.heroCard, { backgroundColor: surfaceColor }]}>
        <View style={[styles.avatarWrap, { backgroundColor: primaryColor }]}>
          {farmer?.avatarUrl ? (
            <Image
              source={{ uri: farmer.avatarUrl }}
              style={{ width: 72, height: 72, borderRadius: 36 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={38} color="#FFFFFF" />
          )}
        </View>

        <AppText style={[styles.farmerName, { color: textPrimary }]}>
          {farmer.name}
        </AppText>

        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color={primaryColor} />
          <AppText style={[styles.verifiedText, { color: primaryColor }]}>
            {t("profile.verifiedProducer", { defaultValue: "Verified Local Producer" })}
          </AppText>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={textSecondary} />
          <AppText style={[styles.locationText, { color: textSecondary }]}>
            {[farmer.location?.wereda, farmer.location?.zone, farmer.location?.region].filter(Boolean).join(", ") || t("common.unknownLocation", { defaultValue: "Location Not Provided" })}
          </AppText>
        </View>

        <View style={styles.ratingBadge}>
          {farmer.ratingCount > 0 ? (
            <>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <AppText style={styles.ratingText}>
                {`${(farmer.averageRating || 0).toFixed(1)} ★ (${farmer.ratingCount} ${farmer.ratingCount === 1 ? "review" : "reviews"})`}
              </AppText>
            </>
          ) : (
            <>
              <Ionicons name="star-outline" size={14} color="#94A3B8" />
              <AppText style={[styles.ratingText, { color: "#64748B" }]}>
                {t("review.noReviewsYet", { defaultValue: "No reviews yet" })}
              </AppText>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.chatBtn, { backgroundColor: primaryColor }]}
          onPress={() => navigation.navigate("Chat", { userId: farmer._id, userName: farmer.name })}
          activeOpacity={0.88}
        >
          <Ionicons name="chatbubble-ellipses" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
          <AppText style={styles.chatBtnText}>{t("profile.messageAndNegotiate", { defaultValue: "Message & Negotiate Price" })}</AppText>
        </TouchableOpacity>
      </View>

      {/* Farm Produce Listings Section */}
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>
          {t("profile.activeHarvestListingsWithCount", { count: products.length, defaultValue: "Active Harvest Listings ({{count}})" })}
        </AppText>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={40} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>{t("profile.noActiveHarvestListings", { defaultValue: "No Active Harvest Listings" })}</AppText>
          <AppText style={styles.emptySub}>{t("profile.noActiveListingsDesc", { defaultValue: "This producer has no active crop listings at the moment." })}</AppText>
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

      {/* Customer Reviews Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <AppText style={styles.sectionTitle}>
          {t("review.customerReviewsTitle", {
            count: reviews.length,
            defaultValue: `Buyer Reviews & Ratings (${reviews.length})`,
          })}
        </AppText>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbox-outline" size={36} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>
            {t("review.noReviewsYet", { defaultValue: "No reviews yet" })}
          </AppText>
          <AppText style={styles.emptySub}>
            {t("review.noReviewsYetSub", {
              defaultValue: "Delivered harvest orders for this producer will show buyer ratings and feedback here.",
            })}
          </AppText>
        </View>
      ) : (
        <View style={styles.reviewsList}>
          {reviews.map((rev, idx) => (
            <View key={rev._id || rev.id || `public-rev-${idx}`} style={[styles.reviewItemCard, { backgroundColor: surfaceColor }]}>
              <View style={styles.reviewItemHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    {rev.reviewerId?.avatarUrl ? (
                      <Image
                        source={{ uri: rev.reviewerId.avatarUrl }}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                      />
                    ) : (
                      <Ionicons name="person-circle" size={32} color={primaryColor} />
                    )}
                  </View>
                  <View>
                    <AppText style={styles.reviewerName}>
                      {rev.reviewerId?.name || t("review.anonymousBuyer", { defaultValue: "Wholesale Buyer" })}
                    </AppText>
                    <AppText style={styles.reviewDate}>
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                    </AppText>
                  </View>
                </View>

                <View style={styles.reviewStarBadge}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <AppText style={styles.reviewStarText}>{rev.rating} / 5</AppText>
                </View>
              </View>

              {rev.comment ? (
                <AppText style={styles.reviewCommentText}>"{rev.comment}"</AppText>
              ) : null}
            </View>
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
  reviewsList: {
    gap: 12,
  },
  reviewItemCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  reviewItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  reviewDate: {
    fontSize: 11,
    color: "#64748B",
  },
  reviewStarBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  reviewStarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  reviewCommentText: {
    fontSize: 13,
    color: "#334155",
    fontStyle: "italic",
    lineHeight: 18,
    marginTop: 4,
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