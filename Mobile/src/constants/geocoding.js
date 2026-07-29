/**
 * Static Ethiopia region/zone/wereda geocoding lookup table.
 * Maps exact region, zone, and wereda combinations to approximate { latitude, longitude } pairs.
 * Includes a deterministic offset fallback for weredas so two locations in the same zone
 * get distinct coordinates and render smoothly without overlapping.
 */

export const DEFAULT_COORDINATE = {
  latitude: 9.0222,
  longitude: 38.7468,
};

// Key weredas and major cities/towns across Ethiopia
export const WEREDA_COORDINATES = {
  // Oromia Weredas & Towns
  Adama: { latitude: 8.5400, longitude: 39.2700 },
  "Adama Town": { latitude: 8.5400, longitude: 39.2700 },
  Bishoftu: { latitude: 8.7500, longitude: 38.9833 },
  "Bishoftu Town": { latitude: 8.7500, longitude: 38.9833 },
  Lome: { latitude: 8.5833, longitude: 39.1167 },
  Mojo: { latitude: 8.5867, longitude: 39.1200 },
  Dugda: { latitude: 8.1500, longitude: 38.8200 },
  Meki: { latitude: 8.1500, longitude: 38.8200 },
  Bora: { latitude: 8.3000, longitude: 38.9500 },
  Boset: { latitude: 8.6700, longitude: 39.4300 },
  Gimbichu: { latitude: 8.9500, longitude: 39.1200 },
  Ambo: { latitude: 8.9833, longitude: 37.8500 },
  "Ambo Town": { latitude: 8.9833, longitude: 37.8500 },
  Woliso: { latitude: 8.5333, longitude: 37.9667 },
  "Woliso Town": { latitude: 8.5333, longitude: 37.9667 },
  Asella: { latitude: 7.9500, longitude: 39.1333 },
  "Asella Town": { latitude: 7.9500, longitude: 39.1333 },
  Shashemene: { latitude: 7.2000, longitude: 38.6000 },
  "Shashemene Town": { latitude: 7.2000, longitude: 38.6000 },
  "Arsi Negele": { latitude: 7.3500, longitude: 38.7000 },
  Dodola: { latitude: 6.9833, longitude: 39.1833 },
  Robe: { latitude: 7.1333, longitude: 40.0000 },
  "Robe Town": { latitude: 7.1333, longitude: 40.0000 },
  Goba: { latitude: 7.0167, longitude: 39.9833 },
  Ginir: { latitude: 7.1333, longitude: 40.7000 },
  Yabello: { latitude: 4.8833, longitude: 38.0833 },
  Negele: { latitude: 5.3333, longitude: 39.5833 },
  "Bule Hora": { latitude: 5.6333, longitude: 38.2333 },
  Jimma: { latitude: 7.6667, longitude: 36.8333 },
  "Jimma Town": { latitude: 7.6667, longitude: 36.8333 },
  Nekemte: { latitude: 9.0833, longitude: 36.5500 },
  "Nekemte Town": { latitude: 9.0833, longitude: 36.5500 },
  Gimbi: { latitude: 9.1667, longitude: 35.8333 },
  Shambu: { latitude: 9.5667, longitude: 37.1000 },
  "Dambi Dollo": { latitude: 8.5333, longitude: 34.8000 },
  Metu: { latitude: 8.3000, longitude: 35.5833 },
  Bedele: { latitude: 8.4500, longitude: 36.3500 },

  // Addis Ababa Sub-cities
  Arada: { latitude: 9.0350, longitude: 38.7530 },
  Gulele: { latitude: 9.0680, longitude: 38.7450 },
  Yeka: { latitude: 9.0300, longitude: 38.8000 },
  "Kolfe Keranio": { latitude: 9.0150, longitude: 38.7050 },
  "Nifas Silk Lafto": { latitude: 8.9600, longitude: 38.7300 },
  Lideta: { latitude: 9.0100, longitude: 38.7400 },
  "Akaki Kality": { latitude: 8.8900, longitude: 38.7800 },
  Bole: { latitude: 8.9900, longitude: 38.7900 },
  Kirkos: { latitude: 9.0100, longitude: 38.7600 },
  "Addis Ketema": { latitude: 9.0300, longitude: 38.7350 },
  "Lemi Kura": { latitude: 9.0200, longitude: 38.8400 },

  // Amhara Weredas & Cities
  "Debre Berhan": { latitude: 9.6833, longitude: 39.5333 },
  "Debre Berhan Town": { latitude: 9.6833, longitude: 39.5333 },
  "Debre Markos": { latitude: 10.3333, longitude: 37.7333 },
  "Debre Markos Town": { latitude: 10.3333, longitude: 37.7333 },
  "Finote Selam": { latitude: 10.7000, longitude: 37.2667 },
  "Bahir Dar": { latitude: 11.6000, longitude: 37.3833 },
  "Bahir Dar City": { latitude: 11.6000, longitude: 37.3833 },
  "Bahir Dar Zuria": { latitude: 11.5500, longitude: 37.3500 },
  Gondar: { latitude: 12.6000, longitude: 37.4667 },
  "Gondar City": { latitude: 12.6000, longitude: 37.4667 },
  "Debre Tabor": { latitude: 11.8500, longitude: 38.0167 },
  Woldiya: { latitude: 11.8333, longitude: 39.6000 },
  "Woldiya City": { latitude: 11.8333, longitude: 39.6000 },
  Lalibela: { latitude: 12.0333, longitude: 39.0333 },
  Dessie: { latitude: 11.1333, longitude: 39.6333 },
  "Dessie City": { latitude: 11.1333, longitude: 39.6333 },
  Kombolcha: { latitude: 11.0833, longitude: 39.7333 },
  Injibara: { latitude: 10.9500, longitude: 36.9167 },
  Sekota: { latitude: 12.6333, longitude: 39.0333 },

  // Tigray Cities
  Mekelle: { latitude: 13.4967, longitude: 39.4753 },
  "Mekelle City": { latitude: 13.4967, longitude: 39.4753 },
  Axum: { latitude: 14.1333, longitude: 38.7167 },
  Adigrat: { latitude: 14.2833, longitude: 39.4667 },
  Shire: { latitude: 14.1000, longitude: 38.2833 },

  // Sidama & Southern Weredas
  Hawassa: { latitude: 7.0622, longitude: 38.4763 },
  "Hawassa City": { latitude: 7.0622, longitude: 38.4763 },
  Wolkite: { latitude: 8.2833, longitude: 37.7833 },
  Worabe: { latitude: 8.0167, longitude: 38.3333 },
  Hosanna: { latitude: 7.5500, longitude: 37.8500 },
  Durame: { latitude: 7.2333, longitude: 37.8833 },
  Sodo: { latitude: 6.8600, longitude: 37.7600 },
  "Arba Minch": { latitude: 6.0333, longitude: 37.5500 },
  Sawla: { latitude: 6.3000, longitude: 36.8800 },
  Jinka: { latitude: 5.6500, longitude: 36.5667 },

  // Southwest Weredas
  Bonga: { latitude: 7.2667, longitude: 36.2333 },
  "Mizan Teferi": { latitude: 6.9833, longitude: 35.5833 },
  Tarcha: { latitude: 7.1500, longitude: 37.1833 },

  // Harar & Eastern Weredas
  Harar: { latitude: 9.3100, longitude: 42.1300 },
  "Harar City": { latitude: 9.3100, longitude: 42.1300 },
  Chiro: { latitude: 9.0833, longitude: 40.8667 },
  Jijiga: { latitude: 9.3500, longitude: 42.8000 },
  "Jijiga City": { latitude: 9.3500, longitude: 42.8000 },
  "Dire Dawa": { latitude: 9.5931, longitude: 41.8661 },
  "Dire Dawa City": { latitude: 9.5931, longitude: 41.8661 },

  // Afar, Somali, Gambela, Assosa
  Semera: { latitude: 11.7900, longitude: 41.0000 },
  Asaita: { latitude: 11.5667, longitude: 41.4333 },
  Awash: { latitude: 8.9833, longitude: 40.1667 },
  Gode: { latitude: 5.9000, longitude: 43.5833 },
  Gambela: { latitude: 7.7500, longitude: 34.5833 },
  Assosa: { latitude: 10.0667, longitude: 34.5333 },
};

