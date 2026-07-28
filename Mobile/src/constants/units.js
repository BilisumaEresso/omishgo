// Mobile/src/constants/units.js

export const UNITS = ["kg", "quintal", "ton", "bag50", "bag100", "crate", "sack"];

export const UNITS_LOCALIZED = {
  en: {
    kg: "kg",
    quintal: "quintal (q)",
    ton: "ton (1000kg)",
    bag50: "bag (50kg)",
    bag100: "bag (100kg)",
    crate: "crate",
    sack: "sack",
  },
  am: {
    kg: "ኪ.ግ",
    quintal: "ኩንታል",
    ton: "ቶን (1000ኪ.ግ)",
    bag50: "ጆንያ (50ኪ.ግ)",
    bag100: "ጆንያ (100ኪ.ግ)",
    crate: "ክሬት",
    sack: "ከረጢት",
  },
  om: {
    kg: "kg",
    quintal: "kunt (q)",
    ton: "tooni (1000kg)",
    bag50: "torbaan (50kg)",
    bag100: "torbaan (100kg)",
    crate: "kireetii",
    sack: "qodaa",
  },
};

/**
 * Get localized display label for a unit key
 */
export const getLocalizedUnitName = (unitKey, lang = "en", t = null) => {
  if (!unitKey) return "";
  const key = unitKey === "q" ? "quintal" : unitKey;
  if (t) {
    return t(`units.${key}`, {
      defaultValue: UNITS_LOCALIZED[lang]?.[key] || UNITS_LOCALIZED.en?.[key] || unitKey,
    });
  }
  return (
    UNITS_LOCALIZED[lang]?.[key] ||
    UNITS_LOCALIZED.en?.[key] ||
    unitKey
  );
};

