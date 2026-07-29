/**
 * Static Ethiopia region/zone geocoding lookup table.
 * Maps exact region + zone combinations from locations.js to approximate { latitude, longitude } pairs.
 * Includes a documented fallback centroid (Addis Ababa) so the map never crashes.
 */

export const DEFAULT_COORDINATE = {
  latitude: 9.0222,
  longitude: 38.7468,
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
 * Returns approximate { latitude, longitude } for a given region and zone location object.
 * Falls back to region centroid or default Addis Ababa centroid if unmapped.
 *
 * @param {Object} location - Location object containing { region, zone }
 * @returns {Object} { latitude, longitude }
 */
export function getCoordinatesForLocation(location) {
  if (!location) return DEFAULT_COORDINATE;
  const { region, zone } = location;

  if (region && GEOCODING_TABLE[region]) {
    const regionZones = GEOCODING_TABLE[region];
    if (zone && regionZones[zone]) {
      return regionZones[zone];
    }
    // Fallback to first zone coordinate of that region if specific zone is unmapped
    const firstZoneKey = Object.keys(regionZones)[0];
    if (firstZoneKey && regionZones[firstZoneKey]) {
      return regionZones[firstZoneKey];
    }
  }

  return DEFAULT_COORDINATE;
}
