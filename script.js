'use strict';
const $=id=>document.getElementById(id),ls=localStorage;
let ui=I18N[ls.ui]?ls.ui:'fa';const T=()=>I18N[ui];
const pyStat=()=>{$('pyst').textContent=py?'Python'+(pyVer?' '+pyVer:'')+': '+(pyReady?T().pyReady+' ✓':T().pyPrep):''};

/* ---------- زبان‌ها و نمونه کد ---------- */
const LANGS={
 python:{n:'main.py',v:'Python 3.15',s:['# numpy و pandas هم با import خودکار نصب می‌شوند','name = input("اسمت؟ ") or "دنیا"','print(f"سلام {name}!")','squares = [n * n for n in range(1, 6)]','print(squares, sum(squares))',''].join('\n')},
 c:{n:'main.c',v:'C (GCC 9)',id:50,o:'-O2',s:['#include <stdio.h>','','int main(void) {','    int n;','    printf("یک عدد بده: ");','    if (scanf("%d", &n) == 1)','        printf("مربع = %d\\n", n * n);','    return 0;','}',''].join('\n')},
 cpp:{n:'main.cpp',v:'C++17 (GCC 9)',id:54,o:'-O2 -std=c++17',s:['#include <iostream>','#include <vector>','#include <algorithm>','using namespace std;','','int main() {','    vector<int> v{5, 3, 8, 1};','    sort(v.begin(), v.end());','    for (int x : v) cout << x << " ";','    cout << endl;','    return 0;','}',''].join('\n')},
 java:{n:'Main.java',v:'Java (OpenJDK 13)',id:62,s:['import java.util.*;','','public class Main {','    public static void main(String[] args) {','        List<Integer> list = new ArrayList<>(List.of(4, 2, 9));','        Collections.sort(list);','        System.out.println("sorted: " + list);','    }','}',''].join('\n')},
 javascript:{n:'script.js',v:'JavaScript (مرورگر)',s:['const nums = [1, 2, 3, 4, 5];','console.log("مربع‌ها:", nums.map(n => n * n));','console.log({ ok: true, time: new Date().toLocaleTimeString() });',''].join('\n')},
 html:{n:'index.html',v:'HTML5',s:['<!DOCTYPE html>','<html lang="fa" dir="rtl">','<head>','  <meta charset="utf-8">','  <title>صفحه من</title>','  <style>','    body { font-family: sans-serif; text-align: center; padding: 40px }','    button { padding: 8px 20px; font-size: 16px }','  </style>','</head>','<body>','  <h1 id="t">سلام دنیا</h1>','  <button onclick="hi()">کلیک کن</button>','  <script>','    function hi() { document.getElementById("t").textContent = "کلیک شد!"; console.log("کلیک") }','  </script>','</body>','</html>',''].join('\n')},
 css:{n:'style.css',v:'CSS3',s:['body {','  font-family: sans-serif;','  display: grid;','  place-items: center;','  height: 100vh;','  margin: 0;','  background: #1e293b;','}','.card {','  padding: 24px 40px;','  border-radius: 8px;','  background: #38bdf8;','  color: #0f172a;','  font-size: 22px;','}','.card:hover { background: #7dd3fc }',''].join('\n')},
 php:{n:'index.php',v:'PHP 7.4',id:68,s:['<?php','$name = trim(fgets(STDIN)) ?: "World";','echo "Hello $name!\\n";','foreach ([1, 2, 3] as $n) {','    echo $n * $n, "\\n";','}',''].join('\n')},
 rust:{n:'main.rs',v:'Rust (stable)',id:73,s:['fn main() {','    let nums = vec![1, 2, 3, 4, 5];','    let sum: i32 = nums.iter().map(|n| n * n).sum();','    println!("Sum of squares = {}", sum);','}',''].join('\n')},
 go:{n:'main.go',v:'Go',id:60,s:['package main','','import "fmt"','','func main() {','    fmt.Println("Hello from Go!")','    for i := 1; i <= 5; i++ {','        fmt.Println(i, "squared =", i*i)','    }','}',''].join('\n')},
 julia:{n:'main.jl',v:'Julia',s:['name = "Julia"','println("Hello from ", name, "!")','for i in 1:5','    println(i, "^2 = ", i^2)','end',''].join('\n')},
 carbon:{n:'main.carbon',v:'Carbon (experimental)',s:['fn Run() {','    Core.Print(42);','}',''].join('\n')},
 csharp:{n:'Program.cs',v:'C# (.NET)',id:51,s:['using System;','using System.Linq;','','class Program','{','    static void Main()','    {','        var numbers = new[] { 1, 2, 3, 4, 5 };','        Console.WriteLine("Sum of squares = " + numbers.Select(n => n * n).Sum());','    }','}',''].join('\n')}
};
const HTMLDEF='<div class="card">پیش‌نمایش CSS</div>';
const EXT={py:'python',c:'c',cpp:'cpp',java:'java',js:'javascript',html:'html',htm:'html',css:'css',php:'php',cs:'csharp',rs:'rust',go:'go',jl:'julia',carbon:'carbon'};
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
KW.csharp='abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while async await var record init required get set yield when with where nameof dynamic partial global args';
TY.csharp='Console String Math List Dictionary HashSet Queue Stack Task Exception DateTime TimeSpan Guid File Path Environment StringBuilder Array IEnumerable IList Func Action Tuple Random Convert Linq Nullable';
KW.rust='as async await break const continue crate dyn else enum extern fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait type unsafe use where while';
TY.rust='i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str String Vec Option Some None Result Ok Err Box true false println print format vec';
KW.go='break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var';
TY.go='int int8 int16 int32 int64 uint uint8 uint16 uint32 uint64 float32 float64 string bool byte rune error nil true false fmt Println Printf Sprintf len make append';
KW.julia='abstract baremodule begin break catch const continue do else elseif end export finally for function global if import let local macro module mutable quote return struct try using while in isa where';
TY.julia='Int Int8 Int16 Int32 Int64 Float32 Float64 String Bool Char Nothing Any Vector Array Dict Set Tuple true false nothing println print length';
KW.carbon='abstract adapt alias and api as auto base break case choice class constraint continue default destructor else extend external final fn for forall friend if impl impls import in interface let library like match namespace not observe or override package partial private protected require return returned self Self template then var virtual where while';
TY.carbon='i8 i16 i32 i64 u8 u16 u32 u64 f32 f64 bool String Core Print true false';
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
 php:[['p',String.raw`<\?php|\?>`],['c',String.raw`\/\/.*|#.*|\/\*[\s\S]*?\*\/`],['s',STR],['a',String.raw`\$\w+`],['n',NUM],['k',W(KW.php)],['t',W(TY.php)],['f',FN]],
 csharp:std(KW.csharp,TY.csharp,[['p',String.raw`^[ \t]*#.*`],['s',String.raw`@"(?:[^"]|"")*"`]]),
 rust:std(KW.rust,TY.rust),
 go:std(KW.go,TY.go,[['s',String.raw`\`[^\`]*\``]]),
 julia:[['c',String.raw`#=[\s\S]*?=#|#.*`],['s',String.raw`\"\"\"[\s\S]*?\"\"\"|`+STR],['p',String.raw`@\w+`],['n',NUM],['k',W(KW.julia)],['t',W(TY.julia)],['f',String.raw`\b[A-Za-z_]\w*!?(?=\s*\()`]],
 carbon:std(KW.carbon,TY.carbon)
};
const RX={};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
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
 $('fname').textContent=LANGS[l].n;$('sl').textContent=LANGS[l].v;document.title=LANGS[l].v.replace(/ \(.*/,'')+' Online Compiler | کامپایلر کدخانه (کد خانه)';$('htmlbox').hidden=l!=='css';
 $('out').textContent='';$('stat').textContent='';paint();
 fit();guiReset();if(l==='python')prewarm();
 if(l==='html'||l==='css')setTimeout(run,50)}
