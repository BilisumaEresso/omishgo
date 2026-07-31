'use strict';

/* ══════════════════════════════════════════════════════════════
   1. TRANSLATIONS
   ══════════════════════════════════════════════════════════════ */
const translations = {
  en: {
    nav_problem:'Problem', nav_solution:'How It Works', nav_demo:'Demo',
    nav_screens:'App', nav_contact:'Contact', nav_cta:'Get the App',
    hero_badge:'🚀 Pilot Launching — Meki, Rift Valley',
    hero_h1a:'Empowering', hero_h1b:"Ethiopia's Farmers",
    hero_amharic:'ያለ ደላሎ ቀጥታ ከሻጭ ወደ ገዢ',
    hero_oromo:'Gabatee irraa bitaa-gurgurtaa karaa salphaa',
    hero_sub:"The mobile marketplace that cuts out middlemen — farmers post listings, buyers discover them instantly, deals happen in real time.",
    hero_cta1:'Download APK', hero_cta2:'Join the Pilot Waitlist',
    hero_trust:"Trusted by Farmers' Union • Meki Pilot 2026",
    problem_label:'The Problem',
    problem_h2:'Ethiopian farmers lose most of their earnings before reaching the market',
    problem_sub:'Informal traders control pricing, access, and distribution — leaving smallholder farmers with no leverage and no alternatives.',
    stat1_label:'of crop value lost to trader markups',
    stat2_label:'of final market price reaches the farmer',
    stat3_label:'direct digital channels existed before OmishGo',
    solution_label:'How It Works', solution_h2:'Three steps. Zero middlemen.',
    solution_sub:"OmishGo is built around the core loop that actually matters — getting a farmer's product in front of a buyer, fast.",
    step1_h:'Farmer Posts a Listing', step1_p:'Snap a photo, set a price in Birr, describe the product. Live in seconds — even on 2G.',
    step2_h:'Buyer Discovers & Messages', step2_p:'Buyers browse live listings, filter by crop type or location, and message the farmer directly in-app.',
    step3_h:'Deal Confirmed, Order Tracked', step3_p:"Order placed, stock updated, both parties notified. No paperwork. No phone tag with a middleman.",
    lang_note:'All three languages are first-class — not an afterthought.',
    demo_label:'See It Live', demo_h2:'A real listing placed in under 20 seconds',
    demo_sub:'Watch how a farmer in Meki posts a tomato listing and a buyer messages them — end to end, no training required.',
    demo_caption:'Demo coming soon — uploading to YouTube shortly',
    screens_label:'Built for the Ethiopian Market', screens_h2:'Every screen speaks your language',
    screens_sub:'9 real app screens. PIN-based login. Works offline. Three languages out of the box.',
    tab_all:'All Screens', tab_onboard:'Onboarding', tab_farmer:'Farmer', tab_buyer:'Buyer',
    screen_s1:'Sell Your Harvest Directly', screen_s2:'Browse Fresh from the Farm',
    screen_s3:'Farm Inputs at Your Door', screen_s4:'Track Every Delivery',
    screen_s5:'Farmer Dashboard — ETB 270,000 Revenue', screen_s6:'Verified Producer Profile',
    screen_s7:'Direct In-App Messaging', screen_s8:'Buyer Dashboard — ETB 45,900 Saved',
    screen_s9:'My Orders — Live Order Tracking',
    pilot_h2:'A structured pilot, not a prototype',
    pilot_p:"OmishGo is running a closed pilot in the Meki area with the local Farmers' Union acting as platform administrators — approving every user, ensuring quality, and building trust on the ground before we scale.",
    funders_label:'Target funders & accelerators',
    dl_label:'Get OmishGo', dl_h2:'Join the future of Ethiopian farming',
    dl_p:'Android APK — optimized for 2G, PIN-based login, works offline. Free during the pilot.',
    dl_btn_apk:'Download APK', dl_btn_waitlist:'Join Pilot Waitlist', dl_btn_waitlist_sub:'Farmers & Buyers',
    form_h:'Stay in the loop', form_p:"We'll notify you when the public pilot opens in your area.",
    form_name:'Full Name', form_phone:'Phone Number', form_role:'I am a…',
    form_role_placeholder:'Select your role', form_role_farmer:'Farmer (Qonnaan Bulaa / አርሶ አደር)',
    form_role_buyer:'Buyer / Trader', form_role_investor:'Investor / Funder', form_role_other:'Other',
    form_submit:'Join Waitlist →', form_success:"🎉 You're on the list! We'll be in touch soon.",
    footer_tagline:"Ethiopia's direct farm-to-buyer marketplace. No middlemen. Better prices. Real impact.",
    footer_product:'Product', footer_how:'How It Works', footer_screens:'App Screens',
    footer_demo:'Demo Video', footer_download:'Download APK', footer_pilot:'Pilot',
    footer_about:'About the Pilot', footer_join:'Join Waitlist', footer_contact_link:'Contact Us',
    footer_lang_title:'Language / ቋንቋ / Afaan',
    footer_copy:'© 2026 OmishGo. Built in Ethiopia 🇪🇹',
    footer_privacy:"Your contact info is only used to notify you about the pilot. We don't sell or share it.",
  },
  am: {
    nav_problem:'ችግሩ', nav_solution:'አሠራር', nav_demo:'ቪዲዮ',
    nav_screens:'መተግበሪያ', nav_contact:'ያግኙን', nav_cta:'አፕሊኬሽኑን ያውርዱ',
    hero_badge:'🚀 ሙከራ እያሄደ ነው — መኪ፣ ሸለቆ',
    hero_h1a:'ስልጣን እናሰጣቸዋለን', hero_h1b:'የኢትዮጵያ ገበሬዎች',
    hero_amharic:'ያለ ደላሎ ቀጥታ ከሻጭ ወደ ገዢ',
    hero_oromo:'Gabatee irraa bitaa-gurgurtaa karaa salphaa',
    hero_sub:'ገበሬዎች ምርቶቻቸውን ቀጥታ ለሻጮች ይሸጣሉ — ያለ ደላሎ፣ ዋጋ በትክክለኛ ዕምቅ ደረጃ።',
    hero_cta1:'APK ያውርዱ', hero_cta2:'ለሙከራ ይመዝገቡ',
    hero_trust:"የገበሬዎች ህብረት ታምኖበታል • የሜኪ ሙከራ 2026",
    problem_label:'ችግሩ',
    problem_h2:'የኢትዮጵያ ገበሬዎች ዋና ዋና ገቢያቸውን ወደ ገበያ ከመድረሳቸው በፊት ያጣሉ',
    problem_sub:'ደላሎ ዋጋ፣ ተደራሽነትና ስርጭት ይቆጣጠራሉ — ትናንሽ ገበሬዎችን ያለ አስተዳዳሪ ትልሚ ያስቀምጧቸዋል።',
    stat1_label:'የሰብል ዋጋ ለደላሎ ይሄዳል',
    stat2_label:'ብቻ ነው ወደ ገበሬ የሚደርሰው',
    stat3_label:'ቀጥታ ዲጂታል ቻናል አልነበረም',
    solution_label:'አሠራር', solution_h2:'ሦስት ደረጃዎች። ምንም ደላሎ የለም።',
    solution_sub:'OmishGo የሚሠራው ዋናውን ዑደት ዙሪያ ነው — የገበሬ ምርት ወዲያው ለሻጭ እንዲደርስ።',
    step1_h:'ገበሬ ምርቱን ያስተዋውቃል', step1_p:'ፎቶ ያንሱ፣ ዋጋ በብር ይምረጡ፣ ምርቱን ይግለጹ። ወዲያው ይሰተዋወቃል — 2G ላይ እንኳ።',
    step2_h:'ሻጭ ያገኛል እና ይልካል', step2_p:'ሻጮች ቀጥታ ዝርዝሮችን ያሻሽላሉ፣ ወዲያው ይልካሉ።',
    step3_h:'ስምምነት ተረጋገጠ፣ ትዕዛዝ ይከታተላል', step3_p:'ትዕዛዝ ተቀምጧል፣ ክምችት ተዘምኗል። ወረቀት አያስፈልግም።',
    lang_note:'ሦስቱ ቋንቋዎች በእኩል ደረጃ ናቸው — ቀዳሚ ናቸው።',
    demo_label:'ቀጥታ ይመልከቱ', demo_h2:'ምርት ዝርዝር ከ20 ሴኮንድ ባነሰ ጊዜ',
    demo_sub:'አንድ ገበሬ ቲማቲሙን እንዴት ያስተዋውቅ — ያለ ስልጠና።',
    demo_caption:'ቪዲዮ ቶሎ ይመጣል — ወደ YouTube እያወጣን ነው',
    screens_label:'ለኢትዮጵያ ገበያ ተሠርቷል', screens_h2:'እያንዳንዱ ማሳያ በቋንቋዎ ይናገራል',
    screens_sub:'9 እውነተኛ የመተግበሪያ ማሳያዎች። PIN ላይ ተደራሽ። ሦስት ቋንቋ።',
    tab_all:'ሁሉም', tab_onboard:'መግቢያ', tab_farmer:'ገበሬ', tab_buyer:'ሻጭ',
    screen_s1:'ምርቶን ቀጥታ ሸጡ', screen_s2:'ከእርሻ ቀጥታ ያስሱ',
    screen_s3:'ምርት ወደ እርስዎ ቤት', screen_s4:'ማዳረሻ ይከታተሉ',
    screen_s5:'የገበሬ ዳሽቦርድ', screen_s6:'ማረጋገጫ ፕሮፋይል',
    screen_s7:'ቀጥታ መልዕክት', screen_s8:'የሻጭ ዳሽቦርድ',
    screen_s9:'ትዕዛዞቼ',
    pilot_h2:'ሙከራ — ምርት አይደለም',
    pilot_p:'OmishGo በሜኪ አካባቢ ዝጉ ሙከራ እያደረገ ነው — የሜኪ ገበሬዎች ህብረት አስተዳዳሪ ሆኗል።',
    funders_label:'ዒላማ ፈንዶዎች',
    dl_label:'OmishGoን ያውርዱ', dl_h2:'የኢትዮጵያ ግብርና ወደፊት ይቀላቀሉ',
    dl_p:'Android APK — 2Gን ያስተዋውቃል፣ PIN ያስፈልጋል፣ ኦፍላይን ይሠራል። ሙከራ ወቅት ነፃ።',
    dl_btn_apk:'APK ያውርዱ', dl_btn_waitlist:'ለሙከራ ይቀላቀሉ', dl_btn_waitlist_sub:'ገበሬዎች እና ሻጮች',
    form_h:'ውስጥ ቆዩ', form_p:'ሙከራ ሲጀምር እናሳውቅዎታለን።',
    form_name:'ሙሉ ስም', form_phone:'ስልክ ቁጥር', form_role:'እኔ ነኝ…',
    form_role_placeholder:'ሚናዎን ይምረጡ', form_role_farmer:'ገበሬ (አርሶ አደር)',
    form_role_buyer:'ሻጭ / ነጋዴ', form_role_investor:'ባለሀብት', form_role_other:'ሌላ',
    form_submit:'ይቀላቀሉ →', form_success:'🎉 ዝርዝሩ ውስጥ ነዎት! ቶሎ እናሳውቅዎታለን።',
    footer_tagline:'የኢትዮጵያ ቀጥታ የእርሻ-ወደ-ሻጭ ገበያ። ምንም ደላሎ። የተሻለ ዋጋ። እውነተኛ ለውጥ።',
    footer_product:'ምርት', footer_how:'አሠራር', footer_screens:'ማሳያዎች',
    footer_demo:'ቪዲዮ', footer_download:'APK ያውርዱ', footer_pilot:'ሙከራ',
    footer_about:'ስለ ሙከራ', footer_join:'ይቀላቀሉ', footer_contact_link:'ያግኙን',
    footer_lang_title:'Language / ቋንቋ / Afaan',
    footer_copy:'© 2026 OmishGo. በኢትዮጵያ ተሠርቷል 🇪🇹',
    footer_privacy:'የእርስዎ ኮንታክት ለሙከራ ማሳወቂያ ብቻ ነው።',
  },
  or: {
    nav_problem:'Rakkoo', nav_solution:'Hojii Akkamii', nav_demo:'Fakkeenyaa',
    nav_screens:'App', nav_contact:'Quunnamtii', nav_cta:'App Buufadhu',
    hero_badge:'🚀 Yaaliif Jira — Maqii, Gama Horaa',
    hero_h1a:'Humnaa Kennina', hero_h1b:'Qonnaan Bultoota Itoophiyaa',
    hero_amharic:'ያለ ደላሎ ቀጥታ ከሻጭ ወደ ገዢ',
    hero_oromo:'Gabatee irraa bitaa-gurgurtaa karaa salphaa',
    hero_sub:'Gabatee moobaayilaa daldalaa gidduutti kutuu — qonnaan bulaatti omishaa maakeetii siif argisiisa.',
    hero_cta1:'APK Buufadhu', hero_cta2:'Yaaliif Galmaai',
    hero_trust:"Waldaa Qonnaan Bulaa Amanteef • Yaalii Maqii 2026",
    problem_label:'Rakkoo',
    problem_h2:'Qonnaan bultooti Itoophiyaa galii caaluutti dura dhabaniiru',
    problem_sub:'Daldaltooti gidduun gatii, argamuu, fi raabsuu to\'atu — qonnaan bultoota xiqqaa carraa malee dhiisu.',
    stat1_label:'gatii omishaa maddaatti darbaa jira',
    stat2_label:'gatii maakeetii qonnaan bulaatti gaha',
    stat3_label:'karaa dijitaalaa kallattii dura hin turre',
    solution_label:'Akkamitti Hojjeta', solution_h2:'Tarkaanfii sadi. Daldalaa gidduun hin jiru.',
    solution_sub:'OmishGo hojii waliigalaa ijoo kan dhugaa baatu irratti ijaarame.',
    step1_h:'Qonnaan Bulaan Omisha Galcha', step1_p:'Suuraa kaasi, gatii Birridhaan kaa\'i. Sekoondoota muraasaan jira.',
    step2_h:'Bitataan Argata fi Ergaa Erga', step2_p:'Bitataan tarreeffama kallattii ilaaluu, siif ergaa erguu.',
    step3_h:'Waliigaltee Mirkanaái, Ajajni Hordofama', step3_p:'Ajajni kaa\'ame, kuusni haaromse. Waraqaa hin barbaachisu.',
    lang_note:'Afaanota sadanuu app keessatti walqixa jiru.',
    demo_label:'Kallattii Ilaali', demo_h2:'Tarreeffamni sekoondii 20 jalatti galcha',
    demo_sub:'Qonnaan bulaan Maqii keessaa akkamitti maakeetii kaa\'u ilaali.',
    demo_caption:'Viidiyoon dhufa — gara YouTube\'itti olkaasaa jirra',
    screens_label:'Gabatee Itoophiyaaf Ijaarame', screens_h2:'Maasqalli kam iyyuu afaan keetiitti dubbata',
    screens_sub:'Maasqala app 9 dhugaa. PIN. Offlaayinitti hojjeta. Afaanota sadi.',
    tab_all:'Hunda', tab_onboard:'Seensuu', tab_farmer:'Qonnaan Bulaa', tab_buyer:'Bitataa',
    screen_s1:'Omisha Kee Kallattii Gurguuri', screen_s2:'Gabatee Irraa Sakkata\'i',
    screen_s3:'Kutaa Qonnaa Balbalaatti', screen_s4:'Geejjiba Hordofi',
    screen_s5:'Daashboordii Qonnaan Bulaa', screen_s6:'Profaayilii Mirkanaa\'aa',
    screen_s7:'Ergaa Kallattii', screen_s8:'Daashboordii Bitataa',
    screen_s9:'Ajajawwan Koo',
    pilot_h2:'Yaalii qindaa\'e — muuxannoo miti',
    pilot_p:'OmishGo Maqii naannoo keessatti yaalii cufame geggeessaa jira — Waldaan Qonnaan Bulaa fayyadamoota hundu mirkaneessiti.',
    funders_label:'Leenjistootaa fi Deggartoota Kaayyoo',
    dl_label:'OmishGo Argadhu', dl_h2:'Qonnaan bulummaa Itoophiyaa gara fuulduraatti makamaa',
    dl_p:'Android APK — 2Gf ta\'aa, PIN seensuu, offlaayinitti hojjeta. Yaalii yeroo hin kafalamu.',
    dl_btn_apk:'APK Buufadhu', dl_btn_waitlist:'Yaalii Galmaai', dl_btn_waitlist_sub:'Qonnaan Bultootaa fi Bitattoota',
    form_h:'Gara Keessaatti Turaa', form_p:'Yaaliin naannoo keetitti banaamu yoo ta\'e beeksifna.',
    form_name:'Maqaa Guutuu', form_phone:'Lakkofsa Bilbilaa', form_role:'Ani…',
    form_role_placeholder:'Gahee kee fili', form_role_farmer:'Qonnaan Bulaa',
    form_role_buyer:'Bitataa / Daldalaa', form_role_investor:'Maallaqqa galchaa', form_role_other:'Kan biraa',
    form_submit:'Galmaa\'i →', form_success:'🎉 Tarreeffama irra jirta! Dafnee si beeksifna.',
    footer_tagline:"Gabatee kallattii qonna–bitataa Itoophiyaa. Daldalaa gidduun hin jiru. Gatiin caala. Faaydaan dhugaa.",
    footer_product:'Oomisha', footer_how:'Akkamitti Hojjeta', footer_screens:'Maasqala App',
    footer_demo:'Viidiyoo', footer_download:'APK Buufadhu', footer_pilot:'Yaalii',
    footer_about:'Yaalii Irraa', footer_join:'Galmaai', footer_contact_link:'Nu Quunnamaa',
    footer_lang_title:'Language / ቋንቋ / Afaan',
    footer_copy:'© 2026 OmishGo. Itoophiyaa keessatti ijaarame 🇪🇹',
    footer_privacy:'Quunnamtiin kee yaalii irratti qofa fayyadama.',
  }
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
   6. COUNTER ANIMATION
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
   ══════════════════════════════════════════════════════════════ */
const YOUTUBE_ID = 'YOUR_YOUTUBE_VIDEO_ID';
const playBtn     = document.getElementById('play-btn');
const videoPlayer = document.getElementById('video-player');
const ytContainer = document.getElementById('yt-frame-container');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (YOUTUBE_ID === 'YOUR_YOUTUBE_VIDEO_ID') {
      const cap = videoPlayer.querySelector('.video-caption');
      if (cap) {
        cap.textContent = '⏳ Video uploading soon — join our Telegram for updates!';
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
    const cap = videoPlayer.querySelector('.video-caption');
    if (cap) cap.style.display = 'none';
  });
}

