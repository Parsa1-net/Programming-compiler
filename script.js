'use strict';
const $=id=>document.getElementById(id),ls=localStorage;
let ui=I18N[ls.ui]?ls.ui:'fa';const T=()=>I18N[ui];
const pyStat=()=>{$('pyst').textContent=py?'Python: '+(pyReady?T().pyReady+' ✓':T().pyPrep):''};

/* ---------- زبان‌ها و نمونه کد ---------- */
const LANGS={
 python:{n:'main.py',v:'Python 3.12',s:['# numpy و pandas هم با import خودکار نصب می‌شوند','name = input("اسمت؟ ") or "دنیا"','print(f"سلام {name}!")','squares = [n * n for n in range(1, 6)]','print(squares, sum(squares))',''].join('\n')},
 c:{n:'main.c',v:'C (GCC 9)',id:50,o:'-O2',s:['#include <stdio.h>','','int main(void) {','    int n;','    printf("یک عدد بده: ");','    if (scanf("%d", &n) == 1)','        printf("مربع = %d\\n", n * n);','    return 0;','}',''].join('\n')},
 cpp:{n:'main.cpp',v:'C++17 (GCC 9)',id:54,o:'-O2 -std=c++17',s:['#include <iostream>','#include <vector>','#include <algorithm>','using namespace std;','','int main() {','    vector<int> v{5, 3, 8, 1};','    sort(v.begin(), v.end());','    for (int x : v) cout << x << " ";','    cout << endl;','    return 0;','}',''].join('\n')},
 java:{n:'Main.java',v:'Java (OpenJDK 13)',id:62,s:['import java.util.*;','','public class Main {','    public static void main(String[] args) {','        List<Integer> list = new ArrayList<>(List.of(4, 2, 9));','        Collections.sort(list);','        System.out.println("sorted: " + list);','    }','}',''].join('\n')},
 javascript:{n:'script.js',v:'JavaScript (مرورگر)',s:['const nums = [1, 2, 3, 4, 5];','console.log("مربع‌ها:", nums.map(n => n * n));','console.log({ ok: true, time: new Date().toLocaleTimeString() });',''].join('\n')},
 html:{n:'index.html',v:'HTML5',s:['<!DOCTYPE html>','<html lang="fa" dir="rtl">','<head>','  <meta charset="utf-8">','  <title>صفحه من</title>','  <style>','    body { font-family: sans-serif; text-align: center; padding: 40px }','    button { padding: 8px 20px; font-size: 16px }','  </style>','</head>','<body>','  <h1 id="t">سلام دنیا</h1>','  <button onclick="hi()">کلیک کن</button>','  <script>','    function hi() { document.getElementById("t").textContent = "کلیک شد!"; console.log("کلیک") }','  </script>','</body>','</html>',''].join('\n')},
 css:{n:'style.css',v:'CSS3',s:['body {','  font-family: sans-serif;','  display: grid;','  place-items: center;','  height: 100vh;','  margin: 0;','  background: #1e293b;','}','.card {','  padding: 24px 40px;','  border-radius: 8px;','  background: #38bdf8;','  color: #0f172a;','  font-size: 22px;','}','.card:hover { background: #7dd3fc }',''].join('\n')},
 php:{n:'index.php',v:'PHP 7.4',id:68,s:['<?php','$name = trim(fgets(STDIN)) ?: "World";','echo "Hello $name!\\n";','foreach ([1, 2, 3] as $n) {','    echo $n * $n, "\\n";','}',''].join('\n')}
};
const HTMLDEF='<div class="card">پیش‌نمایش CSS</div>';
const EXT={py:'python',c:'c',cpp:'cpp',java:'java',js:'javascript',html:'html',htm:'html',css:'css',php:'php'};
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
KW.php='abstract and array as break case catch class clone const continue declare default do echo else elseif empty extends final finally fn for foreach function global if implements include interface isset list namespace new or print private protected public require return static switch throw trait try unset use var while xor yield';
TY.php='true false null TRUE FALSE NULL strlen count array_map array_filter sort implode explode str_repeat printf sprintf var_dump print_r json_encode trim fgets STDIN';
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
 css:[['c',String.raw`\/\*[\s\S]*?\*\/`],['s',STR],['p',String.raw`@[\w-]+`],['t',String.raw`[.#][\w-]+(?=[^;{}]*\{)`],['n',String.raw`#[\da-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|deg|fr)?`],['a',String.raw`[\w-]+(?=\s*:[^;{}\n]*[;}])`]],
 php:[['p',String.raw`<\?php|\?>`],['c',String.raw`\/\/.*|#.*|\/\*[\s\S]*?\*\/`],['s',STR],['a',String.raw`\$\w+`],['n',NUM],['k',W(KW.php)],['t',W(TY.php)],['f',FN]]
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
const BR=`<script>(()=>{const P=x=>parent.postMessage(x,'*'),F=a=>a.map(v=>{if(typeof v==='object'&&v)try{return JSON.stringify(v,null,1)}catch(e){}return String(v)}).join(' ');for(const k of['log','info','warn','error','debug'])console[k]=(...a)=>P({k:'log',t:F(a),e:k==='error'||k==='warn'});addEventListener('error',e=>P({k:'log',t:'Error: '+e.message+' (line '+e.lineno+')',e:1}));addEventListener('unhandledrejection',e=>P({k:'log',t:'Unhandled promise rejection: '+e.reason,e:1}))})()</script>`;

