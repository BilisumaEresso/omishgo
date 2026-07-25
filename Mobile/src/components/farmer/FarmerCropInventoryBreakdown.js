// src/components/farmer/FarmerCropInventoryBreakdown.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function FarmerCropInventoryBreakdown({
  products = [],
  onManageProducts,
  onProductPress,
}) {
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>Crop Stock & Inventory</AppText>
          <AppText style={styles.subtitle}>Listed harvests ready for wholesale buyers</AppText>
        </View>

        <TouchableOpacity onPress={onManageProducts} activeOpacity={0.8}>
          <AppText style={styles.manageBtnText}>Manage</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {products.slice(0, 4).map((p, idx) => {
          const isLast = idx === Math.min(products.length, 4) - 1;
          const quantity = p.quantity ?? 0;
          const unit = p.unit || "q";
          const cropName = p.category || p.cropType || p.name || "Harvest Crop";
          const price = p.price ?? 0;

          return (
            <TouchableOpacity
              key={p.id || p._id || idx}
              style={[styles.row, !isLast && styles.rowBorder]}
              onPress={() => onProductPress?.(p)}
              activeOpacity={0.75}
            >
              <View style={styles.cropIconBg}>
                <Ionicons name="leaf" size={18} color="#15803D" />
              </View>

              <View style={{ flex: 1 }}>
                <AppText style={styles.cropName}>{cropName}</AppText>
                <AppText style={styles.cropSub}>
                  Volume: <AppText style={styles.cropBold}>{quantity} {unit}</AppText>
                </AppText>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <AppText style={styles.priceText}>ETB {Number(price).toLocaleString()}/{unit}</AppText>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <AppText style={styles.statusText}>Active Stock</AppText>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  manageBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#15803D",
  },
  list: {
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  cropIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  cropName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  cropSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  cropBold: {
    fontWeight: "700",
    color: "#334155",
  },
  priceText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#15803D",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#16A34A",
  },
});
