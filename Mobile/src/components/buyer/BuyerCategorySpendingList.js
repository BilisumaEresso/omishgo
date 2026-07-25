// src/components/buyer/BuyerCategorySpendingList.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../common/AppText";

export default function BuyerCategorySpendingList({
  categories = [
    {
      id: "c1",
      category: "Vegetables & Produce",
      icon: "leaf",
      bgColor: "#E0F2FE",
      iconColor: "#0284C7",
      amount: 5440,
      date: "10 Jan 2026",
      method: "Mobile Money",
    },
    {
      id: "c2",
      category: "Teff & Grains",
      icon: "nutrition",
      bgColor: "#EDE9FE",
      iconColor: "#7C3AED",
      amount: 54417.8,
      date: "11 Jan 2026",
      method: "Bank Card",
    },
    {
      id: "c3",
      category: "Pulses & Oilseeds",
      icon: "cube",
      bgColor: "#FEF3C7",
      iconColor: "#D97706",
      amount: 5400,
      date: "12 Jan 2026",
      method: "CBE Birr",
    },
  ],
  currency = "ETB",
  onCategoryPress,
}) {
  return (
    <View style={styles.container}>
      <AppText style={styles.sectionTitle}>Procurement Categories</AppText>

      <View style={styles.list}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={() => onCategoryPress?.(item)}
            activeOpacity={0.88}
          >
            <View style={styles.leftRow}>
              <View style={[styles.iconWrap, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon} size={22} color={item.iconColor} />
              </View>

              <View style={styles.info}>
                <AppText style={styles.categoryTitle}>{item.category}</AppText>
                <AppText style={styles.dateText}>{item.date}</AppText>
              </View>
            </View>

            <View style={styles.rightRow}>
              <AppText style={styles.amountText}>
                {currency} {item.amount.toLocaleString()}
              </AppText>
              <AppText style={styles.methodText}>{item.method}</AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  dateText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  rightRow: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  methodText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
});
