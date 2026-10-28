/* ثلاث خطوات موجّهة؛ المراجع العلمية تبقى في بيانات الحِرفة الأصلية. */
window.OMANI_SIMPLE_CRAFTS={
 halwa:{
  kind:'halwa',title:'اصنع الحلوى العُمانية',completionKey:'omani-halwa-simple-v1',
  stirTurns:1.1,tapTurn:.25,maxTurn:.3,holdTurns:.65,aromasAt:.55,transitionSeconds:1.1,
  aromasText:'أُضيف السمن والنكهات. واصل التحريك قليلًا.',
  safety:'محاكاة تعليمية؛ الطبخ الحقيقي بإشراف شخص بالغ.',
  doneTitle:'حلوى جاهزة للضيافة!',doneText:'قدّمها بعد أن تبرد، مع القهوة.',doneNote:'اختصرنا وقت الطبخ والتبريد في التجربة.',
  sourceIds:['ingredients','ghee','enc-tools','enc-hospitality'],completionIds:['enc-tools','enc-hospitality'],
  steps:[
   {short:'أضف',title:'أضف المكونات',text:'الماء والسكر، ثم النشا المحضّر.',action:'أضف إلى القدر',note:'المقادير مجهّزة لك في المرجل النحاسي.'},
   {short:'حرّك',title:'حرّك الحلوى',text:'حرّك بالبسطان في دوائر، أو اضغط الزر.',action:'حرّك المزيج',note:'نضيف السمن والنكهات أثناء هذه الخطوة.'},
   {short:'قدّم',title:'اسكب وقدّم',text:'اسكب الحلوى في الوعاء، واتركها تبرد.',action:'اسكب الحلوى',busy:'نسكب الحلوى…'}
  ],
  media:{reference:{src:'assets/images/workshop/halwa/served.webp',width:1024,height:768,author:'Meshal humaid Ali Almoqbali',changes:'تصغير وتحويل إلى WebP دون قص',license:'CC BY-SA 4.0',url:'https://commons.wikimedia.org/wiki/File:الحلوى_السوداء_الأكثر_مبيعا.jpg',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}}
 },
 frankincense:{
  kind:'frankincense',title:'اكتشف حكاية اللبان',completionKey:'omani-frankincense-simple-v1',transitionSeconds:2.2,
  safety:'محاكاة تعليمية؛ لا تنقش الأشجار الحقيقية.',
  doneTitle:'جمعت اللبان!',doneText:'جمعت القطرات بعد تصلّبها، وتركت الشجرة لتستريح.',doneNote:'صور حقيقية، وتفاعل توضيحي مختصر.',
  sourceIds:['tool','wait','enc-harvest'],completionIds:['enc-harvest'],
  steps:[
   {short:'انقش',title:'انقش برفق',text:'المس الموضع المحدّد على الجذع، أو اضغط الزر.',action:'انقش برفق',note:'هذه شجرة لبان حقيقية في ظفار.'},
   {short:'انتظر',title:'دع القطرات تتصلّب',text:'نترك سائل اللبان حتى يجفّ.',action:'مرّر الوقت',busy:'تتصلّب القطرات…',note:'نحو أسبوعين في الواقع؛ هنا نسرّع الوقت.'},
   {short:'اجمع',title:'اجمع اللبان',text:'المس القطرات المتصلّبة، أو اجمعها بالزر.',action:'اجمع اللبان',note:'نكتفي بالجمع، ونترك الشجرة لتستريح.'}
  ],
  media:{
   tree:{src:'assets/images/workshop/frankincense/tree-real.webp',width:1024,height:766,alt:'شجرة لبان حقيقية كاملة في وادي دوكة بمحافظة ظفار',author:'Mauro Raffaelli',license:'CC BY-SA 3.0',url:'https://commons.wikimedia.org/wiki/File:Boswellia_sacra_in_Wadi_Dowkah_(Dhofar).JPG',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/'},
   bark:{src:'assets/images/workshop/frankincense/bark-real.webp',width:885,height:900,alt:'صورة حقيقية للحاء شجرة اللبان في ظفار وآثار نقش وقطرات راتنج',author:'Akkbula',license:'CC BY-SA 4.0',url:'https://commons.wikimedia.org/wiki/File:Boswellia_sacra_bark.jpg',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'},
   resin:{src:'assets/images/workshop/frankincense/resin.webp',width:800,height:555,alt:'حبات لبان حقيقية جُمعت في ظفار',author:'Gaius Cornelius (منسوب في Commons)',license:'Public domain',url:'https://commons.wikimedia.org/wiki/File:Frankincense.JPG',licenseUrl:'https://commons.wikimedia.org/wiki/File:Frankincense.JPG#Licensing'}
  }
 },
 sadu:{
  kind:'sadu',title:'غزل السدو ونسجه',titleId:'saduTitle',other:'pottery',otherLabel:'صناعة الفخار',completionKey:'omani-sadu-simple-v1',tapWork:.25,holdWork:.7,
  interactionLabel:'اغزل بحركة دائرية، ثم مرّر الخيط أفقيًا للنسج. يمكنك استخدام المسافة أو الزر أيضًا.',
  safety:'محاكاة تعليمية مبسّطة لحرفة السدو المشتركة في الجزيرة العربية.',
  doneTitle:'اكتملت قطعة السدو!',doneText:'من الصوف إلى الخيط، ثم إلى نسيج تتداخل خيوطه.',doneNote:'النقش توضيحي مستوحى من السدو؛ لا يُنسب إلى ولاية أو قبيلة.',
  sourceIds:['prepare','spin','enc-loom','enc-weft'],completionIds:['enc-loom','enc-weft'],
  steps:[
   {short:'جهّز',title:'جهّز الصوف',text:'نبدأ بصوف نظيف وممشّط، جاهز للغزل.',action:'جهّز الصوف',note:'فرز الصوف وتنظيفه يسبقان الغزل.'},
   {short:'اغزل',title:'اغزل الخيط',text:'حرّك في دوائر، أو اضغط زر الغزل.',action:'اغزل الخيط',note:'يلتفّ الصوف بالمغزل ليصبح خيطًا.'},
   {short:'انسج',title:'انسج السدو',text:'اسحب أفقيًا بين خيوط النول، أو اضغط زر النسج.',action:'مرّر الخيط',note:'نمرّر خيط اللحمة بين خيوط السدى.'}
  ],
  media:{reference:{src:'assets/images/workshop/sadu/reference.webp',width:1024,height:518,alt:'مثال لنقوش السدو في مفروشات مجلس في الإمارات',author:'Ashley Columbus',license:'CC0 1.0',url:'https://commons.wikimedia.org/wiki/File:Majlis_in_Sadu_style.jpg',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',changes:'تصغير دون قص',caption:'صورة مرجعية لمفروشات بنقوش السدو في الإمارات؛ ليست منتج المحاكاة أو توثيقًا لموقع عُماني.'}}
 },
 pottery:{
  kind:'pottery',title:'اصنع قطعتك الفخارية',titleId:'potteryTitle',other:'sadu',otherLabel:'غزل السدو',completionKey:'omani-pottery-simple-v1',tapWork:.25,holdWork:.7,transitionSeconds:3,
  interactionLabel:'اسحب للأعلى لتشكيل الطين، أو استخدم المسافة أو زر التشكيل.',
  safety:'محاكاة تعليمية؛ الحرق الحقيقي في فرن مختص وبإشراف حرفي.',
  doneTitle:'قطعتك الفخارية جاهزة!',doneText:'شكّلت الطين، ثم جفّفته وحرقته وتركته يبرد.',doneNote:'اختصرنا أوقات التجفيف والحرق والتبريد للعرض.',
  sourceIds:['enc-clay','shape','enc-drying','enc-vessels'],completionIds:['enc-clay','enc-vessels'],
  steps:[
   {short:'اعجن',title:'اعجن الطين',text:'نعجن المدر بالماء ليصبح طينًا لينًا.',action:'اعجن الطين',note:'الطين والماء مجهّزان لك.'},
   {short:'شكّل',title:'شكّل الوعاء',text:'اسحب للأعلى برفق، أو اضغط زر التشكيل.',action:'شكّل الوعاء',note:'يرتفع الطين فوق الدولاب ليأخذ شكل الوعاء.'},
   {short:'أكمل',title:'جفّف، ثم احرق',text:'يجفّ الوعاء في الظل أولًا، ثم يُحرق ويُترك ليبرد.',action:'جفّف واحرق',busy:'نُكمل القطعة…',note:'نسرّع الوقت هنا؛ هذه المراحل أطول في الواقع.'}
  ],
  media:{reference:{src:'assets/images/workshop/pottery/reference.webp',width:1024,height:683,alt:'صورة حقيقية ليدَي حرفي يشكّل وعاءً فخاريًا في سلطنة عُمان',author:'Muzn alabri',license:'CC BY 4.0',url:'https://commons.wikimedia.org/wiki/File:Pottery_in_the_Sultanate_of_Oman.jpg',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:'تصغير دون قص',caption:'حرفي يشكّل الفخار في سلطنة عُمان؛ صورة مرجعية مستقلة عن المشهد التفاعلي.'}}
 },
 sandalwood:{
  kind:'sandalwood',title:'حضّر الصندل',titleId:'sandalwoodTitle',other:'frankincense',otherLabel:'استخراج اللبان',completionKey:'omani-sandalwood-simple-v1',tapWork:.25,holdWork:.7,
  interactionLabel:'اسحب الخشب ذهابًا وإيابًا على الحجر، أو استخدم المسافة أو زر الدعك.',
  safety:'محاكاة تراثية لتحضير الصندل العطري.',
  doneTitle:'خلاصة الصندل جاهزة!',doneText:'دعكت الخشب بماء الورد، ثم جمعت خلاصته.',doneNote:'اختصرنا وقت التحضير في التجربة.',
  sourceIds:['enc-rubbing','enc-keeping','enc-custom'],completionIds:['enc-keeping','enc-custom'],
  steps:[
   {short:'أضف',title:'أضف ماء الورد',text:'بلّل الحجر المستوي بقليل من ماء الورد.',action:'أضف ماء الورد',note:'الخشب والحجر مجهّزان لك.'},
   {short:'ادعك',title:'ادعك خشب الصندل',text:'اسحب ذهابًا وإيابًا، أو اضغط زر الدعك.',action:'ادعك الخشب',note:'تتجمّع الخلاصة على الحجر.'},
   {short:'اجمع',title:'اجمع الخلاصة',text:'اجمع الصندل المحضّر في الوعاء.',action:'اجمع الصندل'}
  ],
  media:{reference:{src:'assets/images/workshop/sandalwood/entry.svg',width:640,height:480,alt:'رسم توضيحي لخشب الصندل والحجر وماء الورد',author:'المشروع',license:'رسم أصلي',url:'#workshop/sandalwood',licenseUrl:'#workshop/sandalwood',changes:'رسم متجهي بالكود',caption:'رسم توضيحي لأدوات تحضير الصندل؛ ليس صورة لقطعة تاريخية.'}}
 }
};
