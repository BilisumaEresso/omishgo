"use strict";

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
    announcement_text: "Built for Ethiopian agriculture / Designed around local markets",
    announcement_link: "See how it works ↗",
    nav_problem: "Why OmishGo",
    nav_solution: "How It Works",
    nav_demo: "Intro",
    nav_screens: "App",
    nav_contact: "Contact",
    nav_cta: "Get the App",
    /* D: no emoji , rocket SVG is a sibling element in HTML */
    hero_badge: "Meki, Ethiopia - Open Pilot",
    hero_h1a: "Empowering",
    hero_h1b: "Ethiopia's Farmers",
    hero_amharic: "ያለ ደላላ ፣ ቀጥታ ከአርሶ አደር ወደ ገዢ",
    hero_oromo: "Qonnaan bulaa irraa gara bitataatti, karaa salphaa",
    hero_sub:
      "The mobile marketplace that cuts out middlemen. Farmers post listings, buyers discover them instantly, deals happen in real time.",
    hero_cta1: "Download APK",
    hero_cta2: "Join the Pilot Waitlist",
    /* A5: deliberately unchanged , see launch-report.md for the flag */
    hero_trust: "Trusted by Farmers' Union, Meki Pilot 2026",
    problem_label: "The Problem",
    problem_h2:
      "Ethiopian farmers lose most of their earnings before reaching the market",
    problem_sub:
      "Informal traders control pricing, access, and distribution. This leaves smallholder farmers with no leverage and no alternatives.",
    stat1_label: "of crop value lost to trader markups",
    stat2_label: "of final market price reaches the farmer",
    /* B2: text claim replaces broken 0-counter */
    stat3_claim:
      "Ethiopia's first direct digital marketplace for smallholder farmers",
    solution_label: "How It Works",
    solution_h2: "Post a listing. Find it. Deal done.",
    solution_sub:
      "OmishGo is built around the core loop that actually matters: getting a farmer's product in front of a buyer, fast.",
    step1_h: "Farmer Posts a Listing",
    step1_p:
      "Snap a photo, set a price in Birr, describe the product. Live in seconds, even on 2G.",
    step2_h: "Buyer Discovers & Messages",
    step2_p:
      "Buyers browse live listings, filter by crop type or location, and message the farmer directly in-app.",
    step3_h: "Deal Confirmed, Order Tracked",
    step3_p:
      "Order placed, stock updated, both parties notified. No paperwork. No phone tag with a middleman.",
    lang_note: "All three languages are first-class, not an afterthought.",
    demo_label: "Watch",
    demo_h2: "Introducing OmishGo",
    demo_sub:
      "A short overview of what OmishGo does and why it matters for Ethiopian farmers and buyers.",
    demo_caption: "Video coming soon",
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
    screen_s9: "My Orders, Order Progress",
    pilot_h2: "Closed pilot in Meki, Q3 2026",
    pilot_p:
      "OmishGo is running a closed pilot in the Meki area with the local Farmers' Union acting as platform administrators. They approve every user, ensure quality, and build trust on the ground before we scale.",
    funders_label: "Target funders & accelerators",
    dl_label: "Get OmishGo",
    dl_h2: "Join the future of Ethiopian farming",
    dl_p: "Android APK, optimized for 2G, PIN-based login, works offline. Free during the pilot.",
    dl_btn_apk: "Download APK",
    dl_apk_sub: "Direct APK Download (v1.0.0 Pilot)",
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
    form_submit: "Join Waitlist",
    /* D: no emoji , success icon injected by JS */
    form_success: "You're on the list! We'll be in touch soon.",
    footer_tagline:
      "Ethiopia's direct farm-to-buyer marketplace. No middlemen. Better prices. Real impact.",
    footer_product: "Product",
    footer_how: "How It Works",
    footer_screens: "App Screens",
    footer_demo: "Intro Video",
    footer_download: "Download APK",
    footer_pilot: "Pilot",
    footer_about: "About the Pilot",
    footer_join: "Join Waitlist",
    footer_contact_link: "Contact Us",
    footer_lang_title: "Language / ቋንቋ / Afaan",
    footer_copy: "© 2026 OmishGo. Built in Ethiopia",
    footer_privacy:
      "Your contact info is only used to notify you about the pilot. We don't sell or share it.",
    public_loading: "Loading profile details...",
    public_not_found: "Profile Not Found",
    public_not_found_desc: "This public profile does not exist or is unavailable.",
    public_return_home: "Return to OmishGo Home",
    public_farmer_role: "Verified Farmer Producer",
    public_buyer_role: "Verified Wholesale Buyer",
    public_verified: "Verified",
    public_location_not_provided: "Location Not Provided",
    public_member_since: "Member since",
    public_member_generic: "Member of OmishGo",
    public_no_reviews: "No reviews yet",
    public_stat_active_listings: "Active Listings",
    public_stat_completed_orders: "Completed Orders",
    public_stat_delivered_orders: "Delivered Orders",
    public_stat_active_orders: "Active Orders",
    public_stat_rating_reviews: "Rating & Reviews",
    public_stat_joined_year: "Joined",
    public_trust_note: "Verified OmishGo Direct Marketplace Profile",
    public_get_app_btn: "Get the OmishGo App",
    public_error_title: "Unable to Load Profile",
    public_error_desc: "A network error occurred while loading this public profile. Please check your connection and try again."
  },
  am: {
    announcement_text: "ለኢትዮጵያ ግብርና የተዘጋጀ / ከአገር ውስጥ ገበያዎች ጋር የተጣጣመ",
    announcement_link: "እንዴት እንደሚሰራ ይመልከቱ ↗",
    nav_problem: "ችግሩ",
    nav_solution: "አሠራር",
    nav_demo: "መግቢያ ቪዲዮ",
    nav_screens: "መተግበሪያ",
    nav_contact: "ያግኙን",
    nav_cta: "መተግበሪያውን ያውርዱ",
    hero_badge: "መቂ፣ ኢትዮጵያ - ክፍት የሙከራ ትግበራ",
    hero_h1a: "የኢትዮጵያ አርሶ አደሮችን",
    hero_h1b: "አቅም ማጎልበት",
    hero_amharic: "ያለ ደላላ ፣ ቀጥታ ከአርሶ አደር ወደ ገዢ",
    hero_oromo: "Qonnaan bulaa irraa gara bitataatti, karaa salphaa",
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
    demo_label: "ይመልከቱ",
    demo_h2: "OmishGoን እናስተዋውቅ",
    demo_sub:
      "OmishGo ምን እንደሚሰራ እና ለኢትዮጵያ አርሶ አደሮች እና ገዢዎች ለምን አስፈላጊ እንደሆነ አጭር ማብራሪያ።",
    demo_caption: "ቪዲዮው በቅርቡ ይመጣል",
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
    screen_s9: "ትዕዛዞቼ፣ የትዕዛዝ ሂደት",
    pilot_h2: "ዝግ የሙከራ ትግበራ በመቂ፣ 3ኛው ሩብ ዓመት 2026",
    pilot_p:
      "OmishGo ወደ ሌሎች አካባቢዎች ከማስፋፋቱ በፊት በመቂ አካባቢ ከአካባቢው የአርሶ አደሮች ህብረት ጋር በመተባበር ዝግ የሙከራ ትግበራ እያካሄደ ይገኛል። ህብረቱም እያንዳንዱን ተጠቃሚ በማረጋገጥ፣ ጥራትን በመቆጣጠር እና መሬት ላይ እምነትን በመገንባት ላይ ይገኛል።",
    funders_label: "ለፋይናንስ አቅራቢዎች",
    dl_label: "OmishGoን ያግኙ",
    dl_h2: "የኢትዮጵያን ግብርና የወደፊት ዕጣ ፈንታ ይቀላቀሉ",
    dl_p: "Android APK  ለ2G ኢንተርኔት የተመቻቸ፣ በPIN የሚሰራ መግቢያ፣ ያለ በይነመረብ (Offline) ይሰራል:: በሙከራ ጊዜ ነፃ ነው።",
    dl_btn_apk: "APK ያውርዱ",
    dl_apk_sub: "ቀጥታ የAPK ማውረጃ (v1.0.0 ሙከራ)",
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
    form_submit: "የተጠባባቂዎች ዝርዝሩን ይቀላቀሉ",
    form_success: "በተሳካ ሁኔታ ተመዝግበዋል! በቅርቡ እናገኝዎታለን።",
    footer_tagline:
      "የኢትዮጵያ ቀጥታ የአርሶ-አደር-ለገዢ ገበያ። ምንም ደላላ የለም። የተሻለ ዋጋ። እውነተኛ ለውጥ።",
    footer_product: "ምርት",
    footer_how: "አሠራር",
    footer_screens: "የመተግበሪያ ገጾች",
    footer_demo: "የመግቢያ ቪዲዮ",
    footer_download: "APK ያውርዱ",
    footer_pilot: "የሙከራ ትግበራ",
    footer_about: "ስለ ሙከራው",
    footer_join: "የተጠባባቂ ዝርዝሩን ይቀላቀሉ",
    footer_contact_link: "ያግኙን",
    footer_lang_title: "Language / ቋንቋ / Afaan",
    footer_copy: "© 2026 OmishGo. በኢትዮጵያ ተሰራ",
    footer_privacy: "የመገናኛ መረጃዎ ለሙከራ ትግበራው ማሳወቂያ ብቻ ያገለግላል። ለማንም አሳልፈን አንሰጥም።",
    public_loading: "ፕሮፋይል በማምጣት ላይ...",
    public_not_found: "ፕሮፋይል አልተገኘም",
    public_not_found_desc: "ይህ የህዝብ ፕሮፋይል የለም ወይም አይገኝም።",
    public_return_home: "ወደ OmishGo ዋና ገጽ ይመለሱ",
    public_farmer_role: "የተረጋገጠ አምራች አርሶ አደር",
    public_buyer_role: "የተረጋገጠ የጅምላ ገዢ",
    public_verified: "የተረጋገጠ",
    public_location_not_provided: "አድራሻ አልተሰጠም",
    public_member_since: "አባል የሆነው ከ",
    public_member_generic: "የOmishGo አባል",
    public_no_reviews: "ምንም ግምገማ የለም",
    public_stat_active_listings: "ያሉ ምርቶች",
    public_stat_completed_orders: "የተጠናቀቁ ትዕዛዞች",
    public_stat_delivered_orders: "የደረሱ ትዕዛዞች",
    public_stat_active_orders: "የነቁ ትዕዛዞች",
    public_stat_rating_reviews: "ደረጃ እና ግምገማ",
    public_stat_joined_year: "አባል የሆነበት",
    public_trust_note: "የተረጋገጠ የOmishGo ቀጥታ ገበያ ፕሮፋይል",
    public_get_app_btn: "የOmishGo መተግበሪያ ያውርዱ",
    public_error_title: "ፕሮፋይል ማምጣት አልተቻለም",
    public_error_desc: "ይህን ፕሮፋይል ሲያመጣ የኔትወርክ ስህተት አጋጥሟል። እባክዎ ግንኙነትዎን ያረጋግጡና እንደገና ይሞክሩ።"
  },
  or: {
    announcement_text: "Qonna Itoophiyaatiif kan qophaa'e / Gabaa naannoo irratti hundaa'e",
    announcement_link: "Akkamitti akka hojjetu ilaalaa ↗",
    nav_problem: "Rakkoo",
    nav_solution: "Akkaataa Itti Hojjatu",
    nav_demo: "Viidiyoo Jalqabaa",
    nav_screens: "Appii",
    nav_contact: "Nu Quunnamaa",
    nav_cta: "Appii Buufadhu",
    hero_badge: "Maqii, Itoophiyaa - Yaalii Banaa",
    hero_h1a: "Qonnaan Bultoota Itoophiyaaf",
    hero_h1b: "Humna Uumuu",
    hero_amharic: "ያለ ደላላ ፣ ቀጥታ ከአርሶ አደር ወደ ገዢ",
    hero_oromo: "Qonnaan bulaa irraa gara bitataatti, karaa salphaa",
    hero_sub:
      "Gabaa moobaayilaa daldaltoota giddu-galeessaa hambisu , qonnaan bultoonni oomisha isaanii maxxansu, bitattoonni hatattamaan argatu, gabaan kallattiin raawwatama.",
    hero_cta1: "APK Buufadhu",
    hero_cta2: "Tarree Eeggataa Yaaliitti Makami",
    hero_trust:
      "Waldaa Qonnaan Bultootaatiin Kan Mirkanaa'e • Yaalii Maqii 2026",
    problem_label: "Rakkoo",
    problem_h2:
      "Qonnaan bultoonni Itoophiyaa oomishni isaanii gabaa gahuun dura irra caalaa bu'aa isaanii ni dhabu",
    problem_sub:
      "Daldaltoonni al-idilee gatii fi raabsa to'atu , kunis qonnaan bultoota filannoo dhabsiisuudhaan miidhamaaf saaxila.",
    stat1_label: "gatii oomishaa daldaltoota giddu-galeessatiin fudhatama",
    stat2_label: "gatii gabaa dhumaa irraa qonnaan bulaa qaqqaba",
    /* B2: Oromo version of the text claim */
    stat3_claim:
      "Gabaa dijitaalaa kallattii jalqabaa Itoophiyaa kan qonnaan bultoota ijaarame",
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
    demo_label: "Daawwadhu",
    demo_h2: "OmishGo Beeksisuuf",
    demo_sub:
      "OmishGo'n maal akka hojjetu fi maaliif akka qonnaan bultoota fi bitattootaaf barbaachisu ibsa gabaabaa.",
    demo_caption:
      "Viidiyoon dhiyootti ni dhufa",
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
    screen_s6: "Profaayilii Oomishaa Mirkanaa'e",
    screen_s7: "Ergaa Kallattii Appii Keessatti",
    screen_s8: "Daashboordii Bitataa",
    screen_s9: "Ajajoota Koo, Adeemsa Ajajaa",
    pilot_h2: "Yaalii cufame Maqiitti, Q3 2026",
    pilot_p:
      "OmishGoon naannoo Maqiitti yaalii cufaa Waldaa Qonnaan Bultootaa naannichaa kan akka bulchitoota waltajjichaatti tajaajilan waliin ta'uun geggeessaa jira , waldaan tokkoon tokkoon fayyadamaa mirkaneessa, qulqullina to'ata, akkasumas osoo hin babal'isin dura lafarratti amantaa ijaaraa jira.",
    funders_label: "Qaamolee Maallaqa Dhiyeessanii fi Aksilareetarootaaf",
    dl_label: "OmishGo Argadhu",
    dl_h2: "Qonna Itoophiyaa gara fuulduraatti makamaa",
    dl_p: "Android APK , 2G'f mijataa, PIN'n kan seenamu, toora interneetiin alatti ni hojjeta. Yeroo yaaliitti bilisa.",
    dl_btn_apk: "APK Buufadhu",
    dl_apk_sub: "Buufata APK Kallattii (v1.0.0 Yaalii)",
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
    form_submit: "Tarreetti Makami",
    form_success: "Milkiin galmoofteetta! Dhiyootti si quunnamna.",
    footer_tagline:
      "Gabaa kallattii qonnaan-bulaa irraa bitataatti Itoophiyaa. Daldalaan giddu-galeessaa hin jiru. Gatii fooya'aa. Bu'aa dhugaa.",
    footer_product: "Oomisha",
    footer_how: "Akkaataa Itti Hojjatu",
    footer_screens: "Fuulota Appii",
    footer_demo: "Viidiyoo Jalqabaa",
    footer_download: "APK Buufadhu",
    footer_pilot: "Yaalii",
    footer_about: "Waa'ee Yaalichaa",
    footer_join: "Tarree Eaggataatti Makami",
    footer_contact_link: "Nu Quunnamaa",
    footer_lang_title: "Language / ቋንቋ / Afaan",
    footer_copy: "© 2026 OmishGo. Itoophiyaa keessatti ijaarame",
    footer_privacy:
      "Ragaan quunnamtii kee waa'ee piilootichaa beeksisuuf qofa fayyada. Eenyuufiyyuu dabarsee hin kennamu.",
    public_loading: "Profaayilii fidaa jira...",
    public_not_found: "Profaayiliin Hin Argamne",
    public_not_found_desc: "Profaayiliin kun hin jiru ykn hin argamu.",
    public_return_home: "Gara Fuula OmishGo'tti Deebi'i",
    public_farmer_role: "Qonnaan Bulaa Mirkanaa'e",
    public_buyer_role: "Bitataa Jumlaa Mirkanaa'e",
    public_verified: "Mirkanaa'e",
    public_location_not_provided: "Iddoon Hin Kennamne",
    public_member_since: "Miseensa erga",
    public_member_generic: "Miseensa OmishGo",
    public_no_reviews: "Ilaalchi hin kennamne",
    public_stat_active_listings: "Oomishaalee Maxxanfaman",
    public_stat_completed_orders: "Ajajoota Xumuraman",
    public_stat_delivered_orders: "Ajajoota Qaqqaban",
    public_stat_active_orders: "Ajajoota Hojjetaa Jiran",
    public_stat_rating_reviews: "Sadarkaa fi Ilaalcha",
    public_stat_joined_year: "Bara seene",
    public_trust_note: "Profaayilii Gabaa Kallattii OmishGo Mirkanaa'e",
    public_get_app_btn: "Appii OmishGo Buufadhu",
    public_error_title: "Profaayilii Fiduun Hin Danda'amne",
    public_error_desc: "Profaayilii kana fiduuf dogoggorri neetworkii uumameera. Maaloo neetworkii keessan mirkaneessaa deebitanii yaalaa."
  },
};

