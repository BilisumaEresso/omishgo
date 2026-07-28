// src/components/buyer/PostBulkRequestModal.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import api from "../../config/api";
import { API_ENDPOINTS } from "../../constants/api";
import { CROP_TYPES, getLocalizedCropName } from "../../constants/crops";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";

const CROPS = CROP_TYPES;

export default function PostBulkRequestModal({
  visible,
  onClose,
  initialCrop = "Red Onion",
  onSuccess,
}) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme?.colors?.primary || "#1565C0";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";

  const [cropType, setCropType] = useState(initialCrop);
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("q");
  const [targetPrice, setTargetPrice] = useState("4500");
  const [deliveryRegion, setDeliveryRegion] = useState("Addis Ababa");
  const [farmerRegion, setFarmerRegion] = useState("Oromia");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!cropType || !quantity || !targetPrice || !deliveryRegion) {
      setErrorMsg(t("sourcing.fillAllFields", { defaultValue: "Please fill in all required fields (crop, quantity, price, delivery region)" }));
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessResult(null);

      const payload = {
        cropType,
        quantity: Number(quantity),
        unit,
        targetPrice: Number(targetPrice),
        deliveryRegion,
        farmerCriteria: {
          region: farmerRegion,
          notes,
        },
      };

      const res = await api.post(API_ENDPOINTS.sourcing.createRequest, payload);
      const data = res.data;

      if (data.success) {
        const notifiedCount = data.data?.notifiedCount || 0;
        setSuccessResult(t("sourcing.requestCreatedMsg", { count: notifiedCount, defaultValue: `Request created! ${notifiedCount} matching farmers notified in chat.` }));
        setTimeout(() => {
          setSuccessResult(null);
          onSuccess && onSuccess(data.data?.request);
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.message || t("sourcing.failedSubmit", { defaultValue: "Failed to submit request" }));
      }
    } catch (err) {
      console.warn("PostBulkRequest error:", err.message);
      setErrorMsg(err.response?.data?.message || err.message || t("sourcing.networkError", { defaultValue: "Network request error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[styles.bottomSheet, { backgroundColor: surfaceColor }]}>
          {/* Drag Handle */}
          <View style={styles.dragHandleWrap}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <AppText style={styles.title}>{t("buyerDashboard.postBulkRequest", { defaultValue: "Post Bulk Sourcing Request" })}</AppText>
              <AppText style={styles.subtitle}>{t("sourcing.broadcastSub", { defaultValue: "Broadcast your requirements directly to local farmers" })}</AppText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <AppText style={styles.errorText}>{errorMsg}</AppText>
              </View>
            ) : null}

            {successResult ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <AppText style={styles.successText}>{successResult}</AppText>
              </View>
            ) : null}

            {/* Crop Selector */}
            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>{t("sourcing.commodityCropLabel", { defaultValue: "Commodity Crop *" })}</AppText>
              <View style={styles.cropPillRow}>
                {CROPS.map((c) => {
                  const active = c === cropType;
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.cropPill,
                        active && { backgroundColor: primaryColor, borderColor: primaryColor },
                      ]}
                      onPress={() => setCropType(c)}
                      activeOpacity={0.8}
                    >
                      <AppText style={[styles.cropPillText, active && styles.activeCropText]}>
                        {getLocalizedCropName(c, i18n.language || "en", t)}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quantity & Target Price */}
            <View style={styles.rowFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <AppText style={styles.fieldLabel}>{t("sourcing.quantityLabel", { defaultValue: "Quantity (Quintals `q`) *" })}</AppText>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g. 50"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <AppText style={styles.fieldLabel}>{t("sourcing.targetPriceLabel", { defaultValue: "Target Price (ETB / q) *" })}</AppText>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={targetPrice}
                  onChangeText={setTargetPrice}
                  placeholder="e.g. 4500"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Delivery Destination */}
            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>{t("sourcing.deliveryDestLabel", { defaultValue: "Delivery Destination / Market Hub *" })}</AppText>
              <TextInput
                style={styles.input}
                value={deliveryRegion}
                onChangeText={setDeliveryRegion}
                placeholder={t("sourcing.deliveryPlaceholder", { defaultValue: "e.g. Addis Ababa Mercato, Adama Hub" })}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Farmer Criteria / Region */}
            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>{t("sourcing.farmerRegionLabel", { defaultValue: "Target Farmer Region (Optional)" })}</AppText>
              <TextInput
                style={styles.input}
                value={farmerRegion}
                onChangeText={setFarmerRegion}
                placeholder={t("sourcing.farmerRegionPlaceholder", { defaultValue: "e.g. Oromia, East Shewa" })}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Special Instructions */}
            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>{t("sourcing.notesLabel", { defaultValue: "Special Requirements / Notes" })}</AppText>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                placeholder={t("sourcing.notesPlaceholder", { defaultValue: "e.g. Minimum 10 quintals per farmer, organic grade preferred" })}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: primaryColor }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <AppText style={styles.submitBtnText}>{t("sourcing.broadcastBtn", { defaultValue: "Broadcast Sourcing Request to Farmers" })}</AppText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    zIndex: 99999,
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    paddingTop: 10,
    marginBottom: -20,
  },
  dragHandleWrap: {
    alignItems: "center",
    paddingVertical: 6,
  },
  dragHandle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  successText: {
    color: "#10B981",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },
  cropPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cropPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cropPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  activeCropText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  rowFields: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    height: 48,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
  },
  multilineInput: {
    height: 75,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  submitBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
