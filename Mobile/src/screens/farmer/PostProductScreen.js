// src/screens/farmer/PostProductScreen.js
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppText from "../../components/common/AppText";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

export default function PostProductScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [cropType, setCropType]     = useState("");
  const [quantity, setQuantity]     = useState("");
  const [unit, setUnit]             = useState("kg");
  const [price, setPrice]           = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion]         = useState("");
  const [zone, setZone]             = useState("");
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async () => {
    // --- Validation ---
    if (!cropType.trim()) {
      Alert.alert(t("common.error") || "Error", t("product.cropTypeRequired") || "Crop type is required");
      return;
    }
    const parsedQty   = parseFloat(quantity);
    const parsedPrice = parseFloat(price);

    if (!quantity || isNaN(parsedQty) || parsedQty < 0) {
      Alert.alert(t("common.error") || "Error", t("product.quantityInvalid") || "Enter a valid quantity");
      return;
    }
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert(t("common.error") || "Error", t("product.priceInvalid") || "Enter a valid price");
      return;
    }

    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.products.create, {
        cropType:    cropType.trim(),
        quantity:    parsedQty,
        unit:        unit.trim() || "kg",
        price:       parsedPrice,
        description: description.trim(),
        location: {
          region: region.trim(),
          zone:   zone.trim(),
          kebele: "",
        },
      });

      // Navigate back and show a brief success banner via route params
      navigation.navigate("FarmerDashboard", { successMessage: t("product.createSuccess") || "Listing posted!" });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to post listing";
      Alert.alert(t("common.error") || "Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable padding>
      {/* Header */}
      <View style={styles.header}>
        <AppButton
          title="← Back"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        />
        <AppText variant="headingMd">{t("product.createTitle") || "Post a Listing"}</AppText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <AppInput
          label={t("product.cropTypeLabel") || "Crop Type"}
          placeholder={t("product.cropTypePlaceholder") || "e.g. Teff, Wheat, Onion"}
          value={cropType}
          onChangeText={setCropType}
          leftIcon="leaf-outline"
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <AppInput
            label={t("product.quantityLabel") || "Quantity"}
            placeholder="0"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.flex2}
          />
          <AppInput
            label={t("product.unitLabel") || "Unit"}
            placeholder="kg"
            value={unit}
            onChangeText={setUnit}
            style={styles.flex1}
            autoCapitalize="none"
          />
        </View>

        <AppInput
          label={t("product.priceLabel") || "Price (ETB)"}
          placeholder="0"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          leftIcon="pricetag-outline"
        />

        <AppInput
          label={t("product.descLabel") || "Description (optional)"}
          placeholder={t("product.descPlaceholder") || "Quality, harvest date, other details..."}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          inputStyle={styles.textArea}
        />

        <AppText variant="headingSm" style={styles.sectionTitle}>
          {t("product.locationTitle") || "Location"}
        </AppText>

        <AppInput
          label={t("auth.regionLabel") || "Region"}
          placeholder="e.g. Oromia"
          value={region}
          onChangeText={setRegion}
          leftIcon="location-outline"
        />

        <AppInput
          label={t("auth.zoneLabel") || "Zone"}
          placeholder="e.g. Jimma"
          value={zone}
          onChangeText={setZone}
        />

        <AppButton
          title={loading ? (t("common.loading") || "Posting...") : (t("product.submitBtn") || "Post Listing")}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          fullWidth
          style={styles.submitBtn}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  backBtn: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  form: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex2: { flex: 2 },
  flex1: { flex: 1 },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
  },
  submitBtn: {
    marginTop: 16,
  },
});
