import "react";
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ---- Summary Card ----
const SummaryCard = ({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  color = "#4CAF50",
  onPress,
  loading = false
}) => {
  return <TouchableOpacity style={[styles.card, {
    backgroundColor: color + "15"
  }]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconCircle, {
      backgroundColor: color
    }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        {loading ? <ActivityIndicator size="small" color={color} /> : <>
            <Text style={styles.prefix}>{prefix}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.suffix}>{suffix}</Text>
          </>}
      </View>
    </TouchableOpacity>;
};
const styles = StyleSheet.create({
  card: {
    flex: 1,
    // cards share the row equally
    padding: 12,
    borderRadius: 16,
    alignItems: "center"
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500"
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline"
  },
  prefix: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600"
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333"
  },
  suffix: {
    fontSize: 12,
    color: "#888",
    marginLeft: 2
  }
});
export default SummaryCard;