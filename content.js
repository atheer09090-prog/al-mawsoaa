/* سجل المحتوى المعتمد. الحقول المطلوبة: id, section, title.
 * الأقسام: library | presentations | play | practice | student-presentations | booklets | school
 * pages: معاينات كاملة متتابعة؛ downloads: مرفقات أصلية إضافية.
 * عدّل هذا الملف فقط؛ أمر البناء يزامن content.js ونسخة dist.
 */
window.OMANI_CONTENT = [
  {
    "id": "video-khalil-al-farahidi",
    "section": "library",
    "title": "الخليل بن أحمد الفراهيدي",
    "description": "عرض مرئي عن الخليل بن أحمد الفراهيدي.",
    "cover": "assets/content/covers/khalil-al-farahidi.webp",
    "file": "assets/content/videos/khalil-al-farahidi.mp4",
    "category": "شخصيات عُمانية",
    "audience": "جميع المراحل",
    "added": "2026-10-21"
  },
  {
    "id": "booklet-oman-plants",
    "section": "booklets",
    "title": "النباتات في سلطنة عُمان",
    "description": "مطوية بوجهين عن النباتات وبيئاتها في سلطنة عُمان، مع المادة التفصيلية الأصلية للقراءة والتنزيل.",
    "cover": "assets/content/covers/oman-plants.webp",
    "file": "assets/content/booklets/oman-plants-brochure.pdf",
    "category": "البيئة العُمانية",
    "audience": "جميع المراحل",
    "added": "2026-10-21",
    "pages": [
      {
        "src": "assets/content/booklets/oman-plants-brochure-1.webp",
        "label": "المطوية — الواجهة الأمامية",
        "width": 1600,
        "height": 1132
      },
      {
        "src": "assets/content/booklets/oman-plants-brochure-2.webp",
        "label": "المطوية — الوجه الآخر",
        "width": 1600,
        "height": 1132
      },
      {
        "src": "assets/content/booklets/oman-plants-1.webp",
        "label": "المادة التفصيلية — الصفحة 1",
        "width": 1600,
        "height": 900
      },
      {
        "src": "assets/content/booklets/oman-plants-2.webp",
        "label": "المادة التفصيلية — الصفحة 2",
        "width": 1600,
        "height": 900
      },
      {
        "src": "assets/content/booklets/oman-plants-3.webp",
        "label": "المادة التفصيلية — الصفحة 3",
        "width": 1600,
        "height": 900
      },
      {
        "src": "assets/content/booklets/oman-plants-4.webp",
        "label": "المادة التفصيلية — الصفحة 4",
        "width": 1600,
        "height": 900
      },
      {
        "src": "assets/content/booklets/oman-plants-5.webp",
        "label": "المادة التفصيلية — الصفحة 5",
        "width": 1600,
        "height": 900
      },
      {
        "src": "assets/content/booklets/oman-plants-6.webp",
        "label": "المادة التفصيلية — الصفحة 6",
        "width": 1600,
        "height": 900
      },
      {
        "src": "assets/content/booklets/oman-plants-7.webp",
        "label": "المادة التفصيلية — الصفحة 7",
        "width": 1600,
        "height": 900
      },
      {
        "src": "assets/content/booklets/oman-plants-8.webp",
        "label": "المادة التفصيلية — الصفحة 8",
        "width": 1600,
        "height": 900
      }
    ],
    "downloads": [
      {
        "label": "تنزيل المادة التفصيلية الأصلية (PDF)",
        "file": "assets/content/booklets/oman-plants.pdf"
      }
    ]
  },
  {
    "id": "booklet-birds-interactive",
    "section": "booklets",
    "title": "مطوية العقابيات التفاعلية",
    "description": "مطوية تفاعلية للتعرّف على فصيلة العقابيات.",
    "url": "https://magnificent-creponne-b82319.netlify.app/",
    "category": "الحياة الفطرية",
    "audience": "جميع المراحل",
    "added": "2026-10-21"
  },
  {
    "id": "game-oman-plants-adventure",
    "section": "play",
    "title": "مغامرة النبات العُماني",
    "description": "خمس محطات تفاعلية لاكتشاف النباتات وبيئاتها، مع إمكان تنزيل نسخة PowerPoint.",
    "cover": "assets/content/games/cover-oman-plants.svg",
    "embed": "assets/content/games/oman-plants-adventure.html",
    "file": "assets/content/games/oman-plants-adventure.pptx",
    "category": "البيئة العُمانية",
    "audience": "جميع المراحل",
    "added": "2026-10-21"
  },
  {
    "id": "game-faisal-journey",
    "section": "play",
    "title": "رحلة السلطان فيصل",
    "description": "مغامرة تاريخية عبر سبع مراحل في عهد السلطان فيصل بن تركي؛ استكشف المواقع والوثائق، وتفاعل مع الشخصيات، وأجب عن أسئلة المؤرّخ.",
    "cover": "assets/content/games/cover-faisal-journey.webp",
    "embed": "assets/content/games/faisal-journey.html",
    "category": "مغامرة تاريخية",
    "added": "2026-10-24"
  },
  {
    "id": "game-history-rescue",
    "section": "play",
    "title": "مهمة إنقاذ تاريخ عُمان",
    "description": "رحلة من ١٢ سؤالًا عبر عهد السلطان فيصل بن تركي، مع أدلة وتدرّج في المراحل وبطاقات للمراجعة.",
    "cover": "assets/content/games/cover-history.svg",
    "embed": "assets/content/games/oman-history-rescue.html",
    "category": "مغامرة تاريخية",
    "audience": "المرحلة الثانوية",
    "added": "2026-10-21"
  },
  {
    "id": "game-bahla-fortress",
    "section": "play",
    "title": "أسرار قلعة بهلاء",
    "description": "افتح سبعة أبواب معرفية عن القلعة، واجمع النقاط والمفاتيح حتى تصل إلى شهادة المستكشف.",
    "cover": "assets/content/games/cover-bahla.svg",
    "embed": "assets/content/games/bahla-fortress.html",
    "category": "مغامرة تاريخية",
    "audience": "جميع المراحل",
    "added": "2026-10-21"
  },
  {
    "id": "presentation-frankincense-tree-video",
    "section": "library",
    "title": "شجرة اللبان العُمانية",
    "description": "عرض مرئي قصير يعرّف بشجرة اللبان العُمانية ومكانتها في البيئة والتراث.",
    "cover": "assets/content/presentations/frankincense-tree-cover.webp",
    "file": "assets/content/presentations/frankincense-tree.mp4",
    "category": "البيئة العُمانية",
    "audience": "جميع المراحل",
    "added": "2026-10-21"
  },
  {
    "id": "video-omani-drum",
    "section": "practice",
    "title": "الطبل العربي في التراث العُماني",
    "description": "تطبيق عملي مصوّر من التراث العُماني، يقرّب المعرفة من التجربة والمشاركة.",
    "cover": "assets/content/covers/omani-drum.webp",
    "file": "assets/content/videos/omani-drum.mp4",
    "category": "التراث العُماني",
    "audience": "جميع المراحل",
    "added": "2026-10-23"
  },
  {
    "id": "video-tab-tanyan",
    "section": "practice",
    "title": "لعبة طاب طنيان",
    "description": "مقطع واقعي يعرض لعبة طاب طنيان ضمن تطبيقات المعرفة والتراث في البيئة المدرسية.",
    "cover": "assets/content/covers/tab-tanyan.webp",
    "file": "assets/content/videos/tab-tanyan.mp4",
    "category": "الألعاب الشعبية",
    "audience": "جميع المراحل",
    "added": "2026-10-23"
  },
  {
    "id": "video-oman-terns",
    "section": "library",
    "title": "طيور خطاف البحر في عُمان",
    "description": "فيديو تعليمي للتعرّف على طيور خطاف البحر في عُمان.",
    "cover": "assets/content/covers/oman-terns.webp",
    "file": "assets/content/videos/oman-terns.mp4",
    "category": "الحياة الفطرية",
    "audience": "جميع المراحل",
    "added": "2026-10-23"
  },
  {
    "id": "game-tern-trail",
    "section": "play",
    "title": "رحلة طيور عُمان — Tern Trail",
    "description": "استكشف رحلة طيور عُمان في لعبة تفاعلية تفتح في تبويب جديد.",
    "cover": "assets/content/covers/oman-terns.webp",
    "url": "https://rosebud.ai/play/tern-trail",
    "category": "الحياة الفطرية",
    "audience": "جميع المراحل",
    "added": "2026-10-23"
  },
  {
    "id": "booklet-oman-terns",
    "section": "booklets",
    "title": "طيور خطاف البحر في عُمان",
    "description": "المطوية الأصلية كاملة للقراءة والمعاينة، مع نسخة PDF للتنزيل.",
    "cover": "assets/content/booklets/oman-terns-original.jpg",
    "file": "assets/content/booklets/oman-terns.pdf",
    "pages": [
      {
        "src": "assets/content/booklets/oman-terns-1.webp",
        "label": "مطوية طيور خطاف البحر — الصفحة كاملة",
        "width": 1600,
        "height": 1056
      }
    ],
    "downloads": [
      {
        "label": "تنزيل الصورة الأصلية",
        "file": "assets/content/booklets/oman-terns-original.jpg"
      }
    ],
    "category": "الحياة الفطرية",
    "audience": "جميع المراحل",
    "added": "2026-10-23"
  },
  {
    "id": "booklet-faisal-bin-turki",
    "section": "booklets",
    "title": "فيصل بن تركي البوسعيدي",
    "description": "مطوية من وجهين؛ الواجهة الأمامية أولًا ثم الوجه الخلفي، مع تنزيل PDF والصورة الأصلية.",
    "cover": "assets/content/covers/faisal-bin-turki.webp",
    "file": "assets/content/booklets/faisal-bin-turki.pdf",
    "pages": [
      {
        "src": "assets/content/booklets/faisal-bin-turki-1.webp",
        "label": "الواجهة الأمامية",
        "width": 1600,
        "height": 902
      },
      {
        "src": "assets/content/booklets/faisal-bin-turki-2.webp",
        "label": "الوجه الخلفي",
        "width": 1600,
        "height": 740
      }
    ],
    "downloads": [
      {
        "label": "تنزيل الصورة الأصلية الكاملة",
        "file": "assets/content/booklets/faisal-bin-turki-original.jpg"
      }
    ],
    "category": "شخصيات عُمانية",
    "audience": "جميع المراحل",
    "added": "2026-10-23"
  },
  {
    "id": "presentation-faisal-bin-turki",
    "section": "presentations",
    "title": "السلطان فيصل بن تركي البوسعيدي",
    "description": "العرض التقديمي المرفق عن السلطان فيصل بن تركي البوسعيدي، متاح للتنزيل بصيغة PowerPoint.",
    "cover": "assets/content/covers/faisal-bin-turki.webp",
    "file": "assets/content/presentations/faisal-bin-turki.pptx",
    "category": "شخصيات عُمانية",
    "audience": "جميع المراحل",
    "added": "2026-10-23"
  },
  {
    "id": "presentation-economy-encyclopedia",
    "section": "presentations",
    "title": "الاقتصاد في الموسوعة",
    "description": "عرض تقديمي متاح لمعاينة الشرائح كاملة وتنزيل ملف PowerPoint الأصلي.",
    "cover": "assets/content/presentations/economy-slide-01.webp",
    "file": "assets/content/presentations/economy-encyclopedia.pptx",
    "pages": [
      {
        "src": "assets/content/presentations/economy-slide-01.webp",
        "label": "الشريحة 1",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-02.webp",
        "label": "الشريحة 2",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-03.webp",
        "label": "الشريحة 3",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-04.webp",
        "label": "الشريحة 4",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-05.webp",
        "label": "الشريحة 5",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-06.webp",
        "label": "الشريحة 6",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-07.webp",
        "label": "الشريحة 7",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-08.webp",
        "label": "الشريحة 8",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-09.webp",
        "label": "الشريحة 9",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-10.webp",
        "label": "الشريحة 10",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-11.webp",
        "label": "الشريحة 11",
        "width": 1376,
        "height": 768
      },
      {
        "src": "assets/content/presentations/economy-slide-12.webp",
        "label": "الشريحة 12",
        "width": 1376,
        "height": 768
      }
    ],
    "category": "الاقتصاد العُماني",
    "added": "2026-10-24"
  },
  {
    "id": "booklet-oman-heritage-treasures",
    "section": "booklets",
    "title": "كنوز من تراث عُمان",
    "description": "مطوية من وجهين متاحة للقراءة كاملة وتنزيل ملف PDF الأصلي.",
    "cover": "assets/content/booklets/oman-heritage-treasures-1.webp",
    "file": "assets/content/booklets/oman-heritage-treasures.pdf",
    "pages": [
      {
        "src": "assets/content/booklets/oman-heritage-treasures-1.webp",
        "label": "الواجهة الأمامية",
        "width": 1600,
        "height": 1132
      },
      {
        "src": "assets/content/booklets/oman-heritage-treasures-2.webp",
        "label": "الوجه الخلفي",
        "width": 1600,
        "height": 1132
      }
    ],
    "category": "التراث العُماني",
    "added": "2026-10-24"
  }
];
