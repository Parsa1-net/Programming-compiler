'use strict';
const $=id=>document.getElementById(id),ls=localStorage;

/* ---------- زبان‌ها و نمونه کد ---------- */
const LANGS={
 python:{n:'main.py',v:'Python 3.12',s:['# numpy و pandas هم با import خودکار نصب می‌شوند','name = input("اسمت؟ ") or "دنیا"','print(f"سلام {name}!")','squares = [n * n for n in range(1, 6)]','print(squares, sum(squares))',''].join('\n')},
 c:{n:'main.c',v:'C (GCC 9)',id:50,o:'-O2',s:['#include <stdio.h>','','int main(void) {','    int n;','    printf("یک عدد بده: ");','    if (scanf("%d", &n) == 1)','        printf("مربع = %d\\n", n * n);','    return 0;','}',''].join('\n')},
 cpp:{n:'main.cpp',v:'C++17 (GCC 9)',id:54,o:'-O2 -std=c++17',s:['#include <iostream>','#include <vector>','#include <algorithm>','using namespace std;','','int main() {','    vector<int> v{5, 3, 8, 1};','    sort(v.begin(), v.end());','    for (int x : v) cout << x << " ";','    cout << endl;','    return 0;','}',''].join('\n')},
 java:{n:'Main.java',v:'Java (OpenJDK 13)',id:62,s:['import java.util.*;','','public class Main {','    public static void main(String[] args) {','        List<Integer> list = new ArrayList<>(List.of(4, 2, 9));','        Collections.sort(list);','        System.out.println("sorted: " + list);','    }','}',''].join('\n')},
 javascript:{n:'script.js',v:'JavaScript (مرورگر)',s:['const nums = [1, 2, 3, 4, 5];','console.log("مربع‌ها:", nums.map(n => n * n));','console.log({ ok: true, time: new Date().toLocaleTimeString() });',''].join('\n')},
 html:{n:'index.html',v:'HTML5',s:['<!DOCTYPE html>','<html lang="fa" dir="rtl">','<head>','  <meta charset="utf-8">','  <title>صفحه من</title>','  <style>','    body { font-family: sans-serif; text-align: center; padding: 40px }','    button { padding: 8px 20px; font-size: 16px }','  </style>','</head>','<body>','  <h1 id="t">سلام دنیا</h1>','  <button onclick="hi()">کلیک کن</button>','  <script>','    function hi() { document.getElementById("t").textContent = "کلیک شد!"; console.log("کلیک") }','  </script>','</body>','</html>',''].join('\n')},
 css:{n:'style.css',v:'CSS3',s:['body {','  font-family: sans-serif;','  display: grid;','  place-items: center;','  height: 100vh;','  margin: 0;','  background: #1e293b;','}','.card {','  padding: 24px 40px;','  border-radius: 8px;','  background: #38bdf8;','  color: #0f172a;','  font-size: 22px;','}','.card:hover { background: #7dd3fc }',''].join('\n')}
};
const HTMLDEF='<div class="card">پیش‌نمایش CSS</div>';
const EXT={py:'python',c:'c',cpp:'cpp',java:'java',js:'javascript',html:'html',htm:'html',css:'css'};
const WEB=['javascript','html','css'];

