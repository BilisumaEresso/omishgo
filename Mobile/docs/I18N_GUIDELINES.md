# OmishGo Mobile — i18n & Localization Guidelines

This document outlines the strict standards and workflow for localization in the OmishGo Mobile React Native application.

---

## 1. Key-Naming Convention

- **Format**: `camelCase` keys.
- **Grouping**: Keys are grouped by screen or component namespace (e.g., `buyerOrders`, `farmerAnalytics`, `common`, `auth`, `orderDetail`).
- **Structure**:
  ```json
  {
    "farmerAnalytics": {
      "title": "Market Insights & Sales",
      "sellHarvest": "Sell Harvest"
    }
  }
  ```

---

## 2. The Rule of Three (100% Locale Parity)

Every new localization key **MUST** be added simultaneously to all 3 supported locale files:
1. `Mobile/src/locales/en.json` (English)
2. `Mobile/src/locales/am.json` (Amharic)
3. `Mobile/src/locales/om.json` (Afan Oromo)

Never commit a key that exists in only 1 or 2 locale files. All 3 files must maintain equal key counts and structure.

---

## 3. What Must Be Translated vs. Excluded

### Must Be Translated (UI Chrome)
- All rendered body text, titles, subtitles, section headers, card labels, and button captions.
- Input placeholders (`placeholder="Search produce..."`).
- Accessibility labels (`accessibilityLabel="Go back"`).
- Alert dialog titles, messages, and action buttons (`Alert.alert(...)`).
- Fallback strings (e.g., `user?.name || t("common.fallbackUserName")`).
- Option arrays, dropdown lists, filter category chips.

### Do NOT Translate (Exclusions)
- **Navigation Route Identifiers**: e.g., `navigation.navigate("Chat")` or `navigation.navigate("Marketplace")`.
- **Developer Logs**: `console.log`, `console.warn`, `console.error` arguments.
- **Object Keys & Styles**: Style property values, color hex values, icon names, variable identifiers.
- **Brand Names**: Brand trademarks such as `"OmishGo"`.
- **Confirmed Mock/Placeholder Data**: Static demo dataset arrays pending real backend API integration (e.g., hardcoded demo price indices). Flag these as mock data issues rather than translating fake content.

---

## 4. Fallback & Default Values Guideline

> **CRITICAL LESSON FROM AUDIT**: A previous pass claimed screens were fully translated when they were only partially done — visible text got `t()` calls, but fallback strings (e.g., `value || "English text"`) were left hardcoded in English because they "only show when data is missing."

### Rules for Fallbacks & `defaultValue`
1. **`||` Fallbacks**:
   - **Incorrect**: `{item.cropType || "Agricultural Harvest"}`
   - **Correct**: `{item.cropType || t("common.defaultHarvestCrop", { defaultValue: "Agricultural Harvest" })}`
2. **`t()` Call Options**:
   - Always pass default fallback strings using the `{ defaultValue: "..." }` options object syntax in i18next to prevent invalid options parsing.
   - **Correct**: `t("namespace.key", { defaultValue: "Default Text" })`
3. **Template Literals**:
   - Never embed English words into template literals: `\`${count} Items\``.
   - Parameterize in locale JSON: `"itemsCount": "{{count}} Items"`.
