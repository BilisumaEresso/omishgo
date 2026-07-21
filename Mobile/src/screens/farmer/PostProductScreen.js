// src/screens/farmer/PostProductScreen.js
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import uploadService from "../../services/upload.service";
import {
  getLocalizedRegions,
  getLocalizedZones,
  getLocalizedWereda,
} from "../../constants/locations";
import {
  CROP_TYPES,
  CROP_TYPES_LOCALIZED,
  DEFAULT_DESCRIPTIONS,
  DEFAULT_DESCRIPTIONS_LOCALIZED,
  REFERENCE_PRICES,
} from "../../constants/crops";
import { UNITS_LOCALIZED } from "../../constants/units";

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
  disabled = false,
}) => {
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFF";
  const border = theme?.colors?.border || "#DDD";
  const textPrimary = theme?.colors?.textPrimary || "#333";
  const textSecondary = theme?.colors?.textSecondary || "#666";

  const safeOptions = Array.isArray(options) ? options : [];

  const selectedLabel = (() => {
    if (!value) return null;
    const found = safeOptions.find((opt) =>
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
        onPress={disabled ? undefined : onOpen}
        activeOpacity={disabled ? 1 : 0.8}
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
          opacity: disabled ? 0.5 : 1,
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
      {visible && safeOptions.length > 0 && (
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
            {safeOptions.map((opt) => {
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
      {visible && safeOptions.length === 0 && (
        <AppText style={{ color: textSecondary, fontSize: 13, marginTop: 4 }}>
          No options available
        </AppText>
      )}
    </View>
  );
};

const MAX_PHOTOS = 2;

// Up to 2 photo slots: pick from camera/gallery, upload to Cloudinary
// immediately, show progress, and let the farmer remove/retry.
const PhotoSlots = ({ photos, onAdd, onRemove, onRetry, theme, t }) => {
  const primary = theme?.colors?.primary || "#2E7D32";
  const surface = theme?.colors?.surface || "#FFF";
  const border = theme?.colors?.border || "#DDD";
  const textSecondary = theme?.colors?.textSecondary || "#666";
  const errorColor = theme?.colors?.error || "#C62828";

  const slots = [...photos];
  while (slots.length < MAX_PHOTOS) slots.push(null);

  return (
    <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
      {slots.map((photo, index) => {
        if (!photo) {
          return (
            <TouchableOpacity
              key={`empty-${index}`}
              onPress={() => onAdd(index)}
              style={{
                width: 96,
                height: 96,
                borderRadius: 12,
                borderWidth: 1.5,
                borderStyle: "dashed",
                borderColor: border,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: surface,
              }}
            >
              <Ionicons name="camera-outline" size={26} color={textSecondary} />
              <AppText style={{ fontSize: 11, color: textSecondary, marginTop: 4 }}>
                {t("postProduct.addPhoto")}
              </AppText>
            </TouchableOpacity>
          );
        }

        return (
          <View
            key={photo.uri}
            style={{
              width: 96,
              height: 96,
              borderRadius: 12,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: border,
            }}
          >
            <Image
              source={{ uri: photo.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            {photo.uploading && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(0,0,0,0.35)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator color="#FFF" />
              </View>
            )}
            {photo.error && !photo.uploading && (
              <TouchableOpacity
                onPress={() => onRetry(index)}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(0,0,0,0.55)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="refresh" size={20} color="#FFF" />
                <AppText style={{ fontSize: 10, color: "#FFF", marginTop: 2 }}>
                  {t("postProduct.retry")}
                </AppText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onRemove(index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 10,
                width: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={13} color="#FFF" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PostProductScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const prefill = route?.params?.prefill || {};

  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // Each item: { uri, url, uploading, error }. url is set once Cloudinary upload succeeds.
  const [photos, setPhotos] = useState([]);
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
  const [showWeredaPicker, setShowWeredaPicker] = useState(false);

  const primary = theme?.colors?.primary || "#2E7D32";
  const warningColor = theme?.colors?.warning || "#F57F17";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const background = theme?.colors?.background || "#F9FBF9";

  const lang = i18n.language || "en";

  // Build localized crop options – CROP_TYPES must be an array
  const cropLabels =
    CROP_TYPES_LOCALIZED?.[lang] || CROP_TYPES_LOCALIZED?.en || {};
  const cropOptions = (CROP_TYPES || []).map((key) => ({
    value: key,
    label: cropLabels[key] || key,
  }));

  const descriptionTemplates =
    DEFAULT_DESCRIPTIONS_LOCALIZED?.[lang] ||
    DEFAULT_DESCRIPTIONS_LOCALIZED?.en ||
    {};

  // Localized units — keep `value` as the stable key, only `label` is localized
  const unitLabels = UNITS_LOCALIZED?.[lang] || UNITS_LOCALIZED?.en || {};
  const unitOptions = Object.entries(unitLabels).map(([key, label]) => ({
    value: key,
    label,
  }));
  const unitDisplay = unitLabels[unit] || unit;

  // Localized location options (region/zone always populated; wereda depends on zone)
  const regionOptions = getLocalizedRegions(lang);
  const availableZones = region ? getLocalizedZones(region, lang) : [];
  const availableWereda = zone ? getLocalizedWereda(region, zone, lang) : [];

  // Price validation — fully guarded against missing reference data
  useEffect(() => {
    if (!price || !cropType) {
      setPriceWarning("");
      setPriceSuggestion(null);
      return;
    }
    const ref = REFERENCE_PRICES?.[cropType];
    const unitKey = unit === "quintal" ? "quintal" : "kg";
    const refPrice = ref?.[unitKey];
    if (!refPrice) {
      setPriceWarning("");
      setPriceSuggestion(null);
      return;
    }
    const entered = parseFloat(price);
    if (isNaN(entered)) {
      setPriceWarning("");
      return;
    }
    if (entered < refPrice * 0.6) {
      setPriceWarning(t("postProduct.priceLowWarning", { refPrice, unitKey }));
    } else if (entered > refPrice * 1.6) {
      setPriceWarning(t("postProduct.priceHighWarning", { refPrice, unitKey }));
    } else {
      setPriceWarning("");
    }
    setPriceSuggestion(refPrice);
  }, [price, cropType, unit]);

  // Prefill from navigation
  useEffect(() => {
    if (prefill.cropType) setCropType(prefill.cropType);
    if (prefill.price !== undefined && prefill.price !== null)
      setPrice(String(prefill.price));
    if (prefill.unit) setUnit(prefill.unit);
    if (prefill.region) setRegion(prefill.region);
    if (prefill.zone) setZone(prefill.zone);
    if (prefill.wereda) setWereda(prefill.wereda);
  }, [prefill]);

  // Localized default description
  useEffect(() => {
    if (cropType && !description) {
      const localizedDesc = descriptionTemplates?.[cropType];
      const fallbackDesc = DEFAULT_DESCRIPTIONS?.[cropType];
      if (localizedDesc || fallbackDesc) {
        setDescription(localizedDesc || fallbackDesc);
      }
    }
  }, [cropType]);

  // Reset child fields on parent change
  useEffect(() => {
    setZone("");
    setWereda("");
  }, [region]);

  useEffect(() => {
    setWereda("");
  }, [zone]);

  // Upload a freshly-picked asset to Cloudinary and update its slot with
  // the resulting URL (or an error flag the farmer can retry from).
  const uploadPhotoAt = async (uri, asset) => {
    setPhotos((prev) =>
      prev.map((p) => (p.uri === uri ? { ...p, uploading: true, error: false } : p)),
    );

    const result = await uploadService.uploadImage(asset);

    setPhotos((prev) =>
      prev.map((p) =>
        p.uri === uri
          ? result.success
            ? { ...p, uploading: false, error: false, url: result.url }
            : { ...p, uploading: false, error: true }
          : p,
      ),
    );
  };

  const launchPicker = async (source) => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert(
        t("postProduct.photoLimitTitle"),
        t("postProduct.photoLimitMessage", { max: MAX_PHOTOS }),
      );
      return;
    }

    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("postProduct.permissionDeniedTitle"),
        t("postProduct.permissionDeniedMessage"),
      );
      return;
    }

    const pickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(pickerOptions)
        : await ImagePicker.launchImageLibraryAsync(pickerOptions);

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setPhotos((prev) => [...prev, { uri: asset.uri, url: null, uploading: true, error: false }]);
    uploadPhotoAt(asset.uri, asset);
  };

  const handleAddPhoto = () => {
    Alert.alert(
      t("postProduct.addPhoto"),
      undefined,
      [
        { text: t("postProduct.takePhoto"), onPress: () => launchPicker("camera") },
        { text: t("postProduct.chooseFromGallery"), onPress: () => launchPicker("gallery") },
        { text: t("postProduct.cancel"), style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRetryPhoto = (index) => {
    const photo = photos[index];
    if (!photo) return;
    uploadPhotoAt(photo.uri, { uri: photo.uri });
  };

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
    if (availableZones.length > 0 && !zone.trim()) {
      Alert.alert(
        t("postProduct.missingZoneTitle"),
        t("postProduct.missingZoneMessage"),
      );
      return;
    }
    if (availableWereda.length > 0 && !wereda.trim()) {
      Alert.alert(
        t("postProduct.missingWeredaTitle"),
        t("postProduct.missingWeredaMessage"),
      );
      return;
    }
    if (photos.some((p) => p.uploading)) {
      Alert.alert(
        t("postProduct.photosStillUploadingTitle"),
        t("postProduct.photosStillUploadingMessage"),
      );
      return;
    }

    setLoading(true);
    try {
      const photoUrls = photos.filter((p) => p.url).map((p) => p.url);
      await api.post(API_ENDPOINTS.products.create, {
        cropType: cropType.trim(),
        quantity: qtyNum,
        unit: unit.trim() || "kg",
        price: priceNum,
        description: description.trim(),
        photos: photoUrls,
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
    cropType &&
    (description === DEFAULT_DESCRIPTIONS?.[cropType] ||
      description === descriptionTemplates?.[cropType]);

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
            options={cropOptions}
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

          {/* Photos Section */}
          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("postProduct.photos")}
          </AppText>
          <AppText style={{ color: textMuted, fontSize: 12, marginBottom: 4 }}>
            {t("postProduct.photosHint")}
          </AppText>
          <PhotoSlots
            photos={photos}
            onAdd={handleAddPhoto}
            onRemove={handleRemovePhoto}
            onRetry={handleRetryPhoto}
            theme={theme}
            t={t}
          />

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
              options={regionOptions}
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
              options={availableZones}
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
              disabled={!region}
            />

            <DropdownPicker
              label={t("postProduct.wereda")}
              value={wereda}
              options={availableWereda}
              onSelect={setWereda}
              visible={showWeredaPicker}
              onOpen={() => {
                if (!zone) {
                  Alert.alert(
                    t("postProduct.selectZoneFirstTitle"),
                    t("postProduct.selectZoneFirstMessage"),
                  );
                  return;
                }
                setShowWeredaPicker(true);
              }}
              onClose={() => setShowWeredaPicker(false)}
              icon="pin-outline"
              theme={theme}
              placeholder={t("postProduct.selectLabel", {
                label: t("postProduct.wereda"),
              })}
              disabled={!zone}
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
  section: { marginTop: 8 },
  sectionTitle: { marginBottom: 12, marginTop: 8 },
  submitButton: { marginTop: 24 },
});