function paint(){$('hl').firstChild.innerHTML=hl(ta.value,cur)+'\n';lines()}
let nl=0;
function lines(){
 const n=ta.value.split('\n').length;
 if(n!==nl){nl=n;$('ln').textContent=Array.from({length:n},(_,i)=>i+1).join('\n')}
 const p=ta.value.slice(0,ta.selectionStart).split('\n');$('cur').textContent='Ln '+p.length+', Col '+(p[p.length-1].length+1)}
function log(t,c){const s=document.createElement('span');if(c)s.className=c;s.textContent=t;const o=$('out');o.append(s);while(o.childNodes.length>1500)o.removeChild(o.firstChild);o.scrollTop=1e9}
function setRun(b){running=b;const r=$('run');r.textContent=b?'■ '+T().stop:'▶ '+T().run;r.classList.toggle('stop',b)}

/* ---------- پایتون در Web Worker (سریع و قابل توقف) ---------- */
const PYV={'3.15':['https://cdn.jsdelivr.net/pyodide/v315.0.0a2/full/'],'3.14':['https://cdn.jsdelivr.net/pyodide/v314.0.7/full/'],'3.12':['https://cdn.jsdelivr.net/pyodide/v0.26.4/full/']};
const pyChain=()=>{const p=ls.pyver||'auto',all=['3.15','3.14','3.12'];return p==='auto'||!PYV[p]?all:[p,...all.filter(x=>x<p)]};
/* ورکر ماژولی (Pyodide 314 به بعد ورکر کلاسیک را پشتیبانی نمی‌کند)؛ اگر نسخه‌ی اول لود نشد، خودکار نسخه‌ی بعدی */
const pySrc=bases=>`const BASES=${JSON.stringify(bases)};let py,boot=false,ctk=false;const pk=new Set();
const ready=(async()=>{
 for(const b of BASES){
  try{const m=await import(b+'pyodide.mjs');py=await m.loadPyodide({indexURL:b});postMessage({k:'ready',v:py.runPython('import sys;sys.version.split()[0]'),b});return}
  catch(e){postMessage({k:'warn',t:'Python runtime failed to load ('+b+'): '+(e&&e.message||e)})}}
 throw new Error('no Python runtime could be loaded')})();
ready.catch(e=>postMessage({k:'e',t:String(e.message||e)+'\\n'}));
onmessage=async e=>{
 try{await ready}catch(x){postMessage({k:'done',r:'{"status":"error","total":0}'});return}
 const d=e.data;
 try{
  if(!boot){py.runPython(d.boot);boot=true}
  if(d.k==='run'){
   const need=(d.code.match(/^\\s*(?:from|import)\\s+[\\w.]+/gm)||[]).join('\\n');
   if(need&&!pk.has(need)){
    try{await py.loadPackagesFromImports(d.code,{messageCallback:()=>{},errorCallback:()=>{}})}
    catch(err){postMessage({k:'done',r:JSON.stringify({status:'pkgfail',total:0,msg:String(err&&err.message||err)})});return}
    pk.add(need)}
   if(/customtkinter|tkinter/.test(d.code)&&!ctk){py.runPython(d.ctk);ctk=true}
   postMessage({k:'done',r:py.globals.get('__kk_run')(d.code,d.inputs,d.skip,d.seed)})
  }else if(d.k==='ev')py.globals.get('__kk_event')(d.id,d.type,d.value)
 }catch(err){postMessage({k:'e',t:String(err.message||err).trim()+'\\n'});postMessage({k:'done',r:'{"status":"error","total":0}'})}};`;
