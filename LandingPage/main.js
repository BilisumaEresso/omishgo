'use strict';

/* ══════════════════════════════════════════════════════════════
   1. TRANSLATIONS
   A3: screen_s5/s8 , removed fake ETB figures; now match am/or ("Farmer Dashboard" / "Buyer Dashboard")
   A4: screen_s4/s9 , "live tracking" language corrected
   B2: stat3_claim key added in all three languages (text claim replaces broken counter)
   D:  hero_badge no longer contains rocket emoji , icon is in HTML; key is text only
       form_success no longer contains 🎉 emoji , icon injected by JS
   ══════════════════════════════════════════════════════════════ */
const translations = {
  en: {
    nav_problem: "Problem",
    nav_solution: "How It Works",
    nav_demo: "Demo",
    nav_screens: "App",
    nav_contact: "Contact",
    nav_cta: "Get the App",
    /* D: no emoji , rocket SVG is a sibling element in HTML */
    hero_badge: "Meki, Ethiopia · Open Pilot",
    hero_h1a: "Empowering",
    hero_h1b: "Ethiopia's Farmers",
    hero_amharic: "ያለ ደላላ ቀጥታ ከሻጭ ወደ ገዢ",
    hero_oromo: "Gabatee irraa bitaa-gurgurtaa karaa salphaa",
    hero_sub:
      "The mobile marketplace that cuts out middlemen , farmers post listings, buyers discover them instantly, deals happen in real time.",
    hero_cta1: "Download APK",
    hero_cta2: "Join the Pilot Waitlist",
    /* A5: deliberately unchanged , see launch-report.md for the flag */
    hero_trust: "Trusted by Farmers' Union • Meki Pilot 2026",
    problem_label: "The Problem",
    problem_h2:
      "Ethiopian farmers lose most of their earnings before reaching the market",
    problem_sub:
      "Informal traders control pricing, access, and distribution , leaving smallholder farmers with no leverage and no alternatives.",
    stat1_label: "of crop value lost to trader markups",
    stat2_label: "of final market price reaches the farmer",
    /* B2: text claim replaces broken 0-counter */
    stat3_claim:
      "Ethiopia's first direct digital marketplace for smallholder farmers",
    solution_label: "How It Works",
    solution_h2: "Post a listing. Find it. Deal done.",
    solution_sub:
      "OmishGo is built around the core loop that actually matters , getting a farmer's product in front of a buyer, fast.",
    step1_h: "Farmer Posts a Listing",
    step1_p:
      "Snap a photo, set a price in Birr, describe the product. Live in seconds , even on 2G.",
    step2_h: "Buyer Discovers & Messages",
    step2_p:
      "Buyers browse live listings, filter by crop type or location, and message the farmer directly in-app.",
    step3_h: "Deal Confirmed, Order Tracked",
    step3_p:
      "Order placed, stock updated, both parties notified. No paperwork. No phone tag with a middleman.",
    lang_note: "All three languages are first-class , not an afterthought.",
    demo_label: "See It Live",
    demo_h2: "Listing to message , under 20 seconds",
    demo_sub:
      "A farmer posts produce. A buyer finds it and messages directly. No agent, no phone call.",
    demo_caption: "Demo coming soon , uploading to YouTube shortly",
    screens_label: "Built for the Ethiopian Market",
    screens_h2: "The app, in three languages",
    screens_sub:
      "9 real screens from the current build. PIN login. Works offline.",
    tab_all: "All Screens",
    tab_onboard: "Onboarding",
    tab_farmer: "Farmer",
    tab_buyer: "Buyer",
    screen_s1: "Sell Your Harvest Directly",
    screen_s2: "Browse Fresh from the Farm",
    screen_s3: "Farm Inputs at Your Door",
    /* A4: "Track Every Delivery" → honest framing */
    screen_s4: "See Delivery Progress",
    /* A3: fake ETB figures removed */
    screen_s5: "Farmer Dashboard",
    screen_s6: "Verified Producer Profile",
    screen_s7: "Direct In-App Messaging",
    /* A3: fake ETB figures removed */
    screen_s8: "Buyer Dashboard",
    /* A4: "Live Order Tracking" → honest framing */
    screen_s9: "My Orders , Order Progress",
    pilot_h2: "Closed pilot , Meki, Q3 2026",
    pilot_p:
      "OmishGo is running a closed pilot in the Meki area with the local Farmers' Union acting as platform administrators , approving every user, ensuring quality, and building trust on the ground before we scale.",
    funders_label: "Target funders & accelerators",
    dl_label: "Get OmishGo",
    dl_h2: "Join the future of Ethiopian farming",
    dl_p: "Android APK , optimized for 2G, PIN-based login, works offline. Free during the pilot.",
    dl_btn_apk: "Download APK",
    dl_apk_sub: "APK coming soon , join the waitlist",
    dl_btn_waitlist: "Join Pilot Waitlist",
    dl_btn_waitlist_sub: "Farmers & Buyers",
    form_h: "Stay in the loop",
    form_p: "We'll notify you when the public pilot opens in your area.",
    form_name: "Full Name",
    form_phone: "Phone Number",
    form_role: "I am a…",
    form_role_placeholder: "Select your role",
    form_role_farmer: "Farmer (Qonnaan Bulaa / አርሶ አደር)",
    form_role_buyer: "Buyer / Trader",
    form_role_investor: "Investor / Funder",
    form_role_other: "Other",
    form_submit: "Join Waitlist →",
    /* D: no emoji , success icon injected by JS */
    form_success: "You're on the list! We'll be in touch soon.",
    footer_tagline:
      "Ethiopia's direct farm-to-buyer marketplace. No middlemen. Better prices. Real impact.",
    footer_product: "Product",
    footer_how: "How It Works",
    footer_screens: "App Screens",
    footer_demo: "Demo Video",
    footer_download: "Download APK",
    footer_pilot: "Pilot",
    footer_about: "About the Pilot",
    footer_join: "Join Waitlist",
    footer_contact_link: "Contact Us",
    footer_lang_title: "Language / ቋንቋ / Afaan",
    footer_copy: "© 2026 OmishGo. Built in Ethiopia 🇪🇹",
    footer_privacy:
      "Your contact info is only used to notify you about the pilot. We don't sell or share it.",
  },
  am: {
    nav_problem: "ችግሩ",
    nav_solution: "አሠራር",
    nav_demo: "ማሳያ",
    nav_screens: "መተግበሪያ",
    nav_contact: "ያግኙን",
    nav_cta: "መተግበሪያውን ያውርዱ",
    hero_badge: "መቂ፣ ኢትዮጵያ · ክፍት የሙከራ ትግበራ",
    hero_h1a: "የኢትዮጵያ አርሶ አደሮችን",
    hero_h1b: "አቅም ማጎልበት",
    hero_amharic: "ያለ ደላላ ቀጥታ ከሻጭ ወደ ገዢ",
    hero_oromo: "Gabatee irraa bitaa-gurgurtaa karaa salphaa",
    hero_sub:
      "ደላሎችን በማስቀረት አርሶ አደሮች ምርታቸውን በቀጥታ የሚሸጡበት፣ ገዢዎች በፍጥነት የሚያገኙበት እና ግብይት በቅጽበት የሚፈጸምበት ዲጂታል የገበያ ትስስር።",
    hero_cta1: "APK ያውርዱ",
    hero_cta2: "ለሙከራ ትግበራው ይመዝገቡ",
    hero_trust: "በአርሶ አደሮች ህብረት የታመነ • የመቂ የሙከራ ትግበራ 2026",
    problem_label: "ዋናው ችግር",
    problem_h2: "የኢትዮጵያ አርሶ አደሮች ምርታቸው ገበያ ከመድረሱ በፊት አብዛኛውን ትርፋቸውን ያጣሉ",
    problem_sub:
      "መደበኛ ያልሆኑ ደላሎች የገበያ ዋጋን እና ስርጭትን ይቆጣጠራሉ  ይህ ደግሞ አነስተኛ አርሶ አደሮችን ያለምንም አማራጭ ለኪሳራ ይዳርጋል።",
    stat1_label: "ከምርቱ ዋጋ በደላሎች ምክንያት የሚጠፋ",
    stat2_label: "የመጨረሻው የገበያ ዋጋ ለአርሶ አደሩ ይደርሳል",
    /* B2: Amharic version of the text claim */
    stat3_claim: "ለአነስተኛ አርሶ አደሮች የተሰራ የኢትዮጵያ ቀዳሚው ቀጥታ ዲጂታል ገበያ",
    solution_label: "አሠራሩ",
    solution_h2: "ምርት ያቅርቡ። ገዢ ያግኙ። ስምምነት ይፈጽሙ።",
    solution_sub:
      "OmishGo የተገነባው እጅግ ወሳኝ በሆነው አላማ ላይ ነው , የአርሶ አደሩን ምርት በፍጥነት ከገዢው ጋር ማገናኘት።",
    step1_h: "አርሶ አደሩ ምርቱን ያቀርባል",
    step1_p:
      "ፎቶ ያንሱ፣ ዋጋ በብር ይወስኑ፣ ምርቱን ይግለጹ። ወዲያውኑ ገበያ ላይ ይወጣል  በ2G ኢንተርኔትም ጭምር።",
    step2_h: "ገዢዎች ያገኛሉ፣ መልዕክትም ይልካሉ",
    step2_p:
      "ገዢዎች የቀረቡ ምርቶችን ይመለከታሉ፣ በምርት አይነት ወይም በቦታ ያጣራሉ፣ ለአርሶ አደሩም በቀጥታ መልዕክት ይልካሉ።",
    step3_h: "ስምምነት ይረጋገጣል፣ ትዕዛዝ ይከታተላሉ",
    step3_p:
      "ትዕዛዝ ይላካል፣ ክምችት ይዘመናል፣ ሁለቱም ወገኖች ማሳወቂያ ይደርሳቸዋል። ወረቀት ወይም ከደላላ ጋር ስልክ መደዋወል አያስፈልግም።",
    lang_note: "ሦስቱም ቋንቋዎች በአግባቡ የተካተቱ ናቸው።",
    demo_label: "በቀጥታ ይመልከቱ",
    demo_h2: "ምርት ከማቅረብ እስከ መልዕክት , ከ20 ሴኮንድ ባነሰ ጊዜ",
    demo_sub:
      "አርሶ አደር ምርት ያቀርባል። ገዢ ያገኛል፣ በቀጥታ መልዕክት ይልካል። ደላላ ወይም የስልክ ጥሪ አያስፈልግም።",
    demo_caption: "ቪዲዮው በቅርቡ ይመጣል  ወደ YouTube በመጫን ላይ ነን",
    screens_label: "ለኢትዮጵያ ገበያ የተሰራ",
    screens_h2: "መተግበሪያው በሶስት ቋንቋዎች",
    screens_sub:
      "9 እውነተኛ የመተግበሪያ ገጾች። በPIN የሚሰራ መግቢያ። ያለ በይነመረብ (Offline) ይሰራል።",
    tab_all: "ሁሉም ማሳያዎች",
    tab_onboard: "መግቢያ",
    tab_farmer: "አርሶ አደር",
    tab_buyer: "ገዢ",
    screen_s1: "ምርትዎን በቀጥታ ይሸጡ",
    screen_s2: "ትኩስ ምርት ከማሳው ያስሱ",
    screen_s3: "የግብርና ግብዓቶች እስከ ደጃፍዎ",
    screen_s4: "የአቅርቦት ሂደትን ይከታተሉ",
    screen_s5: "የአርሶ አደር ዳሽቦርድ",
    screen_s6: "የተረጋገጠ የአምራች መለያ",
    screen_s7: "ቀጥታ የመልዕክት ልውውጥ",
    screen_s8: "የገዢ ዳሽቦርድ",
    screen_s9: "ትዕዛዞቼ , የትዕዛዝ ሂደት",
    pilot_h2: "ዝግ የሙከራ ትግበራ  መቂ፣ 3ኛው ሩብ ዓመት 2026",
    pilot_p:
      "OmishGo ወደ ሌሎች አካባቢዎች ከማስፋፋቱ በፊት በመቂ አካባቢ ከአካባቢው የአርሶ አደሮች ህብረት ጋር በመተባበር ዝግ የሙከራ ትግበራ እያካሄደ ይገኛል። ህብረቱም እያንዳንዱን ተጠቃሚ በማረጋገጥ፣ ጥራትን በመቆጣጠር እና መሬት ላይ እምነትን በመገንባት ላይ ይገኛል።",
    funders_label: "ለፋይናንስ አቅራቢዎች",
    dl_label: "OmishGoን ያግኙ",
    dl_h2: "የኢትዮጵያን ግብርና የወደፊት ዕጣ ፈንታ ይቀላቀሉ",
    dl_p: "Android APK  ለ2G ኢንተርኔት የተመቻቸ፣ በPIN የሚሰራ መግቢያ፣ ያለ በይነመረብ (Offline) ይሰራል:: በሙከራ ጊዜ ነፃ ነው።",
    dl_btn_apk: "APK ያውርዱ",
    dl_apk_sub: "APK በቅርቡ ይመጣል , የተጠባባቂዎች ዝርዝርን ይቀላቀሉ",
    dl_btn_waitlist: "የሙከራ ትግበራውን ይቀላቀሉ",
    dl_btn_waitlist_sub: "አርሶ አደሮች እና ገዢዎች",
    form_h: "አዳዲስ መረጃዎችን ያግኙ",
    form_p: "የሙከራ ትግበራው በአካባቢዎ ሲጀመር እናሳውቅዎታለን።",
    form_name: "ሙሉ ስም",
    form_phone: "ስልክ ቁጥር",
    form_role: "እኔ...",
    form_role_placeholder: "ሚናዎን ይምረጡ",
    form_role_farmer: "አርሶ አደር (Farmer / Qonnaan Bulaa)",
    form_role_buyer: "ገዢ / ነጋዴ",
    form_role_investor: "ባለሀብት / ፋይናንስ አቅራቢ",
    form_role_other: "ሌላ",
    form_submit: "የተጠባባቂዎች ዝርዝሩን ይቀላቀሉ →",
    form_success: "በተሳካ ሁኔታ ተመዝግበዋል! በቅርቡ እናገኝዎታለን።",
    footer_tagline:
      "የኢትዮጵያ ቀጥታ የአርሶ-አደር-ለገዢ ገበያ። ምንም ደላላ የለም። የተሻለ ዋጋ። እውነተኛ ለውጥ።",
    footer_product: "ምርት",
    footer_how: "አሠራር",
    footer_screens: "የመተግበሪያ ገጾች",
    footer_demo: "የቪዲዮ ማሳያ",
    footer_download: "APK ያውርዱ",
    footer_pilot: "የሙከራ ትግበራ",
    footer_about: "ስለ ሙከራው",
    footer_join: "የተጠባባቂ ዝርዝሩን ይቀላቀሉ",
    footer_contact_link: "ያግኙን",
    footer_lang_title: "Language / ቋንቋ / Afaan",
    footer_copy: "© 2026 OmishGo. በኢትዮጵያ ተሰራ 🇪🇹",
    footer_privacy: "የመገናኛ መረጃዎ ለሙከራ ትግበራው ማሳወቂያ ብቻ ያገለግላል። ለማንም አሳልፈን አንሰጥም።",
  },
  or: {
    nav_problem: "Rakkoo",
    nav_solution: "Akkaataa Itti Hojjetu",
    nav_demo: "Agarsiisa",
    nav_screens: "Appii",
    nav_contact: "Nu Quunnamaa",
    nav_cta: "Appii Buufadhu",
    hero_badge: "Maqii, Itoophiyaa · Yaalii Banaa",
    hero_h1a: "Qonnaan Bultoota Itoophiyaaf",
    hero_h1b: "Humna Uumuu",
    hero_amharic: "ያለ ደላላ ቀጥታ ከሻጭ ወደ ገዢ",
    hero_oromo: "Gabatee irraa bitaa-gurgurtaa karaa salphaa",
    hero_sub:
      "Gabaa moobaayilaa daldaltoota giddu-galeessaa hambisu , qonnaan bultoonni oomisha isaanii maxxansu, bitattoonni hatattamaan argatu, gabaan kallattiin raawwatama.",
    hero_cta1: "APK Buufadhu",
    hero_cta2: "Tarree Eegdota Yaaliitti Makami",
    hero_trust:
      "Waldaa Qonnaan Bultootaatiin Kan Mirkanaa'e • Yaalii Maqii 2026",
    problem_label: "Rakkoo",
    problem_h2:
      "Qonnaan bultoonni Itoophiyaa oomishni isaanii gabaa gahuun dura irra caalaa bu'aa isaanii ni dhabu",
    problem_sub:
      "Daldaltoonni al-idilee gatii fi raabsa to'atu , kunis qonnaan bultoota xixinnoo filannoo dhabsiisuudhaan miidhamaaf saaxila.",
    stat1_label: "gatii oomishaa daldaltoota giddu-galeessatiif bada",
    stat2_label: "gatii gabaa dhumaa irraa qonnaan bulaa qaqqaba",
    /* B2: Oromo version of the text claim */
    stat3_claim:
      "Gabaa dijitaalaa kallattii jalqabaa Itoophiyaa kan qonnaan bultoota xixinnootiif ijaarame",
    solution_label: "Akkaataa Itti Hojjetu",
    solution_h2: "Oomisha maxxansi. Argadhu. Waliigaltee xumuuri.",
    solution_sub:
      "OmishGo'n kan ijaarame adeemsa bu'uuraa dhugumaan barbaachisaa ta'e irratti dha , oomisha qonnaan bulaa bitataa duratti saffisaan dhiyeessuu.",
    step1_h: "Qonnaan Bulaan Oomisha Maxxansa",
    step1_p:
      "Suuraa kaasi, gatii Birriin murteessi, oomishicha ibsi. Sekoondii muraasa keessatti gabaarra ba'a , intarneetii 2G irrattillee.",
    step2_h: "Bitataan Ni Argata Ergaas Ni Erga",
    step2_p:
      "Bitattoonni oomishaalee dhiyaatan ni daawwatu, gosa midhaanii ykn iddoon ni calalu, kallattiinis qonnaan bulaaf ergaa ergu.",
    step3_h: "Waliigalteen Mirkanaa'e, Ajajni Ni Hordofama",
    step3_p:
      "Ajajni ergameera, kuusaan haaromfameera, qaamoleen lamaanuu beeksisa argatu. Waraqaas ta'e daldalaa giddu-galeessaa wajjin bilbilaan wal-barbaaduun hin jiru.",
    lang_note: "Afaanonni sadanuu iddoo walqixa qabu.",
    demo_label: "Kallattiin Daawwadhu",
    demo_h2: "Maxxansa irraa gara ergaatti , sekoondii 20 gadiitti",
    demo_sub:
      "Qonnaan bulaan oomisha maxxansa. Bitataan argata, kallattiin ergaa erga. Daldalaan giddu-galeessaa hin jiru.",
    demo_caption:
      "Viidiyoon dhiyootti ni dhufa , gara YouTube'itti fe'amaa jira",
    screens_label: "Gabaa Itoophiyaatiif Kan Ijaarame",
    screens_h2: "Appii , afaanota sadiin",
    screens_sub:
      "Fuulota appii dhugaa 9. PIN'n kan seenamu. Toora interneetiin alatti (Offline) ni hojjeta.",
    tab_all: "Fuulota Hunda",
    tab_onboard: "Seensa",
    tab_farmer: "Qonnaan Bulaa",
    tab_buyer: "Bitataa",
    screen_s1: "Oomisha Kee Kallattiin Gurguri",
    screen_s2: "Oomisha Haaraa Maasii Irraa Daawwadhu",
    screen_s3: "Galtee Qonnaa Balbala Keetti",
    screen_s4: "Adeemsa Dhiyeessaa Hordofi",
    screen_s5: "Daashboordii Qonnaan Bulaa",
    screen_s6: "Profaayilii Oomishtaa Mirkanaa'e",
    screen_s7: "Ergaa Kallattii Appii Keessatti",
    screen_s8: "Daashboordii Bitataa",
    screen_s9: "Ajajoota Koo , Adeemsa Ajajaa",
    pilot_h2: "Yaalii cufame , Maqii, Q3 2026",
    pilot_p:
      "OmishGoon naannoo Maqiitti piilootii cufaa Waldaa Qonnaan Bultootaa naannichaa kan akka bulchitoota waltajjichaatti tajaajilan waliin ta'uun geggeessaa jira , waldaan tokkoon tokkoon fayyadamaa mirkaneessa, qulqullina to'ata, akkasumas osoo hin babal'isin dura lafarratti amantaa ijaaraa jira.",
    funders_label: "Qaamolee Maallaqa Dhiyeessanii fi Aksilareetarootaaf",
    dl_label: "OmishGo Argadhu",
    dl_h2: "Qonna Itoophiyaa gara fuulduraatti makamaa",
    dl_p: "Android APK , 2G'f mijataa, PIN'n kan seenamu, toora interneetiin alatti ni hojjeta. Yeroo yaaliitti bilisa.",
    dl_btn_apk: "APK Buufadhu",
    dl_apk_sub: "APK dhiyootti ni dhufa , tarree eegdotaatti makami",
    dl_btn_waitlist: "Tarree Eegdota Yaaliitti Makami",
    dl_btn_waitlist_sub: "Qonnaan Bultoota fi Bitattootaaf",
    form_h: "Odeeffannoo Argadhu",
    form_p: "Yaaliin ummataaf naannoo keessanitti yeroo banamu isin beeksifna.",
    form_name: "Maqaa Guutuu",
    form_phone: "Lakkoofsa Bilbilaa",
    form_role: "Ani…",
    form_role_placeholder: "Gahee kee filadhu",
    form_role_farmer: "Qonnaan Bulaa (Farmer / አርሶ አደር)",
    form_role_buyer: "Bitataa / Daldalaa",
    form_role_investor: "Investerii / Maallaqa Dhiyeessaa",
    form_role_other: "Kan biroo",
    form_submit: "Tarreetti Makami →",
    form_success: "Milkiin galmoofteetta! Dhiyootti si quunnamna.",
    footer_tagline:
      "Gabaa kallattii qonnaan-bulaa irraa bitataatti Itoophiyaa. Daldalaan giddu-galeessaa hin jiru. Gatii fooya'aa. Bu'aa dhugaa.",
    footer_product: "Oomisha",
    footer_how: "Akkaataa Itti Hojjetu",
    footer_screens: "Fuulota Appii",
    footer_demo: "Agarsiisa Viidiyoo",
    footer_download: "APK Buufadhu",
    footer_pilot: "Piilootii",
    footer_about: "Waa'ee Piilootichaa",
    footer_join: "Tarree Eegdotaatti Makami",
    footer_contact_link: "Nu Quunnamaa",
    footer_lang_title: "Language / ቋንቋ / Afaan",
    footer_copy: "© 2026 OmishGo. Itoophiyaa keessatti ijaarame 🇪🇹",
    footer_privacy:
      "Ragaan quunnamtii kee waa'ee piilootichaa beeksisuuf qofa fayyada. Eenyuufiyyuu dabarsee hin kennamu.",
  },
};