/* ══════════════════════════════════════════════════════════════
   2. LANGUAGE ENGINE
   ══════════════════════════════════════════════════════════════ */
let currentLang = localStorage.getItem("omishgo_lang") || "en";

function applyLanguage(lang) {
  if (lang === "om") lang = "or";
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem("omishgo_lang", lang);
  const d = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (d[k] !== undefined) el.textContent = d[k];
  });

  // Sync dropdown selector
  const langSelect = document.getElementById("languageSelect");
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }

  document.querySelectorAll(".lang-btn, .lang-footer-btn").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang") === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  document.documentElement.lang =
    lang === "am" ? "am" : lang === "or" ? "om" : "en";
  // Update carousel captions and telemetry
  if (typeof window.coverflowRender === "function") window.coverflowRender();
  // B2: update text-claim stat card
  const claimEl = document.querySelector(".stat-claim");
  if (claimEl && d.stat3_claim) claimEl.textContent = d.stat3_claim;
}

// Bind dropdown change
const langSelect = document.getElementById("languageSelect");
if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
  });
}

document
  .querySelectorAll(".lang-btn, .lang-footer-btn")
  .forEach((btn) =>
    btn.addEventListener("click", () =>
      applyLanguage(btn.getAttribute("data-lang")),
    ),
  );
