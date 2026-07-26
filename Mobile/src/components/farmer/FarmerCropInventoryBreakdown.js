import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import AppText from "../common/AppText";
import { getLocalizedCropName } from "../../constants/crops";
import { getLocalizedUnitName } from "../../constants/units";

export default function FarmerCropInventoryBreakdown({
  products = [],
  onManageProducts,
  onProductPress,
}) {
  const { t, i18n } = useTranslation();
  if (!products || products.length === 0) return null;

  const currentLang = i18n.language || "en";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>{t("farmerDashboard.cropStockMgmt", { defaultValue: "Crop Stock & Inventory" })}</AppText>
          <AppText style={styles.subtitle}>{t("farmerProducts.subtitle", { defaultValue: "Listed harvests ready for wholesale buyers" })}</AppText>
        </View>

        <TouchableOpacity onPress={onManageProducts} activeOpacity={0.8}>
          <AppText style={styles.manageBtnText}>{t("farmerProducts.title", { defaultValue: "Manage" })}</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {products.slice(0, 4).map((p, idx) => {
          const isLast = idx === Math.min(products.length, 4) - 1;
          const quantity = p.quantity ?? 0;
          const rawUnit = p.unit || "q";
          const rawCrop = p.category || p.cropType || p.name || "Harvest Crop";
          const cropName = getLocalizedCropName(rawCrop, currentLang, t);
          const unitLabel = getLocalizedUnitName(rawUnit, currentLang, t);
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
                  {t("orders.quantityLabel", { defaultValue: "Volume:" })} <AppText style={styles.cropBold}>{quantity} {unitLabel}</AppText>
                </AppText>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <AppText style={styles.priceText}>ETB {Number(price).toLocaleString("en-US")}/{unitLabel}</AppText>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <AppText style={styles.statusText}>{t("editProduct.activeStock", { defaultValue: "Active Stock" })}</AppText>
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
