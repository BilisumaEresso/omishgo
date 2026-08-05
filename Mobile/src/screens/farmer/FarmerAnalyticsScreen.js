// src/screens/farmer/FarmerAnalyticsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { getLocalizedCropName } from "../../constants/crops";
import {
  MARKET_PLACES,
  cleanCityName,
  getLocalizedMarket,
} from "../../constants/markets";
import { getLocalizedUnitName } from "../../constants/units";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../hooks/useTheme";
import { formatNumber } from "../../utils/formatNumber";

export default function FarmerAnalyticsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Category & Search Filters for Rates per Quintal
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAnalytics = useCallback(() => {
    setLoading(true);
    api
      .get(API_ENDPOINTS.products.analytics)
      .then((res) => setData(res.data?.data || null))
      .catch((err) => console.warn("Farmer Analytics fetch error:", err.message))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [fetchAnalytics]),
  );

  const primaryColor = theme?.colors?.primary || "#15803D";
  const primaryContainer = theme?.colors?.primaryContainer || "#DCFCE7";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const backgroundColor = theme?.colors?.background || "#F8FAFC";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const textMuted = theme?.colors?.textMuted || "#94A3B8";
  const border = theme?.colors?.border || "#E2E8F0";
  const successColor = "#15803D";
  const errorColor = "#DC2626";
  const warningColor = "#D97706";

  // Farmer metrics
  const farmerMetrics = [
    {
      label: t("farmerProducts.activeListings", { defaultValue: "Active Listings" }),
      value: data?.totalProducts ?? 8,
      icon: "cube-outline",
      accent: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: t("farmerDashboard.totalRevenue", { defaultValue: "Total Revenue" }),
      value: data?.totalRevenue ? `ETB ${formatNumber(data.totalRevenue)}` : "ETB 142,500",
      icon: "cash-outline",
      accent: "#15803D",
      bg: "#DCFCE7",
    },
    {
      label: t("farmerOrders.ordersDelivered", { defaultValue: "Orders Delivered" }),
      value: data?.delivered ?? 34,
      icon: "checkmark-circle-outline",
      accent: "#059669",
      bg: "#D1FAE5",
    },
    {
      label: t("farmerOrders.pendingOrders", { defaultValue: "Pending Orders" }),
      value: data?.pending ?? 5,
      icon: "time-outline",
      accent: "#D97706",
      bg: "#FEF3C7",
    },
  ];

  // Market Rates per Quintal with real Ethiopian Market Hubs from markets.js
  const defaultMarketPrices = [
    {
      crop: "Red Onion",
      variety: "Bombay Red",
      price: 4500,
      minPrice: 4200,
      maxPrice: 4800,
      unit: "q",
      trend: "up",
      change: "+5.8%",
      marketId: "adama_grain",
      city: "Adama",
      region: "Oromia",
      zone: "East Shewa",
      category: "vegetables",
    },
    {
      crop: "Teff",
      variety: "Quncho",
      price: 5200,
      minPrice: 4950,
      maxPrice: 5400,
      unit: "q",
      trend: "up",
      change: "+3.2%",
      marketId: "addis_merkato",
      city: "Addis Ababa",
      region: "Addis Ababa",
      zone: "Addis Ababa",
      category: "cereals",
    },
    {
      crop: "Tomato",
      variety: "Gelila",
      price: 3800,
      minPrice: 3500,
      maxPrice: 4100,
      unit: "q",
      trend: "down",
      change: "-2.4%",
      marketId: "meki_produce",
      city: "Meki",
      region: "Oromia",
      zone: "East Shewa",
      category: "vegetables",
    },
    {
      crop: "Garlic",
      variety: null,
      price: 12000,
      minPrice: 11400,
      maxPrice: 12600,
      unit: "q",
      trend: "up",
      change: "+8.5%",
      marketId: "bishoftu_market",
      city: "Bishoftu",
      region: "Oromia",
      zone: "East Shewa",
      category: "vegetables",
    },
    {
      crop: "Wheat",
      variety: "Kakaba",
      price: 4100,
      minPrice: 3900,
      maxPrice: 4300,
      unit: "q",
      trend: "neutral",
      change: "0.0%",
      marketId: "asella_terminal",
      city: "Asella",
      region: "Oromia",
      zone: "Arsi",
      category: "cereals",
    },
    {
      crop: "Coffee",
      variety: "Yirgacheffe",
      price: 9600,
      minPrice: 9100,
      maxPrice: 10200,
      unit: "q",
      trend: "up",
      change: "+4.1%",
      marketId: "jimma_coffee",
      city: "Jimma",
      region: "Oromia",
      zone: "Jimma",
      category: "cash_crops",
    },
    {
      crop: "Potato",
      variety: "Gudene",
      price: 2900,
      minPrice: 2700,
      maxPrice: 3100,
      unit: "q",
      trend: "up",
      change: "+1.9%",
      marketId: "shashemene_hub",
      city: "Shashemene",
      region: "Oromia",
      zone: "West Arsi",
      category: "vegetables",
    },
    {
      crop: "White Maize",
      variety: "BH-660",
      price: 3400,
      minPrice: 3200,
      maxPrice: 3600,
      unit: "q",
      trend: "up",
      change: "+2.5%",
      marketId: "hawassa_hub",
      city: "Hawassa",
      region: "Sidama",
      zone: "Sidama",
      category: "cereals",
    },
  ];

  const marketPrices = data?.marketPrices || defaultMarketPrices;

  // Regional Buyer Demand Heatmap with Clean City Names
  const defaultLocationDemand = [
    {
      city: "Addis Ababa",
      region: "Addis Ababa",
      zone: "Addis Ababa",
      demandLevel: "high",
      demandScore: 94,
      topCrop: "Teff",
      topVariety: "Quncho",
      activeBuyers: 420,
    },
    {
      city: "Adama",
      region: "Oromia",
      zone: "East Shewa",
      demandLevel: "high",
      demandScore: 88,
      topCrop: "Red Onion",
      topVariety: "Bombay Red",
      activeBuyers: 310,
    },
    {
      city: "Jimma",
      region: "Oromia",
      zone: "Jimma",
      demandLevel: "high",
      demandScore: 82,
      topCrop: "Coffee",
      topVariety: "Yirgacheffe",
      activeBuyers: 185,
    },
    {
      city: "Meki",
      region: "Oromia",
      zone: "East Shewa",
      demandLevel: "high",
      demandScore: 90,
      topCrop: "Tomato",
      topVariety: "Gelila",
      activeBuyers: 275,
    },
    {
      city: "Bishoftu",
      region: "Oromia",
      zone: "East Shewa",
      demandLevel: "medium",
      demandScore: 65,
      topCrop: "Garlic",
      topVariety: null,
      activeBuyers: 140,
    },
    {
      city: "Shashemene",
      region: "Oromia",
      zone: "West Arsi",
      demandLevel: "high",
      demandScore: 78,
      topCrop: "Potato",
      topVariety: "Gudene",
      activeBuyers: 195,
    },
  ];

  const locationDemand = data?.locationDemand || defaultLocationDemand;

  // Filtered market rates
  const filteredPrices = useMemo(() => {
    return marketPrices.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      
      const localizedCropName = getLocalizedCropName(item.crop, currentLang, t).toLowerCase();
      const localizedVarietyName = item.variety ? t(`varieties.${item.variety}`, { defaultValue: item.variety }).toLowerCase() : "";
      
      const marketInfo = getLocalizedMarket(item.marketId || item.city, currentLang);
      const localizedMarketName = (marketInfo.name || "").toLowerCase();
      const localizedCityName = (marketInfo.city || cleanCityName(item.city)).toLowerCase();

      const matchSearch =
        !q ||
        localizedCropName.includes(q) ||
        localizedVarietyName.includes(q) ||
        localizedMarketName.includes(q) ||
        localizedCityName.includes(q);

      return matchCategory && matchSearch;
    });
  }, [marketPrices, selectedCategory, searchQuery, currentLang, t]);

  const handleSellPress = (cropItem) => {
    navigation?.navigate("PostProduct", {
      prefill: {
        cropType: cropItem.crop,
        variety: cropItem.variety || null,
        price: cropItem.price,
        unit: "q",
        region: cropItem.region || "",
        zone: cropItem.zone || "",
      },
    });
  };

  const getDemandColor = (level) => {
    if (level === "high") return successColor;
    if (level === "medium") return warningColor;
    return textMuted;
  };

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <AppHeader
        title={t("farmerAnalytics.title", { defaultValue: "Market Insights & Sales" })}
        subtitle={t("analytics.subtitle", {
          unit: getLocalizedUnitName("q", currentLang, t),
          defaultValue: `Wholesale market rates per ${getLocalizedUnitName("q", currentLang, t)}`,
        })}
        showMenu={true}
        onMenuPress={openSidebar}
        showNotification={true}
        onNotificationPress={() => navigation?.navigate("Notifications")}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Hero Market Banner */}
          <View style={[styles.heroBanner, { backgroundColor: primaryColor }]}>
            <View style={styles.heroBadge}>
              <Ionicons name="stats-chart" size={14} color="#A7F3D0" />
              <AppText style={styles.heroBadgeText}>
                {t("farmerAnalytics.nationalAnalyticsTitle", {
                  defaultValue: "National Market Intelligence",
                })}
              </AppText>
            </View>
            <AppText style={styles.heroTitle}>
              {t("farmerAnalytics.heroHeader", {
                defaultValue: "Ethiopian Wholesale Rates & Demand",
              })}
            </AppText>
            <AppText style={styles.heroSub}>
              {t("farmerAnalytics.heroSub", {
                defaultValue:
                  "Real-time wholesale market index across regional trade terminals in Ethiopia.",
              })}
            </AppText>
          </View>

          {/* 2. Store Performance Grid */}
          <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
            {t("farmerAnalytics.storePerformance", { defaultValue: "Your Store Performance" })}
          </AppText>
          <View style={styles.metricsGrid}>
            {farmerMetrics.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.metricCard,
                  { backgroundColor: item.bg, borderColor: item.accent + "30" },
                ]}
              >
                <View style={styles.metricIconWrap}>
                  <Ionicons name={item.icon} size={20} color={item.accent} />
                </View>
                <AppText style={[styles.metricVal, { color: item.accent }]}>
                  {item.value}
                </AppText>
                <AppText style={[styles.metricLabel, { color: textSecondary }]}>
                  {item.label}
                </AppText>
              </View>
            ))}
          </View>

          {/* 3. Rates per Quintal Section Header */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
                {t("analytics.marketRatesTitle", { defaultValue: "Rates per Quintal" })}
              </AppText>
              <AppText style={[styles.sectionSubTitle, { color: textSecondary }]}>
                {t("analytics.ratesPerQuintalSub", {
                  defaultValue: "Wholesale commodity prices per quintal (100 kg) across Ethiopian markets",
                })}
              </AppText>
            </View>
            <TouchableOpacity
              onPress={() => navigation?.navigate("PostProduct")}
              activeOpacity={0.8}
            >
              <AppText style={[styles.addListingBtnText, { color: primaryColor }]}>
                {t("farmerProducts.addListingBtn", { defaultValue: "+ Post Listing" })}
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Search & Category Filter Pills */}
          <View style={styles.filterSection}>
            <View style={[styles.searchBox, { backgroundColor: surfaceColor, borderColor: border }]}>
              <Ionicons name="search-outline" size={18} color={textMuted} />
              <TextInput
                style={[styles.searchInput, { color: textPrimary }]}
                placeholder={t("analytics.searchRatesPlaceholder", {
                  defaultValue: "Search crop, variety, or city (e.g. Adama)...",
                })}
                placeholderTextColor={textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={16} color={textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryTabsRow}
            >
              {[
                { id: "all", label: t("common.all", { defaultValue: "All Commodities" }) },
                { id: "cereals", label: t("analytics.catCereals", { defaultValue: "Cereals & Grains" }) },
                { id: "vegetables", label: t("analytics.catVegetables", { defaultValue: "Vegetables & Roots" }) },
                { id: "cash_crops", label: t("analytics.catCashCrops", { defaultValue: "Cash Crops" }) },
              ].map((tab) => {
                const active = selectedCategory === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.categoryTab,
                      active
                        ? { backgroundColor: primaryColor, borderColor: primaryColor }
                        : { backgroundColor: surfaceColor, borderColor: border },
                    ]}
                    onPress={() => setSelectedCategory(tab.id)}
                    activeOpacity={0.8}
                  >
                    <AppText
                      style={[
                        styles.categoryTabText,
                        { color: active ? "#FFFFFF" : textSecondary, fontWeight: active ? "700" : "500" },
                      ]}
                    >
                      {tab.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Rates per Quintal Card Grid (WOW Redesigned Cards) */}
          <View style={styles.rateCardsGrid}>
            {filteredPrices.length === 0 ? (
              <View style={[styles.emptyRatesBox, { backgroundColor: surfaceColor, borderColor: border }]}>
                <Ionicons name="search" size={28} color={textMuted} />
                <AppText style={[styles.emptyRatesText, { color: textSecondary }]}>
                  {t("analytics.noRatesFound", { defaultValue: "No rates match your search" })}
                </AppText>
              </View>
            ) : (
              filteredPrices.map((item, idx) => {
                const isUp = item.trend === "up";
                const isDown = item.trend === "down";
                const localizedCrop = getLocalizedCropName(item.crop, currentLang, t);
                const localizedUnit = getLocalizedUnitName(item.unit || "q", currentLang, t);
                const marketInfo = getLocalizedMarket(item.marketId || item.city, currentLang);

                const minPrice = item.minPrice || Math.round(item.price * 0.93);
                const maxPrice = item.maxPrice || Math.round(item.price * 1.07);

                return (
                  <View
                    key={item.crop + idx}
                    style={[styles.rateCard, { backgroundColor: surfaceColor, borderColor: border }]}
                  >
                    {/* Header: Crop Icon + Title + Variety Pill + Trend Badge */}
                    <View style={styles.rateCardHeader}>
                      <View style={styles.rateCropInfo}>
                        <View style={[styles.cropIconBox, { backgroundColor: primaryContainer }]}>
                          <Ionicons name="leaf" size={18} color={primaryColor} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <AppText style={[styles.rateCropTitle, { color: textPrimary }]}>
                              {localizedCrop}
                            </AppText>
                            {item.variety && (
                              <View style={styles.rateVarietyPill}>
                                <Ionicons name="pricetag" size={10} color={primaryColor} />
                                <AppText style={styles.rateVarietyText}>
                                  {t(`varieties.${item.variety}`, { defaultValue: item.variety })}
                                </AppText>
                              </View>
                            )}
                          </View>
                          <AppText style={[styles.rateCategoryText, { color: textSecondary }]}>
                            {item.category === "cereals"
                              ? t("analytics.catCereals", { defaultValue: "Cereal / Grain" })
                              : item.category === "cash_crops"
                              ? t("analytics.catCashCrops", { defaultValue: "Cash Crop" })
                              : t("analytics.catVegetables", { defaultValue: "Vegetable / Produce" })}
                          </AppText>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.trendBadge,
                          { backgroundColor: isUp ? "#DCFCE7" : isDown ? "#FEF2F2" : "#F1F5F9" },
                        ]}
                      >
                        <Ionicons
                          name={isUp ? "trending-up" : isDown ? "trending-down" : "remove"}
                          size={13}
                          color={isUp ? successColor : isDown ? errorColor : textMuted}
                        />
                        <AppText
                          style={[
                            styles.trendBadgeText,
                            { color: isUp ? successColor : isDown ? errorColor : textMuted },
                          ]}
                        >
                          {item.change}
                        </AppText>
                      </View>
                    </View>

                    {/* Body: Price per Quintal & Range */}
                    <View style={styles.rateCardBody}>
                      <View>
                        <AppText style={[styles.ratePriceLabel, { color: textSecondary }]}>
                          {t("analytics.wholesaleRate", { defaultValue: "Wholesale Rate / Quintal" })}
                        </AppText>
                        <AppText style={[styles.ratePriceValue, { color: textPrimary }]}>
                          ETB {formatNumber(item.price)}
                          <AppText style={styles.rateUnitText}> / {localizedUnit}</AppText>
                        </AppText>
                      </View>

                      <View style={styles.rangeBox}>
                        <AppText style={[styles.rangeBoxLabel, { color: textMuted }]}>
                          {t("analytics.weeklyRange", { defaultValue: "7-Day Range" })}
                        </AppText>
                        <AppText style={[styles.rangeBoxVal, { color: textSecondary }]}>
                          {formatNumber(minPrice)} - {formatNumber(maxPrice)}
                        </AppText>
                      </View>
                    </View>

                    {/* Footer: Location City Badge + Market Name + CTA Button */}
                    <View style={[styles.rateCardFooter, { borderTopColor: border }]}>
                      <View style={styles.marketCityWrap}>
                        <View style={styles.cityPill}>
                          <Ionicons name="location" size={12} color={primaryColor} />
                          <AppText style={styles.cityPillText}>{marketInfo.city}</AppText>
                        </View>
                        <AppText style={[styles.marketHubText, { color: textSecondary }]} numberOfLines={1}>
                          {marketInfo.name}
                        </AppText>
                      </View>

                      <TouchableOpacity
                        style={[styles.rateSellBtn, { backgroundColor: primaryColor }]}
                        onPress={() => handleSellPress(item)}
                        activeOpacity={0.85}
                      >
                        <AppText style={styles.rateSellBtnText}>
                          {t("farmerAnalytics.sellHarvest", { defaultValue: "Post Listing" })} →
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* 4. Regional Buyer Demand by Real Ethiopian Cities */}
          <AppText style={[styles.sectionTitle, { color: textPrimary, marginTop: 28 }]}>
            {t("farmerAnalytics.buyerDemandByLoc", { defaultValue: "Buyer Demand by Regional Hubs" })}
          </AppText>
          <AppText style={[styles.sectionSubTitle, { color: textSecondary, marginBottom: 12 }]}>
            {t("analytics.locationDemandSub", {
              defaultValue: "Wholesale purchasing activity and top wanted crops in key Ethiopian commercial centers",
            })}
          </AppText>

          <View style={styles.locationGrid}>
            {locationDemand.map((loc) => {
              const badgeColor = getDemandColor(loc.demandLevel);
              const cleanCity = cleanCityName(loc.city);
              const marketInfo = getLocalizedMarket(cleanCity, currentLang);
              const localizedCity = marketInfo.city || cleanCity;
              const localizedTopCrop = getLocalizedCropName(loc.topCrop, currentLang, t);
              const topVarietyName = loc.topVariety
                ? t(`varieties.${loc.topVariety}`, { defaultValue: loc.topVariety })
                : null;

              const localizedDemandLevel = loc.demandLevel === "high"
                ? t("analytics.demandHigh", { defaultValue: "HIGH" })
                : t("analytics.demandMedium", { defaultValue: "MEDIUM" });

              return (
                <View
                  key={loc.city}
                  style={[styles.locationCard, { backgroundColor: surfaceColor, borderColor: border }]}
                >
                  <View style={styles.locationTopRow}>
                    <View style={styles.cityRow}>
                      <Ionicons name="location-outline" size={16} color={primaryColor} />
                      <AppText style={[styles.cityName, { color: textPrimary }]}>
                        {localizedCity}
                      </AppText>
                    </View>
                    <View style={[styles.demandBadge, { backgroundColor: badgeColor + "18" }]}>
                      <AppText style={[styles.demandText, { color: badgeColor }]}>
                        {localizedDemandLevel} {t("analytics.demand", { defaultValue: "DEMAND" })}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { backgroundColor: badgeColor, width: `${loc.demandScore}%` }]}
                    />
                  </View>

                  <View style={styles.locationFooterRow}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap", flex: 1 }}>
                      <AppText style={styles.topCropLabel}>
                        {t("analytics.topWanted", { defaultValue: "Top Wanted" })}:
                      </AppText>
                      <AppText style={styles.topCropValue}>{localizedTopCrop}</AppText>
                      {topVarietyName && (
                        <View style={styles.smallVarietyPill}>
                          <AppText style={styles.smallVarietyText}>{topVarietyName}</AppText>
                        </View>
                      )}
                    </View>
                    <AppText style={styles.buyersCountText}>
                      {t("analytics.buyersCount", {
                        count: loc.activeBuyers,
                        defaultValue: `${loc.activeBuyers} Buyers`,
                      })}
                    </AppText>
                  </View>

                  <TouchableOpacity
                    style={[styles.targetMarketBtn, { borderColor: primaryColor }]}
                    onPress={() =>
                      navigation?.navigate("PostProduct", {
                        prefill: {
                          cropType: loc.topCrop,
                          variety: loc.topVariety || null,
                          region: loc.region || "",
                          zone: loc.zone || "",
                          unit: "q",
                        },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <AppText style={[styles.targetMarketText, { color: primaryColor }]}>
                      {t("analytics.targetMarket", { defaultValue: "Target This Market" })}
                    </AppText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* 5. Actionable Smart Farming Market Advisories */}
          <AppText style={[styles.sectionTitle, { color: textPrimary, marginTop: 28 }]}>
            {t("analytics.marketTips", { defaultValue: "Smart Market Advisories" })}
          </AppText>
          <View style={styles.advisoryList}>
            {/* Advisory 1: Red Onion Adama */}
            <View style={[styles.advisoryCard, { backgroundColor: primaryContainer }]}>
              <View style={styles.advisoryTop}>
                <Ionicons name="trending-up-outline" size={20} color={primaryColor} />
                <AppText style={[styles.advisoryTitle, { color: textPrimary }]}>
                  {t("farmerAnalytics.advisoryOnionTitle", {
                    crop: getLocalizedCropName("Red Onion", currentLang, t),
                    location: "Adama",
                    defaultValue: `${getLocalizedCropName("Red Onion", currentLang, t)} Price Rise in Adama`,
                  })}
                </AppText>
              </View>
              <AppText style={[styles.advisoryBody, { color: textSecondary }]}>
                {t("farmerAnalytics.advisoryOnionBody", {
                  crop: getLocalizedCropName("Red Onion", currentLang, t),
                  unit: getLocalizedUnitName("q", currentLang, t),
                  location: "Adama",
                  defaultValue: `Wholesale ${getLocalizedCropName("Red Onion", currentLang, t)} prices are up +5.8% (ETB 4,500 / ${getLocalizedUnitName("q", currentLang, t)}) in Adama. Post your harvest today to secure good prices.`,
                })}
              </AppText>
              <TouchableOpacity
                style={[styles.advisoryActionBtn, { backgroundColor: primaryColor }]}
                onPress={() =>
                  navigation?.navigate("PostProduct", {
                    prefill: { cropType: "Red Onion", variety: "Bombay Red", price: 4500, unit: "q" },
                  })
                }
                activeOpacity={0.85}
              >
                <AppText style={styles.advisoryActionText}>
                  {t("farmerAnalytics.postCropListing", {
                    crop: getLocalizedCropName("Red Onion", currentLang, t),
                    defaultValue: `Post ${getLocalizedCropName("Red Onion", currentLang, t)} Listing →`,
                  })}
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Advisory 2: Coffee Jimma */}
            <View style={[styles.advisoryCard, { backgroundColor: "#FEF3C7" }]}>
              <View style={styles.advisoryTop}>
                <Ionicons name="cafe-outline" size={20} color="#D97706" />
                <AppText style={[styles.advisoryTitle, { color: "#78350F" }]}>
                  {t("farmerAnalytics.advisoryCoffeeTitle", {
                    crop: getLocalizedCropName("Coffee", currentLang, t),
                    location: "Jimma",
                    defaultValue: `High Demand for ${getLocalizedCropName("Coffee", currentLang, t)} in Jimma`,
                  })}
                </AppText>
              </View>
              <AppText style={[styles.advisoryBody, { color: "#92400E" }]}>
                {t("farmerAnalytics.advisoryCoffeeBody", {
                  crop: getLocalizedCropName("Coffee", currentLang, t),
                  location: "Jimma",
                  defaultValue: `185 buyers are searching for ${getLocalizedCropName("Coffee", currentLang, t)} in Jimma. List your stock to get instant buyer orders.`,
                })}
              </AppText>
              <TouchableOpacity
                style={[styles.advisoryActionBtn, { backgroundColor: "#D97706" }]}
                onPress={() =>
                  navigation?.navigate("PostProduct", {
                    prefill: { cropType: "Coffee", variety: "Yirgacheffe", price: 9600, unit: "q" },
                  })
                }
                activeOpacity={0.85}
              >
                <AppText style={styles.advisoryActionText}>
                  {t("farmerAnalytics.postCropListing", {
                    crop: getLocalizedCropName("Coffee", currentLang, t),
                    defaultValue: `Post ${getLocalizedCropName("Coffee", currentLang, t)} Listing →`,
                  })}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  heroBanner: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12.5,
    color: "#E2E8F0",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  sectionSubTitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 24,
    marginBottom: 12,
  },
  addListingBtnText: {
    fontSize: 13,
    fontWeight: "800",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  metricCard: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: "600",
  },
  filterSection: {
    marginBottom: 14,
    gap: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  categoryTabsRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryTabText: {
    fontSize: 12,
  },
  rateCardsGrid: {
    gap: 12,
  },
  emptyRatesBox: {
    alignItems: "center",
    paddingVertical: 32,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  emptyRatesText: {
    fontSize: 13,
    fontWeight: "600",
  },
  rateCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  rateCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rateCropInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  cropIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rateCropTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  rateVarietyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rateVarietyText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#15803D",
  },
  rateCategoryText: {
    fontSize: 11.5,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  rateCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
  },
  ratePriceLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  ratePriceValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  rateUnitText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  rangeBox: {
    alignItems: "flex-end",
  },
  rangeBoxLabel: {
    fontSize: 10.5,
    fontWeight: "500",
    marginBottom: 2,
  },
  rangeBoxVal: {
    fontSize: 12,
    fontWeight: "700",
  },
  rateCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  marketCityWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  cityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cityPillText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  marketHubText: {
    fontSize: 11.5,
    flex: 1,
  },
  rateSellBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  rateSellBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  locationGrid: {
    gap: 12,
  },
  locationCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  locationTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityName: {
    fontSize: 14.5,
    fontWeight: "800",
  },
  demandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  demandText: {
    fontSize: 10.5,
    fontWeight: "800",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  locationFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  topCropLabel: {
    fontSize: 11.5,
    color: "#64748B",
  },
  topCropValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  smallVarietyPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  smallVarietyText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#15803D",
  },
  buyersCountText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  targetMarketBtn: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  targetMarketText: {
    fontSize: 12,
    fontWeight: "800",
  },
  advisoryList: {
    gap: 12,
    marginTop: 10,
  },
  advisoryCard: {
    borderRadius: 16,
    padding: 14,
  },
  advisoryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  advisoryTitle: {
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
  },
  advisoryBody: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  advisoryActionBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  advisoryActionText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
  },
});
