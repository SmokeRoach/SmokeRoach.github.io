/* £99 Challenge — stage backdrops, painted in code at pixel resolution */
(function(){
'use strict';
const {mk,px,disk,prims,text3,K}=window.SPR;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function vgrad(x,w,h,stops){const g=x.createLinearGradient(0,0,0,h);stops.forEach(([o,c])=>g.addColorStop(o,c));x.fillStyle=g;x.fillRect(0,0,w,h);}
// dithered horizontal band blending
function stars(x,w,h,n,seed,col){const r=rng(seed);for(let i=0;i<n;i++){const X=r()*w|0,Y=r()*h|0;px(x,r()<.15?'#ffffff':col,X,Y);if(r()<.06){px(x,col,X-1,Y);px(x,col,X+1,Y);px(x,col,X,Y-1);px(x,col,X,Y+1);}}}
const LW=640;
// ---------- drawing helpers (all pixel-snapped) ----------
function ln(x,c,x0,y0,x1,y1,w){w=w||1;const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1)|0;for(let i=0;i<=n;i++){const t=i/n;px(x,c,Math.round(x0+(x1-x0)*t),Math.round(y0+(y1-y0)*t),w,w);}}
function half(x,c,cx,cy,r){const R=Math.ceil(r);x.fillStyle=c;for(let dy=-R;dy<=0;dy++)for(let dx=-R;dx<=R;dx++)if(dx*dx+dy*dy<=r*r+0.35)x.fillRect(cx+dx,cy+dy,1,1);}
function spire(x,c,cx,by,hw,ht){for(let i=0;i<ht;i++){const w=Math.round(hw*(1-i/ht));px(x,c,cx-w,by-i,w*2+1,1);}}
function wins(x,r,X0,Y0,X1,Y1,sx,sy,ww,wh,p,lit,dark){for(let y=Y0;y+wh<=Y1;y+=sy)for(let X=X0;X+ww<=X1;X+=sx)px(x,r()<p?(typeof lit==='function'?lit():lit):dark,X,y,ww,wh);}
const warmF=r=>()=>{const v=r();return v<.45?'#ffd25a':v<.85?'#ffb347':'#fff1b0';};
function glow(x,c,cx,cy,rad,a){x.globalAlpha=a||.18;disk(x,c,cx,cy,rad);x.globalAlpha=1;}
function rows(x,c,X,Y,rs,flip){rs.forEach((s,j)=>{for(let i=0;i<s.length;i++)if(s[i]==='#')px(x,c,X+(flip?s.length-1-i:i),Y+j);});}
function bigText(x,s,X,Y,sc,cols,sh,d){let cx=X;for(let i=0;i<s.length;i++){const ch=s[i];const [tc,tx]=mk(3,5);text3(tx,ch,0,0,cols[i%cols.length]);if(sh){const [sc2,sx]=mk(3,5);text3(sx,ch,0,0,sh);for(let k=d||2;k>0;k--)x.drawImage(sc2,cx+k,Y+k,3*sc,5*sc);}x.drawImage(tc,cx,Y,3*sc,5*sc);cx+=4*sc;}return cx-X;}
function water(x,r,y0,y1,top,bot,streaks,n){const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,y0,LW,y1-y0);for(let i=0;i<n;i++){const X=r()*LW|0,Y=y0+1+(r()*(y1-y0-1)|0);px(x,streaks[r()*streaks.length|0],X,Y,2+(r()*6|0),1);}}
function blocks(x,r,X0,X1,b,minH,maxH,c,winC,p,dark){let X=X0;while(X<X1){const w=Math.min(8+(r()*16|0),X1-X),hh=minH+(r()*(maxH-minH)|0);px(x,c,X,b-hh,w,hh);if(winC)wins(x,r,X+2,b-hh+3,X+w-1,b-2,3,4,1,2,p,winC,dark||c);X+=w+(r()*3|0);}}
// periodic ridge (wraps seamlessly at LW)
function ridge(x,c,b,base,terms){for(let X=0;X<LW;X++){let y=base;for(const [k,a,ph] of terms)y+=a*Math.sin(X/LW*Math.PI*2*k+(ph||0));y=Math.round(y);px(x,c,X,b-y,1,y);}}
function bike(x,X,Y,c){const k='#120818';for(const wx of [X,X+6]){px(x,k,wx+1,Y-4);px(x,k,wx,Y-3);px(x,k,wx+2,Y-3);px(x,k,wx+1,Y-2);}ln(x,c,X+1,Y-3,X+4,Y-5);ln(x,c,X+4,Y-5,X+7,Y-3);ln(x,c,X+3,Y-6,X+4,Y-3);px(x,k,X+2,Y-7,3,1);px(x,c,X+6,Y-7,1,3);px(x,k,X+5,Y-8,3,1);}
const BIRD=['#.....#','##...##','.#####.','..###..','.#.#...','#######'];
const GULL=['..##...','.####..','######.','.####..','..#.#..'];
function gull(x,X,Y,f){rows(x,'#ffffff',X,Y,GULL,f);px(x,'#9aa0b8',X+(f?4:2),Y+2,2,1);px(x,'#ffb020',X+(f?0:6),Y+1);px(x,'#150a22',X+(f?2:4),Y+1);}
function palm(x,X,b,L,lean){for(let i=0;i<L;i++){const ox=Math.round(Math.sin(i/L*1.4)*lean);px(x,i%4<2?'#8a5a2a':'#6a4020',X+ox,b-i,3,1);}
 const tx=X+Math.round(Math.sin(1.4)*lean)+1,ty=b-L;
 for(const [a,len] of [[-2.9,16],[-2.4,14],[-1.9,10],[-1.2,10],[-.7,14],[-.2,16],[3.4,12],[.3,12]]){for(let t=0;t<len;t++){const xx=tx+Math.cos(a)*t,yy=ty+Math.sin(a)*t*0.55+t*t/40;px(x,t%3?'#2a9a4a':'#1a7a3a',xx,yy,1,2);if(t>2&&t%2)px(x,'#3ab85a',xx,yy+2);}}
 disk(x,'#5a3a1a',tx-1,ty+2,1);disk(x,'#5a3a1a',tx+2,ty+2,1);}

