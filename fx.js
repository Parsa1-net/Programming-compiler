/* تم‌های زنده‌ی کدخانه: پس‌زمینه‌های متحرک روی canvas.
   سبک (حداکثر ۳۰ فریم در ثانیه)، در تب پنهان متوقف می‌شود، با «کاهش حرکت» سیستم فقط یک فریم ثابت می‌کشد و از تنظیمات قابل خاموش‌کردن است. */
const FX=(()=>{
 const cv=document.createElement('canvas');cv.id='fx';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
 const g=cv.getContext('2d'),RM=window.matchMedia?matchMedia('(prefers-reduced-motion:reduce)'):{matches:false},TAU=Math.PI*2,SC=['synthwave','constellation','aurora','crt','syntaxrain'],INIT={},DRAW={};
 let W=0,H=0,raf=0,scene='',S={},last=0,mx=-1e3,my=-1e3;
 const R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[(Math.random()*a.length)|0];
 const lite=()=>(navigator.hardwareConcurrency||4)<=2||!!(navigator.connection&&navigator.connection.saveData);
 const enabled=()=>localStorage.fx!=='off';
 function size(){const d=Math.min(window.devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=Math.round(W*d);cv.height=Math.round(H*d);cv.style.width=W+'px';cv.style.height=H+'px';g.setTransform(d,0,0,d,0,0);if(scene)INIT[scene]()}

 /* ۱) Synthwave: خورشید نئونی و شبکه‌ی در حال حرکت */
 INIT.synthwave=()=>{S={}};
 DRAW.synthwave=t=>{
  const hz=H*.56,sk=g.createLinearGradient(0,0,0,hz);sk.addColorStop(0,'#0d0220');sk.addColorStop(.7,'#3b0a57');sk.addColorStop(1,'#7a1fa2');g.fillStyle=sk;g.fillRect(0,0,W,hz);
  g.fillStyle='rgba(255,255,255,.65)';for(let i=0;i<40;i++)g.fillRect((i*97.3)%W,(i*53.7)%(hz*.7),1.2,1.2);
  const r=Math.min(W,H)*.2,cx=W/2,cy=hz-r*.35,sun=g.createLinearGradient(0,cy-r,0,cy+r);sun.addColorStop(0,'#ffe66d');sun.addColorStop(.5,'#ff5fa2');sun.addColorStop(1,'#a21caf');
  g.save();g.beginPath();g.rect(0,0,W,hz);g.clip();g.fillStyle=sun;g.beginPath();g.arc(cx,cy,r,0,TAU);g.fill();
  g.fillStyle='#3b0a57';for(let i=0;i<7;i++)g.fillRect(cx-r,cy+r*(.1+i*.13)+((t*.0004)%1)*r*.13,r*2,2+i*1.6);g.restore();
  const gr=g.createLinearGradient(0,hz,0,H);gr.addColorStop(0,'#2a0a45');gr.addColorStop(1,'#0b0216');g.fillStyle=gr;g.fillRect(0,hz,W,H-hz);
  g.strokeStyle='rgba(255,46,151,.65)';g.lineWidth=1.2;g.beginPath();
  for(let i=0;i<14;i++){const p=(i+(t*.0006)%1)/14,y=hz+(H-hz)*p*p;g.moveTo(0,y);g.lineTo(W,y)}
  for(let i=-14;i<=14;i++){g.moveTo(W/2+i*W*.012,hz);g.lineTo(W/2+i*W*.16,H)}
  g.stroke();g.strokeStyle='rgba(0,240,255,.55)';g.beginPath();g.moveTo(0,hz);g.lineTo(W,hz);g.stroke()};

 /* ۲) Constellation: شبکه‌ی گره‌ها و نمادهای کد که به موس واکنش نشان می‌دهند */
 INIT.constellation=()=>{
  const n=Math.min(lite()?40:90,Math.round(W*H/15000));
  S.p=Array.from({length:n},()=>({x:R(0,W),y:R(0,H),vx:R(-.25,.25),vy:R(-.25,.25)}));
  S.gl=Array.from({length:16},()=>({x:R(0,W),y:R(0,H),v:R(.1,.35),c:pick(['{','}','(',')',';','=>','</>','[]','&&','0x','fn','#']),a:R(.08,.22)}))};
 DRAW.constellation=()=>{
  g.fillStyle='#060c1c';g.fillRect(0,0,W,H);g.font='16px "Courier New",monospace';
  for(const q of S.gl){q.y-=q.v;if(q.y<-20){q.y=H+20;q.x=R(0,W)}g.fillStyle='rgba(120,170,255,'+q.a+')';g.fillText(q.c,q.x,q.y)}
  const P=S.p;g.lineWidth=1;
  for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dx=p.x-mx,dy=p.y-my;if(dx*dx+dy*dy<14400){p.x+=dx*.003;p.y+=dy*.003}}
  for(let i=0;i<P.length;i++){
   for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<16900){g.strokeStyle='rgba(90,150,255,'+.5*(1-d/16900)+')';g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}}
   const dx=P[i].x-mx,dy=P[i].y-my,d=dx*dx+dy*dy;if(d<22500){g.strokeStyle='rgba(160,210,255,'+.7*(1-d/22500)+')';g.beginPath();g.moveTo(P[i].x,P[i].y);g.lineTo(mx,my);g.stroke()}}
  g.fillStyle='#8ab4ff';for(const p of P){g.beginPath();g.arc(p.x,p.y,1.8,0,TAU);g.fill()}};

 /* ۳) Aurora: شفق قطبی با ستون‌های باینری */
 const AC=['0,255,170','60,150,255','170,90,255','0,220,255'];
 INIT.aurora=()=>{S.st=Array.from({length:70},()=>({x:R(0,W),y:R(0,H*.8),r:R(.3,1.3),p:R(0,TAU)}));S.b=Array.from({length:Math.ceil(W/22)},()=>({y:R(-H,0),v:R(.3,.9),c:Math.random()<.5?'0':'1'}))};
 DRAW.aurora=t=>{
  const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#02070f');bg.addColorStop(1,'#06202a');g.fillStyle=bg;g.fillRect(0,0,W,H);
  for(const s of S.st){g.fillStyle='rgba(220,255,245,'+(.25+.25*Math.sin(t*.002+s.p))+')';g.fillRect(s.x,s.y,s.r,s.r)}
  g.save();g.globalCompositeOperation='lighter';
  for(let k=0;k<4;k++){
   g.beginPath();g.moveTo(0,H);
   for(let x=0;x<=W;x+=14)g.lineTo(x,H*(.32+.07*k)+Math.sin(x*.0042+t*.0005*(k+1)+k*1.7)*H*.07+Math.sin(x*.011-t*.0007)*H*.025);
   g.lineTo(W,H);g.closePath();const gr=g.createLinearGradient(0,H*.2,0,H*.85);gr.addColorStop(0,'rgba('+AC[k]+',.30)');gr.addColorStop(1,'rgba('+AC[k]+',0)');g.fillStyle=gr;g.fill()}
  g.restore();g.font='12px "Courier New",monospace';g.fillStyle='rgba(120,255,210,.16)';
  S.b.forEach((b,i)=>{b.y+=b.v;if(b.y>H+20){b.y=-R(20,H*.4);b.c=Math.random()<.5?'0':'1'}g.fillText(b.c,i*22,b.y)})};

 /* ۴) Amber CRT: ترمینال کهربایی که کد تایپ می‌کند */
 const CODE=['$ dotnet new console','def fib(n):','    return n if n < 2 else fib(n-1) + fib(n-2)','>>> print([fib(i) for i in range(10)])','[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]','#include <stdio.h>','int main(void) { puts("hello, world"); }','Console.WriteLine("Kodkhane");','const sum = a => a.reduce((x, y) => x + y, 0);','$ ./a.out && echo $?','fn main() { println!("ok"); }','git commit -m "ship it"','SELECT * FROM users WHERE id = 42;','for i in range(3): print(i)'];
 INIT.crt=()=>{S={lines:[''],li:0,ci:0,wait:0,lh:20}};
 DRAW.crt=(t,dt)=>{
  g.fillStyle='#0e0900';g.fillRect(0,0,W,H);S.wait-=dt;
  if(S.wait<=0){const src=CODE[S.li%CODE.length];
   if(S.ci<src.length){S.lines[S.lines.length-1]+=src[S.ci++];S.wait=R(15,70)}else{S.li++;S.ci=0;S.lines.push('');S.wait=R(200,600)}
   const max=Math.max(2,Math.floor(H/S.lh)-1);while(S.lines.length>max)S.lines.shift()}
  g.font='15px "Courier New",monospace';
  S.lines.forEach((l,i)=>{g.fillStyle='rgba(255,176,0,'+(.1+.32*(i/S.lines.length))+')';g.fillText(l+(i===S.lines.length-1&&((t>>9)&1)?'█':''),24,24+i*S.lh)})};

 /* ۵) Syntax Rain: توکن‌های رنگی کد که مثل باران می‌افتند */
 const TOK=[['async','#c084fc'],['await','#c084fc'],['def','#c084fc'],['class','#c084fc'],['fn','#c084fc'],['=>','#fdba74'],['"ok"','#fdba74'],["'hi'",'#fdba74'],['0x1F','#86efac'],['42','#86efac'],['3.14','#86efac'],['int','#67e8f9'],['String','#67e8f9'],['List<T>','#67e8f9'],['print()','#93c5fd'],['main()','#93c5fd'],['{}','#f9a8d4'],['&&','#f9a8d4'],['//','#6b7399'],['null','#fde68a'],['true','#fde68a']];
 INIT.syntaxrain=()=>{const n=Math.max(6,Math.floor(W/60));S.c=Array.from({length:n},(_,i)=>({x:(i+.5)*W/n,y:R(-H,0),v:R(.8,2.2),t:pick(TOK),sz:R(12,17)}));g.fillStyle='#0a0b14';g.fillRect(0,0,W,H)};
 DRAW.syntaxrain=()=>{
  g.fillStyle='rgba(10,11,20,.14)';g.fillRect(0,0,W,H);
  for(const c of S.c){g.font=c.sz+'px "Courier New",monospace';g.fillStyle=c.t[1];g.fillText(c.t[0],c.x,c.y);c.y+=c.v*(c.sz/2.5);if(c.y>H+30){c.y=-R(10,200);c.t=pick(TOK);c.v=R(.8,2.2)}}};

 /* موتور */
 function frame(t){raf=requestAnimationFrame(frame);const dt=t-last;if(dt<33)return;last=t;DRAW[scene](t,Math.min(dt,100))}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
 function set(theme){
  stop();scene=SC.includes(theme)&&enabled()?theme:'';
  if(!scene){cv.style.display='none';delete document.body.dataset.fx;return}
  document.body.dataset.fx='1';cv.style.display='block';size();
  if(RM.matches){DRAW[scene](0,16);return}
  last=0;raf=requestAnimationFrame(frame)}
 let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(scene){size();if(RM.matches)DRAW[scene](0,16)}},150)});
 addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(scene&&!RM.matches&&!raf){last=0;raf=requestAnimationFrame(frame)}});
 const cb=document.getElementById('fxon');
 if(cb){cb.checked=enabled();cb.onchange=()=>{localStorage.fx=cb.checked?'on':'off';set(document.documentElement.dataset.theme)}}
 return{set,scenes:SC,stop}
})();
{const FXT={fa:'پس‌زمینه‌های متحرک',en:'Animated backgrounds',ru:'Анимированные фоны',fr:'Arrière-plans animés',ar:'خلفيات متحركة',fil:'Mga animated na background',hi:'एनिमेटेड बैकग्राउंड',id:'Latar belakang animasi'};
 if(typeof I18N!=='undefined')for(const l in FXT)if(I18N[l])I18N[l].fxOn=FXT[l]}
