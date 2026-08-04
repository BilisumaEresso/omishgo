// Mobile/src/components/common/PublicProfileShareCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Clipboard, Platform, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import QRCodeView from "./QRCodeView";
import { getPublicProfileUrl } from "../../constants/api";

const appLogo = require("../../../src/assets/images/qr_logo.png");

export default function PublicProfileShareCard({ user, theme }) {
  const { t } = useTranslation();
  const primaryColor = theme?.colors?.primary || "#15803D";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const isFarmer = user?.role === "farmer";
  const rolePrefix = user?.role === "buyer" ? "BYR" : "FMR";
  const customId = user?.customId || `${rolePrefix}-000000`;
  const profileUrl = getPublicProfileUrl(customId);
  const [copied, setCopied] = useState(false);

  // Theme-driven background color matching the attached screenshot style
  const themeBgColor = isFarmer ? "#15803D" : "#1D4ED8";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my verified OmishGo public profile: ${profileUrl}`,
        url: profileUrl,
        title: `${user?.name || "OmishGo User"} - Public Profile`,
      });
    } catch (err) {
      console.warn("Share error:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(profileUrl);
      } else if (Clipboard && typeof Clipboard.setString === "function") {
        Clipboard.setString(profileUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      Alert.alert(
        t("profile.linkCopiedTitle", { defaultValue: "Link Copied!" }),
        t("profile.linkCopiedMsg", { defaultValue: `Your public profile link has been copied to your clipboard:\n\n${profileUrl}` }),
        [
          {
            text: t("profile.shareBtn", { defaultValue: "Share Profile" }),
            onPress: handleShare,
          },
          { text: t("common.ok", { defaultValue: "OK" }), style: "cancel" },
        ]
      );
    } catch (err) {
      console.warn("Copy link error:", err);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor }]}>
      <View style={styles.headerRow}>
        <Ionicons name="qr-code-outline" size={22} color={primaryColor} />
        <AppText style={[styles.title, { color: textPrimary }]}>
          {t("profile.publicProfileQRTitle", { defaultValue: "My Public Profile & QR Code" })}
        </AppText>
      </View>

      <AppText style={[styles.subtitle, { color: textSecondary }]}>
        {t("profile.publicProfileQRSub", {
          defaultValue: "Scan or share your QR code link so wholesale buyers & partners can verify your profile.",
        })}
      </AppText>

      {/* Full-width Theme-Styled QR Code Graphic */}
      <View style={styles.qrOuterWrapper}>
        <QRCodeView
          value={profileUrl}
          size={240}
          color="#FFFFFF"
          backgroundColor={themeBgColor}
          logo={appLogo}
          logoSize={50}
        />
        <View style={styles.badgePill}>
          <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
          <AppText style={styles.customIdBadgeText}>ID: {customId}</AppText>
        </View>
      </View>

      {/* Selectable / Copyable Plain Link */}
      <TouchableOpacity
        style={styles.urlBox}
        onPress={handleCopyLink}
        activeOpacity={0.8}
      >
        <Ionicons name="link-outline" size={16} color={primaryColor} />
        <AppText style={styles.urlText} selectable numberOfLines={1}>
          {profileUrl}
        </AppText>
      </TouchableOpacity>

      {/* Action Buttons: Copy Link & Share Profile */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, styles.copyBtn, { borderColor: primaryColor }]}
          onPress={handleCopyLink}
          activeOpacity={0.8}
        >
          <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={17} color={primaryColor} />
          <AppText style={[styles.btnText, { color: primaryColor }]}>
            {copied ? t("common.copied", { defaultValue: "Copied!" }) : t("profile.copyLink", { defaultValue: "Copy Link" })}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.shareBtn, { backgroundColor: primaryColor }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Ionicons name="share-social" size={17} color="#FFFFFF" />
          <AppText style={[styles.btnText, { color: "#FFFFFF" }]}>
            {t("profile.shareBtn", { defaultValue: "Share Profile" })}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  qrOuterWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },
  customIdBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  urlBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  urlText: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  copyBtn: {
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  shareBtn: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "800",
  },
});