const STAGES=[
// =============================== LIVERPOOL ===============================
{id:'liverpool',name:'LIVERPOOL',sub:'Home sweet home',offs:{far:12,back:22},
 sky:[[0,'#12042e'],[.45,'#3d0f63'],[.78,'#b3305f'],[1,'#ff8a5a']],
 sun:{c:'#ffcf5a',r:22,x:.72,y:.92,band:'#ff6a5a'},starsN:40,
 ground:{top:'#5b4a7a',a:'#3a2b58',b:'#33264f',line:'#7a69a0',type:'paving'},
 back(x,h){const r=rng(5),b=h,c='#43186a',w='#6a2a80';
  blocks(x,r,0,LW,b,12,40,c,w,.3);
  // dock cranes up the river
  for(const X of [36,250,520]){px(x,c,X,b-66,2,66);px(x,c,X+16,b-66,2,66);px(x,c,X-12,b-70,48,3);ln(x,c,X,b-66,X+16,b-50);ln(x,c,X+16,b-66,X,b-50);px(x,c,X+26,b-70,1,14);px(x,'#ff3a5a',X+34,b-71);}
  // modern towers behind the commercial district
  for(const [X,w,hh] of [[300,14,80],[318,10,62],[420,16,70],[600,12,56]]){px(x,c,X,b-hh,w,hh);px(x,'#ff3a5a',X+(w>>1),b-hh-1);wins(x,r,X+2,b-hh+3,X+w-1,b-2,3,4,1,2,.35,w>12?'#8a3a8a':'#6a2a80',c);}
 },
 far(x,h){const r=rng(11),b=h,B='#240a44',B2='#2e0f52',HI='#4e1d72',RIM='#9a3e82',D='#170630',W=warmF(r);
  // --- Liverpool Wheel ---
  {const cx=48,cy=b-44,R=33;ln(x,B,cx,cy,cx-20,b-3,2);ln(x,B,cx,cy,cx+20,b-3,2);
   for(let a=0;a<16;a++){const t=a/16*Math.PI*2;ln(x,HI,cx,cy,cx+Math.cos(t)*R,cy+Math.sin(t)*R);}
   for(let a=0;a<120;a++){const t=a/120*Math.PI*2;px(x,'#d8c8ff',cx+Math.cos(t)*R,cy+Math.sin(t)*R);}
   for(let a=0;a<16;a++){const t=a/16*Math.PI*2+.1,X=Math.round(cx+Math.cos(t)*(R+2)),Y=Math.round(cy+Math.sin(t)*(R+2));px(x,B,X-1,Y-1,3,3);px(x,a%2?'#ff2bd6':'#2ee6ff',X,Y,1,1);}
   disk(x,'#ffd25a',cx,cy,2);px(x,B,cx-26,b-4,52,4);px(x,HI,cx-26,b-4,52,1);}
  // --- Royal Liver Building ---
  {const X=96;glow(x,'#ffb347',X+32,b-60,40,.07);
   px(x,B,X,b-60,64,60);px(x,RIM,X,b-60,1,60);px(x,HI,X,b-60,64,1);
   px(x,B,X+3,b-68,58,8);px(x,HI,X+3,b-68,58,1);px(x,B,X+20,b-74,24,6);px(x,HI,X+20,b-74,24,1);
   wins(x,r,X+3,b-56,X+62,b-3,4,6,2,3,.55,W,D);
   for(const [TX,f] of [[X+2,true],[X+48,false]]){
    px(x,B,TX,b-90,14,22);px(x,RIM,TX,b-90,1,22);
    disk(x,'#ffe9a8',TX+7,b-81,5);px(x,'#ffffff',TX+5,b-84,2,1);px(x,B,TX+7,b-85,1,4);px(x,B,TX+7,b-81,3,1);
    px(x,B,TX+1,b-97,12,7);for(let i=0;i<4;i++)px(x,r()<.7?'#ffd25a':D,TX+2+i*3,b-96,1,5);
    px(x,B,TX+3,b-101,8,4);half(x,B,TX+7,b-102,4);px(x,HI,TX+5,b-105,2,1);
    px(x,B,TX+6,b-109,2,4);
    rows(x,'#0f3a2a',TX+4,b-115,BIRD,f);rows(x,'#6ff0a8',TX+4,b-116,BIRD,f);}
   text3(x,'BELLA',X-1,b-124,'#ffd2f0');text3(x,'BERTIE',X+44,b-124,'#ffd2f0');}
  // --- Cunard Building ---
  {const X=166;px(x,B,X,b-48,54,48);px(x,RIM,X,b-48,1,48);px(x,HI,X-1,b-49,56,2);px(x,B,X+2,b-52,50,3);
   for(let k=0;k<8;k++)px(x,HI,X+3+k*7,b-53,2,1);wins(x,r,X+3,b-44,X+53,b-3,4,6,2,3,.5,W,D);}
  // --- Port of Liverpool Building ---
  {const X=226,cx=X+29;px(x,B,X,b-44,58,44);px(x,RIM,X,b-44,1,44);
   half(x,HI,cx,b-44,13);half(x,B,cx+1,b-44,12);for(const dx of [-8,-3,3,8])ln(x,HI,cx,b-56,cx+dx,b-45);
   px(x,B,cx-2,b-62,5,6);px(x,'#ffd25a',cx-1,b-60,1,2);px(x,'#ffd25a',cx+1,b-60,1,2);half(x,B,cx,b-62,3);px(x,B,cx,b-68,1,4);
   for(const tx of [X+1,X+52]){px(x,B,tx,b-52,5,8);half(x,B,tx+2,b-52,3);px(x,B,tx+2,b-57,1,2);px(x,RIM,tx,b-52,1,8);}
   wins(x,r,X+3,b-40,X+56,b-3,4,6,2,3,.5,W,D);}
  // --- city blocks + St John's Beacon (Radio City Tower) ---
  blocks(x,r,292,402,b,14,34,B2,W,.4,D);
  {const X=330;glow(x,'#2ee6ff',X+2,b-104,12,.12);px(x,B,X,b-98,5,98);px(x,RIM,X,b-98,1,98);
   px(x,B,X-8,b-109,21,11);px(x,HI,X-8,b-109,21,1);px(x,'#2ee6ff',X-8,b-103,21,1);for(let i=0;i<5;i++)px(x,'#ffd25a',X-6+i*4,b-107,2,2);
   px(x,B,X-6,b-112,17,3);px(x,B,X+2,b-120,1,8);px(x,'#ff3a5a',X+2,b-121);
   text3(x,'RADIO CITY',X-18,b-128,'#9af6ff');}
  // --- Anglican Cathedral ---
  {const X=410;glow(x,'#ffb347',X+68,b-60,40,.08);
   px(x,B,X,b-36,136,36);px(x,HI,X,b-36,136,1);
   for(let k=0;k<=134;k+=8){px(x,HI,X+k,b-40,2,40);spire(x,B,X+k+1,b-40,1,3);}
   for(let k=4;k<130;k+=8){px(x,'#ff5a9a',X+k,b-28,2,12);px(x,'#ff5a9a',X+k,b-29,1,1);px(x,'#b8306a',X+k+1,b-22,1,6);}
   px(x,B,X+36,b-56,64,20);px(x,HI,X+36,b-56,64,1);for(let k=0;k<64;k+=8)spire(x,B,X+37+k,b-56,1,4);
   const T=X+50;px(x,B,T,b-102,36,66);px(x,RIM,T,b-102,1,66);px(x,HI,T,b-102,36,1);
   for(const dx of [7,16,25]){px(x,'#3d1660',T+dx,b-96,4,32);spire(x,'#3d1660',T+dx+1,b-97,2,3);px(x,'#ff7ab0',T+dx+1,b-82,2,12);}
   for(let i=0;i<5;i++){px(x,B,T+i*8,b-106,4,4);spire(x,B,T+i*8+1,b-107,2,6);}
   px(x,B,X+112,b-46,24,10);}
  // --- Metropolitan Cathedral crown ---
  {const X=572,cx=X+13;for(let i=0;i<26;i++){const w=Math.round(26-i*0.5);px(x,B,cx-w,b-i,w*2,1);}
   px(x,B,cx-10,b-44,20,18);const sg=['#2e6bff','#ff3a5a','#ffd25a'];for(let k=0;k<9;k++)px(x,sg[k%3],cx-9+k*2,b-42,1,13);
   for(let k=0;k<11;k++)px(x,B,cx-10+k*2,b-50+(k%2),1,6);px(x,HI,cx-10,b-44,20,1);}
 },
 mid(x,h){const r=rng(12),b=h;
  water(x,r,b-30,b-12,'#3a1060','#1a0638',['#ff8a5a','#ff5a9a','#ffd25a','#6a2a8a'],160);
  // Mersey Ferry (black hull, white upperworks, red & black funnel)
  const ferry=(F,wl,s)=>{const L=Math.round(70*s);
   px(x,'#141020',F,wl-7,L,7);px(x,'#141020',F+L,wl-7,3,4);px(x,'#141020',F-2,wl-7,2,3);px(x,'#c8283a',F,wl,L,1);px(x,'#e8e0f0',F,wl-8,L,1);
   if(s>=1)text3(x,'MERSEY FERRY',F+12,wl-6,'#e8e0f0');
   const u=Math.round(54*s);px(x,'#f2ecff',F+6,wl-14,u,6);for(let i=0;i<u-4;i+=3)px(x,r()<.7?'#ffd25a':'#2ee6ff',F+8+i,wl-12,2,2);
   px(x,'#e0d8f2',F+Math.round(16*s),wl-19,Math.round(34*s),5);px(x,'#f2ecff',F+Math.round(44*s),wl-23,Math.round(10*s),4);px(x,'#2ee6ff',F+Math.round(45*s),wl-22,Math.round(8*s),1);
   const fx=F+Math.round(28*s);px(x,'#d42a3a',fx,wl-28,Math.round(7*s),9);px(x,'#141020',fx,wl-28,Math.round(7*s),2);
   const mx=F+Math.round(56*s);px(x,'#141020',mx,wl-34,1,11);px(x,'#ffffff',mx,wl-35);ln(x,'#ff5a9a',mx,wl-33,F+L+2,wl-8);
   for(let i=0;i<16;i++)px(x,'#ffffff',F-4-i*2-(r()*3|0),wl+(r()*2|0),2,1);
   x.globalAlpha=.25;px(x,'#f2ecff',F+6,wl+2,u,3);x.globalAlpha=1;};
  ferry(150,b-21,1);ferry(470,b-25,.6);
  // promenade wall, railings, lamps
  px(x,'#24103e',0,b-12,LW,12);px(x,'#5a3a7a',0,b-12,LW,1);for(let X=0;X<LW;X+=10)px(x,'#1a0a30',X,b-11+((X/10|0)%2)*5,1,5);
  px(x,'#1a0a2c',0,b-18,LW,1);px(x,'#1a0a2c',0,b-15,LW,1);for(let X=0;X<LW;X+=6)px(x,'#1a0a2c',X,b-18,1,6);
  for(let X=40;X<LW;X+=80){glow(x,'#ffd25a',X+1,b-41,8,.15);px(x,'#120820',X,b-40,2,28);px(x,'#120820',X-4,b-40,10,1);px(x,'#120820',X-1,b-36,4,1);
   px(x,'#ffd25a',X-5,b-43,3,3);px(x,'#ffd25a',X+4,b-43,3,3);px(x,'#120820',X-5,b-44,3,1);px(x,'#120820',X+4,b-44,3,1);}
  for(let X=20;X<LW;X+=80){px(x,'#120820',X,b-14,3,2);}
 },
 pool:['cone','trainSign','train','gull','suitcase','train']},
// =============================== THE COACH ===============================
{id:'coach',name:'THE COACH',sub:'£9 Megabus to Dover',
 sky:[[0,'#050a24'],[.6,'#14205a'],[1,'#3a3f8a']],moon:{x:.25,y:.25},starsN:120,
 ground:{top:'#d6d6e6',a:'#2b2a3d',b:'#25243a',line:'#ffffff',type:'road'},
 back(x,h){const r=rng(21),b=h,c='#18224e';
  ridge(x,c,b,26,[[2,8,0],[5,5,1],[9,2,2]]);
  for(let i=0;i<90;i++)px(x,r()<.75?'#ffb347':'#fff1b0',r()*LW,b-4-r()*16,1,1);
  // pylons + sagging cables
  const P=[40,200,360,520];for(const X of P){const k='#26306a';ln(x,k,X-5,b-18,X-1,b-58);ln(x,k,X+5,b-18,X+1,b-58);px(x,k,X-7,b-52,15,1);px(x,k,X-6,b-45,13,1);px(x,k,X-1,b-62,3,4);ln(x,k,X-4,b-30,X+4,b-40);ln(x,k,X+4,b-30,X-4,b-40);}
  for(let i=0;i<P.length;i++){const a=P[i],z=i+1<P.length?P[i+1]:P[0]+LW;for(let X=a;X<=z;X++){const t=(X-a)/(z-a);px(x,'#2a3470',X%LW,b-52+Math.round(Math.sin(t*Math.PI)*7));}}
 },
 far(x,h){const r=rng(22),b=h,c='#0f1638';
  ridge(x,c,b,16,[[3,6,0],[7,3,2]]);
  for(let i=0;i<40;i++){const X=r()*LW|0,hh=4+(r()*6|0);disk(x,'#0a1030',X,b-16-hh/2,hh/2);}
  // wind turbines
  for(const X of [70,150,300,460,600]){const t=b-70-(X%3)*6;px(x,'#c8d0f0',X,t,2,b-t);px(x,'#e8ecff',X-1,t-1,4,3);px(x,'#ff3a3a',X,t-2);
   for(const a of [-1.57,.52,2.62]){ln(x,'#dfe5ff',X,t,X+Math.cos(a+X)*18,t+Math.sin(a+X)*18);}}
  // farm + village lights
  for(const X of [110,260,400,540]){px(x,'#141c46',X,b-24,16,10);spire(x,'#141c46',X+8,b-24,9,5);px(x,'#ffd25a',X+3,b-20,2,2);px(x,'#ffd25a',X+10,b-20,2,2);}
 },
 mid(x,h){const r=rng(23),b=h;
  // motorway lighting columns
  for(let X=8;X<LW;X+=72){glow(x,'#ffb347',X+5,b-45,9,.12);px(x,'#3a4070',X,b-46,1,40);px(x,'#3a4070',X,b-46,5,1);px(x,'#ffb347',X+4,b-46,3,1);}
  // services totem
  {const X=14;px(x,'#9aa0c0',X+18,b-46,3,40);px(x,'#ffffff',X-1,b-69,46,23);px(x,'#1f4fb4',X,b-68,44,21);
   text3(x,'SERVICES',X+6,b-66,'#ffffff');
   // icons: fuel pump, cup, bed
   px(x,'#ffffff',X+6,b-58,4,6);px(x,'#1f4fb4',X+7,b-57,2,2);px(x,'#ffffff',X+10,b-57,1,4);
   px(x,'#ffffff',X+18,b-57,5,4);px(x,'#ffffff',X+23,b-56,1,2);px(x,'#ffffff',X+17,b-53,7,1);
   px(x,'#ffffff',X+30,b-55,8,2);px(x,'#ffffff',X+30,b-57,2,2);px(x,'#ffffff',X+30,b-53,1,1);px(x,'#ffffff',X+37,b-53,1,1);}
  // forecourt canopy with lights
  {const X=70;x.globalAlpha=.2;px(x,'#fff6d8',X+4,b-32,82,24);x.globalAlpha=1;
   px(x,'#e8ecff',X,b-38,90,5);px(x,'#2e9a4a',X,b-34,90,1);px(x,'#ffd25a',X,b-38,90,1);
   for(let i=0;i<7;i++)px(x,'#ffffff',X+4+i*12,b-33,6,1);
   px(x,'#c8d0f0',X+8,b-33,3,25);px(x,'#c8d0f0',X+78,b-33,3,25);
   for(const p of [X+28,X+52]){px(x,'#d8dcf0',p,b-20,6,12);px(x,'#2e9a4a',p,b-20,6,2);px(x,'#2ee6ff',p+1,b-16,4,2);}}
  // services building
  {const X=168;px(x,'#2a3060',X,b-28,70,20);px(x,'#ff6a3a',X,b-30,70,3);x.globalAlpha=.8;px(x,'#fff1b0',X+3,b-22,64,12);x.globalAlpha=1;
   for(let i=0;i<64;i+=8)px(x,'#2a3060',X+3+i,b-22,1,12);for(let i=0;i<6;i++)px(x,'#3a3050',X+8+i*10,b-15,2,5);text3(x,'FOOD',X+27,b-29,'#ffffff');}
  // the coach (exterior)
  {const X=248;px(x,'#150a22',X-1,b-33,82,23);px(x,'#f2f4ff',X,b-32,80,21);px(x,'#1e5aa8',X,b-20,80,5);px(x,'#ffcf3a',X,b-15,80,1);
   px(x,'#1a2a4a',X+3,b-29,66,7);for(let i=0;i<11;i++){px(x,'#fff1b0',X+4+i*6,b-28,4,5);px(x,'#2a1a3a',X+5+i*6,b-26,2,3);}
   px(x,'#9ad0ff',X+72,b-30,7,11);px(x,'#150a22',X+72,b-30,7,2);px(x,'#ffb020',X+73,b-30,5,1);
   text3(x,'£9 COACH',X+16,b-20,'#ffffff');
   px(x,'#fff1b0',X+78,b-14,2,2);x.globalAlpha=.25;for(let i=0;i<10;i++)px(x,'#fff1b0',X+80+i,b-15-(i>>2),2,2+(i>>1));x.globalAlpha=1;px(x,'#ff3a3a',X,b-14,2,2);
   for(const wx of [X+12,X+64]){disk(x,'#150a22',wx,b-11,4);disk(x,'#8a8aa8',wx,b-11,1.5);}}
  // overhead gantry with blue motorway signs
  {const X0=366,X1=556;px(x,'#5a6090',X0,b-74,3,66);px(x,'#5a6090',X1,b-74,3,66);px(x,'#5a6090',X0,b-76,X1-X0+3,3);px(x,'#5a6090',X0,b-66,X1-X0+3,1);
   for(let X=X0;X<X1;X+=10)ln(x,'#5a6090',X,b-73,X+10,b-66);
   const sign=(X,l1a,l1b,l2)=>{px(x,'#ffffff',X-1,b-66,86,30);px(x,'#1f4fb4',X,b-65,84,28);
    const bw=l1a.length*4+3;px(x,'#ffffff',X+4,b-62,bw,9);px(x,'#1f4fb4',X+5,b-61,bw-2,7);text3(x,l1a,X+6,b-60,'#ffffff');text3(x,l1b,X+bw+8,b-60,'#ffffff');
    text3(x,l2,X+5,b-49,'#ffffff');for(const ax of [X+20,X+60]){px(x,'#ffffff',ax,b-42,1,4);px(x,'#ffffff',ax-1,b-40,3,1);}};
   sign(372,'M6','THE SOUTH','BIRMINGHAM');sign(464,'M62','LEEDS','MANCHESTER');}
  // green primary route sign
  {const X=576;px(x,'#9aa0c0',X+12,b-30,2,24);px(x,'#9aa0c0',X+44,b-30,2,24);px(x,'#ffffff',X-1,b-53,58,25);px(x,'#1c6b3a',X,b-52,56,23);
   text3(x,'M20',X+4,b-49,'#ffffff');text3(x,'A20',X+20,b-49,'#ffcf3a');text3(x,'DOVER',X+4,b-41,'#ffffff');text3(x,'12',X+40,b-41,'#ffffff');px(x,'#ffffff',X+4,b-34,48,1);}
  // crash barrier + verge
  px(x,'#0e1a2e',0,b-6,LW,6);px(x,'#9aa0c0',0,b-9,LW,2);px(x,'#5a6080',0,b-7,LW,1);for(let X=0;X<LW;X+=12)px(x,'#5a6080',X,b-7,1,7);
 },
 pool:['cone','suitcase','train','pigeon','bollard']},
// =============================== THE FERRY ===============================
{id:'ferry',name:'THE FERRY',sub:'White Cliffs of Dover',
 sky:[[0,'#2a1458'],[.5,'#b04a7a'],[.8,'#ff9a5a'],[1,'#ffd88a']],sun:{c:'#fff1b0',r:16,x:.3,y:.86,band:'#ffb37a'},starsN:10,
 ground:{top:'#f4f4f8',a:'#2f6f8a',b:'#2a627a',line:'#ffd60a',type:'deck'},
 back(x,h){const r=rng(31),b=h;
  ridge(x,'#c87aa0',b,14,[[1,3,0],[4,2,1]]);px(x,'#7a6ab8',0,b-8,LW,8);for(let i=0;i<60;i++)px(x,'#ffd8b0',r()*LW,b-7+r()*6,2,1);
  // distant ships on the horizon
  for(const X of [120,420]){px(x,'#5a3a7a',X,b-12,30,3);px(x,'#5a3a7a',X+6,b-16,16,4);px(x,'#5a3a7a',X+14,b-20,4,4);}
 },
 far(x,h){const r=rng(32),b=h;
  const top=X=>Math.round(52+6*Math.sin(X/LW*Math.PI*4)+3*Math.sin(X/LW*Math.PI*14+1));
  // sea strip
  px(x,'#4a5aa8',0,b-12,LW,12);for(let i=0;i<70;i++)px(x,'#ffd8b0',r()*LW,b-11+r()*10,2+(r()*3|0),1);
  // White Cliffs (gap for the harbour)
  for(let X=0;X<LW;X++){if(X>=430&&X<572)continue;let t=top(X);if(X<440)t=Math.min(t,t);const edge=X>=420&&X<430?(X-420)*4:X>=572&&X<582?(582-X)*4:0;t=Math.max(10,t-edge);
   const col=(X%7<2)?'#d8cce0':(X%13===0?'#c0b0cc':'#f6f0f2');px(x,col,X,b-t,1,t-8);px(x,'#ffe2d0',X,b-t+2,1,1);px(x,'#b8a8c8',X,b-12,1,4);
   px(x,'#4a9a5a',X,b-t-2,1,3);if(X%3===0)px(x,'#2f7a46',X,b-t-3,1,1);}
  for(let i=0;i<120;i++){const X=r()*LW|0;if(X>=420&&X<582)continue;const t=top(X);px(x,'#c8b8d4',X,b-t+4+(r()*(t-16)|0),1,2+(r()*4|0));}
  // Dover Castle on the clifftop
  {const X=170,g=b-top(X+16)-2,s='#9a8aa0',d='#7a6a88';px(x,s,X-22,g-6,62,6);for(let k=-22;k<40;k+=4)px(x,s,X+k,g-8,2,2);
   for(const tx of [X-22,X+36]){px(x,s,tx,g-11,6,11);px(x,d,tx+5,g-11,1,11);}
   px(x,s,X,g-22,18,22);px(x,d,X+15,g-22,3,22);for(let k=0;k<18;k+=4)px(x,s,X+k,g-24,2,2);
   for(const tx of [X-1,X+16])px(x,s,tx,g-27,3,5);px(x,'#3a2a4a',X+4,g-16,2,4);px(x,'#3a2a4a',X+11,g-16,2,4);px(x,'#3a2a4a',X+7,g-8,3,8);
   px(x,'#5a4a5a',X+8,g-37,1,10);px(x,'#ffffff',X+9,g-37,9,6);px(x,'#e0283a',X+12,g-37,2,6);px(x,'#e0283a',X+9,g-35,9,2);}
  // South Foreland lighthouse
  {const X=350,g=b-top(X)-2;px(x,'#f8f8ff',X,g-16,6,16);px(x,'#d8d8e8',X+4,g-16,2,16);px(x,'#3a3a5a',X-1,g-20,8,4);px(x,'#fff1b0',X+1,g-19,4,2);half(x,'#3a3a5a',X+3,g-20,3);
   x.globalAlpha=.25;for(let i=0;i<20;i++)px(x,'#fff1b0',X+7+i,g-19-(i>>2),1,1+(i>>2));x.globalAlpha=1;}
  // Port of Dover: harbour arm, docked ferry, cranes
  {px(x,'#8a8aa8',430,b-14,142,3);for(const X of [438,560]){px(x,'#5a5a7a',X,b-50,2,36);px(x,'#5a5a7a',X-8,b-52,22,2);}
   const F=452;px(x,'#f4f4fa',F,b-26,104,12);px(x,'#1f4fb4',F,b-18,104,3);px(x,'#e0283a',F,b-15,104,1);
   px(x,'#f4f4fa',F+12,b-34,78,8);px(x,'#f4f4fa',F+24,b-40,50,6);for(let i=0;i<74;i+=4)px(x,'#2a3a6a',F+14+i,b-32,2,2);
   px(x,'#2a3a6a',F+26,b-38,46,1);px(x,'#f4f4fa',F+56,b-50,9,10);px(x,'#1f4fb4',F+56,b-46,9,3);px(x,'#1a1a2a',F+56,b-50,9,2);}
  for(let i=0;i<10;i++){const X=r()*LW|0,Y=10+(r()*50|0);px(x,'#ffffff',X,Y,1,1);px(x,'#ffffff',X-1,Y-1);px(x,'#ffffff',X+1,Y-1);}
 },
 mid(x,h){const r=rng(33),b=h;
  water(x,r,b-34,b-14,'#3a5aa8','#1e3a7a',['#ffd8b0','#ffffff','#8ab0ff'],170);
  for(let i=0;i<30;i++)px(x,'#ffffff',r()*LW,b-16-(r()*4|0),3,1);
  // our ferry's funnels (white, blue band, red line, black top) with smoke
  const funnel=X=>{x.globalAlpha=.35;for(let i=0;i<5;i++)disk(x,'#c8c0d8',X+20+i*7,b-90-i*2,4+i);x.globalAlpha=1;
   px(x,'#f4f4fa',X,b-82,32,68);px(x,'#d0d0e2',X+26,b-82,6,68);px(x,'#1a1a2a',X,b-84,32,6);px(x,'#1f4fb4',X,b-68,32,8);px(x,'#e0283a',X,b-60,32,2);
   px(x,'#a0a0b8',X+6,b-30,20,1);px(x,'#a0a0b8',X+6,b-26,20,1);};
  funnel(30);funnel(400);
  // lifeboat on davits
  {const X=96;px(x,'#9a9ab8',X,b-52,2,38);px(x,'#9a9ab8',X+60,b-52,2,38);px(x,'#9a9ab8',X,b-52,8,2);px(x,'#9a9ab8',X+54,b-52,8,2);
   px(x,'#ff7a1a',X+6,b-42,50,10);px(x,'#ffa040',X+8,b-46,46,4);px(x,'#ffffff',X+6,b-36,50,1);for(let i=0;i<5;i++)px(x,'#2a3a6a',X+12+i*8,b-44,4,2);}
  // mast with radar, lights and flags
  {const X=200;px(x,'#e8e8f2',X,b-92,2,78);px(x,'#e8e8f2',X-8,b-86,18,2);px(x,'#1a1a2a',X-6,b-84,14,1);px(x,'#ff3a3a',X,b-94);px(x,'#2aff6a',X+1,b-74);
   const fc=['#e0283a','#ffffff','#1f4fb4','#ffcf3a'];for(let i=0;i<14;i++){const fx=X+3+i*4,fy=b-88+Math.round(i*i*0.28);px(x,fc[i%4],fx,fy,2,2);}}
  // vents
  for(const X of [262,300,520]){px(x,'#f4f4fa',X,b-28,4,14);px(x,'#f4f4fa',X-2,b-32,8,4);px(x,'#1a1a2a',X-1,b-30,6,2);}
  // gulls perched + flying
  for(const [X,f] of [[150,0],[340,1],[480,0],[600,1]])gull(x,X,b-28,f);
  for(const [X,Y] of [[250,40],[560,30]]){px(x,'#ffffff',X,b-Y,2,1);px(x,'#ffffff',X+2,b-Y+1,1,1);px(x,'#ffffff',X+3,b-Y,2,1);}
  // bulwark + railing + lifebuoys
  px(x,'#f4f4fa',0,b-23,LW,1);px(x,'#f4f4fa',0,b-19,LW,1);for(let X=0;X<LW;X+=8)px(x,'#f4f4fa',X,b-23,1,9);
  px(x,'#e8e8f2',0,b-14,LW,14);px(x,'#b8b8cc',0,b-14,LW,1);px(x,'#1f4fb4',0,b-4,LW,4);for(let X=12;X<LW;X+=40)disk(x,'#9ab0d0',X,b-9,2);
  for(const X of [120,300,460]){disk(x,'#ff5a2a',X,b-19,4);disk(x,'#ffffff',X,b-19,2);disk(x,'#2a3a6a',X,b-19,1);px(x,'#ffffff',X-4,b-19,2,1);px(x,'#ffffff',X+3,b-19,2,1);}
 },
 pool:['bollard','suitcase','gull','gull','cone']},
// =============================== AMSTERDAM ===============================
{id:'amsterdam',name:'AMSTERDAM',sub:'Canals, bikes & £99',
 sky:[[0,'#0c0320'],[.55,'#2a0a52'],[1,'#5a1a7a']],moon:{x:.8,y:.2},starsN:90,
 ground:{top:'#a8524a',a:'#7a3a3e',b:'#6a3036',line:'#3a1a24',type:'brick'},
 back(x,h){const r=rng(41),b=h,c='#2e1258';
  blocks(x,r,0,LW,b,16,34,c,'#5a2a6a',.2);
  // church towers (Westerkerk-style crown, Oude Kerk spire)
  {const X=120;px(x,c,X,b-70,12,70);px(x,c,X+1,b-80,10,10);px(x,c,X+2,b-88,8,8);px(x,c,X+3,b-94,6,6);spire(x,c,X+6,b-94,2,8);px(x,'#4a7aff',X+3,b-91,6,2);px(x,'#ffd25a',X+6,b-103);}
  {const X=440;px(x,c,X,b-56,12,56);px(x,c,X+2,b-64,8,8);spire(x,c,X+6,b-64,4,18);}
  {const X=290;px(x,c,X,b-48,40,10);half(x,c,X+20,b-48,10);}
 },
 far(x,h){const r=rng(42),b=h,W=warmF(r),D='#1a0a2a';
  const PAL=['#5b2433','#3d2b55','#24364f','#4f3020','#2b2440','#62302a','#33463c','#4a2440'];
  const house=(X,w,hh,col,type)=>{const t=b-hh;px(x,col,X,t,w,hh);px(x,'#ffffff22',X,t,1,hh);
   const cx=X+(w>>1);
   if(type===0){for(let i=0;i<3;i++)px(x,col,X+2+i*2,t-3-i*3,w-4-i*4,3+i*3);}
   else if(type===1){px(x,col,cx-3,t-9,7,9);half(x,col,X+3,t,3);half(x,col,X+w-4,t,3);half(x,col,cx,t-9,3);px(x,'#e8e0f0',cx-1,t-6,3,3);}
   else {spire(x,col,cx,t,w>>1,8);}
   px(x,'#e8e0f0',cx-1,t-(type===2?6:type===0?10:13),3,1);
   // hoist beam & hook
   const hy=t-(type===2?4:type===0?8:11);px(x,'#120818',cx,hy,1,2);px(x,'#c8c8d8',cx,hy+2,1,1);
   for(let y=t+3;y<b-10;y+=8)for(let wx=X+2;wx+3<=X+w-1;wx+=5){px(x,'#e8e0f0',wx,y,4,5);px(x,r()<.6?W():D,wx+1,y+1,2,3);}
   px(x,'#120818',cx-1,b-8,3,8);px(x,'#e8e0f0',cx-2,b-9,5,1);};
  let X=2,i=0;while(X<370){const w=12+(r()*8|0),hh=40+(r()*26|0);house(X,w,hh,PAL[i%PAL.length],(r()*3)|0);X+=w;i++;}
  X=596;while(X<LW-12){const w=12+(r()*6|0);house(X,Math.min(w,LW-X),46+(r()*16|0),PAL[i%PAL.length],i%3);X+=w;i++;}
  // Amsterdam Centraal Station
  {const S=380,Wd=208,brick='#6e2430',st='#d8b07a',roof='#24163a';glow(x,'#ffd25a',S+104,b-30,60,.06);
   px(x,brick,S,b-36,Wd,36);px(x,roof,S,b-44,Wd,8);for(let k=6;k<Wd;k+=14){px(x,roof,S+k,b-48,6,4);px(x,'#ffd25a',S+k+2,b-46,2,2);}
   for(const yy of [b-36,b-24,b-12])px(x,st,S,yy,Wd,1);
   for(let k=4;k<Wd-4;k+=7){if(k>82&&k<126)continue;half(x,'#e8e0f0',S+k+2,b-31,2);px(x,'#e8e0f0',S+k,b-31,5,5);px(x,W(),S+k+1,b-31,3,4);half(x,'#e8e0f0',S+k+2,b-19,2);px(x,'#e8e0f0',S+k,b-19,5,5);px(x,W(),S+k+1,b-19,3,4);}
   // central gable + gate
   px(x,brick,S+86,b-58,36,22);spire(x,brick,S+104,b-58,18,10);half(x,st,S+104,b-46,8);half(x,'#ffcf5a',S+104,b-47,6);
   for(const gx of [S+90,S+101,S+112]){half(x,'#120818',gx+3,b-9,3);px(x,'#120818',gx,b-9,7,9);px(x,'#ffd25a',gx+1,b-6,5,6);}
   // twin towers: clock (west) and wind-vane (east)
   for(const [tx,clock] of [[S+66,true],[S+128,false]]){px(x,brick,tx,b-76,14,40);px(x,st,tx,b-66,14,1);px(x,st,tx,b-56,14,1);px(x,roof,tx-1,b-78,16,3);px(x,'#ffcf5a',tx-1,b-78,16,1);
    px(x,roof,tx+2,b-86,10,8);spire(x,roof,tx+7,b-86,5,10);px(x,'#ffcf5a',tx+7,b-98,1,3);
    if(clock){disk(x,'#ffe9a8',tx+7,b-71,4);px(x,'#120818',tx+7,b-74,1,3);px(x,'#120818',tx+7,b-71,3,1);}
    else{disk(x,'#ffcf5a',tx+7,b-71,3);px(x,'#ffcf5a',tx+3,b-101,9,1);px(x,'#ffcf5a',tx+9,b-103,2,2);}
    px(x,'#e8e0f0',tx+5,b-62,4,5);px(x,W(),tx+6,b-61,2,4);}
   text3(x,'CENTRAAL',S+88,b-38,'#ffcf5a');}
 },
 mid(x,h){const r=rng(43),b=h;
  water(x,r,b-30,b-10,'#2a1a5a','#120630',['#ffd25a','#ffb347','#ff5a9a','#3a2a7a'],170);
  // houseboats
  const boat=(X,L,hull,cab)=>{px(x,hull,X,b-20,L,6);px(x,'#120818',X,b-14,L,1);px(x,cab,X+5,b-28,L-12,8);px(x,'#2a1a1a',X+3,b-30,L-8,2);
   for(let i=0;i<L-18;i+=7){px(x,'#e8e0f0',X+8+i,b-26,5,4);px(x,r()<.7?'#ffd25a':'#3a2a4a',X+9+i,b-25,3,2);}
   for(let i=0;i<L-14;i+=5){px(x,'#2a7a3a',X+6+i,b-32,3,2);px(x,['#ff3a5a','#ffcf3a','#ff7ab0'][i%3],X+7+i,b-33);}
   px(x,'#120818',X+L-10,b-36,1,6);px(x,'#ffd25a',X+L-11,b-37,3,1);x.globalAlpha=.25;px(x,'#ffd25a',X+8,b-12,L-16,2);x.globalAlpha=1;};
  boat(18,92,'#1e3a2a','#6a4a2a');boat(542,88,'#2a2a5a','#3a5a3a');
  // arched canal bridge with bulb lights + bikes
  {const X0=124,X1=292,c='#5a2430',cx=(X0+X1)/2,rx=62,ry=14;
   px(x,c,X0,b-36,X1-X0,26);
   for(let X=X0+18;X<X1-18;X++){const d=1-((X-cx)/rx)**2;if(d<=0)continue;const top=Math.round(b-10-ry*Math.sqrt(d));px(x,'#0e0420',X,top,1,b-10-top);}
   for(let a=0;a<=24;a++){const t=Math.PI*a/24,X=Math.round(cx-Math.cos(t)*rx),Y=Math.round(b-10-Math.sin(t)*ry);px(x,'#ffd25a',X,Y-1);x.globalAlpha=.35;px(x,'#ffd25a',X,b-9+Math.round(Math.sin(t)*ry*0.6));x.globalAlpha=1;}
   px(x,'#7a3440',X0,b-36,X1-X0,2);for(let X=X0;X<X1;X+=9)px(x,'#3a1420',X,b-33,1,3);
   px(x,'#120818',X0,b-44,X1-X0,1);for(let X=X0;X<X1;X+=4)px(x,'#120818',X,b-44,1,8);
   const bc=['#ff3a5a','#2ee6ff','#ffcf3a','#e8e0f0','#7a5aff','#2aff8a'];for(let i=0;i<14;i++)bike(x,X0+14+i*10,b-36,bc[i%bc.length]);
   for(const lx of [X0+2,X1-4]){glow(x,'#ffd25a',lx+1,b-58,7,.18);px(x,'#120818',lx,b-56,2,20);px(x,'#120818',lx-2,b-60,6,4);px(x,'#ffd25a',lx-1,b-59,4,2);}}
  // tulip planter
  {const X=298;px(x,'#5a3a2a',X,b-16,40,6);px(x,'#7a4a2a',X,b-16,40,1);const tc=['#ff3a5a','#ffcf3a','#ff7ab0','#ff6a2a','#e8e0f0'];
   for(let i=0;i<13;i++){const tx=X+2+i*3;px(x,'#2a9a4a',tx,b-20,1,4);px(x,tc[i%tc.length],tx-1,b-22,3,2);px(x,tc[i%tc.length],tx-1,b-23);px(x,tc[i%tc.length],tx+1,b-23);}}
  // big red & white city letters
  bigText(x,'AMSTERDAM',344,b-22,2,['#e2263a','#f4f0f4'],'#2a0a1a',2);
  // tram
  {const X=430;px(x,'#3a3050',X-6,b-48,1,38);px(x,'#3a3050',X+100,b-48,1,38);px(x,'#120818',X-6,b-46,107,1);
   px(x,'#150a22',X-1,b-31,92,20);px(x,'#f4f4fa',X,b-30,90,18);px(x,'#1f4fb4',X,b-16,90,2);px(x,'#e2263a',X,b-14,90,1);
   px(x,'#1a2a4a',X+3,b-27,84,7);for(let i=0;i<10;i++)px(x,'#fff1b0',X+4+i*8,b-26,6,5);for(const d of [X+20,X+52])px(x,'#2a3a6a',d,b-27,6,13);
   px(x,'#9ad0ff',X+86,b-28,4,9);px(x,'#ffb020',X+86,b-30,4,2);text3(x,'5',X+87,b-29,'#120818');
   ln(x,'#120818',X+40,b-31,X+46,b-38);ln(x,'#120818',X+52,b-31,X+46,b-38);px(x,'#120818',X+42,b-46,8,1);ln(x,'#120818',X+46,b-38,X+46,b-45);
   for(const wx of [X+10,X+76])px(x,'#120818',wx,b-12,10,2);px(x,'#fff1b0',X+88,b-15,2,1);}
  // quay wall + parked bikes along the edge
  px(x,'#3a1a24',0,b-10,LW,10);px(x,'#6a3a3e',0,b-10,LW,1);for(let X=0;X<LW;X+=8)px(x,'#2a1018',X,b-9+((X/8|0)%2)*4,1,4);
  for(const X of [8,112,526,620]){px(x,'#120818',X,b-11,6,1);}
 },
 pool:['bike','post','stall','train','pigeon','bike']},
// =============================== MALLORCA ===============================
{id:'mallorca',name:'MALLORCA',sub:'All-inclusive on a budget',offs:{far:16},
 sky:[[0,'#1a8ad8'],[.6,'#5fd0ff'],[1,'#c8f6ff']],sun:{c:'#fff7c0',r:14,x:.82,y:.22},starsN:0,
 ground:{top:'#ffe7a8',a:'#f2cf86',b:'#e8c27a',line:'#d9ae66',type:'sand'},
 back(x,h){ridge(x,'#9ab8e0',h,40,[[2,16,0],[3,9,1],[7,5,2],[13,2,0]]);ridge(x,'#86a6d6',h,24,[[3,8,2],[5,5,0],[11,2,1]]);},
 far(x,h){const r=rng(52),b=h,S='#e6b874',SD='#c4924e',SL='#f8daa0',G='#8a5a2a';
  px(x,'#2a8ad0',0,b-14,LW,14);for(let i=0;i<80;i++)px(x,'#ffffff',r()*LW,b-13+r()*12,1+(r()*3|0),1);
  // old city wall (Dalt Murada)
  px(x,S,20,b-26,330,12);px(x,SD,20,b-16,330,2);for(let X=20;X<350;X+=5)px(x,S,X,b-28,3,2);for(let X=30;X<350;X+=40)px(x,SD,X,b-26,1,10);
  // Almudaina palace
  {const X=26;px(x,S,X,b-48,58,22);for(let k=0;k<58;k+=4)px(x,S,X+k,b-50,2,2);for(const tx of [X,X+50])px(x,SD,tx,b-56,8,30);
   px(x,S,X+22,b-62,12,14);for(let k=0;k<12;k+=3)px(x,S,X+22+k,b-64,2,2);for(let k=4;k<56;k+=7)px(x,'#7a4a2a',X+k,b-42,2,4);
   px(x,'#5a3a1a',X+28,b-74,1,10);px(x,'#ffcf3a',X+29,b-74,6,4);px(x,'#e2263a',X+29,b-73,6,1);px(x,'#e2263a',X+29,b-71,6,1);}
  // La Seu — Palma Cathedral: forest of pinnacled buttresses + rose window
  {const X=96,base=b-26,L=170;
   px(x,SD,X,base-24,L,24);px(x,S,X+6,base-56,L-24,32);px(x,SL,X+6,base-56,L-24,1);
   for(let k=8;k<L-22;k+=10){px(x,'#7a4a2a',X+k+3,base-50,2,14);px(x,'#7a4a2a',X+k+3,base-51,1,1);px(x,'#7a4a2a',X+k+3,base-18,2,10);}
   for(let k=2;k<=L-6;k+=10){px(x,SL,X+k,base-62,3,62);px(x,SD,X+k+2,base-62,1,62);spire(x,S,X+k+1,base-62,1,10);px(x,SL,X+k+1,base-73,1,1);
    ln(x,SD,X+k+1,base-48,X+k+6,base-56);px(x,SL,X+k,base-30,3,1);spire(x,S,X+k+1,base-30,1,4);}
   // west facade with octagonal turrets
   px(x,S,X-6,base-70,14,70);px(x,SD,X+4,base-70,4,70);for(const tx of [X-8,X+6]){px(x,SL,tx,base-74,4,74);spire(x,SL,tx+1,base-74,2,9);}
   half(x,'#7a4a2a',X+1,base-22,4);px(x,'#7a4a2a',X-3,base-22,9,22);
   // bell tower
   px(x,S,X+40,base-82,16,26);px(x,SL,X+40,base-82,16,1);for(let k=0;k<16;k+=4)px(x,S,X+40+k,base-84,2,2);px(x,'#7a4a2a',X+44,base-76,3,8);px(x,'#7a4a2a',X+50,base-76,3,8);
   // east end with the great rose window
   const E=X+L-20;px(x,S,E,base-74,24,74);px(x,SD,E+20,base-74,4,74);spire(x,S,E+12,base-74,12,12);for(const tx of [E-2,E+22]){px(x,SL,tx,base-80,4,80);spire(x,SL,tx+1,base-80,2,9);}
   disk(x,'#7a4a2a',E+12,base-56,8);const rc=['#ff5a9a','#2e8aff','#ffcf3a','#2aff8a'];for(let a=0;a<12;a++){const t=a/12*Math.PI*2;px(x,rc[a%4],E+12+Math.round(Math.cos(t)*5),base-56+Math.round(Math.sin(t)*5),1,1);ln(x,rc[(a+1)%4],E+12,base-56,E+12+Math.cos(t)*3,base-56+Math.sin(t)*3);}
   disk(x,'#ffcf3a',E+12,base-56,1);px(x,'#7a4a2a',E+8,base-38,8,14);}
  // seafront hotel
  {const X=362;px(x,'#f8f8ff',X,b-86,64,72);px(x,'#d8e0f0',X+54,b-86,10,72);for(let y=b-82;y<b-18;y+=6){px(x,'#2a6ab0',X+3,y,58,3);px(x,'#4ac0e0',X+2,y+3,60,1);}
   px(x,'#e2263a',X+10,b-94,44,8);text3(x,'HOTEL',X+22,b-93,'#ffffff');px(x,'#f8f8ff',X+18,b-16,28,2);}
  // windmill
  {const X=452;for(let i=0;i<30;i++){const w=Math.round(7-i*0.08);px(x,'#c8a070',X-w,b-14-i,w*2,1);}half(x,'#8a5a3a',X,b-44,6);px(x,'#7a4a2a',X-2,b-24,4,6);
   for(const a of [.6,2.17,3.74,5.31]){ln(x,'#5a3a1a',X,b-46,X+Math.cos(a)*20,b-46+Math.sin(a)*20);for(let t=6;t<20;t+=3)px(x,'#ffffff',X+Math.cos(a)*t+Math.cos(a+1.57)*2,b-46+Math.sin(a)*t+Math.sin(a+1.57)*2,2,2);}}
  // hillside village
  {ridge;for(let X=480;X<LW;X++){const y=Math.round(22+10*Math.sin((X-480)/160*Math.PI));px(x,'#7ab060',X,b-14-y,1,y);}
   for(const [X,yy] of [[492,20],[512,26],[534,30],[556,30],[578,26],[600,20],[620,14]]){px(x,'#fffaf0',X,b-14-yy-8,12,9);px(x,'#c85a3a',X-1,b-14-yy-10,14,2);px(x,'#4a7ab0',X+3,b-14-yy-5,2,3);px(x,'#4a7ab0',X+8,b-14-yy-5,2,3);}
   for(const X of [500,546,590,630]){const y=Math.round(22+10*Math.sin((X-480)/160*Math.PI));px(x,'#2a6a3a',X,b-14-y-14,3,14);px(x,'#2a6a3a',X+1,b-14-y-16,1,2);}}
 },
 mid(x,h){const r=rng(53),b=h;
  water(x,r,b-34,b-16,'#46c0f0','#1a7ac8',['#ffffff','#c8f6ff','#8ae0ff'],150);
  // yachts
  for(const [X,s] of [[110,1],[300,.8],[520,1.1]]){const L=Math.round(22*s);px(x,'#ffffff',X,b-26,L,3);px(x,'#1a4a8a',X,b-23,L,1);ln(x,'#e8e8f0',X+(L>>1),b-26,X+(L>>1),b-26-Math.round(26*s));
   for(let i=0;i<Math.round(22*s);i++)px(x,i%2?'#ffffff':'#f0f0ff',X+(L>>1)+1,b-27-i,Math.round((22*s-i)*0.45),1);}
  // foam + beach
  px(x,'#ffffff',0,b-17,LW,1);for(let X=0;X<LW;X+=5)px(x,'#ffffff',X+(r()*3|0),b-18,2,1);px(x,'#f6dc9a',0,b-16,LW,16);for(let i=0;i<200;i++)px(x,'#e8c27a',r()*LW,b-15+r()*15,1,1);
  // pool + deck
  {const X=372;px(x,'#ffffff',X,b-13,120,9);px(x,'#3ad0ff',X+2,b-12,116,6);for(let i=0;i<10;i++)px(x,'#c8f6ff',X+6+i*11,b-10+(i%2),5,1);px(x,'#2a9ad0',X+2,b-7,116,1);
   px(x,'#c8c8d8',X+110,b-18,1,7);px(x,'#c8c8d8',X+113,b-18,1,7);for(let k=0;k<3;k++)px(x,'#c8c8d8',X+110,b-17+k*2,4,1);}
  // palms
  for(const [X,L,lean] of [[40,62,6],[232,54,-5],[338,66,4],[600,58,-6]])palm(x,X,b-14,L,lean);
  // beach bar
  {const X=258;px(x,'#8a5a2a',X,b-30,3,16);px(x,'#8a5a2a',X+34,b-30,3,16);for(let i=0;i<8;i++)px(x,i%2?'#d8b060':'#c89a4a',X-4+i,b-36+i,45-i*2,1);px(x,'#c89a4a',X-4,b-34,45,4);
   px(x,'#a06a3a',X,b-22,37,8);px(x,'#7a4a2a',X,b-22,37,1);text3(x,'BAR',X+12,b-20,'#fff6d8');}
  // parasols + sunbeds
  for(const [X,c1,c2] of [[140,'#ff3a5a','#ffffff'],[176,'#ffcf3a','#2a8ad0'],[520,'#ff7a1a','#ffffff'],[556,'#2aff8a','#ffffff']]){px(x,'#e8e8f0',X,b-30,1,18);
   for(let i=0;i<6;i++)for(let k=-(10-i);k<=10-i;k++)px(x,((k+20)>>2)%2?c1:c2,X+k,b-36+i);px(x,'#ffffff',X+6,b-12,12,2);px(x,'#c8c8d8',X+6,b-10,1,2);px(x,'#c8c8d8',X+17,b-10,1,2);}
 },
 pool:['sunbed','stall','gull','suitcase','cone']}
];