/* ══════════════════════════════════════════════════════════════
   2. LANGUAGE ENGINE
   ══════════════════════════════════════════════════════════════ */
let currentLang = localStorage.getItem('omishgo_lang') || 'en';

function applyLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('omishgo_lang', lang);
  const d = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (d[k] !== undefined) el.textContent = d[k];
  });
  document.querySelectorAll('.lang-btn, .lang-footer-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  document.documentElement.lang = lang === 'am' ? 'am' : lang === 'or' ? 'om' : 'en';
  // Update carousel captions
  document.querySelectorAll('.c-slide').forEach(slide => {
    const key = slide.getAttribute('data-label-key');
    const cap = slide.querySelector('.c-caption');
    if (cap && key && d[key]) cap.textContent = d[key];
  });
  // B2: update text-claim stat card
  const claimEl = document.querySelector('.stat-claim');
  if (claimEl && d.stat3_claim) claimEl.textContent = d.stat3_claim;
}
document.querySelectorAll('.lang-btn, .lang-footer-btn').forEach(btn =>
  btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')))
);
applyLanguage(currentLang);

/* ══════════════════════════════════════════════════════════════
   3. NAV SCROLL
   ══════════════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ══════════════════════════════════════════════════════════════
   4. HAMBURGER
   ══════════════════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!open));
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = open ? '' : 'hidden';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

/* ══════════════════════════════════════════════════════════════
   5. REVEAL
   ══════════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════════════════════
   6. COUNTER ANIMATION (only for stat cards with data-count)
   ══════════════════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  if (target === 0) return;
  const dur = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(easeOut(p) * target);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statsGrid.querySelectorAll('.stat-number').forEach(animateCounter);
    }
  }, { threshold: 0.4 }).observe(statsGrid);
}

/* ══════════════════════════════════════════════════════════════
   7. PARTICLES
   ══════════════════════════════════════════════════════════════ */
