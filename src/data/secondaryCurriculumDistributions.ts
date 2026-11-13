/**
 * التوزيعات السنوية والشهرية المعتمدة لوزارة التربية الوطنية الجزائرية
 * مستخلصة من وثائق التدرجات السنوية الرسمية (الجيل الثاني) للطور الثانوي
 * تشمل كافة سنوات الطور الثانوي (السنة 1، 2، 3) والشعب الأدبية والعلمية
 * مصممة وفق معمارية محاكاة لمنصة باقون
 */

export interface WeekDistributionItem {
  weekNumber: number;
  monthNameAr: string;
  unitNumber: number;
  unitTitle: string;
  theme: string;
  literaryText: string;
  grammar: string;
  rhetoricOrProsody?: string;
  guidedReadingOrCommunicative?: string;
  writingOrIntegration: string;
  hours: number;
  isExamPeriod?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  notes?: string;
}

export interface MonthDistributionItem {
  id: string;
  monthNameAr: string;
  monthIndex: number;
  semester: 1 | 2 | 3;
  weeksCount: number;
  isExamPeriod?: boolean;
  examTitle?: string;
  weeks: WeekDistributionItem[];
  branchSummary: {
    literature: string[];
    grammar: string[];
    rhetoric: string[];
    writing: string[];
  };
}

export interface SyllabusDistribution {
  id: string;
  academicYear: string;
  grade: 'السنة الأولى' | 'السنة الثانية' | 'السنة الثالثة';
  stream: string;
  subject: string;
  weeklyHours: number;
  totalAnnualHours: number;
  trimesters: {
    trimester: 1 | 2 | 3;
    title: string;
    monthsRange: string;
    weeksCount: number;
    hoursCount: number;
    months: MonthDistributionItem[];
  }[];
}

