// src/components/farmer/AddProductModal.js
import { useState } from "react";
import { View, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppButton from "../common/AppButton";
import { useTheme } from "../../hooks/useTheme";
export default function AddProductModal({
  visible,
  onClose,
  onSubmit
}) {
  const {
    theme
  } = useTheme();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Tomato",
    unit: "bag (50kg)"
  });
  const [error, setError] = useState("");
  const handleSubmit = () => {
    if (!newProduct.name.trim()) {
      setError("Crop name is required");
      return;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }
    setError("");
    onSubmit(newProduct);
    // Reset form
    setNewProduct({
      name: "",
      price: "",
      category: "Tomato",
      unit: "bag (50kg)"
    });
    onClose();
  };
  const primaryColor = theme?.colors?.primary || "#4CAF50";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const borderColor = theme?.colors?.border || "#E0E0E0";
  const textPrimary = theme?.colors?.textPrimary || "#212121";
  const textSecondary = theme?.colors?.textSecondary || "#757575";
  const errorColor = theme?.colors?.error || "#F44336";
  const inputBg = theme?.colors?.inputBackground || "#FFFFFF";
  const spacing = theme.spacing || {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  };
  const radius = theme.radius || {
    sm: 8,
    md: 12,
    lg: 16
  };
  return <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
            <View style={[styles.modal, {
            backgroundColor: surfaceColor
          }]}>
              {/* Header */}
              <View style={styles.header}>
                <AppText variant="headingSm" style={{
                color: textPrimary,
                fontWeight: "700"
              }}>
                  List New Produce
                </AppText>
                <TouchableOpacity onPress={onClose} hitSlop={{
                top: 12,
                bottom: 12,
                left: 12,
                right: 12
              }} style={styles.closeBtn}>
                  <Ionicons name="close" size={28} color={textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Crop Name */}
              <AppText variant="caption" style={[styles.label, {
              color: textSecondary
            }]}>
                Crop Name
              </AppText>
              <TextInput style={[styles.input, {
              borderColor: error && !newProduct.name.trim() ? errorColor : borderColor,
              backgroundColor: inputBg,
              color: textPrimary
            }]} placeholder="e.g. Red Onion" placeholderTextColor={textSecondary} value={newProduct.name} onChangeText={text => {
              setNewProduct({
                ...newProduct,
                name: text
              });
              if (error) setError("");
            }} autoCapitalize="words" />

              {/* Category Picker */}
              <AppText variant="caption" style={[styles.label, {
              color: textSecondary
            }]}>
                Category
              </AppText>
              <View style={styles.pickerRow}>
                {["Tomato", "Teff", "Onion"].map(cat => <TouchableOpacity key={cat} onPress={() => setNewProduct({
                ...newProduct,
                category: cat
              })} style={[styles.optionChip, {
                borderColor,
                backgroundColor: newProduct.category === cat ? primaryColor : "transparent"
              }]} activeOpacity={0.7}>
                    <AppText variant="caption" style={{
                  color: newProduct.category === cat ? "#FFF" : textPrimary,
                  fontWeight: "600"
                }}>
                      {cat}
                    </AppText>
                  </TouchableOpacity>)}
              </View>

              {/* Unit Picker */}
              <AppText variant="caption" style={[styles.label, {
              color: textSecondary
            }]}>
                Unit
              </AppText>
              <View style={styles.pickerRow}>
                {["bag (50kg)", "100kg", "Quintal"].map(unit => <TouchableOpacity key={unit} onPress={() => setNewProduct({
                ...newProduct,
                unit
              })} style={[styles.optionChip, {
                borderColor,
                backgroundColor: newProduct.unit === unit ? primaryColor : "transparent"
              }]} activeOpacity={0.7}>
                    <AppText variant="caption" style={{
                  color: newProduct.unit === unit ? "#FFF" : textPrimary,
                  fontWeight: "600"
                }}>
                      {unit}
                    </AppText>
                  </TouchableOpacity>)}
              </View>

              {/* Price */}
              <AppText variant="caption" style={[styles.label, {
              color: textSecondary
            }]}>
                Price (ETB)
              </AppText>
              <TextInput style={[styles.input, {
              borderColor: error && (!newProduct.price || parseFloat(newProduct.price) <= 0) ? errorColor : borderColor,
              backgroundColor: inputBg,
              color: textPrimary
            }]} placeholder="e.g. 4500" placeholderTextColor={textSecondary} keyboardType="numeric" value={newProduct.price} onChangeText={text => {
              setNewProduct({
                ...newProduct,
                price: text
              });
              if (error) setError("");
            }} />

              {/* Error message */}
              {error ? <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={errorColor} />
                  <AppText variant="caption" style={{
                color: errorColor,
                marginLeft: 4
              }}>
                    {error}
                  </AppText>
                </View> : null}

              {/* Submit Button */}
              <AppButton title="Publish Listing" onPress={handleSubmit} fullWidth style={{
              marginTop: spacing.lg
            }} disabled={!newProduct.name.trim() || !newProduct.price} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>;
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  modal: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    marginBottom: 6,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    fontSize: 16
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 8
  },
  optionChip: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8
  }
});