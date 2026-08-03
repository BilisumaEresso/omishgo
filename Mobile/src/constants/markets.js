// Mobile/src/constants/markets.js
// Dedicated Ethiopian Wholesale Markets and Commercial Cities Configuration

export const MARKET_PLACES = [
  {
    id: "addis_merkato",
    name: "Merkato Wholesale Market",
    city: "Addis Ababa",
    region: "Addis Ababa",
    zone: "Addis Ababa",
    type: "Central Exchange",
    primaryCrop: "Teff",
    translations: {
      en: { name: "Merkato Wholesale Market", city: "Addis Ababa" },
      am: { name: "መርካቶ የጅምላ ገበያ", city: "አዲስ አበባ" },
      om: { name: "Gabaa Jumlaa Malkaatoo", city: "Finfinnee" },
    },
  },
  {
    id: "adama_grain",
    name: "Adama Grain Exchange",
    city: "Adama",
    region: "Oromia",
    zone: "East Shewa",
    type: "Grain & Vegetable Hub",
    primaryCrop: "Red Onion",
    translations: {
      en: { name: "Adama Grain Exchange", city: "Adama" },
      am: { name: "አዳማ የእህል ገበያ", city: "አዳማ" },
      om: { name: "Gabaa Midhaan Adaamaa", city: "Adaamaa" },
    },
  },
  {
    id: "meki_produce",
    name: "Meki Produce Terminal",
    city: "Meki",
    region: "Oromia",
    zone: "East Shewa",
    type: "Irrigation Produce Hub",
    primaryCrop: "Tomato",
    translations: {
      en: { name: "Meki Produce Terminal", city: "Meki" },
      am: { name: "መልካ የአትክልት ገበያ", city: "መልካ" },
      om: { name: "Malkaa Kuduraa Makkii", city: "Makkii" },
    },
  },
  {
    id: "bishoftu_market",
    name: "Bishoftu Commercial Market",
    city: "Bishoftu",
    region: "Oromia",
    zone: "East Shewa",
    type: "Pulse & Grain Market",
    primaryCrop: "Garlic",
    translations: {
      en: { name: "Bishoftu Commercial Market", city: "Bishoftu" },
      am: { name: "ቢሾፍቱ የጅምላ ገበያ", city: "ቢሾፍቱ" },
      om: { name: "Gabaa Bishooftuu", city: "Bishooftuu" },
    },
  },
  {
    id: "jimma_coffee",
    name: "Jimma Coffee Exchange",
    city: "Jimma",
    region: "Oromia",
    zone: "Jimma",
    type: "Cash Crop Hub",
    primaryCrop: "Coffee",
    translations: {
      en: { name: "Jimma Coffee Exchange", city: "Jimma" },
      am: { name: "ጅማ የቡና ገበያ", city: "ጅማ" },
      om: { name: "Gabaa Bunaa Jimmaa", city: "Jimmaa" },
    },
  },
  {
    id: "shashemene_hub",
    name: "Shashemene Trade Depot",
    city: "Shashemene",
    region: "Oromia",
    zone: "West Arsi",
    type: "Southern Trade Hub",
    primaryCrop: "Potato",
    translations: {
      en: { name: "Shashemene Trade Depot", city: "Shashemene" },
      am: { name: "ሻሸመኔ የንግድ ገበያ", city: "ሻሸመኔ" },
      om: { name: "Giddu-gala Shaashamannee", city: "Shaashamannee" },
    },
  },
  {
    id: "asella_terminal",
    name: "Asella Grain Terminal",
    city: "Asella",
    region: "Oromia",
    zone: "Arsi",
    type: "Wheat Exchange",
    primaryCrop: "Wheat",
    translations: {
      en: { name: "Asella Grain Terminal", city: "Asella" },
      am: { name: "አሰላ የእህል ገበያ", city: "አሰላ" },
      om: { name: "Gabaa Qamadii Asellaa", city: "Asellaa" },
    },
  },
  {
    id: "hawassa_hub",
    name: "Hawassa Regional Market",
    city: "Hawassa",
    region: "Sidama",
    zone: "Sidama",
    type: "Regional Commodity Market",
    primaryCrop: "White Maize",
    translations: {
      en: { name: "Hawassa Regional Market", city: "Hawassa" },
      am: { name: "ሐዋሳ የክልል ገበያ", city: "ሐዋሳ" },
      om: { name: "Gabaa Naannoo Hawaasaa", city: "Hawaasaa" },
    },
  },
  {
    id: "bahir_dar_market",
    name: "Bahir Dar Central Market",
    city: "Bahir Dar",
    region: "Amhara",
    zone: "West Gojjam",
    type: "Northwest Produce Hub",
    primaryCrop: "Maize",
    translations: {
      en: { name: "Bahir Dar Central Market", city: "Bahir Dar" },
      am: { name: "ባህር ዳር ማዕከላዊ ገበያ", city: "ባህር ዳር" },
      om: { name: "Gabaa Bahir Daar", city: "Bahir Daar" },
    },
  },
  {
    id: "nekemte_hub",
    name: "Nekemte Grain Terminal",
    city: "Nekemte",
    region: "Oromia",
    zone: "East Welega",
    type: "Western Grain Hub",
    primaryCrop: "White Maize",
    translations: {
      en: { name: "Nekemte Grain Terminal", city: "Nekemte" },
      am: { name: "ነቀምቴ የእህል ገበያ", city: "ነቀምቴ" },
      om: { name: "Gabaa Naqamtee", city: "Naqamtee" },
    },
  },
];

/**
 * Clean city name by removing redundant suffixes like " Town", " City", etc.
 */
export const cleanCityName = (cityStr) => {
  if (!cityStr) return "";
  return cityStr.replace(/\s+Town$/i, "").replace(/\s+City$/i, "").trim();
};

/**
 * Get localized market name and clean city name
 */
export const getLocalizedMarket = (marketIdOrCity, lang = "en") => {
  if (!marketIdOrCity) return { name: "", city: "" };

  const code = lang.startsWith("am") ? "am" : lang.startsWith("om") ? "om" : "en";
  const cleanInput = cleanCityName(marketIdOrCity);

  const found = MARKET_PLACES.find(
    (m) =>
      m.id === marketIdOrCity ||
      m.city.toLowerCase() === cleanInput.toLowerCase() ||
      m.name.toLowerCase() === marketIdOrCity.toLowerCase(),
  );

  if (found) {
    const locObj = found.translations[code] || found.translations.en;
    return {
      name: locObj.name,
      city: locObj.city,
      region: found.region,
      zone: found.zone,
    };
  }

  // Fallback for unlisted city string
  return {
    name: marketIdOrCity,
    city: cleanInput,
    region: "",
    zone: "",
  };
};
