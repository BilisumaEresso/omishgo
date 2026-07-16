// src/screens/farmer/PostProductScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

// ─── Data Constants ───────────────────────────────────────────────────────────
const CROP_TYPES = [
  "Teff",
  "Wheat",
  "Barley",
  "Maize",
  "Sorghum",
  "Millet",
  "Onion",
  "Tomato",
  "Potato",
  "Garlic",
  "Pepper",
  "Cabbage",
  "Lettuce",
  "Carrot",
  "Beetroot",
  "Coffee",
  "Chat",
  "Sesame",
  "Sunflower",
  "Lentil",
  "Chickpea",
  "Bean",
  "Pea",
];

const UNITS = [
  "kg",
  "quintal",
  "ton",
  "bag (50kg)",
  "bag (100kg)",
  "crate",
  "sack",
];

const UNIT_LABELS = {
  ton: "ton (kg)",
};

const REGIONS = [
  "Addis Ababa",
  "Oromia",
  "Amhara",
  "Tigray",
  "SNNPR",
  "Sidama",
  "Afar",
  "Somali",
  "Benishangul-Gumuz",
  "Gambela",
  "Harari",
  "Dire Dawa",
];

const ZONES_BY_REGION = {
  Oromia: [
    "West Hararghe",
    "East Hararghe",
    "Jimma",
    "Bale",
    "Borena",
    "West Shewa",
    "East Shewa",
    "North Shewa",
    "South West Shewa",
    "Guji",
    "West Guji",
    "Arsi",
    "West Arsi",
    "Illubabor",
    "Kelem Wallaga",
    "East Wallaga",
    "West Wallaga",
    "Horo Guduru",
    "Qellem",
    "Buno Bedele",
    "Ilu Aba Bora",
  ],
  Amhara: [
    "North Gondar",
    "South Gondar",
    "North Wollo",
    "South Wollo",
    "Waghimra",
    "Awi",
    "West Gojam",
    "East Gojam",
    "North Shewa",
    "Oromia Special Zone",
  ],
  SNNPR: [
    "Sidama",
    "Wolayita",
    "Gedeo",
    "Gurage",
    "Hadiya",
    "Kembata",
    "Dawro",
    "Gofa",
    "Bench Sheko",
    "Gamo",
  ],
  Tigray: [
    "Central Tigray",
    "Eastern Tigray",
    "Western Tigray",
    "Southern Tigray",
    "North Western Tigray",
    "South Eastern Tigray",
  ],
  "Addis Ababa": ["Addis Ababa City"],
  Sidama: ["Sidama"],
  Afar: ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"],
  Somali: [
    "Jijiga",
    "Fafan",
    "Liben",
    "Afder",
    "Doolo",
    "Shabelle",
    "Erer",
    "Siti",
    "Korahey",
    "Nogob",
    "Daawa",
  ],
};

const DEFAULT_DESCRIPTIONS = {
  Teff: "White Teff, freshly harvested. Cleaned and ready for market. Grown without chemical fertilizers.",
  Wheat:
    "Red wheat, this season's harvest. Dry and clean. Suitable for flour milling.",
  Onion: "Red onion, medium to large size. Fresh from the farm. No bruising.",
  Tomato:
    "Fresh tomatoes, fully ripe. Harvested this week. Best for immediate purchase.",
  Maize: "Yellow maize, dried. Clean grain, ready for grinding or direct use.",
  Potato: "White potato, good size. This season's harvest, dry stored.",
  Coffee:
    "Washed Arabica coffee, Grade 2. Dried on raised beds. Excellent cup quality.",
  Garlic:
    "White garlic bulbs, dry. Strong aroma. Stored in cool, dry conditions.",
  Pepper: "Green pepper, fresh. Harvested this week. Uniform size.",
  Barley:
    "Barley grain, dried. This season's harvest, clean and stored properly.",
};

const REFERENCE_PRICES = {
  Teff: { quintal: 5200, kg: 52 },
  Wheat: { quintal: 3800, kg: 38 },
  Maize: { quintal: 2800, kg: 28 },
  Onion: { quintal: 4500, kg: 45 },
  Tomato: { quintal: 3800, kg: 38 },
  Potato: { quintal: 3200, kg: 32 },
  Coffee: { quintal: 18000, kg: 180 },
  Garlic: { quintal: 12000, kg: 120 },
  Barley: { quintal: 3500, kg: 35 },
  Sesame: { quintal: 9000, kg: 90 },
};

