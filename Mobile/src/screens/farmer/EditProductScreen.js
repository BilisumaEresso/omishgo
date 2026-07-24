// Mobile/src/screens/farmer/EditProductScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
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

// ─── Data Constants (duplicated from PostProductScreen) ──────────────────────
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

// ─── DropdownPicker (copied from PostProductScreen) ─────────────────────────
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
export default function EditProductScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const product = route.params?.product || {};

  // Pre‑fill state from product
  const [cropType, setCropType] = useState(product?.cropType || "");
  const [quantity, setQuantity] = useState(String(product?.quantity || ""));
  const [unit, setUnit] = useState(product?.unit || "kg");
  const [price, setPrice] = useState(String(product?.price || ""));
  const [description, setDescription] = useState(product?.description || "");
  const [region, setRegion] = useState(product?.location?.region || "");
  const [zone, setZone] = useState(product?.location?.zone || "");
  const [wereda, setWereda] = useState(product?.location?.wereda || "");
  const [loading, setLoading] = useState(false);

  const regionRef = useRef(region);
  const unitOptions = UNITS.map((option) =>
    option === "ton" ? { value: option, label: UNIT_LABELS[option] } : option,
  );
  const unitDisplay = UNIT_LABELS[unit] || unit;

  const [showCropPicker, setShowCropPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);

  const primary = theme?.colors?.primary || "#2E7D32";
  const error = theme?.colors?.error || "#C62828";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const background = theme?.colors?.background || "#F9FBF9";

  useEffect(() => {
    if (regionRef.current !== region) {
      setZone("");
    }
    regionRef.current = region;
  }, [region]);

  const handleUpdate = async () => {
    if (!cropType || !quantity || !price || !region) {
      Alert.alert(
        t("editProduct.missingFieldsTitle"),
        t("editProduct.missingFieldsMessage"),
      );
      return;
    }

    if (region && ZONES_BY_REGION[region]?.length && !zone.trim()) {
      Alert.alert(
        t("editProduct.missingZoneTitle"),
        t("editProduct.missingZoneMessage"),
      );
      return;
    }

    setLoading(true);
    try {
      await api.put(
        API_ENDPOINTS.products.update(product?.id || product?._id),
        {
          cropType,
          quantity: Number(quantity),
          unit,
          price: Number(price),
          description,
          location: {
            region: region.trim(),
            zone: zone.trim(),
            wereda: wereda.trim(),
            kebele: "",
          },
        },
      );
      Alert.alert(
        t("editProduct.updateSuccessTitle"),
        t("editProduct.updateSuccessMessage"),
        [{ text: t("editProduct.ok"), onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert(
        t("editProduct.updateErrorTitle"),
        err.response?.data?.message || t("editProduct.updateErrorMessage"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t("editProduct.deleteConfirmTitle"),
      t("editProduct.deleteConfirmMessage"),
      [
        { text: t("editProduct.cancel"), style: "cancel" },
        {
          text: t("editProduct.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(
                API_ENDPOINTS.products.delete(product?.id || product?._id),
              );
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                t("editProduct.deleteErrorTitle"),
                t("editProduct.deleteErrorMessage"),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <AppHeader
        title={t("editProduct.title")}
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
          {/* Crop Type */}
          <DropdownPicker
            label={t("editProduct.cropType")}
            value={cropType}
            options={CROP_TYPES}
            onSelect={setCropType}
            visible={showCropPicker}
            onOpen={() => setShowCropPicker(true)}
            onClose={() => setShowCropPicker(false)}
            icon="leaf-outline"
            theme={theme}
            placeholder={t("editProduct.selectLabel", {
              label: t("editProduct.cropType"),
            })}
          />

          {/* Quantity & Unit */}
          <View style={styles.row}>
            <View style={styles.flex2}>
              <AppText style={[styles.label, { color: textSecondary }]}>
                {t("editProduct.quantity")}
              </AppText>
              <AppInput
                placeholder={t("editProduct.quantityPlaceholder")}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flex1}>
              <DropdownPicker
                label={t("editProduct.unit")}
                value={unit}
                options={unitOptions}
                onSelect={setUnit}
                visible={showUnitPicker}
                onOpen={() => setShowUnitPicker(true)}
                onClose={() => setShowUnitPicker(false)}
                icon="cube-outline"
                theme={theme}
                placeholder={t("editProduct.selectLabel", {
                  label: t("editProduct.unit"),
                })}
              />
            </View>
          </View>

          {/* Price */}
          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("editProduct.pricePerUnit", { unit: unitDisplay })}
          </AppText>
          <AppInput
            placeholder={t("editProduct.pricePlaceholder")}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            leftIcon="pricetag-outline"
          />

          {/* Description */}
          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("editProduct.description")}
          </AppText>
          <AppInput
            placeholder={t("editProduct.descriptionPlaceholder")}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            inputStyle={styles.textArea}
          />

          {/* Location Section */}
          <View style={styles.section}>
            <AppText
              variant="headingSm"
              style={[styles.sectionTitle, { color: textPrimary }]}
            >
              {t("editProduct.location")}
            </AppText>

            <DropdownPicker
              label={t("editProduct.region")}
              value={region}
              options={REGIONS}
              onSelect={setRegion}
              visible={showRegionPicker}
              onOpen={() => setShowRegionPicker(true)}
              onClose={() => setShowRegionPicker(false)}
              icon="location-outline"
              theme={theme}
              placeholder={t("editProduct.selectLabel", {
                label: t("editProduct.region"),
              })}
            />

            <DropdownPicker
              label={t("editProduct.zone")}
              value={zone}
              options={region ? ZONES_BY_REGION[region] || [] : []}
              onSelect={setZone}
              visible={showZonePicker}
              onOpen={() => {
                if (!region) {
                  Alert.alert(
                    t("editProduct.selectRegionFirstTitle"),
                    t("editProduct.selectRegionFirstMessage"),
                  );
                  return;
                }
                setShowZonePicker(true);
              }}
              onClose={() => setShowZonePicker(false)}
              icon="map-outline"
              theme={theme}
              placeholder={t("editProduct.selectLabel", {
                label: t("editProduct.zone"),
              })}
            />

            <AppText style={[styles.label, { color: textSecondary }]}>
              {t("editProduct.wereda")}
            </AppText>
            <AppInput
              placeholder={t("editProduct.weredaPlaceholder")}
              value={wereda}
              onChangeText={setWereda}
            />
          </View>

          {/* Save / Delete Buttons */}
          <AppButton
            title={t("editProduct.saveChanges")}
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.submitButton}
          />

          <AppButton
            title={t("editProduct.deleteListing")}
            variant="outline"
            fullWidth
            onPress={handleDelete}
            style={{ marginTop: 12 }}
            textStyle={{ color: error }}
            borderColor={error}
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
