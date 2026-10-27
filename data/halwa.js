/* كل الحقائق هنا قابلة للتحديث. لا تمثل إعدادات اللعبة وصفة أو قياسات تصنيع. */
(() => {
'use strict';
const supporting=(entryTitle,url,note)=>({kind:'supporting',entryTitle,volume:null,page:null,url,note});
const ministry=supporting('وزارة الإعلام — صناعة الحلوى العُمانية','https://www.omaninfo.om/governorates/mainsections/111,8','مصدر رسمي مساند؛ ليس مدخلًا من الموسوعة. لا يحدد مقادير تفصيلية.');
const process=supporting('تصريح نورية الخروصية عن إعداد الحلوى — جريدة الوطن، ١٠ يونيو ٢٠١٨','https://alwatan.om/details/265963','تصريح مباشر لمديرة دائرة المواصفات آنذاك؛ يُستخدم لوصف العملية، وليس لإثبات سريان اشتراطات تجارية اليوم.');
const starch=supporting('Namiko Hirasawa Chen — دليل معلق النشا','https://www.justonecookbook.com/how-to-thicken-sauce-soup-cornstarch-slurry/','شرح تطبيقي عام للنشا؛ ليس وصفة للحلوى العُمانية، ولا يثبت كميات نشا البر.');
const sugar=supporting('Exploratorium — Science of Cooking: Candy-making Stages','https://annex.exploratorium.edu/cooking/bread/sugar-stages.html','مرجع علمي عام للسكر. لم تُنقل درجاته إلى الحلوى؛ يختلف خليط الحلوى عن شراب السكر النقي.');
const serving=supporting('وزارة الإعلام — HALWA','https://www.omaninfo.om/mainsections/18','مصدر رسمي مساند يصف ارتباط الحلوى بالضيافة والقهوة.');
window.OMANI_HALWA={
 version:'20261027-workshop-r1',
 title:'ورشة الحِرف: الحلوى العُمانية',
 safety:'محاكاة تعليمية. السكر المغلي شديد الحرارة، فلا تجرّب ذلك دون إشراف شخص بالغ.',
 limits:'تجربة تعليمية بمراجع مساندة، قابلة للتحديث من الموسوعة. الحرارة مؤشر افتراضي، والمقادير بلا أوزان؛ أزمنة المراحل وقواعد التقييم إعدادات للعبة وليست وصفة تصنيع.',
 facts:[
  {id:'culture',stage:'المقدمة',text:'ترتبط الحلوى العُمانية بالكرم والضيافة، وتشتهر داخل عُمان وخارجها.',source:ministry},
  {id:'ingredients',stage:'التجهيز',text:'من مكوناتها الماء والسكر والنشا والسمن وماء الورد والزعفران والهيل والمكسرات.',source:ministry},
  {id:'vessel',stage:'الأدوات',text:'تُطهى الحلوى في قدر خاص يُسمّى المرجل.',source:ministry},
  {id:'duration',stage:'الزمن',text:'تذكر وزارة الإعلام أن طهي الحلوى يستغرق ساعتين على الأقل؛ لا تحدد هذه المعلومة توقيت كل مرحلة.',source:ministry},
  {id:'slurry',stage:'تحضير النشا',text:'يذكر وصف الإعداد نقع نشا البر في الماء قبل إضافته إلى الخليط الساخن.',source:process},
  {id:'lumps',stage:'تحضير النشا',text:'خلط النشا بسائل بارد أو بدرجة الغرفة حتى يصبح ناعمًا يساعد على تجنّب التكتلات.',source:starch},
  {id:'syrup',stage:'الماء والسكر',text:'يبدأ وصف الإعداد بإضافة المادة السكرية إلى الماء المغلي مع التقليب.',source:process},
  {id:'gel',stage:'الطبخ والتحريك',text:'يُضاف نشا البر المنقوع، ويستمر التقليب حتى يصبح القوام هلاميًا.',source:process},
  {id:'ghee',stage:'الإضافات',text:'بعد الوصول إلى القوام الهلامي يُضاف السمن، ثم ماء الورد والزعفران والهيل والمكسرات بحسب النوع.',source:process},
  {id:'finish',stage:'اختبار القوام',text:'يستمر التقليب مع التسخين حتى يصبح القوام هلاميًا غليظًا، مع مراعاة ألّا يتصلب.',source:process},
  {id:'burn',stage:'الحرارة',text:'التسخين المفرط للسكر قد يسبب احتراقه وظهور مذاق مر؛ هذه قاعدة عامة للسكر.',source:sugar},
  {id:'cool',stage:'التعبئة والتبريد',text:'يصف المصدر تعبئة الحلوى في أوعية نظيفة وجافة مناسبة، وعدم تغطيتها وهي ساخنة حتى لا يتكثف البخار.',source:process},
  {id:'serve',stage:'الضيافة',text:'تصف وزارة الإعلام تقديم الحلوى في البيوت العُمانية قبل شرب القهوة العربية.',source:serving}
 ],
 ingredients:[
  {id:'water',name:'الماء',tone:'water',fact:'ingredients'},
  {id:'sugar',name:'السكر',tone:'sugar',fact:'ingredients'},
  {id:'starch',name:'نشا البر',tone:'starch',fact:'slurry'},
  {id:'ghee',name:'السمن',tone:'ghee',fact:'ghee'},
  {id:'aromas',name:'الورد والزعفران والهيل',tone:'aromas',fact:'ghee'},
  {id:'nuts',name:'اللوز والجوز',tone:'nuts',fact:'ghee'},
  {id:'salt',name:'الملح',tone:'salt',distractor:true,fact:'ingredients'},
  {id:'colour',name:'ملوّن صناعي',tone:'colour',distractor:true,fact:'ingredients'}
 ],
 stages:[
  {id:'prepare',title:'جهّز رفّك',short:'التجهيز',fact:'ingredients',hint:'اختر مكونات التجربة من الرف. اضغط المكوّن أو اسحبه إلى مساحة العمل.',next:'جهّز خليط النشا'},
  {id:'slurry',title:'حضّر معلق النشا',short:'النشا',fact:'slurry',hint:'أضف الماء والنشا إلى الوعاء، ثم حرّك بإصبعك في دوائر حتى يختفي التكتّل.',next:'انتقل إلى القدر'},
  {id:'syrup',title:'الماء والسكر',short:'البداية',fact:'syrup',hint:'أضف الماء، وارفع النار إلى المستوى المتوسط. عند ظهور الغليان أضف السكر وحرّك.',next:'أضف خليط النشا'},
  {id:'cook',title:'حرّك واضبط النار',short:'التحريك',fact:'gel',hint:'أضف معلق النشا، ثم حافظ على حركة دائرية منتظمة. راقب القوام والحرارة.',next:'السمن والنكهات'},
  {id:'enrich',title:'السمن ثم النكهات',short:'الإضافات',fact:'ghee',hint:'أضف السمن إلى القوام الهلامي، وحرّك ليمتزج، ثم أضف النكهات والمكسرات.',next:'اختبر القوام'},
  {id:'judge',title:'متى ترفع القدر؟',short:'القوام',fact:'finish',hint:'راقب القوام. عندما يصير هلاميًا غليظًا، أطفئ النار واضغط «ارفع القدر».',next:'ارفع القدر'},
  {id:'pour',title:'اسكب، سوِّ، ودعها تبرد',short:'التقديم',fact:'cool',hint:'اضغط زر السكب مطولًا أو اسحب داخل الطبق، ثم مرّر المجداف لتسوية السطح. اتركها تبرد مكشوفة.',next:'قدّم الحلوى'},
  {id:'serve',title:'ثمرة تجربتك',short:'النتيجة',fact:'serve',hint:'تأمّل النتيجة وخطواتك، ثم جرّب مرة أخرى.',next:'أعد المحاولة'}
 ],
 // وحدات افتراضية ومعاملات تفاعل وتقييم؛ ليست درجات مئوية ولا نسب وصفة.
 tuning:{
  step:1/60,maxFrame:.1,uiInterval:.18,heatTargets:[0,32,66,96],heatResponse:.18,coldDrop:8,
  boil:48,hot:78,minimumHeat:25,stirMax:2,stirMin:.22,stirDecay:.8,regularityDecay:.045,stirGain:5,stirInputCap:.2,regularityGain:.5,regularitySmoothing:.15,keyboardTurns:.65,
  inactiveCooking:.25,hotMovingStick:.2,stickWarning:.35,burnWarning:.25,burnStart:.25,gelOvershoot:.05,enrichCapOffset:.06,colourProgress:.85,colourBurn:.65,scoreBurn:.25,scoreLumps:.12,
  slurryRate:.12,sugarRate:.13,consistencyRate:.025,gheeRate:.11,coolRate:.13,coolingResponse:.2,feedbackDuration:7,
  gel:.38,done:.78,overdone:.98,thickResistance:.60,
  stickAfter:4,burnAfter:9,stickRate:.045,burnRate:.038,rescueRate:.065,
  gheePortion:.25,pourRate:.34,levelRate:.26,bestKey:'omani-halwa-best-v1',
  clockRatio:60,referenceMinimumMinutes:120,speeds:[1,2],
  particleCount:16,maxLog:180,readyThreshold:.95,maxIdlePenalty:20,
  penalty:{distractor:4,order:6,earlyAroma:6,unmixedStarch:12,scorched:35,sticking:12,under:18,over:16},
  colours:{empty:['#23342f','#182b27'],pale:['#e4c58a','#b69862'],gold:['#cc842f','#9d5623'],amber:['#a75520','#6d2e13'],burnt:['#30251e','#171916']}
 },
 media:{
  reference:'assets/images/workshop/halwa/reference.webp',
  directory:'assets/images/workshop/halwa/',
  // يحاول تحميل الملفات عند وجودها في manifest فقط؛ لا طلبات 404 لصور لم تصل بعد.
  available:[],
  scenes:{prepare:'prep',slurry:'slurry',syrup:'pot-pale',cook:'pot-golden',enrich:'pot-amber',judge:'pot-thick',pour:'pour',serve:'serve'},
  credit:{author:'Slywire',title:'Omani Halwa with saffron',url:'https://commons.wikimedia.org/wiki/File:Omani_Halwa_with_saffron.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:'اقتصاص وتصغير وتحويل إلى WebP؛ المشتقات بالرخصة نفسها.'}
 },
 needsConfirmation:[
  'صفحات مدخل الحلوى في الموسوعة العُمانية، واسم المدخل ورقم المجلد والصفحة.',
  'أوزان المقادير ونوع النشا ونسب الماء والسكر والسمن لدى صانع حلوى.',
  'درجات الحرارة والأوقات الفعلية لكل مرحلة، ومعايرة التحريك واللزوجة.',
  'علامات النضج الإضافية مثل انفصال السمن أو اختبار المجداف، ووقت النكهات التفصيلي.',
  'إمكان إنقاذ التكتلات والالتصاق عمليًا، قبل تقديم أي طريقة إنقاذ كوصفة.'
 ],
 omitted:[
  'لم تُعرض أوزان أو درجات مئوية أو مدة محددة لكل مرحلة لغياب توثيقها.',
  'لم تُنسب أي معلومة إلى الموسوعة أو مقابلة ميدانية لم تُفتح أو تُجرَ.',
  'لم يُفترض فقدان النكهة في ثانية معينة أو وجوب إضافة السمن على دفعات كقاعدة تصنيع.',
  'لا أصوات أو مقاطع خارجية؛ لم تتوفر تسجيلات مناسبة برخصة موثقة.',
  'الصور المتتابعة للقدر مؤقتة؛ الصورة الفوتوغرافية المعروضة مرجع للحلوى وليست نتيجة محسوبة للطالب.'
 ]
};
})();
