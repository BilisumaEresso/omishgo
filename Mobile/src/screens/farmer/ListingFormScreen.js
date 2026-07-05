// Mobile/src/screens/farmer/PostProductScreen.js (or ListingFormScreen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import { useTheme } from "../../hooks/useTheme";

const ListingFormScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Theme colors
  const primary = theme?.colors?.primary || "#2E7D32";
  const background = theme?.colors?.background || "#F9FBF9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const border = theme?.colors?.border || "#D0E8CE";
  const warning = theme?.colors?.warning || "#F57F17";
  const info = theme?.colors?.info || "#0277BD";
  const error = theme?.colors?.error || "#C62828";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");

  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      if (state.isConnected) {
        syncDrafts();
      }
    });

    loadDraft();

    return () => unsubscribe();
  }, []);

  const loadDraft = async () => {
    try {
      const draftStr = await AsyncStorage.getItem("@product_draft");
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        setTitle(draft.title || "");
        setDescription(draft.description || "");
        setPrice(draft.price || "");
        setUnit(draft.unit || "");
        setQuantity(draft.quantity || "");
      }
    } catch (e) {
      console.log("Failed to load draft", e);
    }
  };

  const saveDraft = async (draftData) => {
    try {
      await AsyncStorage.setItem("@product_draft", JSON.stringify(draftData));
    } catch (e) {
      console.log("Failed to save draft", e);
    }
  };

  const clearDraft = async () => {
    await AsyncStorage.removeItem("@product_draft");
  };

  const syncDrafts = async () => {
    try {
      const draftStr = await AsyncStorage.getItem("@product_draft");
      if (draftStr) {
        setIsSyncing(true);
        const draft = JSON.parse(draftStr);
        // Call actual backend API here
        // await api.post("/products", draft);
        console.log("Synced draft to backend:", draft);
        await clearDraft();
        Alert.alert("Success", "Offline draft synced successfully!");
        setTitle("");
        setDescription("");
        setPrice("");
        setUnit("");
        setQuantity("");
      }
    } catch (e) {
      console.log("Sync failed", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !price) {
      Alert.alert("Error", "Title and Price are required");
      return;
    }

    const productData = { title, description, price, unit, quantity };

    if (isOffline) {
      await saveDraft(productData);
      Alert.alert("Offline", t("product.draftSaved"));
      navigation.goBack();
      return;
    }

    try {
      // await api.post("/products", productData);
      console.log("Submitted product:", productData);
      await clearDraft();
      Alert.alert("Success", "Listing submitted and pending approval");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to submit listing");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <AppHeader
        title={t("product.createTitle") || "Post Product"}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showNotification={true}
        notificationCount={0}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: warning }]}>
          <AppText style={styles.bannerText}>
            {t("product.draftBanner")}
          </AppText>
        </View>
      )}
      {isSyncing && (
        <View style={[styles.syncBanner, { backgroundColor: info }]}>
          <AppText style={styles.bannerText}>{t("product.syncing")}</AppText>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={[styles.heading, { color: textPrimary }]}>
          {t("product.createTitle")}
        </AppText>

        <View style={styles.form}>
          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("product.titleLabel")}
          </AppText>
          <TextInput
            style={[styles.input, { borderColor: border, color: textPrimary }]}
            placeholder={t("product.titlePlaceholder")}
            placeholderTextColor={textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("product.descLabel")}
          </AppText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { borderColor: border, color: textPrimary },
            ]}
            placeholder={t("product.descPlaceholder")}
            placeholderTextColor={textSecondary}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("product.priceLabel")}
          </AppText>
          <TextInput
            style={[styles.input, { borderColor: border, color: textPrimary }]}
            placeholder={t("product.pricePlaceholder")}
            placeholderTextColor={textSecondary}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("product.unitLabel")}
          </AppText>
          <TextInput
            style={[styles.input, { borderColor: border, color: textPrimary }]}
            placeholder={t("product.unitPlaceholder")}
            placeholderTextColor={textSecondary}
            value={unit}
            onChangeText={setUnit}
          />

          <AppText style={[styles.label, { color: textSecondary }]}>
            {t("product.quantityLabel")}
          </AppText>
          <TextInput
            style={[styles.input, { borderColor: border, color: textPrimary }]}
            placeholder={t("product.quantityPlaceholder")}
            placeholderTextColor={textSecondary}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: primary }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <AppText style={[styles.buttonText, { color: surface }]}>
              {t("common.submit")}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBanner: {
    padding: 10,
    alignItems: "center",
  },
  syncBanner: {
    padding: 10,
    alignItems: "center",
  },
  bannerText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  content: {
    padding: 24,
    paddingTop: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: -8,
  },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ListingFormScreen;
