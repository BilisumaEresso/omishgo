// Mobile/src/screens/buyer/BuyerProfileScreen.js
import { Ionicons } from "@expo/vector-icons";
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import AppText from "../../components/common/AppText";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";

const BuyerProfileScreen = ({ navigation, onSwitchTab }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuthStore();

  const primary = theme?.colors?.primary || "#1565C0";
  const primaryContainer = theme?.colors?.primaryContainer || "#E3F2FD";
  const textPrimary = theme?.colors?.textPrimary || "#0D1B2A";
  const textSecondary = theme?.colors?.textSecondary || "#4A6080";
  const textMuted = theme?.colors?.textMuted || "#8FA3BE";
  const background = theme?.colors?.background || "#F5F8FF";
  const surface = theme?.colors?.surface || "#FFFFFF";
  const border = theme?.colors?.border || "#D0DEF5";
  const errorColor = theme?.colors?.error || "#C62828";
  const successColor = theme?.colors?.success || "#2E7D32";

  const getLanguageName = (code) => {
    switch (code) {
      case "am":
        return "Amharic";
      case "om":
        return "Afan Oromo";
      case "en":
      default:
        return "English";
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  const userName = user?.name || "Buyer";
  const phone = user?.phone || "+251 900 000000";
  const location = user?.location || { region: "Addis Ababa", zone: "Bole" };
  const preferredLang = user?.preferredLang || "en";
  const isVerified = user?.isVerified ?? true;

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      {/* Inline Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 24) + 12
                : 54,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (navigation?.canGoBack()) {
              navigation.goBack();
            } else if (onSwitchTab) {
              onSwitchTab("Home");
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={primary} />
        </TouchableOpacity>
        <AppText style={[styles.headerTitle, { color: textPrimary }]}>
          My Profile
        </AppText>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.avatar, { backgroundColor: primary }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <AppText style={[styles.name, { color: textPrimary }]}>
            {userName}
          </AppText>
          <View
            style={[styles.rolePill, { backgroundColor: primaryContainer }]}
          >
            <AppText style={[styles.roleText, { color: primary }]}>
              BUYER
            </AppText>
          </View>
          <AppText style={[styles.phoneNumber, { color: textSecondary }]}>
            {phone}
          </AppText>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: surface }]}>
            <AppText style={[styles.statValue, { color: textPrimary }]}>
              8
            </AppText>
            <AppText style={[styles.statLabel, { color: textSecondary }]}>
              Orders
            </AppText>
          </View>
          <View style={[styles.statCard, { backgroundColor: surface }]}>
            <AppText style={[styles.statValue, { color: textPrimary }]}>
              4
            </AppText>
            <AppText style={[styles.statLabel, { color: textSecondary }]}>
              Saved
            </AppText>
          </View>
          <View style={[styles.statCard, { backgroundColor: surface }]}>
            <AppText style={[styles.statValue, { color: textPrimary }]}>
              ETB 32,400
            </AppText>
            <AppText style={[styles.statLabel, { color: textSecondary }]}>
              Spent
            </AppText>
          </View>
        </View>

        {/* Account Info Section */}
        <AppText style={[styles.sectionTitle, { color: textPrimary }]}>
          Account Info
        </AppText>

        <View style={[styles.infoCard, { backgroundColor: surface }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={textSecondary} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, { color: textMuted }]}>
                Location
              </AppText>
              <AppText style={[styles.infoValue, { color: textPrimary }]}>
                {location.region}, {location.zone}
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={textSecondary} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, { color: textMuted }]}>
                Phone
              </AppText>
              <AppText style={[styles.infoValue, { color: textPrimary }]}>
                {phone}
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={20} color={textSecondary} />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, { color: textMuted }]}>
                Language
              </AppText>
              <AppText style={[styles.infoValue, { color: textPrimary }]}>
                {getLanguageName(preferredLang)}
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.infoRow}>
            <Ionicons
              name={isVerified ? "checkmark-circle" : "close-circle"}
              size={20}
              color={isVerified ? successColor : textMuted}
            />
            <View style={styles.infoTextContainer}>
              <AppText style={[styles.infoLabel, { color: textMuted }]}>
                Status
              </AppText>
              <AppText
                style={[
                  styles.infoValue,
                  { color: isVerified ? successColor : textMuted },
                ]}
              >
                {isVerified ? "Verified" : "Unverified"}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View style={[styles.logoutContainer, { backgroundColor: background }]}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: errorColor }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <AppText style={styles.logoutText}>Logout</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  rolePill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  phoneNumber: {
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  infoCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    paddingTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default BuyerProfileScreen;
