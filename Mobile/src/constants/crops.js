// Mobile/src/constants/crops.js
import i18n from "../locales/i18n";

export const CROP_IMAGES = {
  Teff: "https://static.dw.com/image/18271775_804.jpg",
  "Red Onion":
    "https://pixabay.com/images/download/webtechexperts-onion-5187140_1920.jpg",
  Tomato:
    "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRvbWF0b3xlbnwwfHwwfHx8MA%3D%3D",
  Garlic:
    "https://images.unsplash.com/photo-1615477550927-6ec8445fcfe6?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "White Maize":
    "https://pixabay.com/images/download/drachenfire84-corn-2228848_1920.jpg",
  Wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2hlYXR8ZW58MHx8MHx8fDA%3D",
  Barley:
    "https://plus.unsplash.com/premium_photo-1705146640695-cab3aa2005f4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFybGV5fGVufDB8fDB8fHww",
  Sorghum:
    "https://images.unsplash.com/photo-1714469914199-14ab69eae5f3?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29yZ2h1bSUyMGdyYWlufGVufDB8fDB8fHww",
  Millet:
    "https://images.unsplash.com/photo-1783042909392-0b8d8683e0a2?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1pbGxldHxlbnwwfHwwfHx8MA%3D%3D",
  "Green Pepper":
    "https://images.unsplash.com/photo-1524593410820-38510f580a77?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JlZW4lMjBwZXBwZXJ8ZW58MHx8MHx8fDA%3D",
  Cabbage:
    "https://images.unsplash.com/photo-1697346327617-c333613a349a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FiYmFnZXxlbnwwfHwwfHx8MA%3D%3D",
  Potato:
    "https://images.unsplash.com/photo-1675501344642-92d35d90fe51?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG90YXRvfGVufDB8fDB8fHww",
  Carrot:
    "https://images.unsplash.com/photo-1633380110125-f6e685676160?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2Fycm90fGVufDB8fDB8fHww",
  Beetroot:
    "https://images.unsplash.com/photo-1663961355715-cf362778dc0e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlZXRyb290fGVufDB8fDB8fHww",
  Coffee:
    "https://plus.unsplash.com/premium_photo-1670758291967-25ed2e90f21e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29mZmVlJTIwYmVhbnN8ZW58MHx8MHx8fDA%3D",
  Sesame:
    "https://plus.unsplash.com/premium_photo-1674654419404-667fcdd0fe13?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2VzYW1lfGVufDB8fDB8fHww",
  Lentil:
    "https://images.unsplash.com/photo-1708436478056-1872a208c010?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxlbnRpbHxlbnwwfHwwfHx8MA%3D%3D",
  Chickpea:
    "https://plus.unsplash.com/premium_photo-1675237624857-7d995e29897d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Haricot Bean":
    "https://plus.unsplash.com/premium_photo-1671130295242-582789bd9861?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFyaWNvdCUyMGJlYW58ZW58MHx8MHx8fDA%3D",
  Papaya:
    "https://images.unsplash.com/photo-1581242335635-ce8631489ac5?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcGF5YXxlbnwwfHwwfHx8MA%3D%3D",
  Default:
    "https://images.unsplash.com/photo-1575218823251-f9d243b6f720?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFsbCUyMHZlZ2l0YWJsZXN8ZW58MHx8MHx8fDA%3D",
};

export const getCropFallbackImage = (cropType) => {
  return CROP_IMAGES[cropType] || CROP_IMAGES["Default"];
};

export const CROP_TYPES = [
  "Teff",
  "Red Onion",
  "Tomato",
  "Garlic",
  "White Maize",
  "Wheat",
  "Barley",
  "Sorghum",
  "Millet",
  "Green Pepper",
  "Cabbage",
  "Potato",
  "Carrot",
  "Beetroot",
  "Coffee",
  "Sesame",
  "Lentil",
  "Chickpea",
  "Haricot Bean",
  "Papaya",
  "Beans",
  "Peas",
  "Lentils",
  "Sunflower",
  "Avocado",
  "Banana",
  "Mango",
];

// Unified Proxy accessor pointing directly to i18n locale bundles
export const CROP_TYPES_LOCALIZED = new Proxy(
  {},
  {
    get: (_, langKey) =>
      new Proxy(
        {},
        {
          get: (_, cropKey) =>
            i18n.t(`crops.${cropKey}`, { lng: langKey, defaultValue: cropKey }),
        }
      ),
  }
);