let pyIn=[],pyTotal=0,pySeed=1,askRes=null,pyVer='',pyIdx=0,pyWd=0,jsw=null;
function pyMsg(e){
 const d=typeof e.data==='string'?JSON.parse(e.data):e.data;
 if(d.k==='ready'){pyReady=true;pyVer=d.v;pyStat()}
 else if(d.k==='warn')log(d.t+'\n','m');
 else if(d.k==='o')log(d.t);else if(d.k==='e')log(d.t,'e');
 else if(d.k==='gui')guiOps(d.ops);
 else if(d.k==='done'&&pyDone){const f=pyDone;pyDone=null;f(JSON.parse(d.r))}}
function prewarm(){
 if(py)return py;
 const ch=pyChain();if(pyIdx>=ch.length)pyIdx=0;
 py=new Worker(URL.createObjectURL(new Blob([pySrc(ch.slice(pyIdx).map(v=>PYV[v][0]))],{type:'text/javascript'})),{type:'module'});
 pyReady=false;pyVer='';pyStat();py.onmessage=pyMsg;
 py.onerror=e=>{log('Python runtime error: '+(e.message||'could not start the module worker (browser too old?)')+'\n','e');if(pyDone){const f=pyDone;pyDone=null;f({status:'error',total:0})}};
 return py}