applyLanguage(currentLang);

/* ══════════════════════════════════════════════════════════════
   3. NAV SCROLL
   ══════════════════════════════════════════════════════════════ */
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true },
);

/* ══════════════════════════════════════════════════════════════
   4. HAMBURGER
   ══════════════════════════════════════════════════════════════ */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
if (hamburger && navLinks) {
  function toggleMobileMenu(forceClose) {
    const isCurrentlyOpen = hamburger.classList.contains("open");
    const shouldOpen =
      forceClose === undefined ? !isCurrentlyOpen : !forceClose;
    hamburger.setAttribute("aria-expanded", String(shouldOpen));
    hamburger.classList.toggle("open", shouldOpen);
    navLinks.classList.toggle("open", shouldOpen);
    document.body.style.overflow = shouldOpen ? "hidden" : "";
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => toggleMobileMenu(true));
  });

  document.addEventListener("click", (e) => {
    if (
      hamburger.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMobileMenu(true);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburger.classList.contains("open")) {
      toggleMobileMenu(true);
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   5. REVEAL
   ══════════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -36px 0px" },
);
document
  .querySelectorAll("[data-reveal]")
  .forEach((el) => revealObs.observe(el));

/* ══════════════════════════════════════════════════════════════
   6. COUNTER ANIMATION (only for stat cards with data-count)
   ══════════════════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"), 10);
  if (target === 0) return;
  const dur = 1800;
  const start = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(easeOut(p) * target);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const statsGrid = document.querySelector(".insight-grid, .stats-grid");
if (statsGrid) {
  new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        statsGrid.querySelectorAll(".stat-number[data-count], .insight-stat-number[data-count]").forEach(animateCounter);
      }
    },
    { threshold: 0.4 },
  ).observe(statsGrid);
}


/* ══════════════════════════════════════════════════════════════
   6b. INTERACTIVE STEP FLOW & EXPERIENCE TABS
   ══════════════════════════════════════════════════════════════ */
const stepData = [
  {
    title: "Put your produce on the map.",
    text: "A clear listing helps the right buyers discover what is available. Snap a photo, set a price in Birr, and describe the harvest.",
    callout: "Listing ready",
    sub: "Available to verified buyers"
  },
  {
    title: "Let buyers find the right quantity.",
    text: "Buyers can choose the amount they need, from a few kuntaala to the available stock, and message you directly in the app.",
    callout: "Order received",
    sub: "Quantity and details are clear"
  },
  {
    title: "Keep everyone in the loop.",
    text: "The order status helps the farmer, buyer, and delivery team stay coordinated throughout the entire journey.",
    callout: "Delivery coordinated",
    sub: "Updates as order progresses"
  },
  {
    title: "Close the loop with confidence.",
    text: "Confirm receipt, complete payment according to the agreed process, and share verified feedback.",
    callout: "Delivery confirmed",
    sub: "Ready for review and payment"
  }
];

function initSteps() {
  const stepItems = document.querySelectorAll(".step-item");
  if (!stepItems.length) return;

  function setStep(index) {
    stepItems.forEach((item, i) => item.classList.toggle("active", i === index));
    const d = stepData[index];
    if (!d) return;

    const countEl = document.getElementById("stepCount");
    const titleEl = document.getElementById("previewTitle");
    const textEl = document.getElementById("previewText");
    const calloutB = document.querySelector("#previewCallout b");
    const calloutS = document.querySelector("#previewCallout small");
    const progEl = document.getElementById("previewProgress");
    const basket = document.querySelector(".produce-basket");

    if (countEl) countEl.textContent = index + 1;
    if (titleEl) titleEl.textContent = d.title;
    if (textEl) textEl.textContent = d.text;
    if (calloutB) calloutB.textContent = d.callout;
    if (calloutS) calloutS.textContent = d.sub;
    if (progEl) progEl.style.width = `${(index + 1) * 25}%`;
    if (basket) {
      basket.style.transform = index === 1
        ? "translateX(18px) scale(.95)"
        : index === 2
        ? "translate(35px,-4px) scale(.88)"
        : index === 3
        ? "translate(0,-4px) scale(.92)"
        : "translate(0,0) scale(1)";
    }
  }

  stepItems.forEach((item, i) => {
    item.addEventListener("click", () => setStep(i));
  });
}
initSteps();

const roleData = {
  farmer: {
    label: "01 — FARMER EXPERIENCE",
    title: "Your produce.<br>Your progress.",
    description: "A simple dashboard to post available harvests, track incoming orders, and follow your revenue transparently.",
    features: [
      "Add produce in familiar local units (Kuntaala)",
      "View live order status and delivery updates",
      "Direct messaging with verified wholesale buyers"
    ],
    pillTopTitle: "ETB 270,000 Revenue",
    pillTopSub: "Active Harvest Sales",
    pillBottomTitle: "Demand: Onion +15%",
    pillBottomSub: "Direct Wholesale Pricing",
    screenshot: "assets/Screenshot_20260731-195932_OmishGo.webp"
  },
  buyer: {
    label: "02 — BUYER EXPERIENCE",
    title: "Find produce.<br>Order with clarity.",
    description: "Discover available crops, choose the quantity you need, and follow your order through delivery.",
    features: [
      "Browse verified smallholder product listings",
      "Order by kuntaala or available stock",
      "Track delivery progress and confirm receipt"
    ],
    pillTopTitle: "ETB 45,900 Saved",
    pillTopSub: "Middleman Markups Eliminated",
    pillBottomTitle: "12 Verified Farmers",
    pillBottomSub: "Direct Smallholder Sourcing",
    screenshot: "assets/Screenshot_20260731-200050_OmishGo.webp"
  },
  union: {
    label: "03 — UNION EXPERIENCE",
    title: "One view of the<br>whole operation.",
    description: "A clearer operational view for authorized staff to verify participants, coordinate orders, and review activity.",
    features: [
      "Register and verify local participants",
      "Monitor orders and transport coordination",
      "Review operational activity and pilot results"
    ],
    pillTopTitle: "Ayano Kurfa · Verified",
    pillTopSub: "Meki Town, East Shewa",
    pillBottomTitle: "100% Verified Accounts",
    pillBottomSub: "Union Admin Oversight",
    screenshot: "assets/Screenshot_20260731-195953_OmishGo.webp"
  }
};

function initRoleTabs() {
  const tabs = document.querySelectorAll(".experience-tab");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
      });

      const role = tab.getAttribute("data-role");
      const d = roleData[role];
      if (!d) return;

      const lbl = document.getElementById("roleLabel");
      const ttl = document.getElementById("roleTitle");
      const desc = document.getElementById("roleDescription");
      const feat = document.getElementById("roleFeatures");
      const shot = document.getElementById("dashboardScreenshot");
      
      const pillTopTitle = document.getElementById("expPillTopTitle");
      const pillTopSub = document.getElementById("expPillTopSub");
      const pillBottomTitle = document.getElementById("expPillBottomTitle");
      const pillBottomSub = document.getElementById("expPillBottomSub");

      if (lbl) lbl.textContent = d.label;
      if (ttl) ttl.innerHTML = d.title;
      if (desc) desc.textContent = d.description;
      if (feat) feat.innerHTML = d.features.map(f => `<li><span>✓</span> ${f}</li>`).join("");
      
      if (pillTopTitle && d.pillTopTitle) pillTopTitle.textContent = d.pillTopTitle;
      if (pillTopSub && d.pillTopSub) pillTopSub.textContent = d.pillTopSub;
      if (pillBottomTitle && d.pillBottomTitle) pillBottomTitle.textContent = d.pillBottomTitle;
      if (pillBottomSub && d.pillBottomSub) pillBottomSub.textContent = d.pillBottomSub;
      
      if (shot && d.screenshot) {
        shot.style.opacity = "0.4";
        setTimeout(() => {
          shot.src = d.screenshot;
          shot.style.opacity = "1";
        }, 150);
      }
    });
  });
}
initRoleTabs();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════════════════════════
   7. PARTICLES
   ══════════════════════════════════════════════════════════════ */
