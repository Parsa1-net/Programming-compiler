'use strict';
/* Pixel Account: ورود، پروفایل و ذخیره‌ی پروژه با Supabase.
   فقط کلید عمومی در مرورگر است؛ امنیت داده را RLS در پایگاه داده تأمین می‌کند (supabase-schema.sql). */
const PXT={
fa:{brand:'حساب پیکسلی',login:'ورود',register:'ثبت‌نام',logout:'خروج',logoutAll:'خروج از همه‌ی دستگاه‌ها',email:'ایمیل',password:'رمز عبور',pass2:'تکرار رمز عبور',username:'نام کاربری',display:'نام نمایشی',forgot:'رمز عبور را فراموش کرده‌ام',haveAcc:'حساب دارید؟ وارد شوید',noAcc:'حساب ندارید؟ ثبت‌نام کنید',sendReset:'ارسال لینک بازیابی',newPass:'رمز عبور جدید',setPass:'ثبت رمز جدید',resend:'ارسال دوباره‌ی ایمیل تأیید',profile:'پروفایل',projects:'پروژه‌ها',settings:'تنظیمات حساب',avatar:'تصویر پروفایل',pick:'انتخاب تصویر',member:'تاریخ عضویت',verified:'ایمیل تأیید شده ✓',unverifiedS:'ایمیل هنوز تأیید نشده',save:'ذخیره',saveProj:'ذخیره‌ی کد فعلی به‌عنوان پروژه‌ی جدید',projName:'نام پروژه',open:'باز کردن',rename:'تغییر نام',del:'حذف',noProj:'هنوز پروژه‌ای ندارید.',pushS:'ذخیره‌ی تنظیمات من در حساب',pullS:'بارگیری تنظیمات از حساب',setupMsg:'حساب پیکسلی هنوز تنظیم نشده. آدرس و کلید عمومی Supabase را در pixel-config.js بگذارید (به README نگاه کنید).',badKey:'کلید مخفی (secret / service_role) در pixel-config.js است. فوراً آن را بردارید و کلید را در Supabase بچرخانید؛ فقط کلید عمومی مجاز است.',checkMail:'ایمیل تأیید ارسال شد. صندوق ورودی (و هرزنامه) را بررسی کنید.',resetSent:'اگر این ایمیل ثبت شده باشد، لینک بازیابی برایش ارسال شد.',exists:'این ایمیل قبلاً ثبت شده است.',badCred:'ایمیل یا رمز عبور اشتباه است.',unverified:'ایمیل شما هنوز تأیید نشده است.',weak:'رمز عبور باید حداقل ۸ کاراکتر باشد.',mismatch:'رمزها یکسان نیستند.',unameRule:'نام کاربری: ۳ تا ۲۰ حرف انگلیسی، عدد یا _',taken:'این نام کاربری گرفته شده است.',free:'قابل استفاده ✓',saved:'ذخیره شد ✓',emailOk:'ایمیل تأیید شد ✓',passChanged:'رمز عبور تغییر کرد ✓',confirmDel:'این پروژه حذف شود؟',tooMany:'تعداد تلاش‌ها زیاد است؛ کمی بعد دوباره امتحان کنید.',generic:'خطا:',needLogin:'برای ذخیره‌ی پروژه ابتدا وارد شوید.',cloudSaved:'در حساب شما ذخیره شد ✓',loaded:'پروژه بارگذاری شد ✓',imgBad:'تصویر PNG، JPEG یا WebP حداکثر ۵ مگابایت انتخاب کنید.',loading:'در حال بارگذاری…',pxSave:'ذخیره‌ی پروژه در حساب'},
en:{brand:'Pixel Account',login:'Log in',register:'Sign up',logout:'Log out',logoutAll:'Log out of all devices',email:'Email',password:'Password',pass2:'Repeat password',username:'Username',display:'Display name',forgot:'Forgot password?',haveAcc:'Have an account? Log in',noAcc:'No account? Sign up',sendReset:'Send reset link',newPass:'New password',setPass:'Set new password',resend:'Resend confirmation email',profile:'Profile',projects:'Projects',settings:'Account settings',avatar:'Profile picture',pick:'Choose image',member:'Member since',verified:'Email verified ✓',unverifiedS:'Email not verified yet',save:'Save',saveProj:'Save current code as a new project',projName:'Project name',open:'Open',rename:'Rename',del:'Delete',noProj:'No projects yet.',pushS:'Save my settings to account',pullS:'Load settings from account',setupMsg:'Pixel Account is not configured yet. Put your Supabase URL and public key in pixel-config.js (see README).',badKey:'A secret (service_role) key is in pixel-config.js. Remove it now and rotate the key in Supabase; only the public key is allowed.',checkMail:'Confirmation email sent. Check your inbox (and spam).',resetSent:'If this email is registered, a reset link was sent.',exists:'This email is already registered.',badCred:'Wrong email or password.',unverified:'Your email is not confirmed yet.',weak:'Password must be at least 8 characters.',mismatch:'Passwords do not match.',unameRule:'Username: 3–20 letters, digits or _',taken:'This username is taken.',free:'Available ✓',saved:'Saved ✓',emailOk:'Email confirmed ✓',passChanged:'Password changed ✓',confirmDel:'Delete this project?',tooMany:'Too many attempts. Try again later.',generic:'Error:',needLogin:'Log in to save projects.',cloudSaved:'Saved to your account ✓',loaded:'Project loaded ✓',imgBad:'Choose a PNG, JPEG or WebP image up to 5 MB.',loading:'Loading…',pxSave:'Save project to account'}
};
// روسی، فرانسوی و عربی فعلاً برای متن‌های حساب کاربری به انگلیسی برمی‌گردند
const P=k=>(PXT[ui]&&PXT[ui][k])||PXT.en[k]||k;
for(const l in I18N)I18N[l].pxSave=(PXT[l]||PXT.en).pxSave;

