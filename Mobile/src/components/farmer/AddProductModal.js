import React, { useState } from "react";
import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";
import AppButton from "../common/AppButton";
import { useTheme } from "../../hooks/useTheme";

export default function AddProductModal({ visible, onClose, onSubmit }) {
  const { theme } = useTheme();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Tomato",
    unit: "bag (50kg)",
  });

  const handleSubmit = () => {
    if (!newProduct.name || !newProduct.price) return;
    onSubmit(newProduct);
    setNewProduct({
      name: "",
      price: "",
      category: "Tomato",
      unit: "bag (50kg)",
    });
    onClose();
  };

  const primaryColor = theme.colors.primary;
  const surfaceColor = theme.colors.surface;
  const borderColor = theme.colors.border;
  const textPrimary = theme.colors.textPrimary;
  const textSecondary = theme.colors.textSecondary;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: surfaceColor }]}>
          <View style={styles.header}>
            <AppText variant="headingSm" style={{ color: textPrimary }}>
              List New Produce
            </AppText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={textSecondary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { borderColor, color: textPrimary }]}
            placeholder="Crop Name"
            placeholderTextColor={textSecondary}
            value={newProduct.name}
            onChangeText={(text) =>
              setNewProduct({ ...newProduct, name: text })
            }
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <AppText variant="caption" style={{ color: textSecondary }}>
                Category
              </AppText>
              <View style={[styles.picker, { borderColor }]}>
                {["Tomato", "Teff", "Onion"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() =>
                      setNewProduct({ ...newProduct, category: cat })
                    }
                    style={[
                      styles.option,
                      newProduct.category === cat && {
                        backgroundColor: primaryColor,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={{
                        color:
                          newProduct.category === cat ? "#FFF" : textPrimary,
                      }}
                    >
                      {cat}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.half}>
              <AppText variant="caption" style={{ color: textSecondary }}>
                Unit
              </AppText>
              <View style={[styles.picker, { borderColor }]}>
                {["bag (50kg)", "100kg", "Quintal"].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setNewProduct({ ...newProduct, unit })}
                    style={[
                      styles.option,
                      newProduct.unit === unit && {
                        backgroundColor: primaryColor,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={{
                        color: newProduct.unit === unit ? "#FFF" : textPrimary,
                      }}
                    >
                      {unit}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TextInput
            style={[styles.input, { borderColor, color: textPrimary }]}
            placeholder="Price (ETB)"
            placeholderTextColor={textSecondary}
            keyboardType="numeric"
            value={newProduct.price}
            onChangeText={(text) =>
              setNewProduct({ ...newProduct, price: text })
            }
          />

          <AppButton
            title="Publish Listing"
            onPress={handleSubmit}
            fullWidth
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  half: { flex: 0.48 },
  picker: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
    marginTop: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
  },
  button: { marginTop: 8 },
});
