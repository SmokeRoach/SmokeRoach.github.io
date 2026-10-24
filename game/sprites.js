/* £99 Challenge — pixel sprite factory (all art drawn in code, no external assets) */
(function(){
'use strict';
const K='#150a22';
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x];}
function px(x,c,X,Y,w,h){x.fillStyle=c;x.fillRect(Math.round(X),Math.round(Y),w||1,h||1);}
function disk(x,c,cx,cy,r){cx=Math.round(cx);cy=Math.round(cy);if(r<0.6){px(x,c,cx,cy);return;}const R=Math.ceil(r);x.fillStyle=c;for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++)if(dx*dx+dy*dy<=r*r+0.35)x.fillRect(cx+dx,cy+dy,1,1);}
function seg(x,c,x0,y0,x1,y1,r){const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*1.5));for(let i=0;i<=n;i++){const t=i/n;disk(x,c,x0+(x1-x0)*t,y0+(y1-y0)*t,r);}}
function grid(x,rows,pal,X,Y,flip){for(let j=0;j<rows.length;j++){const r=rows[j];for(let i=0;i<r.length;i++){const ch=r[i];if(ch==='.'||ch===' ')continue;const c=ch==='K'?K:pal[ch];if(!c)continue;px(x,c,X+(flip?r.length-1-i:i),Y+j);}}}
// shape list: each drawn outline-then-fill in order, so later shapes get a separating outline
function prims(x,list){for(const p of list){if(!p)continue;if(p.o!==false)shape(x,p,K,1);shape(x,p,p.c,0);}}
function shape(x,p,c,g){switch(p.t){
 case 'r':px(x,c,p.x-g,p.y-g,p.w+2*g,p.h+2*g);break;
 case 'l':seg(x,c,p.x0,p.y0,p.x1,p.y1,p.r+g);break;
 case 'd':disk(x,c,p.x,p.y,p.r+g);break;
 case 'g':if(!g)grid(x,p.rows,p.pal,p.x,p.y);break;}}
const D=Math.PI/180;
function chain(hx,hy,a1,l1,a2,l2){const kx=hx+Math.sin(a1*D)*l1,ky=hy+Math.cos(a1*D)*l1;return [kx,ky,kx+Math.sin(a2*D)*l2,ky+Math.cos(a2*D)*l2];}

