import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

export default function MarketTrendsList({ trends, onSellPress }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textPrimary = theme?.colors?.textPrimary;
  const textSecondary = theme?.colors?.textSecondary;
  const successColor = theme?.colors?.success;
  const errorColor = theme?.colors?.error;
  const primaryColor = theme?.colors?.primary;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}></TouchableOpacity>
      </View>
      {trends.map((trend, idx) => (
        <AppCard key={idx} style={styles.card}>
          <View style={styles.row}>
            <View>
              <AppText
                variant="bodyMd"
                style={{ fontWeight: "bold", color: textPrimary }}
              >
                {trend.crop}
              </AppText>
              <AppText variant="caption" style={{ color: textSecondary }}>
                {trend.region}
              </AppText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <AppText
                variant="headingSm"
                style={{
                  color: trend.trend === "up" ? successColor : errorColor,
                }}
              >
                {trend.demandChange}
              </AppText>
              <AppText variant="caption" style={{ color: textSecondary }}>
                {trend.price}
              </AppText>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={() => onSellPress(trend)}
          >
            <AppText
              variant="caption"
              style={{ color: "#FFF", fontWeight: "bold" }}
            >
              {t("marketTrendsList.sellNow")}
            </AppText>
          </TouchableOpacity>
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  card: { marginBottom: 12, padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
