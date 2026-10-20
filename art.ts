/** Original canvas illustrations. Every shape and texture is generated locally. */
type C = CanvasRenderingContext2D;
export interface Environment { phase:number; weather:string; lamp:boolean; curtains:boolean; lights:boolean; reduced:boolean; quality:string }
const TAU=Math.PI*2;
const hash=(n:number)=>{const q=Math.sin(n*127.1+311.7)*43758.5453;return q-Math.floor(q)};
function ellipse(c:C,x:number,y:number,rx:number,ry:number,color:string,rotation=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,rotation,0,TAU);c.fill()}
function path(c:C,d:Path2D|string,fill:string,stroke?:string,w=1){const p=typeof d==='string'?new Path2D(d):d;c.fillStyle=fill;c.fill(p);if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke(p)}}
function line(c:C,pts:number[],color:string,w=1){c.beginPath();c.moveTo(pts[0]!,pts[1]!);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i]!,pts[i+1]!);c.strokeStyle=color;c.lineWidth=w;c.stroke()}
function grad(c:C,x:number,y:number,x2:number,y2:number,stops:[number,string][]){const g=c.createLinearGradient(x,y,x2,y2);for(const [at,col]of stops)g.addColorStop(at,col);return g}
function glow(c:C,x:number,y:number,r:number,color:string){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function round(c:C,x:number,y:number,w:number,h:number,r:number,fill:string,stroke?:string){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke()}}
function book(c:C,x:number,y:number,w:number,h:number,color:string,angle=0){c.save();c.translate(x,y);c.rotate(angle);round(c,0,0,w,h,3,color,'#453d36');c.fillStyle='#c7b191';c.fillRect(w-7,5,5,h-10);line(c,[4,9,w-9,9],'#e9d0a275',1.5);line(c,[4,h-9,w-9,h-9],'#e9d0a275',1.5);c.restore()}
function plant(c:C,x:number,y:number,s=1){c.save();c.translate(x,y);c.scale(s,s);path(c,'M-30-65 Q-27-11-16 0 L17 0 Q29-12 32-65Z','#ae795b','#664b3b',2);ellipse(c,0,-65,32,8,'#c8966e');ellipse(c,0,-64,25,5,'#54473a');for(let i=0;i<9;i++){const a=i*.91;const endX=Math.cos(a)*47,endY=-105-hash(i+4)*77;const p=new Path2D();p.moveTo(0,-63);p.quadraticCurveTo(endX*.1,endY+25,endX,endY);c.strokeStyle='#526b48';c.lineWidth=3;c.stroke(p);ellipse(c,endX-7,endY+4,11,26,['#72815a','#667b53','#8b9468'][i%3]!,a*.48);line(c,[endX-7,endY+25,endX-6,endY-14],'#b3b17c66',1)}c.restore()}
function bowl(c:C,x:number,y:number,water=false){ellipse(c,x+2,y+9,45,11,'#271e2438');path(c,`M${x-37} ${y-9} Q${x-34} ${y+15} ${x} ${y+15} Q${x+34} ${y+15} ${x+37} ${y-9}Z`,water?'#789196':'#b78568','#554b41',2);ellipse(c,x,y-9,37,11,water?'#aec4c0':'#d6ab7e');ellipse(c,x,y-10,30,7,water?'#719ea3':'#736341');if(water){line(c,[x-18,y-12,x+12,y-12],'#e1efdf',2)}else{for(let i=0;i<20;i++)ellipse(c,x+(hash(i)-.5)*49,y-11+(hash(i+40)-.5)*9,3.5,2.2,['#c19350','#b78b58','#d0b77d'][i%3]!,hash(i)*TAU)}line(c,[x-29,y+3,x-21,y+9,x-5,y+11],'#e7c2a17a',2)}

let roomTexture:HTMLCanvasElement|undefined;
function texture(c:C){if(!roomTexture){roomTexture=document.createElement('canvas');roomTexture.width=1600;roomTexture.height=900;const a=roomTexture.getContext('2d')!;for(let i=0;i<23000;i++){const x=hash(i*3)*1600,y=hash(i*3+1)*900;a.fillStyle=i%2?'#fff1cb09':'#39251509';a.fillRect(x,y,.5+hash(i+3)*2,.5+hash(i+10)*2)}}c.drawImage(roomTexture,0,0)}

