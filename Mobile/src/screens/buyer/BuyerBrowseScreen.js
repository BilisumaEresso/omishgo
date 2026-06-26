import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import NetInfo from "@react-native-community/netinfo";

const BuyerBrowseScreen = ({ navigation }) => {
  const { t } = useTranslation();
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    fetchProducts();

    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from /api/products?region=...
      // await api.get("/products");
      
      // Mock data for MVP UI
      const mockProducts = [
        { _id: "1", title: "Teff", price: 60, unit: "kg", region: "Oromia", farmerId: { name: "Bilisuma" } },
        { _id: "2", title: "Red Onions", price: 25, unit: "kg", region: "Amhara", farmerId: { name: "Abebe" } }
      ];
      setProducts(mockProducts);
    } catch (e) {
      console.log("Failed to fetch products", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (p.title.toLowerCase().includes(search.toLowerCase())) &&
    (regionFilter ? p.region.toLowerCase().includes(regionFilter.toLowerCase()) : true)
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardPrice}>{item.price} ETB / {item.unit}</Text>
      </View>
      <Text style={styles.cardFarmer}>Farmer: {item.farmerId?.name}</Text>
      <Text style={styles.cardRegion}>Region: {item.region}</Text>
      
      <TouchableOpacity 
        style={styles.actionBtn}
        onPress={() => navigation.navigate("Messaging", { seller: item.farmerId, product: item })}
      >
        <Text style={styles.actionBtnText}>{t("browse.messageBtn")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("browse.title")}</Text>
      </View>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>{t("browse.offlineBanner")}</Text>
        </View>
      )}

      <View style={styles.filters}>
        <TextInput 
          style={styles.searchInput} 
          placeholder={t("browse.searchPlaceholder")} 
          value={search}
          onChangeText={setSearch}
        />
        <TextInput 
          style={styles.regionInput} 
          placeholder={t("browse.filterRegion")} 
          value={regionFilter}
          onChangeText={setRegionFilter}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>{t("browse.noListings")}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  offlineBanner: { backgroundColor: "#9e9e9e", padding: 8, alignItems: "center" },
  offlineText: { color: "#fff", fontSize: 12 },
  filters: { padding: 16, flexDirection: "row", gap: 12 },
  searchInput: { flex: 2, backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  regionInput: { flex: 1, backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  list: { padding: 16, gap: 16 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardPrice: { fontSize: 16, fontWeight: "600", color: "#2e7d32" },
  cardFarmer: { fontSize: 14, color: "#666", marginBottom: 4 },
  cardRegion: { fontSize: 14, color: "#666", marginBottom: 12 },
  actionBtn: { backgroundColor: "#e8f5e9", padding: 12, borderRadius: 8, alignItems: "center" },
  actionBtnText: { color: "#2e7d32", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 },
  emptyText: { color: "#666", fontSize: 16 }
});

export default BuyerBrowseScreen;
