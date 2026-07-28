// src/screens/farmer/PostProductScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import {
  CROP_TYPES,
  CROP_TYPES_LOCALIZED,
  DEFAULT_DESCRIPTIONS,
  DEFAULT_DESCRIPTIONS_LOCALIZED,
  REFERENCE_PRICES,
} from "../../constants/crops";
import {
  getLocalizedRegions,
  getLocalizedWereda,
  getLocalizedZones,
} from "../../constants/locations";
import { UNITS_LOCALIZED } from "../../constants/units";
import { useTheme } from "../../hooks/useTheme";
import draftsService from "../../services/drafts.service";
import uploadService from "../../services/upload.service";
import { isConnected, subscribeToConnectivity } from "../../utils/connectivity";

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
  const primary = theme?.colors?.primary || "#15803D";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#CBD5E1";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const safeOptions = Array.isArray(options) ? options : [];

  const selectedLabel = (() => {
    if (!value) return null;
    const found = safeOptions.find((opt) =>
      typeof opt === "string" ? opt === value : opt.value === value
    );
    return found ? (typeof found === "string" ? found : found.label) : value;
  })();

  return (
    <View>
      <AppText style={styles.inputLabel}>{label}</AppText>
      <TouchableOpacity
        onPress={disabled ? undefined : onOpen}
        activeOpacity={disabled ? 1 : 0.8}
        style={[
          styles.dropdownBtn,
          {
            borderColor: visible ? primary : border,
            backgroundColor: surface,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <View style={styles.dropdownInner}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={value ? primary : textSecondary}
            />
          )}
          <AppText
            style={[
              styles.dropdownText,
              { color: value ? textPrimary : textSecondary },
            ]}
          >
            {selectedLabel || placeholder || t("common.selectRegion", { defaultValue: "Select..." })}
          </AppText>
        </View>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={18}
          color={textSecondary}
        />
      </TouchableOpacity>
      {visible && safeOptions.length > 0 && (
        <View style={[styles.dropdownMenu, { backgroundColor: surface, borderColor: border }]}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {safeOptions.map((opt) => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              const isSelected = value === optValue;

              return (
                <TouchableOpacity
                  key={optValue}
                  onPress={() => {
                    onSelect(optValue);
                    onClose();
                  }}
                  style={[
                    styles.dropdownOption,
                    isSelected && { backgroundColor: primary + "15" },
                  ]}
                >
                  <AppText
                    style={[
                      styles.dropdownOptionText,
                      { color: isSelected ? primary : textPrimary, fontWeight: isSelected ? "700" : "400" },
                    ]}
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

const MAX_PHOTOS = 2;

const PhotoSlots = ({ photos, onAdd, onRemove, onRetry, theme, t }) => {
  const primary = theme?.colors?.primary || "#15803D";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#CBD5E1";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

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
              style={[styles.photoSlotEmpty, { borderColor: border, backgroundColor: surface }]}
            >
              <Ionicons name="camera" size={26} color={primary} />
              <AppText style={[styles.photoSlotEmptyText, { color: textSecondary }]}>
                {t("postProduct.addPhoto", "Add Photo")}
              </AppText>
            </TouchableOpacity>
          );
        }

        return (
          <View key={photo.uri} style={[styles.photoSlotFilled, { borderColor: border }]}>
            <Image source={{ uri: photo.uri }} style={styles.photoImg} resizeMode="cover" />

            {photo.uploading && (
              <View style={styles.photoOverlay}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            )}

            {photo.error && !photo.uploading && (
              <TouchableOpacity onPress={() => onRetry(index)} style={styles.photoOverlayError}>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <AppText style={styles.photoRetryText}>{t("postProduct.retry", "Retry")}</AppText>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => onRemove(index)} style={styles.removePhotoBtn}>
              <Ionicons name="close" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default function PostProductScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const prefill = route?.params?.prefill || {};

  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("quintal");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [wereda, setWereda] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCropPicker, setShowCropPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showWeredaPicker, setShowWeredaPicker] = useState(false);

  const primary = theme?.colors?.primary || "#15803D";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";
  const background = "#F8FAFC";

  const lang = i18n.language || "en";

  const cropLabels = CROP_TYPES_LOCALIZED?.[lang] || CROP_TYPES_LOCALIZED?.en || {};
  const cropOptions = (CROP_TYPES || []).map((key) => ({
    value: key,
    label: cropLabels[key] || key,
  }));

  const unitLabels = UNITS_LOCALIZED?.[lang] || UNITS_LOCALIZED?.en || {};
  const unitOptions = Object.entries(unitLabels).map(([key, label]) => ({
    value: key,
    label,
  }));
  const unitDisplay = unitLabels[unit] || unit;

  const regionOptions = getLocalizedRegions(lang);
  const availableZones = region ? getLocalizedZones(region, lang) : [];
  const availableWereda = zone ? getLocalizedWereda(region, zone, lang) : [];

  useEffect(() => {
    isConnected().then(setIsOnline);
    const unsubscribe = subscribeToConnectivity(setIsOnline);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (prefill.cropType) setCropType(prefill.cropType);
    if (prefill.quantity) setQuantity(String(prefill.quantity));
    if (prefill.price !== undefined && prefill.price !== null) setPrice(String(prefill.price));
    if (prefill.unit) setUnit(prefill.unit);
    if (prefill.region) setRegion(prefill.region);
    if (prefill.zone) setZone(prefill.zone);
    if (prefill.wereda) setWereda(prefill.wereda);
  }, [prefill]);

  useEffect(() => {
    setZone("");
    setWereda("");
  }, [region]);

  useEffect(() => {
    setWereda("");
  }, [zone]);

  const uploadPhotoAt = async (uri, asset) => {
    setPhotos((prev) =>
      prev.map((p) => (p.uri === uri ? { ...p, uploading: true, error: false } : p))
    );

    const result = await uploadService.uploadImage(asset);

    setPhotos((prev) =>
      prev.map((p) =>
        p.uri === uri
          ? result.success
            ? { ...p, uploading: false, error: false, url: result.url }
            : { ...p, uploading: false, error: true }
          : p
      )
    );
  };

  const launchPicker = async (source) => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert(
        t("postProduct.photoLimitTitle", { defaultValue: "Photo Limit" }),
        t("postProduct.photoLimitMsg", { defaultValue: "Maximum 2 photos per crop listing." })
      );
      return;
    }

    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("postProduct.permissionRequiredTitle", { defaultValue: "Permission Required" }),
        t("postProduct.permissionRequiredMsg", { defaultValue: "Camera/Gallery access is required to attach product photos." })
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
    setPhotos((prev) => [...prev, { uri: asset.uri, url: asset.uri, uploading: false, error: false }]);
    uploadPhotoAt(asset.uri, asset);
  };

  const handleAddPhoto = () => {
    Alert.alert(
      t("postProduct.addPhotoTitle", { defaultValue: "Add Crop Photo" }),
      t("postProduct.choosePhotoSource", { defaultValue: "Choose photo source:" }),
      [
        { text: t("postProduct.takePhoto", { defaultValue: "Take Photo" }), onPress: () => launchPicker("camera") },
        { text: t("postProduct.chooseGallery", { defaultValue: "Choose from Gallery" }), onPress: () => launchPicker("gallery") },
        { text: t("common.cancel", { defaultValue: "Cancel" }), style: "cancel" },
      ],
      { cancelable: true }
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
        t("postProduct.cropRequiredTitle", { defaultValue: "Crop Required" }),
        t("postProduct.cropRequiredMsg", { defaultValue: "Please select a crop type." })
      );
      return;
    }
    const qtyNum = parseFloat(quantity);
    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert(
        t("postProduct.qtyRequiredTitle", { defaultValue: "Quantity Required" }),
        t("postProduct.qtyRequiredMsg", { defaultValue: "Please enter a valid stock volume quantity." })
      );
      return;
    }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert(
        t("postProduct.priceRequiredTitle", { defaultValue: "Price Required" }),
        t("postProduct.priceRequiredMsg", { defaultValue: "Please enter a valid price per unit." })
      );
      return;
    }
    if (!region.trim()) {
      Alert.alert(
        t("postProduct.locRequiredTitle", { defaultValue: "Location Required" }),
        t("postProduct.locRequiredMsg", { defaultValue: "Please select a region." })
      );
      return;
    }

    const payload = {
      cropType: cropType.trim(),
      quantity: qtyNum,
      unit: unit.trim() || "quintal",
      price: priceNum,
      description: description.trim() || t("postProduct.defaultDescription", { defaultValue: "{{qty}} {{unit}} of fresh {{crop}} harvest ready for wholesale.", qty: qtyNum, unit, crop: cropType }),
      location: {
        region: region.trim(),
        zone: zone.trim(),
        kebele: "",
        wereda: wereda.trim(),
      },
      sourcingRequestId: prefill.sourcingRequestId || undefined,
    };

    setLoading(true);
    try {
      const photoUrls = photos.map((p) => p.url || p.uri).filter(Boolean);
      const res = await api.post(API_ENDPOINTS.products.create, { ...payload, photos: photoUrls });
      const createdProdId = res.data?.data?.product?._id;

      if (prefill.sourcingRequestId) {
        try {
          await api.post(API_ENDPOINTS.sourcing.respond(prefill.sourcingRequestId), {
            action: "accepted",
            productId: createdProdId,
          });
        } catch (_) {}
      }

      Alert.alert(
        t("postProduct.listedSuccessTitle", { defaultValue: "Harvest Listed!" }),
        t("postProduct.listedSuccessMsg", { defaultValue: "Your produce listing is now live for wholesale buyers." }),
        [{ text: t("common.ok", { defaultValue: "OK" }), onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || t("postProduct.errorPostListing", { defaultValue: "Failed to post listing" });
      Alert.alert(t("postProduct.submissionErrorTitle", { defaultValue: "Submission Error" }), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <AppHeader title={t("postProduct.title", { defaultValue: "Post Harvest Produce" })} showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero Form Header Card */}
          <View style={styles.heroBanner}>
            <View style={styles.heroBadge}>
              <Ionicons name="leaf" size={14} color="#A7F3D0" />
              <AppText style={styles.heroBadgeText}>{t("postProduct.formTitle", { defaultValue: "Producer Listing Form" })}</AppText>
            </View>
            <AppText style={styles.heroTitle}>{t("postProduct.title", { defaultValue: "Post New Harvest Listing" })}</AppText>
            <AppText style={styles.heroSub}>
              {t("postProduct.formDesc", { defaultValue: "Fill in your crop details to receive direct purchase orders from wholesale buyers across Ethiopia." })}
            </AppText>
          </View>

          {/* Quick Select Crop Pills */}
          <AppText style={styles.inputLabel}>{t("postProduct.popularCrops", { defaultValue: "Popular Harvest Crops" })}</AppText>
          <View style={styles.popularRow}>
            {CROP_TYPES.slice(0, 5).map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.popularPill,
                  cropType === c ? { backgroundColor: primary } : { backgroundColor: "#FFFFFF" },
                ]}
                onPress={() => setCropType(c)}
                activeOpacity={0.8}
              >
                <AppText style={[styles.popularPillText, cropType === c && { color: "#FFFFFF" }]}>
                  {cropLabels[c] || c}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Crop Type Dropdown */}
          <DropdownPicker
            label={t("postProduct.cropType", { defaultValue: "Crop Type / Commodity" })}
            value={cropType}
            options={cropOptions}
            onSelect={setCropType}
            visible={showCropPicker}
            onOpen={() => setShowCropPicker(true)}
            onClose={() => setShowCropPicker(false)}
            icon="leaf-outline"
            theme={theme}
            placeholder={t("editProduct.cropSelectPlaceholder", { defaultValue: "Select Harvest Crop" })}
          />

          {/* Quantity & Unit Row */}
          <View style={styles.row}>
            <View style={{ flex: 2 }}>
              <AppText style={styles.inputLabel}>{t("postProduct.stockQuantity", { defaultValue: "Stock Quantity" })}</AppText>
              <AppInput
                placeholder={t("postProduct.quantityPlaceholder", { defaultValue: "e.g. 100" })}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1.2 }}>
              <DropdownPicker
                label={t("postProduct.unit", { defaultValue: "Unit" })}
                value={unit}
                options={unitOptions}
                onSelect={setUnit}
                visible={showUnitPicker}
                onOpen={() => setShowUnitPicker(true)}
                onClose={() => setShowUnitPicker(false)}
                icon="cube-outline"
                theme={theme}
                placeholder={t("postProduct.unitPlaceholder", { defaultValue: "Unit" })}
              />
            </View>
          </View>

          {/* Price per Unit */}
          <AppText style={styles.inputLabel}>
            {t("postProduct.pricePerUnitLabel", { defaultValue: "Price per {{unit}} (ETB)", unit: unitDisplay })}
          </AppText>
          <AppInput
            placeholder="e.g. 4500"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            leftIcon="pricetag-outline"
          />

          {/* Photos Upload Section */}
          <AppText style={styles.inputLabel}>
            {t("postProduct.harvestPhotosLabel", { defaultValue: "Harvest Photos (Max 2)" })}
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
          <View style={styles.sectionCard}>
            <AppText style={styles.sectionCardTitle}>
              {t("postProduct.farmLocationSection", { defaultValue: "Farm / Storage Location" })}
            </AppText>

            <DropdownPicker
              label={t("postProduct.regionLabel", { defaultValue: "Region" })}
              value={region}
              options={regionOptions}
              onSelect={setRegion}
              visible={showRegionPicker}
              onOpen={() => setShowRegionPicker(true)}
              onClose={() => setShowRegionPicker(false)}
              icon="location-outline"
              theme={theme}
              placeholder={t("postProduct.selectRegionPlaceholder", { defaultValue: "Select Region" })}
            />

            <DropdownPicker
              label={t("postProduct.zoneLabel", { defaultValue: "Zone" })}
              value={zone}
              options={availableZones}
              onSelect={setZone}
              visible={showZonePicker}
              onOpen={() => {
                if (!region) {
                  Alert.alert(
                    t("postProduct.selectRegionFirstTitle", { defaultValue: "Select Region First" }),
                    t("postProduct.selectRegionFirstMsg", { defaultValue: "Please pick a region before choosing a zone." })
                  );
                  return;
                }
                setShowZonePicker(true);
              }}
              onClose={() => setShowZonePicker(false)}
              icon="map-outline"
              theme={theme}
              placeholder={t("postProduct.selectZonePlaceholder", { defaultValue: "Select Zone" })}
              disabled={!region}
            />

            <DropdownPicker
              label={t("postProduct.weredaLabel", { defaultValue: "Wereda / District" })}
              value={wereda}
              options={availableWereda}
              onSelect={setWereda}
              visible={showWeredaPicker}
              onOpen={() => {
                if (!zone) {
                  Alert.alert(
                    t("postProduct.selectZoneFirstTitle", { defaultValue: "Select Zone First" }),
                    t("postProduct.selectZoneFirstMsg", { defaultValue: "Please pick a zone before choosing a wereda." })
                  );
                  return;
                }
                setShowWeredaPicker(true);
              }}
              onClose={() => setShowWeredaPicker(false)}
              icon="navigate-outline"
              theme={theme}
              placeholder={t("postProduct.selectWeredaPlaceholder", { defaultValue: "Select Wereda" })}
              disabled={!zone}
            />
          </View>

          {/* Submit Button */}
          <AppButton
            title={loading ? t("postProduct.publishingBtn", { defaultValue: "Publishing Listing..." }) : t("postProduct.publishBtn", { defaultValue: "🚀 Publish Harvest Listing" })}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 10 },
  heroBanner: {
    backgroundColor: "#15803D",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  heroBadgeText: { color: "#A7F3D0", fontSize: 11.5, fontWeight: "700" },
  heroTitle: { fontSize: 18, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
  heroSub: { fontSize: 12.5, color: "#DCFCE7", lineHeight: 18 },
  inputLabel: { fontSize: 13, fontWeight: "700", color: "#0F172A", marginTop: 14, marginBottom: 6 },
  popularRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 6 },
  popularPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  popularPillText: { fontSize: 12, fontWeight: "700", color: "#334155" },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  dropdownText: { fontSize: 14, fontWeight: "600" },
  dropdownMenu: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 4,
    maxHeight: 180,
    overflow: "hidden",
    elevation: 4,
  },
  dropdownOption: { paddingHorizontal: 16, paddingVertical: 12 },
  dropdownOptionText: { fontSize: 14 },
  row: { flexDirection: "row", gap: 10 },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 18,
  },
  sectionCardTitle: { fontSize: 14, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  photoSlotEmpty: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  photoSlotEmptyText: { fontSize: 11, fontWeight: "700", marginTop: 4 },
  photoSlotFilled: { width: 90, height: 90, borderRadius: 16, overflow: "hidden", borderWidth: 1 },
  photoImg: { width: "100%", height: "100%" },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoOverlayError: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoRetryText: { fontSize: 10, color: "#FFFFFF", fontWeight: "700" },
  removePhotoBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: { marginTop: 22, backgroundColor: "#15803D", borderRadius: 14, paddingVertical: 14 },
});
