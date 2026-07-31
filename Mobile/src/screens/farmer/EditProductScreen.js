// Mobile/src/screens/farmer/EditProductScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
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
import { CROP_TYPES, CROP_TYPES_LOCALIZED, CROP_VARIETIES, getLocalizedCropDisplayName } from "../../constants/crops";
import {
  getLocalizedRegions,
  getLocalizedWereda,
  getLocalizedZones,
} from "../../constants/locations";
import { UNITS_LOCALIZED } from "../../constants/units";
import { useTheme } from "../../hooks/useTheme";
import uploadService from "../../services/upload.service";
import { useAuthStore } from "../../store/auth.store";

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
              onPress={onAdd}
              style={[
                styles.photoSlotEmpty,
                { borderColor: border, backgroundColor: surface },
              ]}
            >
              <Ionicons name="camera" size={26} color={primary} />
              <AppText
                style={[styles.photoSlotEmptyText, { color: textSecondary }]}
              >
                {t("postProduct.addPhoto", { defaultValue: "Add Photo" })}
              </AppText>
            </TouchableOpacity>
          );
        }

        return (
          <View
            key={photo.uri || index}
            style={[styles.photoSlotFilled, { borderColor: border }]}
          >
            <Image
              source={{ uri: photo.uri || photo.url }}
              style={styles.photoImg}
              resizeMode="cover"
            />

            {photo.uploading && (
              <View style={styles.photoOverlay}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            )}

            {photo.error && !photo.uploading && (
              <TouchableOpacity
                onPress={() => onRetry(index)}
                style={styles.photoOverlayError}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <AppText style={styles.photoRetryText}>
                  {t("postProduct.retry", { defaultValue: "Retry" })}
                </AppText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => onRemove(index)}
              style={styles.removePhotoBtn}
            >
              <Ionicons name="close" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const DropdownPicker = ({
  label,
  value,
  displayValue,
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
      typeof opt === "string" ? opt === value : opt.value === value,
    );
    return found ? (typeof found === "string" ? found : found.label) : value;
  })();

  const activeText = displayValue || selectedLabel;

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
              color={activeText ? primary : textSecondary}
            />
          )}
          <AppText
            style={[
              styles.dropdownText,
              { color: activeText ? textPrimary : textSecondary },
            ]}
          >
            {activeText || placeholder}
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
          style={[
            styles.dropdownMenu,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {safeOptions.map((opt) => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              const isIndented = typeof opt === "object" && opt.isIndented;
              const isSelected = value === optValue;

              return (
                <TouchableOpacity
                  key={optValue}
                  onPress={() => {
                    const shouldClose = onSelect(optValue);
                    if (shouldClose !== false) onClose();
                  }}
                  style={[
                    styles.dropdownOption,
                    isIndented && styles.dropdownOptionIndented,
                    isSelected && { backgroundColor: primary + "15" },
                  ]}
                >
                  <AppText
                    style={[
                      styles.dropdownOptionText,
                      isIndented && styles.dropdownOptionIndentedText,
                      {
                        color: isSelected ? primary : textPrimary,
                        fontWeight: isSelected ? "700" : "400",
                      },
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

export default function EditProductScreen({ route, navigation }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const product = route.params?.product || {};

  const userRegion = user?.location?.region || user?.region || "";
  const userZone = user?.location?.zone || user?.zone || "";
  const userWereda = user?.location?.wereda || user?.wereda || "";

  const [cropType, setCropType] = useState(
    product?.cropType || product?.category || "",
  );
  const [variety, setVariety] = useState(product?.variety || "");
  const [expandedCrop, setExpandedCrop] = useState(null);
  const [quantity, setQuantity] = useState(String(product?.quantity || ""));
  const [unit, setUnit] = useState(product?.unit || "quintal");
  const [price, setPrice] = useState(String(product?.price || ""));
  const [status, setStatus] = useState(product?.status || "active");
  const [description, setDescription] = useState(product?.description || "");
  const initialPhotos = (Array.isArray(product?.photos) ? product.photos : [])
    .filter(Boolean)
    .map((url) => ({ uri: url, url, uploading: false, error: false }));
  const [photos, setPhotos] = useState(initialPhotos);
  const [region, setRegion] = useState(product?.location?.region || userRegion);
  const [zone, setZone] = useState(product?.location?.zone || userZone);
  const [wereda, setWereda] = useState(product?.location?.wereda || userWereda);
  const [loading, setLoading] = useState(false);

  const [showCropPicker, setShowCropPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showWeredaPicker, setShowWeredaPicker] = useState(false);

  const primary = theme?.colors?.primary || "#15803D";
  const error = "#DC2626";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const background = "#F8FAFC";
  const lang = i18n.language || "en";

  const cropLabels =
    CROP_TYPES_LOCALIZED?.[lang] || CROP_TYPES_LOCALIZED?.en || {};
  const cropOptions = (CROP_TYPES || []).reduce((acc, key) => {
    const cropLabel = cropLabels[key] || key;
    acc.push({
      value: key,
      label: cropLabel,
    });

    if (expandedCrop === key && CROP_VARIETIES[key]?.length) {
      const anyLabel = t("postProduct.anyVariety", {
        crop: cropLabel,
        defaultValue: `Any ${cropLabel}`,
      });
      acc.push({
        value: `any::${key}`,
        label: anyLabel,
        isIndented: true,
      });

      CROP_VARIETIES[key].forEach((v) => {
        const vLocalized = t(`varieties.${v}`, { defaultValue: v });
        acc.push({
          value: `variety::${v}`,
          label: vLocalized,
          isIndented: true,
        });
      });
    }
    return acc;
  }, []);

  const handleCropSelect = (optValue) => {
    if (optValue.startsWith("any::")) {
      const selectedCrop = optValue.replace("any::", "");
      setCropType(selectedCrop);
      setVariety("");
      setExpandedCrop(null);
      return true;
    }
    if (optValue.startsWith("variety::")) {
      const selectedVariety = optValue.replace("variety::", "");
      setCropType(expandedCrop);
      setVariety(selectedVariety);
      setExpandedCrop(null);
      return true;
    }

    if (CROP_VARIETIES[optValue]) {
      if (optValue !== expandedCrop) {
        setExpandedCrop(optValue);
        return false;
      }
      setCropType(optValue);
      setVariety("");
      setExpandedCrop(null);
      return true;
    }

    setCropType(optValue);
    setVariety("");
    setExpandedCrop(null);
    return true;
  };

  const cropDisplayValue = cropType
    ? getLocalizedCropDisplayName(cropType, variety, lang, t)
    : "";

  const unitLabels = UNITS_LOCALIZED?.[lang] || UNITS_LOCALIZED?.en || {};
  const unitOptions = Object.entries(unitLabels).map(([key, label]) => ({
    value: key,
    label,
  }));
  const unitDisplay = unitLabels[unit] || unit;

  const regionOptions = getLocalizedRegions(lang);
  const availableZones = region ? getLocalizedZones(region, lang) : [];
  const availableWereda = zone ? getLocalizedWereda(region, zone, lang) : [];

  const uploadPhotoAt = async (uri, asset) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.uri === uri ? { ...p, uploading: true, error: false } : p,
      ),
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
        t("postProduct.photoLimitTitle", { defaultValue: "Photo Limit" }),
        t("postProduct.photoLimitMsg", {
          defaultValue: "Maximum 2 photos per crop listing.",
        }),
      );
      return;
    }

    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("postProduct.permissionRequiredTitle", {
          defaultValue: "Permission Required",
        }),
        t("postProduct.permissionRequiredMsg", {
          defaultValue:
            "Camera/Gallery access is required to attach product photos.",
        }),
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
    setPhotos((prev) => [
      ...prev,
      { uri: asset.uri, url: null, uploading: true, error: false },
    ]);
    uploadPhotoAt(asset.uri, asset);
  };

  const handleAddPhoto = () => {
    Alert.alert(
      t("postProduct.addPhotoTitle", { defaultValue: "Add Crop Photo" }),
      t("postProduct.choosePhotoSource", {
        defaultValue: "Choose photo source:",
      }),
      [
        {
          text: t("postProduct.takePhoto", { defaultValue: "Take Photo" }),
          onPress: () => launchPicker("camera"),
        },
        {
          text: t("postProduct.chooseGallery", {
            defaultValue: "Choose from Gallery",
          }),
          onPress: () => launchPicker("gallery"),
        },
        {
          text: t("common.cancel", { defaultValue: "Cancel" }),
          style: "cancel",
        },
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

  const handleUpdate = async () => {
    if (!cropType || !quantity || !price || !region) {
      Alert.alert(
        t("editProduct.missingFieldsTitle", { defaultValue: "Missing Fields" }),
        t("editProduct.missingFieldsMsg", {
          defaultValue:
            "Please complete crop type, stock quantity, price, and location.",
        }),
      );
      return;
    }

    const isUploading = photos.some((p) => p.uploading);
    if (isUploading) {
      Alert.alert(
        t("postProduct.uploadingTitle", { defaultValue: "Upload in Progress" }),
        t("postProduct.uploadingMsg", {
          defaultValue: "Please wait for photos to finish uploading.",
        }),
      );
      return;
    }

    const hasError = photos.some((p) => p.error || !p.url);
    if (hasError) {
      Alert.alert(
        t("postProduct.uploadErrorTitle", {
          defaultValue: "Photo Upload Failed",
        }),
        t("postProduct.uploadErrorMsg", {
          defaultValue:
            "One or more photos failed to upload. Please tap retry or remove them.",
        }),
      );
      return;
    }

    const photoUrls = photos
      .map((p) => p.url)
      .filter((u) => u && typeof u === "string");

    setLoading(true);
    try {
      await api.put(
        API_ENDPOINTS.products.update(product?.id || product?._id),
        {
          cropType,
          variety: variety ? variety.trim() : null,
          quantity: Number(quantity),
          unit,
          price: Number(price),
          status,
          description,
          photos: photoUrls,
          location: {
            region: region.trim(),
            zone: zone.trim(),
            wereda: wereda.trim(),
            kebele: "",
          },
        },
      );

      Alert.alert(
        t("editProduct.updatedSuccessTitle", {
          defaultValue: "Listing Updated!",
        }),
        t("editProduct.updatedSuccessMsg", {
          defaultValue:
            "Your harvest listing changes have been saved successfully.",
        }),
        [
          {
            text: t("common.ok", { defaultValue: "OK" }),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err) {
      Alert.alert(
        t("editProduct.updateFailedTitle", { defaultValue: "Update Failed" }),
        err.response?.data?.message ||
          err.message ||
          t("editProduct.updateFailedMsg", {
            defaultValue: "Failed to update listing.",
          }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t("editProduct.deleteConfirmTitle", { defaultValue: "Delete Listing" }),
      t("editProduct.deleteConfirmMsg", {
        cropType,
        defaultValue: "Are you sure you want to delete this listing?",
      }),
      [
        {
          text: t("common.cancel", { defaultValue: "Cancel" }),
          style: "cancel",
        },
        {
          text: t("editProduct.deleteListingBtn", {
            defaultValue: "Delete Listing",
          }),
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(
                API_ENDPOINTS.products.delete(product?.id || product?._id),
              );
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                t("editProduct.deleteFailedTitle", {
                  defaultValue: "Delete Failed",
                }),
                err.response?.data?.message ||
                  err.message ||
                  t("editProduct.deleteFailedMsg", {
                    defaultValue: "Failed to delete listing.",
                  }),
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
        title={t("editProduct.title", { defaultValue: "Edit Harvest Listing" })}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statusCard}>
            <AppText style={styles.statusCardTitle}>
              {t("editProduct.availabilityStatus", {
                defaultValue: "Listing Availability Status",
              })}
            </AppText>
            <View style={styles.statusToggleRow}>
              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  status === "active" && { backgroundColor: "#15803D" },
                ]}
                onPress={() => setStatus("active")}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={status === "active" ? "#FFFFFF" : "#15803D"}
                />
                <AppText
                  style={[
                    styles.statusToggleText,
                    status === "active" && { color: "#FFFFFF" },
                  ]}
                >
                  {t("editProduct.activeStock", { defaultValue: "Active" })}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  status === "sold" && { backgroundColor: "#DC2626" },
                ]}
                onPress={() => setStatus("sold")}
              >
                <Ionicons
                  name="archive"
                  size={16}
                  color={status === "sold" ? "#FFFFFF" : "#DC2626"}
                />
                <AppText
                  style={[
                    styles.statusToggleText,
                    status === "sold" && { color: "#FFFFFF" },
                  ]}
                >
                  {t("editProduct.soldOut", { defaultValue: "Sold Out" })}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <DropdownPicker
            label={t("postProduct.cropType", { defaultValue: "Crop Type" })}
            value={cropType}
            displayValue={cropDisplayValue}
            options={cropOptions}
            onSelect={handleCropSelect}
            visible={showCropPicker}
            onOpen={() => setShowCropPicker(true)}
            onClose={() => setShowCropPicker(false)}
            icon="leaf-outline"
            theme={theme}
            placeholder={t("editProduct.cropSelectPlaceholder", {
              defaultValue: "Select Harvest Crop",
            })}
          />

          <View style={styles.row}>
            <View style={{ flex: 2 }}>
              <AppText style={styles.inputLabel}>
                {t("postProduct.stockQuantity", {
                  defaultValue: "Stock Quantity",
                })}
              </AppText>
              <AppInput
                placeholder="0"
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
                placeholder={t("postProduct.unitPlaceholder", {
                  defaultValue: "Unit",
                })}
              />
            </View>
          </View>

          <AppText style={styles.inputLabel}>
            {t("postProduct.pricePerUnitLabel", {
              defaultValue: "Price per {{unit}} (ETB)",
              unit: unitDisplay,
            })}
          </AppText>
          <AppInput
            placeholder="0"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            leftIcon="pricetag-outline"
          />

          <AppText style={styles.inputLabel}>
            {t("postProduct.harvestPhotosLabel", {
              defaultValue: "Harvest Photos (Max 2)",
            })}
          </AppText>
          <PhotoSlots
            photos={photos}
            onAdd={handleAddPhoto}
            onRemove={handleRemovePhoto}
            onRetry={handleRetryPhoto}
            theme={theme}
            t={t}
          />

          <AppText style={styles.inputLabel}>
            {t("editProduct.description", {
              defaultValue: "Listing Description",
            })}
          </AppText>
          <AppInput
            placeholder={t("editProduct.descriptionPlaceholder", {
              defaultValue: "Add details...",
            })}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            inputStyle={styles.textArea}
          />

          <View style={styles.sectionCard}>
            <AppText style={styles.sectionCardTitle}>
              {t("postProduct.farmLocationSection", {
                defaultValue: "Farm Location",
              })}
            </AppText>
            <DropdownPicker
              label={t("postProduct.regionLabel", { defaultValue: "Region" })}
              value={region}
              options={regionOptions}
              onSelect={(val) => {
                setRegion(val);
                setZone("");
                setWereda("");
              }}
              visible={showRegionPicker}
              onOpen={() => setShowRegionPicker(true)}
              onClose={() => setShowRegionPicker(false)}
              icon="location-outline"
              theme={theme}
              placeholder={t("postProduct.selectRegionPlaceholder", {
                defaultValue: "Select Region",
              })}
            />
            <DropdownPicker
              label={t("postProduct.zoneLabel", { defaultValue: "Zone" })}
              value={zone}
              options={availableZones}
              onSelect={(val) => {
                setZone(val);
                setWereda("");
              }}
              visible={showZonePicker}
              onOpen={() => {
                if (!region)
                  return Alert.alert(
                    t("postProduct.selectRegionFirstTitle", {
                      defaultValue: "Select Region First",
                    }),
                  );
                setShowZonePicker(true);
              }}
              onClose={() => setShowZonePicker(false)}
              icon="map-outline"
              theme={theme}
              placeholder={t("postProduct.selectZonePlaceholder", {
                defaultValue: "Select Zone",
              })}
              disabled={!region}
            />
            <DropdownPicker
              label={t("postProduct.weredaLabel", { defaultValue: "Wereda" })}
              value={wereda}
              options={availableWereda}
              onSelect={setWereda}
              visible={showWeredaPicker}
              onOpen={() => {
                if (!zone)
                  return Alert.alert(
                    t("postProduct.selectZoneFirstTitle", {
                      defaultValue: "Select Zone First",
                    }),
                  );
                setShowWeredaPicker(true);
              }}
              onClose={() => setShowWeredaPicker(false)}
              icon="navigate-outline"
              theme={theme}
              placeholder={t("postProduct.selectWeredaPlaceholder", {
                defaultValue: "Select Wereda",
              })}
              disabled={!zone}
            />
          </View>

          <AppButton
            title={t("editProduct.saveChangesBtn", {
              defaultValue: "Save Changes",
            })}
            fullWidth
            loading={loading}
            onPress={handleUpdate}
            style={styles.submitBtn}
          />
          <AppButton
            title={t("editProduct.deleteListingBtn", {
              defaultValue: "Delete Listing",
            })}
            variant="outline"
            fullWidth
            onPress={handleDelete}
            style={{ marginTop: 12 }}
            textStyle={{ color: error, fontWeight: "800" }}
            borderColor={error}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 10 },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 16,
  },
  statusCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  statusToggleRow: { flexDirection: "row", gap: 10 },
  statusToggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  statusToggleText: { fontSize: 12.5, fontWeight: "800", color: "#334155" },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 14,
    marginBottom: 6,
  },
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
  dropdownOptionIndented: { paddingLeft: 32, backgroundColor: "#F8FAFC" },
  dropdownOptionText: { fontSize: 14 },
  dropdownOptionIndentedText: { fontSize: 13.5 },
  row: { flexDirection: "row", gap: 10 },
  textArea: { minHeight: 90, textAlignVertical: "top", paddingTop: 10 },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 18,
  },
  sectionCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  photoSlotEmpty: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  photoSlotEmptyText: { fontSize: 11, fontWeight: "700", marginTop: 4 },
  photoSlotFilled: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
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
  submitBtn: {
    marginTop: 22,
    backgroundColor: "#15803D",
    borderRadius: 14,
    paddingVertical: 14,
  },
});