/* ---------- وضعیت ---------- */
let cur='python',running=false,py=null,pyReady=false,pyDone=null,ctl=null,liveT=0;
const CACHE=new Map(),ta=$('code');

function save(){ls['code:'+cur]=ta.value;ls.html=$('html').value}
function load(l){
 cur=l;ls.lang=l;$('lang').value=l;document.body.dataset.m=l;
 ta.value=ls['code:'+l]??LANGS[l].s;$('html').value=ls.html??HTMLDEF;
 $('fname').textContent=LANGS[l].n;$('sl').textContent=LANGS[l].v;$('htmlbox').hidden=l!=='css';
 $('out').textContent='';$('stat').textContent='';paint();
 fit();if(l==='python')prewarm();
 if(l==='html'||l==='css')setTimeout(run,50)}
function paint(){$('hl').firstChild.innerHTML=hl(ta.value,cur)+'\n';lines()}
let nl=0;
function lines(){
 const n=ta.value.split('\n').length;
 if(n!==nl){nl=n;$('ln').textContent=Array.from({length:n},(_,i)=>i+1).join('\n')}
 const p=ta.value.slice(0,ta.selectionStart).split('\n');$('cur').textContent='Ln '+p.length+', Col '+(p[p.length-1].length+1)}
function log(t,c){const s=document.createElement('span');if(c)s.className=c;s.textContent=t;$('out').append(s);$('out').scrollTop=1e9}
function setRun(b){running=b;const r=$('run');r.textContent=b?'■ '+T().stop:'▶ '+T().run;r.classList.toggle('stop',b)}

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
 pyStat();
 py.onmessage=e=>{const d=e.data;
  if(d.k==='ready'){pyReady=true;pyStat()}
  else if(d.k==='o')log(d.t);else if(d.k==='e')log(d.t,'e');
  else if(d.k==='done'&&pyDone){const f=pyDone;pyDone=null;f()}};
 py.onerror=e=>{log('Python interpreter error: '+(e.message||'failed to load (check your internet connection)')+'\n','e');if(pyDone){const f=pyDone;pyDone=null;f()}};
 return py}
const runPy=()=>new Promise(res=>{const w=prewarm();pyDone=res;if(!pyReady)log('Preparing the Python interpreter (first run only)…\n','m');w.postMessage({code:ta.value,stdin:$('stdin').value})});

/* ---------- C / C++ / Java روی Judge0 ---------- */
async function remote(){
 const Lg=LANGS[cur],code=ta.value,si=$('stdin').value,key=cur+'\0'+code+'\0'+si;
 let d=CACHE.get(key);
 if(!d){
  log('Compiling and running…\n','m');ctl=new AbortController();
  const h={'Content-Type':'application/json'};if(ls.jkey)h['X-RapidAPI-Key']=ls.jkey;
  const r=await fetch((ls.jurl||'https://ce.judge0.com').replace(/\/$/,'')+'/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,message,status,time,memory',
   {method:'POST',headers:h,signal:ctl.signal,body:JSON.stringify({language_id:Lg.id,source_code:code,stdin:si,...(Lg.o?{compiler_options:Lg.o}:{})})});
  if(!r.ok)throw new Error('Server responded with HTTP '+r.status+'. Check the server URL in Settings.');
  d=await r.json();CACHE.set(key,d);if(CACHE.size>30)CACHE.delete(CACHE.keys().next().value)}
 $('out').textContent='';
 if(d.compile_output)log(d.compile_output+'\n','e');
 if(d.stdout)log(d.stdout);
 if(d.stderr)log(d.stderr+'\n','e');
 if(d.message)log(d.message+'\n','e');
 $('stat').textContent=(d.time?d.time+' s':'')+(d.memory?' · '+Math.round(d.memory/1024)+' MB':'');
 log('\n— '+(d.status?d.status.description:'Finished')+' —','m')}

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
 save();snap();$('out').textContent='';$('stat').textContent='';setRun(true);const t0=performance.now();
 try{
  if(WEB.includes(cur)){web();return}
  if(cur==='python')await runPy();else await remote();
  if(!$('stat').textContent)$('stat').textContent=Math.round(performance.now()-t0)+' ms';
 }catch(e){if(e.name!=='AbortError')log('\n'+e.message+(e instanceof TypeError?'\nNetwork error: could not reach the execution server. Check your internet connection or the server URL.':'')+'\n','e')}
 setRun(false)}