export const GEOCODING_TABLE = {
  Oromia: {
    Arsi: { latitude: 7.6000, longitude: 39.1000 },
    "West Arsi": { latitude: 7.2000, longitude: 38.6000 },
    Bale: { latitude: 7.0000, longitude: 40.0000 },
    "East Bale": { latitude: 7.1500, longitude: 40.7000 },
    Borena: { latitude: 4.9000, longitude: 38.1000 },
    Guji: { latitude: 5.3500, longitude: 39.0000 },
    "West Guji": { latitude: 5.6000, longitude: 38.2000 },
    "East Hararghe": { latitude: 9.2500, longitude: 42.0000 },
    "West Hararghe": { latitude: 8.9000, longitude: 40.8000 },
    "East Shewa": { latitude: 8.5400, longitude: 39.2700 },
    "West Shewa": { latitude: 8.9800, longitude: 37.8500 },
    "North Shewa": { latitude: 9.8000, longitude: 38.7300 },
    "Southwest Shewa": { latitude: 8.5300, longitude: 37.9700 },
    "East Welega": { latitude: 9.0800, longitude: 36.5500 },
    "West Welega": { latitude: 9.1700, longitude: 35.1700 },
    "Horo Guduru Welega": { latitude: 9.5700, longitude: 37.1000 },
    "Kellem Welega": { latitude: 8.8800, longitude: 34.8000 },
    Jimma: { latitude: 7.6700, longitude: 36.8300 },
    Illubabor: { latitude: 8.3000, longitude: 35.5000 },
    "Buno Bedele": { latitude: 8.4500, longitude: 36.3500 },
    "Oromia Special Zone Surrounding Finfinne": { latitude: 8.9500, longitude: 38.7000 },
  },
  "Addis Ababa": {
    Arada: { latitude: 9.0350, longitude: 38.7530 },
    Gulele: { latitude: 9.0680, longitude: 38.7450 },
    Yeka: { latitude: 9.0300, longitude: 38.8000 },
    "Kolfe Keranio": { latitude: 9.0150, longitude: 38.7050 },
    "Nifas Silk Lafto": { latitude: 8.9600, longitude: 38.7300 },
    Lideta: { latitude: 9.0100, longitude: 38.7400 },
    "Akaki Kality": { latitude: 8.8900, longitude: 38.7800 },
    Bole: { latitude: 8.9900, longitude: 38.7900 },
    Kirkos: { latitude: 9.0100, longitude: 38.7600 },
    "Addis Ketema": { latitude: 9.0300, longitude: 38.7350 },
    "Lemi Kura": { latitude: 9.0200, longitude: 38.8400 },
  },
  Amhara: {
    "North Wollo": { latitude: 11.8300, longitude: 39.6000 },
    "South Wollo": { latitude: 11.1300, longitude: 39.6300 },
    "North Shewa (Amhara)": { latitude: 9.6800, longitude: 39.5300 },
    "East Gojjam": { latitude: 10.3300, longitude: 37.7300 },
    "West Gojjam": { latitude: 11.1000, longitude: 37.1500 },
    "North Gondar": { latitude: 12.6000, longitude: 37.4600 },
    "South Gondar": { latitude: 11.8500, longitude: 38.0000 },
    "Central Gondar": { latitude: 12.5000, longitude: 37.2000 },
    "West Gondar": { latitude: 12.8000, longitude: 36.2000 },
    Awi: { latitude: 10.9500, longitude: 36.8800 },
    "Wag Hemra": { latitude: 12.6300, longitude: 39.0400 },
    "Oromia Special Zone": { latitude: 10.7500, longitude: 39.8500 },
  },
  Tigray: {
    "Mekelle City": { latitude: 13.4967, longitude: 39.4753 },
    Central: { latitude: 14.1200, longitude: 38.7200 },
    Eastern: { latitude: 14.2700, longitude: 39.4600 },
    Southern: { latitude: 12.9600, longitude: 39.5300 },
    "South Eastern": { latitude: 13.2500, longitude: 39.6000 },
    Northwestern: { latitude: 14.1000, longitude: 38.2800 },
    Western: { latitude: 13.8000, longitude: 36.6500 },
  },
  Sidama: {
    "Hawassa City": { latitude: 7.0622, longitude: 38.4763 },
    "Sidama Zone": { latitude: 6.7000, longitude: 38.4500 },
  },
  "Central Ethiopia": {
    Gurage: { latitude: 8.1500, longitude: 37.9000 },
    Silte: { latitude: 7.8500, longitude: 38.3000 },
    Hadiya: { latitude: 7.5500, longitude: 37.8500 },
    "Kembata Tembaro": { latitude: 7.2500, longitude: 37.8500 },
    Halaba: { latitude: 7.3000, longitude: 38.1000 },
    Yem: { latitude: 7.7500, longitude: 37.4500 },
  },
  "South Ethiopia": {
    Wolaita: { latitude: 6.8500, longitude: 37.7500 },
    Gamo: { latitude: 6.0300, longitude: 37.5500 },
    Gofa: { latitude: 6.3000, longitude: 36.8500 },
    "South Omo": { latitude: 5.2500, longitude: 36.6500 },
    Konso: { latitude: 5.3300, longitude: 37.4300 },
    Derashe: { latitude: 5.6800, longitude: 37.4000 },
    Amaro: { latitude: 5.8000, longitude: 37.9000 },
    Burji: { latitude: 5.4000, longitude: 37.8500 },
  },
  "Southwest Ethiopia": {
    Keffa: { latitude: 7.2700, longitude: 36.2500 },
    Sheka: { latitude: 7.3500, longitude: 35.4000 },
    "Bench Sheko": { latitude: 6.9000, longitude: 35.5800 },
    Dawro: { latitude: 7.0000, longitude: 37.1500 },
    Konta: { latitude: 7.1000, longitude: 36.8000 },
    "West Omo": { latitude: 6.0000, longitude: 35.5000 },
  },
  Afar: {
    "Awusi Rasu (Zone 1)": { latitude: 11.7500, longitude: 41.4000 },
    "Kilbet Rasu (Zone 2)": { latitude: 13.8000, longitude: 40.3000 },
    "Gabi Rasu (Zone 3)": { latitude: 10.0000, longitude: 40.5000 },
    "Fantena Rasu (Zone 4)": { latitude: 12.3000, longitude: 40.0000 },
    "Hari Rasu (Zone 5)": { latitude: 11.0000, longitude: 40.0000 },
  },
  Somali: {
    "Fafan (Jijiga)": { latitude: 9.3500, longitude: 42.8000 },
    Siti: { latitude: 10.0000, longitude: 41.8000 },
    Gerdhari: { latitude: 8.1500, longitude: 43.5500 },
    Liben: { latitude: 4.8000, longitude: 40.0000 },
    Afder: { latitude: 5.3500, longitude: 43.5000 },
    Shabelle: { latitude: 5.9000, longitude: 43.6000 },
    Korahe: { latitude: 6.7500, longitude: 44.2500 },
    Doolo: { latitude: 6.9500, longitude: 46.1000 },
    Erer: { latitude: 7.7000, longitude: 42.3000 },
  },
  "Dire Dawa": {
    "Dire Dawa City": { latitude: 9.5931, longitude: 41.8661 },
    "Dire Dawa Rural": { latitude: 9.5500, longitude: 41.9000 },
  },
  Gambela: {
    Anywaa: { latitude: 7.7000, longitude: 34.4000 },
    Nuer: { latitude: 8.2000, longitude: 33.5000 },
    Majang: { latitude: 7.2000, longitude: 35.1000 },
    "Itang Special": { latitude: 8.1800, longitude: 34.2700 },
  },
  Harari: {
    "Harar City": { latitude: 9.3100, longitude: 42.1300 },
    "Harari Rural": { latitude: 9.3000, longitude: 42.1800 },
  },
};