/* ══════════════════════════════════════════════════════════════
   9. CINEMATIC 3D SCREENSHOT CAROUSEL
   ══════════════════════════════════════════════════════════════ */
(function initCarousel() {
  const track     = document.getElementById('carousel-track');
  const stage     = document.getElementById('carousel-stage');
  const prevBtn   = document.getElementById('carousel-prev');
  const nextBtn   = document.getElementById('carousel-next');
  const dotsEl    = document.getElementById('carousel-dots');
  const tabBtns   = document.querySelectorAll('.screen-tab');
  if (!track || !stage) return;

  let allSlides = Array.from(track.querySelectorAll('.c-slide'));
  let visible   = [...allSlides]; // slides currently shown
  let current   = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let autoTimer  = null;

  // ── Build dots ─────────────────────────────────────────────
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

  // ── Apply 3D states ────────────────────────────────────────
  function applyStates() {
    const classes = ['is-active','is-left','is-right','is-far','is-hidden'];
    visible.forEach((slide, i) => {
      slide.classList.remove(...classes);
      const diff = i - current;
      if      (diff === 0)              slide.classList.add('is-active');
      else if (diff === -1)             slide.classList.add('is-left');
      else if (diff === 1)              slide.classList.add('is-right');
      else if (Math.abs(diff) <= 3)    slide.classList.add('is-far');
      else                              slide.classList.add('is-hidden');
    });
    // Update dots
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));

    // Scroll the active card into horizontal center
    const active = visible[current];
    if (!active) return;
    const stageRect = stage.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const center = stageRect.left + stageRect.width / 2;
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

  // ── Tab filter ─────────────────────────────────────────────
  function applyFilter(group) {
    // Show/hide slides
    allSlides.forEach(slide => {
      const g = slide.getAttribute('data-group');
      const show = group === 'all' || g === group;
      slide.style.display = show ? '' : 'none';
    });
    visible = allSlides.filter(s => s.style.display !== 'none');
    current = 0;
    // Reset track position
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    buildDots();
    // Allow layout to settle before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applyStates();
      });
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  // ── Prev / Next ────────────────────────────────────────────
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // ── Keyboard ───────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // ── Mouse drag ─────────────────────────────────────────────
  stage.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    track.style.transition = 'none';
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
    const base = parseFloat(track.style.transform?.match(/-?[\d.]+/)?.[0] || 0);
    track.style.transform = `translateX(${base + dragDeltaX - (dragDeltaX > 0 ? 0 : 0)}px)`;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if      (dragDeltaX < -50) goTo(current + 1);
    else if (dragDeltaX >  50) goTo(current - 1);
    else                        applyStates();
    dragDeltaX = 0;
  });

  // ── Touch swipe ────────────────────────────────────────────
  let touchX = 0;
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; track.style.transition = 'none'; }, { passive: true });
  stage.addEventListener('touchmove',  e => {
    const delta = e.touches[0].clientX - touchX;
    const base  = parseFloat(track.style.transform?.match(/-?[\d.]+/)?.[0] || 0);
    track.style.transform = `translateX(${base + delta * 0.4}px)`;
  }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if      (diff >  40) goTo(current + 1);
    else if (diff < -40) goTo(current - 1);
    else                  applyStates();
  }, { passive: true });

  // ── Click on non-active slide ──────────────────────────────
  allSlides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      const visIdx = visible.indexOf(slide);
      if (visIdx !== -1 && visIdx !== current) goTo(visIdx);
    });
  });

  // ── Auto-advance ───────────────────────────────────────────
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1 < visible.length ? current + 1 : 0), 4500);
  }

  // ── Init ───────────────────────────────────────────────────
  // Centre the track initially so first card appears centred
  const stageW = stage.offsetWidth;
  const trackChildren = Array.from(track.children);
  if (trackChildren.length) {
    // Add left padding = half stage width so first card is centred
    track.style.paddingLeft  = `${stageW / 2 - 110}px`;
    track.style.paddingRight = `${stageW / 2 - 110}px`;
  }

  applyFilter('all');
  buildDots();
  applyStates();
  resetAuto();

  // Pause auto on hover/focus
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
    submitBtn.textContent = '⏳ Sending…';
    try {
      const res = await fetch(form.action, { method:'POST', body:new FormData(form), headers:{ Accept:'application/json' } });
      if (res.ok) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.textContent = d.form_success;
      } else throw new Error();
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = d.form_submit;
      alert('Submission failed — please email hello@omishgo.et');
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   11. ACTIVE NAV SECTION HIGHLIGHT
   ══════════════════════════════════════════════════════════════ */
(function trackSections() {
  const sections = document.querySelectorAll('section[id],footer[id]');
  const links    = document.querySelectorAll('.nav-links a');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        links.forEach(a => { a.style.color = a.getAttribute('href') === `#${id}` ? '#fff' : ''; });
      }
    });
  }, { threshold: 0.4 }).observe(document.querySelector('#hero'));
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
