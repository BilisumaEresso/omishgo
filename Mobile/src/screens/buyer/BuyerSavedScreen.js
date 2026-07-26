// Mobile/src/screens/buyer/BuyerSavedScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import { ProductCard } from "../../components/common/ProductCard";
import DashboardLayout from "../../components/layout/DashBoardLayout";
import { useTheme } from "../../hooks/useTheme";
import { useSavedStore } from "../../store/saved.store";

export default function BuyerSavedScreen({ navigation, onSwitchTab }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const savedProducts = useSavedStore((s) => s.savedProducts);
  const loading = useSavedStore((s) => s.loading);
  const fetchSaved = useSavedStore((s) => s.fetchSaved);
  const toggleSave = useSavedStore((s) => s.toggleSave);
  const savedIds = useSavedStore((s) => s.savedIds);

  const primaryColor = theme?.colors?.primary || "#1565C0";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSaved();
    setRefreshing(false);
  };

  const handleViewProduct = (product) => {
    navigation?.navigate("ListingDetail", { product });
  };

  return (
    <DashboardLayout
      role="buyer"
      title={`Saved Produce (${savedProducts.length})`}
      showBack={false}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      {loading && savedProducts.length === 0 ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={primaryColor} />
          <AppText style={{ marginTop: 8, color: textSecondary }}>{t("saved.loading", { defaultValue: "Loading bookmarked produce..." })}</AppText>
        </View>
      ) : savedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={48} color="#94A3B8" />
          <AppText style={styles.emptyTitle}>{t("saved.empty", { defaultValue: "No Saved Produce Items" })}</AppText>
          <AppText style={styles.emptySub}>
            {t("saved.emptyDesc", { defaultValue: "Bookmark wholesale crops from the marketplace to easily compare and order later." })}
          </AppText>
          <TouchableOpacity
            style={[styles.browseBtn, { backgroundColor: primaryColor }]}
            onPress={() => onSwitchTab?.("Marketplace")}
            activeOpacity={0.85}
          >
            <AppText style={styles.browseBtnText}>{t("saved.browseBtn", { defaultValue: "Browse Produce Marketplace" })}</AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.productsGrid}>
          {savedProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              theme={theme}
              isSaved={savedIds.has(product._id || product.id)}
              onToggleSave={toggleSave}
              onView={handleViewProduct}
            />
          ))}
        </View>
      )}

      <View style={{ height: 80 }} />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  productsGrid: {
    gap: 12,
  },
  centerLoading: {
    padding: 40,
    alignItems: "center",
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
  browseBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