/**
 * Computes a deterministic micro-offset based on wereda or kebele string so that
 * different weredas in the same zone receive distinct coordinates (~5-15km apart).
 */
function getWeredaOffset(weredaName) {
  if (!weredaName) return { latOffset: 0, lngOffset: 0 };
  let hash = 0;
  for (let i = 0; i < weredaName.length; i++) {
    hash = (hash << 5) - hash + weredaName.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  // Produce deterministic offset in range [-0.035, +0.035] (~3.5km - 4km)
  const latOffset = (((absHash % 70) - 35) / 1000);
  const lngOffset = ((((absHash >> 3) % 70) - 35) / 1000);
  return { latOffset, lngOffset };
}

/**
 * Returns approximate { latitude, longitude } for a given location object { region, zone, wereda }.
 * Prioritizes direct wereda coordinate, then zone coordinate + wereda offset, then region centroid.
 *
 * @param {Object} location - Location object containing { region, zone, wereda }
 * @returns {Object} { latitude, longitude }
 */
export function getCoordinatesForLocation(location) {
  if (!location) return DEFAULT_COORDINATE;
  const { region, zone, wereda } = location;

  // 1. Direct wereda match
  if (wereda && WEREDA_COORDINATES[wereda]) {
    return WEREDA_COORDINATES[wereda];
  }

  // 2. Zone match + deterministic wereda micro-offset
  if (region && GEOCODING_TABLE[region]) {
    const regionZones = GEOCODING_TABLE[region];
    let baseCoord = null;

    if (zone && regionZones[zone]) {
      baseCoord = regionZones[zone];
    } else {
      const firstZoneKey = Object.keys(regionZones)[0];
      if (firstZoneKey && regionZones[firstZoneKey]) {
        baseCoord = regionZones[firstZoneKey];
      }
    }

    if (baseCoord) {
      const offset = getWeredaOffset(wereda || zone);
      return {
        latitude: baseCoord.latitude + offset.latOffset,
        longitude: baseCoord.longitude + offset.lngOffset,
      };
    }
  }

  // 3. Fallback to default Addis Ababa coordinate + offset if wereda present
  const fallbackOffset = getWeredaOffset(wereda || zone || region);
  return {
    latitude: DEFAULT_COORDINATE.latitude + fallbackOffset.latOffset,
    longitude: DEFAULT_COORDINATE.longitude + fallbackOffset.lngOffset,
  };
}
