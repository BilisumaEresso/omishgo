// src/utils/formatNumber.js
// Reliable comma-separated number formatter that works consistently
// across all devices/locales (unlike toLocaleString on Hermes/Android).

/**
 * Formats a number with comma as thousands separator.
 * @param {number|string} num - The number to format.
 * @param {number} [maxDecimals=0] - Maximum decimal places to keep.
 * @returns {string} Formatted string, e.g. "50,000" or "1,234.56"
 */
export function formatNumber(num, maxDecimals = 0) {
  if (num == null || isNaN(num)) return "0";
  const n = Number(num);
  const fixed = maxDecimals > 0 ? n.toFixed(maxDecimals) : Math.round(n).toString();
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}