function stop(){
 if(cur==='python'&&py){py.terminate();py=null;pyReady=false;if(pyDone){const f=pyDone;pyDone=null;f()}setTimeout(prewarm,0)}
 else if(ctl)ctl.abort();
 else $('prev').srcdoc='';
 log('\n— Stopped —','m');setRun(false)}

/* ---------- رویدادها ---------- */
$('run').onclick=run;
$('clear').onclick=()=>{$('out').textContent=''};
$('lang').onchange=e=>{clearTimeout(snapT);snap();save();hideSug();load(e.target.value)};
ta.addEventListener('input',e=>{paint();save();live();suggest(e);clearTimeout(snapT);snapT=setTimeout(()=>snap(),15000)});
$('html').addEventListener('input',()=>{save();live()});
function live(){if(cur==='html'||cur==='css'){clearTimeout(liveT);liveT=setTimeout(()=>{if(!running){$('out').textContent='';setRun(true);web()}},500)}}
ta.addEventListener('scroll',()=>{const h=$('hl');h.scrollTop=ta.scrollTop;h.scrollLeft=ta.scrollLeft;$('ln').scrollTop=ta.scrollTop});
ta.addEventListener('keyup',lines);ta.addEventListener('click',lines);
const PAIR={'(':')','[':']','{':'}'},ins=t=>document.execCommand('insertText',false,t);
ta.addEventListener('keydown',e=>{
 const p=ta.selectionStart,v=ta.value;
 if(sugKey(e))return;
 if(e.key==='Tab'){e.preventDefault();ins('    ');return}
 if(e.key==='Enter'&&!e.ctrlKey&&!e.metaKey){
  e.preventDefault();const ln=v.slice(0,p).split('\n').pop(),ind=ln.match(/^\s*/)[0];
  const more=cur==='python'?/:\s*$/.test(ln):/[{(\[]\s*$/.test(ln);
  if(more&&')]}'.includes(v[p]||' ')){ins('\n'+ind+'    \n'+ind);const q=p+1+ind.length+4;ta.setSelectionRange(q,q)}
  else ins('\n'+ind+(more?'    ':''));lines();return}
 if(PAIR[e.key]&&p===ta.selectionEnd&&!/\w/.test(v[p]||'')){e.preventDefault();ins(e.key+PAIR[e.key]);ta.setSelectionRange(p+1,p+1);return}
 if(')]}'.includes(e.key)&&v[p]===e.key){e.preventDefault();ta.setSelectionRange(p+1,p+1)}});
function toggleComment(){
 const v=ta.value,s=v.lastIndexOf('\n',ta.selectionStart-1)+1;let e=v.indexOf('\n',ta.selectionEnd);if(e<0)e=v.length;
 const [a,b]={python:['# ',''],css:['/* ',' */'],html:['<!-- ',' -->']}[cur]||['// ',''],at=a.trim(),bt=b.trim();
 const rows=v.slice(s,e).split('\n'),all=rows.every(l=>!l.trim()||l.trimStart().startsWith(at));
 const out=rows.map(l=>{if(!l.trim())return l;const ind=l.match(/^\s*/)[0],body=l.slice(ind.length);
  if(all){let x=body.slice(at.length);if(x.startsWith(' '))x=x.slice(1);if(bt&&x.endsWith(bt))x=x.slice(0,-bt.length).trimEnd();return ind+x}
  return ind+a+body+b}).join('\n');
 ta.focus();ta.setSelectionRange(s,e);ins(out);ta.setSelectionRange(s,s+out.length)}
function resetTpl(){ta.focus();ta.setSelectionRange(0,ta.value.length);ins(LANGS[cur].s)}
addEventListener('keydown',e=>{
 const c=e.ctrlKey||e.metaKey,k=e.key.toLowerCase(),go=f=>{e.preventDefault();f()};
 if(c&&k==='enter'||k==='f5')go(run);
 else if(c&&k==='o')go(()=>$('open').click());
 else if(c&&k==='s')go(()=>$('dl').click());
 else if(c&&k==='k')go(()=>$('clear').click());
 else if(c&&k==='/')go(toggleComment);
 else if(c&&(k==='='||k==='+'))go(()=>$('fs').click());
 else if(c&&k==='-')go(()=>$('fs2').click());
 else if(c&&k===',')go(()=>$('set').click());
 else if(k==='f1')go(()=>$('keys').click());
 else if(e.altKey&&e.code==='KeyL')go(()=>$('libs').click());
 else if(e.altKey&&e.code==='KeyT')go(()=>{const n=Object.keys(THEMES);theme(n[(n.indexOf(ls.theme)+1)%n.length])});
 else if(e.altKey&&e.code==='KeyN')go(resetTpl);
 else if(e.altKey&&e.code==='KeyH')go(()=>$('hist').click());
 else if(e.altKey&&e.code==='KeyS')go(()=>{snap(true);toast(T().snap+' ✓')})});
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
const THEMES={light:'#f3f3f3',dark:'#1e1e1e',hacker:'#000',monokai:'#1e1f1c',dracula:'#21222c',nord:'#272c36',solarized:'#00212b',cyberpunk:'#12042f'};
function theme(t){if(!THEMES[t])t='dark';document.documentElement.dataset.theme=t;ls.theme=t;$('theme').value=t;document.querySelector('meta[name=theme-color]').content=THEMES[t]}
$('theme').onchange=e=>theme(e.target.value);
const cv=$('rain'),cx=cv.getContext('2d');let cols=[];
const size=()=>{cv.width=innerWidth;cv.height=innerHeight;cols=Array(Math.ceil(cv.width/16)).fill(0)};size();addEventListener('resize',size);
setInterval(()=>{if(document.documentElement.dataset.theme!=='hacker')return;
 cx.fillStyle='rgba(0,0,0,.08)';cx.fillRect(0,0,cv.width,cv.height);cx.fillStyle='#2eea5c';cx.font='14px monospace';
 cols.forEach((y,i)=>{cx.fillText(String.fromCharCode(0x30A0+Math.random()*60),i*16,y);cols[i]=y>cv.height+Math.random()*9000?0:y+16})},70);

/* نصب (PWA) */
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('inst').hidden=false});
$('inst').onclick=()=>{if(dp){dp.prompt();dp=null;$('inst').hidden=true}};
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});