export const OFFICIAL_SYLLABUS_DISTRIBUTIONS: SyllabusDistribution[] = [
  {
  "id": "3as-scientific-annual-2024",
  "academicYear": "2024/2025",
  "grade": "السنة الثالثة",
  "stream": "شعب علمية مشتركة (علوم تجريبية / رياضيات / تقني رياضي / تسيير واقتصاد)",
  "subject": "اللغة العربية وآدابها",
  "weeklyHours": 3,
  "totalAnnualHours": 96,
  "trimesters": [
    {
      "trimester": 1,
      "title": "الفصل الدراسي الأول (الثلاثي الأول)",
      "monthsRange": "سبتمبر — ديسمبر",
      "weeksCount": 13,
      "hoursCount": 39,
      "months": [
        {
          "id": "3as-sci-sep",
          "monthNameAr": "سبتمبر",
          "monthIndex": 9,
          "semester": 1,
          "weeksCount": 2,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 1,
              "monthNameAr": "سبتمبر",
              "unitNumber": 0,
              "unitTitle": "الصحة المدرسية والتقويم التشخيصي",
              "theme": "الصحة المدرسية وتقويم تشخيصي، وتنشيط حصص تعليمية ممهدة لتعلّم أنشطة المادة المقرّرة",
              "literaryText": "تقويم تشخيصي وتنشيط حصص ممهدة",
              "grammar": "مراجعة المكتسبات القبلية",
              "rhetoricOrProsody": "مراجعة الصور البيانية والمحسنات",
              "guidedReadingOrCommunicative": "تقويم تشخيصي أولي",
              "writingOrIntegration": "تنشيط حصص تعليمية ممهدة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 21 إلى 25 سبتمبر"
            },
            {
              "weekNumber": 2,
              "monthNameAr": "سبتمبر",
              "unitNumber": 1,
              "unitTitle": "الشعر التعليمي",
              "theme": "الشعر التعليمي في عصر الضعف والانحطاط",
              "literaryText": "وصايا وتوجيهات (ابن الوردي)",
              "grammar": "المجاز المرسل والمجاز العقلي",
              "rhetoricOrProsody": "بلاغة المجاز المرسل والمجاز العقلي",
              "guidedReadingOrCommunicative": "إنسان ما بعد الموحدين",
              "writingOrIntegration": "إنسان ما بعد الموحدين",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 28 سبتمبر إلى 02 أكتوبر"
            }
          ],
          "branchSummary": {
            "literature": [
              "وصايا وتوجيهات (ابن الوردي)"
            ],
            "grammar": [
              "المجاز المرسل والمجاز العقلي"
            ],
            "rhetoric": [
              "بلاغة المجاز المرسل والمجاز العقلي"
            ],
            "writing": [
              "إنسان ما بعد الموحدين"
            ]
          }
        },
        {
          "id": "3as-sci-oct",
          "monthNameAr": "أكتوبر",
          "monthIndex": 10,
          "semester": 1,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 3,
              "monthNameAr": "أكتوبر",
              "unitNumber": 1,
              "unitTitle": "الشعر التعليمي",
              "theme": "نشأة الشعر التعليمي وتطوره",
              "literaryText": "نشأة الشعر التعليمي",
              "grammar": "مراجعة وتطبيقات",
              "rhetoricOrProsody": "تطبيقات في البلاغة",
              "guidedReadingOrCommunicative": "نشأة الشعر التعليمي",
              "writingOrIntegration": "تلخيص نصوص ذات أنماط متنوعة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 05 إلى 09 أكتوبر"
            },
            {
              "weekNumber": 4,
              "monthNameAr": "أكتوبر",
              "unitNumber": 2,
              "unitTitle": "نثر الحركة العلمية",
              "theme": "النثر العلمي المتأدب ورواد الحركة الفكرية",
              "literaryText": "في علم التاريخ (ابن خلدون)",
              "grammar": "الخصائص الأسلوبية للنثر العلمي المتأدب",
              "rhetoricOrProsody": "المصطلحات البلاغية والمنهجية",
              "guidedReadingOrCommunicative": "مقدمة ابن خلدون",
              "writingOrIntegration": "تحرير الموضوع داخل القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 12 إلى 16 أكتوبر"
            },
            {
              "weekNumber": 5,
              "monthNameAr": "أكتوبر",
              "unitNumber": 2,
              "unitTitle": "نثر الحركة العلمية",
              "theme": "حركة التأليف والموسوعات في عصر المماليك",
              "literaryText": "حركة التأليف في عصر المماليك",
              "grammar": "تطبيقات إعرابية",
              "rhetoricOrProsody": "الأساليب الخبرية التقريرية",
              "guidedReadingOrCommunicative": "حركة التأليف في عصر المماليك",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 19 إلى 23 أكتوبر"
            },
            {
              "weekNumber": 6,
              "monthNameAr": "أكتوبر",
              "unitNumber": 2,
              "unitTitle": "عطلة الخريف الرسمية",
              "theme": "عطلة مدرسية دورية",
              "literaryText": "عطلة الخريف",
              "grammar": "عطلة رسمية",
              "rhetoricOrProsody": "عطلة رسمية",
              "guidedReadingOrCommunicative": "عطلة الخريف",
              "writingOrIntegration": "عطلة الخريف المدرسية",
              "hours": 0,
              "isExamPeriod": false,
              "isHoliday": true,
              "holidayName": "عطلة الخريف",
              "notes": "من 28 أكتوبر إلى 02 نوفمبر"
            }
          ],
          "branchSummary": {
            "literature": [
              "نشأة الشعر التعليمي",
              "في علم التاريخ (ابن خلدون)",
              "حركة التأليف في عصر المماليك"
            ],
            "grammar": [
              "الخصائص الأسلوبية للنثر العلمي المتأدب",
              "تطبيقات إعرابية"
            ],
            "rhetoric": [
              "الأساليب الخبرية التقريرية"
            ],
            "writing": [
              "تلخيص نصوص ذات أنماط متنوعة",
              "تحرير الموضوع داخل القسم",
              "تصحيح الموضوع"
            ]
          }
        },
        {
          "id": "3as-sci-nov",
          "monthNameAr": "نوفمبر",
          "monthIndex": 11,
          "semester": 1,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 7,
              "monthNameAr": "نوفمبر",
              "unitNumber": 3,
              "unitTitle": "النزعة الإنسانية في الشعر المهجري",
              "theme": "أدب المهجر ودعوة التسامح والإخاء الإنساني",
              "literaryText": "أنا (إيليا أبو ماضي)",
              "grammar": "معاني وإعراب إذا - إذن",
              "rhetoricOrProsody": "النزعة الذاتية والإنسانية والتأمل",
              "guidedReadingOrCommunicative": "ثقافة أخرى",
              "writingOrIntegration": "ثقافة أخرى",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 02 إلى 06 نوفمبر"
            },
            {
              "weekNumber": 8,
              "monthNameAr": "نوفمبر",
              "unitNumber": 3,
              "unitTitle": "النزعة الإنسانية في الشعر المهجري",
              "theme": "النزعة الإنسانية في الشعر العربي المعاصر",
              "literaryText": "النزعة الإنسانية في الشعر العربي المعاصر",
              "grammar": "معاني وإعراب إذ - حينئذ",
              "rhetoricOrProsody": "بلاغة التعبير الإنساني",
              "guidedReadingOrCommunicative": "النزعة الإنسانية في الشعر المعاصر",
              "writingOrIntegration": "إعداد إضبارة تتضمن عوامل النهضة الأدبية في العصر الحديث",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 09 إلى 13 نوفمبر"
            },
            {
              "weekNumber": 9,
              "monthNameAr": "نوفمبر",
              "unitNumber": 4,
              "unitTitle": "شعر النهضة وموقفه من حضارة الغرب",
              "theme": "موقف رواد النهضة من المادية الغربية",
              "literaryText": "أخي (ميخائيل نعيمة)",
              "grammar": "الأساليب اللغوية المتنوعة",
              "rhetoricOrProsody": "الرمز والموسيقى في شعر المهجر",
              "guidedReadingOrCommunicative": "أدب المهجر",
              "writingOrIntegration": "بناء وضعية إبداعية أو نقدية",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 16 إلى 20 نوفمبر"
            },
            {
              "weekNumber": 10,
              "monthNameAr": "نوفمبر",
              "unitNumber": 4,
              "unitTitle": "شعر النهضة وموقفه من حضارة الغرب",
              "theme": "الثقافة العربية وتحديات التغريب",
              "literaryText": "الثقافة العربية",
              "grammar": "تطبيقات نحوية",
              "rhetoricOrProsody": "الحوار الفكري والحجاجي",
              "guidedReadingOrCommunicative": "رصيف الأزهار لا يجيب",
              "writingOrIntegration": "رصيف الأزهار لا يجيب",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 23 إلى 27 نوفمبر"
            }
          ],
          "branchSummary": {
            "literature": [
              "أنا (إيليا أبو ماضي)",
              "النزعة الإنسانية في الشعر العربي المعاصر",
              "أخي (ميخائيل نعيمة)",
              "الثقافة العربية"
            ],
            "grammar": [
              "معاني وإعراب إذا - إذن",
              "معاني وإعراب إذ - حينئذ"
            ],
            "rhetoric": [
              "النزعة الذاتية والإنسانية والتأمل",
              "بلاغة التعبير الإنساني"
            ],
            "writing": [
              "ثقافة أخرى",
              "إعداد إضبارة تتضمن عوامل النهضة الأدبية في العصر الحديث",
              "بناء وضعية إبداعية أو نقدية",
              "رصيف الأزهار لا يجيب"
            ]
          }
        },
        {
          "id": "3as-sci-dec",
          "monthNameAr": "ديسمبر",
          "monthIndex": 12,
          "semester": 1,
          "weeksCount": 3,
          "isExamPeriod": true,
          "weeks": [
            {
              "weekNumber": 11,
              "monthNameAr": "ديسمبر",
              "unitNumber": 5,
              "unitTitle": "الشعر الملتزم وقضايا التحرر",
              "theme": "الثورة الجزائرية وشعر الالتزام الوطني والقومي",
              "literaryText": "ثورة الشرفاء (مفدي زكرياء)",
              "grammar": "الخبر: المفرد، الجملة، شبه الجملة",
              "rhetoricOrProsody": "الإيقاع الحماسي والصور البيانية",
              "guidedReadingOrCommunicative": "الأهلية العلمية تصحيح للمعرفة وتوسيع لإطارها",
              "writingOrIntegration": "الأهلية العلمية تصحيح للمعرفة وتوسيع لإطارها",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 30 نوفمبر إلى 04 ديسمبر"
            },
            {
              "weekNumber": 12,
              "monthNameAr": "ديسمبر",
              "unitNumber": 5,
              "unitTitle": "اختبارات الفصل الدراسي الأول",
              "theme": "التقويم التحصيلي الرسمي لجميع المواد",
              "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الأول)",
              "grammar": "تطبيق المقاييس الرسمية في الأسئلة وسلم التنقيط",
              "rhetoricOrProsody": "مراجعة المكتسبات",
              "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة السلالم",
              "writingOrIntegration": "اختبارات الفصل الأول",
              "hours": 3,
              "isExamPeriod": true,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 07 إلى 11 ديسمبر"
            },
            {
              "weekNumber": 13,
              "monthNameAr": "ديسمبر",
              "unitNumber": 5,
              "unitTitle": "الشعر الملتزم وقضايا التحرر",
              "theme": "ظاهرة الالتزام في الشعر العربي الحديث وعطلة الشتاء",
              "literaryText": "الالتزام في الشعر العربي الحديث",
              "grammar": "الجمل التي لها محل من الإعراب",
              "rhetoricOrProsody": "مفهوم الالتزام وخصائصه في الشعر",
              "guidedReadingOrCommunicative": "النقد الأدبي المعاصر",
              "writingOrIntegration": "تحرير الموضوع داخل القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 14 إلى 18 ديسمبر (بداية إجازة الشتاء من 18 ديسمبر إلى 04 جانفي)"
            }
          ],
          "branchSummary": {
            "literature": [
              "ثورة الشرفاء (مفدي زكرياء)",
              "الالتزام في الشعر العربي الحديث"
            ],
            "grammar": [
              "الخبر: المفرد، الجملة، شبه الجملة",
              "الجمل التي لها محل من الإعراب"
            ],
            "rhetoric": [
              "الإيقاع الحماسي والصور البيانية"
            ],
            "writing": [
              "الأهلية العلمية تصحيح للمعرفة وتوسيع لإطارها",
              "تحرير الموضوع داخل القسم"
            ]
          },
          "examTitle": "اختبارات الفصل الأول وإجازة الشتاء"
        }
      ]
    },
    {
      "trimester": 2,
      "title": "الفصل الدراسي الثاني (الثلاثي الثاني)",
      "monthsRange": "جانفي — مارس",
      "weeksCount": 11,
      "hoursCount": 33,
      "months": [
        {
          "id": "3as-sci-jan",
          "monthNameAr": "جانفي",
          "monthIndex": 1,
          "semester": 2,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 14,
              "monthNameAr": "جانفي",
              "unitNumber": 6,
              "unitTitle": "فلسطين في الشعر العربي المعاصر",
              "theme": "شعر المقاومة الفلسطينية وظاهرة الحزن والرمز",
              "literaryText": "حالة حصار (محمود درويش)",
              "grammar": "الجمل التي لا محل لها من الإعراب",
              "rhetoricOrProsody": "الرمز والدلالة الإيحائية",
              "guidedReadingOrCommunicative": "أدب المقاومة",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 04 إلى 08 جانفي"
            },
            {
              "weekNumber": 15,
              "monthNameAr": "جانفي",
              "unitNumber": 6,
              "unitTitle": "فلسطين في الشعر العربي المعاصر",
              "theme": "فلسطين في الشعر الجزائري والثورة",
              "literaryText": "فلسطين في الشعر الجزائري",
              "grammar": "تطبيقات إعرابية",
              "rhetoricOrProsody": "بلاغة التشبيه",
              "guidedReadingOrCommunicative": "إشكالية التعبير في الأدب الجزائري",
              "writingOrIntegration": "إشكالية التعبير في الأدب الجزائري",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 11 إلى 15 جانفي"
            },
            {
              "weekNumber": 16,
              "monthNameAr": "جانفي",
              "unitNumber": 7,
              "unitTitle": "الثورة التحريرية الجزائرية في الشعر العربي",
              "theme": "أبعاد الثورة الجزائرية الإنسانية والتحررية",
              "literaryText": "الإنسان الكبير (محمد الصالح باوية)",
              "grammar": "أحكام التمييز والحال",
              "rhetoricOrProsody": "التنويع الموسيقي في شعر التفعيلة",
              "guidedReadingOrCommunicative": "جمعية العلماء المسلمين الجزائريين",
              "writingOrIntegration": "إنتاج نقدية جمعية العلماء المسلمين الجزائريين تبين أهم نشاطاتها",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 18 إلى 22 جانفي"
            },
            {
              "weekNumber": 17,
              "monthNameAr": "جانفي",
              "unitNumber": 7,
              "unitTitle": "الثورة التحريرية الجزائرية في الشعر العربي",
              "theme": "الأوراس ورمزية الثورة في الشعر العربي",
              "literaryText": "الأوراس في الشعر العربي",
              "grammar": "أحكام البدل وعطف البيان",
              "rhetoricOrProsody": "البعد الرمزي لجبال الأوراس",
              "guidedReadingOrCommunicative": "شعر الثورة التحريرية",
              "writingOrIntegration": "بناء وضعية إبداعية أو نقدية",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 25 إلى 29 جانفي"
            }
          ],
          "branchSummary": {
            "literature": [
              "حالة حصار (محمود درويش)",
              "فلسطين في الشعر الجزائري",
              "الإنسان الكبير (محمد الصالح باوية)",
              "الأوراس في الشعر العربي"
            ],
            "grammar": [
              "الجمل التي لا محل لها من الإعراب",
              "أحكام التمييز والحال",
              "أحكام البدل وعطف البيان"
            ],
            "rhetoric": [
              "بلاغة التشبيه"
            ],
            "writing": [
              "تصحيح الموضوع",
              "إشكالية التعبير في الأدب الجزائري",
              "إنتاج نقدية جمعية العلماء المسلمين الجزائريين",
              "بناء وضعية إبداعية أو نقدية"
            ]
          }
        },
        {
          "id": "3as-sci-feb",
          "monthNameAr": "فيفري",
          "monthIndex": 2,
          "semester": 2,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 18,
              "monthNameAr": "فيفري",
              "unitNumber": 8,
              "unitTitle": "الشعر الاجتماعي وقضايا العصر",
              "theme": "الواقع الاجتماعي وتداعيات العولمة",
              "literaryText": "الفراغ (أدونيس)",
              "grammar": "الأساليب البلاغية والتركيبية",
              "rhetoricOrProsody": "بلاغة الاستعارة",
              "guidedReadingOrCommunicative": "المجتمع المعلوماتي وتداعيات العولمة",
              "writingOrIntegration": "المجتمع المعلوماتي وتداعيات العولمة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 01 إلى 05 فيفري"
            },
            {
              "weekNumber": 19,
              "monthNameAr": "فيفري",
              "unitNumber": 8,
              "unitTitle": "الشعر الاجتماعي وقضايا العصر",
              "theme": "الأدب وقضايا المجتمع المعاصر",
              "literaryText": "الأدب وقضايا المجتمع المعاصر",
              "grammar": "تطبيقات نحوية",
              "rhetoricOrProsody": "التفكيك النقدي للنصوص المعاصرة",
              "guidedReadingOrCommunicative": "الإنسان لا يتواصل مع الأشياء إلا عن طريق المعرفة والحب...",
              "writingOrIntegration": "الإنسان لا يتواصل مع الأشياء إلا عن طريق المعرفة والحب...",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 08 إلى 12 فيفري"
            },
            {
              "weekNumber": 20,
              "monthNameAr": "فيفري",
              "unitNumber": 8,
              "unitTitle": "نشاطات للاستدراك والدعم والتقويم والإدماج",
              "theme": "المعالجة البيداغوجية والدعم الفصلي لمقرر الثلاثي الثاني",
              "literaryText": "نشاطات للاستدراك والدعم والتقويم والإدماج",
              "grammar": "معالجة الثغرات الإعرابية",
              "rhetoricOrProsody": "معالجة مواطن الضعف في البلاغة",
              "guidedReadingOrCommunicative": "وضعيات إدماجية تقويمية",
              "writingOrIntegration": "إنتاج وضعية إدماجية شاملة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 15 إلى 19 فيفري"
            },
            {
              "weekNumber": 21,
              "monthNameAr": "فيفري",
              "unitNumber": 9,
              "unitTitle": "مظاهر ازدهار الكتابة الفنية (المقالة أنموذجاً)",
              "theme": "المقالة الجزائرية ورواد النهضة والإصلاح",
              "literaryText": "منزلة المثقفين في الأمة (البشير الإبراهيمي)",
              "grammar": "لو - لولا - لوما",
              "rhetoricOrProsody": "أسلوب الإبراهيمي وجزالة اللفظ والمحسنات",
              "guidedReadingOrCommunicative": "عيون البصائر",
              "writingOrIntegration": "تحرير الموضوع داخل القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 22 إلى 26 فيفري"
            }
          ],
          "branchSummary": {
            "literature": [
              "الفراغ (أدونيس)",
              "الأدب وقضايا المجتمع المعاصر",
              "منزلة المثقفين في الأمة (البشير الإبراهيمي)"
            ],
            "grammar": [
              "لو - لولا - لوما"
            ],
            "rhetoric": [
              "بلاغة الاستعارة"
            ],
            "writing": [
              "المجتمع المعلوماتي وتداعيات العولمة",
              "الإنسان لا يتواصل مع الأشياء إلا عن طريق المعرفة والحب...",
              "تحرير الموضوع داخل القسم"
            ]
          }
        },
        {
          "id": "3as-sci-mar",
          "monthNameAr": "مارس",
          "monthIndex": 3,
          "semester": 2,
          "weeksCount": 3,
          "isExamPeriod": true,
          "weeks": [
            {
              "weekNumber": 22,
              "monthNameAr": "مارس",
              "unitNumber": 9,
              "unitTitle": "مظاهر ازدهار الكتابة الفنية (المقالة أنموذجاً)",
              "theme": "المقالة والصحافة ودورهما في نهضة الفكر والأدب",
              "literaryText": "المقالة والصحافة ودورهما في نهضة الفكر والأدب",
              "grammar": "تطبيقات أسلوبية",
              "rhetoricOrProsody": "خصائص المقالة النقدية والاجتماعية",
              "guidedReadingOrCommunicative": "الصحافة الجزائرية والإصلاح",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 01 إلى 05 مارس"
            },
            {
              "weekNumber": 23,
              "monthNameAr": "مارس",
              "unitNumber": 9,
              "unitTitle": "اختبارات الفصل الدراسي الثاني",
              "theme": "التقويم التحصيلي الرسمي للثلاثي الثاني لجميع الشعب العلمية",
              "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الثاني)",
              "grammar": "تطبيق معايير المفتشية العامة في الأسئلة وسلم التنقيط",
              "rhetoricOrProsody": "مراجعة المكتسبات",
              "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة السلالم",
              "writingOrIntegration": "اختبارات الفصل الثاني",
              "hours": 3,
              "isExamPeriod": true,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 08 إلى 12 مارس"
            },
            {
              "weekNumber": 24,
              "monthNameAr": "مارس",
              "unitNumber": 10,
              "unitTitle": "القصة القصيرة في الجزائر",
              "theme": "تطور فن القصة القصيرة في الأدب الجزائري",
              "literaryText": "الطريق إلى قرية الطوب (محمد شوفي)",
              "grammar": "الأساليب اللغوية السردية",
              "rhetoricOrProsody": "الكناية وبلاغتها",
              "guidedReadingOrCommunicative": "من رواية الأمير",
              "writingOrIntegration": "من رواية الأمير",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 15 إلى 19 مارس (بداية إجازة الربيع من 19 مارس إلى 05 أفريل)"
            }
          ],
          "branchSummary": {
            "literature": [
              "المقالة والصحافة ودورهما في نهضة الفكر والأدب",
              "الطريق إلى قرية الطوب (محمد شوفي)"
            ],
            "grammar": [
              "الأساليب اللغوية السردية"
            ],
            "rhetoric": [
              "الكناية وبلاغتها"
            ],
            "writing": [
              "تصحيح الموضوع",
              "من رواية الأمير"
            ]
          },
          "examTitle": "اختبارات الفصل الثاني وإجازة الربيع"
        }
      ]
    },
    {
      "trimester": 3,
      "title": "الفصل الدراسي الثالث (الثلاثي الثالث)",
      "monthsRange": "أفريل — ماي",
      "weeksCount": 6,
      "hoursCount": 18,
      "months": [
        {
          "id": "3as-sci-apr",
          "monthNameAr": "أفريل",
          "monthIndex": 4,
          "semester": 3,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 25,
              "monthNameAr": "أفريل",
              "unitNumber": 10,
              "unitTitle": "القصة القصيرة في الجزائر",
              "theme": "الفن القصصي القصير في مواجهة التغير الاجتماعي",
              "literaryText": "الفن القصصي القصير في مواجهة التغير الاجتماعي",
              "grammar": "تقنيات السرد والوصف والحوار",
              "rhetoricOrProsody": "الحبكة والرمزية في القصة الجزائرية",
              "guidedReadingOrCommunicative": "الأدب القصصي المعاصر",
              "writingOrIntegration": "كتابة قصة قصيرة تعالج وضعية ذات دلالة بالنسبة للمتعلم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 05 إلى 09 أفريل"
            },
            {
              "weekNumber": 26,
              "monthNameAr": "أفريل",
              "unitNumber": 11,
              "unitTitle": "الفن المسرحي في المشرق",
              "theme": "نشأة وتطور النص المسرحي في المشرق العربي",
              "literaryText": "كابوس في الظهيرة (حسين عبد الخضر)",
              "grammar": "إعراب المتعدي إلى أكثر من مفعول",
              "rhetoricOrProsody": "الصراع الدرامي والحوار المسرحي",
              "guidedReadingOrCommunicative": "المسرح العربي الحديث",
              "writingOrIntegration": "بناء وضعية إبداعية أو نقدية",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 12 إلى 16 أفريل"
            },
            {
              "weekNumber": 27,
              "monthNameAr": "أفريل",
              "unitNumber": 11,
              "unitTitle": "الفن المسرحي في المشرق",
              "theme": "المسرح في الأدب العربي",
              "literaryText": "المسرح في الأدب العربي",
              "grammar": "تطبيقات في الإعراب",
              "rhetoricOrProsody": "مقومات المسرحية التعليمية",
              "guidedReadingOrCommunicative": "اللغة والشخصية",
              "writingOrIntegration": "اللغة والشخصية",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 19 إلى 23 أفريل"
            },
            {
              "weekNumber": 28,
              "monthNameAr": "أفريل",
              "unitNumber": 12,
              "unitTitle": "الأدب المسرحي الجزائري",
              "theme": "المسرح الجزائري وقضايا التاريخ والمقاومة",
              "literaryText": "جثة فاطمة نسومر.. المرأة الصفر",
              "grammar": "الأسلوب المباشر وغير المباشر",
              "rhetoricOrProsody": "توظيف الشخصيات التاريخية والرمز",
              "guidedReadingOrCommunicative": "المسرح الجزائري الثوري",
              "writingOrIntegration": "موازنة بين المدرسة الرومانسية والواقعية",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 26 إلى 30 أفريل"
            }
          ],
          "branchSummary": {
            "literature": [
              "الفن القصصي القصير في مواجهة التغير الاجتماعي",
              "كابوس في الظهيرة (حسين عبد الخضر)",
              "المسرح في الأدب العربي",
              "جثة فاطمة نسومر.. المرأة الصفر"
            ],
            "grammar": [
              "إعراب المتعدي إلى أكثر من مفعول"
            ],
            "rhetoric": [
              "الصراع الدرامي والحوار المسرحي",
              "توظيف الشخصيات التاريخية والرمز"
            ],
            "writing": [
              "كتابة قصة قصيرة تعالج وضعية ذات دلالة",
              "بناء وضعية إبداعية أو نقدية",
              "اللغة والشخصية",
              "موازنة بين المدرسة الرومانسية والواقعية"
            ]
          }
        },
        {
          "id": "3as-sci-may",
          "monthNameAr": "ماي",
          "monthIndex": 5,
          "semester": 3,
          "weeksCount": 2,
          "isExamPeriod": true,
          "weeks": [
            {
              "weekNumber": 29,
              "monthNameAr": "ماي",
              "unitNumber": 12,
              "unitTitle": "الأدب المسرحي الجزائري",
              "theme": "المسرح الجزائري الواقع والآفاق وتصحيح الموضوع",
              "literaryText": "المسرح الجزائري الواقع والآفاق",
              "grammar": "مراجعة شاملة لقواعد البكالوريا",
              "rhetoricOrProsody": "مراجعة شاملة لعلوم البلاغة",
              "guidedReadingOrCommunicative": "آفاق المسرح الوطني",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 03 إلى 07 ماي"
            },
            {
              "weekNumber": 30,
              "monthNameAr": "ماي",
              "unitNumber": 12,
              "unitTitle": "اختبارات الفصل الثالث (البكالوريا التجريبية)",
              "theme": "الامتحانات التجريبية الرسمية لشهادة البكالوريا لجميع الشعب العلمية",
              "literaryText": "إجراء امتحان البكالوريا التجريبية الرسمية",
              "grammar": "التصحيح النموذجي ومناقشة السلالم الرسمية",
              "rhetoricOrProsody": "المراجعة الختامية للبكالوريا",
              "guidedReadingOrCommunicative": "التصحيح النموذجي وتوزيع النتائج",
              "writingOrIntegration": "اختبارات الفصل الثالث",
              "hours": 3,
              "isExamPeriod": true,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 10 إلى 14 ماي (امتحان البكالوريا التجريبية الرسمي)"
            }
          ],
          "branchSummary": {
            "literature": [
              "المسرح الجزائري الواقع والآفاق",
              "إجراء امتحان البكالوريا التجريبية الرسمية"
            ],
            "grammar": [
              "مراجعة شاملة لقواعد البكالوريا"
            ],
            "rhetoric": [
              "مراجعة شاملة لعلوم البلاغة"
            ],
            "writing": [
              "تصحيح الموضوع",
              "اختبارات ومداولات الفصل"
            ]
          },
          "examTitle": "البكالوريا التجريبية واختتام السنة الدراسية"
        }
      ]
    }
  ]
},
  {
    "id": "3as-literary-annual-2024",
    "academicYear": "2024/2025",
    "grade": "السنة الثالثة",
    "stream": "شعبة آداب وفلسفة ولغات أجنبية (بكالوريا)",
    "subject": "اللغة العربية وآدابها",
    "weeklyHours": 6,
    "totalAnnualHours": 192,
    "trimesters": [
      {
        "trimester": 1,
        "title": "الفصل الدراسي الأول (الثلاثي الأول)",
        "monthsRange": "سبتمبر — ديسمبر",
        "weeksCount": 12,
        "hoursCount": 72,
        "months": [
          {
            "id": "3as-lit-sep",
            "monthNameAr": "سبتمبر",
            "monthIndex": 9,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 1,
                "monthNameAr": "سبتمبر",
                "unitNumber": 0,
                "unitTitle": "التقويم التشخيصي والدخول المدرسي",
                "theme": "تشخيص المكتسبات في النقد والعروض والبلاغة",
                "literaryText": "تقويم تشخيصي أولي: تحليل قصيدة كلاسيكية واستخراج الصور",
                "grammar": "مراجعة أحكام الإعراب: الجمل التي لها محل والتي لا محل لها",
                "rhetoricOrProsody": "مراجعة علم البديع والبيان ومفاتيح البحور الخليلية",
                "guidedReadingOrCommunicative": "مطالعة موجهة: الأدب وفلسفة الحياة في المنظور الحديث",
                "writingOrIntegration": "إنتاج مقال نقدي حول التجديد والتقليد في الشعر العربي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "تقويم تشخيصي"
              },
              {
                "weekNumber": 2,
                "monthNameAr": "سبتمبر",
                "unitNumber": 1,
                "unitTitle": "عصر الضعف: المدائح النبوية وشعر الزهد",
                "theme": "النزعة الدينية والزهد الصوفي ومظاهر التجديد الشكلي",
                "literaryText": "في المديح النبوي (البوصيري - نهج البردة)",
                "grammar": "إعراب المبتدأ والخبر ووجوب تقديمهما وتأخيرهما",
                "rhetoricOrProsody": "علم البيان: بلاغة التشبيه وأقسامه المعتمدة في النقد",
                "guidedReadingOrCommunicative": "عروض: بحر البسيط وتفعيلاته وزحافاته الشائعة",
                "writingOrIntegration": "النقد الأدبي: مظاهر الضعف والانحطاط في الشعر العربي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "تقويم تشخيصي أولي: تحليل قصيدة كلاسيكية واستخراج الصور",
                "في المديح النبوي (البوصيري - نهج البردة)"
              ],
              "grammar": [
                "مراجعة أحكام الإعراب: الجمل التي لها محل والتي لا محل لها",
                "إعراب المبتدأ والخبر ووجوب تقديمهما وتأخيرهما"
              ],
              "rhetoric": [
                "مراجعة علم البديع والبيان ومفاتيح البحور الخليلية",
                "علم البيان: بلاغة التشبيه وأقسامه المعتمدة في النقد"
              ],
              "writing": [
                "إنتاج مقال نقدي حول التجديد والتقليد في الشعر العربي",
                "النقد الأدبي: مظاهر الضعف والانحطاط في الشعر العربي"
              ]
            }
          },
          {
            "id": "3as-lit-oct",
            "monthNameAr": "أكتوبر",
            "monthIndex": 10,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 3,
                "monthNameAr": "أكتوبر",
                "unitNumber": 1,
                "unitTitle": "عصر الضعف: شعر الزهد والوعظ",
                "theme": "النزعة الأخلاقية في مواجهة الترف والمجون",
                "literaryText": "في الزهد والتوبة (ابن نباتة المصري)",
                "grammar": "أحكام التوابع (النعت وعطف النسق والبدل والتوكيد)",
                "rhetoricOrProsody": "الاستعارة المكنية والتصريحية وأثرهما في إبراز المعنى",
                "guidedReadingOrCommunicative": "عروض: بحر الطويل وأوزانه الشائعة في شعر المديح",
                "writingOrIntegration": "مطالعة موجهة: علماء الجزائر في عصر المماليك والعثمانيين",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 4,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "عصر الضعف: النثر العلمي المتأدب",
                "theme": "نشأة التدوين الموسوعي ومقدمة ابن خلدون ونقد التاريخ",
                "literaryText": "من أحوال النثر العلمي (مقدمة ابن خلدون: أحوال العمران البشري)",
                "grammar": "إعراب إذن وحينئذ ومعاني الحروف الظرفية",
                "rhetoricOrProsody": "علم المعاني: الأسلوب الخبري وضربه (ابتدائي، طلبي، إنكاري)",
                "guidedReadingOrCommunicative": "عروض: بحر الكامل وتطبيقاته العروضية",
                "writingOrIntegration": "النقد الأدبي: خصائص الأسلوب العلمي المتأدب والدقة اللغوية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 5,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "عصر الضعف: النثر العلمي والتصنيف الموسوعي",
                "theme": "الموسوعات العلمية عند القزويني والنويري وابن منظور",
                "literaryText": "عجائب المخلوقات وغرائب الموجودات (القزويني)",
                "grammar": "إعراب (لو ولولا ولوما) الشرطية وحالات امتناع الجواب",
                "rhetoricOrProsody": "المحسنات اللفظية والمعنوية: الجناس، السجع، الطباق، المقابلة",
                "guidedReadingOrCommunicative": "النص التواصلي: حركة التأليف الموسوعي وأسباب ازدهارها",
                "writingOrIntegration": "تحرير مقال علمي متأدب وفق النمط التفسيري الموضوعي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 6,
                "monthNameAr": "أكتوبر",
                "unitNumber": 3,
                "unitTitle": "عصر النهضة: مدرسة البعث والإحياء",
                "theme": "استنهاض التراث العربي ومحاكاة فحول الشعراء القدامى",
                "literaryText": "شعر المنفى والشكوى (محمود سامي البارودي / أحمد شوقي)",
                "grammar": "إعراب (إذ وإذا وإذن) وتطبيقاتها الامتحانية الدقيقة",
                "rhetoricOrProsody": "المجاز المرسل وعلاقاته (السببية، الجزئية، الكلية، الحالية...)",
                "guidedReadingOrCommunicative": "عروض: بحر الوافر وأوزانه وتفعيلاته",
                "writingOrIntegration": "النقد الأدبي: مدرسة الإحياء والبعث بين الاتباع والابتداع",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "في الزهد والتوبة (ابن نباتة المصري)",
                "من أحوال النثر العلمي (مقدمة ابن خلدون: أحوال العمران البشري)",
                "عجائب المخلوقات وغرائب الموجودات (القزويني)",
                "شعر المنفى والشكوى (محمود سامي البارودي / أحمد شوقي)"
              ],
              "grammar": [
                "أحكام التوابع (النعت وعطف النسق والبدل والتوكيد)",
                "إعراب إذن وحينئذ ومعاني الحروف الظرفية",
                "إعراب (لو ولولا ولوما) الشرطية وحالات امتناع الجواب",
                "إعراب (إذ وإذا وإذن) وتطبيقاتها الامتحانية الدقيقة"
              ],
              "rhetoric": [
                "الاستعارة المكنية والتصريحية وأثرهما في إبراز المعنى",
                "علم المعاني: الأسلوب الخبري وضربه (ابتدائي، طلبي، إنكاري)",
                "المحسنات اللفظية والمعنوية: الجناس، السجع، الطباق، المقابلة",
                "المجاز المرسل وعلاقاته (السببية، الجزئية، الكلية، الحالية...)"
              ],
              "writing": [
                "مطالعة موجهة: علماء الجزائر في عصر المماليك والعثمانيين",
                "النقد الأدبي: خصائص الأسلوب العلمي المتأدب والدقة اللغوية",
                "تحرير مقال علمي متأدب وفق النمط التفسيري الموضوعي",
                "النقد الأدبي: مدرسة الإحياء والبعث بين الاتباع والابتداع"
              ]
            }
          },
          {
            "id": "3as-lit-nov",
            "monthNameAr": "نوفمبر",
            "monthIndex": 11,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 7,
                "monthNameAr": "نوفمبر",
                "unitNumber": 3,
                "unitTitle": "عصر النهضة: مدرسة المهجر والرابطة القلمية",
                "theme": "فلسفة التجديد الرومانسي والهروب إلى الغاب والنزعة الإنسانية",
                "literaryText": "من شعر المنفى والمهجر (أخي - ميخائيل نعيمة)",
                "grammar": "إعراب البدل وعطف البيان والتمييز الإعرابي بينهما",
                "rhetoricOrProsody": "الكناية وبلاغتها في إعطاء الحقيقة مصحوبة بالدليل",
                "guidedReadingOrCommunicative": "عروض: بحر الخفيف وموسيقاه الهادئة",
                "writingOrIntegration": "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض محروس"
              },
              {
                "weekNumber": 8,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "مدرسة المهجر: النزعة التأملية وفلسفة الوجود",
                "theme": "الحنين إلى الوطن والنزعة الفلسفية والدعوة للمحبة",
                "literaryText": "النص الأدبي: الطين (إيليا أبو ماضي)",
                "grammar": "الجمل التي لها محل من الإعراب (الخبرية، الحالية، المفعولية)",
                "rhetoricOrProsody": "أسلوب القصر وطرقه البلاغية (النفي والاستثناء، إنما)",
                "guidedReadingOrCommunicative": "عروض: بحر المتقارب والتنويع الوزني",
                "writingOrIntegration": "مطالعة موجهة: الأدب المقارن وأثر المهجر في النهضة",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 9,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "مدرسة المهجر: النثر الفني الرومانسي",
                "theme": "الجمال الروحي والطبيعة عند جبران خليل جبران",
                "literaryText": "النص الأدبي: الغاب والحرية (جبران خليل جبران)",
                "grammar": "الجمل التي تقع مضافا إليها وجوابا لشرط جازم مقترنة بالفاء",
                "rhetoricOrProsody": "الأساليب الإنشائية الطلبية وغير الطلبية ودلالاتها النفسية",
                "guidedReadingOrCommunicative": "عروض: موسيقى الشعر الحديث والانتقال إلى التفعيلة",
                "writingOrIntegration": "النقد الأدبي: الفروق الجوهرية بين المذهب الكلاسيكي والرومانسي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 10,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "الوضعية الإدماجية النقدية الشاملة للثلاثي الأول",
                "theme": "تركيب معارف عصر الضعف ومدرسة البعث ومدرسة المهجر",
                "literaryText": "وضعية إدماجية نقدية مركبة: الشعر بين سلطان المحاكاة وروح التجديد",
                "grammar": "مراجعة إعراب إذ وإذا وحينئذ والجمل التي لها محل",
                "rhetoricOrProsody": "مراجعة البلاغة التراكمية (البيان والبديع والمعاني)",
                "guidedReadingOrCommunicative": "مراجعة العروض وتحليل قصائد البكالوريا السابقة",
                "writingOrIntegration": "حل موضوع بكالوريا تجريبي وتقييمه بالمعايير الأربعة",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "من شعر المنفى والمهجر (أخي - ميخائيل نعيمة)",
                "النص الأدبي: الطين (إيليا أبو ماضي)",
                "النص الأدبي: الغاب والحرية (جبران خليل جبران)",
                "وضعية إدماجية نقدية مركبة: الشعر بين سلطان المحاكاة وروح التجديد"
              ],
              "grammar": [
                "إعراب البدل وعطف البيان والتمييز الإعرابي بينهما",
                "الجمل التي لها محل من الإعراب (الخبرية، الحالية، المفعولية)",
                "الجمل التي تقع مضافا إليها وجوابا لشرط جازم مقترنة بالفاء",
                "مراجعة إعراب إذ وإذا وحينئذ والجمل التي لها محل"
              ],
              "rhetoric": [
                "الكناية وبلاغتها في إعطاء الحقيقة مصحوبة بالدليل",
                "أسلوب القصر وطرقه البلاغية (النفي والاستثناء، إنما)",
                "الأساليب الإنشائية الطلبية وغير الطلبية ودلالاتها النفسية",
                "مراجعة البلاغة التراكمية (البيان والبديع والمعاني)"
              ],
              "writing": [
                "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية",
                "مطالعة موجهة: الأدب المقارن وأثر المهجر في النهضة",
                "النقد الأدبي: الفروق الجوهرية بين المذهب الكلاسيكي والرومانسي",
                "حل موضوع بكالوريا تجريبي وتقييمه بالمعايير الأربعة"
              ]
            }
          },
          {
            "id": "3as-lit-dec",
            "monthNameAr": "ديسمبر",
            "monthIndex": 12,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 11,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "اختبارات الفصل الدراسي الأول (الثلاثي الأول)",
                "theme": "التقويم التحصيلي الرسمي للثلاثي الأول لشعبة الآداب والفلسفة",
                "literaryText": "موضوع اختبار اللغة العربية وآدابها (مدة 03 ساعات ونصف)",
                "grammar": "اختيار بين موضوعين: شعر كلاسيكي/مهجري ونثر علمي/مقال",
                "rhetoricOrProsody": "تطبيق سلم التنقيط الرسمي المعتمد من المفتشية العامة للبيداغوجيا",
                "guidedReadingOrCommunicative": "مراجعة المكتسبات",
                "writingOrIntegration": "التصحيح النموذجي وسلالم التقويم",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "أسبوع اختبارات الفصل الأول"
              },
              {
                "weekNumber": 12,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "التصحيح والمعالجة البيداغوجية ومجالس الأقسام",
                "theme": "استثمار نتائج الاختبارات ومعالجة التعثرات التحليلية والنقدية",
                "literaryText": "التصحيح الجماعي التفاعلي ومناقشة أوراق الإجابة",
                "grammar": "معالجة الصعوبات في التلخيص النقدي والإعراب المركب",
                "rhetoricOrProsody": "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول",
                "guidedReadingOrCommunicative": "برنامج القراءة الإثرائية للعطلة الشتوية",
                "writingOrIntegration": "بداية عطلة الشتاء المدرسية",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الشتاء",
                "notes": "عطلة الشتاء"
              }
            ],
            "branchSummary": {
              "literature": [
                "موضوع اختبار اللغة العربية وآدابها (مدة 03 ساعات ونصف)",
                "التصحيح الجماعي التفاعلي ومناقشة أوراق الإجابة"
              ],
              "grammar": [
                "اختيار بين موضوعين: شعر كلاسيكي/مهجري ونثر علمي/مقال",
                "معالجة الصعوبات في التلخيص النقدي والإعراب المركب"
              ],
              "rhetoric": [
                "تطبيق سلم التنقيط الرسمي المعتمد من المفتشية العامة للبيداغوجيا",
                "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول"
              ],
              "writing": [
                "التصحيح النموذجي وسلالم التقويم",
                "بداية عطلة الشتاء المدرسية"
              ]
            },
            "examTitle": "اختبارات الفصل الأول وعطلة الشتاء"
          }
        ]
      },
      {
        "trimester": 2,
        "title": "الفصل الدراسي الثاني (الثلاثي الثاني)",
        "monthsRange": "جانفي — مارس",
        "weeksCount": 10,
        "hoursCount": 60,
        "months": [
          {
            "id": "3as-lit-jan",
            "monthNameAr": "جانفي",
            "monthIndex": 1,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 13,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "الشعر المعاصر: القضية الفلسطينية ونكبة 1948",
                "theme": "استئناف التعلمات والبعد القومي والتحرري لفلسطين",
                "literaryText": "النص الأدبي: في سبيل فلسطين (نزار قباني / محمود درويش)",
                "grammar": "الجمل التي لا محل لها من الإعراب (الابتدائية، الصلة، الاستئنافية)",
                "rhetoricOrProsody": "مظاهر الاتساق والانسجام النحوي والمعجمي وأدوات الربط",
                "guidedReadingOrCommunicative": "عروض: موسيقى شعر التفعيلة وتطور السطر الشعري",
                "writingOrIntegration": "النقد الأدبي: مفهوم الالتزام في الشعر التحرري المعاصر",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 14,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "القضية الفلسطينية وأدب المقاومة",
                "theme": "الصمود والتحدي وكسر الحصار في شعر محمود درويش",
                "literaryText": "النص الأدبي: حالة حصار (محمود درويش - الوحدة 06 الرسمية)",
                "grammar": "الجمل الاعتراضية والتفسيرية وجواب القسم والشرط غير الجازم",
                "rhetoricOrProsody": "الرمز والأسطورة وتوظيف الموروث الديني والتاريخي في الشعر",
                "guidedReadingOrCommunicative": "عروض: التدوير في شعر التفعيلة والزحافات الجائزة",
                "writingOrIntegration": "مطالعة موجهة: إشكالية التعبير في الأدب الجزائري (محمد مصايف)",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 15,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "الشعر المعاصر: الثورة التحريرية الجزائرية الخالدة",
                "theme": "إشعاع الثورة الجزائرية في الشعر العربي ومساندة الشعوب",
                "literaryText": "النص الأدبي: في مدح الثوار الأحرار (سليمان العيسى / السياب)",
                "grammar": "إعراب المسند والمسند إليه وعلاقات الإسناد في الجملة",
                "rhetoricOrProsody": "بلاغة التضمين والاقتباس والتناص في الشعر المعاصر",
                "guidedReadingOrCommunicative": "عروض: بحر الرمل وتطبيقاته في شعر المقاومة",
                "writingOrIntegration": "النقد الأدبي: الثورة الجزائرية كملهمة للوجدان الإنساني التحرري",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 16,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "الثورة التحريرية وملحمة البطولة والشهداء",
                "theme": "النزعة الوطنية والقومية عند شاعر الثورة مفدي زكريا",
                "literaryText": "النص الأدبي: ذبائح نوفمبر وقسم الفداء (مفدي زكريا)",
                "grammar": "أحكام التمييز والحال والفرق الإعرابي الدقيق بينهما",
                "rhetoricOrProsody": "الأساليب الإنشائية غير الطلبية: المدح، الذم، التعجب، القسم",
                "guidedReadingOrCommunicative": "عروض: القافية وأنواعها في الشعر العمودي والحر",
                "writingOrIntegration": "مطالعة موجهة: ديوان اللهب المقدس لمفدي زكريا - تحليل نقدي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: في سبيل فلسطين (نزار قباني / محمود درويش)",
                "النص الأدبي: حالة حصار (محمود درويش - الوحدة 06 الرسمية)",
                "النص الأدبي: في مدح الثوار الأحرار (سليمان العيسى / السياب)",
                "النص الأدبي: ذبائح نوفمبر وقسم الفداء (مفدي زكريا)"
              ],
              "grammar": [
                "الجمل التي لا محل لها من الإعراب (الابتدائية، الصلة، الاستئنافية)",
                "الجمل الاعتراضية والتفسيرية وجواب القسم والشرط غير الجازم",
                "إعراب المسند والمسند إليه وعلاقات الإسناد في الجملة",
                "أحكام التمييز والحال والفرق الإعرابي الدقيق بينهما"
              ],
              "rhetoric": [
                "مظاهر الاتساق والانسجام النحوي والمعجمي وأدوات الربط",
                "الرمز والأسطورة وتوظيف الموروث الديني والتاريخي في الشعر",
                "بلاغة التضمين والاقتباس والتناص في الشعر المعاصر",
                "الأساليب الإنشائية غير الطلبية: المدح، الذم، التعجب، القسم"
              ],
              "writing": [
                "النقد الأدبي: مفهوم الالتزام في الشعر التحرري المعاصر",
                "مطالعة موجهة: إشكالية التعبير في الأدب الجزائري (محمد مصايف)",
                "النقد الأدبي: الثورة الجزائرية كملهمة للوجدان الإنساني التحرري",
                "مطالعة موجهة: ديوان اللهب المقدس لمفدي زكريا - تحليل نقدي"
              ]
            }
          },
          {
            "id": "3as-lit-feb",
            "monthNameAr": "فيفري",
            "monthIndex": 2,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 17,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "الشعر المعاصر: ظاهرة الحزن والألم والغربة",
                "theme": "واقع النكسة والخيبة والانكسار الوجودي عند رواد الشعر الحر",
                "literaryText": "النص الأدبي: أحزان في شوارع المدينة (نازك الملائكة / السياب)",
                "grammar": "إعراب (أيّ) بأنواعها الستة (الاستفهامية، الشرطية، الموصولة...)",
                "rhetoricOrProsody": "الرمز الفني والصورة الشعرية الكلية والمشهدية",
                "guidedReadingOrCommunicative": "عروض: تفعيلات البحور الصافية (مفاعيلن، مستفعلن، فاعلاتن)",
                "writingOrIntegration": "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الفصل الثاني"
              },
              {
                "weekNumber": 18,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "الشعر المعاصر: ظاهرة الرمز والأسطورة",
                "theme": "استدعاء الأساطير القديمة (السندباد، تموز، سيزيف، عشتار) للتعبير",
                "literaryText": "النص الأدبي: رحلة إلى المنفى والمجهول (صلاح عبد الصبور / خليل حاوي)",
                "grammar": "أحكام الحروف المشبهة بالفعل وزيادة (ما) الكافة",
                "rhetoricOrProsody": "الإيحاء والدلالة الرمزية والعمق الصوفي في الشعر الحديث",
                "guidedReadingOrCommunicative": "عروض: الوزن النغمي والتحرر من رتابة القافية الموحدة",
                "writingOrIntegration": "النقد الأدبي: أسباب ولادة الشعر الحر ورواده (نازك الملائكة والسياب)",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 19,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "النثر المعاصر: فن المقال ورواده في الجزائر والعالم العربي",
                "theme": "أدب المقالة الصحفية والإصلاحية ودور البشير الإبراهيمي وطه حسين",
                "literaryText": "النص الأدبي: من مقالات البشير الإبراهيمي (آثار الإمام الإبراهيمي)",
                "grammar": "أحكام التوكيد والإبدال والبيان وعلاقات الاتساق النحوي",
                "rhetoricOrProsody": "النمط الحجاجي والتفسيري وتقنيات الدحض والمحاججة",
                "guidedReadingOrCommunicative": "مطالعة موجهة: تاريخ الصحافة الجزائرية ودور جريدة البصائر",
                "writingOrIntegration": "تلخيص مقال الإبراهيمي وفق منهجية التلخيص التفتيشية المعتمدة",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 20,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "الوضعية الإدماجية النقدية الكبرى للثلاثي الثاني",
                "theme": "إدماج شامل: الشعر المعاصر (فلسطين، الثورة، الرمز) وفن المقال",
                "literaryText": "وضعية إدماجية نقدية: النقد الأدبي المعاصر وتحليل الظواهر الفنية",
                "grammar": "مراجعة الجمل التي لها محل والتي لا محل لها من الإعراب",
                "rhetoricOrProsody": "مراجعة الصور البيانية والمحسنات وأساليب الإنشاء",
                "guidedReadingOrCommunicative": "مراجعة العروض الحديث وموسيقى شعر التفعيلة",
                "writingOrIntegration": "حل ومناقشة موضوع بكالوريا دورة سابقة لشعبة الآداب والفلسفة",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: أحزان في شوارع المدينة (نازك الملائكة / السياب)",
                "النص الأدبي: رحلة إلى المنفى والمجهول (صلاح عبد الصبور / خليل حاوي)",
                "النص الأدبي: من مقالات البشير الإبراهيمي (آثار الإمام الإبراهيمي)",
                "وضعية إدماجية نقدية: النقد الأدبي المعاصر وتحليل الظواهر الفنية"
              ],
              "grammar": [
                "إعراب (أيّ) بأنواعها الستة (الاستفهامية، الشرطية، الموصولة...)",
                "أحكام الحروف المشبهة بالفعل وزيادة (ما) الكافة",
                "أحكام التوكيد والإبدال والبيان وعلاقات الاتساق النحوي",
                "مراجعة الجمل التي لها محل والتي لا محل لها من الإعراب"
              ],
              "rhetoric": [
                "الرمز الفني والصورة الشعرية الكلية والمشهدية",
                "الإيحاء والدلالة الرمزية والعمق الصوفي في الشعر الحديث",
                "النمط الحجاجي والتفسيري وتقنيات الدحض والمحاججة",
                "مراجعة الصور البيانية والمحسنات وأساليب الإنشاء"
              ],
              "writing": [
                "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية",
                "النقد الأدبي: أسباب ولادة الشعر الحر ورواده (نازك الملائكة والسياب)",
                "تلخيص مقال الإبراهيمي وفق منهجية التلخيص التفتيشية المعتمدة",
                "حل ومناقشة موضوع بكالوريا دورة سابقة لشعبة الآداب والفلسفة"
              ]
            }
          },
          {
            "id": "3as-lit-mar",
            "monthNameAr": "مارس",
            "monthIndex": 3,
            "semester": 2,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 21,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "اختبارات الفصل الدراسي الثاني (الثلاثي الثاني)",
                "theme": "الامتحانات الفصلية الرسمية المطابقة التامة لمواصفات البكالوريا",
                "literaryText": "إجراء اختبار اللغة العربية وآدابها لشعبة الآداب واللغات (03 سا و30 د)",
                "grammar": "موضوعان اختياريان بنظام السلالم الوزارية والتنقيط المفصل",
                "rhetoricOrProsody": "تطبيق شبكة التقويم النقدي بالمعايير الأربعة المعتمدة",
                "guidedReadingOrCommunicative": "مراجعة المكتسبات",
                "writingOrIntegration": "التصحيح النموذجي ومناقشة النتائج",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "اختبارات الفصل الثاني"
              },
              {
                "weekNumber": 22,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "التصحيح والمعالجة ومجالس الأقسام وعطلة الربيع",
                "theme": "المعالجة البيداغوجية لمواطن القصور في البناء الفكري واللغوي والتقويم النقدي",
                "literaryText": "التصحيح الجماعي المعمق وتوزيع نماذج الإجابات الوزارية",
                "grammar": "تسليم كشوف النقاط للثلاثي الثاني + مجالس الأساتذة",
                "rhetoricOrProsody": "توجيهات استثمار عطلة الربيع في مراجعة محاور البكالوريا الكبرى",
                "guidedReadingOrCommunicative": "بداية عطلة الربيع المدرسية",
                "writingOrIntegration": "عطلة الربيع",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الربيع",
                "notes": "عطلة الربيع"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار اللغة العربية وآدابها لشعبة الآداب واللغات (03 سا و30 د)",
                "التصحيح الجماعي المعمق وتوزيع نماذج الإجابات الوزارية"
              ],
              "grammar": [
                "موضوعان اختياريان بنظام السلالم الوزارية والتنقيط المفصل",
                "تسليم كشوف النقاط للثلاثي الثاني + مجالس الأساتذة"
              ],
              "rhetoric": [
                "تطبيق شبكة التقويم النقدي بالمعايير الأربعة المعتمدة",
                "توجيهات استثمار عطلة الربيع في مراجعة محاور البكالوريا الكبرى"
              ],
              "writing": [
                "التصحيح النموذجي ومناقشة النتائج",
                "عطلة الربيع"
              ]
            },
            "examTitle": "اختبارات الفصل الثاني وعطلة الربيع"
          }
        ]
      },
      {
        "trimester": 3,
        "title": "الفصل الدراسي الثالث (الثلاثي الثالث ومراجعة البكالوريا الكبرى)",
        "monthsRange": "أفريل — جوان",
        "weeksCount": 10,
        "hoursCount": 60,
        "months": [
          {
            "id": "3as-lit-apr",
            "monthNameAr": "أفريل",
            "monthIndex": 4,
            "semester": 3,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 23,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "فن المسرحية في الأدب العربي المعاصر",
                "theme": "استئناف التعلمات وتطور الفن الدرامي الشعري والنثري",
                "literaryText": "النص الأدبي: من المسرح الشعري (مصرع كليوباترا - أحمد شوقي)",
                "grammar": "أحكام العدد والمعدود وتمييزه وإعرابه بدقة",
                "rhetoricOrProsody": "الصراع الدرامي وتطور الحبكة في النص المسرحي",
                "guidedReadingOrCommunicative": "عروض: مراجعة بحور الشعر العمودي وشعر التفعيلة",
                "writingOrIntegration": "النقد الأدبي: نشأة المسرح في الأدب العربي وتحديات التعريب",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 24,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "فن القصة والرواية في الأدب الجزائري الحديث",
                "theme": "السرد القصصي ودوره في تصوير الواقع الاجتماعي والوطني",
                "literaryText": "النص الأدبي: القصة الجزائرية القصيرة (أحمد رضا حوحو / الطاهر وطار)",
                "grammar": "أحكام الاستثناء (إلا، غير، سوى، خلا، عدا، حاشا) وإعراب المستثنى",
                "rhetoricOrProsody": "تقنيات السرد والوصف والحوار الداخلي والمفارقة القصصية",
                "guidedReadingOrCommunicative": "مطالعة موجهة: ثلاثية محمد ديب أو روايات الطاهر وطار",
                "writingOrIntegration": "كتابة قصة قصيرة أو مشهد مسرحي يعالج قضية وطنية أو اجتماعية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 25,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "المراجعة المنهجية الكبرى: النصوص النثرية والتقويم النقدي",
                "theme": "التمكن الكامل من معايير البكالوريا: النثر العلمي، المقال، المسرح",
                "literaryText": "حل مواضيع بكالوريا رسمية وتحليلها فكريا ولغويا ونقديا",
                "grammar": "مراجعة شاملة لجميع قواعد النحو المقررة في البكالوريا",
                "rhetoricOrProsody": "مراجعة مظاهر الاتساق والانسجام وأدوات التماسك النصي",
                "guidedReadingOrCommunicative": "شروط التلخيص الوزارية المعتمدة وتقنيات تقليص النص إلى الربع",
                "writingOrIntegration": "كتابة فقرات التقويم النقدي حول المدارس والظواهر الأدبية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 26,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "المراجعة المنهجية الكبرى: النصوص الشعرية والعروض",
                "theme": "التمكن من الشعر القديم والحديث والحر والتحليل البلاغي والعروضي",
                "literaryText": "حل مواضيع بكالوريا شعرية (مدائح، مهجر، فلسطين، الثورة، الحزن)",
                "grammar": "مراجعة شاملة للصور البيانية والأساليب الإنشائية والمحسنات",
                "rhetoricOrProsody": "مراجعة النزعات والقيم والمشاعر والعواطف ومؤشراتها النصية",
                "guidedReadingOrCommunicative": "مراجعة التقطيع العروضي وبحور الشعر وتفعيلات الشعر الحر",
                "writingOrIntegration": "فرض الثلاثي الثالث المحروس + التصحيح الفوري والمعالجة",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الثالث"
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: من المسرح الشعري (مصرع كليوباترا - أحمد شوقي)",
                "النص الأدبي: القصة الجزائرية القصيرة (أحمد رضا حوحو / الطاهر وطار)",
                "حل مواضيع بكالوريا رسمية وتحليلها فكريا ولغويا ونقديا",
                "حل مواضيع بكالوريا شعرية (مدائح، مهجر، فلسطين، الثورة، الحزن)"
              ],
              "grammar": [
                "أحكام العدد والمعدود وتمييزه وإعرابه بدقة",
                "أحكام الاستثناء (إلا، غير، سوى، خلا، عدا، حاشا) وإعراب المستثنى",
                "مراجعة شاملة لجميع قواعد النحو المقررة في البكالوريا",
                "مراجعة شاملة للصور البيانية والأساليب الإنشائية والمحسنات"
              ],
              "rhetoric": [
                "الصراع الدرامي وتطور الحبكة في النص المسرحي",
                "تقنيات السرد والوصف والحوار الداخلي والمفارقة القصصية",
                "مراجعة مظاهر الاتساق والانسجام وأدوات التماسك النصي",
                "مراجعة النزعات والقيم والمشاعر والعواطف ومؤشراتها النصية"
              ],
              "writing": [
                "النقد الأدبي: نشأة المسرح في الأدب العربي وتحديات التعريب",
                "كتابة قصة قصيرة أو مشهد مسرحي يعالج قضية وطنية أو اجتماعية",
                "كتابة فقرات التقويم النقدي حول المدارس والظواهر الأدبية",
                "فرض الثلاثي الثالث المحروس + التصحيح الفوري والمعالجة"
              ]
            }
          },
          {
            "id": "3as-lit-may",
            "monthNameAr": "ماي",
            "monthIndex": 5,
            "semester": 3,
            "weeksCount": 3,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 27,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "امتحان البكالوريا التجريبية (البكالوريا البيضاء)",
                "theme": "المحاكاة الرسمية الشاملة لظروف امتحان شهادة البكالوريا لشعبة الآداب",
                "literaryText": "إجراء اختبار البكالوريا التجريبية (مدة 03 ساعات ونصف)",
                "grammar": "الموضوع الأول: شعر حديث أو معاصر (فلسطين/الثورة/الرمز والأسطورة)",
                "rhetoricOrProsody": "الموضوع الثاني: نثر معاصر أو علمي (المقال الإصلاحي/المسرحية)",
                "guidedReadingOrCommunicative": "تطبيق نظام التصحيح المزدوج وسلم التنقيط التفتيشي الوزاري",
                "writingOrIntegration": "أسبوع البكالوريا التجريبية الرسمي على مستوى الثانوية",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "البكالوريا البيضاء"
              },
              {
                "weekNumber": 28,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "التصحيح النموذجي للبكالوريا التجريبية والمعالجة البيداغوجية",
                "theme": "المعالجة الختامية وتدارك الأخطاء الشائعة قبل الموعد الرسمي",
                "literaryText": "التصحيح النموذجي المفصل للتقويم النقدي والبناء الفكري واللغوي",
                "grammar": "ورشة بيداغوجية: كيفية قراءة الموضوعين واختيار الأنسب خلال 30 دقيقة",
                "rhetoricOrProsody": "إرشادات نفسية ومنهجية لإدارة الوقت والتركيز في قاعة الامتحان",
                "guidedReadingOrCommunicative": "توزيع المخططات الذهنية الشاملة لكافة قواعد ومصطلحات البكالوريا",
                "writingOrIntegration": "حصص مراجعة ختامية مفتوحة للأسئلة والاستفسارات",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 29,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "اختبارات الفصل الثالث ومجالس الأقسام والتوديع",
                "theme": "اختبارات نهاية السنة للأقسام ومجالس الأساتذة والمداولات",
                "literaryText": "استكمال كافة السجلات الإدارية ودفاتر النصوص والمذكرات",
                "grammar": "مداولات نهاية الموسم الدراسي ومجالس القبول والتوجيه",
                "rhetoricOrProsody": "جلسة توجيه ودعاء بالتوفيق للمترشحين لامتحان شهادة البكالوريا",
                "guidedReadingOrCommunicative": "تحضير مراكز الإجراء وتجهيز القاعات للامتحان الوطني",
                "writingOrIntegration": "اختتام الدروس النظامية",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "اختبارات الفصل الثالث ومجالس الأقسام"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار البكالوريا التجريبية (مدة 03 ساعات ونصف)",
                "التصحيح النموذجي المفصل للتقويم النقدي والبناء الفكري واللغوي",
                "استكمال كافة السجلات الإدارية ودفاتر النصوص والمذكرات"
              ],
              "grammar": [
                "الموضوع الأول: شعر حديث أو معاصر (فلسطين/الثورة/الرمز والأسطورة)",
                "ورشة بيداغوجية: كيفية قراءة الموضوعين واختيار الأنسب خلال 30 دقيقة",
                "مداولات نهاية الموسم الدراسي ومجالس القبول والتوجيه"
              ],
              "rhetoric": [
                "الموضوع الثاني: نثر معاصر أو علمي (المقال الإصلاحي/المسرحية)",
                "إرشادات نفسية ومنهجية لإدارة الوقت والتركيز في قاعة الامتحان",
                "جلسة توجيه ودعاء بالتوفيق للمترشحين لامتحان شهادة البكالوريا"
              ],
              "writing": [
                "أسبوع البكالوريا التجريبية الرسمي على مستوى الثانوية",
                "حصص مراجعة ختامية مفتوحة للأسئلة والاستفسارات",
                "اختتام الدروس النظامية"
              ]
            },
            "examTitle": "البكالوريا التجريبية ونهاية السنة"
          },
          {
            "id": "3as-lit-jun",
            "monthNameAr": "جوان",
            "monthIndex": 6,
            "semester": 3,
            "weeksCount": 1,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 30,
                "monthNameAr": "جوان",
                "unitNumber": 10,
                "unitTitle": "امتحان شهادة البكالوريا الرسمي (Session BAC)",
                "theme": "العرس التربوي الوطني - إجراء امتحان شهادة البكالوريا الرسمي",
                "literaryText": "إجراء امتحان مادة اللغة العربية وآدابها لشعبة الآداب والفلسفة واللغات",
                "grammar": "مراكز الإجراء والتصحيح المعتمدة من الديوان الوطني للامتحانات والمسابقات",
                "rhetoricOrProsody": "المداولات الرسمية وإعلان نتائج شهادة البكالوريا",
                "guidedReadingOrCommunicative": "تتويج جهود السنة الدراسية بالنجاح والتميز",
                "writingOrIntegration": "نهاية الموسم الدراسي 2024/2025",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "امتحان شهادة البكالوريا",
                "notes": "امتحان شهادة البكالوريا الرسمي"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء امتحان مادة اللغة العربية وآدابها لشعبة الآداب والفلسفة واللغات"
              ],
              "grammar": [
                "مراكز الإجراء والتصحيح المعتمدة من الديوان الوطني للامتحانات والمسابقات"
              ],
              "rhetoric": [
                "المداولات الرسمية وإعلان نتائج شهادة البكالوريا"
              ],
              "writing": [
                "نهاية الموسم الدراسي 2024/2025"
              ]
            },
            "examTitle": "امتحان شهادة البكالوريا الرسمي"
          }
        ]
      }
    ]
  },
  {
    "id": "2as-scientific-annual-2024",
    "academicYear": "2024/2025",
    "grade": "السنة الثانية",
    "stream": "شعب علمية ورياضية مشتركة (علوم/رياضيات/تقني/تسيير)",
    "subject": "اللغة العربية وآدابها",
    "weeklyHours": 3,
    "totalAnnualHours": 96,
    "trimesters": [
      {
        "trimester": 1,
        "title": "الفصل الدراسي الأول (الثلاثي الأول: العصر العباسي الأول)",
        "monthsRange": "سبتمبر — ديسمبر",
        "weeksCount": 12,
        "hoursCount": 36,
        "months": [
          {
            "id": "2as-sci-sep",
            "monthNameAr": "سبتمبر",
            "monthIndex": 9,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 1,
                "monthNameAr": "سبتمبر",
                "unitNumber": 0,
                "unitTitle": "التقويم التشخيصي والدخول المدرسي",
                "theme": "تشخيص المكتسبات القبلية للسنة الأولى ثانوي",
                "literaryText": "تقويم تشخيصي: قراءة نص أدبي واستخراج الأفكار والأنماط",
                "grammar": "مراجعة الجملة الفعلية والاسمية وأحكام النواسخ",
                "rhetoricOrProsody": "مراجعة الصور البيانية (التشبيه والاستعارة)",
                "guidedReadingOrCommunicative": "التقويم الذاتي للمكتسبات المعرفية والمنهجية",
                "writingOrIntegration": "إنتاج فقرة حول أثر التطور العلمي في صياغة الفكر الإنساني",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "تقويم تشخيصي"
              },
              {
                "weekNumber": 2,
                "monthNameAr": "سبتمبر",
                "unitNumber": 1,
                "unitTitle": "العصر العباسي الأول: النزعة العقلية في الشعر",
                "theme": "تأثير حركة الترجمة والعلوم والفلسفة في الشعر العربي",
                "literaryText": "النص الأدبي: النزعة العقلية في الشعر (بشار بن برد / أبو تمام)",
                "grammar": "معاني حروف الجر ودلالاتها في السياق",
                "rhetoricOrProsody": "الاستعارة التمثيلية وبلاغتها في نقل المعنى",
                "guidedReadingOrCommunicative": "النص التواصلي: حركة الترجمة وأثرها في الفكر العربي",
                "writingOrIntegration": "تلخيص النص الأدبي مع إبراز مظاهر النزعة العقلية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "تقويم تشخيصي: قراءة نص أدبي واستخراج الأفكار والأنماط",
                "النص الأدبي: النزعة العقلية في الشعر (بشار بن برد / أبو تمام)"
              ],
              "grammar": [
                "مراجعة الجملة الفعلية والاسمية وأحكام النواسخ",
                "معاني حروف الجر ودلالاتها في السياق"
              ],
              "rhetoric": [
                "مراجعة الصور البيانية (التشبيه والاستعارة)",
                "الاستعارة التمثيلية وبلاغتها في نقل المعنى"
              ],
              "writing": [
                "إنتاج فقرة حول أثر التطور العلمي في صياغة الفكر الإنساني",
                "تلخيص النص الأدبي مع إبراز مظاهر النزعة العقلية"
              ]
            }
          },
          {
            "id": "2as-sci-oct",
            "monthNameAr": "أكتوبر",
            "monthIndex": 10,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 3,
                "monthNameAr": "أكتوبر",
                "unitNumber": 1,
                "unitTitle": "العصر العباسي الأول: النزعة العقلية (متابعة)",
                "theme": "العمق الفلسفي والمنطقي في بناء المعاني الشعرية",
                "literaryText": "النص الأدبي: في الحكمة والمنطق الشعري (أبو تمام / ابن الرومي)",
                "grammar": "معاني حروف العطف وأحكام الترتيب والتعقيب والتراخي",
                "rhetoricOrProsody": "المحسنات المعنوية: الطباق والمقابلة وأثرهما الفكري",
                "guidedReadingOrCommunicative": "مطالعة موجهة: بيت الحكمة ودور العلماء في بغداد",
                "writingOrIntegration": "تحرير فقرة حجاجية تبرز أهمية العقل في التمييز بين الحق والباطل",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 4,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "العصر العباسي: الدعوة إلى التجديد وسخرية الجاحظ",
                "theme": "مظاهر التجديد الشعري والنثري ومحاربة الركود والتقليد",
                "literaryText": "النص الأدبي: الدعوة إلى التجديد وسخرية الجاحظ (أبو نواس / الجاحظ)",
                "grammar": "صيغ المبالغة وأوزانها القياسية وعملها",
                "rhetoricOrProsody": "بلاغة التشبيه المقلوب والتشبيه الضمني",
                "guidedReadingOrCommunicative": "النص التواصلي: الصراع بين القدماء والمحدثين في العصر العباسي",
                "writingOrIntegration": "تلخيص نص الجاحظ بأسلوب التلميذ مع مراعاة الدقة",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 5,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "العصر العباسي: فن الوصف ومظاهر الحضارة",
                "theme": "وصف القصور والرياض والبرك ومظاهر العمران العباسي",
                "literaryText": "النص الأدبي: وصف بركة المتوكل (البحتري)",
                "grammar": "اسم الفاعل واسم المفعول وعملهما الإعرابي",
                "rhetoricOrProsody": "الاستعارة التشخيصية والمكنية في تصوير الجمادات",
                "guidedReadingOrCommunicative": "مطالعة موجهة: من نوادر البخلاء للجاحظ",
                "writingOrIntegration": "كتابة نص وصفي يصور معلما معماريا أو مشهدا طبيعيا بديعا",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 6,
                "monthNameAr": "أكتوبر",
                "unitNumber": 3,
                "unitTitle": "العصر العباسي: شعر الزهد والحكمة والوعظ",
                "theme": "رد الفعل الأخلاقي والروحي في مواجهة الترف واللهو",
                "literaryText": "النص الأدبي: في الزهد والوعظ (أبو العتاهية)",
                "grammar": "أسلوب الإغراء والتحذير وأحكامهما الإعرابية",
                "rhetoricOrProsody": "الأساليب الإنشائية الطلبية: أسلوب الأمر وأغراضه البلاغية المجازية",
                "guidedReadingOrCommunicative": "النص التواصلي: أسباب انتشار شعر الزهد في المجتمع العباسي",
                "writingOrIntegration": "تحليل نص أبي العتاهية واستخراج المؤشرات الإيعازية والوعظية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: في الحكمة والمنطق الشعري (أبو تمام / ابن الرومي)",
                "النص الأدبي: الدعوة إلى التجديد وسخرية الجاحظ (أبو نواس / الجاحظ)",
                "النص الأدبي: وصف بركة المتوكل (البحتري)",
                "النص الأدبي: في الزهد والوعظ (أبو العتاهية)"
              ],
              "grammar": [
                "معاني حروف العطف وأحكام الترتيب والتعقيب والتراخي",
                "صيغ المبالغة وأوزانها القياسية وعملها",
                "اسم الفاعل واسم المفعول وعملهما الإعرابي",
                "أسلوب الإغراء والتحذير وأحكامهما الإعرابية"
              ],
              "rhetoric": [
                "المحسنات المعنوية: الطباق والمقابلة وأثرهما الفكري",
                "بلاغة التشبيه المقلوب والتشبيه الضمني",
                "الاستعارة التشخيصية والمكنية في تصوير الجمادات",
                "الأساليب الإنشائية الطلبية: أسلوب الأمر وأغراضه البلاغية المجازية"
              ],
              "writing": [
                "تحرير فقرة حجاجية تبرز أهمية العقل في التمييز بين الحق والباطل",
                "تلخيص نص الجاحظ بأسلوب التلميذ مع مراعاة الدقة",
                "كتابة نص وصفي يصور معلما معماريا أو مشهدا طبيعيا بديعا",
                "تحليل نص أبي العتاهية واستخراج المؤشرات الإيعازية والوعظية"
              ]
            }
          },
          {
            "id": "2as-sci-nov",
            "monthNameAr": "نوفمبر",
            "monthIndex": 11,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 7,
                "monthNameAr": "نوفمبر",
                "unitNumber": 3,
                "unitTitle": "العصر العباسي: شعر الزهد (متابعة)",
                "theme": "الدعوة إلى الفضيلة والعمل الصالح ومحاسبة النفس",
                "literaryText": "النص الأدبي: الحكمة والاتعاظ (صالح بن عبد القدوس / أبو العتاهية)",
                "grammar": "أسلوب النهي وأغراضه البلاغية المجازية (النصح، الالتماس، التحقير)",
                "rhetoricOrProsody": "المجاز المرسل وعلاقاته في التراكيب الزهدية",
                "guidedReadingOrCommunicative": "مطالعة موجهة: مواقف وعبر من تراثنا الإسلامي والتربوي",
                "writingOrIntegration": "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الأول"
              },
              {
                "weekNumber": 8,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "العصر العباسي: نشأة النثر العلمي والنقد الأدبي",
                "theme": "ظهور الكتابة العلمية الدقيقة والرسائل الأدبية النقدية",
                "literaryText": "النص الأدبي: من رسائل الجاحظ (رسالة التربيع والتدوير / الحيوان)",
                "grammar": "أسلوب التعجب بصيغتيه القياسيتين (ما أفعله وأفعل به)",
                "rhetoricOrProsody": "الاستفهام المجازي وأغراضه (الإنكار، التقرير، التوبيخ)",
                "guidedReadingOrCommunicative": "النص التواصلي: نشأة النقد الأدبي والرسائل الإخوانية والديوانية",
                "writingOrIntegration": "إنتاج نص حجاجي تفسيري يعالج قضية علمية باصطلاح دقيق",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 9,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "العصر العباسي: النثر الأدبي والقصص الرمزي",
                "theme": "كليلة ودمنة والحكمة الإنسانية على ألسنة الحيوان",
                "literaryText": "النص الأدبي: من حكايات كليلة ودمنة (ابن المقفع)",
                "grammar": "أسلوب الاختصاص وأحكامه الإعرابية",
                "rhetoricOrProsody": "الكناية عن صفة وموصوف ونسبة وسر جمالها",
                "guidedReadingOrCommunicative": "مطالعة موجهة: فلسفة ابن المقفع ومحنته الأدبية والسياسية",
                "writingOrIntegration": "تلخيص حكاية رمزية واستنباط المغزى الأخلاقي والتربوي منها",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 10,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "الوضعية الإدماجية التقييمية للثلاثي الأول",
                "theme": "إدماج شامل لموارد العصر العباسي الأول وقواعد النحو والبلاغة",
                "literaryText": "وضعية إدماجية مركبة: النزعة العقلية والتجديد في الأدب العباسي",
                "grammar": "مراجعة معاني حروف الجر والعطف وصيغ المبالغة والإغراء والتحذير",
                "rhetoricOrProsody": "مراجعة الصور البيانية والأساليب الإنشائية ومحسنات البديع",
                "guidedReadingOrCommunicative": "تقييم الإنتاج الكتابي بشبكة المعايير الرسمية المعتمدة",
                "writingOrIntegration": "حل ومناقشة موضوع نموذجي شامل للثلاثي الأول في القسم",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: الحكمة والاتعاظ (صالح بن عبد القدوس / أبو العتاهية)",
                "النص الأدبي: من رسائل الجاحظ (رسالة التربيع والتدوير / الحيوان)",
                "النص الأدبي: من حكايات كليلة ودمنة (ابن المقفع)",
                "وضعية إدماجية مركبة: النزعة العقلية والتجديد في الأدب العباسي"
              ],
              "grammar": [
                "أسلوب النهي وأغراضه البلاغية المجازية (النصح، الالتماس، التحقير)",
                "أسلوب التعجب بصيغتيه القياسيتين (ما أفعله وأفعل به)",
                "أسلوب الاختصاص وأحكامه الإعرابية",
                "مراجعة معاني حروف الجر والعطف وصيغ المبالغة والإغراء والتحذير"
              ],
              "rhetoric": [
                "المجاز المرسل وعلاقاته في التراكيب الزهدية",
                "الاستفهام المجازي وأغراضه (الإنكار، التقرير، التوبيخ)",
                "الكناية عن صفة وموصوف ونسبة وسر جمالها",
                "مراجعة الصور البيانية والأساليب الإنشائية ومحسنات البديع"
              ],
              "writing": [
                "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية",
                "إنتاج نص حجاجي تفسيري يعالج قضية علمية باصطلاح دقيق",
                "تلخيص حكاية رمزية واستنباط المغزى الأخلاقي والتربوي منها",
                "حل ومناقشة موضوع نموذجي شامل للثلاثي الأول في القسم"
              ]
            }
          },
          {
            "id": "2as-sci-dec",
            "monthNameAr": "ديسمبر",
            "monthIndex": 12,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 11,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "اختبارات الفصل الدراسي الأول (الثلاثي الأول)",
                "theme": "التقويم التحصيلي الرسمي لجميع مواد التعليم الثانوي لمقرر الثلاثي الأول",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها للسنوات الثانية علمي",
                "grammar": "تطبيق سلم التنقيط المعتمد والمعايير البيداغوجية التفتيشية",
                "rhetoricOrProsody": "مراجعة المكتسبات",
                "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة النتائج",
                "writingOrIntegration": "اختبارات الفصل الأول",
                "hours": 3,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 12,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "التصحيح والمعالجة ومجالس الأقسام وعطلة الشتاء",
                "theme": "استثمار نتائج الاختبارات ومعالجة التعثرات الفردية والجماعية",
                "literaryText": "التصحيح الجماعي المفصل وتوزيع أوراق الاختبارات على التلاميذ",
                "grammar": "حصص المعالجة البيداغوجية للنقاط الصعبة في الإعراب والتحليل",
                "rhetoricOrProsody": "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول",
                "guidedReadingOrCommunicative": "توجيهات التحضير لأدب الأندلس والمغرب في الثلاثي الثاني",
                "writingOrIntegration": "بداية عطلة الشتاء المدرسية الرسمية",
                "hours": 3,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الشتاء",
                "notes": "عطلة الشتاء"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار مادة اللغة العربية وآدابها للسنوات الثانية علمي",
                "التصحيح الجماعي المفصل وتوزيع أوراق الاختبارات على التلاميذ"
              ],
              "grammar": [
                "تطبيق سلم التنقيط المعتمد والمعايير البيداغوجية التفتيشية",
                "حصص المعالجة البيداغوجية للنقاط الصعبة في الإعراب والتحليل"
              ],
              "rhetoric": [
                "مراجعة المكتسبات",
                "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول"
              ],
              "writing": [
                "اختبارات ومداولات الفصل",
                "بداية عطلة الشتاء المدرسية الرسمية"
              ]
            },
            "examTitle": "اختبارات الفصل الأول وعطلة الشتاء"
          }
        ]
      },
      {
        "trimester": 2,
        "title": "الفصل الدراسي الثاني (الثلاثي الثاني: العصر العباسي الثاني وأدب الأندلس)",
        "monthsRange": "جانفي — مارس",
        "weeksCount": 10,
        "hoursCount": 30,
        "months": [
          {
            "id": "2as-sci-jan",
            "monthNameAr": "جانفي",
            "monthIndex": 1,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 13,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "العصر العباسي الثاني: شعر الحماسة والجهاد والفروسية",
                "theme": "استئناف التعلمات وتصوير بطولات المسلمين وصدهم للأخطار",
                "literaryText": "النص الأدبي: شعر الحماسة والبطولة (فتح عمورية - أبو تمام / المتنبي)",
                "grammar": "المصدر الميمي واسم المرة واسم الهيئة وأوزانها القياسية",
                "rhetoricOrProsody": "الطباق والمقابلة وأثرهما في جلاء المعنى وتأكيده",
                "guidedReadingOrCommunicative": "النص التواصلي: معارك المسلمين في الشعر العباسي الثاني",
                "writingOrIntegration": "تلخيص قصيدة الحماسة مع إبراز القيم العسكرية والإيمانية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 14,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "العصر العباسي الثاني: حكمة المتنبي وكبرياؤه الشعري",
                "theme": "الاعتداد بالنفس وفلسفة القوة والخلود عند المتنبي",
                "literaryText": "النص الأدبي: حكمة المتنبي وفخره (المتنبي - واحر قلباه)",
                "grammar": "اسم المكان واسم الزمان وصياغتهما من الثلاثي وغير الثلاثي",
                "rhetoricOrProsody": "الأساليب الإنشائية غير الطلبية: صيغ المدح والذم والتعجب والقسم",
                "guidedReadingOrCommunicative": "مطالعة موجهة: سيرة المتنبي وملحمة الطموح الأدبي",
                "writingOrIntegration": "كتابة نص حجاجي يناقش فكرة: هل القوة في السلاح أم في العقل؟",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 15,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "أدب الأندلس: شعر الطبيعة ووصف البيئة الساحرة",
                "theme": "خصوصية الفردوس الأندلسي وأثر الطبيعة الخلابة في إبداع الشعراء",
                "literaryText": "النص الأدبي: وصف الطبيعة الأندلسية (ابن خفاجة الأندلسي / ابن هانئ)",
                "grammar": "أسلوب المدح والذم (نعم وبئس وساء وحبذا ولا حبذا)",
                "rhetoricOrProsody": "الاستعارة التشخيصية وبث الحياة في عناصر الطبيعة الصامتة",
                "guidedReadingOrCommunicative": "النص التواصلي: البيئة الأندلسية وامتزاج الحضارات والثقافات",
                "writingOrIntegration": "إنتاج نص وصفي بديع يرسم لوحة فنية لجمال الطبيعة الجزائرية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 16,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "أدب الأندلس: التنازع والظواهر الإعرابية الخاصة",
                "theme": "متابعة وصف الرياض والأنهار والأزهار في الشعر الأندلسي",
                "literaryText": "النص الأدبي: في وصف الرياض والأزهار (ابن الزقاق البلنسي)",
                "grammar": "التنازع في العمل النحوي وأحكامه عند البصريين والكوفيين",
                "rhetoricOrProsody": "التشبيه التمثيلي في رسم الصور الشعرية الأندلسية الملونة",
                "guidedReadingOrCommunicative": "مطالعة موجهة: مظاهر الحضارة الإسلامية في قرطبة وغرناطة",
                "writingOrIntegration": "تلخيص مقال حول أثر الحضارة الأندلسية في النهضة الأوروبية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: شعر الحماسة والبطولة (فتح عمورية - أبو تمام / المتنبي)",
                "النص الأدبي: حكمة المتنبي وفخره (المتنبي - واحر قلباه)",
                "النص الأدبي: وصف الطبيعة الأندلسية (ابن خفاجة الأندلسي / ابن هانئ)",
                "النص الأدبي: في وصف الرياض والأزهار (ابن الزقاق البلنسي)"
              ],
              "grammar": [
                "المصدر الميمي واسم المرة واسم الهيئة وأوزانها القياسية",
                "اسم المكان واسم الزمان وصياغتهما من الثلاثي وغير الثلاثي",
                "أسلوب المدح والذم (نعم وبئس وساء وحبذا ولا حبذا)",
                "التنازع في العمل النحوي وأحكامه عند البصريين والكوفيين"
              ],
              "rhetoric": [
                "الطباق والمقابلة وأثرهما في جلاء المعنى وتأكيده",
                "الأساليب الإنشائية غير الطلبية: صيغ المدح والذم والتعجب والقسم",
                "الاستعارة التشخيصية وبث الحياة في عناصر الطبيعة الصامتة",
                "التشبيه التمثيلي في رسم الصور الشعرية الأندلسية الملونة"
              ],
              "writing": [
                "تلخيص قصيدة الحماسة مع إبراز القيم العسكرية والإيمانية",
                "كتابة نص حجاجي يناقش فكرة: هل القوة في السلاح أم في العقل؟",
                "إنتاج نص وصفي بديع يرسم لوحة فنية لجمال الطبيعة الجزائرية",
                "تلخيص مقال حول أثر الحضارة الأندلسية في النهضة الأوروبية"
              ]
            }
          },
          {
            "id": "2as-sci-feb",
            "monthNameAr": "فيفري",
            "monthIndex": 2,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 17,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "أدب الأندلس: رثاء الممالك والمدن وسقوط الفردوس",
                "theme": "صدى مأساة سقوط المدن الأندلسية ونكبة الحضارة",
                "literaryText": "النص الأدبي: رثاء الأندلس (أبو البقاء الرندي - لكل شيء إذا ما تم نقصان)",
                "grammar": "أسماء الأفعال (الماضية والمضارعة والأمر) ومعانيها وإعرابها",
                "rhetoricOrProsody": "الكناية عن نسبة وصفة وسر بلاغتها في التعبير عن الألم والتحسر",
                "guidedReadingOrCommunicative": "النص التواصلي: نكبة الأندلس وأسباب الانهيار السياسي والحضاري",
                "writingOrIntegration": "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الفصل الثاني"
              },
              {
                "weekNumber": 18,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "أدب الأندلس: فن الموشحات الأندلسية والتجديد الموسيقي",
                "theme": "ابتكار الموشحات كثورة عروضية وموسيقية على رتابة القصيدة القديمة",
                "literaryText": "النص الأدبي: من روائع الموشحات (لسان الدين بن الخطيب - جادك الغيث)",
                "grammar": "أفعال المقاربة والرجاء والشروع (كاد وأخواتها) وأحكام خبرها",
                "rhetoricOrProsody": "المحسنات اللفظية: الجناس والتصريع وحسن التعليل",
                "guidedReadingOrCommunicative": "مطالعة موجهة: نشأة الموشحات وتأثيرها في شعر التروبادور الأوروبي",
                "writingOrIntegration": "تحليل مقطع من موشحة واستخراج أجزائها (المطلع، القفل، الغصن، الخرجة)",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 19,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "أدب المغرب العربي والأندلس: الرسائل والرحلات",
                "theme": "التواصل الجغرافي والثقافي بين بلاد المغرب والأندلس",
                "literaryText": "النص الأدبي: من نثر ابن حزم الأندلسي (طوق الحمامة في الألفة والألاف)",
                "grammar": "أحكام التمييز وأشكاله (تمييز الذات وتمييز النسبة والجملة)",
                "rhetoricOrProsody": "الأسلوب الخبري الإنكاري وأغراض التقرير والإقناع",
                "guidedReadingOrCommunicative": "النص التواصلي: العلاقات العلمية والأدبية بين الأندلس وحواضر المغرب",
                "writingOrIntegration": "تحرير فقرة حجاجية حول أهمية الصداقة والألفة الإنسانية الصادقة",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 20,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "الوضعية الإدماجية للثلاثي الثاني والتحضير للاختبارات",
                "theme": "إدماج شامل لمقرر العصر العباسي الثاني وشعر الأندلس والموشحات",
                "literaryText": "وضعية إدماجية مركبة حول العوامل التي تؤدي إلى نهضة الأمم وسقوطها",
                "grammar": "مراجعة أسماء الأفعال ونعم وبئس وكاد وأخواتها والمصادر المشتقة",
                "rhetoricOrProsody": "مراجعة الصور البيانية وأساليب المعاني والمحسنات البديعية",
                "guidedReadingOrCommunicative": "تطبيق سلم التنقيط وشبكة المعايير الرسمية في تصحيح الإنتاج الكتابي",
                "writingOrIntegration": "حل ومناقشة موضوع اختباري فصلي نموذجي للثاني ثانوي علمي",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: رثاء الأندلس (أبو البقاء الرندي - لكل شيء إذا ما تم نقصان)",
                "النص الأدبي: من روائع الموشحات (لسان الدين بن الخطيب - جادك الغيث)",
                "النص الأدبي: من نثر ابن حزم الأندلسي (طوق الحمامة في الألفة والألاف)",
                "وضعية إدماجية مركبة حول العوامل التي تؤدي إلى نهضة الأمم وسقوطها"
              ],
              "grammar": [
                "أسماء الأفعال (الماضية والمضارعة والأمر) ومعانيها وإعرابها",
                "أفعال المقاربة والرجاء والشروع (كاد وأخواتها) وأحكام خبرها",
                "أحكام التمييز وأشكاله (تمييز الذات وتمييز النسبة والجملة)",
                "مراجعة أسماء الأفعال ونعم وبئس وكاد وأخواتها والمصادر المشتقة"
              ],
              "rhetoric": [
                "الكناية عن نسبة وصفة وسر بلاغتها في التعبير عن الألم والتحسر",
                "المحسنات اللفظية: الجناس والتصريع وحسن التعليل",
                "الأسلوب الخبري الإنكاري وأغراض التقرير والإقناع",
                "مراجعة الصور البيانية وأساليب المعاني والمحسنات البديعية"
              ],
              "writing": [
                "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية",
                "تحليل مقطع من موشحة واستخراج أجزائها (المطلع، القفل، الغصن، الخرجة)",
                "تحرير فقرة حجاجية حول أهمية الصداقة والألفة الإنسانية الصادقة",
                "حل ومناقشة موضوع اختباري فصلي نموذجي للثاني ثانوي علمي"
              ]
            }
          },
          {
            "id": "2as-sci-mar",
            "monthNameAr": "مارس",
            "monthIndex": 3,
            "semester": 2,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 21,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "اختبارات الفصل الدراسي الثاني (الثلاثي الثاني)",
                "theme": "التقويم التحصيلي الرسمي للثلاثي الثاني لجميع الشعب العلمية",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الثاني)",
                "grammar": "تطبيق كافة معايير المفتشية العامة في الأسئلة وسلم التنقيط",
                "rhetoricOrProsody": "مراجعة المكتسبات",
                "guidedReadingOrCommunicative": "التصحيح النموذجي التفتيشي ومناقشة السلالم",
                "writingOrIntegration": "اختبارات الفصل الثاني",
                "hours": 3,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 22,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "التصحيح والمعالجة ومجالس الأقسام وعطلة الربيع",
                "theme": "المعالجة البيداغوجية وتسليم كشوف النقاط ومجالس الأقسام",
                "literaryText": "التصحيح الجماعي التفاعلي وتحليل إجابات المتعلمين",
                "grammar": "معالجة النقائص في التلخيص المنهجي والإعراب والتحليل البلاغي",
                "rhetoricOrProsody": "تسليم كشوف النقاط للثلاثي الثاني + مجالس الأساتذة للمؤسسة",
                "guidedReadingOrCommunicative": "إرشادات القراءة والمطالعة الذاتية خلال العطلة الربيعية",
                "writingOrIntegration": "بداية عطلة الربيع المدرسية",
                "hours": 3,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الربيع",
                "notes": "عطلة الربيع"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الثاني)",
                "التصحيح الجماعي التفاعلي وتحليل إجابات المتعلمين"
              ],
              "grammar": [
                "تطبيق كافة معايير المفتشية العامة في الأسئلة وسلم التنقيط",
                "معالجة النقائص في التلخيص المنهجي والإعراب والتحليل البلاغي"
              ],
              "rhetoric": [
                "مراجعة المكتسبات",
                "تسليم كشوف النقاط للثلاثي الثاني + مجالس الأساتذة للمؤسسة"
              ],
              "writing": [
                "اختبارات ومداولات الفصل",
                "بداية عطلة الربيع المدرسية"
              ]
            },
            "examTitle": "اختبارات الفصل الثاني وعطلة الربيع"
          }
        ]
      },
      {
        "trimester": 3,
        "title": "الفصل الدراسي الثالث (الثلاثي الثالث: أدب الرحلات والمسرح والرواية)",
        "monthsRange": "أفريل — جوان",
        "weeksCount": 10,
        "hoursCount": 30,
        "months": [
          {
            "id": "2as-sci-apr",
            "monthNameAr": "أفريل",
            "monthIndex": 4,
            "semester": 3,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 23,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "أدب الرحلات في التراث العربي والإسلامي",
                "theme": "استئناف الدراسة والتعرف على المشاهدات الجغرافية والأنثروبولوجية",
                "literaryText": "النص الأدبي: من رحلة ابن بطوطة (تحفة النظار في غرائب الأمصار)",
                "grammar": "الممنوع من الصرف لعلة واحدة ولعلتين وأحكامه الإعرابية",
                "rhetoricOrProsody": "الأسلوب الخبري وضربه واستعماله في التوثيق التاريخي والجغرافي",
                "guidedReadingOrCommunicative": "النص التواصلي: ابن بطوطة أمير الرحالة المسلمين ودوره المعرفي",
                "writingOrIntegration": "تلخيص مقطع وصفي من رحلة ابن بطوطة مع استخراج المفردات الجغرافية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 24,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "أدب الرحلات والمشاهدات المعاصرة",
                "theme": "تطور كتابة أدب الرحلة في العصر الحديث وأهميته الثقافية",
                "literaryText": "النص الأدبي: رحلة إلى بلاد الغرب (رفاعة الطهطاوي / محمد العيد آل خليفة)",
                "grammar": "أحكام (لا سيما) والحالات الإعرابية للاسم الواقع بعدها",
                "rhetoricOrProsody": "بلاغة المفارقة والمقارنة بين الواقع والمشاهدات الجديدة",
                "guidedReadingOrCommunicative": "مطالعة موجهة: من يوميات الرحالة والمستكشفين المسلمين",
                "writingOrIntegration": "كتابة تقرير رحلة مدرسية أو استكشافية لمنطقة تاريخية في الجزائر",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 25,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "فن المسرحية والقصة في الأدب الحديث",
                "theme": "دخول الفنون السردية والدرامية الحديثة إلى الأدب العربي والجزائري",
                "literaryText": "النص الأدبي: من روائع القصة القصيرة في الأدب الجزائري (الطاهر وطار)",
                "grammar": "التمييز بين الحال والتمييز والمفعول لأجله في التركيب النحوي",
                "rhetoricOrProsody": "تقنيات السرد والوصف وبناء الشخصيات في العمل القصصي",
                "guidedReadingOrCommunicative": "النص التواصلي: نشأة الفن القصصي والمسرحي في الجزائر",
                "writingOrIntegration": "تحليل بنية قصة قصيرة واستخراج الحبكة والعقدة والحل والمغزى",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 26,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "المسرح العربي والالتزام بقضايا الوطن والمجتمع",
                "theme": "المسرح كوسيلة للتوعية والتغيير الفكري والاجتماعي",
                "literaryText": "النص الأدبي: مشهد مسرحي هادف (توفيق الحكيم / كاتب ياسين)",
                "grammar": "أحكام التوكيد اللفظي والمعنوي وبلاغة تثبيت الحكم في نفس السامع",
                "rhetoricOrProsody": "الصراع الدرامي وتطور الحوار في النص المسرحي",
                "guidedReadingOrCommunicative": "مطالعة موجهة: رواد المسرح الوطني الجزائري وتضحياتهم",
                "writingOrIntegration": "فرض الثلاثي الثالث المحروس + التصحيح والمعالجة البيداغوجية",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الثالث"
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: من رحلة ابن بطوطة (تحفة النظار في غرائب الأمصار)",
                "النص الأدبي: رحلة إلى بلاد الغرب (رفاعة الطهطاوي / محمد العيد آل خليفة)",
                "النص الأدبي: من روائع القصة القصيرة في الأدب الجزائري (الطاهر وطار)",
                "النص الأدبي: مشهد مسرحي هادف (توفيق الحكيم / كاتب ياسين)"
              ],
              "grammar": [
                "الممنوع من الصرف لعلة واحدة ولعلتين وأحكامه الإعرابية",
                "أحكام (لا سيما) والحالات الإعرابية للاسم الواقع بعدها",
                "التمييز بين الحال والتمييز والمفعول لأجله في التركيب النحوي",
                "أحكام التوكيد اللفظي والمعنوي وبلاغة تثبيت الحكم في نفس السامع"
              ],
              "rhetoric": [
                "الأسلوب الخبري وضربه واستعماله في التوثيق التاريخي والجغرافي",
                "بلاغة المفارقة والمقارنة بين الواقع والمشاهدات الجديدة",
                "تقنيات السرد والوصف وبناء الشخصيات في العمل القصصي",
                "الصراع الدرامي وتطور الحوار في النص المسرحي"
              ],
              "writing": [
                "تلخيص مقطع وصفي من رحلة ابن بطوطة مع استخراج المفردات الجغرافية",
                "كتابة تقرير رحلة مدرسية أو استكشافية لمنطقة تاريخية في الجزائر",
                "تحليل بنية قصة قصيرة واستخراج الحبكة والعقدة والحل والمغزى",
                "فرض الثلاثي الثالث المحروس + التصحيح والمعالجة البيداغوجية"
              ]
            }
          },
          {
            "id": "2as-sci-may",
            "monthNameAr": "ماي",
            "monthIndex": 5,
            "semester": 3,
            "weeksCount": 3,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 27,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "المراجعة الشاملة لمقرر السنة الثانية ثانوي",
                "theme": "تركيب مكتسبات السنة الثانية في الأدب والقواعد والبلاغة والعروض",
                "literaryText": "حل مواضيع تدريبية شاملة تحاكي امتحانات البكالوريا المقبلة",
                "grammar": "مراجعة مكثفة: الممنوع من الصرف، التعجب، الاختصاص، صيغ المبالغة",
                "rhetoricOrProsody": "مراجعة شاملة للصور البيانية والأساليب الإنشائية والمحسنات البديعية",
                "guidedReadingOrCommunicative": "توجيهات منهجية للقراءة التحليلية واستخراج الأنماط النصية",
                "writingOrIntegration": "إنتاج وضعيات إدماجية تبرز نضج الفكر اللغوي للمتعلم",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 28,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "اختبارات الفصل الدراسي الثالث (الامتحانات السنوية الرسمية)",
                "theme": "الامتحانات الرسمية لنهاية السنة الدراسية لجميع الشعب",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها لنهاية السنة الثانية ثانوي",
                "grammar": "تطبيق المقاييس الرسمية المعتمدة في التقويم والامتحانات",
                "rhetoricOrProsody": "مراجعة المكتسبات",
                "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة النتائج",
                "writingOrIntegration": "اختبارات الفصل الثالث",
                "hours": 3,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 29,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "التصحيح الجماعي والمعالجة ومجالس الأقسام والقبول",
                "theme": "المعالجة البيداغوجية الختامية ومداولات نهاية السنة والقبول والتوجيه",
                "literaryText": "التصحيح الجماعي لمواضيع الاختبارات وتوزيع العلامات",
                "grammar": "مداولات مجالس الأقسام وحساب المعدلات السنوية وقرارات الانتقال للسنة الثالثة",
                "rhetoricOrProsody": "توجيه التلاميذ وتحضيرهم لمنهجية العمل في شهادة البكالوريا",
                "guidedReadingOrCommunicative": "تسليم كشوف النقاط السنوية لأولياء التلاميذ",
                "writingOrIntegration": "اختتام السنة الدراسية رسميا",
                "hours": 3,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "مجالس الأقسام ونهاية السنة"
              }
            ],
            "branchSummary": {
              "literature": [
                "حل مواضيع تدريبية شاملة تحاكي امتحانات البكالوريا المقبلة",
                "إجراء اختبار مادة اللغة العربية وآدابها لنهاية السنة الثانية ثانوي",
                "التصحيح الجماعي لمواضيع الاختبارات وتوزيع العلامات"
              ],
              "grammar": [
                "مراجعة مكثفة: الممنوع من الصرف، التعجب، الاختصاص، صيغ المبالغة",
                "تطبيق المقاييس الرسمية المعتمدة في التقويم والامتحانات",
                "مداولات مجالس الأقسام وحساب المعدلات السنوية وقرارات الانتقال للسنة الثالثة"
              ],
              "rhetoric": [
                "مراجعة شاملة للصور البيانية والأساليب الإنشائية والمحسنات البديعية",
                "مراجعة المكتسبات",
                "توجيه التلاميذ وتحضيرهم لمنهجية العمل في شهادة البكالوريا"
              ],
              "writing": [
                "إنتاج وضعيات إدماجية تبرز نضج الفكر اللغوي للمتعلم",
                "اختبارات ومداولات الفصل",
                "اختتام السنة الدراسية رسميا"
              ]
            },
            "examTitle": "اختبارات الفصل الثالث ونهاية السنة"
          },
          {
            "id": "2as-sci-jun",
            "monthNameAr": "جوان",
            "monthIndex": 6,
            "semester": 3,
            "weeksCount": 1,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 30,
                "monthNameAr": "جوان",
                "unitNumber": 10,
                "unitTitle": "مجالس التوجيه والطعون ونهاية الموسم الدراسي",
                "theme": "إنهاء الترتيبات الإدارية والبيداغوجية واستقبال الطعون وتسليم الشهادات",
                "literaryText": "استقبال ملفات طعون التوجيه ودراستها وفق المقاييس البيداغوجية",
                "grammar": "إعداد الحصيلة السنوية لنشاطات المادة وتوصيات مجلس التعليم",
                "rhetoricOrProsody": "المشاركة في تأطير امتحانات شهادة البكالوريا والتعليم المتوسط الرسمية",
                "guidedReadingOrCommunicative": "إسدال الستار رسميا على الموسم الدراسي 2024/2025",
                "writingOrIntegration": "نهاية الموسم الدراسي",
                "hours": 3,
                "isExamPeriod": false,
                "isHoliday": true,
                "holidayName": "نهاية الموسم الدراسي",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "استقبال ملفات طعون التوجيه ودراستها وفق المقاييس البيداغوجية"
              ],
              "grammar": [
                "إعداد الحصيلة السنوية لنشاطات المادة وتوصيات مجلس التعليم"
              ],
              "rhetoric": [
                "المشاركة في تأطير امتحانات شهادة البكالوريا والتعليم المتوسط الرسمية"
              ],
              "writing": [
                "اختبارات ومداولات الفصل"
              ]
            },
            "examTitle": "نهاية الموسم الدراسي"
          }
        ]
      }
    ]
  },
  {
    "id": "2as-literary-annual-2024",
    "academicYear": "2024/2025",
    "grade": "السنة الثانية",
    "stream": "شعبة آداب وفلسفة ولغات أجنبية",
    "subject": "اللغة العربية وآدابها",
    "weeklyHours": 6,
    "totalAnnualHours": 192,
    "trimesters": [
      {
        "trimester": 1,
        "title": "الفصل الدراسي الأول (الثلاثي الأول: العصر العباسي الأول)",
        "monthsRange": "سبتمبر — ديسمبر",
        "weeksCount": 12,
        "hoursCount": 72,
        "months": [
          {
            "id": "2as-lit-sep",
            "monthNameAr": "سبتمبر",
            "monthIndex": 9,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 1,
                "monthNameAr": "سبتمبر",
                "unitNumber": 0,
                "unitTitle": "التقويم التشخيصي والدخول المدرسي",
                "theme": "تشخيص مكتسبات التلميذ في النقد والبلاغة والعروض والقواعد",
                "literaryText": "تقويم تشخيصي: تحليل قصيدة عباسية ونقد بنيتها الفكرية والأسلوبية",
                "grammar": "مراجعة الجمل التي لها محل والتي لا محل لها من الإعراب",
                "rhetoricOrProsody": "مراجعة الصور البيانية (التشبيه، الاستعارة، الكناية، المجاز)",
                "guidedReadingOrCommunicative": "عروض: مراجعة الدوائر العروضية والبحور الخليلية الشائعة",
                "writingOrIntegration": "إنتاج نص نقدي يقارن بين أدب البادية وأدب الحواضر",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "تقويم تشخيصي"
              },
              {
                "weekNumber": 2,
                "monthNameAr": "سبتمبر",
                "unitNumber": 1,
                "unitTitle": "العصر العباسي الأول: النزعة العقلية في الشعر",
                "theme": "حركة الترجمة واحتكاك الثقافة العربية بالفلسفات الهندية واليونانية والفارسية",
                "literaryText": "النص الأدبي: النزعة العقلية في الشعر (بشار بن برد / أبو نواس)",
                "grammar": "معاني حروف الجر وتطبيقاتها في السياقات الدلالية والنحوية",
                "rhetoricOrProsody": "الاستعارة التمثيلية وبلاغتها في التعبير عن المفاهيم العقلية المركبة",
                "guidedReadingOrCommunicative": "عروض: بحر البسيط وتفعيلاته وتطبيقاته في شعر الحكمة العباسي",
                "writingOrIntegration": "النقد الأدبي: مظاهر النزعة العقلية في الشعر العباسي وأثرها في تجديد المعاني",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "تقويم تشخيصي: تحليل قصيدة عباسية ونقد بنيتها الفكرية والأسلوبية",
                "النص الأدبي: النزعة العقلية في الشعر (بشار بن برد / أبو نواس)"
              ],
              "grammar": [
                "مراجعة الجمل التي لها محل والتي لا محل لها من الإعراب",
                "معاني حروف الجر وتطبيقاتها في السياقات الدلالية والنحوية"
              ],
              "rhetoric": [
                "مراجعة الصور البيانية (التشبيه، الاستعارة، الكناية، المجاز)",
                "الاستعارة التمثيلية وبلاغتها في التعبير عن المفاهيم العقلية المركبة"
              ],
              "writing": [
                "إنتاج نص نقدي يقارن بين أدب البادية وأدب الحواضر",
                "النقد الأدبي: مظاهر النزعة العقلية في الشعر العباسي وأثرها في تجديد المعاني"
              ]
            }
          },
          {
            "id": "2as-lit-oct",
            "monthNameAr": "أكتوبر",
            "monthIndex": 10,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 3,
                "monthNameAr": "أكتوبر",
                "unitNumber": 1,
                "unitTitle": "العصر العباسي الأول: النزعة العقلية والحكمة (متابعة)",
                "theme": "الفلسفة والمنطق الشعري عند أبي تمام وابن الرومي",
                "literaryText": "النص الأدبي: في الحكمة والمنطق (أبو تمام - السيف أصدق أنباء من الكتب)",
                "grammar": "معاني حروف العطف وأحكام الترتيب والتعقيب والاشتراك في الحكم",
                "rhetoricOrProsody": "المحسنات المعنوية: الطباق والمقابلة وأثرهما في تأكيد المعنى العقلي",
                "guidedReadingOrCommunicative": "عروض: بحر الكامل وتفعيلاته وزحافاته الشائعة في شعر أبي تمام",
                "writingOrIntegration": "مطالعة موجهة: بيت الحكمة في بغداد ودور المترجمين في إثراء الفكر العربي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 4,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "العصر العباسي الأول: الدعوة إلى التجديد وسخرية الجاحظ",
                "theme": "محاربة الوقوف على الأطلال والدعوة لوصف مظاهر الحضارة الجديدة",
                "literaryText": "النص الأدبي: الدعوة إلى التجديد (أبو نواس - دع عنك لومي فإن اللوم إغراء)",
                "grammar": "صيغ المبالغة وأوزانها القياسية وشروط عملها عمل فعلها المتعدي",
                "rhetoricOrProsody": "التشبيه المقلوب والتشبيه الضمني وأثرهما البلاغي الفائق",
                "guidedReadingOrCommunicative": "عروض: بحر الوافر وموسيقاه وتطبيقاته العروضية",
                "writingOrIntegration": "النقد الأدبي: قضية الصراع بين القدماء والمحدثين عند النقاد العرب القدامى",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 5,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "العصر العباسي الأول: فن الوصف ومظاهر الحضارة والترف",
                "theme": "وصف القصور والرياض والبرك والسفن ومظاهر العمران الباذخ",
                "literaryText": "النص الأدبي: وصف بركة المتوكل (البحتري - تنحط فيها وفود الماء معجلة)",
                "grammar": "اسما الفاعل والمفعول وأحكام عملهما في رفع الفاعل ونصب المفعول",
                "rhetoricOrProsody": "الاستعارة التشخيصية والتجريدية في تصوير المظاهر الحضارية الصامتة",
                "guidedReadingOrCommunicative": "عروض: بحر الرمل وأوزانه الشائعة في الشعر الوصفي",
                "writingOrIntegration": "مطالعة موجهة: من كتاب الحيوان للجاحظ - استنطاق طبائع المخلوقات",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 6,
                "monthNameAr": "أكتوبر",
                "unitNumber": 3,
                "unitTitle": "العصر العباسي الأول: شعر الزهد والحكمة والموعظة",
                "theme": "حركة اليقظة الروحية في مواجهة تيار اللهو والمجون والزندقة",
                "literaryText": "النص الأدبي: في الزهد والوعظ (أبو العتاهية - نأتي إلى الدنيا ونحن نعافها)",
                "grammar": "أسلوب الإغراء والتحذير وأحكامهما الإعرابية وحالات وجوب حذف الفعل",
                "rhetoricOrProsody": "الأساليب الإنشائية الطلبية: صيغ الأمر وأغراضه البلاغية المجازية",
                "guidedReadingOrCommunicative": "عروض: بحر المتقارب وتفعيلاته وتطبيقاته في شعر الزهد",
                "writingOrIntegration": "النقد الأدبي: النزعة الشعبية وسهولة اللفظ في شعر أبي العتاهية الزهدي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: في الحكمة والمنطق (أبو تمام - السيف أصدق أنباء من الكتب)",
                "النص الأدبي: الدعوة إلى التجديد (أبو نواس - دع عنك لومي فإن اللوم إغراء)",
                "النص الأدبي: وصف بركة المتوكل (البحتري - تنحط فيها وفود الماء معجلة)",
                "النص الأدبي: في الزهد والوعظ (أبو العتاهية - نأتي إلى الدنيا ونحن نعافها)"
              ],
              "grammar": [
                "معاني حروف العطف وأحكام الترتيب والتعقيب والاشتراك في الحكم",
                "صيغ المبالغة وأوزانها القياسية وشروط عملها عمل فعلها المتعدي",
                "اسما الفاعل والمفعول وأحكام عملهما في رفع الفاعل ونصب المفعول",
                "أسلوب الإغراء والتحذير وأحكامهما الإعرابية وحالات وجوب حذف الفعل"
              ],
              "rhetoric": [
                "المحسنات المعنوية: الطباق والمقابلة وأثرهما في تأكيد المعنى العقلي",
                "التشبيه المقلوب والتشبيه الضمني وأثرهما البلاغي الفائق",
                "الاستعارة التشخيصية والتجريدية في تصوير المظاهر الحضارية الصامتة",
                "الأساليب الإنشائية الطلبية: صيغ الأمر وأغراضه البلاغية المجازية"
              ],
              "writing": [
                "مطالعة موجهة: بيت الحكمة في بغداد ودور المترجمين في إثراء الفكر العربي",
                "النقد الأدبي: قضية الصراع بين القدماء والمحدثين عند النقاد العرب القدامى",
                "مطالعة موجهة: من كتاب الحيوان للجاحظ - استنطاق طبائع المخلوقات",
                "النقد الأدبي: النزعة الشعبية وسهولة اللفظ في شعر أبي العتاهية الزهدي"
              ]
            }
          },
          {
            "id": "2as-lit-nov",
            "monthNameAr": "نوفمبر",
            "monthIndex": 11,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 7,
                "monthNameAr": "نوفمبر",
                "unitNumber": 3,
                "unitTitle": "العصر العباسي الأول: شعر الزهد والوعظ (متابعة)",
                "theme": "الدعوة إلى مكارم الأخلاق والاتعاظ بمرور الأيام ومحاسبة النفس",
                "literaryText": "النص الأدبي: في الحكمة الأخلاقية (صالح بن عبد القدوس)",
                "grammar": "صيغ النهي وأغراضه البلاغية المجازية (الدعاء، الالتماس، التوبيخ)",
                "rhetoricOrProsody": "المجاز المرسل وعلاقاته البلاغية المتعددة (السببية، المسببية، المكانية...)",
                "guidedReadingOrCommunicative": "عروض: بحر الطويل وأوزانه في شعر الحكمة والنقد الأخلاقي",
                "writingOrIntegration": "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الأول"
              },
              {
                "weekNumber": 8,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "العصر العباسي الأول: نشأة النثر العلمي والنقد الأدبي",
                "theme": "ظهور الرسائل الأدبية والنقدية والكتب الجامعة عند الجاحظ وابن المقفع",
                "literaryText": "النص الأدبي: من رسائل الجاحظ (رسالة التربيع والتدوير - تصوير المعايب)",
                "grammar": "أسلوب التعجب بصيغتيه القياسيتين (ما أفعله وأفعل به) وصيغه السماعية",
                "rhetoricOrProsody": "الاستفهام المجازي وأغراضه المتنوعة (الإنكار، التقرير، التحقير، التعجب)",
                "guidedReadingOrCommunicative": "عروض: مراجعة البحور المدروسة في الفصل الأول (البسيط، الكامل، الوافر)",
                "writingOrIntegration": "النقد الأدبي: خصائص أسلوب الجاحظ (الاستطراد، التوليد، السخرية، البيان)",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 9,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "العصر العباسي الأول: النثر الفني والقصص الرمزي",
                "theme": "كليلة ودمنة والحكمة الإنسانية والسياسية على ألسنة البهائم والطيور",
                "literaryText": "النص الأدبي: من حكايات كليلة ودمنة (ابن المقفع - باب الحمامة المطوقة)",
                "grammar": "أسلوب الاختصاص وأحكامه الإعرابية وإعراب الاسم المختص",
                "rhetoricOrProsody": "الكناية بأنواعها الثلاثة (عن صفة وموصوف ونسبة) وبلاغتها في الإيجاز",
                "guidedReadingOrCommunicative": "عروض: الكتابة العروضية الدقيقة وتطبيقات استخراج التفعيلات والقافية",
                "writingOrIntegration": "مطالعة موجهة: الأدب الكبير والأدب الصغير لابن المقفع وتوجيهاتهما التربوية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 10,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "الوضعية الإدماجية النقدية الكبرى للثلاثي الأول",
                "theme": "إدماج شامل لمقرر العصر العباسي الأول وأحكام القواعد والبلاغة والعروض",
                "literaryText": "وضعية إدماجية نقدية: أثر الاحتكاك الثقافي في تجديد الشعر والنثر العباسي",
                "grammar": "مراجعة شاملة لقواعد الفصل الأول: الحروف المشبهة، المشتقات، التوابع",
                "rhetoricOrProsody": "مراجعة شاملة لعلوم البلاغة الثلاثة: البيان، المعاني، البديع",
                "guidedReadingOrCommunicative": "مراجعة العروض وحل تدريبات التقطيع واستخراج الزحافات والعلل",
                "writingOrIntegration": "حل ومناقشة موضوع امتحاني فصلي نموذجي مع شبكة التقييم بالمعايير",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: في الحكمة الأخلاقية (صالح بن عبد القدوس)",
                "النص الأدبي: من رسائل الجاحظ (رسالة التربيع والتدوير - تصوير المعايب)",
                "النص الأدبي: من حكايات كليلة ودمنة (ابن المقفع - باب الحمامة المطوقة)",
                "وضعية إدماجية نقدية: أثر الاحتكاك الثقافي في تجديد الشعر والنثر العباسي"
              ],
              "grammar": [
                "صيغ النهي وأغراضه البلاغية المجازية (الدعاء، الالتماس، التوبيخ)",
                "أسلوب التعجب بصيغتيه القياسيتين (ما أفعله وأفعل به) وصيغه السماعية",
                "أسلوب الاختصاص وأحكامه الإعرابية وإعراب الاسم المختص",
                "مراجعة شاملة لقواعد الفصل الأول: الحروف المشبهة، المشتقات، التوابع"
              ],
              "rhetoric": [
                "المجاز المرسل وعلاقاته البلاغية المتعددة (السببية، المسببية، المكانية...)",
                "الاستفهام المجازي وأغراضه المتنوعة (الإنكار، التقرير، التحقير، التعجب)",
                "الكناية بأنواعها الثلاثة (عن صفة وموصوف ونسبة) وبلاغتها في الإيجاز",
                "مراجعة شاملة لعلوم البلاغة الثلاثة: البيان، المعاني، البديع"
              ],
              "writing": [
                "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "النقد الأدبي: خصائص أسلوب الجاحظ (الاستطراد، التوليد، السخرية، البيان)",
                "مطالعة موجهة: الأدب الكبير والأدب الصغير لابن المقفع وتوجيهاتهما التربوية",
                "حل ومناقشة موضوع امتحاني فصلي نموذجي مع شبكة التقييم بالمعايير"
              ]
            }
          },
          {
            "id": "2as-lit-dec",
            "monthNameAr": "ديسمبر",
            "monthIndex": 12,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 11,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "اختبارات الفصل الدراسي الأول (الثلاثي الأول)",
                "theme": "التقويم التحصيلي الرسمي للثلاثي الأول لشعبة الآداب والفلسفة واللغات",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها (مدة الاختبار: 03 ساعات)",
                "grammar": "اختيار بين موضوعين: شعر عباسي تجديدي أو زهد، ونثر فني أو نقدي",
                "rhetoricOrProsody": "تطبيق سلم التنقيط المعتمد والمعايير البيداغوجية التفتيشية الرسمية",
                "guidedReadingOrCommunicative": "مراجعة المكتسبات",
                "writingOrIntegration": "التصحيح النموذجي وسلالم التقييم",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "اختبارات الفصل الأول"
              },
              {
                "weekNumber": 12,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "التصحيح والمعالجة ومجالس الأقسام وعطلة الشتاء",
                "theme": "استثمار نتائج الاختبارات ومعالجة التعثرات التحليلية والنقدية للمتعلمين",
                "literaryText": "التصحيح الجماعي التفاعلي ومناقشة أوراق الإجابة وتوزيع النماذج الوزارية",
                "grammar": "جلسات المعالجة البيداغوجية للنقاط الصعبة في العروض والإعراب والنقد",
                "rhetoricOrProsody": "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول",
                "guidedReadingOrCommunicative": "توجيهات القراءة الإثرائية لأدب الأندلس والمغرب خلال العطلة الشتوية",
                "writingOrIntegration": "بداية عطلة الشتاء المدرسية الرسمية",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الشتاء",
                "notes": "عطلة الشتاء"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار مادة اللغة العربية وآدابها (مدة الاختبار: 03 ساعات)",
                "التصحيح الجماعي التفاعلي ومناقشة أوراق الإجابة وتوزيع النماذج الوزارية"
              ],
              "grammar": [
                "اختيار بين موضوعين: شعر عباسي تجديدي أو زهد، ونثر فني أو نقدي",
                "جلسات المعالجة البيداغوجية للنقاط الصعبة في العروض والإعراب والنقد"
              ],
              "rhetoric": [
                "تطبيق سلم التنقيط المعتمد والمعايير البيداغوجية التفتيشية الرسمية",
                "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول"
              ],
              "writing": [
                "التصحيح النموذجي وسلالم التقييم",
                "بداية عطلة الشتاء المدرسية الرسمية"
              ]
            },
            "examTitle": "اختبارات الفصل الأول وعطلة الشتاء"
          }
        ]
      },
      {
        "trimester": 2,
        "title": "الفصل الدراسي الثاني (الثلاثي الثاني: العصر العباسي الثاني وأدب الأندلس)",
        "monthsRange": "جانفي — مارس",
        "weeksCount": 10,
        "hoursCount": 60,
        "months": [
          {
            "id": "2as-lit-jan",
            "monthNameAr": "جانفي",
            "monthIndex": 1,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 13,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "العصر العباسي الثاني: شعر الحماسة والجهاد والبطولة",
                "theme": "استئناف التعلمات وتصوير بطولات قادة المسلمين في مواجهة الروم",
                "literaryText": "النص الأدبي: فتح عمورية (أبو تمام - السيف أصدق أنباء من الكتب)",
                "grammar": "المصدر الميمي واسم المرة واسم الهيئة وأوزانها وصياغتها",
                "rhetoricOrProsody": "الطباق والمقابلة وحسن التعليل في شعر البطولة والملامح الحماسية",
                "guidedReadingOrCommunicative": "عروض: بحر البسيط وتطبيقاته في شعر الحماسة والحروب",
                "writingOrIntegration": "النقد الأدبي: مفهوم الحماسة في الشعر العربي وتطوره من الجاهلية إلى العباسي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 14,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "العصر العباسي الثاني: فلسفة القوة عند المتنبي",
                "theme": "كبرياء المتنبي ورسم صورة الفارس الأديب الطموح في بلاط سيف الدولة",
                "literaryText": "النص الأدبي: في الفخر والحكمة (المتنبي - وقفة على أعتاب المجد)",
                "grammar": "اسم المكان واسم الزمان وصياغتهما من الثلاثي وغير الثلاثي وأحكامهما",
                "rhetoricOrProsody": "الأساليب الإنشائية غير الطلبية: صيغ المدح والذم والتعجب والقسم والرجاء",
                "guidedReadingOrCommunicative": "عروض: بحر الكامل وتطبيقاته في شعر المتنبي الحماسي والفخري",
                "writingOrIntegration": "مطالعة موجهة: عبقرية المتنبي النقدية وشروحات ديوانه عبر العصور",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 15,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "أدب الأندلس: شعر الطبيعة ووصف البيئة الفردوسية",
                "theme": "خصوصية الفردوس الأندلسي الساحر وابتكار صور شعرية غير مسبوقة",
                "literaryText": "النص الأدبي: وصف الطبيعة الأندلسية (ابن خفاجة الأندلسي - صنوبرة في روض)",
                "grammar": "أسلوب المدح والذم (نعم وبئس وساء وحبذا ولا حبذا) وإعراب فاعلهما والمخصوص",
                "rhetoricOrProsody": "الاستعارة التشخيصية وبث الحياة والمشاعر في الجبال والأنهار والأشجار",
                "guidedReadingOrCommunicative": "عروض: بحر الخفيف وتفعيلاته وموسيقاه العذبة في شعر الطبيعة",
                "writingOrIntegration": "النقد الأدبي: خصوصية شعر الطبيعة في الأندلس واختلافه عن الشعر المشرقي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 16,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "أدب الأندلس: التنازع والظواهر الإعرابية التراثية",
                "theme": "متابعة وصف الرياض والأزهار وسحر المدن الأندلسية الجميلة",
                "literaryText": "النص الأدبي: وصف حدائق قرطبة (ابن الزقاق البلنسي / ابن هانئ الأندلسي)",
                "grammar": "التنازع في العمل النحوي بين عاملين متقدمين على معمول متأخر وأحكامه",
                "rhetoricOrProsody": "التشبيه التمثيلي والتشبيه المركب في لوحات الطبيعة الأندلسية",
                "guidedReadingOrCommunicative": "عروض: بحر السريع وتفعيلاته وزحافاته الشائعة في شعر الأندلس",
                "writingOrIntegration": "مطالعة موجهة: قرطبة عاصمة العلم والحضارة في أوروبا الوسيطة",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: فتح عمورية (أبو تمام - السيف أصدق أنباء من الكتب)",
                "النص الأدبي: في الفخر والحكمة (المتنبي - وقفة على أعتاب المجد)",
                "النص الأدبي: وصف الطبيعة الأندلسية (ابن خفاجة الأندلسي - صنوبرة في روض)",
                "النص الأدبي: وصف حدائق قرطبة (ابن الزقاق البلنسي / ابن هانئ الأندلسي)"
              ],
              "grammar": [
                "المصدر الميمي واسم المرة واسم الهيئة وأوزانها وصياغتها",
                "اسم المكان واسم الزمان وصياغتهما من الثلاثي وغير الثلاثي وأحكامهما",
                "أسلوب المدح والذم (نعم وبئس وساء وحبذا ولا حبذا) وإعراب فاعلهما والمخصوص",
                "التنازع في العمل النحوي بين عاملين متقدمين على معمول متأخر وأحكامه"
              ],
              "rhetoric": [
                "الطباق والمقابلة وحسن التعليل في شعر البطولة والملامح الحماسية",
                "الأساليب الإنشائية غير الطلبية: صيغ المدح والذم والتعجب والقسم والرجاء",
                "الاستعارة التشخيصية وبث الحياة والمشاعر في الجبال والأنهار والأشجار",
                "التشبيه التمثيلي والتشبيه المركب في لوحات الطبيعة الأندلسية"
              ],
              "writing": [
                "النقد الأدبي: مفهوم الحماسة في الشعر العربي وتطوره من الجاهلية إلى العباسي",
                "مطالعة موجهة: عبقرية المتنبي النقدية وشروحات ديوانه عبر العصور",
                "النقد الأدبي: خصوصية شعر الطبيعة في الأندلس واختلافه عن الشعر المشرقي",
                "مطالعة موجهة: قرطبة عاصمة العلم والحضارة في أوروبا الوسيطة"
              ]
            }
          },
          {
            "id": "2as-lit-feb",
            "monthNameAr": "فيفري",
            "monthIndex": 2,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 17,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "أدب الأندلس: رثاء الممالك والمدن وسقوط الفردوس",
                "theme": "صدى سقوط عواصم الأندلس والتحسر على زوال المجد الحضاري العظيم",
                "literaryText": "النص الأدبي: رثاء الأندلس (أبو البقاء الرندي - لكل شيء إذا ما تم نقصان)",
                "grammar": "أسماء الأفعال (الماضية والمضارعة والأمر) ومعانيها وأحكامها الإعرابية",
                "rhetoricOrProsody": "الكناية عن نسبة وصفة وسر جمالها البلاغي في تصوير الفجيعة والمأساة",
                "guidedReadingOrCommunicative": "عروض: بحر البسيط وتطبيقاته الحزينة في نونية أبي البقاء الرندي",
                "writingOrIntegration": "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الثاني"
              },
              {
                "weekNumber": 18,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "أدب الأندلس: فن الموشحات الأندلسية وثورة الإيقاع",
                "theme": "ابتكار الموشحة كاستجابة للغناء الأندلسي والتنويع الموسيقي المبتكر",
                "literaryText": "النص الأدبي: من روائع الموشحات (لسان الدين بن الخطيب - جادك الغيث)",
                "grammar": "أفعال المقاربة والرجاء والشروع (كاد وأخواتها) وشروط اقتران خبرها بأن",
                "rhetoricOrProsody": "المحسنات اللفظية: الجناس والتصريع والسجع وتأثيرها النغمي في الموشح",
                "guidedReadingOrCommunicative": "عروض: دراسة البنية العروضية للموشحة (المطلع، الأقفال، الأسماط، الخرجة)",
                "writingOrIntegration": "النقد الأدبي: ثورة الموشحات الأندلسية وأثرها في الشعر الغربي (التروبادور)",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 19,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "أدب المغرب العربي والأندلس: النثر الفني والرسائل",
                "theme": "التواصل الثقافي والفكري بين حواضر المغرب العربي والأندلس عبر الرسائل",
                "literaryText": "النص الأدبي: من نثر ابن حزم الأندلسي (طوق الحمامة في الألفة والألاف)",
                "grammar": "أحكام التمييز بالتفصيل (تمييز الذات والملفوظ وتمييز النسبة والملحوظ)",
                "rhetoricOrProsody": "الأسلوب الخبري الإنكاري وأساليب التوكيد اللفظي والمعنوي والمجازي",
                "guidedReadingOrCommunicative": "عروض: مراجعة بحور الفصل الثاني (الخفيف، السريع، الموشحات)",
                "writingOrIntegration": "مطالعة موجهة: العلاقات الثقافية والأدبية بين حواضر الأندلس وتلمسان وبجاية",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 20,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "الوضعية الإدماجية النقدية الكبرى للثلاثي الثاني",
                "theme": "إدماج شامل لمقرر العصر العباسي الثاني وشعر الأندلس والموشحات والرثاء",
                "literaryText": "وضعية إدماجية نقدية: تحولات الإبداع الشعري والنثري بين المشرق والأندلس",
                "grammar": "مراجعة شاملة لقواعد النحو للفصل الثاني: أسماء الأفعال، كاد، التمييز",
                "rhetoricOrProsody": "مراجعة شاملة لعلم البيان والمعاني والبديع وتطبيقاتها النصية",
                "guidedReadingOrCommunicative": "مراجعة العروض وتحليل الأوزان الشعرية القديمة والمستحدثة",
                "writingOrIntegration": "حل ومناقشة موضوع اختباري فصلي نموذجي مع سلم التنقيط الوزاري",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: رثاء الأندلس (أبو البقاء الرندي - لكل شيء إذا ما تم نقصان)",
                "النص الأدبي: من روائع الموشحات (لسان الدين بن الخطيب - جادك الغيث)",
                "النص الأدبي: من نثر ابن حزم الأندلسي (طوق الحمامة في الألفة والألاف)",
                "وضعية إدماجية نقدية: تحولات الإبداع الشعري والنثري بين المشرق والأندلس"
              ],
              "grammar": [
                "أسماء الأفعال (الماضية والمضارعة والأمر) ومعانيها وأحكامها الإعرابية",
                "أفعال المقاربة والرجاء والشروع (كاد وأخواتها) وشروط اقتران خبرها بأن",
                "أحكام التمييز بالتفصيل (تمييز الذات والملفوظ وتمييز النسبة والملحوظ)",
                "مراجعة شاملة لقواعد النحو للفصل الثاني: أسماء الأفعال، كاد، التمييز"
              ],
              "rhetoric": [
                "الكناية عن نسبة وصفة وسر جمالها البلاغي في تصوير الفجيعة والمأساة",
                "المحسنات اللفظية: الجناس والتصريع والسجع وتأثيرها النغمي في الموشح",
                "الأسلوب الخبري الإنكاري وأساليب التوكيد اللفظي والمعنوي والمجازي",
                "مراجعة شاملة لعلم البيان والمعاني والبديع وتطبيقاتها النصية"
              ],
              "writing": [
                "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "النقد الأدبي: ثورة الموشحات الأندلسية وأثرها في الشعر الغربي (التروبادور)",
                "مطالعة موجهة: العلاقات الثقافية والأدبية بين حواضر الأندلس وتلمسان وبجاية",
                "حل ومناقشة موضوع اختباري فصلي نموذجي مع سلم التنقيط الوزاري"
              ]
            }
          },
          {
            "id": "2as-lit-mar",
            "monthNameAr": "مارس",
            "monthIndex": 3,
            "semester": 2,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 21,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "اختبارات الفصل الدراسي الثاني (الثلاثي الثاني)",
                "theme": "الامتحانات الفصلية الرسمية المطابقة التامة لمواصفات التعليم الثانوي",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها (مدة الاختبار: 03 ساعات)",
                "grammar": "اختيار بين موضوعين: شعر أندلسي/موشح، ونثر نقدي/رسائلي مغاربي",
                "rhetoricOrProsody": "تطبيق سلم التنقيط المعتمد وشبكة المعايير البيداغوجية التفتيشية",
                "guidedReadingOrCommunicative": "مراجعة المكتسبات",
                "writingOrIntegration": "التصحيح النموذجي ومناقشة الإجابات",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "اختبارات الفصل الثاني"
              },
              {
                "weekNumber": 22,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "التصحيح والمعالجة ومجالس الأقسام وعطلة الربيع",
                "theme": "المعالجة البيداغوجية لمواطن التعثر في التحليل الأدبي والنقدي والعروضي",
                "literaryText": "التصحيح الجماعي المعمق ومناقشة أوراق المتعلمين وتقديم النماذج",
                "grammar": "تسليم كشوف النقاط للثلاثي الثاني ومجالس الأساتذة للمؤسسة التربوية",
                "rhetoricOrProsody": "توجيهات استثمار عطلة الربيع في القراءة والمطالعة وتحضير الفصل الثالث",
                "guidedReadingOrCommunicative": "بداية عطلة الربيع المدرسية الرسمية",
                "writingOrIntegration": "عطلة الربيع",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الربيع",
                "notes": "عطلة الربيع"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار مادة اللغة العربية وآدابها (مدة الاختبار: 03 ساعات)",
                "التصحيح الجماعي المعمق ومناقشة أوراق المتعلمين وتقديم النماذج"
              ],
              "grammar": [
                "اختيار بين موضوعين: شعر أندلسي/موشح، ونثر نقدي/رسائلي مغاربي",
                "تسليم كشوف النقاط للثلاثي الثاني ومجالس الأساتذة للمؤسسة التربوية"
              ],
              "rhetoric": [
                "تطبيق سلم التنقيط المعتمد وشبكة المعايير البيداغوجية التفتيشية",
                "توجيهات استثمار عطلة الربيع في القراءة والمطالعة وتحضير الفصل الثالث"
              ],
              "writing": [
                "التصحيح النموذجي ومناقشة الإجابات",
                "عطلة الربيع"
              ]
            },
            "examTitle": "اختبارات الفصل الثاني وعطلة الربيع"
          }
        ]
      },
      {
        "trimester": 3,
        "title": "الفصل الدراسي الثالث (الثلاثي الثالث: أدب الرحلات والمسرح والرواية)",
        "monthsRange": "أفريل — جوان",
        "weeksCount": 10,
        "hoursCount": 60,
        "months": [
          {
            "id": "2as-lit-apr",
            "monthNameAr": "أفريل",
            "monthIndex": 4,
            "semester": 3,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 23,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "أدب الرحلات في التراث العربي والإسلامي",
                "theme": "استئناف التعلمات والتعرف على المشاهدات الجغرافية والثقافية والاجتماعية",
                "literaryText": "النص الأدبي: من رحلة ابن بطوطة (تحفة النظار في غرائب الأمصار وعجائب الأسفار)",
                "grammar": "الممنوع من الصرف لعلة واحدة ولعلتين وتفاصيل أحكامه وشروط جره بالفتحة",
                "rhetoricOrProsody": "الأسلوب الخبري وضربه واستعماله في التوثيق الجغرافي والأنثروبولوجي",
                "guidedReadingOrCommunicative": "عروض: بحر المديد وتطبيقاته العروضية والوزنية في الشعر القديم",
                "writingOrIntegration": "النقد الأدبي: أدب الرحلة بين الوثيقة التاريخية والإبداع الفني والخيالي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 24,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "أدب الرحلات في العصر الحديث والاتصال بالغرب",
                "theme": "صدمة الحداثة ومشاهدات رواد النهضة في أوروبا والاتصال بالآخر",
                "literaryText": "النص الأدبي: تخليص الإبريز في تلخيص باريز (رفاعة رافع الطهطاوي)",
                "grammar": "أحكام (لا سيما) والحالات الإعرابية المفصلة للاسم الواقع بعدها",
                "rhetoricOrProsody": "بلاغة المفارقة والمقارنة الحضارية بين الأنا والآخر في النثر الحديث",
                "guidedReadingOrCommunicative": "عروض: بحر الهزج وتفعيلاته وأوزانه الشائعة في شعر المحدثين",
                "writingOrIntegration": "مطالعة موجهة: رحلة الورثلاني والرحالة الجزائريون في بلاد الحجاز والمغرب",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 25,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "فن المسرحية والقصة في الأدب العربي الحديث",
                "theme": "دخول الأجناس السردية والدرامية الحديثة وتطور فنون النثر في الجزائر",
                "literaryText": "النص الأدبي: من روائع القصة القصيرة في الجزائر (أحمد رضا حوحو / الطاهر وطار)",
                "grammar": "التمييز بين الحال والتمييز والمفعول لأجله والمفعول المطلق في التراكيب",
                "rhetoricOrProsody": "تقنيات السرد والوصف وبناء الشخصيات وتأزيم العقدة في النص القصصي",
                "guidedReadingOrCommunicative": "عروض: بحر الرجز وتطبيقاته في الأراجيز التعليمية والشعر الدرامي",
                "writingOrIntegration": "النقد الأدبي: نشأة الفن القصصي والروائي في الجزائر وتحديات التأسيس",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 26,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "المسرح العربي وقضايا المجتمع والتحرر الوطني",
                "theme": "المسرح الدرامي كوسيلة للتوعية الاجتماعية والسياسية والتربوية",
                "literaryText": "النص الأدبي: مشهد مسرحي درامي هادف (توفيق الحكيم / كاتب ياسين)",
                "grammar": "أحكام التوكيد اللفظي والمعنوي وبلاغة تثبيت الحكم ودفع توهم النسيان",
                "rhetoricOrProsody": "الصراع الدرامي وتطور الحوار وتصاعد الفعل المسرحي في العرض",
                "guidedReadingOrCommunicative": "عروض: مراجعة الدوائر العروضية وحل تدريبات عروضية متنوعة وشاملة",
                "writingOrIntegration": "فرض الثلاثي الثالث المحروس + التصحيح البيداغوجي الفوري",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الثالث"
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: من رحلة ابن بطوطة (تحفة النظار في غرائب الأمصار وعجائب الأسفار)",
                "النص الأدبي: تخليص الإبريز في تلخيص باريز (رفاعة رافع الطهطاوي)",
                "النص الأدبي: من روائع القصة القصيرة في الجزائر (أحمد رضا حوحو / الطاهر وطار)",
                "النص الأدبي: مشهد مسرحي درامي هادف (توفيق الحكيم / كاتب ياسين)"
              ],
              "grammar": [
                "الممنوع من الصرف لعلة واحدة ولعلتين وتفاصيل أحكامه وشروط جره بالفتحة",
                "أحكام (لا سيما) والحالات الإعرابية المفصلة للاسم الواقع بعدها",
                "التمييز بين الحال والتمييز والمفعول لأجله والمفعول المطلق في التراكيب",
                "أحكام التوكيد اللفظي والمعنوي وبلاغة تثبيت الحكم ودفع توهم النسيان"
              ],
              "rhetoric": [
                "الأسلوب الخبري وضربه واستعماله في التوثيق الجغرافي والأنثروبولوجي",
                "بلاغة المفارقة والمقارنة الحضارية بين الأنا والآخر في النثر الحديث",
                "تقنيات السرد والوصف وبناء الشخصيات وتأزيم العقدة في النص القصصي",
                "الصراع الدرامي وتطور الحوار وتصاعد الفعل المسرحي في العرض"
              ],
              "writing": [
                "النقد الأدبي: أدب الرحلة بين الوثيقة التاريخية والإبداع الفني والخيالي",
                "مطالعة موجهة: رحلة الورثلاني والرحالة الجزائريون في بلاد الحجاز والمغرب",
                "النقد الأدبي: نشأة الفن القصصي والروائي في الجزائر وتحديات التأسيس",
                "فرض الثلاثي الثالث المحروس + التصحيح البيداغوجي الفوري"
              ]
            }
          },
          {
            "id": "2as-lit-may",
            "monthNameAr": "ماي",
            "monthIndex": 5,
            "semester": 3,
            "weeksCount": 3,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 27,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "المراجعة الشاملة الكبرى والتحضير للبكالوريا",
                "theme": "تركيب مكتسبات السنة الثانية في الأدب والنقد والقواعد والبلاغة والعروض",
                "literaryText": "حل مواضيع تدريبية شاملة مصممة وفق هيكلة مواضيع امتحان البكالوريا",
                "grammar": "مراجعة مكثفة: الممنوع من الصرف، التعجب، الاختصاص، المشتقات، التوكيد",
                "rhetoricOrProsody": "مراجعة شاملة للصور البيانية والأساليب الإنشائية ومحسنات البديع",
                "guidedReadingOrCommunicative": "مراجعة بحور الشعر العربي الستة عشر وأوزانها وزحافاتها وقوافيها",
                "writingOrIntegration": "إنتاج نصوص نقدية إدماجية تبرز النضج الفكري واللغوي للمتعلم",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 28,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "اختبارات الفصل الدراسي الثالث (الامتحانات السنوية الرسمية)",
                "theme": "الامتحانات الرسمية الشاملة لنهاية السنة الدراسية لجميع الشعب الأدبية",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها لنهاية السنة الثانية ثانوي (03 ساعات)",
                "grammar": "تطبيق كافة المقاييس الوزارية المعتمدة في التقويم التفتيشي الرسمي",
                "rhetoricOrProsody": "مراجعة المكتسبات",
                "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة السلالم وتوزيع العلامات",
                "writingOrIntegration": "اختبارات الفصل الثالث",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 29,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "التصحيح الجماعي والمعالجة ومجالس الأقسام والقبول",
                "theme": "المعالجة البيداغوجية الختامية ومداولات نهاية السنة والقبول والتوجيه للبكالوريا",
                "literaryText": "التصحيح الجماعي التفاعلي لمواضيع الاختبارات وتوزيع كشوف النقاط",
                "grammar": "مداولات مجالس الأقسام وحساب المعدلات وقرارات الانتقال إلى السنة الثالثة",
                "rhetoricOrProsody": "جلسة توجيه منهجي وإرشادات بيداغوجية للتحضير لامتحان شهادة البكالوريا",
                "guidedReadingOrCommunicative": "تسليم كشوف النقاط السنوية لأولياء التلاميذ",
                "writingOrIntegration": "اختتام السنة الدراسية رسميا",
                "hours": 6,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": "مجالس الأقسام ونهاية السنة"
              }
            ],
            "branchSummary": {
              "literature": [
                "حل مواضيع تدريبية شاملة مصممة وفق هيكلة مواضيع امتحان البكالوريا",
                "إجراء اختبار مادة اللغة العربية وآدابها لنهاية السنة الثانية ثانوي (03 ساعات)",
                "التصحيح الجماعي التفاعلي لمواضيع الاختبارات وتوزيع كشوف النقاط"
              ],
              "grammar": [
                "مراجعة مكثفة: الممنوع من الصرف، التعجب، الاختصاص، المشتقات، التوكيد",
                "تطبيق كافة المقاييس الوزارية المعتمدة في التقويم التفتيشي الرسمي",
                "مداولات مجالس الأقسام وحساب المعدلات وقرارات الانتقال إلى السنة الثالثة"
              ],
              "rhetoric": [
                "مراجعة شاملة للصور البيانية والأساليب الإنشائية ومحسنات البديع",
                "مراجعة المكتسبات",
                "جلسة توجيه منهجي وإرشادات بيداغوجية للتحضير لامتحان شهادة البكالوريا"
              ],
              "writing": [
                "إنتاج نصوص نقدية إدماجية تبرز النضج الفكري واللغوي للمتعلم",
                "اختبارات ومداولات الفصل",
                "اختتام السنة الدراسية رسميا"
              ]
            },
            "examTitle": "اختبارات الفصل الثالث ونهاية السنة"
          },
          {
            "id": "2as-lit-jun",
            "monthNameAr": "جوان",
            "monthIndex": 6,
            "semester": 3,
            "weeksCount": 1,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 30,
                "monthNameAr": "جوان",
                "unitNumber": 10,
                "unitTitle": "مجالس التوجيه والطعون ونهاية الموسم الدراسي",
                "theme": "إنهاء الترتيبات الإدارية والبيداغوجية ودراسة الطعون واستقبال الأولياء",
                "literaryText": "دراسة ملفات الطعون وفق المقاييس البيداغوجية والتنظيمية الرسمية",
                "grammar": "إعداد التقرير البيداغوجي السنوي لمادة اللغة العربية وآدابها بالثانوية",
                "rhetoricOrProsody": "المشاركة في تأطير امتحانات شهادة البكالوريا والتعليم المتوسط الرسمية",
                "guidedReadingOrCommunicative": "إسدال الستار رسميا على الموسم الدراسي 2024/2025",
                "writingOrIntegration": "نهاية الموسم الدراسي",
                "hours": 6,
                "isExamPeriod": false,
                "isHoliday": true,
                "holidayName": "نهاية الموسم الدراسي",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "دراسة ملفات الطعون وفق المقاييس البيداغوجية والتنظيمية الرسمية"
              ],
              "grammar": [
                "إعداد التقرير البيداغوجي السنوي لمادة اللغة العربية وآدابها بالثانوية"
              ],
              "rhetoric": [
                "المشاركة في تأطير امتحانات شهادة البكالوريا والتعليم المتوسط الرسمية"
              ],
              "writing": [
                "اختبارات ومداولات الفصل"
              ]
            },
            "examTitle": "نهاية الموسم الدراسي"
          }
        ]
      }
    ]
  },
  {
  "id": "1as-scientific-annual-2024",
  "academicYear": "2024/2025",
  "grade": "السنة الأولى",
  "stream": "جذع مشترك علوم وتكنولوجيا",
  "subject": "اللغة العربية وآدابها",
  "weeklyHours": 3,
  "totalAnnualHours": 96,
  "trimesters": [
    {
      "trimester": 1,
      "title": "الفصل الدراسي الأول (الثلاثي الأول)",
      "monthsRange": "سبتمبر — ديسمبر",
      "weeksCount": 11,
      "hoursCount": 33,
      "months": [
        {
          "id": "1as-sci-sep",
          "monthNameAr": "سبتمبر",
          "monthIndex": 9,
          "semester": 1,
          "weeksCount": 2,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 1,
              "monthNameAr": "سبتمبر",
              "unitNumber": 0,
              "unitTitle": "الصحة المدرسية والتقويم التشخيصي",
              "theme": "الصحة المدرسية وتقويم تشخيصي، وتنشيط حصص تعليمية ممهدة لتعلّم أنشطة المادة المقرّرة",
              "literaryText": "تقويم تشخيصي وتنشيط حصص ممهدة",
              "grammar": "مراجعة المكتسبات القبلية من مرحلة التعليم المتوسط",
              "rhetoricOrProsody": "مراجعة القواعد والبلاغة الأساسية",
              "guidedReadingOrCommunicative": "تقويم تشخيصي أولي",
              "writingOrIntegration": "تنشيط حصص تعليمية ممهدة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 21 إلى 25 سبتمبر"
            },
            {
              "weekNumber": 2,
              "monthNameAr": "سبتمبر",
              "unitNumber": 1,
              "unitTitle": "من الكرم العربي",
              "theme": "الكرم العربي ومكارم الأخلاق في الجاهلية",
              "literaryText": "من الكرم العربي (حاتم الطائي)",
              "grammar": "التشبيه وأركانه",
              "rhetoricOrProsody": "أركان التشبيه وأقسامه البلاغية",
              "guidedReadingOrCommunicative": "مشكلة الموارد الطبيعية",
              "writingOrIntegration": "من مزايا التسامح في بناء المجتمعات ورقيها",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 28 سبتمبر إلى 02 أكتوبر"
            }
          ],
          "branchSummary": {
            "literature": [
              "من الكرم العربي (حاتم الطائي)"
            ],
            "grammar": [
              "التشبيه وأركانه"
            ],
            "rhetoric": [
              "أركان التشبيه وأقسامه البلاغية"
            ],
            "writing": [
              "من مزايا التسامح في بناء المجتمعات ورقيها"
            ]
          }
        },
        {
          "id": "1as-sci-oct",
          "monthNameAr": "أكتوبر",
          "monthIndex": 10,
          "semester": 1,
          "weeksCount": 3,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 3,
              "monthNameAr": "أكتوبر",
              "unitNumber": 1,
              "unitTitle": "من الكرم العربي",
              "theme": "الكرم عند العرب وسمات المجتمع الجاهلي",
              "literaryText": "الكرم عند العرب",
              "grammar": "رفع الفعل المضارع ونصبه",
              "rhetoricOrProsody": "بلاغة التشبيه",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "تحرير الموضوع داخل القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 05 إلى 09 أكتوبر"
            },
            {
              "weekNumber": 4,
              "monthNameAr": "أكتوبر",
              "unitNumber": 2,
              "unitTitle": "الفروسية وتعلق العربي بها",
              "theme": "شعر الحماسة والفروسية عند عنترة بن شداد",
              "literaryText": "شعر الفروسية (عنترة بن شداد)",
              "grammar": "المجاز اللغوي",
              "rhetoricOrProsody": "المجاز اللغوي وعلاقته بالحقيقة",
              "guidedReadingOrCommunicative": "الشجاعة الأدبية",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 12 إلى 16 أكتوبر"
            },
            {
              "weekNumber": 5,
              "monthNameAr": "أكتوبر",
              "unitNumber": 2,
              "unitTitle": "الفروسية وتعلق العربي بها",
              "theme": "الشجاعة مفخرة العربي والحياة العقلية واستدراك ودعم",
              "literaryText": "الشجاعة مفخرة العربي",
              "grammar": "الأدوات التي تجزم فعلين",
              "rhetoricOrProsody": "أساليب الشرط الجازمة",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "إعداد فهرسة حول مظاهر الحياة العقلية للعرب في العصر الجاهلي",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 19 إلى 23 أكتوبر (نشاطات للاستدراك والإدماج والدعم + عطلة الخريف من 28 أكتوبر إلى 02 نوفمبر)"
            }
          ],
          "branchSummary": {
            "literature": [
              "الكرم عند العرب",
              "شعر الفروسية (عنترة بن شداد)",
              "الشجاعة مفخرة العربي"
            ],
            "grammar": [
              "رفع الفعل المضارع ونصبه",
              "المجاز اللغوي",
              "الأدوات التي تجزم فعلين"
            ],
            "rhetoric": [
              "المجاز اللغوي وعلاقته بالحقيقة"
            ],
            "writing": [
              "تحرير الموضوع داخل القسم",
              "تصحيح الموضوع",
              "إعداد فهرسة حول مظاهر الحياة العقلية للعرب"
            ]
          }
        },
        {
          "id": "1as-sci-nov",
          "monthNameAr": "نوفمبر",
          "monthIndex": 11,
          "semester": 1,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 6,
              "monthNameAr": "نوفمبر",
              "unitNumber": 3,
              "unitTitle": "الطبيعة في الشعر الجاهلي",
              "theme": "وصف مظاهر الطبيعة في الشعر الجاهلي",
              "literaryText": "في وصف البرق والمطر (عبيد بن الأبرص)",
              "grammar": "الاستعارة المكنية والتصريحية",
              "rhetoricOrProsody": "بلاغة الاستعارة المكنية والتصريحية",
              "guidedReadingOrCommunicative": "الكوكب المهدد",
              "writingOrIntegration": "أثر العمل في حياة الفرد والمجتمع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 02 إلى 06 نوفمبر"
            },
            {
              "weekNumber": 7,
              "monthNameAr": "نوفمبر",
              "unitNumber": 3,
              "unitTitle": "الطبيعة في الشعر الجاهلي",
              "theme": "الطبيعة من خلال الشعر الجاهلي",
              "literaryText": "الطبيعة من خلال الشعر الجاهلي",
              "grammar": "بناء الفعل الماضي",
              "rhetoricOrProsody": "الصور البيانية في وصف الطبيعة",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "تحرير الموضوع في القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 09 إلى 13 نوفمبر"
            },
            {
              "weekNumber": 8,
              "monthNameAr": "نوفمبر",
              "unitNumber": 4,
              "unitTitle": "الأمثال والحكم",
              "theme": "الحكمة والتجربة الإنسانية عند العرب",
              "literaryText": "الحكم والأمثال",
              "grammar": "الكناية",
              "rhetoricOrProsody": "بلاغة الكناية وأنواعها",
              "guidedReadingOrCommunicative": "محمد عليه الصلاة والسلام الرئيس",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 16 إلى 20 نوفمبر"
            },
            {
              "weekNumber": 9,
              "monthNameAr": "نوفمبر",
              "unitNumber": 4,
              "unitTitle": "الأمثال والحكم",
              "theme": "معلم الأمثال ونقل التجارب الإنسانية",
              "literaryText": "معلم الأمثال",
              "grammar": "بناء فعل الأمر",
              "rhetoricOrProsody": "أساليب التوجيه والإرشاد",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "إنجاز معرض للسلام",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 23 إلى 27 نوفمبر"
            }
          ],
          "branchSummary": {
            "literature": [
              "في وصف البرق والمطر (عبيد بن الأبرص)",
              "الطبيعة من خلال الشعر الجاهلي",
              "الحكم والأمثال",
              "معلم الأمثال"
            ],
            "grammar": [
              "الاستعارة المكنية والتصريحية",
              "بناء الفعل الماضي",
              "الكناية",
              "بناء فعل الأمر"
            ],
            "rhetoric": [
              "بلاغة الاستعارة",
              "بلاغة الكناية"
            ],
            "writing": [
              "أثر العمل في حياة الفرد والمجتمع",
              "تحرير الموضوع في القسم",
              "تصحيح الموضوع",
              "إنجاز معرض للسلام"
            ]
          }
        },
        {
          "id": "1as-sci-dec",
          "monthNameAr": "ديسمبر",
          "monthIndex": 12,
          "semester": 1,
          "weeksCount": 2,
          "isExamPeriod": true,
          "weeks": [
            {
              "weekNumber": 10,
              "monthNameAr": "ديسمبر",
              "unitNumber": 5,
              "unitTitle": "القيم الروحية والاجتماعية في الإسلام",
              "theme": "أثر الإسلام في تهذيب الأخلاق والسلوك الإنساني",
              "literaryText": "تقوى الله والإحسان إلى الآخرين (معبد بن القليب)",
              "grammar": "الجملة الخبرية",
              "rhetoricOrProsody": "الجملة الخبرية وأغراضها البلاغية",
              "guidedReadingOrCommunicative": "من سمة الثورة العلمية والتكنولوجية المعاصرة",
              "writingOrIntegration": "تقنية التلخيص",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 30 نوفمبر إلى 04 ديسمبر (اختبارات الفصل الأول من 07 إلى 11 ديسمبر)"
            },
            {
              "weekNumber": 11,
              "monthNameAr": "ديسمبر",
              "unitNumber": 5,
              "unitTitle": "نشاط النثر",
              "theme": "قيم روحية واجتماعية في الإسلام وبداية إجازة الشتاء",
              "literaryText": "قيم روحية واجتماعية في الإسلام",
              "grammar": "بناء الفعل المضارع",
              "rhetoricOrProsody": "أساليب الخطابة والوعظ",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "تحرير الموضوع في القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 14 إلى 18 ديسمبر (إجازة الشتاء من 18 ديسمبر إلى 04 جانفي)"
            }
          ],
          "branchSummary": {
            "literature": [
              "تقوى الله والإحسان إلى الآخرين",
              "قيم روحية واجتماعية في الإسلام"
            ],
            "grammar": [
              "الجملة الخبرية",
              "بناء الفعل المضارع"
            ],
            "rhetoric": [
              "الجملة الخبرية وأغراضها البلاغية"
            ],
            "writing": [
              "تقنية التلخيص",
              "تحرير الموضوع في القسم"
            ]
          },
          "examTitle": "اختبارات الفصل الأول وإجازة الشتاء"
        }
      ]
    },
    {
      "trimester": 2,
      "title": "الفصل الدراسي الثاني (الثلاثي الثاني)",
      "monthsRange": "جانفي — مارس",
      "weeksCount": 9,
      "hoursCount": 27,
      "months": [
        {
          "id": "1as-sci-jan",
          "monthNameAr": "جانفي",
          "monthIndex": 1,
          "semester": 2,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 12,
              "monthNameAr": "جانفي",
              "unitNumber": 6,
              "unitTitle": "شعر النضال والصراع",
              "theme": "الدفاع عن الدعوة الإسلامية وشعر الجهاد في صدر الإسلام",
              "literaryText": "من شعر النضال والصراع (كعب بن مالك)",
              "grammar": "الجملة الإنشائية",
              "rhetoricOrProsody": "أقسام الجملة الإنشائية الطلبية وغير الطلبية",
              "guidedReadingOrCommunicative": "دور الأديب العربي",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 04 إلى 08 جانفي"
            },
            {
              "weekNumber": 13,
              "monthNameAr": "جانفي",
              "unitNumber": 6,
              "unitTitle": "شعر النضال والصراع",
              "theme": "الشعر في صدر الإسلام والتحول الفكري",
              "literaryText": "الشعر في صدر الإسلام",
              "grammar": "المفعول لأجله",
              "rhetoricOrProsody": "أغراض الإنشاء البلاغية",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "تأليف مسرحية قصيرة تعالج ظاهرة اجتماعية",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 11 إلى 15 جانفي"
            },
            {
              "weekNumber": 14,
              "monthNameAr": "جانفي",
              "unitNumber": 7,
              "unitTitle": "شعر الفتوحات الإسلامية",
              "theme": "فتح مكة وانتصار المبادئ الإسلامية",
              "literaryText": "فتح مكة (حسان بن ثابت)",
              "grammar": "أضرب الجملة الخبرية",
              "rhetoricOrProsody": "الخبر الابتدائي والطلبي والإنكاري",
              "guidedReadingOrCommunicative": "أيها الكرز المنسي",
              "writingOrIntegration": "مظاهر التجديد عند شعراء المدينة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 18 إلى 22 جانفي"
            },
            {
              "weekNumber": 15,
              "monthNameAr": "جانفي",
              "unitNumber": 7,
              "unitTitle": "شعر الفتوحات الإسلامية",
              "theme": "شعر الفتوح وآثاره النفسية في المجتمع",
              "literaryText": "شعر الفتوح وآثاره النفسية",
              "grammar": "التمييز",
              "rhetoricOrProsody": "التأثير النفسي لشعر الفتوحات",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "تحرير الموضوع في القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 25 إلى 29 جانفي"
            }
          ],
          "branchSummary": {
            "literature": [
              "من شعر النضال والصراع (كعب بن مالك)",
              "الشعر في صدر الإسلام",
              "فتح مكة (حسان بن ثابت)",
              "شعر الفتوح وآثاره النفسية"
            ],
            "grammar": [
              "الجملة الإنشائية",
              "المفعول لأجله",
              "أضرب الجملة الخبرية",
              "التمييز"
            ],
            "rhetoric": [
              "أقسام الجملة الإنشائية",
              "أضرب الجملة الخبرية"
            ],
            "writing": [
              "تصحيح الموضوع",
              "تأليف مسرحية قصيرة تعالج ظاهرة اجتماعية",
              "مظاهر التجديد عند شعراء المدينة",
              "تحرير الموضوع في القسم"
            ]
          }
        },
        {
          "id": "1as-sci-feb",
          "monthNameAr": "فيفري",
          "monthIndex": 2,
          "semester": 2,
          "weeksCount": 3,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 16,
              "monthNameAr": "فيفري",
              "unitNumber": 8,
              "unitTitle": "تأثير الإسلام في شعر والشعراء",
              "theme": "التحول الأسلوبي واللغوي في شعر المخضرمين",
              "literaryText": "من تأثير الإسلام في الشعر والشعراء (النابغة الجعدي)",
              "grammar": "أنواع الجمل الإنشائية",
              "rhetoricOrProsody": "الأمر والنهي والاستفهام والتمني والنداء",
              "guidedReadingOrCommunicative": "فضل العرب على أوروبا",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 01 إلى 05 فيفري"
            },
            {
              "weekNumber": 17,
              "monthNameAr": "فيفري",
              "unitNumber": 8,
              "unitTitle": "تأثير الإسلام في شعر والشعراء",
              "theme": "من آثار الإسلام على الفكر واللغة",
              "literaryText": "من آثار الإسلام على الفكر واللغة",
              "grammar": "الحال",
              "rhetoricOrProsody": "التجديد في المعاني والألفاظ الإسلامية",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "كتابة قصة قصيرة تعالج ظاهرة اجتماعية",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 08 إلى 12 فيفري (نشاطات للاستدراك والإدماج والدعم من 15 إلى 19 فيفري)"
            },
            {
              "weekNumber": 18,
              "monthNameAr": "فيفري",
              "unitNumber": 9,
              "unitTitle": "الخلافة الإسلامية والمؤثرات الحزبية في الشعر",
              "theme": "شعر الأحزاب السياسية وتيارات العصر الأموي",
              "literaryText": "في مدح الهاشميين (الكميت)",
              "grammar": "الطباق",
              "rhetoricOrProsody": "بلاغة الطباق الإيجابي والسلبي",
              "guidedReadingOrCommunicative": "انتظار (قصة قصيرة)",
              "writingOrIntegration": "الوقت وأهميته في حياة الفرد والمجتمع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 22 إلى 26 فيفري"
            }
          ],
          "branchSummary": {
            "literature": [
              "من تأثير الإسلام في الشعر والشعراء",
              "من آثار الإسلام على الفكر واللغة",
              "في مدح الهاشميين (الكميت)"
            ],
            "grammar": [
              "أنواع الجمل الإنشائية",
              "الحال",
              "الطباق"
            ],
            "rhetoric": [
              "أنواع الجمل الإنشائية",
              "بلاغة الطباق"
            ],
            "writing": [
              "تصحيح الموضوع",
              "كتابة قصة قصيرة",
              "الوقت وأهميته في حياة الفرد"
            ]
          }
        },
        {
          "id": "1as-sci-mar",
          "monthNameAr": "مارس",
          "monthIndex": 3,
          "semester": 2,
          "weeksCount": 2,
          "isExamPeriod": true,
          "weeks": [
            {
              "weekNumber": 19,
              "monthNameAr": "مارس",
              "unitNumber": 9,
              "unitTitle": "الخلافة الإسلامية والمؤثرات الحزبية في الشعر",
              "theme": "نشأة الأحزاب السياسية في عهد بني أمية",
              "literaryText": "نشأة الأحزاب السياسية في عهد بني أمية",
              "grammar": "المفعول المطلق",
              "rhetoricOrProsody": "الحجاج السياسي في الشعر",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "تحرير الموضوع في القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 01 إلى 05 مارس (اختبارات الفصل الثاني من 08 إلى 12 مارس)"
            },
            {
              "weekNumber": 20,
              "monthNameAr": "مارس",
              "unitNumber": 10,
              "unitTitle": "شعر المواقف الوجدانية",
              "theme": "الغزل العفيف ومواقف الوفاء العذري وإجازة الربيع",
              "literaryText": "من الغزل العفيف (جميل بن معمر)",
              "grammar": "المقابلة",
              "rhetoricOrProsody": "المقابلة وبلاغتها في إبراز المعاني",
              "guidedReadingOrCommunicative": "حادثة مؤلمة",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 15 إلى 19 مارس (إجازة الربيع من 19 مارس إلى 05 أفريل)"
            }
          ],
          "branchSummary": {
            "literature": [
              "نشأة الأحزاب السياسية في عهد بني أمية",
              "من الغزل العفيف (جميل بن معمر)"
            ],
            "grammar": [
              "المفعول المطلق",
              "المقابلة"
            ],
            "rhetoric": [
              "المقابلة وبلاغتها"
            ],
            "writing": [
              "تحرير الموضوع في القسم",
              "تصحيح الموضوع"
            ]
          },
          "examTitle": "اختبارات الفصل الثاني وإجازة الربيع"
        }
      ]
    },
    {
      "trimester": 3,
      "title": "الفصل الدراسي الثالث (الثلاثي الثالث)",
      "monthsRange": "أفريل — ماي",
      "weeksCount": 5,
      "hoursCount": 15,
      "months": [
        {
          "id": "1as-sci-apr",
          "monthNameAr": "أفريل",
          "monthIndex": 4,
          "semester": 3,
          "weeksCount": 4,
          "isExamPeriod": false,
          "weeks": [
            {
              "weekNumber": 21,
              "monthNameAr": "أفريل",
              "unitNumber": 10,
              "unitTitle": "شعر المواقف الوجدانية",
              "theme": "الغزل العذري في عهد بني أمية وإعداد الفهرس",
              "literaryText": "الغزل العذري في عهد بني أمية",
              "grammar": "المنادى",
              "rhetoricOrProsody": "العاطفة الصادقة والأسلوب العذري",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "إعداد فهرس حول النقائض وعلاقتها بالسياسة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 05 إلى 09 أفريل"
            },
            {
              "weekNumber": 22,
              "monthNameAr": "أفريل",
              "unitNumber": 11,
              "unitTitle": "التقليد والتجديد في الشعر الأموي",
              "theme": "فن النقائض وشعراء المثلث الأموي",
              "literaryText": "من نقائض جرير والفرزدق",
              "grammar": "الجناس",
              "rhetoricOrProsody": "الجناس التام والناقص وبلاغته الصوتية",
              "guidedReadingOrCommunicative": "الفيل يا ملك الزمان",
              "writingOrIntegration": "أساليب استثمار وسائل الاتصال في الحصول على العلم والمعرفة",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 12 إلى 16 أفريل"
            },
            {
              "weekNumber": 23,
              "monthNameAr": "أفريل",
              "unitNumber": 11,
              "unitTitle": "التقليد والتجديد في الشعر الأموي",
              "theme": "تحول الهجاء عند الأخطل والفرزدق وجرير إلى نقائض",
              "literaryText": "تحول الهجاء عند الأخطل والفرزدق وجرير إلى نقائض",
              "grammar": "اسم الإشارة والاسم الموصول",
              "rhetoricOrProsody": "المنافسة الشعرية والتقاليد الفنية",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "تحرير الموضوع في القسم",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 19 إلى 23 أفريل"
            },
            {
              "weekNumber": 24,
              "monthNameAr": "أفريل",
              "unitNumber": 12,
              "unitTitle": "نهضة الفنون النثرية في العصر الأموي",
              "theme": "الخطابة الدينية والسياسية في العصر الأموي",
              "literaryText": "صفة الإمام العادل (الحسن البصري)",
              "grammar": "اسم الاستفهام",
              "rhetoricOrProsody": "أساليب الوعظ والخطابة عند الحسن البصري",
              "guidedReadingOrCommunicative": "نحن والمستقبل",
              "writingOrIntegration": "تصحيح الموضوع",
              "hours": 3,
              "isExamPeriod": false,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 26 إلى 30 أفريل"
            }
          ],
          "branchSummary": {
            "literature": [
              "الغزل العذري في عهد بني أمية",
              "من نقائض جرير والفرزدق",
              "تحول الهجاء إلى نقائض",
              "صفة الإمام العادل (الحسن البصري)"
            ],
            "grammar": [
              "المنادى",
              "الجناس",
              "اسم الإشارة والاسم الموصول",
              "اسم الاستفهام"
            ],
            "rhetoric": [
              "الجناس التام والناقص",
              "أساليب الوعظ والخطابة"
            ],
            "writing": [
              "إعداد فهرس حول النقائض",
              "أساليب استثمار وسائل الاتصال",
              "تحرير الموضوع في القسم",
              "تصحيح الموضوع"
            ]
          }
        },
        {
          "id": "1as-sci-may",
          "monthNameAr": "ماي",
          "monthIndex": 5,
          "semester": 3,
          "weeksCount": 1,
          "isExamPeriod": true,
          "weeks": [
            {
              "weekNumber": 25,
              "monthNameAr": "ماي",
              "unitNumber": 12,
              "unitTitle": "نهضة الفنون النثرية في العصر الأموي",
              "theme": "الكتابة في العصر الأموي واختبارات الفصل الثالث",
              "literaryText": "الكتابة في العصر الأموي",
              "grammar": "اسم الشرط",
              "rhetoricOrProsody": "تطور أسلوب الكتابة الإدارية والإخوانية",
              "guidedReadingOrCommunicative": "بناء وضعية إبداعية أو نقدية",
              "writingOrIntegration": "اختبارات الفصل الثالث",
              "hours": 3,
              "isExamPeriod": true,
              "isHoliday": false,
              "holidayName": "",
              "notes": "من 03 إلى 07 ماي (اختبارات الفصل الثالث من 10 إلى 15 ماي)"
            }
          ],
          "branchSummary": {
            "literature": [
              "الكتابة في العصر الأموي"
            ],
            "grammar": [
              "اسم الشرط"
            ],
            "rhetoric": [
              "تطور أسلوب الكتابة في العصر الأموي"
            ],
            "writing": [
              "اختبارات الفصل الثالث"
            ]
          },
          "examTitle": "اختبارات الفصل الثالث ونهاية السنة الدراسية"
        }
      ]
    }
  ]
},
  {
    "id": "1as-literary-annual-2024",
    "academicYear": "2024/2025",
    "grade": "السنة الأولى",
    "stream": "جذع مشترك آداب ولغات",
    "subject": "اللغة العربية وآدابها",
    "weeklyHours": 5,
    "totalAnnualHours": 160,
    "trimesters": [
      {
        "trimester": 1,
        "title": "الفصل الدراسي الأول (الثلاثي الأول: الأدب الجاهلي)",
        "monthsRange": "سبتمبر — ديسمبر",
        "weeksCount": 12,
        "hoursCount": 60,
        "months": [
          {
            "id": "1as-lit-sep",
            "monthNameAr": "سبتمبر",
            "monthIndex": 9,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 1,
                "monthNameAr": "سبتمبر",
                "unitNumber": 0,
                "unitTitle": "التقويم التشخيصي والدخول المدرسي",
                "theme": "تشخيص مكتسبات التعليم المتوسط في النحو والبلاغة والعروض والتعبير",
                "literaryText": "تقويم تشخيصي: تحليل قصيدة جاهلية واستخراج الأنماط النصية والصور",
                "grammar": "مراجعة الجملة الاسمية والفعلية والمفاهيم الإعرابية الأساسية",
                "rhetoricOrProsody": "مراجعة الصور البيانية البسيطة والتمييز بين التشبيه والاستعارة",
                "guidedReadingOrCommunicative": "عروض: مبادئ الكتابة العروضية والرموز الصوتية والأسباب والأوتاد",
                "writingOrIntegration": "إنتاج نص تحليلي نقدي حول أثر البيئة والمحيط في تشكيل شخصية الفرد",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "تقويم تشخيصي"
              },
              {
                "weekNumber": 2,
                "monthNameAr": "سبتمبر",
                "unitNumber": 1,
                "unitTitle": "الأدب الجاهلي: الكرم العربي وإشاعة السلم",
                "theme": "منظومة القيم الأخلاقية في الجاهلية والسعي لإطفاء نيران الحروب",
                "literaryText": "النص الأدبي: الكرم العربي وإشاعة السلم (حاتم الطائي / زهير بن أبي سلمى)",
                "grammar": "الفعل المضارع بأنواعه: المرفوع والمنصوب وعلامات إعرابهما الأصلية والفرعية",
                "rhetoricOrProsody": "التشبيه وأركانه الأربعة (المشبه، المشبه به، أداة التشبيه، وجه الشبه)",
                "guidedReadingOrCommunicative": "عروض: بحر الكامل وتفعيلاته التامة والمجزوءة (متفاعلن متفاعلن متفاعلن)",
                "writingOrIntegration": "النص التواصلي: مظاهر التضامن والسلم في البيئة الجاهلية القاسية",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "تقويم تشخيصي: تحليل قصيدة جاهلية واستخراج الأنماط النصية والصور",
                "النص الأدبي: الكرم العربي وإشاعة السلم (حاتم الطائي / زهير بن أبي سلمى)"
              ],
              "grammar": [
                "مراجعة الجملة الاسمية والفعلية والمفاهيم الإعرابية الأساسية",
                "الفعل المضارع بأنواعه: المرفوع والمنصوب وعلامات إعرابهما الأصلية والفرعية"
              ],
              "rhetoric": [
                "مراجعة الصور البيانية البسيطة والتمييز بين التشبيه والاستعارة",
                "التشبيه وأركانه الأربعة (المشبه، المشبه به، أداة التشبيه، وجه الشبه)"
              ],
              "writing": [
                "إنتاج نص تحليلي نقدي حول أثر البيئة والمحيط في تشكيل شخصية الفرد",
                "النص التواصلي: مظاهر التضامن والسلم في البيئة الجاهلية القاسية"
              ]
            }
          },
          {
            "id": "1as-lit-oct",
            "monthNameAr": "أكتوبر",
            "monthIndex": 10,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 3,
                "monthNameAr": "أكتوبر",
                "unitNumber": 1,
                "unitTitle": "الأدب الجاهلي: الكرم والسلم (متابعة)",
                "theme": "حكمة زهير بن أبي سلمى ودعوته لحقن الدماء ونبذ الحرب",
                "literaryText": "النص الأدبي: من معلقة زهير بن أبي سلمى (في السلم ومدح المصلحين)",
                "grammar": "الفعل المضارع المجزوم بأدوات الجزم الجازمة لفعلا واحدا وأدوات الشرط الجازمة",
                "rhetoricOrProsody": "التشبيه المفصل والمجمل والتشبيه المؤكد والتشبيه البليغ وسر جماله",
                "guidedReadingOrCommunicative": "عروض: الزحافات التي تلحق بحر الكامل (الإضمار والوقص والقطع)",
                "writingOrIntegration": "مطالعة موجهة: مآثر العرب في الجاهلية وأخلاق الفروسية والنجدة",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 4,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "الأدب الجاهلي: قيم الفروسية والشجاعة والنجدة",
                "theme": "الشهامة وعزة النفس والدفاع عن الضعفاء عند الفرسان الشعراء",
                "literaryText": "النص الأدبي: قيم الفروسية والشجاعة (عنترة بن شداد العبسي - المعلقة)",
                "grammar": "المبتدأ والخبر وأنواعهما المتعددة وأحكام تطابقهما وحالات وجوب تقديمهما",
                "rhetoricOrProsody": "الحقيقة والمجاز اللغوي والتفرقة الدقيقة بين الاستعمالين الحقيقي والمجازي",
                "guidedReadingOrCommunicative": "عروض: بحر الوافر وتفعيلاته (مفاعلتن مفاعلتن فعولن)",
                "writingOrIntegration": "النقد الأدبي: صورة البطل في الشعر الجاهلي وأبعادها الإنسانية والاجتماعية",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 5,
                "monthNameAr": "أكتوبر",
                "unitNumber": 2,
                "unitTitle": "الأدب الجاهلي: النواسخ في الجملة الاسمية",
                "theme": "متابعة وصف المعارك والبطولات ومواقف الصبر والتضحية عند عنترة",
                "literaryText": "النص الأدبي: وصف بطولات عنترة في المعركة (هلا سألت الخيل يا ابنة مالك)",
                "grammar": "كان وأخواتها وأنواع أسمائها وأخبارها وإعرابها بالتفصيل التام",
                "rhetoricOrProsody": "المجاز اللغوي والاستعارة المكنية في تصوير السيوف والرماح والخيل",
                "guidedReadingOrCommunicative": "عروض: الزحافات التي تلحق بحر الوافر (العصب والعقل)",
                "writingOrIntegration": "مطالعة موجهة: سيرة عنترة بن شداد بين الواقع التاريخي والخيال الشعبي",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 6,
                "monthNameAr": "أكتوبر",
                "unitNumber": 3,
                "unitTitle": "الأدب الجاهلي: الطبيعة في وجدان الشاعر الجاهلي",
                "theme": "تصوير بيئة البادية والظواهر الطبيعية القاسية وتأثيرها النفسي",
                "literaryText": "النص الأدبي: وصف الطبيعة والصحراء (امرؤ القيس - قفا نبك من ذكرى حبيب)",
                "grammar": "كاد وأخواتها (أفعال المقاربة والرجاء والشروع) وشروط اقتران خبرها بأن",
                "rhetoricOrProsody": "الاستعارة المكنية والاستعارة التصريحية والفرق الجوهري بينهما في البلاغة",
                "guidedReadingOrCommunicative": "عروض: بحر البسيط وتفعيلاته (مستفعلن فاعلن مستفعلن فاعلن)",
                "writingOrIntegration": "النص التواصلي: أثر البيئة الصحراوية في خيال الشاعر الجاهلي وإبداعه الفني",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: من معلقة زهير بن أبي سلمى (في السلم ومدح المصلحين)",
                "النص الأدبي: قيم الفروسية والشجاعة (عنترة بن شداد العبسي - المعلقة)",
                "النص الأدبي: وصف بطولات عنترة في المعركة (هلا سألت الخيل يا ابنة مالك)",
                "النص الأدبي: وصف الطبيعة والصحراء (امرؤ القيس - قفا نبك من ذكرى حبيب)"
              ],
              "grammar": [
                "الفعل المضارع المجزوم بأدوات الجزم الجازمة لفعلا واحدا وأدوات الشرط الجازمة",
                "المبتدأ والخبر وأنواعهما المتعددة وأحكام تطابقهما وحالات وجوب تقديمهما",
                "كان وأخواتها وأنواع أسمائها وأخبارها وإعرابها بالتفصيل التام",
                "كاد وأخواتها (أفعال المقاربة والرجاء والشروع) وشروط اقتران خبرها بأن"
              ],
              "rhetoric": [
                "التشبيه المفصل والمجمل والتشبيه المؤكد والتشبيه البليغ وسر جماله",
                "الحقيقة والمجاز اللغوي والتفرقة الدقيقة بين الاستعمالين الحقيقي والمجازي",
                "المجاز اللغوي والاستعارة المكنية في تصوير السيوف والرماح والخيل",
                "الاستعارة المكنية والاستعارة التصريحية والفرق الجوهري بينهما في البلاغة"
              ],
              "writing": [
                "مطالعة موجهة: مآثر العرب في الجاهلية وأخلاق الفروسية والنجدة",
                "النقد الأدبي: صورة البطل في الشعر الجاهلي وأبعادها الإنسانية والاجتماعية",
                "مطالعة موجهة: سيرة عنترة بن شداد بين الواقع التاريخي والخيال الشعبي",
                "النص التواصلي: أثر البيئة الصحراوية في خيال الشاعر الجاهلي وإبداعه الفني"
              ]
            }
          },
          {
            "id": "1as-lit-nov",
            "monthNameAr": "نوفمبر",
            "monthIndex": 11,
            "semester": 1,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 7,
                "monthNameAr": "نوفمبر",
                "unitNumber": 3,
                "unitTitle": "الأدب الجاهلي: شعر الطبيعة (متابعة)",
                "theme": "تصوير مشهد الليل البهيم وسرعة الفرس ووثبات الصيد في البادية",
                "literaryText": "النص الأدبي: وصف ليل الصحراء (وليل كموج البحر أرخى سدوله - امرؤ القيس)",
                "grammar": "أحكام الحال المفردة والجملة والشبه جملة وصاحب الحال وشروط تطابقهما",
                "rhetoricOrProsody": "الاستعارة التصريحية وبلاغتها في إعطاء المعنويات ثوب المحسوسات",
                "guidedReadingOrCommunicative": "عروض: زحافات بحر البسيط (الخبن والطي والقطع)",
                "writingOrIntegration": "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الأول"
              },
              {
                "weekNumber": 8,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "الأدب الجاهلي: من الأمثال والحكم الجاهلية",
                "theme": "الحكمة الشعبية وتركيز الخبرة الحياتية في عبارات موجزة سريعة الانتشار",
                "literaryText": "النص الأدبي: من الأمثال والحكم الجاهلية (أكثم بن صيفي / قس بن ساعدة)",
                "grammar": "لا النافية للجنس وشروط عملها عمل (إنّ) وحالات بناء اسمها وإعرابه",
                "rhetoricOrProsody": "المجاز المرسل وعلاقاته البلاغية (السببية، المسببية، الجزئية، الكلية)",
                "guidedReadingOrCommunicative": "عروض: القافية ومفهومها وحروفها الستة (الروي، الوصل، الخروج، الردف...)",
                "writingOrIntegration": "النقد الأدبي: خصائص المثل والحكمة الأدبية والفرق الجوهري بينهما",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 9,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "الأدب الجاهلي: فنون النثر الجاهلي والخطابة",
                "theme": "الخطابة والمنافرات والوصايا في أسواق العرب ومنتدياتهم الكبرى",
                "literaryText": "النص الأدبي: وصية ذي الإصبع العدواني لابنه أسيد (ألن جانبك لقومك يحبوك)",
                "grammar": "المفعول به وأحوال تقديمه وجوبا وجوازا على الفاعل وتأخيره",
                "rhetoricOrProsody": "المحسنات البديعية: السجع والجناس في النثر الجاهلي وأثرهما الصوتي",
                "guidedReadingOrCommunicative": "عروض: حركات القافية الست (المجرى، النفاذ، الحذو، الإشباع، الرس، التوجيه)",
                "writingOrIntegration": "مطالعة موجهة: سوق عكاظ ودوره في توحيد لغة العرب وتهذيب ألسنتهم",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 10,
                "monthNameAr": "نوفمبر",
                "unitNumber": 4,
                "unitTitle": "الوضعية الإدماجية النقدية الشاملة للثلاثي الأول",
                "theme": "إدماج شامل لمقرر الأدب الجاهلي وأحكام النحو والبلاغة والعروض",
                "literaryText": "وضعية إدماجية نقدية مركبة: أثر بيئة العصر الجاهلي في صياغة الشعر والنثر",
                "grammar": "مراجعة شاملة لقواعد الفصل الأول: المضارع، النواسخ، كاد، لا النافية للجنس",
                "rhetoricOrProsody": "مراجعة شاملة للبلاغة: التشبيه بأقسامه، الاستعارة بنوعيها، المجاز المرسل",
                "guidedReadingOrCommunicative": "مراجعة العروض وقوافي الشعر وتطبيقات التقطيع العروضي الدقيق",
                "writingOrIntegration": "حل ومناقشة موضوع امتحاني فصلي نموذجي مع شبكة التقييم بالمعايير",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: وصف ليل الصحراء (وليل كموج البحر أرخى سدوله - امرؤ القيس)",
                "النص الأدبي: من الأمثال والحكم الجاهلية (أكثم بن صيفي / قس بن ساعدة)",
                "النص الأدبي: وصية ذي الإصبع العدواني لابنه أسيد (ألن جانبك لقومك يحبوك)",
                "وضعية إدماجية نقدية مركبة: أثر بيئة العصر الجاهلي في صياغة الشعر والنثر"
              ],
              "grammar": [
                "أحكام الحال المفردة والجملة والشبه جملة وصاحب الحال وشروط تطابقهما",
                "لا النافية للجنس وشروط عملها عمل (إنّ) وحالات بناء اسمها وإعرابه",
                "المفعول به وأحوال تقديمه وجوبا وجوازا على الفاعل وتأخيره",
                "مراجعة شاملة لقواعد الفصل الأول: المضارع، النواسخ، كاد، لا النافية للجنس"
              ],
              "rhetoric": [
                "الاستعارة التصريحية وبلاغتها في إعطاء المعنويات ثوب المحسوسات",
                "المجاز المرسل وعلاقاته البلاغية (السببية، المسببية، الجزئية، الكلية)",
                "المحسنات البديعية: السجع والجناس في النثر الجاهلي وأثرهما الصوتي",
                "مراجعة شاملة للبلاغة: التشبيه بأقسامه، الاستعارة بنوعيها، المجاز المرسل"
              ],
              "writing": [
                "فرض الثلاثي الأول المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "النقد الأدبي: خصائص المثل والحكمة الأدبية والفرق الجوهري بينهما",
                "مطالعة موجهة: سوق عكاظ ودوره في توحيد لغة العرب وتهذيب ألسنتهم",
                "حل ومناقشة موضوع امتحاني فصلي نموذجي مع شبكة التقييم بالمعايير"
              ]
            }
          },
          {
            "id": "1as-lit-dec",
            "monthNameAr": "ديسمبر",
            "monthIndex": 12,
            "semester": 1,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 11,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "اختبارات الفصل الدراسي الأول (الثلاثي الأول)",
                "theme": "التقويم التحصيلي الرسمي لجميع مواد الجذع المشترك آداب ولغات",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الأول - 03 ساعات)",
                "grammar": "تطبيق سلم التنقيط المعتمد والمعايير البيداغوجية التفتيشية الرسمية",
                "rhetoricOrProsody": "مراجعة المكتسبات",
                "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة النتائج",
                "writingOrIntegration": "اختبارات الفصل الأول",
                "hours": 5,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 12,
                "monthNameAr": "ديسمبر",
                "unitNumber": 4,
                "unitTitle": "التصحيح والمعالجة ومجالس الأقسام وعطلة الشتاء",
                "theme": "استثمار نتائج الاختبارات ومعالجة التعثرات الفردية والجماعية في التحليل الأدبي",
                "literaryText": "التصحيح الجماعي المفصل وتوزيع أوراق الاختبارات على التلاميذ ومناقشتها",
                "grammar": "حصص المعالجة البيداغوجية للنقاط الصعبة في العروض والإعراب والبلاغة",
                "rhetoricOrProsody": "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول",
                "guidedReadingOrCommunicative": "توجيهات القراءة الإثرائية لأدب صدر الإسلام خلال العطلة الشتوية",
                "writingOrIntegration": "بداية عطلة الشتاء المدرسية الرسمية",
                "hours": 5,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الشتاء",
                "notes": "عطلة الشتاء"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الأول - 03 ساعات)",
                "التصحيح الجماعي المفصل وتوزيع أوراق الاختبارات على التلاميذ ومناقشتها"
              ],
              "grammar": [
                "تطبيق سلم التنقيط المعتمد والمعايير البيداغوجية التفتيشية الرسمية",
                "حصص المعالجة البيداغوجية للنقاط الصعبة في العروض والإعراب والبلاغة"
              ],
              "rhetoric": [
                "مراجعة المكتسبات",
                "تسليم كشوف النقاط ومجالس الأساتذة ونهاية الثلاثي الأول"
              ],
              "writing": [
                "اختبارات ومداولات الفصل",
                "بداية عطلة الشتاء المدرسية الرسمية"
              ]
            },
            "examTitle": "اختبارات الفصل الأول وعطلة الشتاء"
          }
        ]
      },
      {
        "trimester": 2,
        "title": "الفصل الدراسي الثاني (الثلاثي الثاني: أدب صدر الإسلام والأدب الأموي)",
        "monthsRange": "جانفي — مارس",
        "weeksCount": 10,
        "hoursCount": 50,
        "months": [
          {
            "id": "1as-lit-jan",
            "monthNameAr": "جانفي",
            "monthIndex": 1,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 13,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "أدب صدر الإسلام: القيم الروحية والاجتماعية في الإسلام",
                "theme": "استئناف التعلمات وتأثير الوحي القرآني في تهذيب الأخلاق والبيان العربي",
                "literaryText": "النص الأدبي: في مدح الرسول ﷺ ونصرة الحق (حسان بن ثابت الأنصاري)",
                "grammar": "أحكام المنادى وأنواعه بالتفصيل وأحكام المنادى المبني والمعرب",
                "rhetoricOrProsody": "الكناية بأنواعها الثلاثة (عن صفة وموصوف ونسبة) وسر بلاغتها في الإيضاح",
                "guidedReadingOrCommunicative": "عروض: بحر الكامل وتطبيقاته في شعر الدعوة الإسلامية والمديح النبوي",
                "writingOrIntegration": "النص التواصلي: أثر القرآن الكريم والحديث النبوي في ترقية اللغة والفكر",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 14,
                "monthNameAr": "جانفي",
                "unitNumber": 5,
                "unitTitle": "أدب صدر الإسلام: شعر التوبة والاعتذار والنجاة",
                "theme": "قصيدة البردة لكعب بن زهير وإنشادها بين يدي خاتم الأنبياء والمرسلين",
                "literaryText": "النص الأدبي: بانت سعاد في مدح النبي والاعتذار والصفح (كعب بن زهير)",
                "grammar": "المفعول المطلق وأنواعه (المؤكد لفعله، المبين لنوعه، المبين لعدده) وما ينوب عنه",
                "rhetoricOrProsody": "الأساليب الإنشائية الطلبية: التمني والنداء والاستفهام وأغراضها المجازية",
                "guidedReadingOrCommunicative": "عروض: بحر البسيط وتطبيقاته في لامية كعب بن زهير الخالدة",
                "writingOrIntegration": "مطالعة موجهة: سيرة شعراء الرسول ﷺ ودورهم في معركة الكلمة والبيان",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 15,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "أدب صدر الإسلام: شعر النضال والجهاد والدفاع عن الرسالة",
                "theme": "الشعر في خدمة المبادئ السامية والجهاد دفاعا عن حرية المعتقد والأمة",
                "literaryText": "النص الأدبي: شعر الفتوح والجهاد (عبد الله بن رواحة / الحطيئة)",
                "grammar": "التوكيد اللفظي والتوكيد المعنوي بألفاظه الستة وأحكام إعرابهما",
                "rhetoricOrProsody": "الاستعارة التمثيلية وتوظيفها البلاغي في رسم مشاهد الصراع والبطولة",
                "guidedReadingOrCommunicative": "عروض: بحر الوافر وتطبيقاته في قصائد النضال والشهادة في صدر الإسلام",
                "writingOrIntegration": "النقد الأدبي: موقف الإسلام من الشعر والشعراء وتفنيد دعاوى معارضة الفن",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 16,
                "monthNameAr": "جانفي",
                "unitNumber": 6,
                "unitTitle": "أدب صدر الإسلام: عطف النسق والروابط اللغوية في النص",
                "theme": "متابعة دراسة نصوص صدر الإسلام وخصوصياتها البيانية والأسلوبية",
                "literaryText": "النص الأدبي: في البطولة والتضحية والشهادة (الصحابي خبيب بن عدي)",
                "grammar": "عطف النسق وحروف العطف التسعة ودلالاتها ومعانيها الدقيقة في السياق",
                "rhetoricOrProsody": "المحسنات البديعية المعنوية: الطباق والمقابلة وأثرهما الإيقاعي والدلالي",
                "guidedReadingOrCommunicative": "عروض: مراجعة القافية وعيوبها (الإيطاء والتضمين والإقواء)",
                "writingOrIntegration": "مطالعة موجهة: صور مشرقة من بطولات وتضحيات الصحابة في الفتوحات",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: في مدح الرسول ﷺ ونصرة الحق (حسان بن ثابت الأنصاري)",
                "النص الأدبي: بانت سعاد في مدح النبي والاعتذار والصفح (كعب بن زهير)",
                "النص الأدبي: شعر الفتوح والجهاد (عبد الله بن رواحة / الحطيئة)",
                "النص الأدبي: في البطولة والتضحية والشهادة (الصحابي خبيب بن عدي)"
              ],
              "grammar": [
                "أحكام المنادى وأنواعه بالتفصيل وأحكام المنادى المبني والمعرب",
                "المفعول المطلق وأنواعه (المؤكد لفعله، المبين لنوعه، المبين لعدده) وما ينوب عنه",
                "التوكيد اللفظي والتوكيد المعنوي بألفاظه الستة وأحكام إعرابهما",
                "عطف النسق وحروف العطف التسعة ودلالاتها ومعانيها الدقيقة في السياق"
              ],
              "rhetoric": [
                "الكناية بأنواعها الثلاثة (عن صفة وموصوف ونسبة) وسر بلاغتها في الإيضاح",
                "الأساليب الإنشائية الطلبية: التمني والنداء والاستفهام وأغراضها المجازية",
                "الاستعارة التمثيلية وتوظيفها البلاغي في رسم مشاهد الصراع والبطولة",
                "المحسنات البديعية المعنوية: الطباق والمقابلة وأثرهما الإيقاعي والدلالي"
              ],
              "writing": [
                "النص التواصلي: أثر القرآن الكريم والحديث النبوي في ترقية اللغة والفكر",
                "مطالعة موجهة: سيرة شعراء الرسول ﷺ ودورهم في معركة الكلمة والبيان",
                "النقد الأدبي: موقف الإسلام من الشعر والشعراء وتفنيد دعاوى معارضة الفن",
                "مطالعة موجهة: صور مشرقة من بطولات وتضحيات الصحابة في الفتوحات"
              ]
            }
          },
          {
            "id": "1as-lit-feb",
            "monthNameAr": "فيفري",
            "monthIndex": 2,
            "semester": 2,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 17,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "الأدب الأموي: شعر الغزل العفيف (العذري)",
                "theme": "نشأة الغزل العفيف في بوادي نجد والحجاز والطهارة والوفاء للمحبوبة",
                "literaryText": "النص الأدبي: في الغزل العفيف العذري (جميل بن معمر - جميل بثينة)",
                "grammar": "البدل وأنواعه الأربعة (مطابق، بعض من كل، اشتمال، مباين) وإعرابه المفصل",
                "rhetoricOrProsody": "أسلوب القصر وطرقه البلاغية (النفي والاستثناء، إنما، العطف بـ لا وبل ولكن)",
                "guidedReadingOrCommunicative": "عروض: بحر الطويل وتطبيقاته في شعر الغزل العذري الأموي",
                "writingOrIntegration": "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الفصل الثاني"
              },
              {
                "weekNumber": 18,
                "monthNameAr": "فيفري",
                "unitNumber": 7,
                "unitTitle": "الأدب الأموي: النعت وتطبيقاته في تصوير المشاعر",
                "theme": "تصوير نقاء السريرة وخلود المحبة العفيفة في أشعار العذريين",
                "literaryText": "النص الأدبي: الوفاء والحنين والشوق العفيف (قيس بن ذريح / عروة بن حزام)",
                "grammar": "النعت الحقيقي والنعت السببي وشروط مطابقة كل منهما لمنعوته",
                "rhetoricOrProsody": "الصور البيانية المركبة: الجمع الفني بين التشبيه والاستعارة في الغزل",
                "guidedReadingOrCommunicative": "عروض: بحر الرمل وأوزانه الشائعة في شعر العاطفة والوجدان",
                "writingOrIntegration": "مطالعة موجهة: البيئة العذرية في العصر الأموي وظروف نشأتها التاريخية والاجتماعية",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 19,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "الأدب الأموي: شعر النقائض والشعر السياسي الحزبي",
                "theme": "المبارزات الشعرية الكبرى في المربد بالبصرة بين جرير والفرزدق والأخطل",
                "literaryText": "النص الأدبي: من شعر النقائض (جرير والفرزدق - صراع الفخر والهجاء)",
                "grammar": "التمييز بأنواعه (تمييز المفرد والملفوظ وتمييز الجملة والملحوظ) وإعرابه",
                "rhetoricOrProsody": "المحسنات اللفظية: الجناس التام والناقص، السجع، ورد العجز على الصدر",
                "guidedReadingOrCommunicative": "عروض: مراجعة البحور الشعرية الخمسة المقررة في السنة الأولى آداب",
                "writingOrIntegration": "النقد الأدبي: العوامل السياسية والاجتماعية والفنية التي أدت لظهور النقائض",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 20,
                "monthNameAr": "فيفري",
                "unitNumber": 8,
                "unitTitle": "الوضعية الإدماجية للثلاثي الثاني والتحضير للاختبارات",
                "theme": "إدماج شامل لمقرر صدر الإسلام والأدب الأموي وقواعد النحو والبلاغة والعروض",
                "literaryText": "وضعية إدماجية نقدية مركبة حول تطور الشعر وموسيقاه وأغراضه عبر العصور",
                "grammar": "مراجعة المنادى، المفعول المطلق، التوكيد، البدل، النعت، التمييز",
                "rhetoricOrProsody": "مراجعة الكناية، القصر، الاستعارة، وأدوات الاتساق والانسجام النحوي",
                "guidedReadingOrCommunicative": "تطبيق شبكة التقييم بالمعايير الرسمية المعتمدة في تصحيح الإنتاج الكتابي",
                "writingOrIntegration": "حل ومناقشة موضوع اختباري فصلي نموذجي للجذع المشترك آداب",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: في الغزل العفيف العذري (جميل بن معمر - جميل بثينة)",
                "النص الأدبي: الوفاء والحنين والشوق العفيف (قيس بن ذريح / عروة بن حزام)",
                "النص الأدبي: من شعر النقائض (جرير والفرزدق - صراع الفخر والهجاء)",
                "وضعية إدماجية نقدية مركبة حول تطور الشعر وموسيقاه وأغراضه عبر العصور"
              ],
              "grammar": [
                "البدل وأنواعه الأربعة (مطابق، بعض من كل، اشتمال، مباين) وإعرابه المفصل",
                "النعت الحقيقي والنعت السببي وشروط مطابقة كل منهما لمنعوته",
                "التمييز بأنواعه (تمييز المفرد والملفوظ وتمييز الجملة والملحوظ) وإعرابه",
                "مراجعة المنادى، المفعول المطلق، التوكيد، البدل، النعت، التمييز"
              ],
              "rhetoric": [
                "أسلوب القصر وطرقه البلاغية (النفي والاستثناء، إنما، العطف بـ لا وبل ولكن)",
                "الصور البيانية المركبة: الجمع الفني بين التشبيه والاستعارة في الغزل",
                "المحسنات اللفظية: الجناس التام والناقص، السجع، ورد العجز على الصدر",
                "مراجعة الكناية، القصر، الاستعارة، وأدوات الاتساق والانسجام النحوي"
              ],
              "writing": [
                "فرض الثلاثي الثاني المحروس + تصحيح ومعالجة بيداغوجية معيارية",
                "مطالعة موجهة: البيئة العذرية في العصر الأموي وظروف نشأتها التاريخية والاجتماعية",
                "النقد الأدبي: العوامل السياسية والاجتماعية والفنية التي أدت لظهور النقائض",
                "حل ومناقشة موضوع اختباري فصلي نموذجي للجذع المشترك آداب"
              ]
            }
          },
          {
            "id": "1as-lit-mar",
            "monthNameAr": "مارس",
            "monthIndex": 3,
            "semester": 2,
            "weeksCount": 2,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 21,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "اختبارات الفصل الدراسي الثاني (الثلاثي الثاني)",
                "theme": "التقويم التحصيلي الرسمي للثلاثي الثاني لمواد الجذع المشترك آداب ولغات",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الثاني - 03 ساعات)",
                "grammar": "تطبيق كافة معايير المفتشية العامة في بناء الأسئلة وسلم التنقيط التفتيشي",
                "rhetoricOrProsody": "مراجعة المكتسبات",
                "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة السلالم وتوزيع العلامات",
                "writingOrIntegration": "اختبارات الفصل الثاني",
                "hours": 5,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 22,
                "monthNameAr": "مارس",
                "unitNumber": 8,
                "unitTitle": "التصحيح والمعالجة ومجالس الأقسام وعطلة الربيع",
                "theme": "المعالجة البيداغوجية لمواطن التعثر في التحليل الأدبي والنقدي والعروضي",
                "literaryText": "التصحيح الجماعي المفصل وتحليل إجابات المتعلمين لمعالجة الأخطاء الشائعة",
                "grammar": "معالجة النقائص في التلخيص المنهجي والإعراب والتحليل البلاغي والعروضي",
                "rhetoricOrProsody": "تسليم كشوف النقاط للثلاثي الثاني ومجالس الأقسام للمؤسسة",
                "guidedReadingOrCommunicative": "إرشادات القراءة والمطالعة الذاتية خلال العطلة الربيعية الرسمية",
                "writingOrIntegration": "بداية عطلة الربيع المدرسية",
                "hours": 5,
                "isExamPeriod": true,
                "isHoliday": true,
                "holidayName": "عطلة الربيع",
                "notes": "عطلة الربيع"
              }
            ],
            "branchSummary": {
              "literature": [
                "إجراء اختبار مادة اللغة العربية وآدابها (الفصل الثاني - 03 ساعات)",
                "التصحيح الجماعي المفصل وتحليل إجابات المتعلمين لمعالجة الأخطاء الشائعة"
              ],
              "grammar": [
                "تطبيق كافة معايير المفتشية العامة في بناء الأسئلة وسلم التنقيط التفتيشي",
                "معالجة النقائص في التلخيص المنهجي والإعراب والتحليل البلاغي والعروضي"
              ],
              "rhetoric": [
                "مراجعة المكتسبات",
                "تسليم كشوف النقاط للثلاثي الثاني ومجالس الأقسام للمؤسسة"
              ],
              "writing": [
                "اختبارات ومداولات الفصل",
                "بداية عطلة الربيع المدرسية"
              ]
            },
            "examTitle": "اختبارات الفصل الثاني وعطلة الربيع"
          }
        ]
      },
      {
        "trimester": 3,
        "title": "الفصل الدراسي الثالث (الثلاثي الثالث: الخطابة وأدب الفتوحات)",
        "monthsRange": "أفريل — جوان",
        "weeksCount": 10,
        "hoursCount": 50,
        "months": [
          {
            "id": "1as-lit-apr",
            "monthNameAr": "أفريل",
            "monthIndex": 4,
            "semester": 3,
            "weeksCount": 4,
            "isExamPeriod": false,
            "weeks": [
              {
                "weekNumber": 23,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "الأدب الأموي: فن الخطابة والمناظرات السياسية والدينية",
                "theme": "استئناف التعلمات وازدهار فن الخطابة لمواكبة الصراعات الحزبية والفتوحات",
                "literaryText": "النص الأدبي: الخطابة في العصر الأموي (خطبة زياد بن أبيه البتراء / طارق بن زياد)",
                "grammar": "أسلوب التعجب بصيغتيه القياسيتين (ما أفعله وأفعل به) وشروط صياغتهما",
                "rhetoricOrProsody": "المقابلة وبلاغتها في إبراز التضاد بين المعاني وتأكيد الأفكار والحجج",
                "guidedReadingOrCommunicative": "عروض: بحر المتقارب وتطبيقاته في شعر الحماسة والخطابة المنظومة",
                "writingOrIntegration": "النقد الأدبي: خصائص الخطابة الأموية وأسباب رقيها وتفوقها على الخطابة الجاهلية",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 24,
                "monthNameAr": "أفريل",
                "unitNumber": 9,
                "unitTitle": "الأدب الأموي: أسلوب الشرط وفنون الرسائل والوصايا",
                "theme": "متابعة نصوص النثر الأموي وتأسيس ديوان الرسائل على يد عبد الحميد الكاتب",
                "literaryText": "النص الأدبي: من الرسائل والوصايا الأموية (رسالة عبد الحميد الكاتب للكتاب)",
                "grammar": "أسلوب الشرط وأدواته الجازمة وغير الجازمة وإعراب جملتي الشرط والجواب",
                "rhetoricOrProsody": "الاقتباس والتضمين من القرآن الكريم والحديث النبوي الشريف في النثر",
                "guidedReadingOrCommunicative": "عروض: بحر الهزج وتفعيلاته وأوزانه واستعمالاته في الشعر الغنائي",
                "writingOrIntegration": "مطالعة موجهة: عبد الحميد الكاتب ودوره التاريخي في إرساء أصول النثر الفني",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 25,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "أدب الفتوحات الإسلامية: شعر الشوق والحنين إلى الأوطان",
                "theme": "مشاعر المجاهدين في الثغور البعيدة وتصوير لوعة الغربة والشوق للديار",
                "literaryText": "النص الأدبي: شعر الفتوح والشوق إلى الأوطان (مالك بن الريب في رثاء نفسه)",
                "grammar": "اسم التفضيل وحالاته الأربعة (مجرد، محلى بأل، مضاف لنكرة، مضاف لمعرفة)",
                "rhetoricOrProsody": "الأساليب الإنشائية الطلبية: التمني والترجي والنداء في التعبير عن الشوق",
                "guidedReadingOrCommunicative": "عروض: دراسة بحر الرجز وتطبيقاته في الأراجيز الحربية والتعليمية",
                "writingOrIntegration": "النص التواصلي: التواصل الإنساني والحضاري بين العرب والأمم المفتوحة",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 26,
                "monthNameAr": "أفريل",
                "unitNumber": 10,
                "unitTitle": "المفعول لأجله وتطبيقاته النحوية في النصوص",
                "theme": "متابعة دراسة نصوص الفتوحات وأبعادها الحضارية والإنسانية السامية",
                "literaryText": "النص الأدبي: في التضحية والفداء من أجل العقيدة (شعر صدر الإسلام والفتوح)",
                "grammar": "المفعول لأجله وشروط نصبه وإعرابه وحالات جره بحرف الجر الدال على التعليل",
                "rhetoricOrProsody": "المحسنات البديعية: الجناس والسجع ودورهما في إثراء الإيقاع الصوتي والإنشادي",
                "guidedReadingOrCommunicative": "عروض: مراجعة شاملة لجميع البحور المدروسة في السنة الأولى آداب",
                "writingOrIntegration": "فرض الثلاثي الثالث المحروس + التصحيح البيداغوجي الفوري والمعالجة",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": "فرض الثلاثي الثالث"
              }
            ],
            "branchSummary": {
              "literature": [
                "النص الأدبي: الخطابة في العصر الأموي (خطبة زياد بن أبيه البتراء / طارق بن زياد)",
                "النص الأدبي: من الرسائل والوصايا الأموية (رسالة عبد الحميد الكاتب للكتاب)",
                "النص الأدبي: شعر الفتوح والشوق إلى الأوطان (مالك بن الريب في رثاء نفسه)",
                "النص الأدبي: في التضحية والفداء من أجل العقيدة (شعر صدر الإسلام والفتوح)"
              ],
              "grammar": [
                "أسلوب التعجب بصيغتيه القياسيتين (ما أفعله وأفعل به) وشروط صياغتهما",
                "أسلوب الشرط وأدواته الجازمة وغير الجازمة وإعراب جملتي الشرط والجواب",
                "اسم التفضيل وحالاته الأربعة (مجرد، محلى بأل، مضاف لنكرة، مضاف لمعرفة)",
                "المفعول لأجله وشروط نصبه وإعرابه وحالات جره بحرف الجر الدال على التعليل"
              ],
              "rhetoric": [
                "المقابلة وبلاغتها في إبراز التضاد بين المعاني وتأكيد الأفكار والحجج",
                "الاقتباس والتضمين من القرآن الكريم والحديث النبوي الشريف في النثر",
                "الأساليب الإنشائية الطلبية: التمني والترجي والنداء في التعبير عن الشوق",
                "المحسنات البديعية: الجناس والسجع ودورهما في إثراء الإيقاع الصوتي والإنشادي"
              ],
              "writing": [
                "النقد الأدبي: خصائص الخطابة الأموية وأسباب رقيها وتفوقها على الخطابة الجاهلية",
                "مطالعة موجهة: عبد الحميد الكاتب ودوره التاريخي في إرساء أصول النثر الفني",
                "النص التواصلي: التواصل الإنساني والحضاري بين العرب والأمم المفتوحة",
                "فرض الثلاثي الثالث المحروس + التصحيح البيداغوجي الفوري والمعالجة"
              ]
            }
          },
          {
            "id": "1as-lit-may",
            "monthNameAr": "ماي",
            "monthIndex": 5,
            "semester": 3,
            "weeksCount": 3,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 27,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "المراجعة الشاملة الكبرى لمقرر السنة الأولى آداب",
                "theme": "تركيب مكتسبات السنة الأولى في الأدب الجاهلي وصدر الإسلام والأموي",
                "literaryText": "حل مواضيع تدريبية واختبارات شاملة تحاكي متطلبات السنة الثانية آداب وفلسفة",
                "grammar": "مراجعة مكثفة: إعراب الأفعال، النواسخ، المنادى، البدل، التمييز، التعجب",
                "rhetoricOrProsody": "مراجعة شاملة لعلوم البلاغة: التشبيه، الاستعارة، الكناية، القصر، المحسنات",
                "guidedReadingOrCommunicative": "مراجعة شاملة للعروض: بحور الشعر الخمسة، التفعيلات، الزحافات والعلل والقافية",
                "writingOrIntegration": "إنتاج نصوص نقدية إدماجية تعكس نضج التفكير الأدبي واللغوي لدى التلميذ",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 28,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "اختبارات الفصل الدراسي الثالث (الامتحانات السنوية الرسمية)",
                "theme": "الامتحانات الرسمية الشاملة لنهاية السنة لجميع أقسام الجذع المشترك آداب",
                "literaryText": "إجراء اختبار مادة اللغة العربية وآدابها لنهاية السنة (03 ساعات)",
                "grammar": "تطبيق المقاييس الرسمية المعتمدة في التقويم التفتيشي وسلالم التنقيط",
                "rhetoricOrProsody": "مراجعة المكتسبات",
                "guidedReadingOrCommunicative": "التصحيح النموذجي ومناقشة النتائج",
                "writingOrIntegration": "اختبارات الفصل الثالث",
                "hours": 5,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              },
              {
                "weekNumber": 29,
                "monthNameAr": "ماي",
                "unitNumber": 10,
                "unitTitle": "التصحيح الجماعي والمعالجة ومجالس التوجيه السنوية",
                "theme": "المعالجة البيداغوجية الختامية ومداولات مجالس الأقسام والقبول والتوجيه",
                "literaryText": "التصحيح الجماعي لمواضيع الاختبارات وتوزيع العلامات على التلاميذ ومناقشتها",
                "grammar": "مداولات مجالس الأقسام وتوجيه التلاميذ لشعبتي الآداب والفلسفة واللغات الأجنبية",
                "rhetoricOrProsody": "تسليم كشوف النقاط السنوية لأولياء التلاميذ",
                "guidedReadingOrCommunicative": "اختتام السنة الدراسية الأولى ثانوي رسميا",
                "writingOrIntegration": "مجالس الأقسام ونهاية السنة",
                "hours": 5,
                "isExamPeriod": true,
                "isHoliday": false,
                "holidayName": "",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "حل مواضيع تدريبية واختبارات شاملة تحاكي متطلبات السنة الثانية آداب وفلسفة",
                "إجراء اختبار مادة اللغة العربية وآدابها لنهاية السنة (03 ساعات)",
                "التصحيح الجماعي لمواضيع الاختبارات وتوزيع العلامات على التلاميذ ومناقشتها"
              ],
              "grammar": [
                "مراجعة مكثفة: إعراب الأفعال، النواسخ، المنادى، البدل، التمييز، التعجب",
                "تطبيق المقاييس الرسمية المعتمدة في التقويم التفتيشي وسلالم التنقيط",
                "مداولات مجالس الأقسام وتوجيه التلاميذ لشعبتي الآداب والفلسفة واللغات الأجنبية"
              ],
              "rhetoric": [
                "مراجعة شاملة لعلوم البلاغة: التشبيه، الاستعارة، الكناية، القصر، المحسنات",
                "مراجعة المكتسبات",
                "تسليم كشوف النقاط السنوية لأولياء التلاميذ"
              ],
              "writing": [
                "إنتاج نصوص نقدية إدماجية تعكس نضج التفكير الأدبي واللغوي لدى التلميذ",
                "اختبارات ومداولات الفصل"
              ]
            },
            "examTitle": "اختبارات الفصل الثالث ونهاية السنة"
          },
          {
            "id": "1as-lit-jun",
            "monthNameAr": "جوان",
            "monthIndex": 6,
            "semester": 3,
            "weeksCount": 1,
            "isExamPeriod": true,
            "weeks": [
              {
                "weekNumber": 30,
                "monthNameAr": "جوان",
                "unitNumber": 10,
                "unitTitle": "مجالس التوجيه والطعون ونهاية الموسم الدراسي",
                "theme": "إنهاء الإجراءات الإدارية والبيداغوجية واستقبال طعون التوجيه للشعب الأدبية",
                "literaryText": "دراسة ملفات الطعون المرفوعة من أولياء التلاميذ وفق المعايير الوزارية الرسمية",
                "grammar": "إعداد التقرير البيداغوجي السنوي لمادة اللغة العربية وآدابها للثانوية",
                "rhetoricOrProsody": "المشاركة في تأطير امتحانات شهادة البكالوريا والتعليم المتوسط الرسمية",
                "guidedReadingOrCommunicative": "إسدال الستار رسميا على الموسم الدراسي 2024/2025",
                "writingOrIntegration": "نهاية الموسم الدراسي",
                "hours": 5,
                "isExamPeriod": false,
                "isHoliday": true,
                "holidayName": "نهاية الموسم الدراسي",
                "notes": ""
              }
            ],
            "branchSummary": {
              "literature": [
                "دراسة ملفات الطعون المرفوعة من أولياء التلاميذ وفق المعايير الوزارية الرسمية"
              ],
              "grammar": [
                "إعداد التقرير البيداغوجي السنوي لمادة اللغة العربية وآدابها للثانوية"
              ],
              "rhetoric": [
                "المشاركة في تأطير امتحانات شهادة البكالوريا والتعليم المتوسط الرسمية"
              ],
              "writing": [
                "اختبارات ومداولات الفصل"
              ]
            },
            "examTitle": "نهاية الموسم الدراسي"
          }
        ]
      }
    ]
  }
];
