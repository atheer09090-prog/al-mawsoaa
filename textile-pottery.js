(() => {
'use strict';
for(const [kind,name] of [['sadu','OmaniSadu'],['pottery','OmaniPottery']])window[name]=window.WorkshopSimple.mount(document.getElementById(kind+'Root'),{...window.OMANI_TEXTILE_POTTERY[kind],simple:window.OMANI_SIMPLE_CRAFTS[kind]});
})();
