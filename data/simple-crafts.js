/* ثلاث خطوات موجّهة؛ المراجع العلمية تبقى في بيانات الحِرفة الأصلية. */
window.OMANI_SIMPLE_CRAFTS={
 halwa:{
  kind:'halwa',title:'اصنع الحلوى العُمانية',completionKey:'omani-halwa-simple-v1',
  stirTurns:1.1,tapTurn:.25,maxTurn:.3,holdTurns:.65,aromasAt:.55,transitionSeconds:1.1,
  aromasText:'أُضيف السمن والنكهات. واصل التحريك قليلًا.',
  safety:'محاكاة تعليمية؛ الطبخ الحقيقي بإشراف شخص بالغ.',
  doneTitle:'حلوى جاهزة للضيافة!',doneText:'قدّمها بعد أن تبرد، مع القهوة.',doneNote:'اختصرنا وقت الطبخ والتبريد في التجربة.',
  sourceIds:['ingredients','ghee','cool'],
  steps:[
   {short:'أضف',title:'أضف المكونات',text:'الماء والسكر، ثم النشا المحضّر.',action:'أضف إلى القدر',note:'المقادير مجهّزة لك.'},
   {short:'حرّك',title:'حرّك الحلوى',text:'حرّك بإصبعك في دوائر، أو اضغط زر التحريك.',action:'حرّك المزيج',note:'نضيف السمن والنكهات أثناء هذه الخطوة.'},
   {short:'قدّم',title:'اسكب وقدّم',text:'اسكب الحلوى في الوعاء، واتركها تبرد.',action:'اسكب الحلوى',busy:'نسكب الحلوى…'}
  ],
  media:{reference:{src:'assets/images/workshop/halwa/reference.webp',author:'Slywire',changes:'اقتصاص وتصغير',license:'CC BY-SA 4.0',url:'https://commons.wikimedia.org/wiki/File:Omani_Halwa_with_saffron.jpg',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}}
 },
 frankincense:{
  kind:'frankincense',title:'اكتشف حكاية اللبان',completionKey:'omani-frankincense-simple-v1',transitionSeconds:2.2,
  safety:'محاكاة تعليمية؛ لا تنقش الأشجار الحقيقية.',
  doneTitle:'جمعت اللبان!',doneText:'جمعت القطرات بعد تصلّبها، وتركت الشجرة لتستريح.',doneNote:'صور حقيقية، وتفاعل توضيحي مختصر.',
  sourceIds:['tool','wait','store'],
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
 }
};