export function drawRoom(c:C,t:number,env:Environment){
 // Blend complete painted lighting passes so sunrise and dusk never snap.
 const keys=[[0,.9],[.15,.9],[.23,.35],[.53,.35],[.62,.63],[.71,.63],[.79,.9],[1,.9]];
 let index=0;while(index<keys.length-2&&env.phase>keys[index+1][0])index++;
 const a=keys[index],b=keys[index+1],mix=Math.max(0,Math.min(1,(env.phase-a[0])/(b[0]-a[0])));
 paintRoom(c,t,{...env,phase:a[1]});
 if(a[1]!==b[1]&&mix>0){c.save();c.globalAlpha=mix;paintRoom(c,t,{...env,phase:b[1]});c.restore();}
}
function paintRoom(c:C,t:number,env:Environment){
 const {weather,lamp,curtains,lights,reduced}=env;
 const night=env.phase>=.72||env.phase<.18;const sunset=env.phase>=.54&&env.phase<.72;
 c.save();c.lineJoin='round';c.lineCap='round';
 // Dusty sage plaster walls, hand-blocked wallpaper and walnut wainscot.
 c.fillStyle=grad(c,0,0,0,720,[[0,night?'#555e5d':'#8c9b87'],[.58,night?'#58605c':'#a4ae91'],[1,'#93947a']]);c.fillRect(0,0,1600,720);
 for(let x=12;x<1600;x+=56){line(c,[x,0,x,638],'#e2dab212',1);for(let y=24;y<630;y+=76){ellipse(c,x+25,y,2.6,6,'#e6dfba22',-.5);ellipse(c,x+30,y+7,2.6,6,'#e6dfba22',.5)}}
 c.fillStyle=grad(c,0,630,0,708,[[0,'#6b6d54'],[1,'#555444']]);c.fillRect(0,630,1600,82);line(c,[0,631,1600,631],'#d3c39a',5);line(c,[0,641,1600,641],'#343c3466',3);
 for(let x=15;x<1600;x+=145){round(c,x,653,124,42,2,'#6c6c5211','#444a3980')}
 c.fillStyle=grad(c,0,700,1600,900,[[0,'#a1805c'],[.45,'#b1936b'],[1,'#927353']]);c.fillRect(0,710,1600,190);
 for(let y=711;y<900;y+=38){line(c,[0,y,1600,y],'#594c3b66',2);for(let x=(Math.round(y)%3)*85;x<1600;x+=370)line(c,[x,y,x+14,y+38],'#62523f66',2)}
 for(let i=0;i<340;i++){const x=hash(i)*1600,y=713+hash(i+500)*187;line(c,[x,y,x+20+hash(i+200)*115,y+hash(i+300)*2],'#5c443b16',1)}
 line(c,[0,709,1600,709],'#3a3b30',6);line(c,[0,716,1600,716],'#d4bd8d',3);
 // Tall window, a world beyond the glass.
 round(c,900,74,400,414,8,'#424d43');round(c,911,84,378,390,4,'#e0c59c');c.save();c.beginPath();c.rect(929,102,342,346);c.clip();
 c.fillStyle=grad(c,0,102,0,448,[[0,night?'#293f52':sunset?'#b9837b':weather==='clear'?'#8badb0':'#9baaaa'],[1,night?'#849092':sunset?'#edc595':'#e1d9b2']]);c.fillRect(929,102,342,346);
 if(night){glow(c,1180,166,50,'#f6edbe35');ellipse(c,1180,166,18,18,'#f8e7bd');for(let i=0;i<35;i++)ellipse(c,936+hash(i+9)*327,110+hash(i+34)*205,hash(i)*1.3+.5,hash(i)*1.3+.5,'#f8ebc280')}
 else {glow(c,1190,197,95,'#fff4bd55');ellipse(c,1190,197,27,27,'#f4e2a8')}
 for(let i=0;i<4;i++){const cloudX=930+((i*115+(reduced?0:t*3))%460)-80;ellipse(c,cloudX,166+i*26,65,11,'#f4ecd452');ellipse(c,cloudX+20,159+i*26,29,17,'#f4ecd436')}
 path(c,'M920 359 Q1000 291 1074 344 Q1140 279 1210 329 Q1260 297 1290 322 L1290 460 L920 460Z',night?'#455c5b':'#899779');
 path(c,'M920 401 Q1030 347 1130 386 Q1210 340 1290 377 L1290 460 L920 460Z',night?'#3c5650':'#6d8563');
 for(let i=0;i<5;i++){const x=944+i*73;line(c,[x,461,x+4,321+hash(i)*59],'#50664e',5);path(c,`M${x-28} 365 Q${x+6} 304 ${x+31} 363 Q${x+7} 405 ${x-28} 365Z`,night?'#3f5a4b':'#73845a')}
 path(c,'M988 445 L988 402 L1022 374 L1055 402 L1055 445Z','#b1a284');path(c,'M981 405 L1022 372 L1064 405Z','#68706a');round(c,1009,408,15,19,1,night?'#edce8a':'#707e77');
 if(weather==='rain'||weather==='snow'){const snow=weather==='snow';for(let i=0;i<(env.quality==='low'?35:85);i++){const x=929+((hash(i)*342+(snow?Math.sin(t+i)*9:t*17))%342),y=102+((hash(i+95)*346+(reduced?0:t*(snow?22:210)))%346);if(snow)ellipse(c,x,y,1.5+hash(i+45)*2,1.5+hash(i+45)*2,'#f8f3dfbb');else line(c,[x,y,x-4,y+19],'#d6e1d657',1.2)}}
 if(weather==='cloudy'||weather==='rain'){c.fillStyle='#68778033';c.fillRect(929,102,342,346)}c.restore();
 c.fillStyle='#ddc59d';c.fillRect(1094,96,12,359);c.fillRect(923,274,357,11);line(c,[1109,103,1109,447],'#ffffff25',3);round(c,888,456,423,23,5,'#d6bb91','#77715a');line(c,[904,462,1298,462],'#f1dbb5',3);
 // Soft velvet curtains, independently breathing in the breeze.
 line(c,[867,66,1334,66],'#504b3d',7);ellipse(c,855,66,12,9,'#9f8c63');ellipse(c,1346,66,12,9,'#9f8c63');
 const drift=reduced?0:Math.sin(t*.55)*4, spread=curtains?25:132;
 for(const side of [-1,1]){c.save();if(side===1){c.translate(2200,0);c.scale(-1,1)}const edge=942+spread;path(c,`M876 72 L${edge} 72 Q${edge-33+drift} 267 ${edge+13+drift} 513 Q${edge-30} 529 860 510 Q879 284 876 72Z`,grad(c,850,0,edge+30,0,[[0,'#a77f69'],[.35,'#c49b7a'],[.75,'#aa8267'],[1,'#d1ae85']]) as unknown as string,'#806853',1.5);for(let i=0;i<5;i++){const x=879+(edge-879)*i/5;c.beginPath();c.moveTo(x,76);c.bezierCurveTo(x-17,249,x-4+drift,381,x+2,510);c.strokeStyle=i%2?'#f1d0a22b':'#584e4025';c.lineWidth=5;c.stroke()}c.restore()}
 // Framed botanical sketch and small print.
 round(c,637,138,150,189,3,'#5a5143');round(c,645,146,134,173,1,'#dbcfad');round(c,656,157,112,151,0,'#e8dfc2');line(c,[712,293,708,178],'#68775b',2);for(let i=0;i<7;i++){const yy=190+i*13;ellipse(c,708+(i%2?-13:13),yy,17,6,'#859372',i%2?.5:-.5)}
 round(c,564,362,95,108,2,'#71604a');round(c,570,368,83,96,0,'#d3c5a4');ellipse(c,612,411,24,26,'#b6b29a');path(c,'M589 435 Q610 395 634 435Z','#879883');ellipse(c,624,393,7,7,'#e7d6ab');
 // Bookcase against the far right wall.
 round(c,1418,221,179,477,4,'#5c5c46','#474c3c');c.fillStyle='#3f4a3d';c.fillRect(1432,235,151,449);
 for(let shelf=0;shelf<3;shelf++){const yy=348+shelf*141;for(let i=0;i<6;i++){const h=69+hash(i+shelf*8)*35;book(c,1437+i*21,yy-h,17,h,['#a0795c','#7e8d78','#bb9e71','#8b7771','#aaa68b'][i%5]!,i===5?-.1:0)}round(c,1428,yy+2,161,12,1,'#827356')}
 plant(c,1504,218,.75);round(c,1450,627,55,50,3,'#c0ab86');line(c,[1455,639,1500,639],'#806e52',2);ellipse(c,1481,650,4,2,'#806e52');
 // Bed frame and towering, rumpled blankets.
 ellipse(c,270,695,313,34,'#3d3b3633');round(c,-45,301,543,284,17,'#867257','#524d40');round(c,-25,318,506,249,11,'#a48b67','#77664e');
 for(let x=14;x<470;x+=78){line(c,[x,330,x,552],'#6e614b66',4);line(c,[x+4,330,x+4,552],'#d8b58440',2)}
 round(c,31,596,30,114,5,'#73644e');round(c,487,581,30,127,5,'#73644e');round(c,-30,555,556,79,15,'#d0bda0','#7f7056');
 path(c,'M-25 451 Q85 407 182 427 Q285 418 354 446 Q469 433 537 481 L563 612 Q473 668 374 635 Q261 671 164 628 Q55 650-30 617Z',grad(c,0,430,0,651,[[0,'#d4bb95'],[.35,'#e1c9a3'],[1,'#b39a77']]) as unknown as string,'#8d7c60',2);
 // Quiet patchwork stitching; each panel has its own woven character.
 c.save();c.beginPath();c.moveTo(-25,451);c.bezierCurveTo(85,407,182,427,354,446);c.quadraticCurveTo(469,433,537,481);c.lineTo(563,612);c.quadraticCurveTo(473,668,374,635);c.quadraticCurveTo(261,671,164,628);c.quadraticCurveTo(55,650,-30,617);c.closePath();c.clip();
 for(let row=0;row<3;row++)for(let col=0;col<6;col++){const x=col*105-30,y=433+row*75;round(c,x,y,103,73,4,['#a0a58a','#d4b18b','#a4ada0','#c4a894','#d7c29e','#929c86'][(col+row*3)%6]!);for(let i=0;i<15;i++){const xx=x+hash(i+col*33)*100,yy=y+hash(i+row*9)*72;if((row+col)%3===0){ellipse(c,xx,yy,2,4,'#f3e1b94d',.4)}else line(c,[xx,yy,xx+4,yy],'#f5e4bd44',1)}line(c,[x+4,y+4,x+98,y+4,x+98,y+68,x+4,y+68,x+4,y+4],'#f2dcbc77',1)}
 c.fillStyle=grad(c,0,430,0,658,[[0,'#fff5d21a'],[.4,'transparent'],[1,'#544b393d']]);c.fillRect(-30,420,610,250);c.restore();
 for(let i=0;i<8;i++){const x=25+i*73;c.beginPath();c.moveTo(x,488);c.bezierCurveTo(x+30,540,x-22,568,x+18,635);c.strokeStyle='#695f4922';c.lineWidth=6;c.stroke()}
 c.save();c.translate(104,435);c.rotate(-.09);round(c,-111,-37,221,69,24,'#e2d9bb','#aa9d7c');line(c,[-91,-21,-88,19,91,22,94,-18],'#c7bda0',1.5);c.restore();
 c.save();c.translate(345,446);c.rotate(.11);round(c,-88,-36,176,67,23,'#b5b9a2','#8d947e');line(c,[-69,-21,-67,20,67,22,70,-18],'#e0dbc099',1.5);c.restore();
 // Bedside table, warm reading lamp, ceramic mug and stacked books.
 ellipse(c,711,704,100,16,'#3d3d3233');round(c,635,525,142,30,5,'#ac8c61','#68583f');round(c,646,550,120,79,3,'#8b7757');round(c,653,558,106,49,3,'#a88f67','#6e624b');ellipse(c,705,583,7,4,'#574d39');
 for(const x of [646,749]){path(c,`M${x} 624 L${x+14} 624 L${x+11} 708 L${x+4} 708Z`,'#76634a')}book(c,648,511,79,12,'#748475');book(c,654,498,78,12,'#b58e6c');
 ellipse(c,717,503,24,6,'#635340');round(c,712,399,9,104,3,'#9c8960');path(c,'M670 388 L683 324 Q717 312 751 324 L765 388 Q717 405 670 388Z',grad(c,670,0,765,0,[[0,lamp?'#d9b975':'#afa082'],[.5,lamp?'#f3d99a':'#c6b799'],[1,lamp?'#c9a65c':'#a6987c']]) as unknown as string,'#8a7758',2);ellipse(c,717,388,47,10,lamp?'#edcf86':'#c1ae87');
 if(lamp){glow(c,717,414,211,'#ffcc6d32');glow(c,718,385,65,'#ffdf8c36')}
 round(c,738,493,20,26,4,'#dad6bc');c.beginPath();c.ellipse(762,505,7,9,0,0,TAU);c.strokeStyle='#dad6bc';c.lineWidth=4;c.stroke();ellipse(c,748,493,10,3,'#7a7154');
 // Braided oval rug: irregular concentric woven rings.
 ellipse(c,883,795,343,93,'#554a3d1f');for(let i=0;i<17;i++){const rx=326-i*15,ry=85-i*3.8;if(rx<=0||ry<=0)break;c.beginPath();c.ellipse(878,788,rx,ry,-.025,0,TAU);c.strokeStyle=['#a58163','#b59877','#8b987e','#c2ae8b','#b7b89b','#8b8e72'][i%6]!;c.lineWidth=6;c.stroke();c.setLineDash([1,6]);c.strokeStyle='#efe0b84d';c.lineWidth=2;c.stroke();c.setLineDash([])}
 // Rat's cardboard refuge, linen sock, scattered safe toys.
 ellipse(c,197,771,99,18,'#453f352f');path(c,'M108 675 L251 669 L285 706 L280 765 L108 768Z','#b59b76','#79694f',2);path(c,'M108 675 L142 653 L277 656 L251 669Z','#c7b08a','#8b785a',2);path(c,'M251 669 L277 656 L303 697 L285 706Z','#a38a65');path(c,'M144 768 L144 725 Q145 692 180 692 Q215 692 216 725 L216 768Z','#4c4d40');path(c,'M151 767 L151 731 Q152 707 178 705 Q205 706 207 730 L207 767Z','#373e35');ellipse(c,181,764,31,6,'#c6ba97');path(c,'M158 756 Q166 742 185 753 Q200 745 207 761 L155 766Z','#a8b3a0');
 line(c,[116,682,137,679],'#ead6ad',2);line(c,[264,682,281,700],'#e6cba1',2);c.save();c.translate(238,725);c.rotate(.06);path(c,'M0 5 C-23-7-7-16 0-6 C7-16 23-7 0 5Z','#92775b');c.restore();
 // Slipper with plush opening.
 c.save();c.translate(445,778);c.rotate(-.12);ellipse(c,0,0,70,24,'#655d4a33');path(c,'M-65-3 Q-58-35-5-26 Q22-23 58-8 Q75 9 55 15 L-43 17 Q-70 14-65-3Z','#9b9b85','#6d7561',2);ellipse(c,-29,-10,29,13,'#525d4b');path(c,'M-59-11 Q-52-32-4-25 L0-12 Q-31-26-59-3Z','#c3bfa4');for(let i=0;i<16;i++)line(c,[-63+i*7,12,-62+i*7,16],'#d6cfad',1);c.restore();
 bowl(c,1250,780);bowl(c,1360,780,true);
 // Natural wooden chew toy and paper tunnel.
 ellipse(c,850,769,39,9,'#5046362a');for(let i=0;i<5;i++){round(c,822+i*12,735+(i%2)*3,11,32,4,['#ad8b62','#ceb28a','#aa8158'][i%3]!);line(c,[827+i*12,741,827+i*12,760],'#6c5b403a',1)}
 c.save();c.translate(1120,742);c.rotate(.08);path(c,'M-42-19 L43-19 L43 20 L-42 20Z','#b29973');ellipse(c,43,0,12,20,'#d1bb93');ellipse(c,43,0,8,15,'#685d44');ellipse(c,-42,0,12,20,'#bba37b');line(c,[-31,-13,33,-13],'#dac9a457',2);c.restore();
 book(c,39,768,98,17,'#786c65',-.07);book(c,49,748,85,19,'#9caa91',.03);
 // A tangible stack anchors the small navigation obstacle near the table.
 ellipse(c,706,746,38,8,'#3e3b302f');book(c,677,731,64,13,'#727e70',-.025);book(c,682,718,55,13,'#b18e69',.04);book(c,680,705,53,13,'#a4ad97',-.04);
 for(let i=0;i<3;i++)line(c,[689,722+i*3,729,724+i*3],'#e2d2ac66',.7);
 // A tiny folded note, with no text to break the visitor's chosen language.
 c.save();c.translate(980,815);c.rotate(-.14);path(c,'M-20-12 L14-14 L23-5 L20 14 L-19 12Z','#e1d4b1','#a99b7c',1);path(c,'M14-14 L14-5 L23-5Z','#bfb292');line(c,[-12,-3,9,-3],'#9d9b7c',.8);line(c,[-12,1,11,1],'#9d9b7c',.8);line(c,[-11,5,3,5],'#9d9b7c',.8);c.restore();
 // An open cardboard box offers one more little story near the bookshelf.
 c.save();c.translate(1480,700);ellipse(c,0,15,43,9,'#353a2c25');path(c,'M-34-25 L27-29 L36 7 L-28 13Z','#b39a71','#78694e',1.5);path(c,'M-27-22 L23-25 L29 3 L-22 8Z','#5e604b');path(c,'M-34-25 L-51-39 L-14-45 L-5-27Z','#cab18a','#8d785b',1.2);path(c,'M27-29 L44-42 L56-9 L36 7Z','#bda27a','#8d785b',1.2);path(c,'M-34-25 L-28 13 L36 7 L28-11 L-10-6Z','#c4aa80','#8d785b',1.2);line(c,[-21,2,24,-3],'#dfc69b',1);c.restore();
 plant(c,1536,789,1.3);
 // A short garland of amber lights, slung between wall and window.
 c.beginPath();c.moveTo(407,67);c.bezierCurveTo(650,150,774,148,906,65);c.strokeStyle='#5e6350';c.lineWidth=2;c.stroke();for(let i=0;i<13;i++){const f=i/12,x=407+f*499,y=67+Math.sin(f*Math.PI)*62;if(lights){glow(c,x,y,24,'#ffd47c44');ellipse(c,x,y,3,5,'#ffe2a1')}else ellipse(c,x,y,3,4,'#b4aa82')}
 // Sunlight falls in long, translucent window-shaped strokes.
 if(!night&&curtains){c.save();c.globalCompositeOperation='screen';path(c,sunset?'M941 485 L1265 485 L824 895 L162 895Z':'M941 485 L1265 485 L1487 895 L711 895Z',sunset?'#eab66e18':'#ead8a118');c.restore()}
 // Soft room vignette and drifting motes unify the illustrated layers.
 if(night){c.fillStyle='#243b542c';c.fillRect(0,0,1600,900);if(lamp)glow(c,717,469,285,'#f2bc6326')}
 if(!reduced&&env.quality!=='low')for(let i=0;i<24;i++){const x=620+hash(i)*710+Math.sin(t*.13+i)*12,y=180+((hash(i+80)*550+t*2)%550);ellipse(c,x,y,hash(i+5)*1.5+.4,hash(i+5)*1.5+.4,'#fff1bf55')}
 const vignette=c.createRadialGradient(800,455,230,800,455,920);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#242a244a');c.fillStyle=vignette;c.fillRect(0,0,1600,900);texture(c);c.restore();
}

