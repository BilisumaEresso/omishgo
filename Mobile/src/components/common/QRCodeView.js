// Mobile/src/components/common/QRCodeView.js
import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import qrcode from "qrcode-generator";

/**
 * Styled Pure-JS QR Code component for React Native.
 * Supports theme-based background colors, rounded card container,
 * and a center transparent logo overlay badge (using Error Correction Level 'H').
 *
 * @param {{
 *   value: string,
 *   size?: number,
 *   color?: string,
 *   backgroundColor?: string,
 *   logo?: any,
 *   logoSize?: number
 * }} props
 */
export default function QRCodeView({
  value,
  size = 240,
  color = "#FFFFFF",
  backgroundColor = "#15803D",
  logo,
  logoSize = 52,
}) {
  const { modules, count } = useMemo(() => {
    if (!value) return { modules: [], count: 0 };
    try {
      // Error Correction Level 'H' (High ~30% recovery) keeps QR code 100% scannable with center logo
      const qr = qrcode(0, "H");
      qr.addData(value);
      qr.make();
      const count = qr.getModuleCount();
      const modules = [];
      for (let r = 0; r < count; r++) {
        const row = [];
        for (let c = 0; c < count; c++) {
          row.push(qr.isDark(r, c));
        }
        modules.push(row);
      }
      return { modules, count };
    } catch (err) {
      console.warn("QR code generation error:", err);
      return { modules: [], count: 0 };
    }
  }, [value]);

  if (!count || !modules.length) {
    return (
      <View
        style={{
          width: size,
          height: size,
          backgroundColor,
          borderRadius: 24,
        }}
      />
    );
  }

  const padding = 18;
  const availableSize = size - padding * 2;
  const cellSize = Math.max(1, availableSize / count);
  const actualQrSize = cellSize * count;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
          padding,
          borderRadius: 28,
        },
      ]}
    >
      <View
        style={{
          width: actualQrSize,
          height: actualQrSize,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {modules.map((row, r) => (
          <View key={`qr-row-${r}`} style={{ flexDirection: "row", height: cellSize }}>
            {row.map((cell, c) => (
              <View
                key={`qr-cell-${r}-${c}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? color : "transparent",
                  borderRadius: cellSize * 0.5,
                  transform: cell ? [{ scale: 0.85 }] : [],
                }}
              />
            ))}
          </View>
        ))}

        {/* Center Logo Overlay Badge */}
        {logo && (
          <View
            style={[
              styles.logoBadge,
              {
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <Image
              source={logo}
              style={{
                width: Math.round(logoSize * 0.72),
                height: Math.round(logoSize * 0.72),
                resizeMode: "contain",
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
  },
  logoBadge: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
