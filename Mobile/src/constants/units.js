// Mobile/src/constants/units.js
import i18n from "../locales/i18n";

export const UNITS = ["kg", "quintal", "ton", "bag50", "bag100", "crate", "sack"];

// Unified Proxy accessor pointing directly to i18n locale bundles
export const UNITS_LOCALIZED = new Proxy(
  {},
  {
    get: (_, langKey) =>
      new Proxy(
        {},
        {
          get: (_, unitKey) => {
            const key = unitKey === "q" ? "quintal" : unitKey;
            return i18n.t(`units.${key}`, { lng: langKey, defaultValue: unitKey });
          },
        }
      ),
  }
);

/**
 * Get localized display label for a unit key directly from unified locale bundles
 */
export const getLocalizedUnitName = (unitKey, lang = "en", t = null) => {
  if (!unitKey) return "";
  const key = unitKey === "q" ? "quintal" : unitKey;
  if (t) {
    return t(`units.${key}`, { defaultValue: key });
  }
  return i18n.t(`units.${key}`, { lng: lang, defaultValue: key });
};