export const DEFAULT_DESCRIPTIONS_LOCALIZED = {
  en: {
    Teff: "Magna (White) Teff, freshly harvested. Thoroughly sifted, cleaned, and grown strictly without chemical residues.",
    "Red Onion": "Red Bombay onion, medium to large size. Well-cured and dry. Sourced directly from local cooperative farms.",
    Tomato: "Fresh Rift Valley tomatoes, fully ripe and firm. Harvested this morning from local irrigation farms.",
    Garlic: "Dry white garlic bulbs. Strong flavor and aroma. Properly cured for extended shelf life.",
    "White Maize": "White maize, premium quality. Properly dried and cleaned grain, ready for milling or direct sale.",
    Wheat: "High-yield bread wheat, this season's harvest. Dry, clean, and well-stored. Perfect for flour milling.",
    Barley: "Premium malt barley, uniform grain size and high germination rate for brewing and food processing.",
    Sorghum: "Clean white sorghum, dry grain harvested from Rift Valley lowlands.",
    Millet: "High-nutrient finger millet, thoroughly winnowed and ready for traditional foods and beverages.",
    "Green Pepper": "Fresh green peppers (Kariya). Plump, unblemished, and uniform in size. Harvested this week.",
    Cabbage: "Fresh, tightly packed green cabbage. Farm-fresh with crisp leaves, grown using local irrigation.",
    Potato: "White potato, uniform medium size. Freshly unearthed, cured, and stored in dry conditions.",
    Carrot: "Vibrant orange carrots, washed, sweet, and crisp. Harvested fresh from highland farms.",
    Beetroot: "Deep red beetroot, firm and medium-sized. Rich in color and nutrients.",
    Coffee: "Grade-1 Specialty Arabica coffee beans, sun-dried and hand-picked from Ethiopian highlands.",
    Sesame: "Export-grade Humera white sesame seeds. High oil content, thoroughly cleaned.",
    Lentil: "Split red lentils, thoroughly cleaned, dry, and free from debris.",
    Chickpea: "Large Kabuli chickpeas, uniform shape, dry and well-stored.",
    "Haricot Bean": "Export-grade white pea beans (Boleqe). Carefully sorted, clean, and dry.",
    Papaya: "Sweet Batu/Meki papaya. Smooth skin, medium-ripe, and carefully handled to avoid transit bruising.",
  },
  am: {
    Teff: "ማግና (ነጭ) ጤፍ፣ አዲስ የተሰበሰበ። ሙሉ ለሙሉ የተለቀመ፣ የተጸዳ፣ ምንም ኬሚካል ሳይጠቀሙ የተመረተ።",
    "Red Onion": "ቀይ ቦምቤ ሽንኩርት፣ መካከለኛ እስከ ትልቅ መጠን። ጠንካራ እና ደረቅ። ቁስለት ሳይኖር ከሕብረት ሥራ ማህበራት ቀጥታ የተሰጠ።",
    Tomato: "ትኩስ ሸለቆ ቲማቲም፣ ሙሉ ለሙሉ የደረሰ እና ጠንካራ። ዛሬ ጠዋት ከአካባቢው የመስኖ ማሳዎች የተሰበሰበ።",
    Garlic: "ደረቅ ነጭ ሽንኩርት። ጠንካራ ጣዕምና መዓዛ ያለው። ለረጅም ጊዜ እንዲቆይ በጥሩ ሁኔታ ተጠብቋል።",
    "White Maize": "ነጭ በቆሎ፣ ከፍተኛ ጥራት። በትክክል የደረቀ እና የተጸዳ ዘር፣ ለወፍጮ ወይም ለቀጥታ ሽያጭ ዝግጁ።",
    Wheat: "ከፍተኛ ምርት ስንዴ፣ የዚህ ወቅት ሰብል። ደረቅ፣ ንጹህ እና በጥሩ ሁኔታ የተቀመጠ። ለዱቄት ፋብሪካዎች ተስማሚ።",
    Barley: "ጥራት ያለው የገብስ ምርት፣ ለምግብ እና ለጠጅ/ቢራ ፋብሪካዎች ዝግጁ የሆነ።",
    Sorghum: "ንጹህ ነጭ ማሽላ፣ በጥሩ ሁኔታ የተሰበሰበ እና የደረቀ።",
    Millet: "ጥራት ያለው ዳጉሣ፣ ለባህላዊ ምግቦችና ጠጅ ዝግጅት የተጸዳ።",
    "Green Pepper": "ትኩስ ቃሪያ። ደንዳና፣ ቁስለት የሌለው እና ወጥ መጠን ያለው። በዚህ ሳምንት የተሰበሰበ።",
    Cabbage: "ትኩስ፣ ጠንካራ ጎመን። ከቅርብ ቦታ ቀጥታ ከማሳ፣ ሸካካ ቅጠሎች ያሉት።",
    Potato: "ነጭ ድንች፣ ወጥ መካከለኛ መጠን። አዲስ የተቆፈረ፣ ደረቅ ቦታ ላይ ተቀምጧል።",
    Carrot: "ትኩስ ካሮት፣ የተጣጠበ እና ጣፋጭ። ከደብር ማሳዎች የተሰበሰበ።",
    Beetroot: "ቀይ ስር፣ ጠንካራ እና መካከለኛ መጠን ያለው።",
    Coffee: "ደረጃ-1 የኢትዮጵያ አራቢካ ቡና፣ በፀሐይ የደረቀ እና በጥንቃቄ የተለቀመ።",
    Sesame: "ለወጪ ንግድ ደረጃ ሁመራ ነጭ ሰሊጥ፣ ከፍተኛ የዘይት መጠን ያለው።",
    Lentil: "የተሰነጠቀ ቀይ ምስር፣ ንጹህ እና ደረቅ።",
    Chickpea: "ትልቅ የካቡሊ ሽምብራ፣ በጥንቃቄ የተለቀመ እና የተቀመጠ።",
    "Haricot Bean": "ለወጪ ንግድ ደረጃ ቦሌቄ። በጥንቃቄ የተለቀመ፣ ንጹህ እና ደረቅ።",
    Papaya: "ጣፋጭ ባቱ/ሜኪ ፓፓያ። ለስላሳ ቆዳ፣ በጥንቃቄ የተያዘ።",
  },
  om: {
    Teff: "Xaafii Magna (Adii), haaraa sassaabame. Guutummaatti gara'amee, qulqullaa'ee fi maaddii tokko malee qotame.",
    "Red Onion": "Qasaricha Bombee Diimaa, dheerinni giddugaleessaa hanga guddaatti. Gogee fi jabaatadha.",
    Tomato: "Xaafii Diimaa Caaccuu Laftii Qorichaa, guutummaatti gabbatee fi cimaadha. Har'a ganama sassaabame.",
    Garlic: "Qasaricha Adii gogaa. Urgaa fi mi'aa cimaa qaba. Yeroo dheeraa akka turuuf sirriitti to'atame.",
    "White Maize": "Boqqoolloo adii, qulqullina ol aanaa. Akka gaaritti gogee fi qulqullaa'e.",
    Wheat: "Qamadii galii guddaa, xaa'oo kana. Gogaa, qulqulluu fi tolfamee kuufame.",
    Barley: "Garbuu gaarii qulqulluu, nyaata fi dhugaatiif qophii.",
    "Green Pepper": "Kariyaa haaraa. Gabbatee, dhukkubbii malee fi dheerinni qixa.",
    Cabbage: "Damma haaraa, jabaatee walitti qabame. Qonnaarraa kallattiidhaan.",
    Potato: "Dinnicha adii, dheerinni giddugaleessaa qixa. Haaraa baafame, gogee kuufame.",
    Coffee: "Buna Itoophiyaa sadarkaa 1ffaa, aduudhaan goge fi of eeggannoon sassaabame.",
    Sesame: "Salxiqi adii Humeeraa baasii alaatiif, cooma ol aanaa qabu.",
    "Haricot Bean": "Boleqe (Buna dachee) baasii gara alaatti erguuf. Har'oo to'annaan qoodame, qulqulluu.",
    Papaya: "Papaayyaa mi'awa Baatuu/Meekii. Gogaa laafaa, of eeggannoon qabame.",
  },
};

