/* £99 Challenge — a SmokeRoach mini game. Pure canvas + WebAudio, no dependencies. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const cv=$('#game'),ctx=cv.getContext('2d',{alpha:false});
const S=SPR.build();STAGES.build();const ST=STAGES.list;
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:v;}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};

// ---------- characters (rotate every page load) ----------
const CHARS=[
 {id:'scott',name:'Scott',emoji:'🧢',spr:S.scott,box:{x:8,y:2,w:12,h:30},duck:{x:12,y:15,w:15,h:17},foot:31,
  quips:{start:['Right, £99… let’s go!','Budget’s set, la!'],coin:['Get in!','Boss that!','Sound!','Cheap as chips, la!','Made up!'],
   flight:['£9 flight?! GET IN!','Boss that!','Absolute bargain!'],train:['£260?! That’s robbery!','Do one, £260!','That’s robbery!'],
   bike:['Me bike!','Who left that there?!'],gull:['Ey! Get off!','Bloody seagulls!'],stall:['Tourist trap!','Rip-off, that!'],hit:['Ah, me budget!','That’s robbery!','Nah, nah, nah!'],
   stage:['Here we go!','Boss, this!','Made up we’re here!'],low:['We’re nearly skint!','Need some coins, quick!']}},
 {id:'charlotte',name:'Charlotte',emoji:'💖',spr:S.charlotte,box:{x:8,y:2,w:12,h:30},duck:{x:12,y:15,w:15,h:17},foot:31,
  quips:{start:['£99? Easy!','Let’s do this!'],coin:['Bargain!','Ooh, cheap!','Yesss!','Get in!','Love that!'],
   flight:['£9 flight! Scott, LOOK!','Bargain of the year!'],train:['£260?! Not a chance!','That’s robbery!'],
   bike:['Watch the bike!','Not again!'],gull:['Get away from me!','Ewww, seagull!'],stall:['Tourist trap, babe!','Not paying that!'],hit:['Ow! Me budget!','Not a chance!','Scott!!'],
   stage:['Ooh, look at this!','We’re here!'],low:['We’re nearly skint, babe!','Coins, quick!']}},
 {id:'gunner',name:'Gunner',emoji:'🐶',spr:S.gunner,box:{x:6,y:1,w:26,h:22},duck:{x:6,y:10,w:27,h:13},foot:22,dog:true,
  quips:{start:['Woof!','Bork!'],coin:['Woof!','Bork!','Arf!','*happy zoomies*','Wuff!'],flight:['BORK BORK!','*tail wag 100*'],
   train:['Grrr!','*growls at £260*'],bike:['Yelp!','Grrr!'],gull:['WOOF WOOF!','*chases seagull*'],stall:['Grrr!','Sniff… nope.'],hit:['Yelp!','*sad puppy eyes*','Awoo…'],
   stage:['Woof!','*sniffs new city*'],low:['Whimper…','*hungry eyes*']}}];
let ci=(parseInt(store.get('sr99_char','-1'),10)+1)%CHARS.length;if(isNaN(ci))ci=0;store.set('sr99_char',String(ci));
const forced=new URLSearchParams(location.search).get('as');if(forced){const f=CHARS.findIndex(c=>c.id===forced);if(f>=0)ci=f;}
const CH=CHARS[ci];
const DEMO=new URLSearchParams(location.search).has('demo');

// ---------- obstacle defs ----------
const OB={
 cone:{spr:()=>S.cone,dmg:5,q:'hit',hb:[2,2,8,13]},
 trainSign:{spr:()=>S.trainSign,dmg:20,q:'train',hb:[2,1,12,23]},
 train:{spr:()=>S.train,dmg:20,q:'train',air:true,hb:[1,1,24,12],fly:1.15},
 gull:{spr:t=>S.gull[Math.abs(t*8|0)%2],dmg:8,q:'gull',air:true,hb:[2,1,15,9],bob:true,fly:1.08},
 pigeon:{spr:t=>S.pigeon[Math.abs(t*9|0)%2],dmg:6,q:'gull',air:true,hb:[2,1,11,8],bob:true,fly:1.05},
 suitcase:{spr:()=>S.suitcase,dmg:8,q:'hit',hb:[1,1,14,18]},
 bike:{spr:t=>S.bike[0],dmg:12,q:'bike',hb:[2,2,24,15]},
 stall:{spr:()=>S.stall,dmg:15,q:'stall',hb:[2,6,22,18]},
 bollard:{spr:()=>S.bollard,dmg:5,q:'hit',hb:[1,1,8,13]},
 post:{spr:()=>S.post,dmg:5,q:'hit',hb:[2,1,4,15]},
 sunbed:{spr:()=>S.sunbed,dmg:6,q:'hit',hb:[1,1,26,10]}};

// ---------- canvas sizing ----------
let DPR=1,CW=0,CH_=0,P=4,W=200,H=200,GY=150,PX=40;
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);const w=innerWidth,h=innerHeight;CW=Math.round(w*DPR);CH_=Math.round(h*DPR);
 cv.width=CW;cv.height=CH_;cv.style.width=w+'px';cv.style.height=h+'px';
 const tall=CH_>CW*1.3;P=Math.max(2,Math.round(Math.min(CW/(tall?170:215),CH_/195)));W=CW/P;H=CH_/P;
 const portrait=H>W*1.15;GY=Math.round(portrait?H*0.68:H-Math.max(34,H*0.2));PX=Math.round(Math.min(Math.max(W*0.2,34),90));
 for(const s of ST)s.skyC=STAGES.paintSky(s,W,GY);ctx.imageSmoothingEnabled=false;}
addEventListener('resize',resize);resize();

// ---------- audio ----------
const AU={ctx:null,master:null,muted:store.get('sr99_mute','0')==='1',musicOn:true,next:0,step:0,timer:null};
function audioInit(){if(AU.ctx)return;try{const A=window.AudioContext||window.webkitAudioContext;AU.ctx=new A();AU.master=AU.ctx.createGain();AU.master.gain.value=AU.muted?0:0.5;AU.master.connect(AU.ctx.destination);
 AU.music=AU.ctx.createGain();AU.music.gain.value=0.22;AU.music.connect(AU.master);
 const nb=AU.ctx.createBuffer(1,AU.ctx.sampleRate*0.4,AU.ctx.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=nb;}catch(e){}}
function tone(f,dur,type,vol,slide,when,dest){if(!AU.ctx)return;const t=(when||AU.ctx.currentTime);const o=AU.ctx.createOscillator(),g=AU.ctx.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.2,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(dest||AU.master);o.start(t);o.stop(t+dur+0.02);}
function noise(dur,vol,freq){if(!AU.ctx)return;const t=AU.ctx.currentTime,s=AU.ctx.createBufferSource(),f=AU.ctx.createBiquadFilter(),g=AU.ctx.createGain();s.buffer=AU.noise;f.type='lowpass';f.frequency.value=freq||1200;g.gain.setValueAtTime(vol||0.3,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(AU.master);s.start(t);s.stop(t+dur);}
const SFX={
 jump(){tone(CH.dog?520:330,0.16,'square',0.12,CH.dog?900:660);},
 coin(n){const b=988*Math.pow(1.03,Math.min(n||0,12));tone(b,0.07,'square',0.09);tone(b*1.335,0.14,'square',0.09,0,AU.ctx&&AU.ctx.currentTime+0.06);},
 flight(){if(!AU.ctx)return;const t=AU.ctx.currentTime;[523,659,784,1047,1319].forEach((f,i)=>tone(f,0.12,'square',0.1,0,t+i*0.06));},
 hit(){noise(0.25,0.35,900);tone(180,0.25,'sawtooth',0.15,60);},
 bark(){tone(420,0.08,'sawtooth',0.15,260);setTimeout(()=>tone(380,0.1,'sawtooth',0.13,220),110);},
 land(){noise(0.06,0.12,500);},
 over(){if(!AU.ctx)return;const t=AU.ctx.currentTime;[392,330,262,196].forEach((f,i)=>tone(f,0.22,'triangle',0.2,0,t+i*0.17));},
 stage(){if(!AU.ctx)return;const t=AU.ctx.currentTime;[523,784,659,1047].forEach((f,i)=>tone(f,0.14,'square',0.08,0,t+i*0.09));},
 click(){tone(660,0.05,'square',0.06);}};
// tiny chiptune loop (A minor-ish, upbeat)
const BASS=[45,45,57,45,43,43,55,43,41,41,53,41,43,43,55,47];
const LEAD=[69,0,72,74,76,0,74,72,69,0,67,69,72,0,0,0,69,0,72,74,76,79,76,74,72,0,74,72,69,0,0,0];
function mtof(m){return 440*Math.pow(2,(m-69)/12);}
function musicTick(){if(!AU.ctx||!AU.musicOn||state!=='play'){return;}const spb=60/150/2;while(AU.next<AU.ctx.currentTime+0.15){const i=AU.step;
  const b=BASS[i%16];tone(mtof(b),spb*0.9,'triangle',0.35,0,AU.next,AU.music);
  const l=LEAD[i%32];if(l)tone(mtof(l),spb*0.8,'square',0.12,0,AU.next,AU.music);
  if(i%4===2){const t=AU.next,s=AU.ctx.createBufferSource(),f=AU.ctx.createBiquadFilter(),g=AU.ctx.createGain();s.buffer=AU.noise;f.type='highpass';f.frequency.value=6000;g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.05);s.connect(f);f.connect(g);g.connect(AU.music);s.start(t);s.stop(t+0.06);}
  AU.next+=spb;AU.step++;}}
function setMute(m){AU.muted=m;store.set('sr99_mute',m?'1':'0');if(AU.master)AU.master.gain.value=m?0:0.5;document.querySelectorAll('.mute').forEach(b=>{b.setAttribute('aria-pressed',m?'true':'false');b.textContent=m?'🔇':'🔊';b.title=m?'Sound off':'Sound on';});}
setMute(AU.muted);

// ---------- game state ----------
let state='title',T=0,speed=0,dist=0,score=0,budget=99,coins=0,flights=0,stageI=0,prevStage=-1,fade=1,drainAcc=0,camX=0,shake=0,flash=0,best=parseInt(store.get('sr99_best','0'),10)||0;
const pl={y:0,vy:0,ground:true,duck:false,duckHeld:false,inv:0,coyote:0,buffer:0,anim:0,hold:false,landT:0};
let obs=[],items=[],parts=[],floats=[],bubble=null,quipCd=0,nextGap=0,sinceSpawn=0,coinStreak=0,lowWarned=false;
function sf(){return Math.min(1,Math.max(0.7,W/300));}
function reset(){T=0;speed=0;dist=0;score=0;budget=99;coins=0;flights=0;stageI=0;prevStage=-1;fade=1;drainAcc=0;shake=0;flash=0;obs=[];items=[];parts=[];floats=[];bubble=null;quipCd=0;nextGap=140;sinceSpawn=0;coinStreak=0;lowWarned=false;
 Object.assign(pl,{y:0,vy:0,ground:true,duck:false,duckHeld:false,inv:0,coyote:0,buffer:0,anim:0,hold:false});}
function clearance(){return CH.duck.h+(CH.dog?2:4);}
function curSpeed(){return (118+Math.min(170,T*2.6))*sf();}

// ---------- quips ----------
function quip(kind,force){if(!force&&quipCd>0)return;const list=CH.quips[kind];if(!list)return;const s=list[Math.random()*list.length|0];bubble={s,t:1.5};quipCd=force?1.2:2.8;if(CH.dog&&/woof|bork|grr|arf|wuff|yelp/i.test(s))SFX.bark();}

// ---------- spawning ----------
function spawn(){const st=ST[stageI%ST.length];let pool=st.pool;if(T<6)pool=pool.filter(k=>!OB[k].air);
 const k=pool[Math.random()*pool.length|0],d=OB[k],spr=d.spr(0);const o={k,d,x:W+20,w:spr.width,h:spr.height,t:Math.random()*5};
 if(d.air){o.y=GY-clearance()-spr.height+ (d.hb?0:0);}else o.y=GY-spr.height+1;obs.push(o);
 // coins: an arc over ground obstacles (shows the jump), a low line under air ones
 const r=Math.random();
 if(!d.air&&r<.55){const n=5;for(let i=0;i<n;i++){const f=i/(n-1);items.push({k:'coin',x:o.x+o.w/2-36+f*72,y:GY-20-Math.sin(f*Math.PI)*34,t:i*.1});}}
 else if(d.air&&r<.6){for(let i=0;i<4;i++)items.push({k:'coin',x:o.x-6+i*12,y:GY-10,t:i*.1});}
 if(Math.random()<.11&&T>4){items.push({k:'flight',x:o.x+o.w+70,y:GY-58,t:0});}
 const spd=curSpeed();nextGap=spd*0.95+40+Math.random()*spd*0.9;
 if(Math.random()<.35&&!d.air){// bonus coin row in the gap
  const gx=o.x+o.w+nextGap*0.45;for(let i=0;i<3;i++)items.push({k:'coin',x:gx+i*12,y:GY-10,t:i*.1});}}

// ---------- particles ----------
function burst(x,y,n,cols,sp,up,life,size){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=sp*(0.4+Math.random()*0.8);parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(up||0),l:life||0.6,m:life||0.6,c:cols[i%cols.length],s:size||1+(Math.random()*2|0),g:300});}}
function floatText(x,y,s,c){floats.push({x,y,s,c,t:1});}

// ---------- input ----------
function jumpPress(){if(state!=='play')return;pl.buffer=0.13;pl.hold=true;}
function jumpRelease(){pl.hold=false;}
function duckOn(){if(state!=='play')return;pl.duckHeld=true;if(!pl.ground)pl.vy=Math.max(pl.vy,420);}
function duckOff(){pl.duckHeld=false;}
addEventListener('keydown',e=>{if(e.repeat&&(e.code==='Space'||e.code==='ArrowUp'))return;
 if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(state==='title'||state==='over'){if(!document.activeElement||!document.activeElement.matches('button,a'))start();}else if(state==='paused')resume();else jumpPress();}
 else if(['ArrowDown','KeyS'].includes(e.code)){e.preventDefault();duckOn();}
 else if(e.code==='KeyM')setMute(!AU.muted);
 else if(e.code==='KeyP'||e.code==='Escape'){if(state==='play')pause();else if(state==='paused')resume();}
 else if(e.code==='Enter'&&(state==='title')){start();}});
addEventListener('keyup',e=>{if(['Space','ArrowUp','KeyW'].includes(e.code))jumpRelease();if(['ArrowDown','KeyS'].includes(e.code))duckOff();});
const pad=$('#stage');let tStart=null;
pad.addEventListener('touchstart',e=>{if(e.target.closest('button,a,.overlay'))return;e.preventDefault();audioInit();const t=e.changedTouches[0];tStart={x:t.clientX,y:t.clientY,time:performance.now(),ducked:false,y0:pl.y};jumpPress();},{passive:false});
pad.addEventListener('touchmove',e=>{if(!tStart)return;e.preventDefault();const t=e.changedTouches[0];const dy=t.clientY-tStart.y;
 if(dy>22&&!tStart.ducked){tStart.ducked=true;// swipe down: cancel a just-started jump and duck instead
  if(performance.now()-tStart.time<220&&pl.y>-16&&pl.vy<0){pl.y=0;pl.vy=0;pl.ground=true;}pl.buffer=0;duckOn();}},{passive:false});
const tEnd=e=>{if(!tStart)return;e.preventDefault();tStart=null;jumpRelease();duckOff();};
pad.addEventListener('touchend',tEnd,{passive:false});pad.addEventListener('touchcancel',tEnd,{passive:false});
pad.addEventListener('mousedown',e=>{if(e.target.closest('button,a,.overlay'))return;audioInit();jumpPress();});
addEventListener('mouseup',jumpRelease);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pause();});

// ---------- UI ----------
const ui={title:$('#title'),over:$('#over'),pause:$('#paused'),hud:$('#hud'),budget:$('#hud-budget'),bar:$('#hud-bar'),score:$('#hud-score'),dist:$('#hud-dist'),banner:$('#banner'),toast:$('#toast')};
function show(el,on){el.classList.toggle('show',on);el.setAttribute('aria-hidden',on?'false':'true');}
$('#who').textContent=CH.name+' '+CH.emoji;
$('#who-next').textContent=CHARS[(ci+1)%CHARS.length].name;
$('#best').textContent=best.toLocaleString('en-GB');
document.body.dataset.char=CH.id;
function start(){audioInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume();reset();state='play';show(ui.title,false);show(ui.over,false);show(ui.pause,false);ui.hud.classList.add('show');
 if(AU.ctx){AU.next=AU.ctx.currentTime+0.05;AU.step=0;}SFX.stage();banner(ST[0].name,ST[0].sub);setTimeout(()=>quip('start',true),400);}
function pause(){if(state!=='play')return;state='paused';show(ui.pause,true);}
function resume(){if(state!=='paused')return;state='play';show(ui.pause,false);last=performance.now();if(AU.ctx)AU.next=AU.ctx.currentTime+0.05;}
function gameOver(){state='over';SFX.over();ui.hud.classList.remove('show');const nb=score>best;if(nb){best=score;store.set('sr99_best',String(best));}
 $('#o-score').textContent=score.toLocaleString('en-GB');$('#o-dist').textContent=Math.floor(dist)+'m';$('#o-coins').textContent=coins;$('#o-best').textContent=best.toLocaleString('en-GB');
 $('#o-where').textContent=titleCase(ST[stageI%ST.length].name);$('#o-new').hidden=!nb;$('#best').textContent=best.toLocaleString('en-GB');
 $('#o-line').textContent=CH.dog?'Gunner’s spent all the treat money! 🐶':(CH.id==='charlotte'?'Charlotte’s gone skint!':'Scott’s gone skint!');
 setTimeout(()=>{show(ui.over,true);$('#again').focus({preventScroll:true});},650);}
function titleCase(s){return s.toLowerCase().replace(/(^|\s)\S/g,m=>m.toUpperCase());}
let bannerT=null;function banner(a,b){ui.banner.innerHTML='<b></b><span></span>';ui.banner.firstChild.textContent=a;ui.banner.lastChild.textContent=b;ui.banner.classList.remove('show');void ui.banner.offsetWidth;ui.banner.classList.add('show');clearTimeout(bannerT);bannerT=setTimeout(()=>ui.banner.classList.remove('show'),2400);}
function toast(s){ui.toast.textContent=s;ui.toast.classList.add('show');setTimeout(()=>ui.toast.classList.remove('show'),2200);}
$('#play').addEventListener('click',()=>{SFX.click();start();});
$('#again').addEventListener('click',()=>{SFX.click();start();});
$('#resume').addEventListener('click',resume);
$('#btn-pause').addEventListener('click',()=>{state==='play'?pause():resume();});
document.querySelectorAll('.mute').forEach(b=>b.addEventListener('click',()=>{audioInit();setMute(!AU.muted);}));
$('#share').addEventListener('click',async()=>{const url='https://smokeroach.github.io/game/';const text=`I scored ${score.toLocaleString('en-GB')} playing as ${CH.name} in the SmokeRoach £99 Challenge game! Can you beat it?`;
 if(navigator.share){try{await navigator.share({title:'£99 Challenge | SmokeRoach',text,url});return;}catch(e){if(e&&e.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(text+' '+url);toast('Link copied! Paste it anywhere 📋');}catch(e){const ta=document.createElement('textarea');ta.value=text+' '+url;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Link copied! 📋');}catch(_){toast(url);}ta.remove();}});
$('#hint').textContent=matchMedia('(pointer:coarse)').matches?'Tap to jump · Hold to jump higher · Swipe down to duck':'Space / ↑ to jump · ↓ to duck · M mute · P pause';

// ---------- update ----------
function hitbox(){const b=pl.duck?CH.duck:CH.box;const top=GY-CH.foot-1+pl.y;return {x:PX+b.x+2,y:top+b.y+2,w:b.w-4,h:b.h-4};}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function update(dt){T+=dt;quipCd-=dt;if(bubble){bubble.t-=dt;if(bubble.t<=0)bubble=null;}
 speed=curSpeed();const move=speed*dt;camX+=move;dist+=move/8;
 // stage progression every 450m
 const si=Math.floor(dist/450);if(si!==stageI){prevStage=stageI;stageI=si;fade=0;const st=ST[si%ST.length];banner(si>=ST.length&&si%ST.length===0?'BACK IN LIVERPOOL':st.name,si>=ST.length?'Lap '+(Math.floor(si/ST.length)+1)+' · faster!':st.sub);SFX.stage();quip('stage',true);budget=Math.min(99,budget+10);floatText(PX+10,GY-46,'+£10 stage bonus','#7cff3a');}
 if(fade<1)fade=Math.min(1,fade+dt/1.4);
 // budget drains as you travel
 drainAcc+=dt*(0.75+0.08*stageI);while(drainAcc>=1){drainAcc-=1;budget-=1;}
 // player physics
 pl.anim+=dt*(speed/120)*(CH.dog?14:12);
 if(pl.ground)pl.coyote=0.09;else pl.coyote-=dt;pl.buffer-=dt;
 if(pl.buffer>0&&pl.coyote>0&&!pl.duckHeld){pl.vy=CH.dog?-430:-420;pl.ground=false;pl.coyote=0;pl.buffer=0;SFX.jump();burst(PX+12,GY,5,['#ffffff','#c3b5e6'],40,10,0.35,1);}
 if(!pl.ground){const g=(pl.vy<0&&pl.hold)?1150:1900;pl.vy+=g*dt;pl.y+=pl.vy*dt;if(pl.y>=0){pl.y=0;pl.vy=0;pl.ground=true;SFX.land();burst(PX+10,GY,6,['#ffffff','#c3b5e6'],50,15,0.35,1);}}
 pl.duck=pl.duckHeld&&pl.ground;if(pl.inv>0)pl.inv-=dt;
 if(pl.ground&&Math.random()<dt*10)parts.push({x:PX+4,y:GY-1,vx:-speed*0.3,vy:-10-Math.random()*15,l:.35,m:.35,c:'rgba(255,255,255,.6)',s:1,g:0});
 // spawn
 sinceSpawn+=move;if(sinceSpawn>=nextGap){sinceSpawn=0;spawn();}
 const hb=hitbox();
 for(const o of obs){o.t+=dt;o.x-=move*(o.d.fly||1);if(o.d.bob)o.yy=-Math.abs(Math.sin(o.t*3))*4;else o.yy=0;
  if(!o.hit&&pl.inv<=0){const h=o.d.hb;const ob={x:o.x+h[0],y:o.y+o.yy+h[1],w:h[2],h:h[3]};if(overlap(hb,ob)){o.hit=true;damage(o);}}
  if(!o.passed&&o.x+o.w<PX){o.passed=true;if(!o.hit){score+=15;}}}
 obs=obs.filter(o=>o.x>-60);
 for(const it of items){it.t+=dt;it.x-=move;if(!it.got){const b=it.k==='coin'?{x:it.x-1,y:it.y-1,w:11,h:11}:{x:it.x,y:it.y,w:18,h:12};if(overlap(hb,{x:b.x-3,y:b.y-3,w:b.w+6,h:b.h+6})){it.got=true;collect(it);}}}
 items=items.filter(i=>i.x>-30&&!i.got);
 for(const p of parts){p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;}parts=parts.filter(p=>p.l>0);
 for(const f of floats){f.t-=dt*0.9;f.y-=dt*22;}floats=floats.filter(f=>f.t>0);
 shake=Math.max(0,shake-dt*30);flash=Math.max(0,flash-dt*3);
 score+=Math.round(move/8);
 if(budget<=15&&!lowWarned){lowWarned=true;quip('low',true);}if(budget>25)lowWarned=false;
 if(budget<=0){budget=0;gameOver();}
 if(DEMO)autopilot();}
function damage(o){budget-=o.d.dmg;pl.inv=1.3;shake=8;flash=1;coinStreak=0;SFX.hit();quip(o.d.q==='hit'?'hit':o.d.q,true);
 const hb=hitbox();floatText(hb.x+hb.w/2,hb.y-4,'-£'+o.d.dmg,'#ff2d55');burst(hb.x+hb.w/2,hb.y+hb.h/2,14,['#7cff3a','#4ac21a','#ffd60a'],120,60,0.8,2);}
function collect(it){if(it.k==='coin'){coins++;coinStreak++;budget=Math.min(99,budget+1);score+=10;SFX.coin(coinStreak%13);burst(it.x+4,it.y+4,6,['#ffd60a','#fff6b0'],60,20,0.4,1);floatText(it.x+4,it.y-2,'+£1','#ffd60a');if(coinStreak%8===0)quip('coin');}
 else{flights++;budget=Math.min(99,budget+10);score+=100;SFX.flight();quip('flight',true);burst(it.x+9,it.y+6,22,['#2ee6ff','#ff2bd6','#ffffff','#ffd60a'],140,40,0.9,2);floatText(it.x+9,it.y-4,'+£10 cheap flight!','#2ee6ff');}}
function autopilot(){const hb=hitbox();let threat=null;for(const o of obs){if(o.hit)continue;const dx=o.x-(hb.x+hb.w);if(dx>-o.w&&dx<speed*0.32){threat=o;break;}}
 if(threat&&threat.d.air){pl.duckHeld=true;}else{pl.duckHeld=false;if(threat&&pl.ground)pl.buffer=0.05,pl.hold=true;else if(!threat)pl.hold=false;}}

// ---------- render ----------
function drawStage(st,alpha){ctx.globalAlpha=alpha;ctx.drawImage(st.skyC,0,0,st.skyC.width,st.skyC.height,0,0,W,GY+1);
 const LW=STAGES.LW;const gr=st.groundC;
 const cl=st.cloudC;if(cl){const cy=Math.max(2,GY*0.34-cl.height/2);ctx.globalAlpha=alpha*0.75;let o=-((camX*0.05+performance.now()*0.004)%LW);for(let x=o;x<W;x+=LW)ctx.drawImage(cl,Math.round(x),Math.round(cy));ctx.globalAlpha=alpha;}
 for(const L of st.layers){const c=L.c,y=Math.round(GY-L.off-c.height);let o=-((camX*L.sp)%LW);for(let x=o;x<W;x+=LW)ctx.drawImage(c,Math.round(x),y);}
 let ox; ox=-(camX%gr.width);for(let x=ox;x<W;x+=gr.width)ctx.drawImage(gr,Math.round(x),GY);
 if(H-GY>gr.height){ctx.fillStyle='#0c0320';ctx.fillRect(0,GY+gr.height,W,H-GY-gr.height+1);}
 ctx.globalAlpha=1;}
function frameFor(){const s=CH.spr;if(state==='title')return s.idle[(T*3|0)%2]?s.run[(pl.anim|0)%s.run.length]:s.run[(pl.anim|0)%s.run.length];
 if(state==='over')return s.hurt[0];if(pl.inv>1.0)return s.hurt[0];
 if(!pl.ground)return pl.vy<0?s.jump[0]:s.fall[0];if(pl.duck)return s.duck[(pl.anim|0)%s.duck.length];return s.run[(pl.anim|0)%s.run.length];}
let last=performance.now(),acc=0;
function render(){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0c0320';ctx.fillRect(0,0,CW,CH_);
 const sx=shake?(Math.random()-.5)*shake:0,sy=shake?(Math.random()-.5)*shake:0;
 ctx.setTransform(P,0,0,P,Math.round(sx*DPR),Math.round(sy*DPR));ctx.imageSmoothingEnabled=false;
 const cur=ST[stageI%ST.length];if(fade<1&&prevStage>=0){drawStage(ST[prevStage%ST.length],1);drawStage(cur,fade);}else drawStage(cur,1);
 // items
 for(const it of items){if(it.k==='coin'){const f=S.coin[Math.abs(it.t*8|0)%4];ctx.drawImage(f,Math.round(it.x),Math.round(it.y+Math.sin(it.t*4)*1.5));}
  else{const yy=Math.round(it.y+Math.sin(it.t*3)*3);ctx.globalAlpha=.35+.25*Math.sin(it.t*8);ctx.fillStyle='#2ee6ff';ctx.fillRect(Math.round(it.x)-2,yy-2,22,16);ctx.globalAlpha=1;ctx.drawImage(S.flight,Math.round(it.x),yy);}}
 // obstacles (with ground shadow)
 for(const o of obs){const spr=o.d.spr(o.t);if(!o.d.air){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(Math.round(o.x)+2,GY,o.w-4,2);}
  else{ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(Math.round(o.x)+4,GY,o.w-8,1);}
  ctx.globalAlpha=o.hit?.55:1;ctx.drawImage(spr,Math.round(o.x),Math.round(o.y+(o.yy||0)));ctx.globalAlpha=1;}
 // player
 const f=frameFor();const shw=Math.max(6,16+pl.y*0.15);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(Math.round(PX+(CH.dog?17:14)-shw/2),GY,Math.round(shw),2);
 if(f){const blink=state==='play'&&pl.inv>0&&((pl.inv*14|0)%2===0);ctx.globalAlpha=blink?.55:1;ctx.drawImage(f,PX,Math.round(GY-CH.foot-1+pl.y));ctx.globalAlpha=1;}
 // particles
 for(const p of parts){ctx.globalAlpha=Math.max(0,p.l/p.m);ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x),Math.round(p.y),p.s,p.s);}ctx.globalAlpha=1;
 // native-res text layer
 ctx.setTransform(1,0,0,1,0,0);const u=DPR*Math.min(1.35,Math.max(0.95,Math.min(innerWidth,innerHeight)/420));
 for(const t of floats){ctx.globalAlpha=Math.min(1,t.t*2);ctx.font=`800 ${Math.round(13*u)}px Outfit, system-ui, sans-serif`;ctx.textAlign='center';ctx.lineWidth=4*DPR;ctx.strokeStyle='#150a22';ctx.strokeText(t.s,t.x*P,t.y*P);ctx.fillStyle=t.c;ctx.fillText(t.s,t.x*P,t.y*P);}ctx.globalAlpha=1;
 if(bubble&&state!=='title')drawBubble(bubble.s,(PX+16)*P,(GY-CH.box.h-6+pl.y)*P,u,Math.min(1,bubble.t*5));
 if(flash>0){ctx.fillStyle=`rgba(255,45,85,${flash*0.28})`;ctx.fillRect(0,0,CW,CH_);}
 // vignette for depth
 ctx.drawImage(vig,0,0,CW,CH_);}
let vig;function makeVig(){const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,128,60,128,128,182);g.addColorStop(0,'rgba(12,3,32,0)');g.addColorStop(1,'rgba(12,3,32,.55)');x.fillStyle=g;x.fillRect(0,0,256,256);vig=c;}makeVig();
function drawBubble(s,x,y,u,a){ctx.globalAlpha=a;ctx.font=`800 ${Math.round(14*u)}px Outfit, system-ui, sans-serif`;ctx.textAlign='left';const tw=ctx.measureText(s).width,pd=9*u,h=26*u;let bx=Math.max(6*DPR,Math.min(CW-tw-pd*2-6*DPR,x-12*u)),by=y-h-10*u;
 ctx.fillStyle='#150a22';rr(bx-2*DPR,by-2*DPR,tw+pd*2+4*DPR,h+4*DPR,10*u);ctx.fill();ctx.beginPath();ctx.moveTo(x-2*u,by+h);ctx.lineTo(x+14*u,by+h);ctx.lineTo(x+1*u,by+h+12*u);ctx.closePath();ctx.fill();
 ctx.fillStyle='#ffffff';rr(bx,by,tw+pd*2,h,9*u);ctx.fill();ctx.beginPath();ctx.moveTo(x+1*u,by+h-1);ctx.lineTo(x+10*u,by+h-1);ctx.lineTo(x+2.5*u,by+h+7*u);ctx.closePath();ctx.fill();
 ctx.fillStyle='#150a22';ctx.textBaseline='middle';ctx.fillText(s,bx+pd,by+h/2+1);ctx.textBaseline='alphabetic';ctx.globalAlpha=1;}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
let hudCache='';function hud(){const b=Math.max(0,Math.ceil(budget));const key=b+'|'+score+'|'+Math.floor(dist);if(key===hudCache)return;hudCache=key;
 ui.budget.textContent='£'+b;ui.bar.style.transform=`scaleX(${b/99})`;ui.bar.dataset.lvl=b>50?'ok':b>20?'mid':'low';ui.score.textContent=score.toLocaleString('en-GB');ui.dist.textContent=Math.floor(dist)+'m';}
function loop(now){let dt=(now-last)/1000;last=now;if(!(dt>0))dt=0;if(dt>0.1)dt=0.1;
 if(state==='play'){update(dt);musicTick();hud();}
 else if(state==='title'){T+=dt;camX+=40*dt*sf();pl.anim+=dt*8;}
 else if(state==='over'){if(pl.y<0){pl.vy+=1900*dt;pl.y=Math.min(0,pl.y+pl.vy*dt);}shake=Math.max(0,shake-dt*30);flash=Math.max(0,flash-dt*3);for(const p of parts){p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;}parts=parts.filter(p=>p.l>0);if(fade<1)fade=Math.min(1,fade+dt/1.4);}
 render();requestAnimationFrame(loop);}
(document.fonts&&document.fonts.load?Promise.all([document.fonts.load('800 16px Outfit'),document.fonts.load('16px Anton')]).catch(()=>{}):Promise.resolve()).then(()=>document.body.classList.add('ready'));
requestAnimationFrame(loop);
window.SR99={get state(){return state;},get score(){return score;},get budget(){return budget;},start,char:CH.id,setBudget(v){budget=v;},warp(m){dist=m;},demo:DEMO};
if(DEMO)setTimeout(start,300);
})();