export function drawRat(c:C,x:number,y:number,t:number,direction:number,state:string,moving:boolean,reduced:boolean){
 c.save();c.translate(x,y);c.scale(direction,1);c.lineCap='round';c.lineJoin='round';
 const sleep=/sleep|hide/.test(state),eat=/eat|drink|carry/.test(state),pet=/pet|affection/.test(state),groom=/groom|scratch/.test(state),stretch=/stretch|wake|yawn/.test(state),sniff=/sniff|investigat|look|observ|play|window/.test(state);
 const clock=reduced?0:t,walk=moving?Math.sin(clock*(state==='run'?21:13)):0,breath=Math.sin(clock*2.2)*.7;
 ellipse(c,-5,2,57,8,'#343a3442');
 // A long, tapering tail with small scaly cross-lines.
 const tipWave=Math.sin(clock*1.9)*8;c.beginPath();c.moveTo(-40,-19);c.bezierCurveTo(-75,-12,-84,16,-124,6+tipWave);c.bezierCurveTo(-138,1+tipWave,-144,-7,-146,-12);c.strokeStyle='#876f65';c.lineWidth=7;c.stroke();c.beginPath();c.moveTo(-40,-19);c.bezierCurveTo(-75,-12,-84,16,-124,6+tipWave);c.bezierCurveTo(-138,1+tipWave,-144,-7,-146,-12);c.strokeStyle='#c89c8d';c.lineWidth=4.8;c.stroke();
 for(let i=0;i<13;i++){const f=i/13,xx=-48-f*73,yy=-12+Math.sin(f*Math.PI)*19;line(c,[xx,yy-2,xx-1,yy+2],'#775f574d',.65)}
 if(sleep){
  c.save();c.translate(0,breath*.3);c.scale(1,1+breath*.018);ellipse(c,-8,-22,47,28,grad(c,0,-48,0,4,[[0,'#a8987f'],[.6,'#b7aa91'],[1,'#8d8676']]) as unknown as string,-.1);ellipse(c,25,-17,25,20,'#a89e89');ellipse(c,40,-10,18,10,'#c3b6a0');ellipse(c,18,-34,10,12,'#9a867c',-.2);ellipse(c,18,-34,6.5,8,'#c69e91');line(c,[36,-20,42,-18,46,-20],'#494a41',1.6);ellipse(c,54,-10,3,2,'#c89a91');for(let i=0;i<3;i++)line(c,[48,-8,65,-13+i*6],'#e7ddbe99',.7);c.restore();ellipse(c,22,0,12,3,'#c7a195');c.restore();return;
 }
 c.translate(0,-Math.abs(walk)*1.3);
 // Far paws are shaded and offset in the gait.
 const step=walk*9;line(c,[-25,-16,-30-step,-5,-20-step,1],'#918b7a',6);ellipse(c,-17-step,1,12,3,'#bb9b8c');line(c,[29,-24,24+step,-6,34+step,0],'#8c8776',5);ellipse(c,37+step,0,10,2.5,'#c5a395');
 const body=grad(c,0,-60,0,2,[[0,'#847f70'],[.3,'#ada591'],[.75,'#c5bca5'],[1,'#9b9785']]);
 c.save();if(stretch){c.scale(1.14,.87);c.translate(0,3)}else c.translate(0,breath);
 ellipse(c,-10,-29,45,29,body as unknown as string,-.1);ellipse(c,-29,-29,23,28,'#a29b88',-.2);
 // Cream belly markings and a hood of tawny grey.
 path(c,'M-32-9 Q-5-2 23-17 L33-33 Q20-18-2-18 Q-18-17-32-9Z','#d8cfb4');
 for(let i=0;i<100;i++){const xx=-47+hash(i*2)*72,yy=-52+hash(i*2+1)*40;if(((xx+10)/43)**2+((yy+29)/28)**2<.9){line(c,[xx,yy,xx-3-hash(i+80)*3,yy+1.5],i%3?'#e1d4b434':'#635f5334',.65)}}
 c.restore();
 // Near haunch and jointed forelegs keep feet planted.
 ellipse(c,-25,-20,19,20,'#b1a892',-.2);line(c,[-22,-15,-17+step,-4,-27+step,0],'#b8ac98',7);ellipse(c,-23+step,1,13,3.3,'#d0a99a');for(let i=0;i<3;i++)line(c,[-15+step+i*3,-1,-14+step+i*3,2],'#8f7568',.65);
 if(!groom&&!eat){line(c,[28,-28,31-step,-9,38-step,-1],'#c5b9a0',6);ellipse(c,41-step,0,11,2.8,'#d6afa0');for(let i=0;i<3;i++)line(c,[45-step+i*2,-1,46-step+i*2,1],'#8f7568',.6)}
 // Low long muzzle, rounded ears, almond eye: deliberately a rat, not a mouse.
 c.save();c.translate(27,-35+(sniff?Math.sin(clock*5)*1.1:0)+(eat?Math.sin(clock*10):0));if(sniff)c.rotate(-.12);if(pet)c.rotate(.08);
 ellipse(c,7,-6,24,20,grad(c,0,-30,25,15,[[0,'#8d8878'],[.7,'#b8ad95'],[1,'#d4c5a9']]) as unknown as string,.2);
 path(c,'M12-19 Q25-16 37-4 Q46 0 45 5 Q34 14 13 9 L3-1Z','#bdb09a','#9d927e',.7);
 const earTwitch=reduced?0:Math.pow(Math.max(0,Math.sin(clock*1.4)),18)*.24*Math.sin(clock*26);c.save();c.translate(-2,-14);c.rotate(earTwitch);ellipse(c,0,-9,11,14,'#877f71',-.3);ellipse(c,1,-10,8,11,'#b89b8d',-.3);ellipse(c,1,-10,5.5,8,'#d0aa9c',-.3);line(c,[-3,-16,-2,-9],'#e2c4ae7a',1.1);c.restore();
 if(!pet){ellipse(c,20,-10,4.2,5,'#262e2a',.18);ellipse(c,21,-12,1.5,1.6,'#f4eee0');ellipse(c,18.6,-8,1,1,'#84958a')}else {c.beginPath();c.moveTo(15,-9);c.quadraticCurveTo(20,-4,25,-9);c.strokeStyle='#444a3d';c.lineWidth=1.6;c.stroke()}
 ellipse(c,45,2,4,3,'#ce9e94',-.15);ellipse(c,46,1,1.3,.9,'#efc3b4');line(c,[43,6,37,9,31,9],'#736c5b',.9);
 for(let i=0;i<4;i++){const twitch=Math.sin(clock*3+i)*1.7;line(c,[35,5,57+i*3,-10+i*8+twitch],'#efe4caad',.65);line(c,[34,6,55+i*3,-6+i*7+twitch],'#6e716665',.45)}
 for(let i=0;i<13;i++)line(c,[3+hash(i)*23,-17+hash(i+30)*20,hash(i)*23,-16+hash(i+30)*20],'#e5d8b63d',.6);
 c.restore();
 if(groom||eat){const pawY=-23+Math.sin(clock*(eat?10:7))*3;line(c,[25,-26,34,pawY-2,45,pawY],'#c8bba3',5);ellipse(c,45,pawY,6,4,'#d3aa9a');if(eat&&state!=='drink'){ellipse(c,48,pawY-3,5,6,'#bb925a',.2);ellipse(c,48,pawY-5,2,2,'#e0bd81')}else if(!eat){line(c,[31,-27,40,-40+Math.sin(clock*7)*4],'#cbb99f',5);ellipse(c,41,-40+Math.sin(clock*7)*4,5,4,'#d6ac9b')}}
 c.restore();
}



