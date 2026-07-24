import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

export default function NearbyFarmersList({ farmers, onFarmerPress }) {
  const { theme } = useTheme();

  if (!farmers || farmers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AppText style={{ color: theme?.colors?.textSecondary }}>
          No nearby farmers found
        </AppText>
      </View>
    );
  }

  // Display only up to 2 farmers for space
  const visibleFarmers = farmers.slice(0, 2);

  return (
    <View style={styles.section}>
      <View style={styles.grid}>
        {visibleFarmers.map((farmer) => (
          <TouchableOpacity
            key={farmer._id || farmer.id}
            style={styles.cardWrapper}
            onPress={() => onFarmerPress && onFarmerPress(farmer)}
            activeOpacity={0.7}
          >
            <AppCard style={styles.card}>
              {farmer.avatar ? (
                <Image source={{ uri: farmer.avatar }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatarFallback,
                    { backgroundColor: theme?.colors?.primaryContainer },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={24}
                    color={theme?.colors?.primary}
                  />
                </View>
              )}
              <AppText
                variant="bodyMd"
                style={{
                  fontWeight: "bold",
                  color: theme?.colors?.textPrimary,
                  marginTop: 8,
                }}
                numberOfLines={1}
              >
                {farmer.name || "Farmer"}
              </AppText>
              <AppText
                variant="caption"
                style={{ color: theme?.colors?.textSecondary }}
              >
                {farmer.location?.region || farmer.location?.zone || "Ethiopia"}
              </AppText>
              <View style={styles.rating}>
                <Ionicons name="star" size={12} color="#FFB800" />
                <AppText
                  variant="caption"
                  style={{ color: theme?.colors?.textPrimary }}
                >
                  4.8
                </AppText>
              </View>
            </AppCard>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  grid: { flexDirection: "row", gap: 12 },
  cardWrapper: { flex: 1 },
  card: { flex: 1, alignItems: "center", padding: 12 },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { width: 60, height: 60, borderRadius: 30, resizeMode: "cover" },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
});
