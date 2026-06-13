import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
// Assuming an api service exists. In MVP, you might just use fetch or axios directly.
// For now, I'll mock the api call structure as it would be used in the MVP.

const ListingFormScreen = ({ navigation }) => {
  const { t } = useTranslation();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
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
        setTitle(""); setDescription(""); setPrice(""); setUnit(""); setQuantity("");
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
      // Call actual backend API here
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
    <SafeAreaView style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>{t("product.draftBanner")}</Text>
        </View>
      )}
      {isSyncing && (
        <View style={styles.syncBanner}>
          <Text style={styles.syncText}>{t("product.syncing")}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("product.createTitle")}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t("product.titleLabel")}</Text>
          <TextInput style={styles.input} placeholder={t("product.titlePlaceholder")} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>{t("product.descLabel")}</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder={t("product.descPlaceholder")} multiline value={description} onChangeText={setDescription} />

          <Text style={styles.label}>{t("product.priceLabel")}</Text>
          <TextInput style={styles.input} placeholder={t("product.pricePlaceholder")} keyboardType="numeric" value={price} onChangeText={setPrice} />

          <Text style={styles.label}>{t("product.unitLabel")}</Text>
          <TextInput style={styles.input} placeholder={t("product.unitPlaceholder")} value={unit} onChangeText={setUnit} />

          <Text style={styles.label}>{t("product.quantityLabel")}</Text>
          <TextInput style={styles.input} placeholder={t("product.quantityPlaceholder")} keyboardType="numeric" value={quantity} onChangeText={setQuantity} />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{t("common.submit")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  offlineBanner: { backgroundColor: "#ff9800", padding: 10, alignItems: "center" },
  offlineText: { color: "#fff", fontWeight: "bold" },
  syncBanner: { backgroundColor: "#2196f3", padding: 10, alignItems: "center" },
  syncText: { color: "#fff", fontWeight: "bold" },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 24 },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: -8 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 14, borderRadius: 8, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: "top" },
  button: { backgroundColor: "#2e7d32", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default ListingFormScreen;
