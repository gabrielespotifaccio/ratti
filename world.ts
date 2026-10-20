export type Point={x:number;y:number};
export type State='sleep'|'wake'|'stretch'|'idle'|'walk'|'run'|'sniff'|'groom'|'scratch'|'eat'|'drink'|'hide'|'window'|'play'|'pet'|'carry'|'yawn';
export const places={home:{x:190,y:765},food:{x:1250,y:780},water:{x:1360,y:780},window:{x:1100,y:735},toy:{x:850,y:760},slipper:{x:520,y:805},paper:{x:980,y:815},box:{x:1480,y:735}};
// Navigation is restricted to the clear floor below the furniture. A book pile
// is a real obstacle; A* routes around its inflated footprint.
export function walkable(p:Point){return p.x>=100&&p.x<=1500&&p.y>=730&&p.y<=835&&!(p.x>655&&p.x<755&&p.y<755);}
export function accessible(p:Point):Point{let x=Math.max(100,Math.min(1500,p.x)),y=Math.max(730,Math.min(835,p.y));if(x>655&&x<755&&y<755)y=775;return{x,y};}
export function pathfind(start:Point,end:Point):Point[]{
 const target=accessible(end), step=20, cols=71, rows=8;
 const clearSegment=(a:Point,b:Point)=>{const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)));for(let i=0;i<=n;i++)if(!walkable({x:a.x+(b.x-a.x)*i/n,y:a.y+(b.y-a.y)*i/n}))return false;return true;};
 const toNode=(p:Point)=>{const candidates:{x:number;y:number;d:number}[]=[];for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const q={x:100+x*step,y:690+y*step};if(walkable(q)&&clearSegment(p,q))candidates.push({x,y,d:Math.hypot(q.x-p.x,q.y-p.y)});}candidates.sort((u,v)=>u.d-v.d);return candidates[0]??{x:0,y:0};};
 const a=toNode(accessible(start)), b=toNode(target), key=(x:number,y:number)=>y*cols+x;
 const open=[key(a.x,a.y)], goal=key(b.x,b.y), costs=new Map<number,number>([[open[0],0]]), prev=new Map<number,number>();
 const point=(k:number)=>({x:100+(k%cols)*step,y:690+Math.floor(k/cols)*step});
 while(open.length){open.sort((u,v)=>(costs.get(u)!+Math.hypot(u%cols-b.x,Math.floor(u/cols)-b.y)*step)-(costs.get(v)!+Math.hypot(v%cols-b.x,Math.floor(v/cols)-b.y)*step));const u=open.shift()!;if(u===goal){const result:Point[]=[target];let k=u;result.unshift(point(k));while(prev.has(k)){k=prev.get(k)!;result.unshift(point(k));}return result;}
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=u%cols+dx,y=Math.floor(u/cols)+dy;if(x<0||x>=cols||y<0||y>=rows)continue;const v=key(x,y);if(!walkable(point(v)))continue;const score=costs.get(u)!+step;if(score<(costs.get(v)??Infinity)){costs.set(v,score);prev.set(v,u);if(!open.includes(v))open.push(v);}}
 }return[];
}
export const events=[
 {id:'crumb',state:'eat',place:'food',thought:'eating'},
 {id:'slipper-nap',state:'sleep',place:'slipper',thought:'sleepy'},
 {id:'paper',state:'sniff',place:'paper',thought:'curious'},
 {id:'big-treasure',state:'carry',place:'toy',thought:'happy'},
 {id:'reflection',state:'sniff',place:'water',thought:'curious'},
 {id:'shadow',state:'run',place:'window',thought:'exploring'},
 {id:'secret-corner',state:'hide',place:'box',thought:'exploring'},
 {id:'rain-watcher',state:'window',place:'window',thought:'rain',weather:'rain'},
 {id:'midnight-picnic',state:'eat',place:'food',thought:'night',night:true},
 {id:'home-delivery',state:'carry',place:'home',thought:'happy'},
 {id:'sunbeam',state:'stretch',place:'window',thought:'window'},
 {id:'caretaker',state:'pet',place:'home',thought:'petted'}
] as const;
export class Rat {
 x=190;y=765;direction=1;state:State='sleep';after:State='idle';time=5; route:Point[]=[];
 hunger=.3;energy=.75;curiosity=.7;comfort=.8;playfulness=.6;social=.5;moving=false;carrying=false;
 onArrive:((state:State)=>void)|null=null;
 go(p:Point,after:State='sniff',run=false){this.route=pathfind(this,p);this.after=after;this.state=run?'run':'walk';this.time=0;}
 act(state:State,duration=4){this.state=state;this.time=duration;this.route=[];this.moving=false;}
 update(dt:number){
 this.hunger=Math.min(1,this.hunger+dt*.0018);this.energy=Math.max(0,Math.min(1,this.energy+dt*(this.state==='sleep'?.025:-.0009)));this.curiosity=Math.min(1,this.curiosity+dt*.001);this.playfulness=Math.min(1,this.playfulness+dt*.0007);this.social=Math.min(1,this.social+dt*.0008);this.comfort=Math.max(0,Math.min(1,this.comfort+dt*(this.state==='hide'||this.state==='sleep'?.015:-.0005)));
 this.moving=this.route.length>0;
 if(this.moving){const p=this.route[0],dx=p.x-this.x,dy=p.y-this.y,d=Math.hypot(dx,dy),speed=(this.state==='run'?155:72)*dt;if(Math.abs(dx)>1)this.direction=dx>0?1:-1;if(d<=speed){this.x=p.x;this.y=p.y;this.route.shift();}else{this.x+=dx/d*speed;this.y+=dy/d*speed;}if(!this.route.length){this.act(this.after,this.after==='sleep'?22:this.after==='eat'?7:5);this.onArrive?.(this.after);}return;}
 this.time-=dt;if(this.time>0)return;
 if(this.state==='sleep'){this.act('wake',2);return;}if(this.state==='wake'){this.act('stretch',3);return;}
 if(this.energy<.25){this.go(places.home,'sleep');return;}if(this.hunger>.65){this.go(places.food,'eat');return;}
 const choices:{w:number;run:()=>void}[]=[{w:2,run:()=>this.act('idle',4+Math.random()*5)},{w:1.5,run:()=>this.act('groom',5)},{w:.7,run:()=>this.act('scratch',3)},{w:.5,run:()=>this.act('yawn',3)},{w:1,run:()=>this.go(places.water,'drink')},{w:this.social*1.5,run:()=>{this.go({x:800,y:830},'idle');this.social=.1;}},{w:this.playfulness*2,run:()=>{this.go(places.toy,'play');this.playfulness=.1;}},{w:this.curiosity*5,run:()=>{this.go(accessible({x:120+Math.random()*1350,y:695+Math.random()*130}),'sniff',Math.random()<.12);this.curiosity=.1;}},{w:.7,run:()=>this.go(places.window,'window')},{w:.3+(1-this.comfort)*2,run:()=>this.go(places.home,'hide')}];
 let pick=Math.random()*choices.reduce((s,c)=>s+c.w,0);for(const c of choices){pick-=c.w;if(pick<=0){c.run();break;}}
 }
}