/* ---------- رنگی‌کردن کد ---------- */
const W=s=>'\\b(?:'+s.split(' ').join('|')+')\\b';
const KW={
 python:'and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield',
 c:'auto break case const continue default do else enum extern for goto if inline register return sizeof static struct switch typedef union volatile while',
 java:'abstract assert break case catch class continue default do else enum extends final finally for if implements import instanceof interface new package private protected public return static super switch synchronized this throw throws try void volatile while',
 js:'async await break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return static super switch this throw try typeof var void while with yield'
};
KW.cpp=KW.c+' class namespace using template typename public private protected new delete try catch throw this virtual override nullptr operator constexpr noexcept final explicit friend mutable';
const TY={
 python:'print input len range int str float list dict set tuple bool open map filter sum min max abs sorted enumerate zip type isinstance round self True False None',
 c:'int char float double void long short signed unsigned size_t bool FILE NULL true false',
 java:'int long double float boolean char byte short String System Math List ArrayList Map HashMap Scanner Integer Object Collections true false null var',
 js:'console document window Math JSON Array Object String Number Promise Map Set Date true false null undefined NaN'
};
TY.cpp=TY.c+' string vector map set cout cin endl std unordered_map pair auto sort';
const STR=String.raw`"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'`;
const CC=String.raw`\/\/.*|\/\*[\s\S]*?\*\/`;
const NUM=String.raw`\b(?:0x[\da-fA-F]+|\d+\.?\d*(?:e[+-]?\d+)?)[fFlLuU]*\b`;
const FN=String.raw`\b[A-Za-z_$][\w$]*(?=\s*\()`;
const std=(k,t,x=[])=>[['c',CC],...x,['s',STR],['n',NUM],['k',W(k)],['t',W(t)],['f',FN]];
const rules={
 python:[['c','#.*'],['s',String.raw`"""[\s\S]*?"""|'''[\s\S]*?'''|`+STR],['n',NUM],['k',W(KW.python)],['t',W(TY.python)],['f',FN]],
 c:std(KW.c,TY.c,[['p',String.raw`^[ \t]*#.*`]]),
 cpp:std(KW.cpp,TY.cpp,[['p',String.raw`^[ \t]*#.*`]]),
 java:std(KW.java,TY.java),
 javascript:std(KW.js,TY.js,[['s',String.raw`\`(?:\\.|[^\`\\])*\``]]),
 html:[['c',String.raw`<!--[\s\S]*?-->`],['s',STR],['t',String.raw`<\/?[a-zA-Z][\w-]*|\/?>`],['a',String.raw`[\w:@-]+(?==)`]],
 css:[['c',String.raw`\/\*[\s\S]*?\*\/`],['s',STR],['p',String.raw`@[\w-]+`],['t',String.raw`[.#][\w-]+(?=[^;{}]*\{)`],['n',String.raw`#[\da-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|deg|fr)?`],['a',String.raw`[\w-]+(?=\s*:[^;{}\n]*[;}])`]]
};
const RX={};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function hl(code,l){
 const r=rules[l],re=RX[l]||(RX[l]=new RegExp(r.map(x=>'('+x[1]+')').join('|'),'gm'));
 re.lastIndex=0;let out='',last=0,m;
 while((m=re.exec(code))){
  if(!m[0]){re.lastIndex++;continue}
  const i=m.findIndex((v,j)=>j&&v!==undefined)-1;
  out+=esc(code.slice(last,m.index))+'<span class="'+r[i][0]+'">'+esc(m[0])+'</span>';last=re.lastIndex}
 return out+esc(code.slice(last))}

/* ---------- کتابخانه‌های وب ---------- */
const CDN='https://cdnjs.cloudflare.com/ajax/libs/';
const LIBS={
 lodash:['Lodash',[CDN+'lodash.js/4.17.21/lodash.min.js']],
 jquery:['jQuery',[CDN+'jquery/3.7.1/jquery.min.js']],
 dayjs:['Day.js',[CDN+'dayjs/1.11.10/dayjs.min.js']],
 mathjs:['Math.js',[CDN+'mathjs/12.4.0/math.min.js']],
 chart:['Chart.js',[CDN+'Chart.js/4.4.1/chart.umd.min.js']],
 bootstrap:['Bootstrap',[CDN+'twitter-bootstrap/5.3.2/css/bootstrap.min.css',CDN+'twitter-bootstrap/5.3.2/js/bootstrap.bundle.min.js']]
};
const selLibs=()=>JSON.parse(ls.libs||'[]').filter(k=>LIBS[k]);
const libTags=()=>selLibs().flatMap(k=>LIBS[k][1]).map(u=>u.endsWith('.css')?`<link rel="stylesheet" href="${u}">`:`<script src="${u}"></script>`).join('');
const BR=`<script>(()=>{const P=x=>parent.postMessage(x,'*'),F=a=>a.map(v=>{if(typeof v==='object'&&v)try{return JSON.stringify(v,null,1)}catch(e){}return String(v)}).join(' ');for(const k of['log','info','warn','error','debug'])console[k]=(...a)=>P({k:'log',t:F(a),e:k==='error'||k==='warn'});addEventListener('error',e=>P({k:'log',t:'خطا: '+e.message+' (خط '+e.lineno+')',e:1}));addEventListener('unhandledrejection',e=>P({k:'log',t:'خطا: '+e.reason,e:1}))})()</script>`;