/* زبان رابط، میانبرها، قاب موبایل */
/* ---------- پیشنهاد کلمات (مثل VS Code) ---------- */
const EXTRA={
 python:'append extend pop remove sort reverse split join strip replace format lower upper startswith endswith keys values items readline __init__ __name__',
 c:'printf scanf malloc free strlen strcpy strcmp fgets sqrt pow abs main stdio stdlib string math',
 cpp:'push_back pop_back size begin end front back insert erase find reverse max min swap cout cin getline setw to_string iostream',
 java:'println print length charAt substring equals toString parseInt valueOf size add get put remove main args nextInt nextLine',
 javascript:'querySelector querySelectorAll getElementById addEventListener setTimeout setInterval fetch then catch length push pop map filter reduce forEach includes indexOf slice splice join split toString parseInt parseFloat log innerHTML textContent classList style',
 php:'echo print_r var_dump array_push array_pop array_merge array_keys array_values in_array str_replace strtolower strtoupper substr strpos count isset empty date time rand'
};
const HTML_TAGS='a abbr article aside audio b body br button canvas caption code div footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input label li link main meta nav ol option p pre script section select small span strong style table tbody td textarea th thead title tr ul video'.split(' ');
const CSS_PROPS='align-items animation background background-color background-image border border-radius bottom box-shadow color cursor display flex flex-direction flex-wrap font-family font-size font-weight gap grid grid-template-columns height justify-content left letter-spacing line-height margin max-width min-height min-width opacity overflow padding position right text-align text-decoration top transform transition width z-index'.split(' ');
const CSS_VALS='absolute auto block center column fixed flex grid inline-block none relative row solid sticky transparent'.split(' ');
const WC={};
function langWords(l){
 if(WC[l])return WC[l];const m=[],key=l==='javascript'?'js':l,add=(s,k)=>s.split(' ').forEach(w=>w&&m.push([w,k]));
 if(l==='html')HTML_TAGS.forEach(w=>m.push([w,'tag']));
 else if(l==='css'){CSS_PROPS.forEach(w=>m.push([w,'property']));CSS_VALS.forEach(w=>m.push([w,'value']))}
 else{add(KW[key]||'','keyword');add(TY[key]||'','builtin');add(EXTRA[l]||'','builtin')}
 return WC[l]=m}
