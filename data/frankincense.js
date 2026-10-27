/* المراجع تفصل الحقائق عن معاملات اللعبة الرمزية، بلا قياسات نقش حقيقية. */
(() => {
'use strict';
const enc={kind:'encyclopedia',entryTitle:'اللبان — فقرة استخراجه وتتمتها',volume:null,page:null,url:null,note:'صورتا الصفحتين اللتان أرسلهما صاحب المشروع. رقما المجلد والصفحة غير ظاهرين. لم تُنقل مدة موسم واحد إلى جميع المواقع.'};
const study={kind:'supporting',entryTitle:'Alamri & AL-Shanfari — Harvesting and agro-ecological zones effects on sustainability of Boswellia sacra in Oman (2025)',volume:null,page:'١–٢، ٩–١٠ من PDF',url:'https://d-nb.info/1370044135/34',note:'بحث أصلي لباحثَين من دائرة البحوث الزراعية والحيوانية في ظفار. لا يثبت نسب صحة أو وحدات عمق اللعبة؛ لم تُعمّم نتائج عينة واحدة على جميع أشجار عُمان.'};
const estate={kind:'supporting',entryTitle:'وادي دوكة — Positive Change',volume:null,page:null,url:'https://www.wadidawkah.com/pages/positive-change',note:'وصف الجهة المشغلة لممارساتها؛ إرشاداتها تشمل عمق الجروح وعددها وتكرارها وراحة الأشجار، دون أرقام منشورة هنا.'};
const unesco={kind:'supporting',entryTitle:'اليونسكو — أرض اللبان',volume:null,page:null,url:'https://whc.unesco.org/en/list/1010/',note:'مرجع للنوع النباتي والموقع والتراث وحماية موقع أرض اللبان؛ ليس تصريحًا لممارسة النقش أو بيانًا بأن جميع أشجار عُمان لها حكم واحد.'};
const grades={kind:'supporting',entryTitle:'وزارة التجارة والصناعة وترويج الاستثمار — إعلان مؤشر اللبان العُماني، الجريدة الرسمية ١٥٩١ (٢٠٢٥)',volume:null,page:132,url:'https://data.qanoon.om/og/1591.pdf#page=132',note:'إعلان رسمي يذكر الحوجري والنجدي والشزري والسهلي ونطاق ظفار. لا يضع معيارًا بصريًا يحوّل اللون أو الحجم إلى صنف جغرافي.'};
const practice={kind:'supporting',entryTitle:'تصريح أحمد بن عامر بن سهيل العوائد، باحث في شجرة اللبان ومشرف على مواقع أرض اللبان — أثير (١٦ يناير ٢٠٢١)',volume:null,page:null,url:'https://www.atheer.om/archive/547223/',note:'تصريح منشور عن المنقف والحصاد والجمع والراحة ومناطق الأصناف؛ ليس مقابلة أجراها المشروع. يختلف توقيت الجولة الأولى عن وصف الموسوعة؛ استُخدمت مدة الموسوعة في المسار، مع إظهار الاختلاف هنا.'};
window.OMANI_FRANKINCENSE={
 version:'20261027-frankincense-r1',title:'من الشجرة إلى حبات اللبان',
 safety:'محاكاة تعليمية. أشجار اللبان ثروة طبيعية وتراثية؛ فلا تجرّب النقش على أي شجرة حقيقية دون إذن الجهات المختصة.',
 limits:'المشهد التفاعلي مؤقت مولّد بالكود فوق منظر حقيقي لظفار. الأعماق والصحة والكميات والعمر نسب ووحدات لعبة؛ لا تمثل مليمترات أو سنوات أو جرامات. ثلاث جولات تمثيلية وليست عدد جولات موسم حصاد حقيقي.',
 facts:[
  {id:'identity',stage:'الشجرة',text:'وادي دوكة من مواقع أرض اللبان، وتنمو فيه شجرة Boswellia sacra التي يُجمع راتنجها.',source:unesco},
  {id:'tree',stage:'الاختيار',text:'يتأثر المحصول بحجم الشجرة وقوتها؛ وتحذر الدراسة من أثر ممارسات النقش غير المناسبة.',source:study},
  {id:'tool',stage:'تجهيز الموضع',text:'تذكر الموسوعة أداة المنقف أو المنقاف لتجريح الشجرة وخروج سائل لبني.',source:enc},
  {id:'cut',stage:'النقش',text:'توصي الدراسة بضبط عمق الجرح وعدم بلوغ الخشب، وبترك مسافة بين مواضع النقش.',source:study},
  {id:'wait',stage:'الانتظار',text:'يذكر وصف الموسوعة ترك السائل الناتج من التجريح الأول نحو أسبوعين ليتصلب.',source:enc},
  {id:'collect',stage:'الجمع',text:'يُجمع اللبان بعد تجمّده. دقة التعامل مع الشجرة جزء من مهارة الجامع.',source:practice},
  {id:'rounds',stage:'الجولات',text:'تصف الموسوعة الاستخراج في ثلاث مراحل؛ وتذكر أن المرحلة الثالثة أهم في الإنتاج والجودة.',source:enc},
  {id:'rest',stage:'الاستدامة',text:'تتبع وادي دوكة ضوابط لعدد الجروح وعمقها وتكرارها، وتُمنح الأشجار فترة راحة صيفية.',source:estate},
  {id:'grades',stage:'الفرز',text:'من أصناف اللبان العُماني: الحوجري والنجدي والشزري والسهلي. يبقى أصل الدفعة ثابتًا عند فرز حباتها.',source:grades},
  {id:'origin',stage:'الأصل',text:'يرتبط الحوجري بأودية شرق جبل سمحان، والنجدي بأودية النجد، وتُنتج مناطق أخرى الشزري والشعبي.',source:practice},
  {id:'store',stage:'التخزين',text:'بعد الجمع يُعبّأ اللبان ويُحمَل إلى الأسواق؛ وتنتهي عمليات الجمع بإراحة الشجرة للموسم التالي.',source:practice},
  {id:'culture',stage:'الخاتمة',text:'تشهد مواقع أرض اللبان على تجارة ازدهرت قرونًا. ويُستخدم اللبان في البخور ضمن الثقافة المحلية.',source:{...practice,note:practice.note+' استُخدم وصف البخور فقط؛ لا ادعاءات علاجية.'}},
  {id:'protection',stage:'قبل البدء',text:'موقع أرض اللبان محمي وتُدار زيارته. التنبيه هنا احترازي تعليمي، وليس بيانًا لترخيص النقش في كل موقع.',source:unesco}
 ],
 stages:[
  {id:'tree',title:'اختر شجرتك',fact:'tree',hint:'تفحّص التاج واللحاء والآثار القديمة. اختيار الشجرة القوية يترك لك مجالًا للعمل برفق.',next:'اقترب من الجذع'},
  {id:'prepare',title:'تعرّف على المنقف',fact:'tool',hint:'تحرّك فوق سطح اللحاء بأداة الفحص. هذه حركة تعارف على الأداة؛ لا نزيل طبقة لم يوثق المصدر إزالتها.',next:'حدّد موضع النقش'},
  {id:'cut',title:'نقشٌ محسوب',fact:'cut',hint:'اختر موضعًا بعيدًا عن الندبة، واضبط العمق الرمزي في منتصف المؤشر، ثم اسحب طوليًا. شق واحد يكفي لتجربة الجولة.',next:'دع الوقت يعمل'},
  {id:'wait',title:'قطرات تتكوّن',fact:'wait',hint:'مرّر الأيام وراقب صلابة القطرات. بعد ١٤ يومًا تنتهي فترة الانتظار المرجعية في هذا النموذج.',next:'إلى الجمع'},
  {id:'collect',title:'اجمع برفق',fact:'collect',hint:'اضغط القطرات أو مرّر الأداة عليها. يمكن إنهاء الجمع ولو خسرت جزءًا من المحصول؛ تظل النتيجة محسوبة.',next:'نظّف وفرز'},
  {id:'sort',title:'كل حبة في موضعها',fact:'grades',hint:'حرّك الغربال لإزالة الشوائب، ثم اسحب الحبات إلى أوعية الحجم أو اختر الحبة والوعاء بلوحة المفاتيح.',next:'احفظ الدفعة'},
  {id:'store',title:'دفعة تحمل أصلها',fact:'store',hint:'انقل الدفعة إلى الوعاء. عزلها عن الغبار هنا خيار تفاعلي توضيحي يحتاج معايرة ميدانية.',next:'إلى المبخرة'},
  {id:'incense',title:'أثرٌ يبقى',fact:'culture',hint:'ضع حبة على المبخرة داخل المحاكاة، وتأمل ما جمعته وما أبقيته للشجرة.',next:'شاهد النتيجة'},
  {id:'result',title:'محصولك وأثر قراراتك',fact:'rest',hint:'وازن بين محصولك وسلامة الشجرة.',next:'أعد المحاولة'}
 ],
 trees:[
  {id:'east',name:'شجرة الأودية الشرقية',place:'شرق جبل سمحان · نموذج حوجري',origin:'الحوجري',treeAge:'بالغة',treeHealth:96,barkCondition:90,foliage:1,scars:1,size:1},
  {id:'nejd',name:'شجرة أودية النجد',place:'النجد · نموذج نجدي',origin:'النجدي',treeAge:'بالغة',treeHealth:88,barkCondition:80,foliage:.85,scars:2,size:.9},
  {id:'west',name:'شجرة تحتاج راحة',place:'أودية غربية · نموذج شزري',origin:'الشزري',treeAge:'بالغة',treeHealth:48,barkCondition:45,foliage:.4,scars:5,size:.85},
  {id:'plain',name:'شجرة صغيرة',place:'السهول · نموذج سهلي',origin:'السهلي',treeAge:'صغيرة',treeHealth:70,barkCondition:65,foliage:.55,scars:0,size:.5}
 ],
 tuning:{step:1/60,maxFrame:.1,uiInterval:.15,bestKey:'omani-frankincense-best-v1',
  initialDepth:40,initialAngle:90,initialHeight:50,oldScars:[{x:.38,y:.36},{x:.70,y:.76}],
  shallow:18,deep:68,spacing:.16,cutMotion:.07,prepareMotion:.6,collectMotion:.07,sieveMotion:.65,
  safeCuts:3,maxCuts:8,youngMultiplier:.4,weakMultiplier:.55,deepDamage:25,closeDamage:14,extraDamage:12,baseStress:2,
  waitDays:14,lateDays:28,dayPerSecond:1,maxDay:36,maxRounds:3,repeatStress:3,
  yieldPerCut:4,shallowYield:.1,deepYield:.55,earlyLoss:.55,lateDust:.03,sortPenalty:8,
  healthWeight:.6,careWeight:.2,sortingWeight:.2,smokeSeconds:1.5,maxLog:140,
  swatches:{large:'#efe8c5',small:'#cdbf8d',dirty:'#836846'},scene:{bark:['#76694f','#a39270','#403e32'],resin:'#eee3b0',leaf:'#526b45'}},
 confirmationTitle:'تحتاج تأكيدًا من جامع لبان',
 needsConfirmation:[
  'رقم المجلد والصفحتين المصورتين من مدخل اللبان.',
  'العمق والزاوية والارتفاع والمسافة وعدد المواضع المناسب لكل شجرة؛ لا قياسات فعلية في اللعبة.',
  'معايرة عمر الشجرة وصحتها والحرارة والرطوبة والإجهاد والتعافي والإنتاج عبر المواسم.',
  'تفاصيل إزالة اللحاء قبل النقش، وتنظيف الحبات وغربلتها وحجمها وظروف التخزين.',
  'معايير تمييز الدفعات بصريًا وفروق جودة الجولات؛ لا تحويل للحجم واللون إلى صنف جغرافي.',
  'الفواصل المحلية بين الجولات والتفاوت بين وصف الموسوعة والتصريحات والمواقع.'
 ],
 omitted:[
  'لم توضع مليمترات أو جرامات أو سنوات أو نسب تضرر كحقائق؛ جميع مؤشرات المشهد نسب لعبة رمزية.',
  'لم تُفترض أفضلية لون لحاء محدد أو توقيت إنقاذ أو نسب جودة لكل ضربة.',
  'لا فوائد علاجية أو تعليمات ممارسة حقيقية أو ادعاء بأن كل أشجار اللبان محمية بالحكم نفسه.',
  'لا إزالة حقيقية للّحاء قبل النقش لغياب توثيق تفصيلي؛ حركة التجهيز لفحص الموضع فقط.',
  'لا أصوات أو مقاطع مرخصة مناسبة، ولا صور أشخاص. صور مراحل النقش والقطرات والدرجات ما زالت مطلوبة.'
 ],
 media:{directory:'assets/images/workshop/frankincense/',reference:'assets/images/workshop/frankincense/resin.webp',landscape:'assets/images/workshop/frankincense/entry.webp',
  scenes:{tree:'tree',prepare:'bark',cut:'cut',wait:'resin-hardening',collect:'collection',sort:'sorting',store:'storage',incense:'burner',result:'resin-hard'},credits:'data/frankincense-image-credits.json'}
};
})();