const pyRun=()=>new Promise(res=>{const w=prewarm();pyDone=res;w.postMessage({k:'run',code:ta.value,inputs:JSON.stringify(pyIn),skip:pyTotal,seed:pySeed,boot:PYBOOT,ctk:PYCTK})});
function askLine(){return new Promise(res=>{
 askRes=res;const i=document.createElement('input');i.className='ti';i.spellcheck=false;i.setAttribute('autocomplete','off');
 $('out').append(i);$('out').scrollTop=1e9;i.focus();
 i.onkeydown=e=>{if(e.key==='Enter'||(e.key==='d'&&e.ctrlKey&&!i.value)){
  e.preventDefault();const eof=e.key!=='Enter',v=i.value;i.replaceWith(document.createTextNode(eof?'^D\n':v+'\n'));askRes=null;res(eof?null:v)}}})}
$('out').addEventListener('click',()=>{const i=$('out').querySelector('.ti');if(i)i.focus()});
async function runPy(){
 const sl=$('stdin').value.split('\n');if(sl.length&&sl[sl.length-1]==='')sl.pop();
 pyIn=$('stdin').value?sl:[];pyTotal=0;pySeed=(Math.random()*1e9)|0;
 if(!pyReady)log('Preparing the Python runtime (first run only)…\n','m');
 for(;;){
  pyWd=setTimeout(()=>{log('\nStopped: the program ran longer than 120 s.\n','e');stop()},120000);
  const r=await pyRun();clearTimeout(pyWd);
  if(r.status==='pkgfail'){
   const ch=pyChain();
   if(pyIdx<ch.length-1){log('Package install failed on Python '+(pyVer||ch[pyIdx])+' ('+String(r.msg||'').slice(0,100)+'); switching to '+ch[pyIdx+1]+'…\n','m');
    pyIdx++;if(py){py.terminate();py=null;pyReady=false}pyTotal=0;$('out').textContent='';continue}
   log('Package install failed: '+r.msg+'\n','e');return r}
  if(r.status!=='need')return r;
  pyTotal=r.total;
  const v=await askLine();
  if(v==='\u0000stop')return r;
  pyIn.push(v)}}