/* ---------- وضعیت ---------- */
let cur='python',running=false,py=null,pyReady=false,pyDone=null,ctl=null,liveT=0;
const CACHE=new Map(),ta=$('code');

function save(){ls['code:'+cur]=ta.value;ls.html=$('html').value}
function load(l){
 cur=l;ls.lang=l;$('lang').value=l;document.body.dataset.m=l;
 ta.value=ls['code:'+l]??LANGS[l].s;$('html').value=ls.html??HTMLDEF;
 $('fname').textContent=LANGS[l].n;$('sl').textContent=LANGS[l].v;$('htmlbox').hidden=l!=='css';
 $('out').textContent='';$('stat').textContent='';paint();
 if(l==='python')prewarm();
 if(l==='html'||l==='css')setTimeout(run,50)}
function paint(){$('hl').firstChild.innerHTML=hl(ta.value,cur)+'\n';lines()}
let nl=0;
function lines(){
 const n=ta.value.split('\n').length;
 if(n!==nl){nl=n;$('ln').textContent=Array.from({length:n},(_,i)=>i+1).join('\n')}
 const p=ta.value.slice(0,ta.selectionStart).split('\n');$('cur').textContent='Ln '+p.length+', Col '+(p[p.length-1].length+1)}
function log(t,c){const s=document.createElement('span');if(c)s.className=c;s.textContent=t;$('out').append(s);$('out').scrollTop=1e9}
function setRun(b){running=b;const r=$('run');r.textContent=b?'■ توقف':'▶ اجرا';r.classList.toggle('stop',b)}

/* ---------- پایتون در Web Worker (سریع و قابل توقف) ---------- */
const PYSRC=`importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
let py;const ready=loadPyodide().then(p=>{py=p;postMessage({k:'ready'})});
onmessage=async e=>{await ready;const code=e.data.code,ln=e.data.stdin.split('\\n');let i=0;
py.setStdout({batched:t=>postMessage({k:'o',t:t+'\\n'})});py.setStderr({batched:t=>postMessage({k:'e',t:t+'\\n'})});
py.setStdin({stdin:()=>i<ln.length?ln[i++]:undefined});
try{await py.loadPackagesFromImports(code,{messageCallback:()=>{},errorCallback:()=>{}});await py.runPythonAsync(code)}
catch(err){postMessage({k:'e',t:String(err.message||err).trim()+'\\n'})}
postMessage({k:'done'})}`;
function prewarm(){
 if(py)return py;
 py=new Worker(URL.createObjectURL(new Blob([PYSRC],{type:'text/javascript'})));pyReady=false;
 $('pyst').textContent='Python: در حال آماده‌سازی…';
 py.onmessage=e=>{const d=e.data;
  if(d.k==='ready'){pyReady=true;$('pyst').textContent='Python: آماده ✓'}
  else if(d.k==='o')log(d.t);else if(d.k==='e')log(d.t,'e');
  else if(d.k==='done'&&pyDone){const f=pyDone;pyDone=null;f()}};
 py.onerror=e=>{log('خطای مفسر پایتون: '+(e.message||'بارگذاری ناموفق (اینترنت را بررسی کنید)')+'\n','e');if(pyDone){const f=pyDone;pyDone=null;f()}};
 return py}
const runPy=()=>new Promise(res=>{const w=prewarm();pyDone=res;if(!pyReady)log('در حال آماده‌سازی مفسر پایتون (فقط بار اول طول می‌کشد)…\n','m');w.postMessage({code:ta.value,stdin:$('stdin').value})});

