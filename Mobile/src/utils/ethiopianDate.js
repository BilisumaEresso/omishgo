// Mobile/src/utils/ethiopianDate.js
// Ethiopian Calendar (ዓመተ ምሕረት E.C.) & Localized Date Formatting Utility

/**
 * Julian Day Number from Gregorian Date
 */
function gregorianToJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Ethiopian Date from Julian Day Number
 */
function jdnToEthiopian(jdn) {
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year =
    4 * Math.floor((jdn - 1723856) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

/**
 * Convert any Date input to Ethiopian Date Object
 */
export function gregorianToEthiopian(dateInput) {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();
  const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)

  const jdn = gregorianToJDN(gYear, gMonth, gDay);
  const eth = jdnToEthiopian(jdn);

  return {
    year: eth.year,
    month: eth.month,
    day: eth.day,
    dayOfWeek,
  };
}

// Shortened / 3-Letter Month Names
export const ETHIOPIAN_MONTHS_SHORT = {
  am: ["መስ", "ጥቅ", "ህዳ", "ታኅ", "ጥር", "የካ", "መጋ", "ሚያ", "ግን", "ሰኔ", "ሐም", "ነሐ", "ጳጉ"],
  om: ["Fuu", "Onk", "Sad", "Mud", "Ama", "Gur", "Bit", "Caa", "Eeb", "Wax", "Ado", "Hag", "Bir"],
  en: ["Mes", "Tik", "Hid", "Tah", "Tir", "Yak", "Meg", "Miy", "Gin", "Sen", "Ham", "Neh", "Pag"],
};

export const GREGORIAN_MONTHS_SHORT = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  am: ["ጃን", "ፌብ", "ማር", "ኤፕ", "ሜይ", "ጁን", "ጁላይ", "ኦገ", "ሴፕ", "ኦክ", "ኖቬ", "ዲሴ"],
  om: ["Ama", "Gur", "Bit", "Eeb", "Caa", "Wax", "Ado", "Hag", "Fuu", "Onk", "Sad", "Mud"],
};

// Shortened / 3-Letter Days of the Week (Index 0 = Sunday ... 6 = Saturday)
export const DAYS_SHORT = {
  am: ["እሑ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"],
  om: ["Dil", "Wii", "Kib", "Roo", "Kam", "Jim", "San"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

/**
 * Format Date into Localized String with Ethiopian Calendar support & 3-letter abbreviations
 *
 * @param {Date|string|number} dateInput - Input date
 * @param {string} lang - Language code ('en', 'am', 'om')
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeDayOfWeek - Include day of week (e.g. ሰኞ, ሐም 27)
 * @param {boolean} options.includeYear - Include year (e.g. 2018 ዓ.ም)
 * @param {boolean} options.relative - Use Today/Yesterday for recent dates
 * @returns {string} Formatted localized date string
 */
export function formatLocalizedDate(dateInput, lang = "en", options = {}) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const code = lang?.startsWith("am") ? "am" : lang?.startsWith("om") ? "om" : "en";

  // Relative Date Formatting
  if (options.relative) {
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return code === "am" ? "ዛሬ" : code === "om" ? "Har'a" : "Today";
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return code === "am" ? "ትናንት" : code === "om" ? "Kalleessa" : "Yesterday";
    }
  }

  const { includeDayOfWeek = true, includeYear = true } = options;

  // For Amharic & Afan Oromo -> Ethiopian Calendar (E.C.)
  if (code === "am" || code === "om") {
    const eth = gregorianToEthiopian(date);
    if (!eth) return "";

    const dayName = DAYS_SHORT[code][eth.dayOfWeek] || "";
    const monthName = ETHIOPIAN_MONTHS_SHORT[code][eth.month - 1] || "";
    const yearSuffix = code === "am" ? "ዓ.ም" : "E.C.";

    let result = "";
    if (includeDayOfWeek && dayName) {
      result += `${dayName}, `;
    }
    result += `${monthName} ${eth.day}`;
    if (includeYear) {
      result += `, ${eth.year} ${yearSuffix}`;
    }

    return result;
  }

  // For English -> Standard Gregorian Calendar
  const dayName = DAYS_SHORT.en[date.getDay()] || "";
  const monthName = GREGORIAN_MONTHS_SHORT.en[date.getMonth()] || "";

  let result = "";
  if (includeDayOfWeek && dayName) {
    result += `${dayName}, `;
  }
  result += `${date.getDate()} ${monthName}`;
  if (includeYear) {
    result += ` ${date.getFullYear()}`;
  }

  return result;
}
