/* مصادر مساندة مفتوحة؛ لا ندّعي نقل مداخل موسوعية غير متاحة. */
(() => {
'use strict';
const sadu={kind:'supporting',entryTitle:'دائرة الثقافة والسياحة — أبوظبي: السدو، مهارات النسيج التقليدية',volume:null,page:null,url:'https://abudhabiculture.ae/en/cultural-heritage/intangible/unesco-ich-inscribed-elements/al-sadu',note:'مرجع رسمي يصف التنظيف ثم الغزل بالمغزل ثم الصبغ والنسج بالنول الأرضي في الإمارات. يشرح مهارات الحرفة المشتركة، ولا يثبت تطابق تفاصيلها في كل مناطق عُمان.'};
const clay={kind:'supporting',entryTitle:'Oman Observer — Preserving Bahla’s ancient craftsmanship، مقابلة مع سعيد العدوي (٢٤ أكتوبر ٢٠٢٣)',volume:null,page:null,url:'https://www.omanobserver.om/article/1144700/features/arts/preserving-bahlas-ancient-craftsmanship',note:'تقرير ومقابلة منشورة عن إعداد الطين بالماء وتشكيله بالدولاب في بهلاء؛ ليس مقابلة أجراها المشروع. لا نعتمد ترتيب التجفيف الوارد في صياغة هذا التقرير.'};
const firing={kind:'supporting',entryTitle:'وكالة الأنباء العُمانية عبر Oman Observer — مخيم الخزّافين في بهلاء (٨ أكتوبر ٢٠٢٥)',volume:null,page:null,url:'https://www.omanobserver.om/article/1177815/oman/oman-launches-first-potters-camp-in-bahla',note:'يسرد إعداد الطين ثم التشكيل والتجفيف والحرق. المحاكاة تختصر المدة، ولا تحدد حرارة فرن أو مقادير أو تصنيفًا لمنتج صالح للطعام.'};
window.OMANI_TEXTILE_POTTERY={
 sadu:{facts:[
  {id:'prepare',stage:'التجهيز',text:'يُفرز الصوف وينظّف قبل غزله إلى خيوط.',source:sadu},
  {id:'spin',stage:'الغزل',text:'تُفتل الألياف بالمغزل لتكوين الخيط، ثم يمكن صبغه.',source:sadu},
  {id:'weave',stage:'النسج',text:'تُنسج الخيوط على نول أرضي؛ الغزل يجهّز الخيط والنسج يصنع القماش.',source:sadu}
 ]},
 pottery:{facts:[
  {id:'prepare',stage:'العجن',text:'يُحضّر الطين بالماء ليصبح مناسبًا للتشكيل.',source:clay},
  {id:'shape',stage:'التشكيل',text:'الدولاب إحدى الطرق المستخدمة لتشكيل الأواني الفخارية في بهلاء.',source:clay},
  {id:'fire',stage:'التجفيف والحرق',text:'بعد التشكيل يجفّ الوعاء، ثم يُحرق في الفرن؛ هذه مراحل متتابعة وليست خطوة فورية في الواقع.',source:firing}
 ]}
};
})();
