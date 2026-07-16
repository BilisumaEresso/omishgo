import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../../components/common/AppText";
import { ProductCard } from "../../components/common/ProductCard";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";
import { useSavedStore } from "../../store/saved.store";

export default function FarmerProfileScreen({ route, navigation }) {
  const { farmerId } = route.params;
  const { t } = useTranslation();
  const { theme } = useTheme();

  const primary = theme?.colors?.primary || "#1565C0";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const background = theme?.colors?.background || "#F5F8FF";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const savedIds = useSavedStore((s) => s.savedIds);
  const toggleSave = useSavedStore((s) => s.toggleSave);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmerRes, productsRes] = await Promise.all([
          api.get(API_ENDPOINTS.users.detail(farmerId)),
          api.get(`${API_ENDPOINTS.products.list}?farmerId=${farmerId}`),
        ]);
        setFarmer(farmerRes.data?.data?.user);
        setProducts(productsRes.data?.data?.products || []);
      } catch (err) {
        setError(t("farmerProfile.errorLoadProfile"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmerId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (error || !farmer) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <AppText style={{ color: textSecondary }}>
          {error || t("farmerProfile.farmerNotFound")}
        </AppText>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.goBack()}
        >
          <AppText style={{ color: primary }}>
            {t("farmerProfile.goBack")}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={[styles.profileHeader, { backgroundColor: surface }]}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={80} color={primary} />
      </View>
      <AppText
        variant="headingMd"
        style={{ color: textPrimary, textAlign: "center" }}
      >
        {farmer.name}
      </AppText>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color={textSecondary} />
        <AppText
          variant="bodySm"
          style={{ color: textSecondary, marginLeft: 4 }}
        >
          {farmer.location?.region}, {farmer.location?.zone}
        </AppText>
      </View>
      <AppText
        style={{ color: textSecondary, marginTop: 8, textAlign: "center" }}
      >
        {t("farmerProfile.activeListings", { count: products.length })}
      </AppText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <AppHeader
        title={t("farmerProfile.title")}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            theme={theme}
            isSaved={savedIds.has(item._id)}
            onToggleSave={toggleSave}
            onView={(product) =>
              navigation.navigate("ListingDetail", { product })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={48} color={textSecondary} />
            <AppText style={{ color: textSecondary, marginTop: 12 }}>
              {t("farmerProfile.emptyListings")}
            </AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
});