export const REFERENCE_PRICES = {
  Teff: { kg: 95, quintal: 9500 },
  "Red Onion": { kg: 45, quintal: 4500 },
  Tomato: { kg: 38, quintal: 3800 },
  Garlic: { kg: 120, quintal: 12000 },
  "White Maize": { kg: 22, quintal: 2200 },
  Wheat: { kg: 41, quintal: 4100 },
  Barley: { kg: 38, quintal: 3800 },
  Sorghum: { kg: 25, quintal: 2500 },
  Millet: { kg: 28, quintal: 2800 },
  "Green Pepper": { kg: 40, quintal: 4000 },
  Cabbage: { kg: 18, quintal: 1800 },
  Potato: { kg: 24, quintal: 2400 },
  Carrot: { kg: 30, quintal: 3000 },
  Beetroot: { kg: 28, quintal: 2800 },
  Coffee: { kg: 220, quintal: 22000 },
  Sesame: { kg: 140, quintal: 14000 },
  Lentil: { kg: 85, quintal: 8500 },
  Chickpea: { kg: 70, quintal: 7000 },
  "Haricot Bean": { kg: 65, quintal: 6500 },
  Papaya: { kg: 25, quintal: 2500 },
};

/**
 * Get localized display name for a crop key directly from unified locale bundles
 */
export const getLocalizedCropName = (cropKey, lang = "en", t = null) => {
  if (!cropKey) return "";
  if (t) {
    return t(`crops.${cropKey}`, { defaultValue: cropKey });
  }
  return i18n.t(`crops.${cropKey}`, { lng: lang, defaultValue: cropKey });
};