(function spawnParticles() {
  const c = document.getElementById('particles-container');
  if (!c) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = Math.random() * 3 + 1;
    p.style.cssText = `left:${Math.random()*100}%;bottom:${Math.random()*15}%;width:${s}px;height:${s}px;background:${Math.random()>.5?'#f5c518':'#4dbc8a'};animation-duration:${9+Math.random()*14}s;animation-delay:${Math.random()*10}s`;
    c.appendChild(p);
  }
})();

/* ══════════════════════════════════════════════════════════════
   8. VIDEO PLAYER
   Replace YOUTUBE_ID value once the demo is uploaded.
   ══════════════════════════════════════════════════════════════ */
const YOUTUBE_ID = "en4wYb-TkdM";
const playBtn     = document.getElementById('play-btn');
const videoPlayer = document.getElementById('video-player');
const ytContainer = document.getElementById('yt-frame-container');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (YOUTUBE_ID === 'YOUR_YOUTUBE_VIDEO_ID') {
      /* D: time-outline SVG used for "uploading soon" state */
      const cap = document.getElementById('video-caption');
      if (cap) {
        cap.innerHTML =
          '<svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" width="14" height="14" aria-hidden="true" style="margin-right:5px;vertical-align:middle">' +
            '<path d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64Z"/>' +
            '<path d="M256 128v144h96" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
          'Video uploading soon , join our Telegram for updates!';
        cap.style.background = 'rgba(245,197,24,.92)';
        cap.style.color = '#111';
      }
      return;
    }
    const f = document.createElement('iframe');
    f.src = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`;
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    f.title = 'OmishGo demo video';
    ytContainer.innerHTML = '';
    ytContainer.appendChild(f);
    playBtn.style.display = 'none';
    const poster = document.getElementById('video-poster');
    if (poster) poster.style.display = 'none';
    const cap = document.getElementById('video-caption');
    if (cap) cap.style.display = 'none';
  });
}

/* ══════════════════════════════════════════════════════════════
   9. CINEMATIC 3D SCREENSHOT CAROUSEL
   ══════════════════════════════════════════════════════════════ */
(function initCarousel() {
  const track   = document.getElementById('carousel-track');
  const stage   = document.getElementById('carousel-stage');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsEl  = document.getElementById('carousel-dots');
  const tabBtns = document.querySelectorAll('.screen-tab');
  if (!track || !stage) return;

  let allSlides = Array.from(track.querySelectorAll('.c-slide'));
  let visible   = [...allSlides];
  let current   = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let autoTimer  = null;

  function buildDots() {
    dotsEl.innerHTML = '';
    visible.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === current ? ' active' : '');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', `Screenshot ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });
  }

  function applyStates() {
    const classes = ['is-active','is-left','is-right','is-far','is-hidden'];
    visible.forEach((slide, i) => {
      slide.classList.remove(...classes);
      const diff = i - current;
      if      (diff === 0)             slide.classList.add('is-active');
      else if (diff === -1)            slide.classList.add('is-left');
      else if (diff === 1)             slide.classList.add('is-right');
      else if (Math.abs(diff) <= 3)   slide.classList.add('is-far');
      else                             slide.classList.add('is-hidden');
    });
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    const active = visible[current];
    if (!active) return;
    const stageRect  = stage.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const center     = stageRect.left + stageRect.width / 2;
    const cardCenter = activeRect.left + activeRect.width / 2;
    const currentOffset = parseFloat(track.style.transform?.match(/-?[\d.]+/)?.[0] || 0);
    const newOffset = currentOffset - (cardCenter - center);
    track.style.transition = 'transform .55s cubic-bezier(.25,.46,.45,.94)';
    track.style.transform = `translateX(${newOffset}px)`;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, visible.length - 1));
    applyStates();
    resetAuto();
  }

  function applyFilter(group) {
    allSlides.forEach(slide => {
      const g = slide.getAttribute('data-group');
      slide.style.display = (group === 'all' || g === group) ? '' : 'none';
    });
    visible = allSlides.filter(s => s.style.display !== 'none');
    current = 0;
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    buildDots();
    requestAnimationFrame(() => requestAnimationFrame(() => applyStates()));
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  stage.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    track.style.transition = 'none';
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
    const base = parseFloat(track.style.transform?.match(/-?[\d.]+/)?.[0] || 0);
    track.style.transform = `translateX(${base + dragDeltaX}px)`;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if      (dragDeltaX < -50) goTo(current + 1);
    else if (dragDeltaX >  50) goTo(current - 1);
    else                        applyStates();
    dragDeltaX = 0;
  });

  let touchX = 0;
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; track.style.transition = 'none'; }, { passive: true });
  stage.addEventListener('touchmove',  e => {
    const delta = e.touches[0].clientX - touchX;
    const base  = parseFloat(track.style.transform?.match(/-?[\d.]+/)?.[0] || 0);
    track.style.transform = `translateX(${base + delta * 0.4}px)`;
  }, { passive: true });
  stage.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if      (diff >  40) goTo(current + 1);
    else if (diff < -40) goTo(current - 1);
    else                  applyStates();
  }, { passive: true });

  allSlides.forEach(slide => {
    slide.addEventListener('click', () => {
      const visIdx = visible.indexOf(slide);
      if (visIdx !== -1 && visIdx !== current) goTo(visIdx);
    });
  });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1 < visible.length ? current + 1 : 0), 4500);
  }

  const stageW = stage.offsetWidth;
  if (track.children.length) {
    track.style.paddingLeft  = `${stageW / 2 - 110}px`;
    track.style.paddingRight = `${stageW / 2 - 110}px`;
  }

  applyFilter('all');
  buildDots();
  applyStates();
  resetAuto();

  stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
  stage.addEventListener('mouseleave', resetAuto);
})();