(function spawnParticles() {
  const c = document.getElementById("particles-container");
  if (!c) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const s = Math.random() * 3 + 1;
    p.style.cssText = `left:${Math.random() * 100}%;bottom:${Math.random() * 15}%;width:${s}px;height:${s}px;background:${Math.random() > 0.5 ? "#f5c518" : "#4dbc8a"};animation-duration:${9 + Math.random() * 14}s;animation-delay:${Math.random() * 10}s`;
    c.appendChild(p);
  }
})();

/* ══════════════════════════════════════════════════════════════
   9. 3D COVERFLOW CINEMA ENGINE (INFINITE LOOP + AUTOPLAY)
   ══════════════════════════════════════════════════════════════ */
window.coverflowRender = null;

(function initCoverflowCinema() {
  const viewport = document.getElementById("coverflowViewport");
  const track = document.getElementById("coverflowTrack");
  const allCards = Array.from(document.querySelectorAll(".c-card"));
  const filterTabs = document.querySelectorAll(".dock-tab");
  const dockIndicator = document.getElementById("dockIndicator");
  const dotsStrip = document.getElementById("dotsStrip");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");

  const tBadge = document.getElementById("tBadge");
  const tTitle = document.getElementById("tTitle");
  const tSub = document.getElementById("tSub");
  const tCurrent = document.getElementById("tCurrent");
  const tTotal = document.getElementById("tTotal");

  if (!viewport || !track || !allCards.length) return;

  let visibleCards = [...allCards];
  let activeIndex = 4; // Start centered on Farmer Dashboard (index 4)
  const AUTO_INTERVAL = 3800; // 3.8 seconds interval
  let autoTimer = null;

  function updateDockIndicator(activeTab) {
    if (!activeTab || !dockIndicator) return;
    dockIndicator.style.width = activeTab.offsetWidth + "px";
    dockIndicator.style.transform = "translateX(" + (activeTab.offsetLeft - 5) + "px)";
  }

  function render3D() {
    const total = visibleCards.length;
    if (total === 0) return;
    // Circular modular wrapping
    activeIndex = ((activeIndex % total) + total) % total;

    const isMobile = window.innerWidth <= 768;
    const spacing = isMobile ? 150 : 210;
    const zStep = isMobile ? 85 : 120;
    const rotY = isMobile ? 24 : 30;

    visibleCards.forEach((card, i) => {
      // Circular shortest distance calculation
      let offset = i - activeIndex;
      while (offset > total / 2) offset -= total;
      while (offset < -total / 2) offset += total;
      const absOffset = Math.abs(offset);

      card.classList.toggle("is-active", offset === 0);

      if (offset === 0) {
        card.style.transform = "translateX(0px) translateZ(0px) rotateY(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.filter = "brightness(1)";
        card.style.zIndex = "20";
        card.style.pointerEvents = "auto";
      } else if (absOffset <= 4) {
        const dir = offset > 0 ? 1 : -1;
        const x = dir * (spacing + (absOffset - 1) * (isMobile ? 85 : 125));
        const z = -absOffset * zStep;
        const r = -dir * rotY;
        const scale = Math.max(0.72, 1 - absOffset * 0.08);
        const opacity = Math.max(0.3, 1 - absOffset * 0.2);
        const brightness = Math.max(0.45, 1 - absOffset * 0.16);

        card.style.transform = "translateX(" + x + "px) translateZ(" + z + "px) rotateY(" + r + "deg) scale(" + scale + ")";
        card.style.opacity = String(opacity);
        card.style.filter = "brightness(" + brightness + ")";
        card.style.zIndex = String(20 - absOffset);
        card.style.pointerEvents = "auto";
      } else {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.transform = "translateX(" + (offset > 0 ? 700 : -700) + "px) translateZ(-700px)";
      }
    });

    // Update Telemetry
    const cur = visibleCards[activeIndex];
    if (cur) {
      const role = cur.dataset.role;
      const key = cur.getAttribute("data-label-key");
      const d = (typeof translations !== "undefined" && translations[currentLang]) ? translations[currentLang] : {};
      
      if (tTitle) tTitle.textContent = (key && d[key]) ? d[key] : cur.dataset.title;
      if (tSub) tSub.textContent = cur.dataset.sub;
      if (tBadge) {
        tBadge.textContent = role;
        tBadge.className = "t-badge " + (role === "Onboarding" ? "badge-onboard" : role === "Farmer" ? "badge-farmer" : "badge-buyer");
      }
      if (tCurrent) tCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
      if (tTotal) tTotal.textContent = String(total).padStart(2, "0");
    }

    renderDots();
  }

  window.coverflowRender = render3D;

  function renderDots() {
    if (!dotsStrip) return;
    dotsStrip.innerHTML = "";
    visibleCards.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = "c-dot" + (idx === activeIndex ? " active" : "");
      dot.setAttribute("aria-label", "Screenshot " + (idx + 1));
      dot.addEventListener("click", () => {
        goTo(idx);
      });
      dotsStrip.appendChild(dot);
    });
  }

  function goTo(index) {
    const total = visibleCards.length;
    if (total === 0) return;
    activeIndex = ((index % total) + total) % total;
    render3D();
    resetAuto();
  }

  function nextSlide() {
    goTo(activeIndex + 1);
  }

  function prevSlide() {
    goTo(activeIndex - 1);
  }

  // Autoplay timer
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      nextSlide();
    }, AUTO_INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAuto() {
    startAuto();
  }

  function applyFilter(filter) {
    allCards.forEach(c => {
      const match = filter === "all" || c.dataset.group === filter;
      c.style.display = match ? "block" : "none";
    });
    visibleCards = allCards.filter(c => c.style.display !== "none");
    activeIndex = Math.floor(visibleCards.length / 2);
    render3D();
    resetAuto();
  }

  // Click card to center
  allCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = visibleCards.indexOf(card);
      if (idx !== -1 && idx !== activeIndex) {
        goTo(idx);
      }
    });
  });

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      updateDockIndicator(tab);
      applyFilter(tab.dataset.filter);
    });
  });

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      prevSlide();
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      nextSlide();
    });
  }

  // Pause on hover / touch
  viewport.addEventListener("mouseenter", stopAuto);
  viewport.addEventListener("mouseleave", startAuto);
  viewport.addEventListener("touchstart", stopAuto, { passive: true });
  viewport.addEventListener("touchend", startAuto, { passive: true });

  // Touch and Drag
  let startX = 0;
  let isDown = false;

  viewport.addEventListener("mousedown", e => {
    isDown = true;
    startX = e.clientX;
    stopAuto();
  });

  window.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      startAuto();
    }
  });

  viewport.addEventListener("mousemove", e => {
    if (!isDown) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 55) {
      if (diff > 0) prevSlide();
      else nextSlide();
      isDown = false;
    }
  });

  viewport.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) prevSlide();
      else nextSlide();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  // Init
  const initTab = document.querySelector(".dock-tab.active");
  updateDockIndicator(initTab);
  render3D();
  startAuto();

  window.addEventListener("resize", () => {
    const curTab = document.querySelector(".dock-tab.active");
    updateDockIndicator(curTab);
    render3D();
  });
})();

