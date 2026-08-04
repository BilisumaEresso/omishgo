// Mobile/src/components/common/PublicProfileShareCard.js
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import QRCodeView from "./QRCodeView";
import { getPublicProfileUrl } from "../../constants/api";

export default function PublicProfileShareCard({ user, theme }) {
  const { t } = useTranslation();
  const primaryColor = theme?.colors?.primary || "#15803D";
  const surfaceColor = theme?.colors?.surface || "#FFFFFF";
  const textPrimary = theme?.colors?.textPrimary || "#0F172A";
  const textSecondary = theme?.colors?.textSecondary || "#64748B";

  const customId = user?.customId || "PRO-000000";
  const profileUrl = getPublicProfileUrl(customId);
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    Alert.alert(
      t("profile.linkCopiedTitle", { defaultValue: "Profile Link Copied" }),
      t("profile.linkCopiedMsg", { defaultValue: `Public profile link copied:\n${profileUrl}` }),
      [
        {
          text: t("profile.shareBtn", { defaultValue: "Share Now" }),
          onPress: handleShare,
        },
        { text: t("common.ok", { defaultValue: "OK" }), style: "cancel" },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor }]}>
      <View style={styles.headerRow}>
        <Ionicons name="qr-code-outline" size={20} color={primaryColor} />
        <AppText style={[styles.title, { color: textPrimary }]}>
          {t("profile.publicProfileQRTitle", { defaultValue: "My Public Profile & QR Code" })}
        </AppText>
      </View>

      <AppText style={[styles.subtitle, { color: textSecondary }]}>
        {t("profile.publicProfileQRSub", {
          defaultValue: "Buyers & partners can scan this QR code or click your link to verify your profile.",
        })}
      </AppText>

      {/* QR Code Graphic Container */}
      <View style={styles.qrBox}>
        <QRCodeView value={profileUrl} size={150} />
        <AppText style={styles.customIdBadge}>ID: {customId}</AppText>
      </View>

      {/* Plain Selectable URL Text */}
      <View style={styles.urlBox}>
        <AppText style={styles.urlText} selectable numberOfLines={1}>
          {profileUrl}
        </AppText>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, styles.copyBtn, { borderColor: primaryColor }]}
          onPress={handleCopyLink}
          activeOpacity={0.8}
        >
          <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={16} color={primaryColor} />
          <AppText style={[styles.btnText, { color: primaryColor }]}>
            {copied ? t("common.copied", { defaultValue: "Copied!" }) : t("profile.copyLink", { defaultValue: "Copy Link" })}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.shareBtn, { backgroundColor: primaryColor }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Ionicons name="share-social" size={16} color="#FFFFFF" />
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
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  qrBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  customIdBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  urlBox: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
  },
  urlText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
  },
  copyBtn: {
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  shareBtn: {},
  btnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