function paintGround(st,w,h){const [c,x]=mk(w,h);const g=st.ground;px(x,g.a,0,0,w,h);
 const r=rng(st.id.length*97);
 if(g.type==='paving'){for(let y=3;y<h;y+=8)for(let X=((y/8|0)%2)*8;X<w;X+=16){px(x,g.b,X,y,15,7);px(x,g.line,X,y,15,1);}}
 else if(g.type==='road'){px(x,'#3a3950',0,0,w,4);for(let X=0;X<w;X+=32)px(x,g.line,X,14,16,2);for(let i=0;i<80;i++)px(x,g.b,r()*w,4+r()*h,1,1);}
 else if(g.type==='deck'){for(let y=3;y<h;y+=5){px(x,g.b,0,y,w,1);}for(let X=0;X<w;X+=24)px(x,g.b,X,3,1,h);px(x,g.line,0,4,w,1);}
 else if(g.type==='brick'){for(let y=3;y<h;y+=4)for(let X=((y/4|0)%2)*4;X<w;X+=8){px(x,(r()<.5?g.a:g.b),X,y,7,3);px(x,g.line,X+7,y,1,3);px(x,g.line,X,y+3,8,1);}}
 else if(g.type==='sand'){for(let i=0;i<300;i++)px(x,r()<.5?g.b:g.line,r()*w,3+r()*h,1,1);for(let i=0;i<4;i++){px(x,'#ffffff',r()*w,6+r()*20,2,1);}}
 px(x,g.top,0,0,w,2);px(x,K,0,2,w,1);
 // darken further down
 const grd=x.createLinearGradient(0,0,0,h);grd.addColorStop(0,'rgba(12,3,32,0)');grd.addColorStop(.35,'rgba(12,3,32,0)');grd.addColorStop(1,'rgba(12,3,32,.85)');x.fillStyle=grd;x.fillRect(0,3,w,h);
 return c;}