const PX=window.PIXEL||{};
const isSecret=k=>{if(/^sb_secret_/.test(k))return true;try{return JSON.parse(atob(k.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='service_role'}catch(e){return false}};
const pxBad=!!(PX.key&&isSecret(PX.key));
const pxReady=!!(window.supabase&&PX.url&&PX.key&&!/YOUR-/.test(PX.url+PX.key)&&!pxBad);
const REDIR=location.origin+location.pathname;
let px=null,user=null,prof=null,projId=null,recovering=false,applied=false,quiet=false,view='login',syncT=0,ut=0;
let fromLink=/[?&](code|error)=/.test(location.search);

/* ---------- ساخت رابط ---------- */
const dlg=document.createElement('dialog');dlg.id='pxd';dlg.className='px';
dlg.innerHTML=`<div class="pxh"><svg width="24" height="24" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><g transform="translate(.35 .35)" fill="#7c3aed"><path d="M1 0h6v1H1zM1 1h1v6H1zM6 1h1v3H6zM1 3h6v1H1z"/></g><path fill="#00e5ff" d="M1 0h6v1H1zM1 1h1v6H1zM6 1h1v3H6zM1 3h6v1H1z"/></svg><b data-p="brand"></b><span class="sp" style="flex:1"></span><button type="button" id="pxx" aria-label="close">✕</button></div>
<div id="pxmsg" role="status" aria-live="polite"></div>
<div class="pxv" data-v="setup"><p id="pxsetup"></p></div>
<form class="pxv" data-v="login" id="fLogin" novalidate><label data-p="email"></label><input id="lg_email" type="email" autocomplete="email"><label data-p="password"></label><input id="lg_pass" type="password" autocomplete="current-password"><button class="pxb" data-p="login"></button><button type="button" class="lnk" id="pxresend" hidden data-p="resend"></button><div><button type="button" class="lnk" data-go="forgot" data-p="forgot"></button></div><div><button type="button" class="lnk" data-go="register" data-p="noAcc"></button></div></form>
<form class="pxv" data-v="register" id="fReg" novalidate><label data-p="username"></label><input id="rg_user" type="text" autocomplete="username" maxlength="20"><div class="pxhint" id="rg_hint"></div><label data-p="display"></label><input id="rg_name" type="text" maxlength="40"><label data-p="email"></label><input id="rg_email" type="email" autocomplete="email"><label data-p="password"></label><input id="rg_pass" type="password" autocomplete="new-password"><div class="pxs"><i id="rg_bar"></i></div><label data-p="pass2"></label><input id="rg_pass2" type="password" autocomplete="new-password"><button class="pxb" data-p="register"></button><div><button type="button" class="lnk" data-go="login" data-p="haveAcc"></button></div></form>
<form class="pxv" data-v="forgot" id="fForgot" novalidate><label data-p="email"></label><input id="fg_email" type="email" autocomplete="email"><button class="pxb" data-p="sendReset"></button><div><button type="button" class="lnk" data-go="login" data-p="haveAcc"></button></div></form>
<form class="pxv" data-v="recover" id="fRec" novalidate><label data-p="newPass"></label><input id="rc_pass" type="password" autocomplete="new-password"><div class="pxs"><i id="rc_bar"></i></div><label data-p="pass2"></label><input id="rc_pass2" type="password" autocomplete="new-password"><button class="pxb" data-p="setPass"></button></form>
<div id="pxacc" data-v="acc" hidden>
 <div class="pxtabs"><button type="button" data-t="profile" data-p="profile"></button><button type="button" data-t="projects" data-p="projects"></button><button type="button" data-t="settings" data-p="settings"></button><span class="sp"></span><button type="button" id="pxout" data-p="logout"></button></div>
 <div class="pxs2" data-s="profile"><div class="pxprof"><span id="pxavbox"></span><div><button type="button" class="pxb" id="pxpick" style="margin:0;padding:6px 12px" data-p="pick"></button><input type="file" id="pxfile" accept="image/png,image/jpeg,image/webp" hidden></div></div>
  <label data-p="display"></label><input id="pf_name" type="text" maxlength="40"><label data-p="username"></label><input id="pf_user" type="text" maxlength="20"><div class="pxhint" id="pf_hint"></div>
  <label data-p="email"></label><input id="pf_email" type="text" readonly><div class="pxbadge" id="pf_ver"></div>
  <label data-p="member"></label><input id="pf_date" type="text" readonly><button type="button" class="pxb" id="pfsave" data-p="save"></button></div>
 <div class="pxs2" data-s="projects" hidden><label data-p="projName"></label><div class="pxrow"><input id="pj_name" type="text" maxlength="80"><button type="button" class="pxb" id="pjsave" data-p="save"></button></div><div class="pxhint" data-p="saveProj"></div><div id="pjlist"></div></div>
 <div class="pxs2" data-s="settings" hidden><p class="pxhint" id="pxsum"></p><button type="button" class="pxb" id="spush" data-p="pushS"></button><button type="button" class="pxb" id="spull" data-p="pullS" style="background:#151b4a"></button><button type="button" class="pxb" id="pxall" data-p="logoutAll" style="background:#151b4a;border-color:#ff5c8a"></button></div>
</div>`;
document.body.append(dlg);
const $d=id=>dlg.querySelector('#'+id),chip=document.createElement('button');chip.id='pxbtn';chip.type='button';$('theme').before(chip);

function msg(t,k){const m=$d('pxmsg');m.textContent=t||'';m.className=t?k||'err':''}
function show(v){view=v;msg('');dlg.querySelectorAll('[data-v]').forEach(x=>x.hidden=x.dataset.v!==v)}
function openPx(v){if(!pxReady)v='setup';else if(v==='acc'&&!user)v='login';show(v);if(v==='acc'){tab('profile');fillAcc()}if(!dlg.open)dlg.showModal()}
function tab(n){dlg.querySelectorAll('[data-s]').forEach(x=>x.hidden=x.dataset.s!==n);dlg.querySelectorAll('.pxtabs [data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===n));if(n==='projects')guard(null,listProj);if(n==='settings')sumSettings()}
function pxApply(){dlg.querySelectorAll('[data-p]').forEach(e=>e.textContent=P(e.dataset.p));$d('pxsetup').textContent=pxBad?P('badKey'):P('setupMsg');drawChip();if(user&&prof)fillAcc()}
function avatarEl(s){
 const ok=prof&&prof.avatar_url&&prof.avatar_url.startsWith(PX.url);let e;
 if(ok){e=document.createElement('img');e.src=prof.avatar_url;e.alt=''}
 else{e=document.createElement('div');e.textContent=((prof&&(prof.display_name||prof.username))||'?').trim().charAt(0).toUpperCase()}
 e.className='pxav';e.style.setProperty('--s',s+'px');return e}
function drawChip(){chip.textContent='';chip.classList.toggle('in',!!(user&&prof));
 if(user&&prof){const s=document.createElement('span');s.textContent=prof.display_name||prof.username;chip.append(avatarEl(22),s)}
 else chip.textContent=P('login')+' / '+P('register')}
function fillAcc(){if(!prof||!user)return;
 const b=$d('pxavbox');b.textContent='';b.append(avatarEl(64));
 $d('pf_name').value=prof.display_name||'';$d('pf_user').value=prof.username;$d('pf_email').value=user.email||'';
 $d('pf_date').value=new Date(prof.created_at).toLocaleDateString(ui);
 const v=$d('pf_ver'),ok=!!user.email_confirmed_at;v.textContent=ok?P('verified'):P('unverifiedS');v.classList.toggle('no',!ok)}

/* ---------- کمکی‌ها ---------- */
function errMsg(e){
 const c=((e&&e.code)||'')+' '+((e&&e.message)||'');
 if(/invalid_credentials|Invalid login/i.test(c))return P('badCred');
 if(/email_not_confirmed|not confirmed/i.test(c))return P('unverified');
 if(/user_already_exists|already registered/i.test(c))return P('exists');
 if(/weak_password|at least \d+ char/i.test(c))return P('weak');
 if(/rate_limit|too many|429/i.test(c)||(e&&e.status===429))return P('tooMany');
 return P('generic')+' '+((e&&e.message)||e)}
async function guard(btn,fn){if(btn&&btn.disabled)return;if(btn)btn.disabled=true;try{await fn()}catch(e){msg(errMsg(e),'err')}finally{if(btn)btn.disabled=false}}
const strength=p=>Math.min(4,(p.length>=8)+(p.length>=12)+(/[a-z]/.test(p)&&/[A-Z]/.test(p))+/\d/.test(p)+/[^A-Za-z0-9]/.test(p));
function meter(inp,bar){inp.addEventListener('input',()=>{const s=strength(inp.value);bar.style.width=s*25+'%';bar.style.background=['#ff5c8a','#ff5c8a','#ffb86c','#3ef0c4','#00e5ff'][s]})}
function watchUser(inp,hint,own){inp.addEventListener('input',()=>{
 clearTimeout(ut);const v=inp.value.trim();hint.className='pxhint';
 if(!v||(own&&prof&&v.toLowerCase()===prof.username.toLowerCase())){hint.textContent='';return}
 if(!/^[A-Za-z0-9_]{3,20}$/.test(v)){hint.textContent=P('unameRule');hint.classList.add('err');return}
 ut=setTimeout(async()=>{const {data}=await px.rpc('username_available',{u:v});if(inp.value.trim()!==v)return;hint.textContent=data?P('free'):P('taken');hint.classList.add(data?'ok':'err')},400)})}

/* ---------- ثبت‌نام و ورود ---------- */
async function doRegister(){
 const u=$d('rg_user').value.trim(),n=$d('rg_name').value.trim()||u,e=$d('rg_email').value.trim(),p=$d('rg_pass').value;
 if(!/^[A-Za-z0-9_]{3,20}$/.test(u))return msg(P('unameRule'));
 if(!e)return msg(P('email'));
 if(p.length<8)return msg(P('weak'));
 if(p!==$d('rg_pass2').value)return msg(P('mismatch'));
 const {data:free,error:e1}=await px.rpc('username_available',{u});if(e1)throw e1;if(!free)return msg(P('taken'));
 const {data,error}=await px.auth.signUp({email:e,password:p,options:{data:{username:u,display_name:n.slice(0,40)},emailRedirectTo:REDIR}});
 if(error)throw error;
 if(data.user&&data.user.identities&&data.user.identities.length===0)return msg(P('exists'));
 if(!data.session){msg(P('checkMail'),'ok');$d('rg_pass').value=$d('rg_pass2').value=''}}
async function doLogin(){
 const em=$d('lg_email').value.trim(),{error}=await px.auth.signInWithPassword({email:em,password:$d('lg_pass').value});
 if(error){$d('pxresend').hidden=!/email_not_confirmed|not confirmed/i.test((error.code||'')+error.message);throw error}
 $d('lg_pass').value=''}
async function doForgot(){
 const {error}=await px.auth.resetPasswordForEmail($d('fg_email').value.trim(),{redirectTo:REDIR});
 if(error&&(error.status===429||/rate/i.test(error.message)))throw error;msg(P('resetSent'),'ok')}
async function doRecover(){
 const p=$d('rc_pass').value;if(p.length<8)return msg(P('weak'));if(p!==$d('rc_pass2').value)return msg(P('mismatch'));
 const {error}=await px.auth.updateUser({password:p});if(error)throw error;
 recovering=false;$d('rc_pass').value=$d('rc_pass2').value='';openPx('acc');msg(P('passChanged'),'ok')}

/* ---------- پروفایل ---------- */
async function loadProfile(){
 const {data,error}=await px.from('profiles').select('*').eq('id',user.id).maybeSingle();
 if(error){msg(errMsg(error));return}prof=data;
 if(prof&&!applied){applied=true;applySettings(prof.settings||{})}}
async function saveProfile(){
 const n=$d('pf_name').value.trim().slice(0,40),u=$d('pf_user').value.trim();
 if(!/^[A-Za-z0-9_]{3,20}$/.test(u))return msg(P('unameRule'));
 const {data,error}=await px.from('profiles').update({display_name:n||u,username:u}).eq('id',user.id).select().single();
 if(error){if(error.code==='23505')return msg(P('taken'));throw error}
 prof=data;drawChip();fillAcc();msg(P('saved'),'ok')}
async function setAvatar(f){
 if(!f||!/^image\/(png|jpeg|webp)$/.test(f.type)||f.size>5e6)return msg(P('imgBad'));
 const bmp=await createImageBitmap(f),S=256,c=document.createElement('canvas');c.width=c.height=S;
 const m=Math.min(bmp.width,bmp.height);c.getContext('2d').drawImage(bmp,(bmp.width-m)/2,(bmp.height-m)/2,m,m,0,0,S,S);
 const blob=await new Promise(r=>c.toBlob(r,'image/webp',.85)),path=user.id+'/avatar';
 const {error}=await px.storage.from('avatars').upload(path,blob,{upsert:true,contentType:blob.type,cacheControl:'3600'});if(error)throw error;
 const url=px.storage.from('avatars').getPublicUrl(path).data.publicUrl+'?v='+Date.now();
 const {data,error:e2}=await px.from('profiles').update({avatar_url:url}).eq('id',user.id).select().single();if(e2)throw e2;
 prof=data;fillAcc();drawChip();msg(P('saved'),'ok')}

/* ---------- تنظیمات شخصی ---------- */
function applySettings(s){quiet=true;
 if(s.theme==='pixel')s.theme='bluepurple';if(s.theme&&THEMES[s.theme])theme(s.theme);
 if(s.ui&&I18N[s.ui]){ui=s.ui;ls.ui=ui;applyI18n()}
 if(s.fz>=10&&s.fz<=26){fz=+s.fz;setFz()}
 quiet=false}
const curSettings=()=>({theme:ls.theme||'bluepurple',ui,fz:+ls.fz||14});
function sumSettings(){const s=curSettings();$d('pxsum').textContent=`${s.theme} · ${s.ui} · ${s.fz}px`}
async function pushSettings(){const {data,error}=await px.from('profiles').update({settings:curSettings()}).eq('id',user.id).select().single();if(error)throw error;prof=data;msg(P('saved'),'ok')}
function schedSync(){if(quiet||!user||!prof)return;clearTimeout(syncT);syncT=setTimeout(()=>{px.from('profiles').update({settings:curSettings()}).eq('id',user.id).then(()=>{})},1500)}

/* ---------- پروژه‌ها ---------- */
async function listProj(){
 const l=$d('pjlist');l.textContent=P('loading');
 const {data,error}=await px.from('projects').select('id,name,language,updated_at').order('updated_at',{ascending:false});
 l.textContent='';if(error)throw error;if(!data.length){l.textContent=P('noProj');return}
 for(const p of data){
  const r=document.createElement('div'),t=document.createElement('div'),b=document.createElement('b'),s=document.createElement('span');
  r.className='pjr'+(p.id===projId?' on':'');b.textContent=p.name;
  s.textContent=(LANGS[p.language]?LANGS[p.language].v.split(' ')[0]:p.language)+' · '+new Date(p.updated_at).toLocaleString(ui);
  t.append(b,s);r.append(t);
  for(const [k,f] of [['open',()=>openProj(p.id)],['rename',()=>renameProj(p)],['del',()=>delProj(p)]]){
   const x=document.createElement('button');x.type='button';x.textContent=P(k);x.onclick=()=>guard(x,f);r.append(x)}
  l.append(r)}}
async function openProj(id){
 const {data:p,error}=await px.from('projects').select('*').eq('id',id).single();if(error)throw error;
 if(!LANGS[p.language])return;
 snap();save();load(p.language);ta.value=p.code;if(p.language==='css')$('html').value=p.html||'';
 paint();save();projId=p.id;dlg.close();toast(P('loaded'))}
async function renameProj(p){const n=(prompt(P('projName'),p.name)||'').trim().slice(0,80);if(!n)return;
 const {error}=await px.from('projects').update({name:n}).eq('id',p.id);if(error)throw error;listProj()}
async function delProj(p){if(!confirm(P('confirmDel')))return;
 const {error}=await px.from('projects').delete().eq('id',p.id);if(error)throw error;if(projId===p.id)projId=null;listProj()}
async function saveProject(name){
 if(!pxReady||!user){toast(P('needLogin'));openPx('login');return}
 const row={code:ta.value,html:cur==='css'?$('html').value:null};
 if(projId){
  const {data,error}=await px.from('projects').update(row).eq('id',projId).select('id');if(error)throw error;
  if(data&&data.length){toast(P('cloudSaved'));return}projId=null}
 name=(name||prompt(P('projName'),LANGS[cur].n)||'').trim().slice(0,80);if(!name)return;
 const {data,error}=await px.from('projects').insert({name,language:cur,...row}).select('id').single();if(error)throw error;
 projId=data.id;toast(P('cloudSaved'));if(dlg.open&&!$d('pxacc').hidden)listProj()}

/* ---------- اتصال رویدادها ---------- */
chip.onclick=()=>openPx(user?'acc':'login');
$d('pxx').onclick=()=>dlg.close();
dlg.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
dlg.querySelectorAll('.pxtabs [data-t]').forEach(b=>b.onclick=()=>tab(b.dataset.t));
const submit=(id,fn)=>{const f=$d(id);f.onsubmit=e=>{e.preventDefault();guard(f.querySelector('.pxb'),fn)}};
submit('fLogin',doLogin);submit('fReg',doRegister);submit('fForgot',doForgot);submit('fRec',doRecover);
$d('pxresend').onclick=e=>guard(e.target,async()=>{const {error}=await px.auth.resend({type:'signup',email:$d('lg_email').value.trim(),options:{emailRedirectTo:REDIR}});if(error)throw error;msg(P('checkMail'),'ok')});
$d('pxout').onclick=e=>guard(e.target,async()=>{await px.auth.signOut();dlg.close()});
$d('pxall').onclick=e=>guard(e.target,async()=>{await px.auth.signOut({scope:'global'});dlg.close()});
$d('pfsave').onclick=e=>guard(e.target,saveProfile);
$d('pxpick').onclick=()=>$d('pxfile').click();
$d('pxfile').onchange=e=>{const f=e.target.files[0];e.target.value='';guard(null,()=>setAvatar(f))};
$d('pjsave').onclick=e=>guard(e.target,async()=>{projId=null;await saveProject($d('pj_name').value.trim()||undefined);$d('pj_name').value=''});
$d('spush').onclick=e=>guard(e.target,pushSettings);
$d('spull').onclick=e=>guard(e.target,async()=>{await loadProfile();applySettings((prof&&prof.settings)||{});sumSettings();msg(P('saved'),'ok')});

KEYS.push(['Alt + P','pxSave']);
addEventListener('keydown',e=>{if(e.altKey&&e.code==='KeyP'){e.preventDefault();saveProject().catch(x=>toast(errMsg(x)))}});
const _th=theme;theme=t=>{_th(t);schedSync()};
const _ap=applyI18n;applyI18n=()=>{_ap();pxApply()};
['ui'].forEach(id=>$(id).addEventListener('change',schedSync));$('fs').addEventListener('click',schedSync);$('fs2').addEventListener('click',schedSync);
$('lang').addEventListener('change',()=>{projId=null});

if(pxReady){
 px=window.supabase.createClient(PX.url,PX.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});
 meter($d('rg_pass'),$d('rg_bar'));meter($d('rc_pass'),$d('rc_bar'));
 watchUser($d('rg_user'),$d('rg_hint'),false);watchUser($d('pf_user'),$d('pf_hint'),true);
 px.auth.onAuthStateChange((ev,s)=>{
  const nu=s?s.user:null,changed=(nu&&nu.id)!==(user&&user.id);user=nu;
  setTimeout(async()=>{ // نباید داخل خود callback به supabase درخواست داد
   if(ev==='PASSWORD_RECOVERY'){recovering=true;openPx('recover');return}
   if(user&&(changed||!prof)){await loadProfile();if(fromLink&&ev==='SIGNED_IN'){toast(P('emailOk'));fromLink=false}}
   if(!user){prof=null;projId=null;applied=false}
   drawChip();
   if(user&&dlg.open&&!recovering&&['login','register','forgot'].includes(view))openPx('acc');
   if(!user&&dlg.open&&view==='acc')openPx('login')},0)})}
pxApply();
{ // لینک ایمیل منقضی یا نامعتبر: خطا را نشان بده
 const q=new URLSearchParams(location.search.slice(1)+'&'+location.hash.slice(1)).get('error_description');
 if(q&&pxReady)setTimeout(()=>{openPx('login');msg(P('generic')+' '+q)},300)}