/* ---------- C / C++ / Java روی Judge0 ---------- */
async function remote(){
 const Lg=LANGS[cur],code=ta.value,si=$('stdin').value,key=cur+'\0'+code+'\0'+si;
 let d=CACHE.get(key);
 if(!d){
  log('در حال کامپایل و اجرا…\n','m');ctl=new AbortController();
  const h={'Content-Type':'application/json'};if(ls.jkey)h['X-RapidAPI-Key']=ls.jkey;
  const r=await fetch((ls.jurl||'https://ce.judge0.com').replace(/\/$/,'')+'/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,message,status,time,memory',
   {method:'POST',headers:h,signal:ctl.signal,body:JSON.stringify({language_id:Lg.id,source_code:code,stdin:si,...(Lg.o?{compiler_options:Lg.o}:{})})});
  if(!r.ok)throw new Error('پاسخ سرور: '+r.status+' (آدرس سرور را در تنظیمات بررسی کنید)');
  d=await r.json();CACHE.set(key,d);if(CACHE.size>30)CACHE.delete(CACHE.keys().next().value)}
 $('out').textContent='';
 if(d.compile_output)log(d.compile_output+'\n','e');
 if(d.stdout)log(d.stdout);
 if(d.stderr)log(d.stderr+'\n','e');
 if(d.message)log(d.message+'\n','e');
 $('stat').textContent=(d.time?d.time+' s':'')+(d.memory?' · '+Math.round(d.memory/1024)+' MB':'');
 log('\n— '+(d.status?d.status.description:'پایان')+' —','m')}

/* ---------- HTML / CSS / JS در iframe ---------- */
function web(){
 const code=ta.value,libs=libTags(),t0=performance.now();let d;
 if(cur==='html'){const dt=/<!doctype/i.test(code)?'':'<!doctype html>';
  d=/<head[^>]*>/i.test(code)?code.replace(/<head[^>]*>/i,m=>m+BR+libs):dt+BR+libs+code}
 else if(cur==='css')d='<!doctype html><meta charset="utf-8">'+BR+libs+'<style>'+code+'</style>'+$('html').value;
 else d='<!doctype html><meta charset="utf-8">'+BR+libs+'<script>'+code.replace(/<\/script/gi,'<\\/script')+'</script>';
 const f=$('prev');f.onload=()=>{setRun(false);$('stat').textContent=Math.round(performance.now()-t0)+' ms'};f.srcdoc=d}
addEventListener('message',e=>{const d=e.data;if(e.source===$('prev').contentWindow&&d&&d.k==='log')log(d.t+'\n',d.e?'e':'')});

/* ---------- اجرا / توقف ---------- */
async function run(){
 if(running)return stop();
 save();$('out').textContent='';$('stat').textContent='';setRun(true);const t0=performance.now();
 try{
  if(WEB.includes(cur)){web();return}
  if(cur==='python')await runPy();else await remote();
  if(!$('stat').textContent)$('stat').textContent=Math.round(performance.now()-t0)+' ms';
 }catch(e){if(e.name!=='AbortError')log('\n'+e.message+(e instanceof TypeError?'\nاتصال به سرور برقرار نشد؛ اینترنت یا آدرس سرور را بررسی کنید.':'')+'\n','e')}
 setRun(false)}
function stop(){
 if(cur==='python'&&py){py.terminate();py=null;pyReady=false;if(pyDone){const f=pyDone;pyDone=null;f()}setTimeout(prewarm,0)}
 else if(ctl)ctl.abort();
 else $('prev').srcdoc='';
 log('\n— متوقف شد —','m');setRun(false)}