async function fetchAndRenderPublicProfile(customId) {
  const profileContainer = document.getElementById("public-profile-view");
  if (!profileContainer) return;

  // State 1: Calm Loading State
  profileContainer.innerHTML = `
    <div class="public-profile-container">
      <div class="profile-card profile-loading">
        <div class="profile-loading-text" data-i18n="public_loading">Loading profile details...</div>
      </div>
    </div>
  `;
  applyLanguage(currentLang);

  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v1/users/public/${encodeURIComponent(customId)}`);
    const data = await res.json();

    if (!res.ok || !data?.success || !data?.data?.user) {
      // State 2: Not Found (404)
      profileContainer.innerHTML = `
        <div class="public-profile-container">
          <div class="profile-card profile-not-found">
            <div class="not-found-icon"><svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="32" width="48" height="48" aria-hidden="true"><path d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z" stroke-miterlimit="10"/><path d="M338.29 338.29 448 448" stroke-linecap="round" stroke-miterlimit="10"/></svg></div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;" data-i18n="public_not_found">Profile Not Found</h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 15px;" data-i18n="public_not_found_desc">
              This public profile does not exist or is unavailable.
            </p>
            <a href="/" class="btn btn-primary" data-i18n="public_return_home">Return to OmishGo Home</a>
          </div>
        </div>
      `;
      applyLanguage(currentLang);
      return;
    }

    const user = data.data.user;
    updateProfileMetaTags(user);

    const isFarmer = user.role === "farmer";
    const roleI18n = isFarmer ? "public_farmer_role" : "public_buyer_role";
    const roleBgClass = isFarmer ? "role-farmer-bg" : "role-buyer-bg";

    const initials = getInitials(user.name);
    const avatarHtml = user.avatarUrl
      ? `<img src="${escapeHtml(user.avatarUrl)}" alt="${escapeHtml(user.name)}" class="profile-avatar-img" />`
      : `<div class="profile-initials-circle ${roleBgClass}">${initials}</div>`;

    // Generic "Verified" badge (NO institution names like Farmers' Union or Meki)
    const verifiedBadgeHtml = user.isVerified
      ? `<span class="verified-pill"><svg class="badge-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> <span data-i18n="public_verified">Verified</span></span>`
      : "";

    const locationStr = [user.location?.zone, user.location?.region].filter(Boolean).join(", ");
    const locationHtml = locationStr 
      ? `<span><svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="32" width="14" height="14" aria-hidden="true" style="vertical-align:middle;margin-right:4px;"><path d="M256 48c-79.5 0-144 61.5-144 144 0 128 144 272 144 272s144-144 144-272c0-82.5-64.5-144-144-144z"/><circle cx="256" cy="192" r="48"/></svg>${escapeHtml(locationStr)}</span>`
      : `<span><svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="32" width="14" height="14" aria-hidden="true" style="vertical-align:middle;margin-right:4px;"><path d="M256 48c-79.5 0-144 61.5-144 144 0 128 144 272 144 272s144-144 144-272c0-82.5-64.5-144-144-144z"/><circle cx="256" cy="192" r="48"/></svg><span data-i18n="public_location_not_provided">Location Not Provided</span></span>`;
    
    const joinedYear = user.createdAt ? new Date(user.createdAt).getFullYear() : "2026";
    const memberHtml = `<span><svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="32" width="14" height="14" aria-hidden="true" style="vertical-align:middle;margin-right:4px;"><rect width="416" height="384" x="48" y="80" rx="48"/><path stroke-linecap="round" d="M128 48v32M384 48v32"/><path d="M464 160H48"/></svg><span data-i18n="public_member_since">Member since</span> ${joinedYear}</span>`;

    // 4 Stats logic
    const stat1Val = isFarmer ? (user.activeListingsCount || 0) : (user.completedOrdersCount || 0); 
    const stat1LblI18n = isFarmer ? "public_stat_active_listings" : "public_stat_active_orders";
    
    const stat2Val = isFarmer ? (user.completedOrdersCount || 0) : (user.completedOrdersCount || 0);
    const stat2LblI18n = isFarmer ? "public_stat_delivered_orders" : "public_stat_completed_orders";

    let ratingValHtml = "";
    if (user.ratingCount > 0) {
      ratingValHtml = `<span class="stat-rating">${Number(user.averageRating).toFixed(1)} ★</span>`;
    } else {
      ratingValHtml = `<span class="stat-rating" data-i18n="public_no_reviews" style="font-size:14px; font-weight:600;">No reviews yet</span>`;
    }

    // State 3: Success State Rendering
    profileContainer.innerHTML = `
      <div class="public-profile-container">
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar-wrap">
              ${avatarHtml}
            </div>
            <div class="profile-identity">
              <div class="profile-name-row">
                <h1 class="profile-name">${escapeHtml(user.name)}</h1>
                ${verifiedBadgeHtml}
              </div>
              <div class="profile-role-title" data-i18n="${roleI18n}">Verified User</div>
              <div class="profile-meta-row">
                ${locationHtml}
                ${memberHtml}
              </div>
            </div>
          </div>

          <div class="profile-stats-grid">
            <div class="profile-stat-box">
              <div class="stat-num">${stat1Val}</div>
              <div class="stat-lbl" data-i18n="${stat1LblI18n}">Active Listings</div>
            </div>
            <div class="profile-stat-box">
              <div class="stat-num">${stat2Val}</div>
              <div class="stat-lbl" data-i18n="${stat2LblI18n}">Delivered Orders</div>
            </div>
            <div class="profile-stat-box">
              <div class="stat-num">${ratingValHtml}</div>
              <div class="stat-lbl" data-i18n="public_stat_rating_reviews">Rating & Reviews</div>
            </div>
            <div class="profile-stat-box">
              <div class="stat-num" style="color:var(--text-primary)">${joinedYear}</div>
              <div class="stat-lbl" data-i18n="public_stat_joined_year">Joined</div>
            </div>
          </div>

          <div class="profile-footer-cta">
            <p class="profile-trust-note"><span data-i18n="public_trust_note">Verified OmishGo Direct Marketplace Profile</span> • ID: ${escapeHtml(user.customId)}</p>
            <a href="https://github.com/BilisumaEresso/omishgo/releases/download/v1.0.0-pilot/application-cded515d-5673-4459-9c5c-f61b9df04a00.apk" class="btn btn-primary btn-lg btn-full profile-download-btn" download>
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
                <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zM5 20h14v-2H5v2z"/>
              </svg>
              <span data-i18n="public_get_app_btn">Get the OmishGo App</span>
            </a>
          </div>
        </div>
      </div>
    `;
    applyLanguage(currentLang);
  } catch (err) {
    console.error("Public profile fetch error:", err);
    profileContainer.innerHTML = `
      <div class="public-profile-container">
        <div class="profile-card profile-not-found">
          <div class="not-found-icon"><svg viewBox="0 0 512 512" fill="none" stroke="#FD5454" stroke-width="32" width="48" height="48" aria-hidden="true"><path d="M85.57 446.25h340.86a24 24 0 0020.73-36.09L276.73 68.61a24 24 0 00-41.46 0L64.84 410.16a24 24 0 0020.73 36.09z" stroke-linecap="round" stroke-linejoin="round"/><path d="M256 192v120M256 368h.01" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;" data-i18n="public_error_title">Unable to Load Profile</h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 15px;" data-i18n="public_error_desc">
            A network error occurred while loading this public profile. Please check your connection and try again.
          </p>
          <a href="/" class="btn btn-primary" data-i18n="public_return_home">Return to OmishGo Home</a>
        </div>
      </div>
    `;
    applyLanguage(currentLang);
  }
}

function handleRoute() {
  const path = window.location.pathname;
  const match = path.match(/^\/users?\/([A-Za-z0-9_-]+)/i);

  const mainLanding = document.getElementById("main-landing-content");
  const profileView = document.getElementById("public-profile-view");

  if (match && match[1]) {
    const customId = match[1];
    if (mainLanding) mainLanding.style.display = "none";
    if (profileView) {
      profileView.style.display = "block";
      fetchAndRenderPublicProfile(customId);
    }
    document.body.classList.add("profile-page");
    window.scrollTo(0, 0);
  } else {
    if (mainLanding) mainLanding.style.display = "block";
    if (profileView) profileView.style.display = "none";
    document.body.classList.remove("profile-page");
  }
}

document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link && document.body.classList.contains("profile-page")) {
    e.preventDefault();
    const hash = link.getAttribute("href");
    window.location.href = "/" + (hash === "#hero" ? "" : hash);
  }
});

document.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("popstate", handleRoute);
handleRoute();
