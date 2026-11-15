'use strict';
/* دستیار هوشمند کدخانه v3: بدون نصب، کلید رایگان، انتخاب خودکار سالم‌ترین سرویس (کمترین خطا) و جایگزینی هنگام خطا */
// مالک سایت: برای اینکه بازدیدکننده‌ها بدون کلید هم از دستیار استفاده کنند، آدرس پراکسی (proxy-worker.js) را اینجا بگذارید.
const AI_DEFAULT={proxy:{base:'',kind:'openai',model:''}};
const AI_T={
fa:{ai:"دستیار هوشمند",aiErr:"توضیح خطا",aiCode:"توضیح کد",aiFix:"رفع و بهبود",aiOpt:"بهینه‌سازی",aiPh:"سؤالت را بپرس…",aiProv:"سرویس",aiKey:"کلید API",aiModel:"مدل",aiGet:"گرفتن کلید رایگان ↗",aiRefresh:"↻ مدل‌ها",aiNote:"بدون نصب و دانلود. برای کمترین خطا کلید رایگان Groq و Cerebras و یکی از Mistral یا Gemini را بگذار؛ دستیار خودکار سالم‌ترین سرویس را انتخاب می‌کند و اگر یکی خطا داد یا به سقف رسید سراغ بعدی می‌رود. سرویس را انتخاب کن، «گرفتن کلید رایگان» را بزن و کلید را بچسبان. کلیدها فقط در مرورگر خودت می‌مانند. پاسخ‌ها ممکن است اشتباه باشند.",aiNeedKey:"هنوز کلیدی وارد نشده. ⚙ را بزن، یک سرویس رایگان انتخاب کن و کلیدش را بچسبان.",aiIns:"جایگذاری در ویرایشگر",aiCopy:"کپی",aiClear:"گفتگوی جدید",aiMem:"به‌خاطر سپردن کلیدها روی این دستگاه",aiPriv:"سطح رایگان Gemini و Mistral ممکن است از پیام‌های تو برای آموزش مدل استفاده کند. کد خصوصی نفرست."},
en:{ai:"AI assistant",aiErr:"Explain error",aiCode:"Explain code",aiFix:"Fix & improve",aiOpt:"Optimize",aiPh:"Ask a question…",aiProv:"Provider",aiKey:"API key",aiModel:"Model",aiGet:"Get a free key ↗",aiRefresh:"↻ Models",aiNote:"Nothing to install or download. Lowest error rate: add free keys for Groq + Cerebras + one of Mistral/Gemini; the assistant automatically uses the healthiest provider and switches if one fails or hits its limit. Pick a provider, click “Get a free key” and paste it here. Keys stay in your browser. Answers may be wrong.",aiNeedKey:"No key yet. Click ⚙, pick a free provider and paste its key.",aiIns:"Insert into editor",aiCopy:"Copy",aiClear:"New chat",aiMem:"Remember keys on this device",aiPriv:"Free Gemini/Mistral tiers may use your prompts for training. Don't send private code."},
ru:{ai:"ИИ-помощник",aiErr:"Объяснить ошибку",aiCode:"Объяснить код",aiFix:"Исправить и улучшить",aiOpt:"Оптимизировать",aiPh:"Задайте вопрос…",aiProv:"Сервис",aiKey:"API-ключ",aiModel:"Модель",aiGet:"Получить бесплатный ключ ↗",aiRefresh:"↻ Модели",aiNote:"Ничего устанавливать не нужно. Для минимума ошибок добавьте бесплатные ключи Groq + Cerebras + Mistral или Gemini: помощник сам выбирает самый надёжный сервис и переключается при сбое или лимите. Выберите сервис, нажмите «Получить бесплатный ключ» и вставьте ключ. Ключи хранятся только в вашем браузере. Ответы могут быть неверными.",aiNeedKey:"Ключа пока нет. Нажмите ⚙, выберите бесплатный сервис и вставьте ключ.",aiIns:"Вставить в редактор",aiCopy:"Копировать",aiClear:"Новый чат",aiMem:"Запомнить ключи на этом устройстве",aiPriv:"Бесплатные тарифы Gemini/Mistral могут использовать ваши запросы для обучения. Не отправляйте приватный код."},
fr:{ai:"Assistant IA",aiErr:"Expliquer l'erreur",aiCode:"Expliquer le code",aiFix:"Corriger et améliorer",aiOpt:"Optimiser",aiPh:"Posez une question…",aiProv:"Service",aiKey:"Clé API",aiModel:"Modèle",aiGet:"Obtenir une clé gratuite ↗",aiRefresh:"↻ Modèles",aiNote:"Rien à installer. Pour le moins d'erreurs, ajoutez des clés gratuites Groq + Cerebras + Mistral ou Gemini : l'assistant choisit automatiquement le service le plus fiable et bascule en cas d'échec ou de limite. Choisissez un service, cliquez sur « Obtenir une clé gratuite » et collez-la ici. Les clés restent dans votre navigateur. Les réponses peuvent être fausses.",aiNeedKey:"Pas encore de clé. Cliquez sur ⚙, choisissez un service gratuit et collez sa clé.",aiIns:"Insérer dans l'éditeur",aiCopy:"Copier",aiClear:"Nouveau chat",aiMem:"Mémoriser les clés sur cet appareil",aiPriv:"Les offres gratuites Gemini/Mistral peuvent utiliser vos requêtes pour l'entraînement. N'envoyez pas de code privé."},
ar:{ai:"المساعد الذكي",aiErr:"اشرح الخطأ",aiCode:"اشرح الكود",aiFix:"أصلح وحسّن",aiOpt:"حسّن الأداء",aiPh:"اكتب سؤالك…",aiProv:"الخدمة",aiKey:"مفتاح API",aiModel:"النموذج",aiGet:"احصل على مفتاح مجاني ↗",aiRefresh:"↻ النماذج",aiNote:"لا حاجة لتثبيت أي شيء. لأقل نسبة أخطاء أضف مفاتيح مجانية لـ Groq وCerebras وواحدة من Mistral أو Gemini؛ يختار المساعد تلقائياً الخدمة الأكثر استقراراً وينتقل إلى غيرها عند الفشل أو بلوغ الحد. اختر خدمة واضغط «احصل على مفتاح مجاني» والصق المفتاح هنا. تبقى المفاتيح في متصفحك فقط. قد تكون الإجابات خاطئة.",aiNeedKey:"لا يوجد مفتاح بعد. اضغط ⚙ واختر خدمة مجانية والصق مفتاحها.",aiIns:"إدراج في المحرر",aiCopy:"نسخ",aiClear:"محادثة جديدة",aiMem:"تذكّر المفاتيح على هذا الجهاز",aiPriv:"قد تستخدم الباقات المجانية من Gemini وMistral طلباتك في التدريب. لا ترسل كوداً خاصاً."},
fil:{ai:"AI assistant",aiErr:"Ipaliwanag ang error",aiCode:"Ipaliwanag ang code",aiFix:"Ayusin at pagandahin",aiOpt:"I-optimize",aiPh:"Magtanong…",aiProv:"Provider",aiKey:"API key",aiModel:"Model",aiGet:"Kumuha ng libreng key ↗",aiRefresh:"↻ Mga model",aiNote:"Walang i-install. Para sa pinakamababang error, magdagdag ng libreng key para sa Groq + Cerebras + isa sa Mistral/Gemini; awtomatikong pipiliin ng assistant ang pinakamaaasahang provider at lilipat kapag nag-fail o naabot ang limit. Pumili ng provider, i-click ang “Kumuha ng libreng key” at i-paste dito. Nananatili ang mga key sa browser mo. Maaaring mali ang mga sagot.",aiNeedKey:"Wala pang key. I-click ang ⚙, pumili ng libreng provider at i-paste ang key nito.",aiIns:"Ilagay sa editor",aiCopy:"Kopyahin",aiClear:"Bagong chat",aiMem:"Tandaan ang mga key sa device na ito",aiPriv:"Maaaring gamitin ng libreng tier ng Gemini/Mistral ang mga prompt mo sa training. Huwag magpadala ng pribadong code."},
hi:{ai:"AI सहायक",aiErr:"त्रुटि समझाएँ",aiCode:"कोड समझाएँ",aiFix:"ठीक करें और सुधारें",aiOpt:"ऑप्टिमाइज़ करें",aiPh:"कोई सवाल पूछें…",aiProv:"सेवा",aiKey:"API कुंजी",aiModel:"मॉडल",aiGet:"मुफ़्त कुंजी पाएँ ↗",aiRefresh:"↻ मॉडल",aiNote:"कुछ इंस्टॉल नहीं करना है। सबसे कम त्रुटि के लिए Groq + Cerebras + Mistral या Gemini की मुफ़्त कुंजियाँ जोड़ें; सहायक अपने आप सबसे भरोसेमंद सेवा चुनता है और विफल होने या सीमा आने पर दूसरी पर चला जाता है। सेवा चुनें, “मुफ़्त कुंजी पाएँ” दबाएँ और कुंजी यहाँ चिपकाएँ। कुंजियाँ सिर्फ़ आपके ब्राउज़र में रहती हैं। उत्तर गलत हो सकते हैं।",aiNeedKey:"अभी कोई कुंजी नहीं है। ⚙ दबाएँ, मुफ़्त सेवा चुनें और उसकी कुंजी चिपकाएँ।",aiIns:"एडिटर में डालें",aiCopy:"कॉपी",aiClear:"नई चैट",aiMem:"इस डिवाइस पर कुंजियाँ याद रखें",aiPriv:"Gemini/Mistral के मुफ़्त स्तर आपके प्रॉम्प्ट का उपयोग प्रशिक्षण के लिए कर सकते हैं। निजी कोड न भेजें।"},
id:{ai:"Asisten AI",aiErr:"Jelaskan error",aiCode:"Jelaskan kode",aiFix:"Perbaiki & tingkatkan",aiOpt:"Optimalkan",aiPh:"Ajukan pertanyaan…",aiProv:"Penyedia",aiKey:"Kunci API",aiModel:"Model",aiGet:"Dapatkan kunci gratis ↗",aiRefresh:"↻ Model",aiNote:"Tanpa instal. Untuk error paling sedikit, tambahkan kunci gratis Groq + Cerebras + Mistral atau Gemini; asisten otomatis memakai penyedia paling andal dan berpindah jika gagal atau mencapai batas. Pilih penyedia, klik “Dapatkan kunci gratis”, lalu tempel di sini. Kunci hanya tersimpan di browser Anda. Jawaban bisa saja salah.",aiNeedKey:"Belum ada kunci. Klik ⚙, pilih penyedia gratis, dan tempel kuncinya.",aiIns:"Sisipkan ke editor",aiCopy:"Salin",aiClear:"Obrolan baru",aiMem:"Ingat kunci di perangkat ini",aiPriv:"Paket gratis Gemini/Mistral dapat memakai prompt Anda untuk pelatihan. Jangan kirim kode pribadi."}
};
for(const l in AI_T)Object.assign(I18N[l],AI_T[l]);
const NAMES={fa:'Persian',en:'English',ru:'Russian',fr:'French',ar:'Arabic',fil:'Filipino',hi:'Hindi',id:'Indonesian'};
/* rank = اولویت پیش‌فرض بر پایه‌ی سقف رایگان و پایداری (Groq و Cerebras سقف روزانه‌ی بالاتری دارند؛ OpenRouter فقط ۵۰ درخواست در روز) */
const PROV={
 proxy:{n:'Site AI (no key needed)',kind:AI_DEFAULT.proxy.kind||'openai',base:AI_DEFAULT.proxy.base,model:AI_DEFAULT.proxy.model||'default',nokey:true,hide:!AI_DEFAULT.proxy.base,rank:0,alts:[]},
 groq:{n:'Groq (free)',kind:'openai',base:'https://api.groq.com/openai/v1',get:'https://console.groq.com/keys',model:'llama-3.3-70b-versatile',alts:['openai/gpt-oss-120b','llama-3.1-8b-instant'],pref:/gpt-oss|llama/i,kp:/^gsk_/,rank:1},
 cerebras:{n:'Cerebras (free)',kind:'openai',base:'https://api.cerebras.ai/v1',get:'https://cloud.cerebras.ai',model:'',alts:[],pref:/gpt-oss|llama/i,kp:/^csk-/,rank:2},
 mistral:{n:'Mistral (free tier)',kind:'openai',base:'https://api.mistral.ai/v1',get:'https://console.mistral.ai/api-keys',model:'mistral-small-latest',alts:['open-mistral-nemo','codestral-latest'],pref:/small|medium/i,priv:true,rank:3},
 gemini:{n:'Google Gemini (free)',kind:'openai',base:'https://generativelanguage.googleapis.com/v1beta/openai',get:'https://aistudio.google.com/apikey',model:'',alts:[],pref:/flash(?!-lite|-image|-tts)/i,kp:/^AIza/,priv:true,rank:4},
 openrouter:{n:'OpenRouter (free models)',kind:'openai',base:'https://openrouter.ai/api/v1',get:'https://openrouter.ai/keys',model:'meta-llama/llama-3.3-70b-instruct:free',alts:['qwen/qwen3-coder:free','openai/gpt-oss-120b:free','google/gemma-3-27b-it:free'],pref:/(coder|gpt-oss|qwen|llama|gemma).*:free$/i,onlyFree:true,kp:/^sk-or-/,rank:5},
 custom:{n:'Custom (OpenAI-compatible)',kind:'openai',base:'',get:'',custom:true,alts:[],rank:6},
 claude:{n:'Claude (Anthropic, paid)',kind:'claude',base:'https://api.anthropic.com',get:'https://console.anthropic.com/settings/keys',model:'claude-haiku-5-5',alts:['claude-sonnet-5-5'],pref:/haiku|sonnet/i,rank:7}
};
const ENV={
 python:'Python 3.14/3.15 running in the browser (Pyodide). Packages such as numpy and pandas install automatically on import; no graphical plots. input() is interactive in the terminal. customtkinter is emulated (CTk, CTkFrame, CTkLabel, CTkButton, CTkEntry, CTkTextbox, CTkCheckBox, CTkSwitch, CTkRadioButton, CTkSlider, CTkProgressBar, CTkComboBox, CTkOptionMenu, CTkSegmentedButton; pack/grid/place; StringVar/IntVar). Plain tkinter widgets, real files, network and threads are unavailable.',
 c:'C compiled with a recent GCC (-O2) on a remote sandbox; stdin is collected before the run.',
 cpp:'C++17 compiled with a recent GCC (-O2) on a remote sandbox; stdin is collected before the run.',
 java:'Java on a remote sandbox; the public class should be named Main (it is renamed automatically otherwise); stdin is collected before the run.',
 php:'PHP CLI on a remote sandbox; read input with fgets(STDIN).',
 javascript:'JavaScript: code without DOM access runs in a Web Worker; DOM code runs in a sandboxed iframe (phone preview). console.log goes to the terminal; no Node APIs.',
 html:'An HTML page rendered in a phone-sized preview; console output goes to the terminal.',
 css:'CSS applied to the sample HTML shown below the editor.',
 csharp:'C# (.NET) compiled on a remote sandbox with the newest available .NET; top-level statements are wrapped into Program.Main automatically; Console.ReadKey and real files/network are unavailable; stdin is collected before the run.',
 rust:'Rust stable via the Rust Playground (no stdin) or Compiler Explorer.',
 go:'Go via Compiler Explorer (or Judge0).',
 julia:'Julia via Compiler Explorer.',
 carbon:'Carbon is experimental; only very simple programs such as fn Run() { Core.Print(42); } are likely to work.'
};
const AIQ={
 err:'Explain the error in the terminal output: quote the failing line, explain the cause, and show the fix.',
 code:'Explain what my code does, step by step, for a beginner. Point out bugs or risky parts.',
 fix:'Find and fix the problems in my code. Return the complete corrected program in ONE code block, then 2-4 short bullet notes about what changed.',
 opt:'Optimize my code for speed and readability. Return the complete optimized program in ONE code block, then list what changed and why.'
};

