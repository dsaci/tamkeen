const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('c:/Users/Surface/Downloads/tamkeen (3)/public/educational');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const assets = {
  // 1. Optical Microscope (مجهر ضوئي)
  'microscope_optical.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
  <defs>
    <linearGradient id="optMetal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="50%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="lensGlass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="bodyBlue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <!-- Background Plate -->
  <rect x="10" y="10" width="380" height="460" rx="24" fill="#0f172a" fill-opacity="0.03" stroke="#e2e8f0" stroke-width="1.5"/>
  
  <!-- Base Horseshoe -->
  <path d="M 80,430 C 80,450 320,450 320,430 L 300,390 C 260,405 140,405 100,390 Z" fill="url(#optMetal)" stroke="#1e293b" stroke-width="3"/>
  <ellipse cx="200" cy="425" rx="90" ry="12" fill="#334155" opacity="0.4"/>
  
  <!-- Light Mirror / Illuminator -->
  <rect x="180" y="345" width="40" height="25" rx="6" fill="#64748b" stroke="#1e293b" stroke-width="2"/>
  <circle cx="200" cy="357" r="14" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  <!-- Light Ray -->
  <polygon points="192,345 208,345 215,260 185,260" fill="#fef08a" fill-opacity="0.35"/>

  <!-- Curved Arm (Pillar) -->
  <path d="M 120,390 C 70,300 70,180 170,130 L 190,145 C 105,190 105,285 145,390 Z" fill="url(#bodyBlue)" stroke="#0369a1" stroke-width="3"/>

  <!-- Stage (منضدة الفحص) -->
  <rect x="130" y="260" width="140" height="14" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
  <!-- Stage clips -->
  <path d="M 150,260 L 160,252 L 180,252" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <path d="M 250,260 L 240,252 L 220,252" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <!-- Glass Slide (شريحة زجاجية) -->
  <rect x="170" y="254" width="60" height="6" rx="2" fill="url(#lensGlass)" opacity="0.85"/>
  <circle cx="200" cy="257" r="3" fill="#ef4444"/>

  <!-- Revolving Nosepiece (قرص العدسات الشيئية) -->
  <ellipse cx="200" cy="205" rx="35" ry="10" fill="#475569" stroke="#1e293b" stroke-width="2"/>
  <!-- Objective Lenses -->
  <rect x="193" y="210" width="14" height="35" rx="3" fill="url(#optMetal)" stroke="#1e293b" stroke-width="2"/>
  <rect x="195" y="240" width="10" height="5" fill="#eab308"/>
  <rect x="168" y="210" width="12" height="26" rx="3" fill="url(#optMetal)" stroke="#1e293b" stroke-width="1.5" transform="rotate(22 174 210)"/>
  <rect x="220" y="210" width="12" height="26" rx="3" fill="url(#optMetal)" stroke="#1e293b" stroke-width="1.5" transform="rotate(-22 226 210)"/>

  <!-- Body Tube (أنبوب المجهر) -->
  <rect x="185" y="80" width="30" height="120" rx="6" fill="url(#bodyBlue)" stroke="#0369a1" stroke-width="2.5"/>
  
  <!-- Eyepiece (العدسة العينية) -->
  <rect x="180" y="45" width="40" height="35" rx="5" fill="url(#optMetal)" stroke="#1e293b" stroke-width="2"/>
  <rect x="187" y="32" width="26" height="15" rx="3" fill="#1e293b"/>
  <ellipse cx="200" cy="32" rx="13" ry="5" fill="url(#lensGlass)"/>

  <!-- Adjustment Knobs (الضابطان الكبير والصغير) -->
  <circle cx="125" cy="230" r="22" fill="url(#optMetal)" stroke="#1e293b" stroke-width="3"/>
  <circle cx="125" cy="230" r="12" fill="#0284c7" stroke="#1e293b" stroke-width="2"/>

  <!-- Labels in Arabic -->
  <text x="200" y="468" text-anchor="middle" font-family="Cairo, sans-serif" font-weight="900" font-size="16" fill="#0284c7">مجهر ضوئي مركب (Microscope Optique)</text>
</svg>`,

  // 2. Electron Microscope (مجهر إلكتروني)
  'microscope_electron.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 480" width="100%" height="100%">
  <defs>
    <linearGradient id="emTower" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="40%" stop-color="#64748b"/>
      <stop offset="70%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <!-- Background Box -->
  <rect x="10" y="10" width="400" height="460" rx="24" fill="#0f172a" fill-opacity="0.03" stroke="#cbd5e1" stroke-width="1.5"/>

  <!-- Desk / Workstation -->
  <rect x="30" y="320" width="360" height="110" rx="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <rect x="50" y="340" width="80" height="80" rx="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="50" y1="365" x2="130" y2="365" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="50" y1="395" x2="130" y2="395" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Computer Screen Displaying Nanoscale Image -->
  <rect x="55" y="215" width="115" height="95" rx="8" fill="url(#screenGrad)" stroke="#334155" stroke-width="3"/>
  <!-- Nanoscale cell on screen -->
  <ellipse cx="112" cy="260" rx="35" ry="25" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
  <circle cx="112" cy="260" r="10" fill="#10b981" fill-opacity="0.8"/>
  <circle cx="95" cy="250" r="4" fill="#34d399"/>
  <circle cx="128" cy="265" r="5" fill="#34d399"/>
  <!-- Screen Stand -->
  <rect x="105" y="310" width="15" height="15" fill="#64748b"/>
  <rect x="90" y="322" width="45" height="6" rx="3" fill="#475569"/>

  <!-- Main Vacuum Column (العمود المفرغ والمدافع الإلكترونية) -->
  <!-- Electron Gun Source Top -->
  <rect x="230" y="45" width="80" height="35" rx="8" fill="url(#emTower)" stroke="#0f172a" stroke-width="2"/>
  <circle cx="270" cy="40" r="14" fill="#6366f1" stroke="#4338ca" stroke-width="2"/>
  <text x="270" y="44" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">e⁻</text>

  <!-- Electromagnetic Lenses (عدسات كهرومغناطيسية) -->
  <rect x="240" y="85" width="60" height="40" fill="url(#emTower)" stroke="#0f172a" stroke-width="2"/>
  <rect x="220" y="125" width="100" height="25" rx="6" fill="#475569" stroke="#0f172a" stroke-width="2"/>
  <rect x="245" y="150" width="50" height="50" fill="url(#emTower)" stroke="#0f172a" stroke-width="2"/>
  
  <!-- Specimen Chamber (حجرة العينة) -->
  <rect x="210" y="200" width="120" height="45" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
  <circle cx="270" cy="222" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <line x1="250" y1="222" x2="290" y2="222" stroke="#22c55e" stroke-width="3"/>

  <!-- Lower Detector Column -->
  <rect x="240" y="245" width="60" height="75" fill="url(#emTower)" stroke="#0f172a" stroke-width="2"/>

  <!-- High-Energy Electron Beam (الحزمة الإلكترونية) -->
  <line x1="270" y1="55" x2="270" y2="220" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,3"/>
  <circle cx="270" cy="222" r="4" fill="#a855f7"/>

  <!-- Data cable to computer -->
  <path d="M 210,230 C 180,230 180,310 160,310" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>

  <!-- Title -->
  <text x="210" y="465" text-anchor="middle" font-family="Cairo, sans-serif" font-weight="900" font-size="16" fill="#6366f1">مجهر إلكتروني نافذ/ماسح (Microscope Électronique)</text>
</svg>`,

  // 3. Bunsen Burner (موقد بنزن)
  'bunsen_burner.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 460" width="100%" height="100%">
  <defs>
    <radialGradient id="flameOuter" cx="50%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f97316"/>
      <stop offset="80%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="flameInner" cx="50%" cy="85%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#67e8f9"/>
      <stop offset="80%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="metalTube" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
  </defs>
  <!-- Flame -->
  <!-- Outer Flame -->
  <path d="M 180,30 C 130,120 145,210 180,210 C 215,210 230,120 180,30 Z" fill="url(#flameOuter)" filter="drop-shadow(0 0 16px #f97316)"/>
  <!-- Inner Blue Flame (الأكثر حرارة) -->
  <path d="M 180,105 C 160,150 165,210 180,210 C 195,210 200,150 180,105 Z" fill="url(#flameInner)"/>

  <!-- Burner Chimney (ماسورة الاحتراق) -->
  <rect x="166" y="210" width="28" height="150" fill="url(#metalTube)" stroke="#1e293b" stroke-width="2"/>

  <!-- Air Collar & Hole (طوق فتحة الهواء) -->
  <rect x="160" y="325" width="40" height="25" rx="4" fill="#334155" stroke="#0f172a" stroke-width="2"/>
  <ellipse cx="180" cy="337" rx="8" ry="6" fill="#0f172a"/>

  <!-- Gas Inlet Tube (أنبوب توصيل الغاز) -->
  <path d="M 166,370 L 80,385 C 60,390 60,420 40,425" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>
  <path d="M 166,370 L 80,385 C 60,390 60,420 40,425" fill="none" stroke="#d97706" stroke-width="6" stroke-linecap="round"/>

  <!-- Heavy Cast Base (القاعدة الثقيلة) -->
  <path d="M 110,430 C 110,410 250,410 250,430 L 265,445 C 265,455 95,455 95,445 Z" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
  <rect x="172" y="360" width="16" height="55" fill="url(#metalTube)" stroke="#1e293b" stroke-width="1.5"/>

  <!-- Label -->
  <text x="180" y="475" text-anchor="middle" font-family="Cairo, sans-serif" font-weight="900" font-size="16" fill="#ea580c">موقد بنزن (Bec Bunsen)</text>
</svg>`,

  // 4. Plant Anatomy (نبتة كاملة بأجزائها)
  'plant_anatomy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 500" width="100%" height="100%">
  <defs>
    <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
    <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="flowerPetal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
  </defs>
  
  <!-- Soil Line (سطح التربة) -->
  <rect x="30" y="360" width="360" height="110" rx="14" fill="url(#soilGrad)"/>
  <line x1="20" y1="360" x2="400" y2="360" stroke="#a16207" stroke-width="4" stroke-dasharray="6,4"/>
  <text x="380" y="350" font-family="Cairo" font-size="12" font-weight="bold" fill="#78350f" text-anchor="end">سطح التربة</text>

  <!-- Roots (الجذور والأوبار الماصة) -->
  <path d="M 210,360 Q 210,410 205,460" stroke="#fde047" stroke-width="5" fill="none"/>
  <path d="M 208,380 Q 170,410 140,430" stroke="#fde047" stroke-width="3.5" fill="none"/>
  <path d="M 208,400 Q 240,420 270,440" stroke="#fde047" stroke-width="3" fill="none"/>
  <path d="M 170,410 Q 150,430 130,445" stroke="#fef08a" stroke-width="2" fill="none"/>
  <path d="M 240,420 Q 270,440 290,455" stroke="#fef08a" stroke-width="2" fill="none"/>
  <!-- Root hairs -->
  <g stroke="#fef08a" stroke-width="1.5">
    <line x1="140" y1="430" x2="125" y2="435"/><line x1="150" y1="420" x2="140" y2="410"/>
    <line x1="270" y1="440" x2="285" y2="445"/><line x1="205" y1="440" x2="190" y2="448"/>
  </g>

  <!-- Stem (الساق والأوعية الناقلة) -->
  <path d="M 210,360 Q 205,250 210,130" stroke="#22c55e" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M 210,360 Q 205,250 210,130" stroke="#15803d" stroke-width="2.5" fill="none"/>

  <!-- Leaves (الأوراق والعروق) -->
  <!-- Left Leaf 1 -->
  <path d="M 207,290 C 130,300 90,240 70,220 C 110,220 180,240 207,290 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="2"/>
  <path d="M 207,290 Q 140,260 70,220" stroke="#14532d" stroke-width="2" fill="none"/>
  <!-- Right Leaf 1 -->
  <path d="M 209,240 C 290,240 330,180 350,160 C 310,165 240,195 209,240 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="2"/>
  <path d="M 209,240 Q 280,200 350,160" stroke="#14532d" stroke-width="2" fill="none"/>
  <!-- Left Leaf 2 -->
  <path d="M 208,180 C 150,170 120,130 100,105 C 135,115 180,140 208,180 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="2"/>

  <!-- Flower (الزهرة) -->
  <g transform="translate(210, 110)">
    <!-- 5 Petals -->
    <ellipse cx="0" cy="-35" rx="16" ry="24" fill="url(#flowerPetal)" transform="rotate(0)"/>
    <ellipse cx="0" cy="-35" rx="16" ry="24" fill="url(#flowerPetal)" transform="rotate(72)"/>
    <ellipse cx="0" cy="-35" rx="16" ry="24" fill="url(#flowerPetal)" transform="rotate(144)"/>
    <ellipse cx="0" cy="-35" rx="16" ry="24" fill="url(#flowerPetal)" transform="rotate(216)"/>
    <ellipse cx="0" cy="-35" rx="16" ry="24" fill="url(#flowerPetal)" transform="rotate(288)"/>
    <!-- Flower Center -->
    <circle cx="0" cy="0" r="15" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  </g>

  <!-- Labels -->
  <g font-family="Cairo, sans-serif" font-weight="bold" font-size="12" fill="#1e293b">
    <text x="310" y="80">🌸 الزهرة (عضو التكاثر)</text>
    <text x="360" y="210">🍃 الورقة (التركيب الضوئي)</text>
    <text x="260" y="300">🎋 الساق (دعامة ونقل)</text>
    <text x="300" y="410" fill="#fef08a">🌱 المجموع الجذري (الامتصاص)</text>
  </g>
</svg>`,

  // 5. Food Groups & Pyramid (أغذية متنوعة)
  'food_groups.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440" width="100%" height="100%">
  <defs>
    <linearGradient id="pyr1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f87171"/><stop offset="100%" stop-color="#ef4444"/></linearGradient>
    <linearGradient id="pyr2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#f97316"/></linearGradient>
    <linearGradient id="pyr3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#22c55e"/></linearGradient>
    <linearGradient id="pyr4" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#facc15"/><stop offset="100%" stop-color="#eab308"/></linearGradient>
    <linearGradient id="pyr5" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient>
  </defs>
  <!-- Background Card -->
  <rect x="10" y="10" width="420" height="420" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>

  <!-- Pyramid Triangle Levels -->
  <!-- Top: Fats & Sweets (دهون وسكريات) -->
  <polygon points="220,40 185,110 255,110" fill="url(#pyr1)" stroke="#b91c1c" stroke-width="2"/>
  <text x="220" y="90" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="900" fill="#ffffff">🍬 سكريات ودهون</text>

  <!-- Level 2: Proteins & Dairy (لحوم، أسماك، حليب) -->
  <polygon points="185,110 145,185 295,185 255,110" fill="url(#pyr2)" stroke="#c2410c" stroke-width="2"/>
  <text x="220" y="155" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="900" fill="#ffffff">🥩 بروتينات (لحوم وألبان وبيضاء)</text>

  <!-- Level 3: Fruits & Vegetables (خضر وفواكه وفيتامينات) -->
  <polygon points="145,185 105,265 335,265 295,185" fill="url(#pyr3)" stroke="#15803d" stroke-width="2"/>
  <text x="220" y="232" text-anchor="middle" font-family="Cairo" font-size="13" font-weight="900" fill="#ffffff">🥦 فواكه وخضروات (فيتامينات وألياف)</text>

  <!-- Level 4: Carbohydrates & Cereals (نشويات وحبوب وخبز) -->
  <polygon points="105,265 65,345 375,345 335,265" fill="url(#pyr4)" stroke="#a16207" stroke-width="2"/>
  <text x="220" y="312" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#78350f">🍞 نشويات وحبوب وطاقة</text>

  <!-- Base: Water (الماء شريان الحياة) -->
  <polygon points="65,345 30,405 410,405 375,345" fill="url(#pyr5)" stroke="#1d4ed8" stroke-width="2"/>
  <text x="220" y="382" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#ffffff">💧 الماء والسوائل (1.5 - 2 لتر يومياً)</text>

  <text x="220" y="28" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0f172a">الهرم الغذائي المتوازن ومجموعات الأغذية</text>
</svg>`,

  // 6. Burnt Food / Carbonization Test (أغذية محترقة صماء للتفحم)
  'burnt_food.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 340" width="100%" height="100%">
  <defs>
    <radialGradient id="carbonGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="60%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="smoke" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <!-- Watch Glass / Capsule (زجاجة ساعة مخبرية) -->
  <ellipse cx="190" cy="240" rx="140" ry="45" fill="#f8fafc" stroke="#94a3b8" stroke-width="3" fill-opacity="0.6"/>
  <ellipse cx="190" cy="240" rx="125" ry="38" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>

  <!-- Smoke Rising (تصاعد الدخان) -->
  <path d="M 180,180 Q 160,130 190,90 Q 220,50 195,20" stroke="#94a3b8" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.45"/>
  <path d="M 210,190 Q 240,140 215,95 Q 190,60 210,25" stroke="#94a3b8" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4"/>

  <!-- Carbonized Bread / Food Chunk (قطعة خبز/سكر متفحمة كلياً) -->
  <path d="M 130,225 C 130,185 165,170 210,175 C 245,180 260,205 255,235 C 250,255 220,265 175,260 C 145,255 130,245 130,225 Z" fill="url(#carbonGrad)" stroke="#020617" stroke-width="2.5"/>
  
  <!-- Charred Cracks & Ash (تشققات التفحم والرماد) -->
  <path d="M 160,205 L 185,225 L 210,215 L 235,230" stroke="#f97316" stroke-width="2" fill="none"/>
  <circle cx="150" cy="235" r="2.5" fill="#ef4444"/>
  <circle cx="230" cy="210" r="2" fill="#ef4444"/>

  <!-- Ash specks -->
  <circle cx="120" cy="245" r="3" fill="#334155"/>
  <circle cx="260" cy="248" r="4" fill="#334155"/>
  <circle cx="275" cy="255" r="2" fill="#475569"/>

  <!-- Label in Arabic -->
  <text x="190" y="310" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#0f172a">تجربة تفحم الغذاء (دليل على احتوائه على عنصر الكربون C)</text>
</svg>`,

  // 7. Age Groups (أشخاص حسب الفئات العمرية)
  'age_groups.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="100%" height="100%">
  <!-- 5 Stages: Infant, Child, Teen, Adult, Senior -->
  <rect x="5" y="5" width="510" height="270" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>

  <!-- 1. Infant (رضيع) -->
  <g transform="translate(50, 150)">
    <circle cx="0" cy="-30" r="16" fill="#fbcfe8" stroke="#db2777" stroke-width="2"/>
    <ellipse cx="0" cy="10" rx="14" ry="20" fill="#f472b6"/>
    <path d="M -15,-30 Q 0,-42 15,-30" stroke="#be185d" stroke-width="2" fill="none"/>
    <text x="0" y="55" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#be185d">1. رضيع</text>
  </g>

  <!-- 2. Child (طفل) -->
  <g transform="translate(140, 110)">
    <circle cx="0" cy="-25" r="18" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
    <rect x="-14" y="-3" width="28" height="42" rx="6" fill="#fb923c"/>
    <line x1="-8" y1="39" x2="-8" y2="75" stroke="#ea580c" stroke-width="5" stroke-linecap="round"/>
    <line x1="8" y1="39" x2="8" y2="75" stroke="#ea580c" stroke-width="5" stroke-linecap="round"/>
    <text x="0" y="95" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#c2410c">2. طفل</text>
  </g>

  <!-- 3. Teenager (مراهق) -->
  <g transform="translate(240, 75)">
    <circle cx="0" cy="-24" r="20" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>
    <rect x="-16" y="0" width="32" height="60" rx="8" fill="#4ade80"/>
    <line x1="-10" y1="60" x2="-10" y2="110" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
    <line x1="10" y1="60" x2="10" y2="110" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="130" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#15803d">3. مراهق</text>
  </g>

  <!-- 4. Adult (بالغ - نشاط كامل) -->
  <g transform="translate(345, 60)">
    <circle cx="0" cy="-25" r="22" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <rect x="-20" y="0" width="40" height="70" rx="8" fill="#3b82f6"/>
    <line x1="-12" y1="70" x2="-12" y2="125" stroke="#1d4ed8" stroke-width="7" stroke-linecap="round"/>
    <line x1="12" y1="70" x2="12" y2="125" stroke="#1d4ed8" stroke-width="7" stroke-linecap="round"/>
    <text x="0" y="145" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#1d4ed8">4. كهل / بالغ</text>
  </g>

  <!-- 5. Senior (مسن / شيخوخة) -->
  <g transform="translate(450, 75)">
    <circle cx="0" cy="-23" r="21" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
    <!-- Walking stick -->
    <path d="M 25,-10 L 25,110" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <path d="M 15,-15 Q 25,-25 25,-10" stroke="#78350f" stroke-width="4" fill="none"/>
    <rect x="-16" y="0" width="32" height="60" rx="8" fill="#94a3b8"/>
    <line x1="-10" y1="60" x2="-10" y2="110" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
    <line x1="8" y1="60" x2="8" y2="110" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="130" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#475569">5. شيخ / مسن</text>
  </g>

  <text x="260" y="28" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0f172a">الفئات والمراحل العمرية للإنسان (حاجيات النمو والرواتب)</text>
</svg>`,

  // 8. Line Graph Chart Template (منحنى بياني مدرج)
  'graph_chart.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%">
  <!-- Background Grid -->
  <rect x="10" y="10" width="440" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Grid Lines -->
  <g stroke="#e2e8f0" stroke-width="1.5">
    <line x1="70" y1="70" x2="410" y2="70"/>
    <line x1="70" y1="120" x2="410" y2="120"/>
    <line x1="70" y1="170" x2="410" y2="170"/>
    <line x1="70" y1="220" x2="410" y2="220"/>
    <line x1="70" y1="270" x2="410" y2="270"/>

    <line x1="130" y1="40" x2="130" y2="290"/>
    <line x1="200" y1="40" x2="200" y2="290"/>
    <line x1="270" y1="40" x2="270" y2="290"/>
    <line x1="340" y1="40" x2="340" y2="290"/>
    <line x1="410" y1="40" x2="410" y2="290"/>
  </g>

  <!-- Axes -->
  <!-- Y Axis -->
  <line x1="70" y1="290" x2="70" y2="35" stroke="#0f172a" stroke-width="3"/>
  <polygon points="70,25 64,40 76,40" fill="#0f172a"/>
  <text x="60" y="30" font-family="Cairo" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">Y (الظاهرة / السرعة / التركيز)</text>

  <!-- X Axis -->
  <line x1="70" y1="290" x2="425" y2="290" stroke="#0f172a" stroke-width="3"/>
  <polygon points="435,290 420,284 420,296" fill="#0f172a"/>
  <text x="430" y="315" font-family="Cairo" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">X (الزمن t / درجة الحرارة)</text>

  <!-- Origin O -->
  <text x="55" y="305" font-family="Cairo" font-size="14" font-weight="bold" fill="#0f172a">O</text>

  <!-- Experimental Curve Example (منحنى بياني) -->
  <path d="M 70,270 Q 140,260 200,180 T 320,80 L 410,75" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
  <circle cx="70" cy="270" r="5" fill="#ef4444"/>
  <circle cx="200" cy="180" r="5" fill="#ef4444"/>
  <circle cx="320" cy="80" r="5" fill="#ef4444"/>
  <circle cx="410" cy="75" r="5" fill="#ef4444"/>

  <!-- Title -->
  <text x="240" y="340" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#2563eb">شبكة رسم المنحنيات البيانية العلمية</text>
</svg>`,

  // 9. Atom Structure & Particles (بنية الذرة والبروتونات والإلكترونات)
  'atom_structure.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="100%" height="100%">
  <defs>
    <radialGradient id="nucGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="60%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </radialGradient>
    <radialGradient id="elecGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </radialGradient>
  </defs>

  <!-- Electron Orbit 1 -->
  <ellipse cx="210" cy="210" rx="170" ry="60" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" transform="rotate(0 210 210)"/>
  <!-- Electron Orbit 2 -->
  <ellipse cx="210" cy="210" rx="170" ry="60" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" transform="rotate(60 210 210)"/>
  <!-- Electron Orbit 3 -->
  <ellipse cx="210" cy="210" rx="170" ry="60" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" transform="rotate(120 210 210)"/>

  <!-- Nucleus Glow & Clustered Protons/Neutrons (النواة المركزية) -->
  <circle cx="210" cy="210" r="38" fill="url(#nucGlow)" filter="drop-shadow(0 0 12px #f59e0b)"/>
  <!-- Protons p+ (Red/Orange) -->
  <circle cx="200" cy="200" r="11" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
  <text x="200" y="204" font-family="Arial" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">+</text>
  
  <circle cx="222" cy="218" r="11" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
  <text x="222" y="222" font-family="Arial" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">+</text>

  <!-- Neutrons n0 (Grey/Blue) -->
  <circle cx="220" cy="198" r="11" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
  <text x="220" y="202" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">n⁰</text>

  <circle cx="198" cy="220" r="11" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
  <text x="198" y="224" font-family="Arial" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">n⁰</text>

  <!-- Electrons e- on orbits -->
  <g>
    <circle cx="40" cy="210" r="9" fill="url(#elecGlow)" stroke="#0369a1" stroke-width="1.5"/>
    <text x="40" y="214" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">-</text>

    <circle cx="380" cy="210" r="9" fill="url(#elecGlow)" stroke="#0369a1" stroke-width="1.5"/>
    <text x="380" y="214" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">-</text>

    <circle cx="125" cy="65" r="9" fill="url(#elecGlow)" stroke="#0369a1" stroke-width="1.5"/>
    <text x="125" y="69" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">-</text>

    <circle cx="295" cy="355" r="9" fill="url(#elecGlow)" stroke="#0369a1" stroke-width="1.5"/>
    <text x="295" y="359" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">-</text>
  </g>

  <!-- Title & Legend -->
  <text x="210" y="405" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0284c7">نموذج الذرة: النواة (بروتونات + نيوترونات) والإلكترونات</text>
</svg>`,

  // 10. Water Molecule & Common Molecules (جزيء الماء وجزيئات شائعة)
  'water_molecule.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%">
  <defs>
    <radialGradient id="oxygenSphere" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fca5a5"/>
      <stop offset="60%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </radialGradient>
    <radialGradient id="hydrogenSphere" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </radialGradient>
    <radialGradient id="carbonSphere" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="70%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>
  </defs>

  <!-- Big Water Molecule H2O -->
  <!-- Bonds -->
  <line x1="160" y1="130" x2="90" y2="190" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
  <line x1="160" y1="130" x2="230" y2="190" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>

  <!-- Angle arc 104.5 -->
  <path d="M 125,160 A 45 45 0 0 1 195,160" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,3"/>
  <text x="160" y="180" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#d97706">104.5°</text>

  <!-- Oxygen Atom (O) Red -->
  <circle cx="160" cy="120" r="48" fill="url(#oxygenSphere)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.25))"/>
  <text x="160" y="128" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#ffffff">O</text>

  <!-- Hydrogen Atoms (H) White -->
  <circle cx="75" cy="205" r="30" fill="url(#hydrogenSphere)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"/>
  <text x="75" y="213" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#1e293b">H</text>

  <circle cx="245" cy="205" r="30" fill="url(#hydrogenSphere)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"/>
  <text x="245" y="213" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#1e293b">H</text>

  <!-- Molecule Label -->
  <text x="160" y="275" text-anchor="middle" font-family="Cairo" font-size="16" font-weight="900" fill="#0284c7">جزيء الماء (H₂O)</text>

  <!-- Common Molecules Quick Reference Box (Right Side) -->
  <g transform="translate(320, 40)">
    <rect x="0" y="0" width="130" height="260" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="65" y="24" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#334155">جزيئات كيميائية شائعة</text>
    
    <!-- CO2 -->
    <text x="15" y="65" font-family="Cairo" font-size="13" font-weight="bold" fill="#0f172a">CO₂</text>
    <circle cx="65" cy="60" r="10" fill="url(#carbonSphere)"/>
    <circle cx="45" cy="60" r="7" fill="url(#oxygenSphere)"/>
    <circle cx="85" cy="60" r="7" fill="url(#oxygenSphere)"/>
    <text x="15" y="80" font-family="Cairo" font-size="9" fill="#64748b">ثنائي أكسيد الكربون</text>

    <!-- O2 -->
    <text x="15" y="125" font-family="Cairo" font-size="13" font-weight="bold" fill="#0f172a">O₂</text>
    <circle cx="55" cy="120" r="9" fill="url(#oxygenSphere)"/>
    <circle cx="75" cy="120" r="9" fill="url(#oxygenSphere)"/>
    <text x="15" y="140" font-family="Cairo" font-size="9" fill="#64748b">غاز ثنائي الأكسجين</text>

    <!-- CH4 -->
    <text x="15" y="185" font-family="Cairo" font-size="13" font-weight="bold" fill="#0f172a">CH₄</text>
    <circle cx="65" cy="180" r="11" fill="url(#carbonSphere)"/>
    <circle cx="45" cy="180" r="5" fill="url(#hydrogenSphere)"/>
    <circle cx="85" cy="180" r="5" fill="url(#hydrogenSphere)"/>
    <text x="15" y="200" font-family="Cairo" font-size="9" fill="#64748b">غاز الميثان الطبيعي</text>

    <!-- NaCl -->
    <text x="15" y="235" font-family="Cairo" font-size="13" font-weight="bold" fill="#0f172a">NaCl</text>
    <circle cx="55" cy="230" r="9" fill="#f59e0b"/>
    <circle cx="77" cy="230" r="11" fill="#22c55e"/>
    <text x="15" y="250" font-family="Cairo" font-size="9" fill="#64748b">كلور الصوديوم (ملح)</text>
  </g>
</svg>`,

  // 11. Magnet & Iron Filings (المغناطيس وبرادة الحديد)
  'magnet_and_filings.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 380" width="100%" height="100%">
  <defs>
    <linearGradient id="poleNorth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f87171"/><stop offset="100%" stop-color="#dc2626"/></linearGradient>
    <linearGradient id="poleSouth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
  </defs>

  <!-- Magnetic Field Lines (خطوط الحقل المغناطيسي) -->
  <g stroke="#94a3b8" stroke-width="1.8" fill="none" stroke-dasharray="4,4" opacity="0.75">
    <path d="M 120,130 C 120,30 340,30 340,130"/>
    <path d="M 120,250 C 120,350 340,350 340,250"/>
    <path d="M 100,150 C 70,50 390,50 360,150"/>
    <path d="M 100,230 C 70,330 390,330 360,230"/>
    <!-- Direction arrows from N to S -->
    <polygon points="230,30 220,24 220,36" fill="#dc2626"/>
    <polygon points="230,350 240,344 240,356" fill="#2563eb"/>
  </g>

  <!-- Iron Filings Cluster Dots (برادة الحديد الكثيفة عند القطبين) -->
  <g fill="#334155" opacity="0.85">
    <circle cx="80" cy="180" r="1.5"/><circle cx="85" cy="170" r="2"/><circle cx="75" cy="190" r="2.5"/><circle cx="90" cy="195" r="1.5"/><circle cx="65" cy="185" r="2"/><circle cx="70" cy="175" r="1.5"/><circle cx="88" cy="165" r="2"/>
    <circle cx="370" cy="180" r="1.5"/><circle cx="375" cy="170" r="2"/><circle cx="385" cy="190" r="2.5"/><circle cx="365" cy="195" r="1.5"/><circle cx="390" cy="185" r="2"/><circle cx="380" cy="175" r="1.5"/><circle cx="368" cy="165" r="2"/>
  </g>

  <!-- Straight Bar Magnet (المغناطيس المستقيم) -->
  <!-- North Pole N (Red) -->
  <rect x="90" y="160" width="140" height="60" rx="4" fill="url(#poleNorth)" stroke="#991b1b" stroke-width="2.5"/>
  <text x="160" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#ffffff">N (شمالي)</text>

  <!-- South Pole S (Blue) -->
  <rect x="230" y="160" width="140" height="60" rx="4" fill="url(#poleSouth)" stroke="#1e40af" stroke-width="2.5"/>
  <text x="300" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#ffffff">S (جنوبي)</text>

  <!-- Title -->
  <text x="230" y="370" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0f172a">طيف الحقل المغناطيسي وبرادة الحديد (من القطب N إلى القطب S)</text>
</svg>`,

  // 12. Cathode Ray Oscilloscope (راسم الاهتزازات المهبطي)
  'cathode_ray_oscilloscope.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%">
  <!-- Chassis Body (هيكل الجهاز) -->
  <rect x="20" y="20" width="420" height="310" rx="20" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
  <rect x="35" y="35" width="390" height="280" rx="14" fill="#334155"/>

  <!-- Phosphor Screen with Coordinate Grid (الشاشة الفوسفورية وشبكة المربعات) -->
  <rect x="50" y="55" width="220" height="220" rx="10" fill="#022c22" stroke="#0f172a" stroke-width="3"/>
  
  <!-- Screen Grid Lines (تقسيمات الحساسية Sh و Sv) -->
  <g stroke="#065f46" stroke-width="1">
    <line x1="50" y1="92" x2="270" y2="92"/><line x1="50" y1="128" x2="270" y2="128"/><line x1="50" y1="165" x2="270" y2="165" stroke="#10b981" stroke-width="1.5"/><line x1="50" y1="202" x2="270" y2="202"/><line x1="50" y1="238" x2="270" y2="238"/>
    <line x1="87" y1="55" x2="87" y2="275"/><line x1="123" y1="55" x2="123" y2="275"/><line x1="160" y1="55" x2="160" y2="275" stroke="#10b981" stroke-width="1.5"/><line x1="197" y1="55" x2="197" y2="275"/><line x1="233" y1="55" x2="233" y2="275"/>
  </g>

  <!-- Glowing Sinusoidal Wave (المنحنى الجيبي المتناوب المتوهج) -->
  <path d="M 50,165 Q 77,80 105,165 T 160,165 T 215,165 T 270,165" fill="none" stroke="#34d399" stroke-width="3.5" filter="drop-shadow(0 0 6px #10b981)"/>

  <!-- Control Knobs & Buttons (أزرار المسح الزمني والحساسية الشاقولية) -->
  <g transform="translate(290, 60)">
    <!-- Volt/Div Knob (الحساسية الشاقولية Sv) -->
    <circle cx="55" cy="40" r="26" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <line x1="55" y1="40" x2="68" y2="22" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
    <text x="55" y="80" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#f8fafc">Sv (V/div)</text>

    <!-- Time/Div Knob (المسح الزمني Sh) -->
    <circle cx="55" cy="135" r="26" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <line x1="55" y1="135" x2="40" y2="118" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
    <text x="55" y="175" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#f8fafc">Sh (ms/div)</text>

    <!-- Input BNC Terminals (المدخلان) -->
    <circle cx="30" cy="205" r="10" fill="#0f172a" stroke="#ef4444" stroke-width="3"/>
    <circle cx="80" cy="205" r="10" fill="#0f172a" stroke="#3b82f6" stroke-width="3"/>
    <text x="55" y="230" text-anchor="middle" font-family="Cairo" font-size="10" font-weight="bold" fill="#94a3b8">CH1 | GND</text>
  </g>

  <!-- Title -->
  <text x="230" y="348" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#34d399">راسم الاهتزازات المهبطي (Oscilloscope Cathodique)</text>
</svg>`,

  // 13. Electric Circuit Elements (مكونات الدارة الكهربائية وأسلاكها)
  'electric_circuit_elements.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%">
  <!-- Box -->
  <rect x="10" y="10" width="440" height="340" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Row 1: Battery / Generator (+ -) -->
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="115" height="75" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
    <line x1="15" y1="38" x2="45" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="45" y1="20" x2="45" y2="56" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="60" y1="26" x2="60" y2="50" stroke="#0f172a" stroke-width="5"/>
    <line x1="60" y1="38" x2="100" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <text x="35" y="24" font-family="Arial" font-size="13" font-weight="bold" fill="#dc2626">+</text>
    <text x="70" y="24" font-family="Arial" font-size="14" font-weight="bold" fill="#2563eb">-</text>
    <text x="57" y="70" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">بطارية / عمود</text>
  </g>

  <!-- Row 1: Lamp / Bulb -->
  <g transform="translate(170, 40)">
    <rect x="0" y="0" width="115" height="75" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
    <line x1="15" y1="38" x2="40" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="58" cy="38" r="18" fill="none" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="45" y1="25" x2="71" y2="51" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="45" y1="51" x2="71" y2="25" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="76" y1="38" x2="100" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <text x="57" y="70" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">مصباح توهج (L)</text>
  </g>

  <!-- Row 1: Switch (قاطعة مفتوحة ومغلقة) -->
  <g transform="translate(305, 40)">
    <rect x="0" y="0" width="115" height="75" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
    <line x1="15" y1="38" x2="40" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="43" cy="38" r="3.5" fill="#0f172a"/>
    <circle cx="75" cy="38" r="3.5" fill="#0f172a"/>
    <line x1="43" y1="38" x2="72" y2="22" stroke="#dc2626" stroke-width="3"/>
    <line x1="78" y1="38" x2="100" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <text x="57" y="70" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">قاطعة مفتوحة (K)</text>
  </g>

  <!-- Row 2: Resistor (مقاومة أومية) -->
  <g transform="translate(40, 130)">
    <rect x="0" y="0" width="115" height="75" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
    <line x1="15" y1="38" x2="35" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="35" y="26" width="45" height="24" fill="#fef08a" stroke="#0f172a" stroke-width="2"/>
    <line x1="80" y1="38" x2="100" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <text x="57" y="70" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">مقاومة ناقل أومي (R)</text>
  </g>

  <!-- Row 2: Diode LED (صمام ثنائي ضوئي) -->
  <g transform="translate(170, 130)">
    <rect x="0" y="0" width="115" height="75" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
    <line x1="15" y1="38" x2="45" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <polygon points="45,26 45,50 68,38" fill="#16a34a" stroke="#0f172a" stroke-width="2"/>
    <line x1="68" y1="26" x2="68" y2="50" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="68" y1="38" x2="100" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <!-- LED Light rays -->
    <line x1="58" y1="22" x2="68" y2="12" stroke="#16a34a" stroke-width="2"/>
    <line x1="68" y1="26" x2="78" y2="16" stroke="#16a34a" stroke-width="2"/>
    <text x="57" y="70" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">صمام ثنائي (LED)</text>
  </g>

  <!-- Row 2: Electric Motor (محرك M) -->
  <g transform="translate(305, 130)">
    <rect x="0" y="0" width="115" height="75" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
    <line x1="15" y1="38" x2="40" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="58" cy="38" r="18" fill="none" stroke="#0f172a" stroke-width="2.5"/>
    <text x="58" y="44" text-anchor="middle" font-family="Arial" font-size="17" font-weight="bold" fill="#0f172a">M</text>
    <line x1="76" y1="38" x2="100" y2="38" stroke="#0f172a" stroke-width="2.5"/>
    <text x="57" y="70" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">محرك كهربائي (M)</text>
  </g>

  <!-- Row 3: Current Direction & Wires (جهة التيار والأسلاك) -->
  <g transform="translate(40, 220)">
    <rect x="0" y="0" width="380" height="85" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="190" y="24" text-anchor="middle" font-family="Cairo" font-size="13" font-weight="900" fill="#1d4ed8">اتجاه التيار الكهربائي: الاصطلاحي من (+) إلى (-) وخروج الإلكترونات بالعكس</text>
    
    <!-- Wire Diagram with Arrow -->
    <path d="M 30,55 L 350,55" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
    <polygon points="200,48 220,55 200,62" fill="#ef4444"/>
    <text x="230" y="50" font-family="Cairo" font-size="11" font-weight="bold" fill="#b91c1c">التيار الاصطلاحي I ➔</text>
    <text x="120" y="75" font-family="Cairo" font-size="11" font-weight="bold" fill="#2563eb">🡸 حركة الإلكترونات e⁻</text>
  </g>

  <text x="230" y="338" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0f172a">رموز الدارة الكهربائية النظامية وفق المنهاج الوزاري</text>
</svg>`,

  // 14. States of Matter (حالات وتحولات المادة)
  'states_of_matter.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 340" width="100%" height="100%">
  <!-- Box -->
  <rect x="10" y="10" width="460" height="320" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

  <!-- 1. Solid (الحالة الصلبة) -->
  <g transform="translate(40, 110)">
    <rect x="0" y="0" width="90" height="90" rx="12" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
    <!-- Compact lattice particles -->
    <g fill="#0284c7">
      <circle cx="20" cy="20" r="7"/><circle cx="45" cy="20" r="7"/><circle cx="70" cy="20" r="7"/>
      <circle cx="20" cy="45" r="7"/><circle cx="45" cy="45" r="7"/><circle cx="70" cy="45" r="7"/>
      <circle cx="20" cy="70" r="7"/><circle cx="45" cy="70" r="7"/><circle cx="70" cy="70" r="7"/>
    </g>
    <text x="45" y="115" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#0369a1">صلب (Solide)</text>
    <text x="45" y="130" text-anchor="middle" font-family="Cairo" font-size="10" fill="#64748b">حجم وشكل ثابتان</text>
  </g>

  <!-- 2. Liquid (الحالة السائلة) -->
  <g transform="translate(195, 110)">
    <rect x="0" y="0" width="90" height="90" rx="12" fill="#f8fafc" stroke="#16a34a" stroke-width="2"/>
    <!-- Looser particles -->
    <g fill="#16a34a">
      <circle cx="25" cy="30" r="7"/><circle cx="65" cy="25" r="7"/>
      <circle cx="40" cy="50" r="7"/><circle cx="75" cy="65" r="7"/>
      <circle cx="20" cy="75" r="7"/><circle cx="50" cy="80" r="7"/>
    </g>
    <text x="45" y="115" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#15803d">سائل (Liquide)</text>
    <text x="45" y="130" text-anchor="middle" font-family="Cairo" font-size="10" fill="#64748b">يأخذ شكل الإناء</text>
  </g>

  <!-- 3. Gas (الحالة الغازية) -->
  <g transform="translate(350, 110)">
    <rect x="0" y="0" width="90" height="90" rx="12" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Free moving particles with arrows -->
    <g fill="#dc2626">
      <circle cx="20" cy="25" r="7"/>
      <circle cx="70" cy="40" r="7"/>
      <circle cx="35" cy="75" r="7"/>
    </g>
    <text x="45" y="115" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#b91c1c">غازي (Gaz)</text>
    <text x="45" y="130" text-anchor="middle" font-family="Cairo" font-size="10" fill="#64748b">قابل للانضغاط والانتشار</text>
  </g>

  <!-- Transition Arrows (التحولات الفيزيائية) -->
  <!-- Solid to Liquid: Melting (انصهار) -->
  <path d="M 135,135 L 190,135" stroke="#ea580c" stroke-width="3" marker-end="url(#arrow)"/>
  <polygon points="190,135 182,130 182,140" fill="#ea580c"/>
  <text x="162" y="128" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#c2410c">انصهار</text>

  <!-- Liquid to Solid: Freezing (تجمد) -->
  <path d="M 190,170 L 135,170" stroke="#0284c7" stroke-width="3"/>
  <polygon points="135,170 143,165 143,175" fill="#0284c7"/>
  <text x="162" y="186" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#0284c7">تجمد</text>

  <!-- Liquid to Gas: Vaporization (تبخر) -->
  <path d="M 290,135 L 345,135" stroke="#ea580c" stroke-width="3"/>
  <polygon points="345,135 337,130 337,140" fill="#ea580c"/>
  <text x="317" y="128" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#c2410c">تبخر</text>

  <!-- Gas to Liquid: Condensation (تكاثف) -->
  <path d="M 345,170 L 290,170" stroke="#0284c7" stroke-width="3"/>
  <polygon points="290,170 298,165 298,175" fill="#0284c7"/>
  <text x="317" y="186" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="bold" fill="#0284c7">تكاثف</text>

  <!-- Title -->
  <text x="240" y="45" text-anchor="middle" font-family="Cairo" font-size="17" font-weight="900" fill="#0f172a">حالات المادة الثلاث وتحولاتها الفيزيائية مع تغير درجة الحرارة</text>
</svg>`,

  // 15. Numidian Royal Monuments (رموز الدولة النوميدية الجزائرية القديمة)
  'numidian_monuments.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%">
  <defs>
    <linearGradient id="sandStone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="coinBronze" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <!-- Card Base -->
  <rect x="10" y="10" width="440" height="340" rx="20" fill="#fdfbf7" stroke="#e2d9cc" stroke-width="2"/>

  <!-- 1. Medracen Royal Mausoleum (ضريح إيمدغاسن النوميدي بباتنة) -->
  <g transform="translate(40, 50)">
    <!-- Circular Stepped Base -->
    <ellipse cx="90" cy="140" rx="80" ry="18" fill="#a16207"/>
    <!-- Cylindrical colonnade drum -->
    <path d="M 20,135 L 20,70 Q 90,85 160,70 L 160,135 Q 90,150 20,135 Z" fill="url(#sandStone)" stroke="#78350f" stroke-width="2"/>
    <!-- Columns detail -->
    <g stroke="#854d0e" stroke-width="2">
      <line x1="40" y1="74" x2="40" y2="137"/><line x1="65" y1="78" x2="65" y2="141"/>
      <line x1="90" y1="80" x2="90" y2="142"/><line x1="115" y1="78" x2="115" y2="141"/><line x1="140" y1="74" x2="140" y2="137"/>
    </g>
    <!-- Truncated cone roof (المخروط المدرج) -->
    <path d="M 30,70 Q 90,82 150,70 L 120,25 Q 90,32 60,25 Z" fill="#ca8a04" stroke="#78350f" stroke-width="2"/>
    <ellipse cx="90" cy="25" rx="30" ry="7" fill="#eab308" stroke="#78350f"/>
    <text x="90" y="175" text-anchor="middle" font-family="Cairo" font-size="13" font-weight="900" fill="#78350f">ضريح إيمدغاسن الملكي (باتنة)</text>
    <text x="90" y="190" text-anchor="middle" font-family="Cairo" font-size="10" fill="#a16207">القرن 3 قبل الميلاد</text>
  </g>

  <!-- 2. Numidian Coin of King Masinissa (قطعة نقدية نوميدية - الملك ماسينيسا) -->
  <g transform="translate(260, 45)">
    <circle cx="80" cy="80" r="65" fill="url(#coinBronze)" stroke="#78350f" stroke-width="3" filter="drop-shadow(0 6px 12px rgba(120,53,15,0.3))"/>
    <circle cx="80" cy="80" r="58" fill="none" stroke="#78350f" stroke-width="1.5" stroke-dasharray="4,3"/>
    
    <!-- King Masinissa Profile Silhouette with Laurel Crown -->
    <path d="M 65,50 Q 80,42 95,50 Q 110,65 95,85 Q 90,95 80,105 Q 70,115 60,110 L 60,95 Q 65,85 70,75 Z" fill="#78350f"/>
    <!-- Beard and Crown -->
    <path d="M 80,95 Q 70,118 60,120 Q 55,100 65,95 Z" fill="#78350f"/>
    <!-- Numidian Libyco-Berber Inscription (خط التيفيناغ النوميدي) -->
    <text x="80" y="135" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#78350f">ⵎⵙⵏⵙⵏ (ماسينيسا)</text>

    <text x="80" y="180" text-anchor="middle" font-family="Cairo" font-size="13" font-weight="900" fill="#78350f">عملة الملك ماسينيسا النوميدي</text>
    <text x="80" y="195" text-anchor="middle" font-family="Cairo" font-size="10" fill="#a16207">مملكة نوميديا الموحدة (202 ق.م)</text>
  </g>

  <!-- Historic Quote / Core Information Banner -->
  <rect x="30" y="240" width="400" height="70" rx="12" fill="#fef3c7" stroke="#fde047" stroke-width="1.5"/>
  <text x="230" y="265" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#92400e">«إفريقيا للأفارقة» — مقولة الملك النوميدي ماسينيسا العظيم</text>
  <text x="230" y="290" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#b45309">عاصمة نوميديا: سيرتا (قسنطينة) • أبرز الملوك: ماسينيسا، سيفاقس، يوغرطة</text>
</svg>`,

  // 16. Algeria Relief / Topography Map (خريطة تضاريس الجزائر)
  'algeria_relief_map.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 480" width="100%" height="100%">
  <!-- Sea Background -->
  <rect x="0" y="0" width="460" height="480" fill="#f0fdfa"/>
  
  <!-- Mediterranean Sea -->
  <path d="M 0,0 L 460,0 L 460,70 Q 230,90 0,65 Z" fill="#0284c7" opacity="0.15"/>
  <text x="230" y="40" text-anchor="middle" font-family="Cairo" font-size="13" font-weight="bold" fill="#0369a1">البحر الأبيض المتوسط</text>

  <!-- Algeria Relief Zones -->
  <!-- 1. Tell Atlas (سلسلة الأطلس التلي الخضراء) -->
  <path d="M 50,70 Q 150,90 280,85 Q 380,80 430,75 L 420,115 Q 260,125 50,105 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
  <text x="230" y="100" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="900" fill="#ffffff">الأطلس التلي (الساحل والسهول)</text>

  <!-- 2. High Plateaus (الهضاب العليا والشطوط) -->
  <path d="M 50,105 Q 260,125 420,115 L 400,165 Q 240,175 40,150 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="230" y="140" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="900" fill="#854d0e">الهضاب العليا والشطوط (الشط الغربي والشرقي)</text>

  <!-- 3. Saharan Atlas (سلسلة الأطلس الصحراوي) -->
  <path d="M 40,150 Q 240,175 400,165 L 380,200 Q 220,210 35,185 Z" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
  <text x="230" y="185" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="900" fill="#ffffff">الأطلس الصحراوي (جبال الأوراس والعمور والقصور)</text>

  <!-- 4. The Grand Sahara (الصحراء الكبرى، العرق الشرقي والغربي) -->
  <path d="M 35,185 Q 220,210 380,200 L 360,370 Q 200,450 60,360 Z" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/>
  <text x="210" y="270" text-anchor="middle" font-family="Cairo" font-size="16" font-weight="900" fill="#b45309">الصحراء الجزائرية الكبرى (84% من المساحة)</text>
  <text x="130" y="235" font-family="Cairo" font-size="11" fill="#78350f">العرق الغربي الكبير</text>
  <text x="290" y="235" font-family="Cairo" font-size="11" fill="#78350f">العرق الشرقي الكبير</text>

  <!-- 5. Hoggar & Tassili (الهقار وطاسيلي - قمة تاهات أتاكور) -->
  <polygon points="240,370 290,430 330,380" fill="#92400e" stroke="#78350f" stroke-width="2"/>
  <text x="285" y="405" text-anchor="middle" font-family="Cairo" font-size="11" font-weight="900" fill="#ffffff">كتلة الهقار</text>
  <text x="285" y="420" text-anchor="middle" font-family="Cairo" font-size="9" fill="#fde047">قمة تاهات 2918م</text>

  <!-- Compass Rose -->
  <g transform="translate(390, 80)">
    <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
    <polygon points="0,-14 4,0 0,4 -4,0" fill="#ef4444"/>
    <text x="0" y="-17" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#ef4444">N</text>
  </g>

  <!-- Title -->
  <text x="230" y="468" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0f172a">خريطة الوحدات التضاريسية الكبرى للجمهورية الجزائرية</text>
</svg>`,

  // 17. Algeria Vegetation & Climate Map (خريطة الغطاء النباتي والمناخ)
  'algeria_vegetation_map.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 480" width="100%" height="100%">
  <!-- Background -->
  <rect x="0" y="0" width="460" height="480" fill="#ffffff"/>

  <!-- Zone 1: Mediterranean Forest (غابات البحر الأبيض المتوسط: فلين، صنوبر، أرز) -->
  <path d="M 40,60 Q 230,80 430,65 L 415,115 Q 230,125 45,100 Z" fill="#15803d" stroke="#166534" stroke-width="2"/>
  <text x="230" y="90" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="900" fill="#ffffff">إقليم البحر المتوسط (غابات البلوط والصنوبر والأرز والأحراش)</text>

  <!-- Zone 2: Steppe Alpha Grass (نطاق السهوب والحلفاء والشيح) -->
  <path d="M 45,100 Q 230,125 415,115 L 390,180 Q 230,195 40,165 Z" fill="#a3e635" stroke="#65a30d" stroke-width="2"/>
  <text x="230" y="145" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="900" fill="#365314">الإقليم شبه الجاف والسهوب (نبات الحلفاء والشيح والدرين)</text>

  <!-- Zone 3: Oasis & Desert Shrubs (الإقليم الصحراوي والنخيل) -->
  <path d="M 40,165 Q 230,195 390,180 L 360,420 Q 200,450 70,390 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  <text x="230" y="270" text-anchor="middle" font-family="Cairo" font-size="16" font-weight="900" fill="#854d0e">الإقليم الصحراوي القاحل (نباتات شوكية وواحات النخيل)</text>

  <!-- Palm Tree Icons for Oases -->
  <g fill="#15803d" transform="translate(180, 220)">
    <text font-size="22">🌴</text>
  </g>
  <g fill="#15803d" transform="translate(260, 240)">
    <text font-size="22">🌴</text>
  </g>
  <g fill="#15803d" transform="translate(140, 310)">
    <text font-size="22">🌴</text>
  </g>

  <!-- Title -->
  <text x="230" y="465" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#15803d">خريطة الأقاليم المناخية والغطاء النباتي في الجزائر</text>
</svg>`,

  // 18. Algeria Oil & Gas Hydrocarbons (خريطة حقول البترول والغاز)
  'algeria_oil_gas_map.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 480" width="100%" height="100%">
  <!-- Base Background -->
  <rect x="0" y="0" width="460" height="480" fill="#fdfcf9"/>

  <!-- Northern Refineries Ports (أرزيو وسكيكدة وبجاية) -->
  <path d="M 40,65 Q 230,85 430,70 L 420,105 Q 230,115 45,95 Z" fill="#e2e8f0" stroke="#94a3b8"/>
  <circle cx="110" cy="78" r="6" fill="#0284c7"/><text x="110" y="70" font-family="Cairo" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="middle">ميناء أرزيو</text>
  <circle cx="210" cy="85" r="6" fill="#0284c7"/><text x="210" y="75" font-family="Cairo" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="middle">بجاية</text>
  <circle cx="340" cy="80" r="6" fill="#0284c7"/><text x="340" y="70" font-family="Cairo" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="middle">سكيكدة</text>

  <!-- Desert Hydrocarbon Basin -->
  <path d="M 45,95 Q 230,115 420,105 L 380,410 Q 200,450 60,370 Z" fill="#fef9c3" stroke="#eab308" stroke-width="1.5"/>

  <!-- Hassi Messaoud Oil Rig (حاسي مسعود - بترول) -->
  <g transform="translate(290, 200)">
    <rect x="-10" y="-10" width="95" height="45" rx="6" fill="#0f172a"/>
    <circle cx="5" cy="12" r="7" fill="#ef4444"/>
    <text x="18" y="16" font-family="Cairo" font-size="12" font-weight="bold" fill="#ffffff">حاسي مسعود (بترول)</text>
    <text x="18" y="29" font-family="Cairo" font-size="9" fill="#f87171">أكبر حقل نفط جزائري</text>
  </g>

  <!-- Hassi R'Mel Gas Field (حاسي الرمل - غاز طبيعي) -->
  <g transform="translate(160, 160)">
    <rect x="-10" y="-10" width="105" height="45" rx="6" fill="#0f172a"/>
    <circle cx="5" cy="12" r="7" fill="#38bdf8"/>
    <text x="18" y="16" font-family="Cairo" font-size="12" font-weight="bold" fill="#ffffff">حاسي الرمل (غاز طبيعي)</text>
    <text x="18" y="29" font-family="Cairo" font-size="9" fill="#38bdf8">الرابع عالمياً في الغاز</text>
  </g>

  <!-- In Amenas (عين أميناس) -->
  <g transform="translate(320, 280)">
    <circle cx="0" cy="0" r="7" fill="#38bdf8"/>
    <text x="12" y="4" font-family="Cairo" font-size="11" font-weight="bold" fill="#0f172a">عين أميناس (غاز)</text>
  </g>

  <!-- Pipelines (أنابيب النقل للموانئ) -->
  <path d="M 295,200 L 210,85" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,3"/>
  <path d="M 165,160 L 110,78" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,3"/>
  <path d="M 165,160 L 340,80" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,3"/>

  <!-- Legend -->
  <g transform="translate(30, 420)">
    <circle cx="10" cy="10" r="5" fill="#ef4444"/><text x="25" y="14" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">حقول البترول</text>
    <circle cx="130" cy="10" r="5" fill="#0284c7"/><text x="145" y="14" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">حقول الغاز الطبيعي</text>
    <line x1="260" y1="10" x2="290" y2="10" stroke="#0f172a" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="295" y="14" font-family="Cairo" font-size="11" font-weight="bold" fill="#334155">أنابيب النقل (Pipelines)</text>
  </g>

  <!-- Title -->
  <text x="230" y="468" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0f172a">خريطة الثروات البترولية والغازية في الجزائر وطرق نقلها</text>
</svg>`,

  // 19. Algeria Water Resources & Dams (الموارد المائية والسدود بالجزائر)
  'algeria_water_resources_map.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 480" width="100%" height="100%">
  <!-- Base -->
  <rect x="0" y="0" width="460" height="480" fill="#f0f9ff"/>

  <!-- Northern Watersheds & Major Dams -->
  <path d="M 40,65 Q 230,85 430,70 L 415,160 Q 230,175 45,145 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
  <text x="230" y="90" text-anchor="middle" font-family="Cairo" font-size="13" font-weight="900" fill="#0369a1">النطاق التلي: شبكة الأودية والسدود الكبرى (بني هارون، كدية أسردون)</text>

  <!-- Famous Dams markers -->
  <g transform="translate(340, 115)">
    <rect x="-8" y="-8" width="85" height="26" rx="6" fill="#0369a1"/>
    <text x="35" y="9" text-anchor="middle" font-family="Cairo" font-size="10" font-weight="bold" fill="#ffffff">سد بني هارون (ميلة)</text>
  </g>
  <g transform="translate(200, 125)">
    <rect x="-8" y="-8" width="95" height="26" rx="6" fill="#0369a1"/>
    <text x="40" y="9" text-anchor="middle" font-family="Cairo" font-size="10" font-weight="bold" fill="#ffffff">سد كدية أسردون (البويرة)</text>
  </g>
  <g transform="translate(80, 110)">
    <rect x="-8" y="-8" width="85" height="26" rx="6" fill="#0369a1"/>
    <text x="35" y="9" text-anchor="middle" font-family="Cairo" font-size="10" font-weight="bold" fill="#ffffff">سد الشلف والقرقار</text>
  </g>

  <!-- Saharan Continental Intercalaire (طبقة المياه الجوفية الألبيانية العظمى) -->
  <path d="M 45,145 Q 230,175 415,160 L 375,410 Q 200,450 60,370 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
  <text x="230" y="240" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0284c7">حوض المياه الجوفية الألبيانية الكبرى</text>
  <text x="230" y="265" text-anchor="middle" font-family="Cairo" font-size="12" font-weight="bold" fill="#0369a1">(Albienne - أضخم مخزون مياه عذبة باطنية بالعالم)</text>

  <!-- Southern Artesian Wells (الآبار الارتوازية ومحطات الضخ) -->
  <g transform="translate(180, 310)">
    <circle cx="0" cy="0" r="10" fill="#0284c7"/>
    <text x="15" y="5" font-family="Cairo" font-size="12" font-weight="bold" fill="#0f172a">بئر ارتوازية / عين صالح</text>
  </g>
  <g transform="translate(280, 340)">
    <circle cx="0" cy="0" r="10" fill="#0284c7"/>
    <text x="15" y="5" font-family="Cairo" font-size="12" font-weight="bold" fill="#0f172a">الواحات والمياه الباطنية</text>
  </g>

  <!-- Title -->
  <text x="230" y="468" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0369a1">خريطة الموارد المائية، السدود الشمالية، والمياه الجوفية العميقة</text>
</svg>`,

  // 20. Mathematical Protractor (منقلة هندسية مدرجة 180°)
  'math_protractor.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 250" width="100%" height="100%">
  <!-- Transparent Glass Protractor 0-180 -->
  <defs>
    <linearGradient id="protGlass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.2"/>
    </linearGradient>
  </defs>

  <!-- Semi-circle Body -->
  <path d="M 30,210 A 190 190 0 0 1 410,210 Z" fill="url(#protGlass)" stroke="#0284c7" stroke-width="2.5"/>
  <path d="M 120,210 A 100 100 0 0 1 320,210 Z" fill="#ffffff" fill-opacity="0.8" stroke="#0284c7" stroke-width="1.5"/>

  <!-- Center Crosshair Marker (مركز المنقلة) -->
  <line x1="220" y1="200" x2="220" y2="220" stroke="#ef4444" stroke-width="2"/>
  <line x1="210" y1="210" x2="230" y2="210" stroke="#ef4444" stroke-width="2"/>
  <circle cx="220" cy="210" r="4" fill="none" stroke="#ef4444" stroke-width="2"/>

  <!-- Ticks & Degree Labels: 0, 30, 45, 60, 90, 120, 135, 150, 180 -->
  <g stroke="#0f172a" stroke-width="1.5">
    <!-- 90 Deg Center line -->
    <line x1="220" y1="20" x2="220" y2="50" stroke="#ef4444" stroke-width="2.5"/>
    <text x="220" y="65" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#ef4444">90°</text>

    <!-- 0 / 180 -->
    <line x1="30" y1="210" x2="60" y2="210"/>
    <text x="75" y="205" font-family="Arial" font-size="11" font-weight="bold">180° / 0°</text>
    
    <line x1="410" y1="210" x2="380" y2="210"/>
    <text x="365" y="205" text-anchor="end" font-family="Arial" font-size="11" font-weight="bold">0° / 180°</text>

    <!-- 45 Deg -->
    <line x1="85" y1="75" x2="105" y2="95"/>
    <text x="115" y="110" font-family="Arial" font-size="10" font-weight="bold">135° / 45°</text>

    <!-- 135 Deg -->
    <line x1="355" y1="75" x2="335" y2="95"/>
    <text x="325" y="110" text-anchor="end" font-family="Arial" font-size="10" font-weight="bold">45° / 135°</text>
  </g>

  <!-- Title -->
  <text x="220" y="240" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#0284c7">منقلة هندسية مدرجة (Rapporteur 180°)</text>
</svg>`,

  // 21. Mathematical Set Square (كوس هندسي مدرج 90°)
  'math_set_square.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 380" width="100%" height="100%">
  <defs>
    <linearGradient id="squareGlass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#fde047" stop-opacity="0.2"/>
    </linearGradient>
  </defs>

  <!-- Right Triangle Body (مثلث قائم متساوي الساقين) -->
  <polygon points="40,340 340,340 40,40" fill="url(#squareGlass)" stroke="#ca8a04" stroke-width="3"/>
  <!-- Inner Cutout -->
  <polygon points="80,310 260,310 80,130" fill="#ffffff" fill-opacity="0.8" stroke="#ca8a04" stroke-width="1.5"/>

  <!-- Right Angle Symbol 90° -->
  <rect x="40" y="315" width="25" height="25" fill="none" stroke="#ef4444" stroke-width="2"/>
  <circle cx="52" cy="327" r="2.5" fill="#ef4444"/>

  <!-- Centimeter Ticks Along Vertical and Horizontal -->
  <g stroke="#0f172a" stroke-width="1.5">
    <!-- Bottom edge cm ticks -->
    <line x1="40" y1="340" x2="40" y2="325"/><line x1="70" y1="340" x2="70" y2="330"/><line x1="100" y1="340" x2="100" y2="325"/>
    <line x1="130" y1="340" x2="130" y2="330"/><line x1="160" y1="340" x2="160" y2="325"/><line x1="190" y1="340" x2="190" y2="330"/>
    <line x1="220" y1="340" x2="220" y2="325"/><line x1="250" y1="340" x2="250" y2="330"/><line x1="280" y1="340" x2="280" y2="325"/>
    <!-- Vertical edge cm ticks -->
    <line x1="40" y1="310" x2="55" y2="310"/><line x1="40" y1="280" x2="50" y2="280"/><line x1="40" y1="250" x2="55" y2="250"/>
    <line x1="40" y1="220" x2="50" y2="220"/><line x1="40" y1="190" x2="55" y2="190"/><line x1="40" y1="160" x2="50" y2="160"/>
    <line x1="40" y1="130" x2="55" y2="130"/><line x1="40" y1="100" x2="50" y2="100"/><line x1="40" y1="70" x2="55" y2="70"/>
  </g>

  <!-- Title -->
  <text x="170" y="220" font-family="Cairo" font-size="14" font-weight="900" fill="#a16207" transform="rotate(45 170 220)">كوس هندسي قائم (Équerre 90°)</text>
</svg>`,

  // 22. Primary School Boy and Girl (تلميذ وتلميذة بالزي المدرسي والمئزر)
  'primary_school_kids.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%">
  <!-- Card -->
  <rect x="10" y="10" width="440" height="340" rx="22" fill="#fdfcf8" stroke="#fde68a" stroke-width="2"/>

  <!-- 1. Schoolboy with Blouse (تلميذ بالزي المدرسي الأزرق والمحفظة) -->
  <g transform="translate(130, 80)">
    <!-- Face -->
    <circle cx="0" cy="0" r="26" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
    <!-- Hair -->
    <path d="M -26,-5 C -26,-30 26,-30 26,-5 C 20,-20 -20,-20 -26,-5 Z" fill="#451a03"/>
    <!-- Smile & Eyes -->
    <circle cx="-8" cy="-3" r="3" fill="#0f172a"/><circle cx="8" cy="-3" r="3" fill="#0f172a"/>
    <path d="M -8,10 Q 0,18 8,10" stroke="#0f172a" stroke-width="2" fill="none"/>

    <!-- Blue School Blouse (مئزر مدرسي أزرق رسمي) -->
    <path d="M -26,26 L -35,110 L 35,110 L 26,26 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
    <!-- White collar -->
    <polygon points="-16,26 0,42 16,26" fill="#ffffff"/>
    <circle cx="0" cy="55" r="3" fill="#ffffff"/><circle cx="0" cy="75" r="3" fill="#ffffff"/><circle cx="0" cy="95" r="3" fill="#ffffff"/>

    <!-- Schoolbag on Back -->
    <rect x="-42" y="45" width="12" height="45" rx="3" fill="#f97316"/>

    <!-- Legs & Shoes -->
    <line x1="-14" y1="110" x2="-14" y2="155" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
    <line x1="14" y1="110" x2="14" y2="155" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="-16" cy="158" rx="10" ry="5" fill="#475569"/>
    <ellipse cx="16" cy="158" rx="10" ry="5" fill="#475569"/>

    <text x="0" y="185" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#0369a1">تلميذ (مئزر أزرق)</text>
  </g>

  <!-- 2. Schoolgirl with Pink/White Blouse (تلميذة بالمئزر الوردي) -->
  <g transform="translate(320, 80)">
    <!-- Face -->
    <circle cx="0" cy="0" r="26" fill="#fed7aa" stroke="#db2777" stroke-width="2"/>
    <!-- Hair with Pigtails & Bows -->
    <path d="M -26,-5 C -26,-30 26,-30 26,-5 C 20,-20 -20,-20 -26,-5 Z" fill="#78350f"/>
    <!-- Pigtails -->
    <circle cx="-28" cy="10" r="10" fill="#78350f"/>
    <circle cx="28" cy="10" r="10" fill="#78350f"/>
    <circle cx="-25" cy="5" r="5" fill="#f43f5e"/><circle cx="25" cy="5" r="5" fill="#f43f5e"/>

    <!-- Smile & Eyes -->
    <circle cx="-8" cy="-3" r="3" fill="#0f172a"/><circle cx="8" cy="-3" r="3" fill="#0f172a"/>
    <path d="M -8,10 Q 0,18 8,10" stroke="#0f172a" stroke-width="2" fill="none"/>

    <!-- Pink School Blouse (مئزر وردي) -->
    <path d="M -26,26 L -35,110 L 35,110 L 26,26 Z" fill="#ec4899" stroke="#be185d" stroke-width="2"/>
    <!-- White collar -->
    <polygon points="-16,26 0,42 16,26" fill="#ffffff"/>
    <circle cx="0" cy="55" r="3" fill="#ffffff"/><circle cx="0" cy="75" r="3" fill="#ffffff"/><circle cx="0" cy="95" r="3" fill="#ffffff"/>

    <!-- Schoolbag -->
    <rect x="30" y="45" width="12" height="45" rx="3" fill="#a855f7"/>

    <!-- Legs & Shoes -->
    <line x1="-14" y1="110" x2="-14" y2="155" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
    <line x1="14" y1="110" x2="14" y2="155" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="-16" cy="158" rx="10" ry="5" fill="#be185d"/>
    <ellipse cx="16" cy="158" rx="10" ry="5" fill="#be185d"/>

    <text x="0" y="185" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#be185d">تلميذة (مئزر وردي)</text>
  </g>

  <!-- Title -->
  <text x="230" y="320" text-anchor="middle" font-family="Cairo" font-size="16" font-weight="900" fill="#0f172a">تلاميذ الطور الابتدائي والمآزر المدرسية الرسمية</text>
</svg>`,

  // 23. Primary School Book & Bag (كتاب ومحفظة وأدوات مدرسية)
  'primary_book_bag.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 340" width="100%" height="100%">
  <!-- Box -->
  <rect x="10" y="10" width="420" height="320" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

  <!-- Schoolbag (محفظة مدرسية) -->
  <g transform="translate(60, 60)">
    <!-- Backpack Body -->
    <rect x="0" y="20" width="140" height="170" rx="22" fill="#6366f1" stroke="#4338ca" stroke-width="3"/>
    <!-- Top Handle -->
    <path d="M 45,20 C 45,-5 95,-5 95,20" fill="none" stroke="#312e81" stroke-width="8" stroke-linecap="round"/>
    <!-- Front Pocket -->
    <rect x="15" y="90" width="110" height="85" rx="14" fill="#818cf8" stroke="#3730a3" stroke-width="2"/>
    <!-- Buckles -->
    <rect x="30" y="70" width="12" height="35" rx="3" fill="#facc15"/>
    <rect x="98" y="70" width="12" height="35" rx="3" fill="#facc15"/>
    <text x="70" y="225" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#4338ca">محفظة مدرسية</text>
  </g>

  <!-- Open Textbook (كتاب مدرسي مفتوح) -->
  <g transform="translate(250, 70)">
    <path d="M 0,40 Q 60,30 80,45 Q 100,30 160,40 L 160,140 Q 100,130 80,145 Q 60,130 0,140 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M 80,45 L 80,145" stroke="#64748b" stroke-width="3"/>
    <!-- Book lines -->
    <line x1="15" y1="65" x2="65" y2="60" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="15" y1="85" x2="65" y2="80" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="15" y1="105" x2="65" y2="100" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="95" y1="60" x2="145" y2="65" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="95" y1="80" x2="145" y2="85" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="95" y1="100" x2="145" y2="105" stroke="#cbd5e1" stroke-width="2"/>
    <text x="80" y="175" text-anchor="middle" font-family="Cairo" font-size="14" font-weight="900" fill="#0f172a">كتاب القراءة والنشاطات</text>
  </g>

  <!-- Colored Pencils & Ruler (أقلام تلوين ومسطرة) -->
  <g transform="translate(250, 205)">
    <rect x="0" y="5" width="160" height="24" rx="4" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
    <line x1="20" y1="5" x2="20" y2="15" stroke="#a16207" stroke-width="1"/>
    <line x1="40" y1="5" x2="40" y2="15" stroke="#a16207" stroke-width="1"/>
    <line x1="60" y1="5" x2="60" y2="15" stroke="#a16207" stroke-width="1"/>
    <line x1="80" y1="5" x2="80" y2="15" stroke="#a16207" stroke-width="1"/>
    <line x1="100" y1="5" x2="100" y2="15" stroke="#a16207" stroke-width="1"/>
    <line x1="120" y1="5" x2="120" y2="15" stroke="#a16207" stroke-width="1"/>
    <line x1="140" y1="5" x2="140" y2="15" stroke="#a16207" stroke-width="1"/>
    <!-- Pencil -->
    <rect x="0" y="38" width="130" height="12" fill="#ef4444"/>
    <polygon points="130,38 150,44 130,50" fill="#fed7aa"/>
    <polygon points="144,42 150,44 144,46" fill="#0f172a"/>
  </g>

  <!-- Title -->
  <text x="220" y="310" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#4338ca">الأدوات والمستلزمات المدرسية للطور الابتدائي</text>
</svg>`,

  // 24. Primary Toys & Blocks (مكعبات تعليمية وألعاب تربوية)
  'primary_toys.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 340" width="100%" height="100%">
  <!-- Box -->
  <rect x="10" y="10" width="400" height="320" rx="20" fill="#fdfbf7" stroke="#e2e8f0" stroke-width="2"/>

  <!-- Alphabet Blocks (مكعبات الحروف والأرقام الملونة) -->
  <!-- Block 1: A / أ (Red) -->
  <g transform="translate(60, 130)">
    <rect x="0" y="0" width="80" height="80" rx="14" fill="#ef4444" stroke="#b91c1c" stroke-width="3" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))"/>
    <text x="40" y="55" text-anchor="middle" font-family="Cairo" font-size="44" font-weight="900" fill="#ffffff">أ</text>
  </g>

  <!-- Block 2: B / ب (Blue) -->
  <g transform="translate(160, 130)">
    <rect x="0" y="0" width="80" height="80" rx="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))"/>
    <text x="40" y="55" text-anchor="middle" font-family="Cairo" font-size="44" font-weight="900" fill="#ffffff">ب</text>
  </g>

  <!-- Block 3: T / ت (Green) -->
  <g transform="translate(260, 130)">
    <rect x="0" y="0" width="80" height="80" rx="14" fill="#10b981" stroke="#047857" stroke-width="3" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))"/>
    <text x="40" y="55" text-anchor="middle" font-family="Cairo" font-size="44" font-weight="900" fill="#ffffff">ت</text>
  </g>

  <!-- Block 4: Numbers (1 2 3) on top of blocks -->
  <g transform="translate(110, 40)">
    <rect x="0" y="0" width="80" height="80" rx="14" fill="#f59e0b" stroke="#b45309" stroke-width="3" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))"/>
    <text x="40" y="55" text-anchor="middle" font-family="Arial" font-size="44" font-weight="900" fill="#ffffff">1</text>
  </g>
  <g transform="translate(210, 40)">
    <rect x="0" y="0" width="80" height="80" rx="14" fill="#8b5cf6" stroke="#6d28d9" stroke-width="3" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))"/>
    <text x="40" y="55" text-anchor="middle" font-family="Arial" font-size="44" font-weight="900" fill="#ffffff">2</text>
  </g>

  <!-- Educational Counting Beads (المعداد التربوي) -->
  <g transform="translate(60, 235)">
    <rect x="0" y="0" width="280" height="35" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <line x1="20" y1="17" x2="260" y2="17" stroke="#475569" stroke-width="4"/>
    <!-- Beads -->
    <circle cx="45" cy="17" r="10" fill="#ef4444"/>
    <circle cx="70" cy="17" r="10" fill="#3b82f6"/>
    <circle cx="95" cy="17" r="10" fill="#10b981"/>
    <circle cx="120" cy="17" r="10" fill="#f59e0b"/>
    <circle cx="210" cy="17" r="10" fill="#8b5cf6"/>
    <circle cx="235" cy="17" r="10" fill="#ec4899"/>
  </g>

  <!-- Title -->
  <text x="210" y="305" text-anchor="middle" font-family="Cairo" font-size="15" font-weight="900" fill="#0f172a">مكعبات تعليمية ومعداد الحساب للتحضيري والابتدائي</text>
</svg>`
};

for (const [filename, content] of Object.entries(assets)) {
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Saved: ${filename}`);
}

console.log('All 24 educational vector SVGs generated successfully!');
