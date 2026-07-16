// Mobile/src/screens/buyer/BuyerSavedScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { useSavedStore } from "../../store/saved.store";

const BuyerSavedScreen = ({ navigation, onSwitchTab }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();
  const [refreshing, setRefreshing] = useState(false);

  // Pull everything from the global saved store
  const savedProducts = useSavedStore((s) => s.savedProducts);
  const loading = useSavedStore((s) => s.loading);
  const fetchSaved = useSavedStore((s) => s.fetchSaved);
  const toggleSave = useSavedStore((s) => s.toggleSave);

  const primary = theme?.colors?.primary || "#1565C0";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";
  const errorColor = theme?.colors?.error || "#C62828";

  // Re-sync from API every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSaved();
    setRefreshing(false);
  };

  const handleUnsave = (product) => {
    const id = product._id || product.id;
    Alert.alert(
      t("buyerSaved.removeConfirmTitle"),
      t("buyerSaved.removeConfirmMessage", { cropType: product.cropType }),
      [
        { text: t("buyerSaved.cancel"), style: "cancel" },
        {
          text: t("buyerSaved.remove"),
          style: "destructive",
          onPress: () => toggleSave(product),
        },
      ],
    );
  };

  const items = savedProducts.map((p) => ({
    _id: p._id,
    id: p._id,
    cropType: p.cropType,
    quantity: p.quantity,
    unit: p.unit || "kg",
    price: p.price,
    farmerName: p.farmerId?.name || t("buyerSaved.unknownFarmer"),
    location: p.location?.region || t("buyerSaved.unknownLocation"),
    photos: p.photos || [],
    status: p.status,
    farmerId: p.farmerId,
    location_obj: p.location,
    _raw: p,
  }));

  const renderSavedCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface }]}
      activeOpacity={0.7}
      onPress={() =>
        navigation?.navigate("ListingDetail", { product: item._raw })
      }
    >
      <View style={styles.cardTopRow}>
        <AppText style={[styles.cropName, { color: textPrimary }]}>
          {item.cropType}
        </AppText>
        <TouchableOpacity
          onPress={() => handleUnsave(item._raw)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="bookmark" size={22} color={primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardMiddleRow}>
        <AppText style={[styles.price, { color: primary }]}>
          {t("buyerSaved.priceWithCurrency", {
            amount: item.price?.toLocaleString(),
          })}
        </AppText>
        <AppText style={[styles.quantity, { color: textSecondary }]}>
          {item.quantity} {item.unit}
        </AppText>
      </View>

      <View style={styles.cardBottomRow}>
        <Ionicons
          name="person-outline"
          size={14}
          color={textMuted}
          style={{ marginRight: 4 }}
        />
        <AppText style={[styles.farmerText, { color: textSecondary }]}>
          {item.farmerName}
        </AppText>
        <View style={styles.locationWrap}>
          <Ionicons
            name="location-outline"
            size={14}
            color={textMuted}
            style={{ marginRight: 2 }}
          />
          <AppText style={[styles.locationText, { color: textMuted }]}>
            {item.location}
          </AppText>
        </View>
      </View>

      {/* View button */}
      <TouchableOpacity
        style={[styles.viewBtn, { borderColor: primary }]}
        onPress={() =>
          navigation?.navigate("ListingDetail", { product: item._raw })
        }
        activeOpacity={0.7}
      >
        <AppText style={{ color: primary, fontWeight: "600", fontSize: 14 }}>
          {t("buyerSaved.viewListing")}
        </AppText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="bookmark-outline"
        size={48}
        color={textMuted}
        style={{ marginBottom: 12 }}
      />
      <AppText style={[styles.emptyTitle, { color: textPrimary }]}>
        {t("buyerSaved.emptyTitle")}
      </AppText>
      <AppText style={[styles.emptySubtitle, { color: textSecondary }]}>
        {t("buyerSaved.emptySubtitle")}
      </AppText>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: primary }]}
        onPress={() => onSwitchTab?.("Marketplace")}
      >
        <AppText style={styles.browseButtonText}>
          {t("buyerSaved.browseMarketplace")}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <AppHeader
        title={
          items.length > 0
            ? t("buyerSaved.titleWithCount", { count: items.length })
            : t("buyerSaved.title")
        }
        showMenu={true}
        showNotification={true}
        notificationCount={0}
        onMenuPress={openSidebar}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      {loading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderSavedCard}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  listContent: { paddingBottom: 20, flexGrow: 1, paddingTop: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cropName: { fontSize: 16, fontWeight: "700" },
  cardMiddleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: { fontSize: 15, fontWeight: "700" },
  quantity: { fontSize: 14 },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  farmerText: { fontSize: 13, marginRight: 12 },
  locationWrap: { flexDirection: "row", alignItems: "center" },
  locationText: { fontSize: 13 },
  viewBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});

export default BuyerSavedScreen;
