import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useSavedStore } from "../../store/saved.store";
import { formatNumber } from "../../utils/formatNumber";
import { getCropFallbackImage } from "../../constants/crops";

export default function ListingDetailScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { product } = route.params || {};

  const rawPhotos = (Array.isArray(product?.photos) ? product.photos : []).filter(Boolean);
  const photosList = rawPhotos.length > 0 ? rawPhotos : [getCropFallbackImage(product?.cropType)];
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const rawId = product?.customId || product?._id || product?.id || "";
  const shortId = rawId.startsWith("PRD-")
    ? rawId
    : rawId
    ? `PRD-${rawId.substring(rawId.length - 6).toUpperCase()}`
    : "PRD";

  const isSaved = useSavedStore((s) => s.isSaved(product?._id || product?.id));
  const toggleSave = useSavedStore((s) => s.toggleSave);

  const [ordering, setOrdering] = useState(false);
  const [buyQty, setBuyQty] = useState("");
  const [showBuyModal, setShowBuyModal] = useState(false);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  if (!product) {
    return (
      <DashboardLayout role="buyer" title={t("listingDetail.screenTitle", { defaultValue: "Produce Listing" })} showBack onBackPress={() => navigation.goBack()}>
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={48} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>{t("listingDetail.listingNotFound", { defaultValue: "Listing Not Found" })}</AppText>
          <AppText style={styles.emptySub}>
            {t("listingDetail.listingRemoved", { defaultValue: "This produce listing has been removed or is no longer active." })}
          </AppText>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: primaryColor }]}
            onPress={() => navigation.goBack()}
          >
            <AppText style={styles.backBtnText}>{t("listingDetail.goBack", { defaultValue: "Go Back" })}</AppText>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  const farmer = product.farmerId || {};
  const loc = product.location || {};
  const farmerName = farmer.name || t("listingDetail.verifiedProducer", { defaultValue: "Verified Local Producer" });
  const farmerPhone = farmer.phone || null;
  const unit = product.unit || "q";

  const avgMarketPrice = Math.round((product.price || 4000) * 0.95);

  const handleMessageFarmer = () => {
    if (!farmer._id) {
      Alert.alert(
        t("listingDetail.producerUnavailableTitle", { defaultValue: "Producer Unavailable" }),
        t("listingDetail.producerUnavailableMsg", { defaultValue: "This producer cannot be messaged directly." })
      );
      return;
    }
    navigation.navigate("Chat", {
      userId: farmer._id,
      userName: farmerName,
    });
  };

  const handleCallFarmer = () => {
    if (!farmerPhone) {
      Alert.alert(
        t("listingDetail.phoneUnavailableTitle", { defaultValue: "Phone Unavailable" }),
        t("listingDetail.phoneUnavailableMsg", { defaultValue: "This producer has not shared a phone number." })
      );
      return;
    }
    Linking.openURL(`tel:${farmerPhone}`).catch(() =>
      Alert.alert(
        t("errorMessage.title", { defaultValue: "Error" }),
        t("chat.couldNotDial", { defaultValue: "Could not open phone dialer" })
      )
    );
  };

  const handlePlaceOrder = async () => {
    const qty = parseFloat(buyQty);
    if (!qty || qty <= 0) {
      Alert.alert(
        t("listingDetail.invalidVolumeTitle", { defaultValue: "Invalid Volume" }),
        t("listingDetail.invalidVolumeMsg", { defaultValue: "Please enter a valid order volume in quintals." })
      );
      return;
    }
    if (qty > product.quantity) {
      Alert.alert(
        t("listingDetail.volumeExceededTitle", { defaultValue: "Volume Exceeded" }),
        t("listingDetail.volumeExceededMsg", { max: product.quantity, unit, defaultValue: "Maximum available stock is {{max}} {{unit}}." })
      );
      return;
    }

    setOrdering(true);
    try {
      await api.post(API_ENDPOINTS.orders.create, {
        productId: product._id || product.id,
        quantity: qty,
      });
      setShowBuyModal(false);
      setBuyQty("");
      Alert.alert(
        t("listingDetail.orderSentTitle", { defaultValue: "Order Sent to Farmer! 🎉" }),
        t("listingDetail.orderSentMsg", { qty, unit, cropType: product.cropType, defaultValue: "Your wholesale purchase request for {{qty}} {{unit}} of {{cropType}} has been submitted." }),
        [
          {
            text: t("listingDetail.viewOrdersBtn", { defaultValue: "View Orders" }),
            onPress: () => navigation.navigate("Orders"),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        t("listingDetail.orderErrorTitle", { defaultValue: "Order Error" }),
        err?.response?.data?.message || t("listingDetail.orderErrorMsg", { defaultValue: "Failed to submit order." })
      );
    } finally {
      setOrdering(false);
    }
  };

  return (
    <DashboardLayout
      role="buyer"
      title={t("listingDetail.screenTitle", { defaultValue: "Produce Detail" })}
      showBack
      onBackPress={() => navigation.goBack()}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Gallery Banner */}
        {photosList.length > 0 && (
          <View style={styles.galleryCard}>
            <Image
              source={{ uri: photosList[activePhotoIndex] || photosList[0] }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            {photosList.length > 1 && (
              <View style={styles.carouselBadgeRow}>
                {photosList.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setActivePhotoIndex(i)}
                    style={[
                      styles.carouselDot,
                      activePhotoIndex === i && styles.carouselDotActive,
                    ]}
                  />
                ))}
                <AppText style={styles.carouselCountText}>
                  {activePhotoIndex + 1}/{photosList.length}
                </AppText>
              </View>
            )}
          </View>
        )}

        {/* Crop Title Row */}
        <View style={styles.topTitleRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <AppText style={[styles.cropTitle, { color: textPrimary }]}>
                {product.cropType}
              </AppText>
              <AppText style={styles.refText}>#{shortId}</AppText>
            </View>
            <AppText style={styles.cropCategory}>
              {t("listingDetail.freshProduce", { defaultValue: "Fresh Wholesale Agricultural Produce" })}
            </AppText>
          </View>

          <TouchableOpacity
            style={[styles.bookmarkBtn, isSaved && { backgroundColor: primaryColor + "15" }]}
            onPress={() => toggleSave(product)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={primaryColor}
            />
          </TouchableOpacity>
        </View>

        {/* Price Banner */}
        <View style={[styles.priceBanner, { backgroundColor: primaryColor }]}>
          <View>
            <AppText style={styles.priceLabel}>{t("listingDetail.unitRate", { defaultValue: "Wholesale Unit Rate" })}</AppText>
            <AppText style={styles.priceAmount}>
              ETB {formatNumber(product.price)}{" "}
              <AppText style={styles.priceUnit}>/ {unit}</AppText>
            </AppText>
          </View>

          <View style={styles.stockBadge}>
            <Ionicons name="cube-outline" size={14} color="#FFFFFF" />
            <AppText style={styles.stockText}>
              {t("listingDetail.availableStockText", { qty: product.quantity, unit, defaultValue: "{{qty}} {{unit}} Available" })}
            </AppText>
          </View>
        </View>

        {/* Market Regional Trends Card */}
        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="trending-up-outline" size={18} color={primaryColor} />
            <AppText style={styles.cardTitle}>{t("listingDetail.regionalMarketPriceIndex", { defaultValue: "Regional Market Price Index" })}</AppText>
          </View>

          <View style={styles.insightsGrid}>
            <View style={styles.insightBox}>
              <AppText style={styles.insightLabel}>{t("listingDetail.regionalAvg", { defaultValue: "Regional Avg" })}</AppText>
              <AppText style={[styles.insightValue, { color: primaryColor }]}>
                ETB {formatNumber(avgMarketPrice)} / {unit}
              </AppText>
            </View>
            <View style={styles.insightBox}>
              <AppText style={styles.insightLabel}>{t("listingDetail.marketDemand", { defaultValue: "Market Demand" })}</AppText>
              <AppText style={[styles.insightValue, { color: "#059669" }]}>
                {t("listingDetail.highDemand", { defaultValue: "High Demand" })}
              </AppText>
            </View>
            <View style={styles.insightBox}>
              <AppText style={styles.insightLabel}>{t("listingDetail.harvestStatus", { defaultValue: "Harvest Status" })}</AppText>
              <AppText style={styles.insightValue}>{t("listingDetail.freshHarvest", { defaultValue: "Fresh Harvest" })}</AppText>
            </View>
          </View>
        </View>

        {/* Product Details Card */}
        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <AppText style={styles.cardTitle}>{t("listingDetail.produceSpecifications", { defaultValue: "Produce Specifications" })}</AppText>

          <View style={styles.specRow}>
            <AppText style={styles.specKey}>{t("listingDetail.cropType", { defaultValue: "Crop Type" })}</AppText>
            <AppText style={styles.specVal}>{product.cropType}</AppText>
          </View>
          <View style={styles.specRow}>
            <AppText style={styles.specKey}>{t("listingDetail.availableStock", { defaultValue: "Available Stock" })}</AppText>
            <AppText style={styles.specVal}>
              {product.quantity} {unit}
            </AppText>
          </View>
          <View style={styles.specRow}>
            <AppText style={styles.specKey}>{t("listingDetail.harvestLocation", { defaultValue: "Harvest Location" })}</AppText>
            <AppText style={styles.specVal}>
              {[loc.wereda, loc.zone, loc.region].filter(Boolean).join(", ") || t("common.unknownLocation", { defaultValue: "Location Not Provided" })}
            </AppText>
          </View>
          {product.description ? (
            <View style={styles.specDescBox}>
              <AppText style={styles.specKey}>{t("listingDetail.description", { defaultValue: "Description" })}</AppText>
              <AppText style={styles.specDescVal}>{product.description}</AppText>
            </View>
          ) : null}
        </View>

        {/* Farmer Producer Profile Card */}
        <TouchableOpacity
          style={[styles.farmerCard, { backgroundColor: surfaceColor }]}
          onPress={() =>
            farmer._id
              ? navigation.navigate("FarmerProfile", { farmerId: farmer._id })
              : null
          }
          activeOpacity={0.88}
        >
          <View style={styles.farmerLeft}>
            <View style={[styles.farmerAvatar, { backgroundColor: primaryColor }]}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View>
              <AppText style={styles.farmerName}>{farmerName}</AppText>
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={13} color={primaryColor} />
                <AppText style={[styles.verifiedLabel, { color: primaryColor }]}>
                  {t("listingDetail.verifiedFarmProducer", { defaultValue: "Verified Farm Producer" })}
                </AppText>
              </View>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Quick Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.outlineActionBtn, { borderColor: primaryColor }]}
            onPress={handleMessageFarmer}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={primaryColor} />
            <AppText style={[styles.outlineActionText, { color: primaryColor }]}>
              {t("listingDetail.chatNegotiate", { defaultValue: "Chat & Negotiate" })}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineActionBtn, { borderColor: "#64748B" }]}
            onPress={handleCallFarmer}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={16} color="#64748B" />
            <AppText style={[styles.outlineActionText, { color: "#64748B" }]}>
              {t("listingDetail.callProducer", { defaultValue: "Call Producer" })}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Primary Buy Button */}
        <TouchableOpacity
          style={[styles.buyNowBtn, { backgroundColor: primaryColor }]}
          onPress={() => setShowBuyModal(true)}
          activeOpacity={0.88}
        >
          <Ionicons name="cart-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <AppText style={styles.buyNowBtnText}>{t("listingDetail.placeWholesaleOrder", { defaultValue: "Place Wholesale Order" })}</AppText>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Order Quantity Modal */}
      <Modal
        visible={showBuyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBuyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: surfaceColor }]}>
            <AppText style={styles.modalTitle}>{t("listingDetail.placeWholesaleOrder", { defaultValue: "Place Wholesale Order" })}</AppText>
            <AppText style={styles.modalSub}>
              {t("listingDetail.enterRequestedVolume", { cropType: product.cropType, max: product.quantity, unit, defaultValue: `Enter requested volume for ${product.cropType} (Max ${product.quantity} ${unit}):` })}
            </AppText>

            <TextInput
              style={styles.qtyInput}
              placeholder={t("listingDetail.qtyInputPlaceholder", { unit, defaultValue: `Quantity in ${unit} (e.g. 10)` })}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={buyQty}
              onChangeText={setBuyQty}
            />

            {buyQty && parseFloat(buyQty) > 0 ? (
              <View style={styles.totalBox}>
                <AppText style={styles.totalLabel}>{t("listingDetail.estimatedTotalAmount", "Estimated Total Amount:")}</AppText>
                <AppText style={[styles.totalAmount, { color: primaryColor }]}>
                  ETB {formatNumber(parseFloat(buyQty) * product.price)}
                </AppText>
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: primaryColor }]}
                onPress={handlePlaceOrder}
                disabled={ordering}
                activeOpacity={0.85}
              >
                <AppText style={styles.confirmBtnText}>
                  {ordering ? t("listingDetail.submittingOrder", "Submitting Order...") : t("listingDetail.confirmSendOrder", "Confirm & Send Order")}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowBuyModal(false);
                  setBuyQty("");
                }}
              >
                <AppText style={styles.cancelBtnText}>{t("common.cancel", "Cancel")}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    margin: 16,
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
  seeAllBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  refText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  topTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cropTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  cropCategory: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  priceBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 2,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  insightsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  insightBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 14,
  },
  insightLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  insightValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
    color: "#0F172A",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  specKey: {
    fontSize: 13,
    color: "#64748B",
  },
  specVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  specDescBox: {
    marginTop: 8,
  },
  specDescVal: {
    fontSize: 13,
    color: "#334155",
    marginTop: 4,
    lineHeight: 18,
  },
  farmerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  farmerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  farmerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  farmerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  verifiedLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  outlineActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  outlineActionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  buyNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  buyNowBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSub: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
  },
  qtyInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 12,
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "800",
  },
  modalActions: {
    gap: 8,
  },
  confirmBtn: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  galleryCard: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  carouselBadgeRow: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  carouselDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  carouselDotActive: {
    width: 18,
    backgroundColor: "#FFFFFF",
  },
  carouselCountText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 4,
  },
});