/* ---------- تنظیمات، کلیدها و سلامت سرویس‌ها ---------- */
const jparse=(s,d)=>{try{return JSON.parse(s||'')||d}catch(e){return d}};
let AC=jparse(ls.aiCfg2,{});AC.k=AC.k||{};AC.h=AC.h||{};
AC.sel=PROV[AC.sel]&&!PROV[AC.sel].hide?AC.sel:(PROV.proxy.hide?'groq':'proxy');
let AK=Object.assign({},jparse(sessionStorage.aiKeys,{}),jparse(localStorage.aiKeys,{}));
for(const pid in AC.k)if(AC.k[pid]&&AC.k[pid].key){AK[pid]=AC.k[pid].key;delete AC.k[pid].key}   // مهاجرت از نسخه‌ی قبلی
const aiSave=()=>{
 ls.aiCfg2=JSON.stringify(AC);const mem=AC.mem!==false;
 (mem?localStorage:sessionStorage).aiKeys=JSON.stringify(AK);(mem?sessionStorage:localStorage).removeItem('aiKeys')};
aiSave();
const cfgOf=pid=>Object.assign({model:PROV[pid].model||'',base:PROV[pid].base||''},AC.k[pid],{key:AK[pid]||''});
const aiReady=pid=>{const p=PROV[pid],c=cfgOf(pid);return !!p&&!p.hide&&!!c.base&&(p.nokey||!!c.key)};
const hs=pid=>AC.h[pid]||(AC.h[pid]={ok:0,fail:0,cool:0});
function hit(pid,good,cool){
 const s=hs(pid);good?s.ok++:s.fail++;if(s.ok+s.fail>24){s.ok=Math.round(s.ok/2);s.fail=Math.round(s.fail/2)}
 if(cool)s.cool=Date.now()+cool;if(good)s.cool=0;aiSave()}