/* ---------- رویدادها ---------- */
$('run').onclick=run;
$('clear').onclick=()=>{$('out').textContent=''};
$('lang').onchange=e=>{save();load(e.target.value)};
ta.addEventListener('input',()=>{paint();save();live()});
$('html').addEventListener('input',()=>{save();live()});
function live(){if(cur==='html'||cur==='css'){clearTimeout(liveT);liveT=setTimeout(()=>{if(!running){$('out').textContent='';setRun(true);web()}},500)}}
ta.addEventListener('scroll',()=>{const h=$('hl');h.scrollTop=ta.scrollTop;h.scrollLeft=ta.scrollLeft;$('ln').scrollTop=ta.scrollTop});
ta.addEventListener('keyup',lines);ta.addEventListener('click',lines);
const PAIR={'(':')','[':']','{':'}'},ins=t=>document.execCommand('insertText',false,t);
ta.addEventListener('keydown',e=>{
 const p=ta.selectionStart,v=ta.value;
 if(e.key==='Tab'){e.preventDefault();ins('    ');return}
 if(e.key==='Enter'&&!e.ctrlKey&&!e.metaKey){
  e.preventDefault();const ln=v.slice(0,p).split('\n').pop(),ind=ln.match(/^\s*/)[0];
  const more=cur==='python'?/:\s*$/.test(ln):/[{(\[]\s*$/.test(ln);
  if(more&&')]}'.includes(v[p]||' ')){ins('\n'+ind+'    \n'+ind);const q=p+1+ind.length+4;ta.setSelectionRange(q,q)}
  else ins('\n'+ind+(more?'    ':''));lines();return}
 if(PAIR[e.key]&&p===ta.selectionEnd&&!/\w/.test(v[p]||'')){e.preventDefault();ins(e.key+PAIR[e.key]);ta.setSelectionRange(p+1,p+1);return}
 if(')]}'.includes(e.key)&&v[p]===e.key){e.preventDefault();ta.setSelectionRange(p+1,p+1)}});
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run()}});
let fz=+ls.fz||14;const setFz=()=>{document.documentElement.style.setProperty('--fz',fz+'px');ls.fz=fz};
$('fs').onclick=()=>{fz=Math.min(26,fz+1);setFz()};$('fs2').onclick=()=>{fz=Math.max(10,fz-1);setFz()};
$('dl').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ta.value],{type:'text/plain'}));a.download=LANGS[cur].n;a.click()};
$('open').onclick=()=>$('file').click();
$('file').onchange=async e=>{const f=e.target.files[0];if(!f)return;const l=EXT[f.name.split('.').pop().toLowerCase()]||cur;save();ls['code:'+l]=await f.text();load(l);e.target.value=''};

/* کتابخانه‌ها و تنظیمات */
$('libform').innerHTML=Object.entries(LIBS).map(([k,v])=>`<label class="chk"><input type="checkbox" value="${k}"> ${v[0]}</label>`).join('');
$('libs').onclick=()=>{const s=selLibs();document.querySelectorAll('#libform input').forEach(i=>i.checked=s.includes(i.value));$('dlgL').showModal()};
$('lok').onclick=()=>{ls.libs=JSON.stringify([...document.querySelectorAll('#libform input:checked')].map(i=>i.value));$('dlgL').close();if(cur==='html'||cur==='css')run()};
$('set').onclick=()=>{$('jurl').value=ls.jurl||'https://ce.judge0.com';$('jkey').value=ls.jkey||'';$('dlgS').showModal()};
$('sno').onclick=()=>$('dlgS').close();
$('sok').onclick=()=>{ls.jurl=$('jurl').value.trim();ls.jkey=$('jkey').value.trim();CACHE.clear();$('dlgS').close()};

/* جداکننده قابل کشیدن */
$('gut').onpointerdown=e=>{const m=$('main'),f=$('prev');f.style.pointerEvents='none';e.preventDefault();
 const mv=ev=>m.style.setProperty('--lw',Math.min(80,Math.max(25,ev.clientX/m.clientWidth*100))+'%'),
 up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);f.style.pointerEvents=''};
 addEventListener('pointermove',mv);addEventListener('pointerup',up)};

/* تم‌ها */
function theme(t){document.documentElement.dataset.theme=t;ls.theme=t;
 document.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
 document.querySelector('meta[name=theme-color]').content=t==='light'?'#f3f3f3':t==='hacker'?'#000':'#1e1e1e'}
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>theme(b.dataset.t));
const cv=$('rain'),cx=cv.getContext('2d');let cols=[];
const size=()=>{cv.width=innerWidth;cv.height=innerHeight;cols=Array(Math.ceil(cv.width/16)).fill(0)};size();addEventListener('resize',size);
setInterval(()=>{if(document.documentElement.dataset.theme!=='hacker')return;
 cx.fillStyle='rgba(0,0,0,.08)';cx.fillRect(0,0,cv.width,cv.height);cx.fillStyle='#2eea5c';cx.font='14px monospace';
 cols.forEach((y,i)=>{cx.fillText(String.fromCharCode(0x30A0+Math.random()*60),i*16,y);cols[i]=y>cv.height+Math.random()*9000?0:y+16})},70);

/* نصب (PWA) */
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('inst').hidden=false});
$('inst').onclick=()=>{if(dp){dp.prompt();dp=null;$('inst').hidden=true}};
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});

theme(ls.theme||'dark');setFz();load(LANGS[ls.lang]?ls.lang:'python');