let sug=[],sugI=0,sugPre='',skipS=false;
const sugEl=document.createElement('div');sugEl.id='sug';sugEl.hidden=true;document.querySelector('.wrap').append(sugEl);
const hideSug=()=>{sugEl.hidden=true;sug=[]},sugOpen=()=>!sugEl.hidden;
function suggest(e){
 if(skipS){skipS=false;return hideSug()}
 if((e&&/^(delete|history)/.test(e.inputType||''))||ta.selectionStart!==ta.selectionEnd)return hideSug();
 const p=ta.selectionStart,v=ta.value,m=v.slice(0,p).match(cur==='css'?/[\w-]+$/:/[\w$]+$/);
 if(!m)return hideSug();const pre=m[0],low=pre.toLowerCase();
 if(cur==='html'&&v[p-pre.length-1]!=='<'&&v.slice(p-pre.length-2,p-pre.length)!=='</')return hideSug();
 const seen=new Set(),out=[],ok=w=>w.toLowerCase().startsWith(low)&&w!==pre&&!seen.has(w);
 for(const [w,k] of langWords(cur))if(ok(w)){seen.add(w);out.push([w,k])}
 if(cur!=='html'&&cur!=='css')(v.match(/[A-Za-z_$][\w$]{2,}/g)||[]).forEach(w=>{if(out.length<60&&ok(w)){seen.add(w);out.push([w,'word'])}});
 if(!out.length)return hideSug();
 out.sort((a,b)=>a[0].length-b[0].length||a[0].localeCompare(b[0]));
 sug=out.slice(0,8);sugI=0;sugPre=pre;drawSug()}
function drawSug(){
 sugEl.innerHTML=sug.map(([w,k],i)=>`<div class="si${i===sugI?' on':''}" data-n="${i}"><span><b>${esc(w.slice(0,sugPre.length))}</b>${esc(w.slice(sugPre.length))}</span><em>${k}</em></div>`).join('');
 const cs=getComputedStyle(ta),f=parseFloat(cs.fontSize),lh=f*1.55,g=drawSug.c||(drawSug.c=document.createElement('canvas').getContext('2d'));
 g.font=f+'px '+cs.fontFamily;
 const cw=g.measureText('M').width,rows=ta.value.slice(0,ta.selectionStart).split('\n'),line=rows.length-1,col=rows[line].replace(/\t/g,'    ').length-sugPre.length;
 let x=12+col*cw-ta.scrollLeft,y=10+(line+1)*lh-ta.scrollTop+2;
 sugEl.hidden=false;const w=sugEl.offsetWidth,h=sugEl.offsetHeight;
 if(x+w>ta.clientWidth)x=Math.max(0,ta.clientWidth-w-4);
 if(y+h>ta.clientHeight)y=Math.max(0,y-lh-h-4);
 sugEl.style.left=x+'px';sugEl.style.top=y+'px'}
function sugKey(e){
 if(!sugOpen())return false;
 if(['Tab','ArrowDown','ArrowUp','Escape'].includes(e.key)){
  e.preventDefault();
  if(e.key==='Tab')acceptSug(sugI);
  else if(e.key==='Escape')hideSug();
  else{sugI=(sugI+(e.key==='ArrowDown'?1:-1)+sug.length)%sug.length;drawSug()}
  return true}
 if(['Enter','ArrowLeft','ArrowRight','Home','End'].includes(e.key))hideSug();
 return false}
function acceptSug(i){const s=sug[i];if(!s)return;const p=ta.selectionStart;hideSug();skipS=true;ta.setSelectionRange(p-sugPre.length,p);ins(s[0])}
sugEl.addEventListener('mousedown',e=>{e.preventDefault();const r=e.target.closest('.si');if(r)acceptSug(+r.dataset.n)});
ta.addEventListener('blur',()=>setTimeout(hideSug,100));ta.addEventListener('scroll',hideSug);