/* ══════════════════════════════════════════════════════════════
   10. WAITLIST FORM
   ══════════════════════════════════════════════════════════════ */
const form       = document.getElementById('waitlist-form');
const submitBtn  = document.getElementById('form-submit-btn');
const successMsg = document.getElementById('form-success');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = translations[currentLang];
    submitBtn.disabled = true;
    /* D: time-outline SVG used in button sending state */
    submitBtn.innerHTML =
      '<svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" width="16" height="16" aria-hidden="true" style="margin-right:6px">' +
        '<path d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64Z"/>' +
        '<path d="M256 128v144h96" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>Sending…';
    try {
      const res = await fetch(form.action, { method:'POST', body:new FormData(form), headers:{ Accept:'application/json' } });
      if (res.ok) {
        form.style.display = 'none';
        /* D: checkmark-circle-outline SVG replaces 🎉 emoji in success message */
        successMsg.innerHTML =
          '<svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="32" width="20" height="20" aria-hidden="true" style="margin-right:8px;flex-shrink:0">' +
            '<path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z" stroke-miterlimit="10"/>' +
            '<path d="M352 176 217.6 336 160 272" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
          (d.form_success || "You're on the list! We'll be in touch soon.");
        successMsg.style.display = 'flex';
        successMsg.style.alignItems = 'center';
      } else throw new Error();
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = translations[currentLang].form_submit || 'Join Waitlist →';
      alert('Submission failed , please email hello@omishgo.et');
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   11. ACTIVE NAV SECTION HIGHLIGHT
   ══════════════════════════════════════════════════════════════ */
(function trackSections() {
  const sections = document.querySelectorAll('section[id],footer[id]');
  const links    = document.querySelectorAll('.nav-links a');
  sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => { a.style.color = a.getAttribute('href') === `#${e.target.id}` ? '#fff' : ''; });
        }
      });
    }, { threshold: 0.4 }).observe(s);
  });
})();