const aiScore=pid=>{const s=hs(pid);return(s.ok+1)/(s.ok+s.fail+2)+(pid===AC.sel?.15:0)};
/* ترتیب: سرویس‌های در حال استراحت (بعد از 429) آخر؛ بقیه بر اساس نرخ موفقیت اخیر، سپس اولویت پیش‌فرض */
function aiOrder(){
 const now=Date.now();
 return Object.keys(PROV).filter(aiReady).sort((a,b)=>{
  const ca=hs(a).cool>now,cb=hs(b).cool>now;if(ca!==cb)return ca?1:-1;
  const d=aiScore(b)-aiScore(a);return Math.abs(d)>.001?d:PROV[a].rank-PROV[b].rank})}
function authHeaders(pid,c){
 const h={};
 if(PROV[pid].kind==='claude'){if(c.key){h['x-api-key']=c.key;h['anthropic-version']='2023-06-01';h['anthropic-dangerous-direct-browser-access']='true'}}
 else if(c.key)h.authorization='Bearer '+c.key;
 return h}
function safeBase(u){u=String(u||'').trim();if(/^https:\/\/[^\s/]+/i.test(u)||/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(u))return u.replace(/\/+$/,'');throw new Error('HTTPS URL required (or http://localhost)')}
async function fetchModels(pid){
 const p=PROV[pid],c=cfgOf(pid),r=await fetch(c.base+(p.kind==='claude'?'/v1/models':'/models'),{headers:authHeaders(pid,c)});
 if(!r.ok)throw new Error('HTTP '+r.status+' '+(await r.text()).slice(0,120));
 const j=await r.json();let ids=(j.data||j.models||[]).map(m=>String(m.id||m.name||'').replace(/^models\//,'')).filter(Boolean);
 if(p.onlyFree)ids=ids.filter(i=>/:free$/.test(i));
 return ids}
function bestModel(pid,ids){
 const p=PROV[pid],pf=ids.filter(i=>p.pref&&p.pref.test(i)),pool=pf.length?pf:ids,sz=i=>{const m=i.match(/(\d+(?:\.\d+)?)b/i);return m?+m[1]:0};
 return pool.slice().sort((a,b)=>sz(b)-sz(a)||(a<b?1:-1))[0]}   // بزرگ‌ترین مدل؛ اگر اندازه نداشت، بالاترین نسخه
async function ensureModel(pid){
 const c=cfgOf(pid);if(c.model)return c.model;
 const ids=await fetchModels(pid),m=bestModel(pid,ids);if(!m)throw new Error('no models available for this key');
 AC.k[pid]=Object.assign({},AC.k[pid],{model:m});aiSave();return m}
const modelList=async pid=>{const m=await ensureModel(pid);return[m,...(PROV[pid].alts||[]).filter(x=>x!==m)].slice(0,3)};

/* ---------- ارتباط با سرویس‌ها ---------- */
async function aiStream(pid,model,msgs,on,sig){
 const p=PROV[pid],c=cfgOf(pid),claude=p.kind==='claude',h=Object.assign({'content-type':'application/json'},authHeaders(pid,c)),sys=aiSys();
 const body=claude?{model,system:sys,messages:msgs,stream:true,max_tokens:2000}:{model,messages:[{role:'system',content:sys},...msgs],stream:true,max_tokens:2000,temperature:.2};
 const ac=new AbortController();let timedOut=false,got=false;
 const onAbort=()=>ac.abort();if(sig){if(sig.aborted)ac.abort();else sig.addEventListener('abort',onAbort,{once:true})}
 const tm=setTimeout(()=>{timedOut=true;ac.abort()},25000);
 try{
  const r=await fetch(c.base+(claude?'/v1/messages':'/chat/completions'),{method:'POST',headers:h,body:JSON.stringify(body),signal:ac.signal});
  if(!r.ok){const e=new Error('HTTP '+r.status+' '+(await r.text()).slice(0,160));e.status=r.status;const ra=r.headers&&+r.headers.get('retry-after');if(ra)e.retry=Math.min(ra,300);throw e}
  const rd=r.body.getReader(),dec=new TextDecoder();let buf='';
  for(;;){
   const {done,value}=await rd.read();if(done)break;
   buf+=dec.decode(value,{stream:true});const rows=buf.split('\n');buf=rows.pop();
   for(const l of rows){
    if(!l.startsWith('data:'))continue;const d=l.slice(5).trim();if(!d||d==='[DONE]')continue;
    let j;try{j=JSON.parse(d)}catch(_){continue}
    if(j.error){const e=new Error(String(j.error.message||JSON.stringify(j.error)).slice(0,200));e.status=+j.error.code||502;throw e}
    const t=claude?(j.type==='content_block_delta'&&j.delta&&j.delta.text):(j.choices&&j.choices[0]&&j.choices[0].delta&&j.choices[0].delta.content);
    if(t){if(!got){got=true;clearTimeout(tm)}on(t)}}}
  if(!got){const e=new Error('empty response from '+p.n);e.status=502;throw e}
 }catch(e){if(timedOut&&!got){const x=new Error('timeout (25 s without a response)');x.status=504;throw x}throw e}
 finally{clearTimeout(tm);if(sig)sig.removeEventListener('abort',onAbort)}}
/* هر سرویس: تا ۳ مدل (سقف هر مدل جداست)؛ 401 = کلید نامعتبر، 429 = استراحت به اندازه‌ی Retry-After، 5xx/تایم‌اوت = سرویس بعدی */
async function runChain(msgs,on,note,sig){
 const ord=aiOrder();
 if(!ord.length){const e=new Error('NEED_KEY');e.needKey=true;throw e}
 let last,out=0;const cnt=t=>{out++;on(t)};
 for(let i=0;i<ord.length;i++){
  const pid=ord[i],p=PROV[pid];let models;
  try{models=await modelList(pid)}catch(e){last=e;hit(pid,false,3e4);note('↻ '+p.n+': '+e.message.slice(0,80));continue}
  for(const m of models){
   try{await aiStream(pid,m,msgs,cnt,sig);hit(pid,true);return pid}
   catch(e){
    if(e.name==='AbortError')throw e;last=e;if(out)throw e;
    const st=e.status||0;
    if(st===401||st===403){hit(pid,false,6e5);note('✗ '+p.n+': invalid or unauthorized key');break}
    if(st===429){hit(pid,false,(e.retry||60)*1e3);note('↻ '+p.n+' ('+m+'): rate limited');continue}
    if(st===400||st===404||st===422)continue;
    hit(pid,false,15e3);note('↻ '+p.n+': '+e.message.slice(0,80));break}}
  if(i<ord.length-1)note('→ '+PROV[ord[i+1]].n)}
 throw last}
const aiSys=()=>`You are CodeKhane's senior programming assistant inside an online IDE. Runtime of the current language: ${ENV[cur]||''} Be accurate, concise and practical. Reply in ${NAMES[ui]||'English'} but keep code, identifiers and error messages in English. Put code in fenced blocks with a language tag. When asked to fix, improve or optimize, return ONE complete runnable program in a single fenced block. Never invent library functions; prefer the standard library; if something is impossible in this sandbox, say so and offer the closest alternative.`;
function aiCtx(){
 const lim=[12000,4000],F='\`\`\`';
 return `Language: ${LANGS[cur].v}\nEditor code:\n${F}\n${ta.value.slice(0,lim[0])}\n${F}\nTerminal output:\n${F}\n${$('out').textContent.slice(-lim[1])}\n${F}`}

/* ---------- رابط ---------- */
const aiEl=document.createElement('aside');aiEl.id='ai';aiEl.hidden=true;
aiEl.innerHTML=`<div class="ah"><b data-i="ai"></b><span class="sp"></span><button id="aigear" title="⚙">⚙</button><button id="aiclr" data-i="aiClear"></button><button id="aix">✕</button></div>
<div id="aiset" hidden><label data-i="aiProv"></label><select id="aiprov"></select>
<a id="aiget" target="_blank" rel="noopener noreferrer" data-i="aiGet"></a><p id="aipriv" class="note" data-i="aiPriv" hidden></p>
<div id="aibasebox" hidden><label>URL</label><input id="aibase" dir="ltr"></div>
<div id="aikeybox"><label data-i="aiKey"></label><input id="aikey" type="password" dir="ltr" autocomplete="off" spellcheck="false"></div>
<label data-i="aiModel"></label><div class="aimrow"><input id="aimodel" dir="ltr" list="aiml"><button type="button" id="airef" data-i="aiRefresh"></button></div><datalist id="aiml"></datalist>
<label class="chk"><input type="checkbox" id="aimem"> <span data-i="aiMem"></span></label></div>
<div id="aim"></div><div id="aist" class="note"></div>
<div class="aq"><button data-q="err" data-i="aiErr"></button><button data-q="code" data-i="aiCode"></button><button data-q="fix" data-i="aiFix"></button><button data-q="opt" data-i="aiOpt"></button></div>
<div class="ain"><textarea id="aiin" rows="2"></textarea><button id="aisend" class="primary">↑</button></div>`;
document.body.append(aiEl);
const ab=document.createElement('button');ab.id='aibtn';ab.dataset.i='ai';$('keys').before(ab);
const box=$('aim');let aiCtl=null,aiBusy=false,aiHist=[];
$('aiprov').innerHTML=Object.keys(PROV).filter(p=>!PROV[p].hide).map(p=>`<option value="${p}">${esc(PROV[p].n)}</option>`).join('');
ab.onclick=()=>{aiEl.hidden=!aiEl.hidden;if(!aiEl.hidden){if(!box.children.length){bub('n',T().aiNote);if(!Object.keys(PROV).some(aiReady))$('aiset').hidden=false}$('aiin').focus()}};
$('aix').onclick=()=>{aiEl.hidden=true};
$('aigear').onclick=()=>{$('aiset').hidden=!$('aiset').hidden};
$('aiclr').onclick=()=>{aiHist=[];box.textContent=''};
addEventListener('keydown',e=>{if(e.altKey&&e.code==='KeyA'){e.preventDefault();ab.click()}});
KEYS.push(['Alt + A','ai']);
const _ap=applyI18n;applyI18n=()=>{_ap();$('aiin').placeholder=T().aiPh};
function aiFields(){
 const pid=AC.sel,p=PROV[pid],c=cfgOf(pid);$('aiprov').value=pid;
 $('aiget').hidden=!p.get;$('aiget').href=p.get||'#';$('aipriv').hidden=!p.priv;$('aikeybox').hidden=!!p.nokey;$('aibasebox').hidden=!p.custom;
 $('aikey').value=c.key;$('aibase').value=c.base;$('aimodel').value=c.model;$('aimem').checked=AC.mem!==false;$('aist').textContent=''}
function aiStore(){
 const pid=AC.sel,p=PROV[pid],st=$('aist'),key=$('aikey').value.trim();st.textContent='';
 if(p.custom){try{AC.k[pid]=Object.assign({},AC.k[pid],{base:safeBase($('aibase').value)})}catch(e){st.textContent='✗ '+e.message;return}}
 AC.k[pid]=Object.assign({},AC.k[pid],{model:$('aimodel').value.trim()});AK[pid]=key;
 if(key&&p.kp&&!p.kp.test(key))st.textContent='⚠ this does not look like a '+p.n.replace(/ \(.*/,'')+' key';
 aiSave()}
$('aiprov').onchange=()=>{AC.sel=$('aiprov').value;aiSave();aiFields()};
['aikey','aimodel','aibase'].forEach(id=>$(id).onchange=aiStore);
$('aimem').onchange=()=>{AC.mem=$('aimem').checked;aiSave()};
$('airef').onclick=async()=>{
 aiStore();const pid=AC.sel,st=$('aist');st.textContent='…';
 try{const ids=await fetchModels(pid);$('aiml').innerHTML=ids.map(i=>`<option value="${esc(i)}">`).join('');
  const c=cfgOf(pid);if(!c.model||!ids.includes(c.model)){AC.k[pid]=Object.assign({},AC.k[pid],{model:bestModel(pid,ids)});aiSave();$('aimodel').value=AC.k[pid].model}
  st.textContent='✓ '+ids.length+' models · key OK'}
 catch(e){st.textContent='✗ '+e.message}};

/* ---------- گفتگو ---------- */
function bub(k,t){const d=document.createElement('div');d.className='am '+k;d.textContent=t;box.append(d);box.scrollTop=1e9;return d}
function inl(el,t){
 t.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/).forEach(s=>{if(!s)return;let n;
  if(s.length>4&&s.startsWith('**')&&s.endsWith('**')){n=document.createElement('b');n.textContent=s.slice(2,-2)}
  else if(s.length>2&&s[0]==='`'&&s.endsWith('`')){n=document.createElement('code');n.className='ic';n.textContent=s.slice(1,-1)}
  else n=document.createTextNode(s);el.append(n)})}
function render(el,t){
 el.textContent='';let last=0;
 t.replace(/```(\w*)\n?([\s\S]*?)(?:```|$)/g,(m,lang,code,i)=>{
  if(i>last)inl(el,t.slice(last,i));last=i+m.length;
  const w=document.createElement('div'),pre=document.createElement('pre'),c=document.createElement('code'),b=document.createElement('div'),
   ib=document.createElement('button'),cb=document.createElement('button');
  w.className='acw';pre.className='ac';b.className='ab';c.textContent=code.replace(/\n$/,'');pre.append(c);
  ib.textContent=T().aiIns;ib.onclick=()=>{snap();ta.focus();ta.setSelectionRange(0,ta.value.length);skipS=true;ins(c.textContent)};
  cb.textContent=T().aiCopy;cb.onclick=()=>navigator.clipboard.writeText(c.textContent);
  b.append(ib,cb);w.append(pre,b);el.append(w);return m});
 if(last<t.length)inl(el,t.slice(last))}
async function ask(text){
 if(aiBusy||!text.trim())return;
 aiHist.push({role:'user',content:text});bub('u',text);
 const el=bub('a','…');let out='',ok=false;aiBusy=true;aiCtl=new AbortController();$('aisend').textContent='■';
 let h=aiHist.slice(-8);while(h.length&&h[0].role!=='user')h.shift();
 const msgs=h.map((m,i)=>i===h.length-1?{role:'user',content:m.content+'\n\n'+aiCtx()}:m);
 const on=t=>{out+=t;el.textContent=out;box.scrollTop=1e9};
 try{await runChain(msgs,on,n=>bub('n',n),aiCtl.signal);ok=!!out}
 catch(e){
  if(e.name==='AbortError')ok=!!out;
  else if(e.needKey){out=T().aiNeedKey;$('aiset').hidden=false}
  else{out+=(out?'\n':'')+'Error: '+e.message;el.classList.add('er')}}
 if(ok)aiHist.push({role:'assistant',content:out});else aiHist.pop();
 render(el,out);aiBusy=false;$('aisend').textContent='↑'}
aiEl.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>ask(AIQ[b.dataset.q]));
function aiSend(){if(aiBusy){aiCtl.abort();return}const v=$('aiin').value;$('aiin').value='';ask(v)}
$('aisend').onclick=aiSend;
$('aiin').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();aiSend()}});
aiFields();applyI18n();
