// src/screens/farmer/PostProductScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AppHeader from "../../components/layout/AppHeader";
import AppText from "../../components/common/AppText";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { useTheme } from "../../hooks/useTheme";

export default function PostProductScreen({ navigation }) {
  const { theme } = useTheme();

  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(false);

  const primary = theme.colors.primary || "#4CAF50";
  const textPrimary = theme.colors.textPrimary || "#212121";
  const bg = theme.colors.background || "#F8F9FA";

  const handleSubmit = async () => {
    if (!cropType.trim()) {
      Alert.alert(
        "Missing Crop",
        "Please enter the crop type (e.g. Teff, Onion)",
      );
      return;
    }
    const qtyNum = parseFloat(quantity);
    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert("Invalid Quantity", "Enter a valid number for quantity");
      return;
    }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Invalid Price", "Enter a valid price in ETB");
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
        },
      });

      navigation.navigate("FarmerDashboard", {
        successMessage: "Your listing was posted successfully!",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Fixed header with back arrow */}
      <AppHeader
        title="Post Product"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showMenu={false}
        showNotification={false}
        showSearch={false}
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
          {/* Form starts here – the header already shows the title */}
          <AppText style={styles.label}>Crop Type</AppText>
          <AppInput
            placeholder="e.g. Teff, Wheat, Onion"
            value={cropType}
            onChangeText={setCropType}
            leftIcon="leaf-outline"
            autoCapitalize="words"
          />

          <View style={styles.row}>
            <View style={styles.flex2}>
              <AppText style={styles.label}>Quantity</AppText>
              <AppInput
                placeholder="0"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flex1}>
              <AppText style={styles.label}>Unit</AppText>
              <AppInput
                placeholder="kg"
                value={unit}
                onChangeText={setUnit}
                autoCapitalize="none"
              />
            </View>
          </View>

          <AppText style={styles.label}>Price (ETB)</AppText>
          <AppInput
            placeholder="0"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            leftIcon="pricetag-outline"
          />

          <AppText style={styles.label}>Description (optional)</AppText>
          <AppInput
            placeholder="Quality, harvest date, other details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            inputStyle={styles.textArea}
          />

          <View style={styles.section}>
            <AppText
              variant="headingSm"
              style={[styles.sectionTitle, { color: textPrimary }]}
            >
              Location
            </AppText>
            <AppText style={styles.label}>Region</AppText>
            <AppInput
              placeholder="e.g. Oromia"
              value={region}
              onChangeText={setRegion}
              leftIcon="location-outline"
            />
            <AppText style={styles.label}>Zone</AppText>
            <AppInput
              placeholder="e.g. Jimma"
              value={zone}
              onChangeText={setZone}
            />
          </View>

          <AppButton
            title={loading ? "Posting..." : "Post Listing"}
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
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8, // small space below header
  },
  label: {
    fontSize: 14,
    color: "#757575",
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