// ---------- tiny 3x5 pixel font for signs ----------
const F3={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110','£':'011010111010111','!':'010010010000010','-':'000000111000000','+':'000010111010000','.':'000000000000010',':':'000010000010000','?':'110001010000010',"'":'010010000000000'};
function text3(x,s,X,Y,c){let cx=X;for(const ch of s.toUpperCase()){const g=F3[ch];if(g){for(let i=0;i<15;i++)if(g[i]==='1')px(x,c,cx+i%3,Y+((i/3)|0));}cx+=4;}return cx-X-1;}
function text3w(s){return s.length*4-1;}

// ================= CHARACTERS =================
const SCOTT_HEAD=[
"....KKKKKKK.....",
"..KKCCCCCcCKK...",
".KCCCCCCCCcCCK..",
".KCCCCCCCCCCCK..",
".KCCCCCCCCCCCKKKK",
".KKKKKKKKKKKKCCCK",
".KhhSSSSSSKKKKKK",
".KhsSSSSSbbSK...",
"KssSSSSSSESSK...",
"KssSSSSSSSSSSK..",
".KsBSSSSSSSSK...",
".KBBBSSSBBBBK...",
".KBBBBBBBMMBK...",
".KbBBBBBBBBBK...",
"..KbBBBBBBBK....",
"...KKbbbbbK.....",
"....KKKKKK......"];
const CHAR_HEAD=[
"....KKKKKKK.....",
"..KKHHHHLLHKK...",
".KHHHHHHHLLHHK..",
"KHHHHHHHHHHHHK..",
"KHHHHHHHHHHHHHK.",
"KHHHhHHHSSHHHHK.",
"KHHhHHSSSSSSHK..",
"KHHhHSSSSSbbSK..",
"KHHhHSSSSSESSK..",
"KHHhHsSSSSSSSSK.",
"KHHhHSSSSSSSSK..",
"KHHhHsSSSSRRSK..",
"KHHHHHsSSSSSK...",
"KHHHHHKsSSKK....",
"KHHHHHK.KKK.....",
"KHHHHHK........."];
const PAL={
 scott:{C:'#272534',c:'#46435c',S:'#f2b48c',s:'#d28a64',h:'#4a2e1c',B:'#6b4226',b:'#47291a',M:'#8c3b2c',E:K,
  shirt:'#2f78dc',shirtD:'#1f55a6',shirtL:'#5d9cf0',arm:'#f2b48c',armD:'#d28a64',leg:'#2c3d68',legD:'#1d2947',shoe:'#f4f4f4',sole:'#9aa0b4'},
 charlotte:{H:'#f7d36a',h:'#d8a93e',L:'#fff2a6',S:'#f6c3a0',s:'#dc9a78',b:'#a8742e',E:'#2a1440',R:'#ff4f8b',
  shirt:'#ff5fae',shirtD:'#d6378a',shirtL:'#ff9fd0',arm:'#f6c3a0',armD:'#dc9a78',leg:'#88aee8',legD:'#5f84c2',shoe:'#ffffff',sole:'#c0b6d8'}
};
function humanPose(kind,pose,phase){
 // returns canvas 30x32; feet on row 31
 const [c,x]=mk(30,32);const p=PAL[kind];const L=[];
 const duck=pose==='duck';
 const t=phase*2*Math.PI;
 let bob=0,legs,arms,hip=[13,22],sh=[14,16],headPos=[7,0];
 if(pose==='run'){bob=-Math.round(Math.abs(Math.cos(t))*1.2)+1;
  const lg=a=>{const th=38*Math.sin(a);return [th,th-10-55*Math.max(0,Math.cos(a))];};
  legs=[lg(t+Math.PI),lg(t)];
  const am=a=>{const u=-38*Math.sin(a);return [u,u+75];};arms=[am(t+Math.PI),am(t)];}
 else if(pose==='jump'){legs=[[-30,-75],[65,5]];arms=[[-70,-30],[150,175]];bob=0;}
 else if(pose==='fall'){legs=[[-15,-40],[30,15]];arms=[[-110,-80],[105,130]];}
 else if(pose==='idle'){bob=phase<.5?0:1;legs=[[-4,-4],[4,4]];arms=[[-8,10],[8,25]];}
 else if(pose==='hurt'){legs=[[-30,-10],[20,40]];arms=[[-150,-170],[150,170]];bob=-1;}
 if(duck){ // charging crouch, head forward & low
  hip=[10,26];const f=Math.sin(t);
  legs=[[70-20*f,-15],[70+20*f,5]];
  const pts=[];
  const cfg=[[hip,legs[0],true],[hip,legs[1],false]];
  // back leg
  let [kx,ky,fx,fy]=chain(hip[0],hip[1],legs[0][0],5,legs[0][1],5);
  L.push({t:'l',x0:hip[0],y0:hip[1],x1:kx,y1:ky,r:1.2,c:p.legD},{t:'l',x0:kx,y0:ky,x1:fx,y1:fy,r:1,c:p.legD},{t:'r',x:fx-1,y:Math.min(fy,29),w:4,h:2,c:p.sole});
  // torso horizontal
  L.push({t:'l',x0:hip[0]-1,y0:hip[1]-2,x1:hip[0]+7,y1:hip[1]-5,r:3,c:p.shirt});
  L.push({t:'l',x0:hip[0]-1,y0:hip[1],x1:hip[0]+6,y1:hip[1]-2,r:1,c:p.shirtD,o:false});
  [kx,ky,fx,fy]=chain(hip[0],hip[1],legs[1][0],5,legs[1][1],5);
  L.push({t:'l',x0:hip[0],y0:hip[1],x1:kx,y1:ky,r:1.3,c:p.leg},{t:'l',x0:kx,y0:ky,x1:fx,y1:fy,r:1.1,c:p.leg},{t:'r',x:fx-1,y:Math.min(fy,29),w:4,h:2,c:p.shoe});
  if(kind==='charlotte')L.push({t:'l',x0:12,y0:17,x1:3,y1:19+Math.round(f),r:1.6,c:p.H},{t:'l',x0:8,y0:19,x1:1,y1:22-Math.round(f),r:1,c:p.h});
  L.push({t:'g',rows:kind==='scott'?SCOTT_HEAD:CHAR_HEAD.slice(0,15),pal:p,x:13,y:14,o:false});
  // arm reaching forward
  L.push({t:'l',x0:17,y0:22,x1:22,y1:26,r:1,c:p.shirt},{t:'l',x0:22,y0:26,x1:26,y1:25,r:0.9,c:p.arm});
  prims(x,L);return c;}
 const hy=hip[1]+bob,sy=sh[1]+bob;
 const limbL=(hx,hy,a,col,colShoe,r1)=>{const [kx,ky,fx,fy]=chain(hx,hy,a[0],5,a[1],5);return [{t:'l',x0:hx,y0:hy,x1:kx,y1:ky,r:r1,c:col},{t:'l',x0:kx,y0:ky,x1:fx,y1:fy,r:r1-0.2,c:col},{t:'r',x:fx-1,y:fy,w:4,h:2,c:colShoe}];};
 const armL=(sx,sy,a,cS,cA)=>{const [ex,ey,hx2,hy2]=chain(sx,sy,a[0],4,a[1],4);return [{t:'l',x0:sx,y0:sy,x1:ex,y1:ey,r:1.1,c:cS},{t:'l',x0:ex,y0:ey,x1:hx2,y1:hy2,r:0.9,c:cA}];};
 // back arm & leg
 if(kind==='charlotte'){const w=Math.round(Math.sin(t*1)*1.5);L.push({t:'l',x0:9,y0:6+bob,x1:5-(pose==='jump'?2:0),y1:20+bob+w,r:2.2,c:p.H},{t:'l',x0:7,y0:10+bob,x1:4,y1:22+bob-w,r:1,c:p.h,o:false});}
 L.push(...armL(sh[0],sy+1,arms[0],p.shirtD,p.armD));
 L.push(...limbL(hip[0],hy,legs[0],p.legD,p.sole,1.5));
 // torso
 L.push({t:'r',x:10,y:sy-1,w:8,h:hy-sy+2,c:p.shirt});
 L.push({t:'r',x:10,y:sy-1,w:2,h:hy-sy+2,c:p.shirtD,o:false},{t:'r',x:15,y:sy,w:2,h:3,c:p.shirtL,o:false});
 if(kind==='charlotte')L.push({t:'r',x:11,y:hy-1,w:6,h:1,c:p.S,o:false});
 L.push({t:'r',x:10,y:hy,w:8,h:2,c:p.leg});
 L.push(...limbL(hip[0]+1,hy+1,legs[1],p.leg,p.shoe,1.6));
 L.push({t:'g',rows:kind==='scott'?SCOTT_HEAD:CHAR_HEAD,pal:p,x:headPos[0]+(pose==='run'?1:0),y:headPos[1]+bob,o:false});
 L.push(...armL(sh[0]+2,sy+1,arms[1],p.shirt,p.arm));
 prims(x,L);return c;}

// ---------- Gunner: champagne bully ----------
const GUN_HEAD=[
".KK.......KK..",
"KffK.....KffK.",
"KfFFKKKKKFFfK.",
".KFFFFFWFFFFK.",
"KFFFFFFWFFFFFK",
"KFFEeFFWFFEeFK",
"KFFKKFWWWFKKFK",
"KfFFFWWWWWFFfK",
"KfFFWWNNNWWFfK",
".KfFWWNNNWWfK.",
".KfFWWWTWWFfK.",
"..KKKWTTTWKK..",
"....KKKKKK...."];
const GP={F:'#dcb27c',f:'#b98a56',W:'#f7efe2',E:'#1b0f22',e:'#ffffff',N:'#3a2630',T:'#ff6f91',body:'#dcb27c',bodyD:'#b98a56',bodyL:'#ecca98',chest:'#f7efe2',collar:'#2ee6ff',tag:'#ffd60a',paw:'#f7efe2'};
function gunnerPose(pose,phase){
 const [c,x]=mk(34,23);const L=[];const t=phase*2*Math.PI;
 let by=7,bob=0,fl,bl,hx=19,hy=0,tail;
 if(pose==='run'){const s=Math.sin(t),co=Math.cos(t);bob=Math.round(-co*1);
  fl=[[40*s,25*s+10],[40*Math.sin(t-0.7),25*Math.sin(t-0.7)+10]];
  bl=[[-40*s,-25*s-10],[-40*Math.sin(t-0.7),-25*Math.sin(t-0.7)-10]];tail=[-60+20*s,-8];}
 else if(pose==='jump'){fl=[[70,90],[60,80]];bl=[[-70,-95],[-60,-85]];tail=[-40,-6];bob=-1;}
 else if(pose==='fall'){fl=[[20,30],[10,20]];bl=[[-10,-20],[-20,-30]];tail=[-70,-9];}
 else if(pose==='idle'){fl=[[5,5],[-3,-3]];bl=[[-5,-5],[3,3]];tail=[-50+(phase<.5?15:-15),-8];bob=phase<.5?0:1;}
 else if(pose==='hurt'){fl=[[50,80],[40,70]];bl=[[-50,-80],[-40,-70]];tail=[-90,-6];bob=-2;}
 if(pose==='duck'){const s=Math.sin(t);by=12;hy=9;hx=20;
  fl=[[80+10*s,95],[75-10*s,95]];bl=[[-80-10*s,-95],[-75+10*s,-95]];tail=[-85,-6];bob=0;}
 const bodyY=by+bob, legY=bodyY+6, legL=pose==='duck'?2.2:3.3;
 const leg=(hx_,a,col,r)=>{const [kx,ky,fx,fy]=chain(hx_,legY,a[0],legL,a[1],legL);return [{t:'l',x0:hx_,y0:legY,x1:kx,y1:ky,r:r,c:col},{t:'l',x0:kx,y0:ky,x1:fx,y1:fy,r:r-0.3,c:col},{t:'r',x:fx-1,y:fy,w:3,h:1,c:col===GP.body?GP.bodyL:GP.bodyD,o:false}];};
 // tail
 const tx=6,ty=bodyY+1;L.push({t:'l',x0:tx,y0:ty,x1:tx+Math.sin(tail[0]*D)*5,y1:ty+Math.cos(tail[0]*D)*5,r:0.8,c:GP.bodyD});
 // far legs
 L.push(...leg(9,bl[1],GP.bodyD,1.6),...leg(19,fl[1],GP.bodyD,1.6));
 // body (stocky barrel)
 L.push({t:'d',x:8,y:bodyY+3,r:3.6,c:GP.body},{t:'r',x:8,y:bodyY-1,w:13,h:8,c:GP.body},{t:'d',x:19,y:bodyY+3,r:4.2,c:GP.body});
 L.push({t:'d',x:8,y:bodyY+3,r:3.4,c:GP.body,o:false},{t:'r',x:8,y:bodyY-1,w:12,h:2,c:GP.bodyL,o:false},{t:'r',x:7,y:bodyY+5,w:11,h:2,c:GP.bodyD,o:false},{t:'d',x:9,y:bodyY+2,r:1.5,c:GP.bodyD,o:false});
 L.push({t:'r',x:19,y:bodyY+1,w:4,h:6,c:GP.chest,o:false});
 // near legs (thick bully legs)
 L.push(...leg(9,bl[0],GP.body,1.9),...leg(19,fl[0],GP.body,1.9));
 // collar
 L.push({t:'r',x:19,y:bodyY-1+ (pose==='duck'?1:0),w:3,h:5,c:GP.collar});
 L.push({t:'g',rows:GUN_HEAD,pal:GP,x:hx,y:hy+bob+(pose==='duck'?0:0),o:false});
 L.push({t:'r',x:22,y:bodyY+3+(pose==='duck'?1:0),w:1,h:2,c:GP.tag,o:false});
 prims(x,L);return c;}

// ================= OBJECTS =================
function coinFrames(){const out=[];const ws=[7,5,3,5];for(let i=0;i<4;i++){const [c,x]=mk(9,9);const w=ws[i];const ox=4-(w>>1);
 if(w>=5){prims(x,[{t:'d',x:4,y:4,r:3.3,c:'#ffd60a'}]);if(w===5){x.clearRect(0,0,2,9);x.clearRect(7,0,2,9);px(x,K,1,2,1,5);px(x,K,7,2,1,5);px(x,'#ffd60a',2,1,5,7);px(x,K,2,0,5,1);px(x,K,2,8,5,1);}
  px(x,'#fff6b0',ox+1,2,1,2);if(w===7){px(x,'#c98a00',3,2,1,5);px(x,'#c98a00',4,2,2,1);px(x,'#c98a00',3,4,2,1);px(x,'#c98a00',3,6,3,1);}}
 else{px(x,K,2,0,5,1);px(x,K,2,8,5,1);px(x,K,2,1,1,7);px(x,K,6,1,1,7);px(x,'#ffd60a',3,1,3,7);px(x,'#fff6b0',3,2,1,3);}
 out.push(c);}return out;}
function flightTicket(){const [c,x]=mk(20,13);prims(x,[{t:'r',x:1,y:1,w:18,h:11,c:'#f5fbff'}]);px(x,'#2ee6ff',1,1,18,4);
 // little white plane in the header band
 px(x,'#ffffff',4,3,7,1);px(x,'#ffffff',6,2,2,1);px(x,'#ffffff',6,4,2,1);px(x,'#ffffff',4,2,1,1);px(x,'#ffffff',11,3,1,1);
 text3(x,'£9',3,6,'#0c3a7a');for(let i=5;i<12;i+=2)px(x,'#ff2bd6',13,i,1,1);px(x,'#9aa6c0',15,6,2,1);px(x,'#9aa6c0',15,8,2,1);px(x,'#9aa6c0',15,10,2,1);return c;}
function trainTicket(){ // overhead flying £260 ticket
 const [c,x]=mk(26,14);prims(x,[{t:'r',x:1,y:1,w:24,h:12,c:'#ff8a00'}]);px(x,'#ffb347',1,1,24,2);px(x,'#c95f00',1,11,24,2);
 px(x,'#fff3e0',3,4,20,6);text3(x,'£260',5,4,'#e60023');px(x,K,0,6,1,2);px(x,K,25,6,1,2);return c;}
function trainSign(){ // ground: overpriced ticket machine
 const [c,x]=mk(16,24);prims(x,[{t:'r',x:2,y:1,w:12,h:22,c:'#e83a4f'}]);px(x,'#ff6f80',3,2,10,1);px(x,'#1b1030',4,4,8,6);text3(x,'260',4,5,'#7cff3a');px(x,'#ffd60a',4,12,8,1);px(x,'#2a1b3d',5,15,6,2);px(x,'#ffffff',6,19,4,1);px(x,'#a51d33',2,21,12,2);return c;}
function bike(frame){const [c,x]=mk(28,17);const w=(cx,cy)=>{prims(x,[{t:'d',x:cx,y:cy,r:4.5,c:'#3a3550'}]);disk(x,'#9aa3b8',cx,cy,3.3);disk(x,'#3a3550',cx,cy,2.3);px(x,'#c8cfe0',cx,cy-2+(frame%2),1,1);px(x,'#c8cfe0',cx-1,cy,1,1);};
 w(6,11);w(21,11);const L=[{t:'l',x0:6,y0:11,x1:12,y1:5,r:0.8,c:'#ff2d55'},{t:'l',x0:12,y0:5,x1:20,y1:5,r:0.8,c:'#ff2d55'},{t:'l',x0:20,y0:5,x1:21,y1:11,r:0.8,c:'#ff2d55'},{t:'l',x0:12,y0:5,x1:13,y1:11,r:0.8,c:'#ff2d55'},{t:'l',x0:6,y0:11,x1:13,y1:11,r:0.6,c:'#ff2d55'},{t:'l',x0:19,y0:5,x1:19,y1:2,r:0.6,c:'#c8cfe0'},{t:'l',x0:17,y0:2,x1:22,y1:2,r:0.6,c:'#c8cfe0'},{t:'r',x:10,y:2,w:4,h:2,c:'#2a1b3d'},{t:'r',x:21,y:4,w:5,h:3,c:'#ffd60a'}];prims(x,L);
 return c;}
function cone(){const [c,x]=mk(12,15);prims(x,[{t:'l',x0:6,y0:2,x1:6,y1:10,r:2.5,c:'#ff7a00'},{t:'r',x:1,y:12,w:10,h:2,c:'#ff7a00'}]);px(x,'#ffffff',4,6,5,2);px(x,'#ffffff',5,3,3,1);px(x,'#ffb070',5,1,1,3);return c;}
function suitcase(){const [c,x]=mk(16,20);prims(x,[{t:'r',x:5,y:1,w:6,h:2,c:'#3a3550'},{t:'r',x:1,y:4,w:14,h:13,c:'#2ee6ff'}]);px(x,'#1aa8c0',1,4,2,13);px(x,'#9af4ff',4,6,1,9);px(x,'#9af4ff',8,6,1,9);px(x,'#9af4ff',12,6,1,9);px(x,'#ff2bd6',3,9,10,2);px(x,K,2,17,3,2);px(x,K,11,17,3,2);px(x,'#ffd60a',6,4,4,1);return c;}
function stall(){ // tourist trap souvenir stall
 const [c,x]=mk(26,24);prims(x,[{t:'r',x:2,y:11,w:22,h:12,c:'#7a3db8'},{t:'r',x:1,y:6,w:24,h:6,c:'#ffffff'},{t:'r',x:4,y:0,w:18,h:6,c:'#ff2bd6'}]);for(let i=0;i<6;i++)px(x,'#ff2d55',1+i*4,6,2,6);px(x,'#1b1030',4,13,18,6);text3(x,'£££',7,14,'#ffd60a');px(x,'#ffd60a',4,20,18,1);text3(x,'TRAP',6,1,'#ffffff');return c;}
function seagull(f){const [c,x]=mk(18,11);const up=f===0;
 const L=[{t:'l',x0:4,y0:6,x1:12,y1:6,r:2,c:'#f4f4f8'},{t:'d',x:13,y:5,r:2,c:'#f4f4f8'},{t:'r',x:15,y:5,w:3,h:1,c:'#ffb000',o:false},{t:'l',x0:2,y0:6,x1:4,y1:6,r:1,c:'#c9cbd8'}];
 if(up)L.splice(1,0,{t:'l',x0:8,y0:5,x1:4,y1:0,r:1,c:'#9ea2b8'}); else L.push({t:'l',x0:8,y0:7,x1:5,y1:10,r:1,c:'#9ea2b8'});
 prims(x,L);px(x,K,14,4);return c;}
function bollard(){const [c,x]=mk(10,14);prims(x,[{t:'r',x:2,y:3,w:6,h:10,c:'#2a2440'},{t:'r',x:1,y:1,w:8,h:3,c:'#2a2440'}]);px(x,'#ffd60a',2,7,6,2);px(x,'#4a4268',3,4,1,8);return c;}
function amPost(){const [c,x]=mk(8,16);prims(x,[{t:'r',x:2,y:3,w:4,h:12,c:'#8a1a2a'},{t:'d',x:4,y:3,r:2,c:'#8a1a2a'}]);px(x,'#ffffff',2,6,4,1);px(x,'#ffffff',2,8,4,1);px(x,'#ffffff',2,10,4,1);px(x,'#c23045',3,2,1,10);return c;}
function sunbed(){const [c,x]=mk(28,12);prims(x,[{t:'r',x:2,y:5,w:18,h:2,c:'#ffffff'},{t:'l',x0:19,y0:5,x1:25,y1:0,r:1,c:'#ffffff'},{t:'r',x:3,y:7,w:1,h:4,c:'#9aa0b4'},{t:'r',x:18,y:7,w:1,h:4,c:'#9aa0b4'}]);px(x,'#2ee6ff',3,5,16,1);px(x,'#ff2bd6',6,4,9,1);return c;}
function pigeon(f){const [c,x]=mk(14,10);const L=[{t:'l',x0:3,y0:5,x1:9,y1:5,r:2,c:'#8a8fb0'},{t:'d',x:10,y:4,r:1.8,c:'#6d7299'},{t:'r',x:12,y:4,w:2,h:1,c:'#ffb000',o:false}];if(f===0)L.splice(1,0,{t:'l',x0:6,y0:4,x1:3,y1:0,r:1,c:'#5b5f85'});else L.push({t:'l',x0:6,y0:6,x1:4,y1:9,r:1,c:'#5b5f85'});prims(x,L);px(x,'#7cff3a',9,6,2,1);px(x,K,11,3);return c;}

window.SPR={mk,px,disk,seg,prims,text3,text3w,K,
 build(){const S={};
  for(const k of ['scott','charlotte']){S[k]={run:[0,1,2,3,4,5].map(i=>humanPose(k,'run',i/6)),duck:[0,1,2,3].map(i=>humanPose(k,'duck',i/4)),jump:[humanPose(k,'jump',0)],fall:[humanPose(k,'fall',0)],idle:[humanPose(k,'idle',0),humanPose(k,'idle',.6)],hurt:[humanPose(k,'hurt',0)]};}
  S.gunner={run:[0,1,2,3,4,5].map(i=>gunnerPose('run',i/6)),duck:[0,1,2,3].map(i=>gunnerPose('duck',i/4)),jump:[gunnerPose('jump',0)],fall:[gunnerPose('fall',0)],idle:[gunnerPose('idle',0),gunnerPose('idle',.6)],hurt:[gunnerPose('hurt',0)]};
  S.coin=coinFrames();S.flight=flightTicket();S.train=trainTicket();S.trainSign=trainSign();S.bike=[bike(0),bike(1)];S.cone=cone();S.suitcase=suitcase();S.stall=stall();S.gull=[seagull(0),seagull(1)];S.bollard=bollard();S.post=amPost();S.sunbed=sunbed();S.pigeon=[pigeon(0),pigeon(1)];
  return S;}};
})();