/* ---------- تاریخچه نسخه‌ها و بازگشت ---------- */
let snapT=0,hsel=0;
const HK=()=>'hist:'+cur,getH=()=>{try{return JSON.parse(ls[HK()]||'[]')}catch(e){return[]}};
function putH(a){a=a.slice(0,25);for(;;){try{ls[HK()]=JSON.stringify(a);return}catch(e){if(!a.pop())return}}}
function snap(manual){
 const c=ta.value,a=getH();if(!c.trim())return;
 if(a[0]&&a[0].c===c){if(manual&&!a[0].m){a[0].m=1;putH(a)}return}
 a.unshift({t:Date.now(),c,m:manual?1:0});putH(a)}
function diff(o,n){const m=new Map();o.split('\n').forEach(l=>m.set(l,(m.get(l)||0)+1));let add=0,rem=0;n.split('\n').forEach(l=>{const c=m.get(l)||0;if(c)m.set(l,c-1);else add++});m.forEach(c=>rem+=c);return[add,rem]}
function renderH(){
 const a=getH();
 if(!a.length){$('hlist').innerHTML='<p class="note" style="padding:8px">'+esc(T().hEmpty)+'</p>';$('hprev').innerHTML='';return}
 hsel=Math.min(hsel,a.length-1);
 $('hlist').innerHTML=a.map((v,i)=>{const d=diff(a[i+1]?a[i+1].c:'',v.c);return `<div class="hi${i===hsel?' on':''}" data-n="${i}"><b>${new Date(v.t).toLocaleString(ui)}${v.m?' ★':''}</b><span>${v.c.split('\n').length}L · +${d[0]} −${d[1]}</span></div>`}).join('');
 $('hprev').innerHTML=hl(a[hsel].c,cur)}
$('hist').onclick=()=>{snap();hsel=0;renderH();$('dlgH').showModal()};
$('hsnap').onclick=()=>{snap(true);hsel=0;renderH()};
$('hres').onclick=()=>{const v=getH()[hsel];if(!v)return;snap();$('dlgH').close();skipS=true;ta.focus();ta.setSelectionRange(0,ta.value.length);ins(v.c)};
$('hdel').onclick=()=>{const a=getH();a.splice(hsel,1);putH(a);hsel=0;renderH()};
$('hclr').onclick=()=>{if(confirm(T().hClear+'?')){delete ls[HK()];renderH()}};
$('hclose').onclick=()=>$('dlgH').close();
$('hlist').onclick=e=>{const r=e.target.closest('[data-n]');if(r){hsel=+r.dataset.n;renderH()}};
function toast(m){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.append(t)}t.textContent=m;t.className='show';clearTimeout(toast.t);toast.t=setTimeout(()=>t.className='',1500)}

const KEYS=[['Ctrl + Enter / F5','run'],['Ctrl + O','open'],['Ctrl + S','save'],['Ctrl + K','clear'],['Ctrl + /','cmt'],['Ctrl + = / Ctrl + −','font'],['Ctrl + ,','settings'],['Alt + L','libs'],['Alt + T','theme'],['Alt + N','reset'],['F1','keys'],['Tab','acc'],['Alt + H','hist'],['Alt + S','snap']];
function buildKeys(){$('keylist').innerHTML=KEYS.map(([k,l])=>`<div class="kr"><kbd>${k}</kbd><span>${T()[l]}</span></div>`).join('')}
function applyI18n(){const t=T();document.documentElement.lang=ui;document.documentElement.dir=t.dir;
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t[e.dataset.i]);
 $('stdin').placeholder=t.stdinPh;$('ui').value=ui;setRun(running);pyStat();buildKeys()}
$('ui').onchange=e=>{ui=e.target.value;ls.ui=ui;applyI18n()};
$('keys').onclick=()=>{buildKeys();$('dlgK').showModal()};
const wrap=$('phoneWrap');
function fit(){const w=wrap.clientWidth,h=wrap.clientHeight;if(w&&h)$('phone').style.setProperty('--ps',Math.min((w-16)/464,(h-30)/980,1))}
new ResizeObserver(fit).observe(wrap);
theme(ls.theme||'dark');setFz();applyI18n();load(LANGS[ls.lang]?ls.lang:'python');
