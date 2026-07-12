// Ethiopia regions, zones, and wereda for location selection
export const LOCATIONS = {
  "Addis Ababa": {
    zones: [
      "Arada",
      "Gulele",
      "Yeka",
      "Kolfe Keranio",
      "Nifas Silk",
      "Lideta",
      "Akaki Kality",
    ],
    wereda: {
      Arada: ["01", "02", "03"],
      Gulele: ["01", "02", "03"],
      Yeka: ["01", "02", "03"],
      "Kolfe Keranio": ["01", "02", "03"],
      "Nifas Silk": ["01", "02", "03"],
      Lideta: ["01", "02", "03"],
      "Akaki Kality": ["01", "02", "03"],
    },
  },
  Afar: {
    zones: ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"],
    wereda: {
      "Zone 1": ["Dubti", "Elidar", "Ewa"],
      "Zone 2": ["Assaita", "Dalol"],
      "Zone 3": ["Berhale", "Abala"],
      "Zone 4": ["Dallol", "Berahle"],
      "Zone 5": ["Gewane", "Amibara"],
    },
  },
  Amhara: {
    zones: [
      "North Wollo",
      "South Wollo",
      "North Shewa",
      "South Shewa",
      "East Gojjam",
      "West Gojjam",
    ],
    wereda: {
      "North Wollo": ["Woldiya", "Lalibela", "Habru", "Sekota"],
      "South Wollo": ["Dessie", "Kombolcha", "Mekelle"],
      "North Shewa": ["Addis Zemen", "Ankober"],
      "South Shewa": ["Adama", "Bishoftu"],
      "East Gojjam": ["Debre Birhan", "Gondar"],
      "West Gojjam": ["Finote Selam", "Burie"],
    },
  },
  "Dire Dawa": {
    zones: ["Dire Dawa City", "Dire Dawa Rural"],
    wereda: {
      "Dire Dawa City": ["01", "02", "03"],
      "Dire Dawa Rural": ["Dire Dawa", "Goba"],
    },
  },
  Gambela: {
    zones: ["Agnewak", "Nuer", "Anuak"],
    wereda: {
      Agnewak: ["Gambela", "Abobo"],
      Nuer: ["Mekan", "Nasir"],
      Anuak: ["Gog", "Jikaw"],
    },
  },
  Harari: {
    zones: ["Harari City", "Harari Rural"],
    wereda: {
      "Harari City": ["01", "02", "03"],
      "Harari Rural": ["Harar", "Dire Dawa"],
    },
  },
  Oromia: {
    zones: [
      "Jimma",
      "West Hararghe",
      "East Hararghe",
      "Arsi",
      "Bale",
      "Guji",
      "Borana",
      "West Welega",
      "East Welega",
    ],
    wereda: {
      Jimma: ["Jimma City", "Omo Nada", "Tiro Afeta", "Gida Ayana"],
      "West Hararghe": ["Chiro", "Harar Adis", "Adama"],
      "East Hararghe": ["Harar", "Dire Dawa", "Hades"],
      Arsi: ["Adama", "Asela", "Tiyo"],
      Bale: ["Robe", "Dinsho", "Goba"],
      Guji: ["Negele", "Adola"],
      Borana: ["Yabello", "Konso"],
      "West Welega": ["Gimbi", "Lalo Kile"],
      "East Welega": ["Adama", "Harar"],
    },
  },
  SNNPR: {
    zones: ["Sidama", "Wolaita", "Gamo Gofa", "Kambata Tembaro", "Silte"],
    wereda: {
      Sidama: ["Hawassa", "Yirgalem", "Dilla"],
      Wolaita: ["Wolaita Sodo", "Areka"],
      "Gamo Gofa": ["Arba Minch", "Konso"],
      "Kambata Tembaro": ["Durame", "Tumo"],
      Silte: ["Silte", "Betesfa"],
    },
  },
  Somali: {
    zones: ["Eastern", "Western"],
    wereda: {
      Eastern: ["Jijiga", "Degahabur"],
      Western: ["Gode", "Warder"],
    },
  },
  Tigray: {
    zones: ["Central", "Eastern", "Southern", "Western"],
    wereda: {
      Central: ["Mekelle", "Adwa"],
      Eastern: ["Wukro", "Mendefera"],
      Southern: ["Maichew", "Mekelle"],
      Western: ["Adigrat", "Axum"],
    },
  },
};

export const REGIONS = Object.keys(LOCATIONS);

export const getZonesByRegion = (region) => {
  return LOCATIONS[region]?.zones || [];
};

export const getWeredaByZone = (region, zone) => {
  return LOCATIONS[region]?.wereda?.[zone] || [];
};