// ─── Reusable Dropdown Picker ─────────────────────────────────────────────────
const DropdownPicker = ({
  label,
  value,
  options,
  onSelect,
  visible,
  onOpen,
  onClose,
  icon,
  theme,
  placeholder,
}) => {
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFF";
  const border = theme?.colors?.border || "#DDD";
  const textPrimary = theme?.colors?.textPrimary || "#333";
  const textSecondary = theme?.colors?.textSecondary || "#666";

  const selectedLabel = (() => {
    if (!value) return null;
    const found = options.find((opt) =>
      typeof opt === "string" ? opt === value : opt.value === value,
    );
    return found ? (typeof found === "string" ? found : found.label) : value;
  })();

  return (
    <View>
      <AppText
        style={{
          fontSize: 14,
          fontWeight: "500",
          color: textSecondary,
          marginBottom: 4,
          marginTop: 16,
        }}
      >
        {label}
      </AppText>
      <TouchableOpacity
        onPress={onOpen}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1.5,
          borderColor: visible ? primary : border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          backgroundColor: surface,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={value ? primary : textSecondary}
            />
          )}
          <AppText
            style={{ fontSize: 15, color: value ? textPrimary : textSecondary }}
          >
            {selectedLabel || placeholder || `Select ${label}`}
          </AppText>
        </View>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={18}
          color={textSecondary}
        />
      </TouchableOpacity>
      {visible && (
        <View
          style={{
            borderWidth: 1,
            borderColor: border,
            borderRadius: 12,
            marginTop: 4,
            backgroundColor: surface,
            maxHeight: 200,
            overflow: "hidden",
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {options.map((opt) => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              return (
                <TouchableOpacity
                  key={optValue}
                  onPress={() => {
                    onSelect(optValue);
                    onClose();
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: border,
                    backgroundColor:
                      value === optValue ? primary + "12" : "transparent",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 15,
                      color: value === optValue ? primary : textPrimary,
                      fontWeight: value === optValue ? "600" : "400",
                    }}
                  >
                    {optLabel}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PostProductScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const prefill = route?.params?.prefill || {};

  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [wereda, setWereda] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceWarning, setPriceWarning] = useState("");
  const [priceSuggestion, setPriceSuggestion] = useState(null);
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);

  const primary = theme?.colors?.primary || "#2E7D32";
  const warningColor = theme?.colors?.warning || "#F57F17";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const background = theme?.colors?.background || "#F9FBF9";

  const unitOptions = UNITS.map((option) =>
    option === "ton" ? { value: option, label: UNIT_LABELS[option] } : option,
  );
  const unitDisplay = UNIT_LABELS[unit] || unit;

  // Price validation
  useEffect(() => {
    if (!price || !cropType) {
      setPriceWarning("");
      return;
    }
    const ref = REFERENCE_PRICES[cropType];
    if (!ref) {
      setPriceWarning("");
      return;
    }
    const unitKey = unit === "quintal" ? "quintal" : "kg";
    const refPrice = ref[unitKey];
    const entered = parseFloat(price);
    if (isNaN(entered)) return;
    if (entered < refPrice * 0.6) {
      setPriceWarning(t("postProduct.priceLowWarning", { refPrice, unitKey }));
    } else if (entered > refPrice * 1.6) {
      setPriceWarning(t("postProduct.priceHighWarning", { refPrice, unitKey }));
    } else {
      setPriceWarning("");
    }
    setPriceSuggestion(refPrice);
  }, [price, cropType, unit]);

  // Apply incoming prefill values from the dashboard or other routes
  useEffect(() => {
    if (prefill.cropType) {
      setCropType(prefill.cropType);
    }
    if (prefill.price !== undefined && prefill.price !== null) {
      setPrice(String(prefill.price));
    }
    if (prefill.unit) {
      setUnit(prefill.unit);
    }
    if (prefill.region) {
      setRegion(prefill.region);
    }
    if (prefill.zone) {
      setZone(prefill.zone);
    }
    if (prefill.wereda) {
      setWereda(prefill.wereda);
    }
  }, [prefill]);

  // Default description when crop selected
  useEffect(() => {
    if (cropType && DEFAULT_DESCRIPTIONS[cropType] && !description) {
      setDescription(DEFAULT_DESCRIPTIONS[cropType]);
    }
  }, [cropType]);

  // Reset zone when region changes
  useEffect(() => {
    setZone("");
  }, [region]);

  const handleSubmit = async () => {
    if (!cropType.trim()) {
      Alert.alert(
        t("postProduct.missingCropTitle"),
        t("postProduct.missingCropMessage"),
      );
      return;
    }
    const qtyNum = parseFloat(quantity);
    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert(
        t("postProduct.invalidQuantityTitle"),
        t("postProduct.invalidQuantityMessage"),
      );
      return;
    }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert(
        t("postProduct.invalidPriceTitle"),
        t("postProduct.invalidPriceMessage"),
      );
      return;
    }

    if (!region.trim()) {
      Alert.alert(
        t("postProduct.missingLocationTitle"),
        t("postProduct.missingLocationMessage"),
      );
      return;
    }

    if (region && ZONES_BY_REGION[region]?.length && !zone.trim()) {
      Alert.alert(
        t("postProduct.missingZoneTitle"),
        t("postProduct.missingZoneMessage"),
      );
      return;
    }

    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.products.create, {
        cropType: cropType.trim(),
        quantity: qtyNum,
        unit: unit.trim() || "kg",
        price: priceNum,
        description: description.trim(),
        location: {
          region: region.trim(),
          zone: zone.trim(),
          kebele: "",
          wereda: wereda.trim(),
        },
      });

      navigation.navigate("FarmerTabs", {
        successMessage: t("postProduct.successMessage"),
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        t("postProduct.defaultErrorMessage");
      Alert.alert(t("postProduct.error"), msg);
    } finally {
      setLoading(false);
    }
  };

  const isDefaultDescription =
    cropType && description === DEFAULT_DESCRIPTIONS[cropType];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <AppHeader
        title={t("postProduct.title")}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Crop Type Dropdown */}
          <DropdownPicker
            label={t("postProduct.cropType")}
            value={cropType}
            options={CROP_TYPES}
            onSelect={setCropType}
            visible={showCropPicker}
            onOpen={() => setShowCropPicker(true)}
            onClose={() => setShowCropPicker(false)}
            icon="leaf-outline"
            theme={theme}
            placeholder={t("postProduct.selectLabel", {
              label: t("postProduct.cropType"),
            })}
          />

          {/* Quantity & Unit row */}
          <View style={styles.row}>
            <View style={styles.flex2}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("postProduct.quantity")}
              </AppText>
              <AppInput
                placeholder="0"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flex1}>
              <DropdownPicker
                label={t("postProduct.unit")}
                value={unit}
                options={unitOptions}
                onSelect={setUnit}
                visible={showUnitPicker}
                onOpen={() => setShowUnitPicker(true)}
                onClose={() => setShowUnitPicker(false)}
                icon="cube-outline"
                theme={theme}
                placeholder={t("postProduct.selectLabel", {
                  label: t("postProduct.unit"),
                })}
              />
            </View>
          </View>

          {/* Price input with suggestion and warning */}
          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("postProduct.pricePer", { unit: unitDisplay })}
          </AppText>
          <AppInput
            placeholder="0"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            leftIcon="pricetag-outline"
          />
          {priceSuggestion && (
            <TouchableOpacity
              onPress={() => setPrice(String(priceSuggestion))}
              style={{
                backgroundColor: primary + "15",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginTop: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="bulb-outline"
                size={14}
                color={primary}
                style={{ marginRight: 6 }}
              />
              <AppText
                style={{ color: primary, fontSize: 13, fontWeight: "600" }}
              >
                {t("postProduct.priceSuggestion", {
                  price: priceSuggestion,
                  unit: unitDisplay,
                })}
              </AppText>
            </TouchableOpacity>
          )}
          {priceWarning ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <Ionicons
                name="warning-outline"
                size={14}
                color={warningColor}
                style={{ marginRight: 4 }}
              />
              <AppText style={{ color: warningColor, fontSize: 13, flex: 1 }}>
                {priceWarning}
              </AppText>
            </View>
          ) : null}

          {/* Description */}
          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("postProduct.descriptionOptional")}
          </AppText>
          <AppInput
            placeholder={t("postProduct.descriptionPlaceholder")}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            inputStyle={styles.textArea}
          />
          {isDefaultDescription && (
            <AppText style={{ color: textMuted, fontSize: 12, marginTop: 4 }}>
              {t("postProduct.defaultDescriptionHint")}
            </AppText>
          )}

          {/* Location Section */}
          <View style={styles.section}>
            <AppText
              variant="headingSm"
              style={[styles.sectionTitle, { color: textPrimary }]}
            >
              {t("postProduct.location")}
            </AppText>

            <DropdownPicker
              label={t("postProduct.region")}
              value={region}
              options={REGIONS}
              onSelect={setRegion}
              visible={showRegionPicker}
              onOpen={() => setShowRegionPicker(true)}
              onClose={() => setShowRegionPicker(false)}
              icon="location-outline"
              theme={theme}
              placeholder={t("postProduct.selectLabel", {
                label: t("postProduct.region"),
              })}
            />

            <DropdownPicker
              label={t("postProduct.zone")}
              value={zone}
              options={region ? ZONES_BY_REGION[region] || [] : []}
              onSelect={setZone}
              visible={showZonePicker}
              onOpen={() => {
                if (!region) {
                  Alert.alert(
                    t("postProduct.selectRegionFirstTitle"),
                    t("postProduct.selectRegionFirstMessage"),
                  );
                  return;
                }
                setShowZonePicker(true);
              }}
              onClose={() => setShowZonePicker(false)}
              icon="map-outline"
              theme={theme}
              placeholder={t("postProduct.selectLabel", {
                label: t("postProduct.zone"),
              })}
            />

            <AppText style={[styles.label, { color: textSecondary }]}>
              {t("postProduct.wereda")}
            </AppText>
            <AppInput
              placeholder={t("postProduct.weredaPlaceholder")}
              value={wereda}
              onChangeText={setWereda}
            />
          </View>

          <AppButton
            title={
              loading ? t("postProduct.posting") : t("postProduct.postListing")
            }
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 16,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  flex2: { flex: 2 },
  flex1: { flex: 1 },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 24,
  },
});
