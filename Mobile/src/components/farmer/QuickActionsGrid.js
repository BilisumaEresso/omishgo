import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../common/AppText";

export default function QuickActionsGrid({
  productCount,
  onAddPress,
  onOrdersPress,
  onProductsPress,
  onTrainingPress,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary;
  const surfaceColor = theme?.colors?.surface;
  const borderColor = theme?.colors?.border;
  const textPrimary = theme?.colors?.textPrimary;
  const textSecondary = theme?.colors?.textSecondary;

  return (
    <View style={styles.grid}>
      {/* Add Product */}
      <TouchableOpacity
        style={[styles.item, { backgroundColor: primaryColor }]}
        onPress={onAddPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={32} color="#FFF" />
        <AppText variant="bodyMd" style={[styles.label, { color: "#FFF" }]}>
          {t("quickActionsGrid.addProduct")}
        </AppText>
      </TouchableOpacity>

      {/* My Products */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: surfaceColor, borderWidth: 1, borderColor },
        ]}
        onPress={onProductsPress}
        activeOpacity={0.7}
      >
        <Ionicons name="cube-outline" size={32} color={primaryColor} />
        <AppText
          variant="bodyMd"
          style={[styles.label, { color: textPrimary }]}
        >
          {t("quickActionsGrid.myProducts", { count: productCount })}
        </AppText>
      </TouchableOpacity>

      {/* Orders */}
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: surfaceColor, borderWidth: 1, borderColor },
        ]}
        onPress={onOrdersPress}
        activeOpacity={0.7}
      >
        <Ionicons name="receipt-outline" size={32} color={primaryColor} />
        <AppText
          variant="bodyMd"
          style={[styles.label, { color: textPrimary }]}
        >
          {t("quickActionsGrid.orders")}
        </AppText>
        <View style={styles.badge}>
          <AppText
            variant="caption"
            style={{ color: "#FFF", fontWeight: "bold" }}
          >
            3
          </AppText>
        </View>
      </TouchableOpacity>

      {/* Training */}
      <View
        style={[
          styles.item,
          { backgroundColor: surfaceColor, borderWidth: 1, borderColor },
        ]}
      >
        <Ionicons name="school-outline" size={32} color={primaryColor} />
        <AppText
          variant="bodyMd"
          style={[styles.label, { color: textPrimary }]}
        >
          {t("quickActionsGrid.training")}
        </AppText>
        <AppText variant="caption" style={{ color: textSecondary }}>
          {t("quickActionsGrid.tutorialsCount", { count: 2 })}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  item: {
    width: "48%",
    aspectRatio: 1.2,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 12,
    position: "relative",
  },
  label: { fontWeight: "600", marginTop: 8 },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#BA1A1A",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
