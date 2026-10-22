/*
 * محتوى الموقع — أضيفوا المواد هنا دون تغيير تصميم الصفحات.
 * الحقول المطلوبة فقط: id, section, title. بقية الحقول اختيارية.
 * sections: library | presentations | play | student-presentations | booklets | school
 * أضيفوا فيديوهات عروض الطلاب لاحقًا تحت القسم student-presentations.
 * الملفات توضع داخل assets/content/ وتكتب مساراتها مثل: assets/content/video.mp4
 */
window.OMANI_CONTENT = [
  {
    id: "video-khalil-al-farahidi",
    section: "library",
    title: "الخليل بن أحمد الفراهيدي",
    description: "عرض مرئي عن الخليل بن أحمد الفراهيدي.",
    cover: "assets/content/covers/khalil-al-farahidi.webp",
    file: "assets/content/videos/khalil-al-farahidi.mp4",
    category: "شخصيات عُمانية",
    audience: "جميع المراحل",
    added: "2026-10-21"
  },
  {
    id: "booklet-oman-plants",
    section: "booklets",
    title: "النباتات في سلطنة عُمان",
    description: "مطوية تعريفية عن تنوّع النباتات والبيئات العُمانية.",
    cover: "assets/content/covers/oman-plants.webp",
    file: "assets/content/booklets/oman-plants.pdf",
    category: "البيئة العُمانية",
    audience: "جميع المراحل",
    added: "2026-10-21"
  },
  {
    id: "booklet-birds-interactive",
    section: "booklets",
    title: "مطوية العقابيات التفاعلية",
    description: "مطوية تفاعلية للتعرّف على فصيلة العقابيات.",
    url: "https://magnificent-creponne-b82319.netlify.app/",
    category: "الحياة الفطرية",
    audience: "جميع المراحل",
    added: "2026-10-21"
  },
  {
    id: "game-oman-plants-adventure",
    section: "play",
    title: "مغامرة النبات العُماني",
    description: "خمس محطات تفاعلية لاكتشاف النباتات وبيئاتها، مع إمكان تنزيل نسخة PowerPoint.",
    cover: "assets/content/games/cover-oman-plants.svg",
    embed: "assets/content/games/oman-plants-adventure.html",
    file: "assets/content/games/oman-plants-adventure.pptx",
    category: "البيئة العُمانية",
    audience: "جميع المراحل",
    added: "2026-10-21"
  },
  {
    id: "presentation-omani-frankincense",
    section: "presentations",
    title: "شجرة اللبان العُمانية",
    description: "عرض طالبات عن مكانة شجرة اللبان العُمانية وطرق جمعه والمحافظة عليها.",
    cover: "assets/content/presentations/frankincense-tree-cover.webp",
    file: "assets/content/presentations/omani-frankincense.pptx",
    preview: "assets/content/presentations/omani-frankincense.pdf",
    category: "البيئة والتراث العُماني",
    audience: "جميع المراحل",
    added: "2026-10-21"
  },
  {
    id: "game-history-rescue",
    section: "play",
    title: "مهمة إنقاذ تاريخ عُمان",
    description: "رحلة من ١٢ سؤالًا عبر عهد السلطان فيصل بن تركي، مع أدلة وتدرّج في المراحل وبطاقات للمراجعة.",
    cover: "assets/content/games/cover-history.svg",
    embed: "assets/content/games/oman-history-rescue.html",
    category: "مغامرة تاريخية",
    audience: "المرحلة الثانوية",
    added: "2026-10-21"
  },
  {
    id: "game-bahla-fortress",
    section: "play",
    title: "أسرار قلعة بهلاء",
    description: "افتح سبعة أبواب معرفية عن القلعة، واجمع النقاط والمفاتيح حتى تصل إلى شهادة المستكشف.",
    cover: "assets/content/games/cover-bahla.svg",
    embed: "assets/content/games/bahla-fortress.html",
    category: "مغامرة تاريخية",
    audience: "جميع المراحل",
    added: "2026-10-21"
  },
  {
    id: "presentation-frankincense-tree-video",
    section: "presentations",
    title: "شجرة اللبان العُمانية",
    description: "عرض مرئي قصير يعرّف بشجرة اللبان العُمانية ومكانتها في البيئة والتراث.",
    cover: "assets/content/presentations/frankincense-tree-cover.webp",
    file: "assets/content/presentations/frankincense-tree.mp4",
    category: "البيئة العُمانية",
    audience: "جميع المراحل",
    added: "2026-10-21"
  },
  // مثال قابل للنسخ بعد استلام مادة فعلية:
  // { id: "video-01", section: "library", title: "عنوان الفيديو", description: "وصف مختصر", cover: "assets/content/video-cover.jpg", file: "assets/content/video.mp4", category: "مرئي", audience: "المرحلة الإعدادية", added: "2026-10-13" },
  // { id: "activity-01", section: "school", title: "عنوان النشاط", description: "فكرة النشاط", steps: ["الخطوة الأولى", "الخطوة الثانية"], audience: "جميع المراحل", category: "نشاط صفي", attachment: "assets/content/activity.pdf", added: "2026-10-13" }
];
