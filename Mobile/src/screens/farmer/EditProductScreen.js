// Mobile/src/screens/farmer/EditProductScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
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
import { CROP_TYPES, CROP_TYPES_LOCALIZED } from "../../constants/crops";
import {
  getLocalizedRegions,
  getLocalizedZones,
  getLocalizedWereda,
} from "../../constants/locations";
import { UNITS_LOCALIZED } from "../../constants/units";
import { useTheme } from "../../hooks/useTheme";

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

export default function EditProductScreen({ route, navigation }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const product = route.params?.product || {};

  const [cropType, setCropType] = useState(product?.cropType || product?.category || "");
  const [quantity, setQuantity] = useState(String(product?.quantity || ""));
  const [unit, setUnit] = useState(product?.unit || "quintal");
  const [price, setPrice] = useState(String(product?.price || ""));
  const [status, setStatus] = useState(product?.status || "active");
  const [description, setDescription] = useState(product?.description || "");
  const [region, setRegion] = useState(product?.location?.region || "");
  const [zone, setZone] = useState(product?.location?.zone || "");
  const [wereda, setWereda] = useState(product?.location?.wereda || "");
  const [loading, setLoading] = useState(false);

  const [showCropPicker, setShowCropPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showWeredaPicker, setShowWeredaPicker] = useState(false);

  const primary = theme?.colors?.primary || "#15803D";
  const error = "#DC2626";
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
    setZone("");
    setWereda("");
  }, [region]);

  useEffect(() => {
    setWereda("");
  }, [zone]);

  const handleUpdate = async () => {
    if (!cropType || !quantity || !price || !region) {
      Alert.alert(
        t("editProduct.missingFieldsTitle", { defaultValue: "Missing Fields" }),
        t("editProduct.missingFieldsMsg", { defaultValue: "Please complete crop type, stock quantity, price, and location." })
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
          status,
          description,
          location: {
            region: region.trim(),
            zone: zone.trim(),
            wereda: wereda.trim(),
            kebele: "",
          },
        }
      );

      Alert.alert(
        t("editProduct.updatedSuccessTitle", { defaultValue: "Listing Updated!" }),
        t("editProduct.updatedSuccessMsg", { defaultValue: "Your harvest listing changes have been saved successfully." }),
        [{ text: t("common.ok", { defaultValue: "OK" }), onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert(
        t("editProduct.updateFailedTitle", { defaultValue: "Update Failed" }),
        err.response?.data?.message || err.message || t("editProduct.updateFailedMsg", { defaultValue: "Failed to update listing." })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t("editProduct.deleteConfirmTitle", { defaultValue: "Delete Listing" }),
      t("editProduct.deleteConfirmMsg", { cropType, defaultValue: "Are you sure you want to delete \"{{cropType}}\" listing? This action cannot be undone." }),
      [
        { text: t("common.cancel", { defaultValue: "Cancel" }), style: "cancel" },
        {
          text: t("editProduct.deleteListingBtn", { defaultValue: "Delete Listing" }),
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(
                API_ENDPOINTS.products.delete(product?.id || product?._id)
              );
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                t("editProduct.deleteErrorTitle", { defaultValue: "Delete Error" }),
                t("editProduct.deleteErrorMsg", { defaultValue: "Unable to delete product listing." })
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <AppHeader title={t("editProduct.title", { defaultValue: "Edit Harvest Listing" })} showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Status Switcher Banner */}
          <View style={styles.statusCard}>
            <AppText style={styles.statusCardTitle}>{t("editProduct.availabilityStatus", { defaultValue: "Listing Availability Status" })}</AppText>
            <View style={styles.statusToggleRow}>
              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  status === "active" && { backgroundColor: "#15803D" },
                ]}
                onPress={() => setStatus("active")}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={16} color={status === "active" ? "#FFFFFF" : "#15803D"} />
                <AppText style={[styles.statusToggleText, status === "active" && { color: "#FFFFFF" }]}>
                  {t("editProduct.activeStock", { defaultValue: "Active Stock" })}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  status === "sold" && { backgroundColor: "#DC2626" },
                ]}
                onPress={() => setStatus("sold")}
                activeOpacity={0.8}
              >
                <Ionicons name="archive" size={16} color={status === "sold" ? "#FFFFFF" : "#DC2626"} />
                <AppText style={[styles.statusToggleText, status === "sold" && { color: "#FFFFFF" }]}>
                  {t("editProduct.soldOut", { defaultValue: "Sold Out" })}
                </AppText>
              </TouchableOpacity>
            </View>
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
                placeholder={t("postProduct.unitPlaceholder", { defaultValue: "Unit" })}
              />
            </View>
          </View>

          {/* Price per Unit */}
          <AppText style={styles.inputLabel}>
            {t("postProduct.pricePerUnitLabel", { defaultValue: "Price per {{unit}} (ETB)", unit: unitDisplay })}
          </AppText>
          <AppInput
            placeholder="0"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            leftIcon="pricetag-outline"
          />

          {/* Description */}
          <AppText style={styles.inputLabel}>{t("editProduct.description", { defaultValue: "Listing Description" })}</AppText>
          <AppInput
            placeholder={t("editProduct.descriptionPlaceholder", { defaultValue: "Add details about crop quality, harvest date, packaging..." })}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            inputStyle={styles.textArea}
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
                    t("postProduct.selectRegionFirstMsg", { defaultValue: "Please select a region before picking a zone." })
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
                    t("postProduct.selectZoneFirstMsg", { defaultValue: "Please select a zone before picking a wereda." })
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

          {/* Save / Delete Buttons */}
          <AppButton
            title={loading ? t("editProduct.savingChanges", { defaultValue: "Saving Changes..." }) : t("editProduct.saveChangesBtn", { defaultValue: "✓ Save Changes" })}
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.submitBtn}
          />

          <AppButton
            title={t("editProduct.deleteListingBtn", { defaultValue: "Delete Listing" })}
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
  statusCardTitle: { fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 10 },
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
  inputLabel: { fontSize: 13, fontWeight: "700", color: "#0F172A", marginTop: 14, marginBottom: 6 },
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
  textArea: { minHeight: 90, textAlignVertical: "top", paddingTop: 10 },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 18,
  },
  sectionCardTitle: { fontSize: 14, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  submitBtn: { marginTop: 22, backgroundColor: "#15803D", borderRadius: 14, paddingVertical: 14 },
});
