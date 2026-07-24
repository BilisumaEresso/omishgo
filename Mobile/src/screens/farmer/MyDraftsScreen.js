// Mobile/src/screens/farmer/MyDraftsScreen.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/layout/AppHeader";
import draftsService from "../../services/drafts.service";
import { isConnected } from "../../utils/connectivity";
import { useTheme } from "../../hooks/useTheme";

export default function MyDraftsScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  const primary = theme?.colors?.primary || "#2E7D32";
  const textPrimary = theme?.colors?.textPrimary || "#1A2E1A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6741";
  const textMuted = theme?.colors?.textMuted || "#8FAF8A";
  const background = theme?.colors?.background || "#F9FBF9";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0E8CE";
  const errorColor = theme?.colors?.error || "#C62828";

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    const list = await draftsService.getAll();
    setDrafts(list);
    setLoading(false);
  }, []);

  const syncOne = useCallback(
    async (draft, { silent } = {}) => {
      setSyncingId(draft.id);
      const result = await draftsService.syncDraft(draft);
      setSyncingId(null);
      await loadDrafts();
      if (!silent) {
        if (result.success) {
          Alert.alert(t("myDrafts.syncSuccessTitle"), t("myDrafts.syncSuccessMessage"));
        } else {
          Alert.alert(t("myDrafts.syncFailedTitle"), result.message);
        }
      }
      return result;
    },
    [loadDrafts, t],
  );

  // Auto-sync everything once, quietly, whenever this screen gains focus
  // and the device happens to be online (e.g. farmer walked back into signal).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        await loadDrafts();
        const online = await isConnected();
        if (!online || cancelled) return;
        const current = await draftsService.getAll();
        for (const draft of current) {
          if (cancelled) return;
          await syncOne(draft, { silent: true });
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [loadDrafts, syncOne]),
  );

  const handleDelete = (draft) => {
    Alert.alert(t("myDrafts.deleteTitle"), t("myDrafts.deleteMessage"), [
      { text: t("postProduct.cancel"), style: "cancel" },
      {
        text: t("myDrafts.delete"),
        style: "destructive",
        onPress: async () => {
          await draftsService.remove(draft.id);
          loadDrafts();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const thumbnail = item.photos?.find((p) => p.uri)?.uri;
    const isSyncing = syncingId === item.id;

    return (
      <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder, { backgroundColor: background }]}>
            <Ionicons name="leaf-outline" size={22} color={textMuted} />
          </View>
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <AppText style={{ color: textPrimary, fontWeight: "700", fontSize: 15 }}>
            {item.cropType || t("myDrafts.untitled")}
          </AppText>
          <AppText style={{ color: textSecondary, fontSize: 13, marginTop: 2 }}>
            {item.quantity} {item.unit} · {item.price} ETB
          </AppText>
          {item.syncError ? (
            <AppText style={{ color: errorColor, fontSize: 12, marginTop: 4 }}>
              {t("myDrafts.lastErrorPrefix")} {item.syncError}
            </AppText>
          ) : (
            <AppText style={{ color: textMuted, fontSize: 12, marginTop: 4 }}>
              {t("myDrafts.savedOffline")}
            </AppText>
          )}
        </View>

        <View style={{ gap: 8, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => syncOne(item)}
            disabled={isSyncing}
            style={[styles.iconBtn, { backgroundColor: primary }]}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="cloud-upload-outline" size={18} color="#FFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            disabled={isSyncing}
            style={[styles.iconBtn, { backgroundColor: errorColor }]}
          >
            <Ionicons name="trash-outline" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <AppHeader title={t("myDrafts.title")} showBack onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : drafts.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cloud-done-outline" size={48} color={textMuted} />
          <AppText style={{ color: textSecondary, marginTop: 8, textAlign: "center" }}>
            {t("myDrafts.empty")}
          </AppText>
        </View>
      ) : (
        <FlatList
          data={drafts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          ListHeaderComponent={
            <AppButton
              title={t("myDrafts.syncAll")}
              onPress={async () => {
                for (const draft of drafts) {
                  await syncOne(draft, { silent: true });
                }
                Alert.alert(t("myDrafts.syncSuccessTitle"), t("myDrafts.syncAllDone"));
              }}
              style={{ marginBottom: 12 }}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  thumb: { width: 56, height: 56, borderRadius: 10 },
  thumbPlaceholder: { alignItems: "center", justifyContent: "center" },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
