// Mobile/src/components/common/QRCodeView.js
import React, { useMemo } from "react";
import { View } from "react-native";
import qrcode from "qrcode-generator";

/**
 * Pure-JS QR Code renderer for React Native.
 * Uses qrcode-generator to compute matrix and renders a grid of standard <View> modules.
 * Zero native module dependencies — 100% Expo SDK compatible.
 *
 * @param {{ value: string, size?: number, color?: string, backgroundColor?: string }} props
 */
export default function QRCodeView({
  value,
  size = 160,
  color = "#000000",
  backgroundColor = "#FFFFFF",
}) {
  const { modules, count } = useMemo(() => {
    if (!value) return { modules: [], count: 0 };
    try {
      // Type 0 auto-detects QR version; error correction 'M' (Medium ~15%)
      const qr = qrcode(0, "M");
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
    return <View style={{ width: size, height: size, backgroundColor }} />;
  }

  const cellSize = Math.max(1, Math.floor(size / count));
  const actualSize = cellSize * count;

  return (
    <View
      style={{
        width: actualSize,
        height: actualSize,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {modules.map((row, r) => (
        <View key={r} style={{ flexDirection: "row", height: cellSize }}>
          {row.map((cell, c) => (
            <View
              key={c}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? color : backgroundColor,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
