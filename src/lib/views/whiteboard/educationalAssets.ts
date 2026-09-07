// Authentic Pedagogical Educational Assets for Algerian Curriculum
// High-definition vector illustrations, maps, and pedagogical graphics

export interface EducationalAsset {
  id: string;
  category: 'geography' | 'science' | 'physics' | 'history' | 'math' | 'primary' | 'anatomy';
  title: string;
  badge: string;
  width: number;
  height: number;
  filePath: string;
  description: string;
}

export const EDUCATIONAL_CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'science', label: '🔬 علوم طبيعية وحياة' },
  { id: 'physics', label: '⚡ فيزياء وتكنولوجيا' },
  { id: 'geography', label: '🗺️ جغرافيا وخرائط' },
  { id: 'history', label: '🏛️ تاريخ وآثار' },
  { id: 'math', label: '📐 رياضيات وهندسة' },
  { id: 'primary', label: '🎒 الطور الابتدائي' },
  { id: 'anatomy', label: '🫀 تشريح وأحياء' },
];

export const EDUCATIONAL_ASSETS: EducationalAsset[] = [
  // ===================== 1. NATURAL SCIENCES & BIOLOGY (علوم الطبيعة والحياة) =====================
  {
    id: 'microscope-optical',
    category: 'science',
    title: 'مجهر ضوئي مركب (ميكروسكوب)',
    badge: 'علوم طبيعية ومخابر',
    width: 400,
    height: 420,
    filePath: '/educational/microscope_optical.svg',
    description: 'رسم توضيحي دقيق للمجهر الضوئي بأجزائه: العدسة العينية، الشيئيات، المنضدة، والبراغي.'
  },
  {
    id: 'microscope-electron',
    category: 'science',
    title: 'مجهر إلكتروني نافذ عالي الدقة',
    badge: 'علوم وتكنولوجيا متقدمة',
    width: 420,
    height: 420,
    filePath: '/educational/microscope_electron.svg',
    description: 'رسم علمي حديث للمجهر الإلكتروني لدراسة العضيات الخلوية بدقة النانومتر.'
  },
  {
    id: 'bunsen-burner',
    category: 'science',
    title: 'موقد بنزن المخبري للتسخين',
    badge: 'تجارب ومخابر',
    width: 360,
    height: 400,
    filePath: '/educational/bunsen_burner.svg',
    description: 'أداة التسخين المخبرية مع صمام الغاز ومدخل الهواء والشعلة الزرقاء المنتظمة.'
  },
  {
    id: 'plant-anatomy',
    category: 'science',
    title: 'تشريح النبتة الكاملة وأجزائها',
    badge: 'علوم الطبيعة والنبات',
    width: 420,
    height: 440,
    filePath: '/educational/plant_anatomy.svg',
    description: 'رسم تعليمي لأجزاء النبات: المجموع الجذري، الساق، الأوراق، والزهرة مع مسار النسغ.'
  },
  {
    id: 'food-groups',
    category: 'science',
    title: 'المجموعات الغذائية الست المتنوعة',
    badge: 'تربية صحية وغذاء',
    width: 440,
    height: 400,
    filePath: '/educational/food_groups.svg',
    description: 'تصنيف الأغذية الأساسية: السكريات، البروتينات، الدسم، الفيتامينات، الأملاح المعدنية والماء.'
  },
  {
    id: 'burnt-food',
    category: 'science',
    title: 'أغذية محترقة صماء (كشف عنصر الكربون)',
    badge: 'علوم وكيمياء',
    width: 420,
    height: 380,
    filePath: '/educational/burnt_food.svg',
    description: 'تجربة التفحم واحتراق الأغذية للكشف عن المادة العضوية وعنصر الفحم (الكربون).'
  },
  {
    id: 'age-groups',
    category: 'science',
    title: 'الفئات العمرية ومراحل نمو الإنسان',
    badge: 'علوم وتربية مدنية',
    width: 450,
    height: 380,
    filePath: '/educational/age_groups.svg',
    description: 'مراحل العمر عند الإنسان: الرضيع، الطفل، المراهق، الشاب، والكهل المسن.'
  },
  {
    id: 'graph-chart',
    category: 'science',
    title: 'منحنى بياني إحصائي وتجريبي',
    badge: 'علوم ورياضيات',
    width: 440,
    height: 360,
    filePath: '/educational/graph_chart.svg',
    description: 'رسم منحنى بياني لتحليل التجارب وتفسير التغيرات وتطور الظواهر العلمية مع الزمن.'
  },
  {
    id: 'plant-cell',
    category: 'science',
    title: 'بنية الخلية النباتية وعضياتها',
    badge: 'علوم طبيعية وأحياء',
    width: 440,
    height: 320,
    filePath: '/educational/plant_cell.svg',
    description: 'رسم مجهري دقيق للخلية النباتية: النواة، الصانعات الخضراء، الجدار السيلولوزي، والميتوكوندريا.'
  },

  // ===================== 2. PHYSICS & CHEMISTRY (فيزياء وتكنولوجيا) =====================
  {
    id: 'atom-structure',
    category: 'physics',
    title: 'بنية الذرة والجسيمات دون الذرية',
    badge: 'فيزياء المادة',
    width: 420,
    height: 420,
    filePath: '/educational/atom_structure.svg',
    description: 'نموذج الذرة: نواة مركزية بها بروتونات موجبة (+) ونيوترونات متعادلة، ومدارات إلكترونية (-).'
  },
  {
    id: 'water-molecule',
    category: 'physics',
    title: 'جزيء الماء H₂O وجزيئات كيميائية شائعة',
    badge: 'كيمياء المادة',
    width: 440,
    height: 380,
    filePath: '/educational/water_molecule.svg',
    description: 'النموذج المتراص لجزيء الماء والغازات الشائعة: ثاني أكسيد الكربون، الميثان، وثنائي الأكسجين.'
  },
  {
    id: 'magnet-and-filings',
    category: 'physics',
    title: 'المغناطيس الحذوي وخطوط الحقل ببرادة الحديد',
    badge: 'مغناطيسية وفيزياء',
    width: 440,
    height: 400,
    filePath: '/educational/magnet_and_filings.svg',
    description: 'تجربة الطيف المغناطيسي: خطوط الحقل المغناطيسي وبرادة الحديد بين القطبين الشمالي والجنوبي.'
  },
  {
    id: 'cathode-ray-oscilloscope',
    category: 'physics',
    title: 'راسم الاهتزازات المهبطي (Oscilloscope)',
    badge: 'كهرباء وتيارات',
    width: 440,
    height: 380,
    filePath: '/educational/cathode_ray_oscilloscope.svg',
    description: 'جهاز راسم الاهتزازات المهبطي لقياس التوتر الكهربائي، الدور، والتواتر للتيار المتناوب.'
  },
  {
    id: 'electric-circuit-elements',
    category: 'physics',
    title: 'مكونات الدارة الكهربائية والتيارات (+ -)',
    badge: 'دارات كهربائية',
    width: 440,
    height: 400,
    filePath: '/educational/electric_circuit_elements.svg',
    description: 'الرموز النظامية للدارة: مولد (+ -)، قاطعة، مصباح، صمام ثنائي LED، محرك، وسلك توصيل.'
  },
  {
    id: 'states-of-matter',
    category: 'physics',
    title: 'حالات المادة الثلاث والغازات وتحولاتها',
    badge: 'المادة وتحولاتها',
    width: 440,
    height: 380,
    filePath: '/educational/states_of_matter.svg',
    description: 'الحالة الصلبة، السائلة، والغازية، مع أسهم التحولات الفيزيائية: انصهار، تجمد، تبخر، وتكاثف.'
  },
  {
    id: 'solar-system',
    category: 'physics',
    title: 'المجموعة الشمسية والكواكب',
    badge: 'فلك وفيزياء',
    width: 520,
    height: 200,
    filePath: '/educational/solar_system.svg',
    description: 'رسم توضيحي فلكي حقيقي للشمس والكواكب الثمانية بمداراتها وتفاصيل سطوحها.'
  },

  // ===================== 3. GEOGRAPHY & MAPS (جغرافيا وخرائط) =====================
  {
    id: 'map-algeria-blank',
    category: 'geography',
    title: 'خريطة الجزائر الصماء (الحدود الرسمية)',
    badge: 'جغرافيا وتاريخ',
    width: 450,
    height: 440,
    filePath: '/educational/algeria_blank.svg',
    description: 'الخريطة الجغرافية الصماء الرسمية للجمهورية الجزائرية الديمقراطية الشعبية مع كامل التضاريس والحدود البحرية والبرية.'
  },
  {
    id: 'map-algeria-wilayas',
    category: 'geography',
    title: 'خريطة الجزائر — التقسيم الإداري (الولايات)',
    badge: 'جغرافيا',
    width: 460,
    height: 450,
    filePath: '/educational/algeria_wilayas.svg',
    description: 'خريطة الجزائر الصماء مع الحدود الإدارية لكافة الولايات، مثالية لتحديد المدن والأنشطة الاقتصادية.'
  },
  {
    id: 'algeria-relief-map',
    category: 'geography',
    title: 'خريطة تضاريس الجزائر الكبرى',
    badge: 'تضاريس وطبيعة',
    width: 440,
    height: 440,
    filePath: '/educational/algeria_relief_map.svg',
    description: 'خريطة التضاريس الجزائرية: الأطلس التلي، الهضاب العليا، الأطلس الصحراوي، وجبال الهقار.'
  },
  {
    id: 'algeria-vegetation-map',
    category: 'geography',
    title: 'خريطة الأقاليم المناخية والغطاء النباتي',
    badge: 'مناخ وبيئة',
    width: 440,
    height: 440,
    filePath: '/educational/algeria_vegetation_map.svg',
    description: 'توزيع الأقاليم المناخية في الجزائر: المتوسطي الرطب، الشبه جاف، والإقليم الصحراوي الجاف.'
  },
  {
    id: 'algeria-oil-gas-map',
    category: 'geography',
    title: 'خريطة حقول وموانئ وأنابيب البترول والغاز',
    badge: 'طاقة واقتصاد',
    width: 440,
    height: 440,
    filePath: '/educational/algeria_oil_gas_map.svg',
    description: 'الموارد الطاقوية: حاسي مسعود، حاسي الرمل، أنابيب النقل نحو موانئ سكيكدة وأرزيو.'
  },
  {
    id: 'algeria-water-resources-map',
    category: 'geography',
    title: 'خريطة الموارد المائية والسدود الكبرى',
    badge: 'موارد ومياه',
    width: 440,
    height: 440,
    filePath: '/educational/algeria_water_resources_map.svg',
    description: 'الأحواض المائية، السدود الكبرى (بني هارون، تاقسبت)، والمياه الجوفية بالصحراء.'
  },
  {
    id: 'map-arab-world',
    category: 'geography',
    title: 'خريطة الوطن العربي الصماء',
    badge: 'جغرافيا وتاريخ',
    width: 480,
    height: 270,
    filePath: '/educational/arab_world_blank.svg',
    description: 'الخريطة الرسمية لجامعة الدول العربية والوطن العربي من المحيط إلى الخليج.'
  },
  {
    id: 'map-africa',
    category: 'geography',
    title: 'خريطة قارة إفريقيا الصماء',
    badge: 'جغرافيا',
    width: 420,
    height: 420,
    filePath: '/educational/africa_blank.svg',
    description: 'الخريطة القارية لإفريقيا بحدودها السياسية والجغرافية الدقيقة.'
  },
  {
    id: 'map-world',
    category: 'geography',
    title: 'خريطة العالم الصماء (كروكيز دولي)',
    badge: 'جغرافيا',
    width: 500,
    height: 280,
    filePath: '/educational/world_map_blank.svg',
    description: 'خريطة العالم الصماء المسطحة لدروس الجغرافيا والعلاقات الدولية والملاحة.'
  },

  // ===================== 4. HISTORY (تاريخ وآثار) =====================
  {
    id: 'numidian-monuments',
    category: 'history',
    title: 'رموز ومعالم الدولة النوميدية القديمة',
    badge: 'تاريخ وآثار نوميديا',
    width: 440,
    height: 380,
    filePath: '/educational/numidian_monuments.svg',
    description: 'معالم الجزائر القديمة: ضريح إيمدغاسن الملكي، عملة الملك ماسينيسا، وقوس تيمقاد التاريخي.'
  },

  // ===================== 5. MATHEMATICS & GEOMETRY (رياضيات وهندسة) =====================
  {
    id: 'math-protractor',
    category: 'math',
    title: 'منقلة هندسية مدرجة 180° شفافة',
    badge: 'هندسة وقياس الزوايا',
    width: 440,
    height: 260,
    filePath: '/educational/math_protractor.svg',
    description: 'منقلة هندسية دقيقة مدرجة من 0° إلى 180° في الاتجاهين مع نقطة المركز لرسم وقياس الزوايا.'
  },
  {
    id: 'math-set-square',
    category: 'math',
    title: 'كوس هندسي قائم الزاوية 90° مدرج',
    badge: 'هندسة ورسم التعامد',
    width: 380,
    height: 380,
    filePath: '/educational/math_set_square.svg',
    description: 'كوس هندسي قائم 90° مدرج بالسنتمتر لرسم المستقيمات المتعامدة والمتوازية والارتفاعات.'
  },

  // ===================== 6. PRIMARY EDUCATION (الطور الابتدائي والطفولة) =====================
  {
    id: 'primary-school-kids',
    category: 'primary',
    title: 'تلميذ وتلميذة بالزي والمئزر المدرسي الرسمي',
    badge: 'الطور الابتدائي',
    width: 400,
    height: 380,
    filePath: '/educational/primary_school_kids.svg',
    description: 'تلميذ وتلميذة بمئزر المدرسة والمحفظة لدروس التعبير والتواصل والقراءة في الطور الابتدائي.'
  },
  {
    id: 'primary-book-bag',
    category: 'primary',
    title: 'المحفظة المدرسية والكتاب والأدوات',
    badge: 'أدوات مدرسية',
    width: 420,
    height: 360,
    filePath: '/educational/primary_book_bag.svg',
    description: 'المحفظة المدرسية، الكتاب المفتوح، الأقلام الملونة، والمسطرة لدروس الأنشطة والتنظيم.'
  },
  {
    id: 'primary-toys',
    category: 'primary',
    title: 'مكعبات الحروف والأرقام والمعداد اليدوي',
    badge: 'حساب وألعاب تعليمية',
    width: 440,
    height: 360,
    filePath: '/educational/primary_toys.svg',
    description: 'مكعبات تعليمية ثلاثية الأبعاد ومعداد خرزات ملونة لتعلم الحساب والعد والتراكيب اللغوية.'
  },
  {
    id: 'horse-anatomy',
    category: 'primary',
    title: 'التشريح البيولوجي لجسم الحصان (الثدييات)',
    badge: 'ابتدائي وأحياء',
    width: 440,
    height: 350,
    filePath: '/educational/horse_anatomy.svg',
    description: 'رسم تشريحي بيولوجي يوضح الهيكل العظمي والأعضاء الداخلية للحصان لدروس علوم الطبيعة.'
  },

  // ===================== 7. ANATOMY & PHYSIOLOGY (تشريح جسم الإنسان) =====================
  {
    id: 'human-heart',
    category: 'anatomy',
    title: 'القلب البشري (تشريح متكامل)',
    badge: 'علوم طبيعية',
    width: 400,
    height: 400,
    filePath: '/educational/human_heart.svg',
    description: 'رسم بياني تشريحي احترافي للقلب: الأبهر، الوريد الأجوف، الأذينان، والبطينان.'
  },
  {
    id: 'digestive-system',
    category: 'anatomy',
    title: 'الجهاز الهضمي والمعدة وملحقاته',
    badge: 'علوم طبيعية',
    width: 360,
    height: 460,
    filePath: '/educational/digestive_system.svg',
    description: 'مخطط طبي دقيق للجهاز الهضمي: المريء، المعدة، الكبد، الأمعاء الدقيقة والغليظة.'
  },
  {
    id: 'respiratory-system',
    category: 'anatomy',
    title: 'الجهاز التنفسي والرئتان والقصبة',
    badge: 'علوم طبيعية',
    width: 380,
    height: 440,
    filePath: '/educational/respiratory_system.svg',
    description: 'رسم تشريحي طبي متكامل للجهاز التنفسي: القصبة الهوائية، الشعيبات، الرئتان، والحجاب الحاجز.'
  },
  {
    id: 'human-skeleton',
    category: 'anatomy',
    title: 'الهيكل العظمي البشري الكامل',
    badge: 'علوم طبيعية',
    width: 340,
    height: 520,
    filePath: '/educational/human_skeleton.svg',
    description: 'الهيكل العظمي البشري المفصل من الجمجمة والقفص الصدري حتى الأطراف السفلية.'
  }
];
