/* رسومات تعليمية أصلية بالكود؛ النقش والهيئة توضيحيان وليسا إعادة إنتاج لقطعة تاريخية. */
(() => {
'use strict';
const TAU=Math.PI*2;
const mix=(a,b,f)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-f)+parseInt(b.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('');
function ellipse(x,cx,cy,rx,ry,fill){x.fillStyle=fill;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill();}
function wood(x,a,b,w,h){const g=x.createLinearGradient(a,b,a+w,b+h);g.addColorStop(0,'#c29a65');g.addColorStop(.45,'#9d713f');g.addColorStop(1,'#6b4729');x.fillStyle=g;x.beginPath();x.roundRect(a,b,w,h,7);x.fill();x.strokeStyle='#ebc58c33';x.lineWidth=1;for(let i=4;i<w;i+=8){x.beginPath();x.moveTo(a+i,b+7);x.lineTo(a+i+3,b+h-7);x.stroke();}}
function wool(x,cx,cy,scale=1){x.save();x.translate(cx,cy);x.scale(scale,scale);ellipse(x,0,28,93,27,'#806a4433');for(let i=0;i<45;i++){const a=i*2.4,r=Math.sqrt((i*17)%45)/6;x.fillStyle=['#eee6d7','#ded5c4','#f5eee2'][i%3];x.beginPath();x.ellipse(Math.sin(a)*r*80,Math.cos(a)*r*38,24,16,a,0,TAU);x.fill();x.strokeStyle='#bfb29b66';x.lineWidth=.6;x.stroke();}x.restore();}
function sadu(x,s,reduced){
 x.fillStyle='#e8dfcc';x.fillRect(0,0,640,640);for(let i=0;i<640;i+=8){x.strokeStyle=i%16?'#fff2':'#887f6610';x.beginPath();x.moveTo(i,0);x.lineTo(i+15,640);x.stroke();}
 if(s.stage<2){
  const spun=s.stage===1?s.progress:0;wool(x,175,160,1.05-spun*.35);const angle=reduced?0:s.angle;
  // A drop spindle: shaft, whorl, wound yarn and a continuous drawn fibre.
  x.strokeStyle='#e9dec6';x.lineWidth=5;x.beginPath();x.moveTo(215,164);x.bezierCurveTo(270,165,380,185,380,252);x.stroke();
  wood(x,373,248,14,285);const whorl=x.createRadialGradient(365,412,6,380,420,70);whorl.addColorStop(0,'#d5ac76');whorl.addColorStop(1,'#794d2b');ellipse(x,380,425,68,17+Math.abs(Math.sin(angle))*5,whorl);
  const coils=3+Math.round(spun*24);for(let i=27-coils;i<27;i++){const w=39-Math.abs(i-13)*1.3;x.strokeStyle=i%2?'#c5b89f':'#e5dcc8';x.lineWidth=3;x.beginPath();x.ellipse(380,330+i*3,w,6,0,0,TAU);x.stroke();}
  x.strokeStyle='#e9e2d2';x.lineWidth=3;x.beginPath();x.moveTo(380,250);x.lineTo(380,411-coils*3);x.stroke();
  const length=s.stage===0?0:s.progress*180;x.strokeStyle='#a68b61';x.lineWidth=4;x.beginPath();x.moveTo(160,350);x.bezierCurveTo(95,390,220,400,155,450);x.bezierCurveTo(120,490,230,500,160+length,500);if(s.stage===1)x.stroke();
  ellipse(x,380,556,80,12,'#48382320');return;
 }
 // Vertical warp bands, a horizontal weft and a shuttle: a simplified floor loom.
 wood(x,112,75,22,490);wood(x,506,75,22,490);wood(x,108,85,424,26);wood(x,108,526,424,26);
 const left=150,right=490,top=116,bottom=521,progress=s.done?1:s.progress,start=bottom-(bottom-top)*progress;
 const palette=['#812c35','#812c35','#e4d8bc','#2c2d28','#e4d8bc','#812c35','#812c35','#233a32','#e4d8bc','#2c2d28','#e4d8bc','#812c35'];
 for(let i=0;i<86;i++){const px=left+i*4,col=palette[Math.floor(i/3)%palette.length];x.strokeStyle=col;x.lineWidth=2.5;x.beginPath();x.moveTo(px,top);x.lineTo(px,bottom);x.stroke();}
 if(progress>0){
  x.save();x.beginPath();x.rect(left-2,start,right-left+4,bottom-start);x.clip();
  x.fillStyle='#812c35';x.fillRect(left-2,start,345,bottom-start);
  for(let i=0;i<86;i++){const px=left+i*4;x.fillStyle=palette[Math.floor(i/3)%palette.length];x.fillRect(px-1,top,4,bottom-top);}
  for(let y=top;y<bottom;y+=4){x.strokeStyle=(Math.round(y/4)%2)?'#fff2':'#1c211c38';x.lineWidth=1.5;x.beginPath();x.moveTo(left,y);x.lineTo(right,y);x.stroke();}
  // Repeated diamonds on light warp bands; illustrative, with no tribal attribution.
  for(const cx of [190,286,382,478])for(let y=130;y<bottom;y+=38){x.fillStyle='#282b25';x.beginPath();x.moveTo(cx,y);x.lineTo(cx+8,y+13);x.lineTo(cx,y+26);x.lineTo(cx-8,y+13);x.closePath();x.fill();ellipse(x,cx,y+13,2.5,4,'#e9dfc7');}
  x.restore();
 }
 if(s.done){for(let i=0;i<43;i++){x.strokeStyle=palette[Math.floor(i/1.5)%palette.length]||'#cbb88c';x.lineWidth=2;x.beginPath();x.moveTo(left+i*8,552);x.lineTo(left+i*8+Math.sin(i)*3,585);x.stroke();}}
 const shuttleX=s.done?320:175+(Math.sin(s.angle)+1)*135,shuttleY=s.done?600:Math.max(145,start-20);
 x.save();x.translate(shuttleX,shuttleY);x.fillStyle='#ab7a44';x.beginPath();x.moveTo(-65,0);x.quadraticCurveTo(0,-33,65,0);x.quadraticCurveTo(0,33,-65,0);x.fill();x.fillStyle='#dfcab0';x.fillRect(-23,-8,46,16);x.strokeStyle='#7e2d36';x.lineWidth=2;for(let k=-20;k<23;k+=5){x.beginPath();x.moveTo(k,-8);x.lineTo(k,8);x.stroke();}x.restore();
}
function pottery(x,s,reduced){
 const finishing=s.stage===2&&(s.busy||s.done),p=s.done?1:s.progress,fire=finishing&&p>=1/3&&p<2/3;
 x.fillStyle=fire?'#ead2b7':'#e8dfd0';x.fillRect(0,0,640,640);const bg=x.createLinearGradient(0,0,0,640);bg.addColorStop(0,'#fff4');bg.addColorStop(1,'#90765712');x.fillStyle=bg;x.fillRect(0,0,640,640);
 x.fillStyle='#b9a288';x.fillRect(0,525,640,115);for(let i=0;i<640;i+=15){x.strokeStyle='#6d533114';x.beginPath();x.moveTo(i,525);x.lineTo(i+12,640);x.stroke();}
 wood(x,293,526,54,81);ellipse(x,320,526,213,47,'#715b44');const wg=x.createLinearGradient(110,490,530,550);wg.addColorStop(0,'#d3c6b0');wg.addColorStop(.5,'#9c8e78');wg.addColorStop(1,'#76664f');ellipse(x,320,512,213,44,wg);
 for(let i=1;i<6;i++){x.strokeStyle='#564b3c55';x.lineWidth=1;x.beginPath();x.ellipse(320,512,i*32,i*6.6,0,0,TAU);x.stroke();}
 const a=reduced?0:s.angle;for(let i=0;i<6;i++){x.strokeStyle='#ebe2d022';x.beginPath();x.moveTo(320,512);x.lineTo(320+202*Math.cos(a+i*TAU/6),512+42*Math.sin(a+i*TAU/6));x.stroke();}
 if(s.stage===0){const clay=x.createRadialGradient(280,399,5,320,441,145);clay.addColorStop(0,'#c6a386');clay.addColorStop(1,'#8a684f');ellipse(x,320,449,118,66,clay);for(let i=0;i<6;i++){x.strokeStyle='#7c5c4144';x.lineWidth=2;x.beginPath();x.ellipse(318,438+i*7,75-i*5,12,0,Math.PI*.1,Math.PI*.9);x.stroke();}return;}
 const shape=s.stage===1?s.progress:1,height=100+shape*236,top=500-height,neck=105-shape*38,belly=112+shape*33;
 const fired=s.done?1:finishing?Math.max(0,Math.min(1,(p-1/3)*3)):0;
 const shade=x.createLinearGradient(170,0,470,0);shade.addColorStop(0,mix('#805e46','#7c462b',fired));shade.addColorStop(.28,mix('#c1a085','#d6a273',fired));shade.addColorStop(.5,mix('#b79271','#bc8050',fired));shade.addColorStop(1,mix('#76583f','#814b2c',fired));
 x.save();x.beginPath();x.moveTo(320-neck,top);x.bezierCurveTo(320-neck-4,top+height*.22,320-belly,top+height*.3,320-belly,top+height*.56);x.bezierCurveTo(320-belly,top+height*.79,246,500,258,507);x.quadraticCurveTo(320,524,382,507);x.bezierCurveTo(394,500,320+belly,top+height*.79,320+belly,top+height*.56);x.bezierCurveTo(320+belly,top+height*.3,320+neck+4,top+height*.22,320+neck,top);x.closePath();x.fillStyle=shade;x.fill();x.clip();
 // Fixed speckles and turning lines give the clay texture without idle flicker.
 for(let i=0;i<1500;i++){x.fillStyle=i%2?'#fff1':'#42290f16';x.fillRect(170+(i*71)%300,top+(i*43)%350,1.3,1.3);}
 for(let y=top+12;y<509;y+=9){x.strokeStyle='#4f301623';x.lineWidth=1;x.beginPath();x.ellipse(320,y,160,14,0,0,Math.PI);x.stroke();}
 if(!s.done){x.strokeStyle='#fff3';x.lineWidth=5;x.beginPath();x.moveTo(246,top+30);x.quadraticCurveTo(192,top+height*.6,268,486);x.stroke();}x.restore();
 ellipse(x,320,top,neck+3,17,'#b68b63');ellipse(x,320,top+2,neck-8,10,'#4c3829');x.strokeStyle='#dec09b';x.lineWidth=3;x.beginPath();x.ellipse(320,top,neck,16,0,Math.PI,TAU);x.stroke();
 if(fire){const glow=x.createRadialGradient(320,320,100,320,320,290);glow.addColorStop(0,'#d7822c00');glow.addColorStop(1,'#c8892a22');x.fillStyle=glow;x.fillRect(0,0,640,640);}
}
window.WorkshopCraftDraw={draw(canvas,kind,state,reduced){const x=canvas.getContext('2d');x.clearRect(0,0,640,640);if(kind==='sadu')sadu(x,state,reduced);else pottery(x,state,reduced);}};
})();