/* ---------- C / C++ / Java روی Judge0 ---------- */
const BACK={csharp:['ce','j'],c:['j','ce'],cpp:['j','ce'],java:['j','ce'],php:['j','ce'],rust:['rp','ce','j'],go:['ce','j'],julia:['ce'],carbon:['ce']};
const CE='https://godbolt.org/api',CEL={csharp:'csharp',c:'c',cpp:'c++',java:'java',php:'php',rust:'rust',go:'go',julia:'julia',carbon:'carbon'},CEP={csharp:/\.net|dotnet/i,c:/x86-64 gcc/i,cpp:/x86-64 gcc/i,java:/java|jdk/i},CEC={};
const J_FB={csharp:51,c:103,cpp:105,java:91,go:107,rust:108,php:98},J_RX={csharp:/^C# \(/,c:/^C \((GCC|Clang)/,cpp:/^C\+\+ \((GCC|Clang)/,java:/^Java \(/,php:/^PHP/,go:/^Go /,rust:/^Rust /},J0={};
const NEEDIN={c:/\b(scanf|fscanf|getchar|gets|fgets|getline|read)\s*\(|\bcin\s*>>/,java:/Scanner|BufferedReader|System\.in|readLine/,php:/fgets\s*\(\s*STDIN|readline\s*\(|fscanf\s*\(|stream_get_line/,rust:/stdin\s*\(/,go:/bufio\.New(Reader|Scanner)|fmt\.Scan/,julia:/readline|readlines|stdin/};
NEEDIN.cpp=NEEDIN.c;NEEDIN.csharp=/Console\.(ReadLine|Read|In)\b/;
function safeUrl(u){u=String(u||'').trim();if(/^https:\/\/[^\s/]+/i.test(u)||/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(u))return u.replace(/\/+$/,'');throw new Error('Only https:// URLs (or http://localhost) are allowed')}
const jbase=()=>safeUrl(ls.jurl||'https://ce.judge0.com');
const b64e=s=>{let b='';for(const x of new TextEncoder().encode(s))b+=String.fromCharCode(x);return btoa(b)};
const b64d=s=>s?new TextDecoder().decode(Uint8Array.from(atob(String(s).replace(/\s/g,'')),c=>c.charCodeAt(0))):'';
async function jfetch(url,opt,hint){
 for(let i=0;;i++){
  const r=await fetch(url,opt);
  if(r.ok)return r.json();
  if([429,502,503,504].includes(r.status)&&i<2){await new Promise(x=>setTimeout(x,700*(i+1)));continue}
  const t=(await r.text().catch(()=>'')).slice(0,160);
  throw new Error('Server responded with HTTP '+r.status+(t?': '+t:'')+(hint||''))}}
/* شناسه‌ی زبان‌ها در Judge0 تغییر می‌کند (نسخه‌ی ۱٫۱۴ شناسه‌های جدید دارد)؛ پس لیست زنده خوانده و جدیدترین کامپایلر انتخاب می‌شود */
const PJ={c:/GCC/,cpp:/GCC/,csharp:/\.NET/};
function pickJudge(list,l){
 const rx=J_RX[l];if(!rx)return;
 const ver=n=>((n.match(/\d+(?:\.\d+)*/g)||['0']).pop()).split('.').map(Number);
 const c=list.filter(x=>rx.test(x.name)&&!/test|mpi/i.test(x.name));
 c.sort((a,b)=>{const g=(PJ[l]&&PJ[l].test(b.name)?1:0)-(PJ[l]&&PJ[l].test(a.name)?1:0);if(g)return g;const x=ver(a.name),y=ver(b.name);for(let i=0;i<4;i++){const d=(y[i]||0)-(x[i]||0);if(d)return d}return 0});
 return c[0]&&c[0].id}
async function jid(l,sig){
 try{if(!J0.list||Date.now()-J0.t>216e5){J0.list=await jfetch(jbase()+'/languages',{signal:sig});J0.t=Date.now()}
  const id=pickJudge(J0.list,l);if(id)return id}
 catch(e){if(e.name==='AbortError')throw e}
 return J_FB[l]||LANGS[l].id}
function pickCompiler(list,pref){
 const ok=list.filter(c=>c.supportsExecute!==false),
  rel=ok.filter(c=>!/nightly|beta|preview|trunk|dev|master|snapshot|mrustc|gcc-?rs|miri|\bmir\b/i.test(c.name||c.id));
 let pool=rel.length?rel:ok.length?ok:list;
 if(pref){const pf=pool.filter(c=>pref.test(c.name||c.id));if(pf.length)pool=pf}
 const ver=c=>(((c.semver||'').match(/\d+(?:\.\d+)*/)||(c.name||c.id||'').match(/\d+(?:\.\d+)*/g)||['0']).slice(-1)[0]).split('.').map(Number);
 pool=pool.slice().sort((a,b)=>{const x=ver(a),y=ver(b);for(let i=0;i<4;i++){const d=(y[i]||0)-(x[i]||0);if(d)return d}return 0});
 return pool[0]&&pool[0].id}
const RUN={
 async j(l,code,si,sig){
  const Lg=LANGS[l],h={'Content-Type':'application/json'};if(ls.jkey)h['X-RapidAPI-Key']=ls.jkey;
  const base=jbase(),id=await jid(l,sig);
  const go=async src=>{
   const d=await jfetch(base+'/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,compile_output,message,status,time,memory',
    {method:'POST',headers:h,signal:sig,body:JSON.stringify({language_id:id,source_code:b64e(src),stdin:b64e(si),...(Lg.o?{compiler_options:Lg.o}:{})})},'. Check the server URL in Settings.');
   return{compile:b64d(d.compile_output),stdout:b64d(d.stdout),stderr:b64d(d.stderr),message:b64d(d.message),time:d.time,mem:d.memory,status:d.status&&d.status.description}};
  let res=await go(code);const m=l==='java'&&/class (\w+) is public, should be declared in a file named/.exec(res.compile||'');
  if(m&&m[1]!=='Main'){res=await go(code.replace(new RegExp('\\b'+m[1]+'\\b','g'),'Main'));res.note='Class '+m[1]+' was renamed to Main for the runner.'}
  return res},
 async rp(l,code,si,sig){
  if(si)throw new Error('the Rust playground has no stdin support');
  const d=await jfetch('https://play.rust-lang.org/execute',{method:'POST',headers:{'Content-Type':'application/json'},signal:sig,body:JSON.stringify({channel:'stable',mode:'debug',edition:'2021',crateType:'bin',tests:false,code,backtrace:false})});
  const err=(d.stderr||'').split('\n').filter(x=>!/^\s*(Compiling|Finished|Running)\b/.test(x)).join('\n').trim();
  return d.success?{stdout:d.stdout,stderr:err,status:'Finished (Rust playground, stable)'}:{compile:err||d.stdout,status:'Compilation failed'}},
 async ce(l,code,si,sig){
  const lang=CEL[l];if(!lang)throw new Error('language not available on Compiler Explorer');
  let id=CEC[l];
  if(!id){const list=await jfetch(CE+'/compilers/'+lang+'?fields=id,name,semver,supportsExecute',{headers:{Accept:'application/json'},signal:sig});
   id=pickCompiler(list,CEP[l]);if(!id)throw new Error('no compiler found for '+lang);CEC[l]=id}
  let r;
  try{r=await jfetch(CE+'/compiler/'+id+'/compile',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:sig,
   body:JSON.stringify({source:code,options:{userArguments:'',executeParameters:{args:[],stdin:si},compilerOptions:{executorRequest:true},filters:{execute:true},tools:[],libraries:[]},lang,allowStoreCodeDebug:true})})}
  catch(e){delete CEC[l];throw e}
  const tx=a=>(a||[]).map(x=>x.text).join('\n'),b=r.buildResult||{};
  if(b.code)return{compile:(tx(b.stderr)+'\n'+tx(b.stdout)).trim(),status:'Compilation failed'};
  const out=tx(r.stdout),err=tx(r.stderr);
  if(r.didExecute===false&&!out&&!err){if((BACK[l]||[]).length>1)throw new Error('this compiler cannot execute programs on Compiler Explorer');return{message:'Compiled successfully, but this compiler cannot execute programs on Compiler Explorer.',status:'Compiled ('+id+')'}}
  return{stdout:out?out+'\n':'',stderr:err,time:r.execTime?r.execTime/1000:0,status:'Finished (Compiler Explorer: '+id+')'}}
};
let lastRemote=0;
function csWrap(code){
 if(/\bstatic\s+(?:async\s+)?(?:void|int|Task(?:<int>)?|System\.Threading\.Tasks\.Task(?:<int>)?)\s+Main\s*\(/.test(code))return code;
 const L=code.split('\n');let i=0;
 while(i<L.length&&/^\s*(using\s+[\w.= ]+;|using\s+static\s+[\w.]+;|global\s+using\s+[\w.= ]+;|#.*|\/\/.*)?\s*$/.test(L[i]))i++;
 let j=L.length;
 for(let k=i;k<L.length;k++)if(/^(?:\s*\[[^\]]*\]\s*)*(?:(?:public|internal|static|sealed|abstract|partial|readonly|unsafe|file)\s+)*(?:class|struct|record|interface|enum|namespace|delegate)\b/.test(L[k])){j=k;break}
 const body=L.slice(i,j).join('\n');if(!body.trim())return code;
 const aw=/\bawait\b/.test(body),rt=/^return\s+[^;]+;/m.test(body),
  sig=aw?(rt?'async System.Threading.Tasks.Task<int>':'async System.Threading.Tasks.Task'):(rt?'int':'void');
 let f=i;while(f<j&&!L[f].trim())f++;
 L[f]='public static class KKProgram{public static '+sig+' Main(string[] args){'+L[f];
 if(j<L.length)L[j]='}}'+L[j];else L.push('}}');
 return L.join('\n')}
async function collectStdin(){
 log('This program reads input. Type each input line and press Enter (empty line = done):\n','m');
 const L=[];for(;;){const v=await askLine();if(v==='\u0000stop')return false;if(v===null||v==='')break;L.push(v)}
 $('stdin').value=L.join('\n');$('out').textContent='';return true}
async function remote(){
 const code=ta.value,si=$('stdin').value,key=cur+'\0'+code+'\0'+si,chain=BACK[cur]||['j'];let d=CACHE.get(key);
 if(!d){
  const wait=1200-(Date.now()-lastRemote);if(wait>0)await new Promise(r=>setTimeout(r,wait));
  log('Compiling and running…\n','m');ctl=new AbortController();
  const wd=setTimeout(()=>{log('\nStopped: no response within 60 s.\n','e');ctl.abort()},60000);
  const go=async src=>{let err;
   for(const b of chain){
    try{return await RUN[b](cur,src,si,ctl.signal)}
    catch(e){if(e.name==='AbortError')throw e;err=e;if(chain.length>1)log('['+b+'] '+e.message+'; trying another runner…\n','m')}}
   throw err};
  try{
   const vs=cur==='csharp'?[csWrap(code),code].filter((v,i,a)=>a.indexOf(v)===i):[code];
   for(let n=0;n<vs.length;n++){d=await go(vs[n]);if(!(d.compile&&n<vs.length-1))break}
  }finally{clearTimeout(wd);lastRemote=Date.now()}
  CACHE.set(key,d);if(CACHE.size>30)CACHE.delete(CACHE.keys().next().value)}
 $('out').textContent='';
 if(d.note)log(d.note+'\n','m');
 if(d.compile)log(d.compile+'\n','e');if(d.stdout)log(d.stdout);if(d.stderr)log(d.stderr+'\n','e');if(d.message)log(d.message+'\n','e');
 $('stat').textContent=(d.time?d.time+' s':'')+(d.mem?' · '+Math.round(d.mem/1024)+' MB':'');
 log('\n— '+(d.status||'Finished')+' —','m')}
/* ---------- HTML / CSS / JS در iframe ---------- */
const WJS=`const P=x=>postMessage(x),F=a=>a.map(v=>{if(typeof v==='object'&&v)try{return JSON.stringify(v,null,1)}catch(e){}return String(v)}).join(' ');
for(const k of['log','info','warn','error','debug'])console[k]=(...a)=>P({k:'log',t:F(a),e:k==='error'||k==='warn'});
self.onerror=(m,s,l)=>{P({k:'log',t:'Error: '+m+(l?' (line '+l+')':''),e:1})};
self.onunhandledrejection=e=>P({k:'log',t:'Unhandled promise rejection: '+e.reason,e:1});
onmessage=e=>{const d=e.data;try{if(d.libs.length)importScripts(...d.libs);(0,eval)(d.code)}catch(err){P({k:'log',t:(err&&err.name||'Error')+': '+(err&&err.message||err),e:1})}P({k:'done'})}`;
const DOMRX=/\b(document|window|alert|prompt|confirm|localStorage|sessionStorage|navigator|location|history|customElements|getElementBy\w*|querySelector\w*|createElement|innerHTML|XMLHttpRequest|requestAnimationFrame|canvas|addEventListener)\b|\bawait\b|^\s*import\s/m;
/* جاوااسکریپتِ بدون DOM در Worker اجرا می‌شود: حلقه‌ی بی‌پایان صفحه را قفل نمی‌کند و با «توقف» کشته می‌شود */
function jsWorker(code,libs){
 const t0=performance.now();if(jsw)jsw.terminate();
 jsw=new Worker(URL.createObjectURL(new Blob([WJS],{type:'text/javascript'})));
 const wd=setTimeout(()=>{log('\nStopped: the script ran longer than 60 s.\n','e');stop()},60000);
 jsw.onmessage=e=>{const d=e.data;if(d.k==='log')log(d.t+'\n',d.e?'e':'');else if(d.k==='done'){clearTimeout(wd);setRun(false);$('stat').textContent=Math.round(performance.now()-t0)+' ms'}};
 jsw.onerror=e=>{log('Error: '+e.message+'\n','e');clearTimeout(wd);setRun(false)};
 jsw.postMessage({code,libs})}
function web(){
 const code=ta.value,libs=libTags(),t0=performance.now(),sel=selLibs();let d;
 if(cur==='html'){const dt=/<!doctype/i.test(code)?'':'<!doctype html>';
  d=/<head[^>]*>/i.test(code)?code.replace(/<head[^>]*>/i,m=>m+BR+libs):dt+BR+libs+code}
 else if(cur==='css')d='<!doctype html><meta charset="utf-8">'+BR+libs+'<style>'+code+'</style>'+$('html').value;
 else{
  if(!DOMRX.test(code)&&sel.every(k=>['lodash','dayjs','mathjs'].includes(k))){jsWorker(code,sel.flatMap(k=>LIBS[k][1]));return}
  const mod=/\bawait\b|^\s*import\s/m.test(code)?' type="module"':'';
  d='<!doctype html><meta charset="utf-8">'+BR+libs+'<script'+mod+'>'+code.replace(/<\/script/gi,'<\\/script')+'</script>'}
 const f=$('prev');f.onload=()=>{setRun(false);$('stat').textContent=Math.round(performance.now()-t0)+' ms'};f.srcdoc=d}
addEventListener('message',e=>{const d=e.data;if(e.source===$('prev').contentWindow&&d&&d.k==='log')log(d.t+'\n',d.e?'e':'')});

/* ---------- اجرا / توقف ---------- */
async function run(){
 if(running)return stop();
 save();snap();guiReset();$('out').textContent='';$('stat').textContent='';setRun(true);const t0=performance.now();
 try{
  if(WEB.includes(cur)){web();return}
  if(cur==='python')await runPy();
  else{if(NEEDIN[cur]&&!$('stdin').value&&NEEDIN[cur].test(ta.value)&&!(await collectStdin())){setRun(false);return}await remote()}
  if(!$('stat').textContent)$('stat').textContent=Math.round(performance.now()-t0)+' ms';
 }catch(e){if(e.name!=='AbortError')log('\n'+e.message+(e instanceof TypeError?'\nNetwork error: could not reach the execution server. Check your internet connection or the server URL.':'')+'\n','e')}
 setRun(false)}
function stop(){
 clearTimeout(pyWd);if(askRes){askRes('\u0000stop');askRes=null}
 if(jsw){jsw.terminate();jsw=null}
 if(cur==='python'&&py){py.terminate();py=null;pyReady=false;guiReset();if(pyDone){const f=pyDone;pyDone=null;f({status:'stop',total:0})}setTimeout(prewarm,0)}
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
 const [a,b]={python:['# ',''],julia:['# ',''],css:['/* ',' */'],html:['<!-- ',' -->']}[cur]||['// ',''],at=a.trim(),bt=b.trim();
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
$('set').onclick=()=>{$('jurl').value=ls.jurl||'https://ce.judge0.com';$('jkey').value=ls.jkey||'';$('pyver').value=ls.pyver||'auto';$('dlgS').showModal()};
$('sno').onclick=()=>$('dlgS').close();
$('sok').onclick=()=>{
 try{ls.jurl=safeUrl($('jurl').value||'https://ce.judge0.com')}catch(e){alert(e.message);return}
 ls.jkey=$('jkey').value.trim();const pv=$('pyver').value;
 if(pv!==(ls.pyver||'auto')){ls.pyver=pv;pyIdx=0;if(py){py.terminate();py=null;pyReady=false;pyVer='';pyStat();prewarm()}}
 J0.list=null;CACHE.clear();$('dlgS').close()};

/* جداکننده قابل کشیدن */
$('gut').onpointerdown=e=>{const m=$('main'),f=$('prev');f.style.pointerEvents='none';e.preventDefault();
 const mv=ev=>m.style.setProperty('--lw',Math.min(80,Math.max(25,ev.clientX/m.clientWidth*100))+'%'),
 up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);f.style.pointerEvents=''};
 addEventListener('pointermove',mv);addEventListener('pointerup',up)};

/* تم‌ها */
const THEMES={bluepurple:'#0d1236',synthwave:'#1e0a34',constellation:'#0a1226',aurora:'#08161e',crt:'#160e00',syntaxrain:'#0e101c',light:'#f3f3f3',dark:'#1e1e1e',hacker:'#000',monokai:'#1e1f1c',dracula:'#21222c',nord:'#272c36',solarized:'#00212b',cyberpunk:'#12042f'};
function theme(t){if(t==='pixel')t='bluepurple';if(!THEMES[t])t='bluepurple';document.documentElement.dataset.theme=t;ls.theme=t;$('theme').value=t;if(typeof FX!=='undefined')FX.set(t);document.querySelector('meta[name=theme-color]').content=THEMES[t]}
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
 csharp:'Console WriteLine ReadLine Write ReadKey Linq Select Where ToList ToArray Sum Count OrderBy FirstOrDefault Parse TryParse Convert ToInt32 Math Sqrt Pow DateTime Now StringBuilder Append List Dictionary string args',
 rust:'println format vec macro_rules unwrap expect iter map filter collect len push String Vec Option Some None Result Ok Err Box',
 go:'fmt Println Printf Sprintf Sprint len make append range string strconv errors os bufio Scanner',
 julia:'println print push! pop! length size zeros ones rand sum map filter collect string parse typeof',
 carbon:'Core Print Run var let fn class returns',
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
theme(ls.theme||'bluepurple');setFz();applyI18n();{const hs=(location.hash||'').slice(1);load(LANGS[hs]?hs:LANGS[ls.lang]?ls.lang:'python')}
if(!(navigator.connection&&navigator.connection.saveData))(window.requestIdleCallback||setTimeout)(()=>prewarm(),2500);