function paintSky(st,w,h){const [c,x]=mk(Math.max(1,Math.ceil(w)),Math.max(1,Math.ceil(h)));vgrad(x,c.width,h,st.sky);
 if(st.starsN)stars(x,c.width,h*.7,Math.round(st.starsN*c.width*h/(320*200)),st.id.length*13,'#d8c8ff');
 if(st.moon){const X=st.moon.x*c.width,Y=Math.min(st.moon.y*h,h*.4);disk(x,'#fff6d8',X,Y,8);disk(x,'#e8dcb0',X+2,Y-1,2);disk(x,'#e8dcb0',X-3,Y+3,1.5);x.globalAlpha=.12;disk(x,'#fff6d8',X,Y,14);x.globalAlpha=1;}
 if(st.sun){const s=st.sun,X=s.x*c.width,Y=s.y*h;x.globalAlpha=.18;disk(x,s.c,X,Y,s.r*1.8);x.globalAlpha=1;disk(x,s.c,X,Y,s.r);if(s.band){for(let i=0;i<5;i++)px(x,s.band,X-s.r,Y+s.r*0.15+i*4,s.r*2,1+(i>>1));}}
 return c;}

const CLOUD={liverpool:['#4a1f6e','#5e2a84'],coach:['#1a2350','#232e62'],ferry:['#ffb89a','#ffd8c4'],amsterdam:['#241a58','#2e2268'],mallorca:['#e8f6ff','#ffffff']};
function clouds(st){const h=70,[c,x]=mk(LW,h);const r=rng(st.id.length*97+7);const [lo,hi]=CLOUD[st.id]||['#3a2a5a','#4a3a6a'];
 for(let i=0;i<6;i++){const cx=(i*LW/6+r()*24)|0,cy=(14+r()*(h-30))|0,n=2+(r()*3|0),bw=7+(r()*4|0);
  for(let k=0;k<n;k++){const ox=cx+k*bw*0.8,rr=bw*0.6+r()*bw*0.4;disk(x,lo,ox,cy+2,rr);disk(x,lo,ox-LW,cy+2,rr);}
  for(let k=0;k<n;k++){const ox=cx+k*bw*0.8,rr=bw*0.6+r()*bw*0.3;disk(x,hi,ox-1,cy-1,rr*0.8);disk(x,hi,ox-1-LW,cy-1,rr*0.8);}
  {const L0=cx-bw*0.6|0,Lw=((n-1)*bw*0.8+bw*1.1)|0;px(x,lo,L0,cy+2,Lw,4);px(x,lo,L0-LW,cy+2,Lw,4);}}
 return c;}
function paintLayer(fn,h){const [c,x]=mk(LW,h);if(fn)fn(x,h);return c;}
// parallax stack per stage: [canvas, scroll speed, bottom offset above the ground line]
const LAYERS=[['back',120,.05,30],['far',150,.14,24],['mid',96,.42,0]];
window.STAGES={list:STAGES,LW,paintGround,paintSky,build(){for(const s of STAGES){s.layers=LAYERS.map(([k,h,sp,off])=>({c:paintLayer(s[k],h),sp,off:(s.offs&&s.offs[k]!=null)?s.offs[k]:off}));s.groundC=paintGround(s,128,160);s.cloudC=clouds(s);}}};
})();
