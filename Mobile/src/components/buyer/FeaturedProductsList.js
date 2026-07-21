import "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import { ProductCard } from "../common/ProductCard";
import { useTheme } from "../../hooks/useTheme";
import { useSavedStore } from "../../store/saved.store";
export default function FeaturedProductsList({
  products,
  onView
}) {
  const {
    theme
  } = useTheme();
  const savedIds = useSavedStore(s => s.savedIds);
  const toggleSave = useSavedStore(s => s.toggleSave);
  if (!products || products.length === 0) {
    return <View style={styles.emptyContainer}>
        <AppText variant="bodyMd" style={{
        color: theme?.colors?.textSecondary,
        textAlign: "center"
      }}>
          No products match your search.
        </AppText>
      </View>;
  }

  // Only show up to 3 featured products
  const featured = products.slice(0, 3);
  return <View style={styles.section}>
      {featured.map(product => <View key={product._id || product.id} style={styles.cardWrapper}>
          <ProductCard product={product} theme={theme} isSaved={savedIds.has(product._id || product.id)} onToggleSave={toggleSave} onView={onView} />
        </View>)}
    </View>;
}
const styles = StyleSheet.create({
  section: {
    marginBottom: 24
  },
  cardWrapper: {
    marginBottom: 12
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    marginBottom: 24
  }
});