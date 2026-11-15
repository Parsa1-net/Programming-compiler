/* پنجره‌ی گرافیکی شبیه CustomTkinter: رندر در DOM (منطق برنامه در پایتون اجرا می‌شود) */
const GT={blue:[['#3b8ed0','#1f6aa5'],['#36719f','#144870']],green:[['#2cc985','#2fa572'],['#0c955a','#106a43']],'dark-blue':[['#3a7ebf','#1f538d'],['#325882','#14375e']]};
const GUI={els:{},kids:{},lay:{},gc:{},par:{},mode:'dark',theme:'blue',timers:[]};
const gsend=(id,type,val)=>{if(typeof py!=='undefined'&&py)py.postMessage({k:'ev',id,type,value:JSON.stringify(val===undefined?null:val)})};
const gcol=v=>Array.isArray(v)?v[GUI.mode==='light'?0:1]:v;
const gel=(t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e};
function guiReset(){
 GUI.timers.forEach(clearTimeout);Object.assign(GUI,{els:{},kids:{},lay:{},gc:{},par:{},timers:[]});
 const w=document.getElementById('guiwin');if(w)w.textContent='';document.body.dataset.gui=''}
function gtheme(){
 const w=document.querySelector('#guiwin .gw');if(!w)return;
 const L=GUI.mode==='light',a=GT[GUI.theme]||GT.blue,s=w.style,i=L?0:1;
 s.setProperty('--gb',L?'#ebebeb':'#242424');s.setProperty('--gf',L?'#dbdbdb':'#2b2b2b');s.setProperty('--gt',L?'#1a1a1a':'#dce4ee');
 s.setProperty('--gi',L?'#f9f9fa':'#343638');s.setProperty('--gd',L?'#979da2':'#565b5e');s.setProperty('--ga',a[0][i]);s.setProperty('--gh',a[1][i])}
const px_=v=>typeof v==='number'?v+'px':v;
function gapply(e,p){
 const t=e._t,s=e.style,tx=e._tx||e;
 for(const k in p){const v=p[k];
  if(k==='text'){tx.textContent=v==null?'':v}
  else if(k==='fg_color'){const c=gcol(v);if(e._in)e._in.style.accentColor=c==='transparent'?'':c;else s.background=c==='transparent'?'transparent':c}
  else if(k==='text_color'){s.color=gcol(v)}
  else if(k==='hover_color'){s.setProperty('--gh',gcol(v))}
  else if(k==='border_color'){e._bc=gcol(v);s.borderColor=e._bc}
  else if(k==='border_width'){s.border=v+'px solid '+(e._bc||'var(--gd)')}
  else if(k==='corner_radius'){s.borderRadius=v+'px'}
  else if(k==='width'){s.width=px_(v)}
  else if(k==='height'){s.height=px_(v)}
  else if(k==='font'){const f=Array.isArray(v)?{family:v[0],size:v[1],weight:v[2]}:v||{};
   if(f.family)s.fontFamily=f.family;if(f.size)s.fontSize=Math.abs(f.size)+'px';if(f.weight)s.fontWeight=f.weight;
   if(f.slant==='italic')s.fontStyle='italic';if(f.underline)s.textDecoration='underline'}
  else if(k==='placeholder_text'){e.placeholder=v}
  else if(k==='show'){e.type=v?'password':'text'}
  else if(k==='state'){(e._in||e).disabled=v==='disabled'}
  else if(k==='anchor'||k==='justify'){s.textAlign=v==='w'||v==='left'?'left':v==='e'||v==='right'?'right':'center'}
  else if(k==='wraplength'){s.maxWidth=v+'px'}
  else if(k==='values'){gvals(e,v)}
  else if(k==='from_'){e.min=v}else if(k==='to'){e.max=v}
  else if(k==='number_of_steps'){e.step=v?(e.max-e.min)/v:'any'}
  else if(k==='value'){if(t==='radio')e._rv=v;else gset(e,v)}
  else if(k==='checked'){e._in.checked=!!v}}}
function gvals(e,v){
 if(e._t==='seg'){e.textContent='';(v||[]).forEach(x=>{const b=gel('button');b.textContent=x;b.onclick=()=>{gset(e,x);gsend(e._id,'cmd',x)};e.append(b)});gset(e,e._v!=null?e._v:(v||[])[0])}
 else{e.textContent='';(v||[]).forEach(x=>{const o=gel('option');o.textContent=x;o.value=x;e.append(o)})}}
function gset(e,v){const t=e._t;e._v=v;
 if(t==='entry'||t==='textbox'||t==='slider'||t==='combo'||t==='option')e.value=v;
 else if(t==='label'||t==='button')e.textContent=v;
 else if(t==='checkbox'||t==='switch')e._in.checked=!!v;
 else if(t==='radio')e._in.checked=v===e._rv;
 else if(t==='progress')e.firstChild.style.width=Math.max(0,Math.min(1,v))*100+'%';
 else if(t==='seg')[...e.children].forEach(b=>b.classList.toggle('on',b.textContent===v))}
function gnew(o){
 const t=o.type,p=o.props||{};let e;
 if(t==='frame'||t==='sframe'){e=gel('div','gf');if(p.width==null)e.style.minWidth='200px';if(p.height==null)e.style.minHeight='200px';if(t==='sframe')e.style.overflow='auto'}
 else if(t==='label'){e=gel('div','gl');e.textContent=p.text==null?'CTkLabel':p.text}
 else if(t==='button'){e=gel('button','gbtn');e.textContent=p.text==null?'CTkButton':p.text;e.onclick=()=>gsend(o.id,'cmd')}
 else if(t==='entry'){e=gel('input','gin');e.type='text';e.oninput=()=>gsend(o.id,'val',e.value)}
 else if(t==='textbox'){e=gel('textarea','gin');e.oninput=()=>gsend(o.id,'val',e.value)}
 else if(t==='checkbox'||t==='radio'||t==='switch'){
  e=gel('label','gck');const i=gel('input');i.type=t==='radio'?'radio':'checkbox';if(t==='switch'){i.className='gswi'}
  const x=gel('span');x.textContent=p.text==null?'CTk'+t[0].toUpperCase()+t.slice(1):p.text;e.append(i,x);e._in=i;e._tx=x;
  if(t==='radio')i.name='r'+o.parent;
  i.onchange=()=>gsend(o.id,'cmd',t==='radio'?true:i.checked)}
 else if(t==='slider'){e=gel('input','gsl');e.type='range';e.min=p.from_==null?0:p.from_;e.max=p.to==null?1:p.to;e.step='any';e.value=(+e.min+ +e.max)/2;e.oninput=()=>gsend(o.id,'cmd',+e.value)}
 else if(t==='progress'){e=gel('div','gpb');e.append(gel('i'))}
 else if(t==='combo'||t==='option'){e=gel('select','gin');e.onchange=()=>gsend(o.id,'cmd',e.value)}
 else if(t==='seg'){e=gel('div','gsg')}
 else e=gel('div');
 e._t=t;e._id=o.id;e.hidden=true;gapply(e,p);
 if(t==='progress')gset(e,0.5);
 const host=o.parent==='root'?document.getElementById('gcont'):GUI.els[o.parent];
 if(host)host.append(e);
 GUI.els[o.id]=e;GUI.par[o.id]=o.parent;(GUI.kids[o.parent]=GUI.kids[o.parent]||[]).push(o.id)}
const gpad=v=>Array.isArray(v)?[v[0]||0,v[1]||0]:[v||0,v||0];
function relayout(pid){
 const box=pid==='root'?document.getElementById('gcont'):GUI.els[pid];if(!box)return;
 const ks=(GUI.kids[pid]||[]).filter(i=>GUI.lay[i]&&GUI.els[i]),ms=ks.map(i=>GUI.lay[i].mgr);
 const m=ms.includes('grid')?'grid':ms.includes('pack')?'pack':ms.includes('place')?'place':'',s=box.style;
 s.display=s.flexDirection=s.gridTemplateColumns=s.gridTemplateRows=s.alignItems=s.alignContent=s.justifyContent='';
 if(ms.includes('place'))s.position='relative';
 const g=GUI.gc[pid]||{col:{},row:{}};
 if(m==='grid'){
  const nc=Math.max(0,...ks.map(i=>(GUI.lay[i].opts.column||0)+(GUI.lay[i].opts.columnspan||1)),...Object.keys(g.col).map(x=>+x+1)),
   nr=Math.max(0,...ks.map(i=>(GUI.lay[i].opts.row||0)+(GUI.lay[i].opts.rowspan||1)),...Object.keys(g.row).map(x=>+x+1));
  s.display='grid';s.alignContent='start';
  s.gridTemplateColumns=Array.from({length:nc},(_,i)=>g.col[i]>0?g.col[i]+'fr':'auto').join(' ');
  s.gridTemplateRows=Array.from({length:nr},(_,i)=>g.row[i]>0?g.row[i]+'fr':'auto').join(' ');
  if(Object.values(g.col).some(w=>w>0))s.justifyContent='stretch'}
 if(m==='pack'){const f=GUI.lay[ks[0]].opts.side||'top';s.display='flex';s.flexDirection=f==='left'||f==='right'?'row':'column';s.alignItems='center'}
 const row=m==='pack'&&s.flexDirection==='row';
 for(const i of GUI.kids[pid]||[]){const k=GUI.els[i],l=GUI.lay[i];if(!k)continue;
  Object.assign(k.style,{gridColumn:'',gridRow:'',justifySelf:'',alignSelf:'',flex:'',margin:'',position:'',left:'',top:'',transform:'',width:k.style.width});
  if(!l){k.hidden=true;continue}k.hidden=false;
  const o=l.opts,px=gpad(o.padx),py=gpad(o.pady);k.style.margin=`${py[0]}px ${px[1]}px ${py[1]}px ${px[0]}px`;
  if(l.mgr==='grid'){
   k.style.gridColumn=`${(o.column||0)+1} / span ${o.columnspan||1}`;k.style.gridRow=`${(o.row||0)+1} / span ${o.rowspan||1}`;
   const st=o.sticky||'';k.style.justifySelf=st.includes('e')&&st.includes('w')?'stretch':st.includes('w')?'start':st.includes('e')?'end':'center';
   k.style.alignSelf=st.includes('n')&&st.includes('s')?'stretch':st.includes('n')?'start':st.includes('s')?'end':'center'}
  else if(l.mgr==='pack'){
   if(o.expand)k.style.flex='1';
   const fl=o.fill;if(fl==='both'||(fl==='x'&&!row)||(fl==='y'&&row))k.style.alignSelf='stretch';
   if(fl==='both'||(fl==='x'&&row)||(fl==='y'&&!row))k.style.flex='1';
   if(o.side==='bottom')k.style.marginTop='auto';if(o.side==='right')k.style.marginLeft='auto'}
  else if(l.mgr==='place'){
   k.style.position='absolute';
   k.style.left=o.relx!=null?o.relx*100+'%':(o.x||0)+'px';k.style.top=o.rely!=null?o.rely*100+'%':(o.y||0)+'px';
   const a=o.anchor||'nw',hx=a==='center'||a==='n'||a==='s'?'-50%':a.includes('e')?'-100%':'0',vy=a==='center'||a==='e'||a==='w'?'-50%':a.includes('s')?'-100%':'0';
   k.style.transform=`translate(${hx},${vy})`;
   if(o.relwidth!=null)k.style.width=o.relwidth*100+'%';if(o.relheight!=null)k.style.height=o.relheight*100+'%';
   if(o.width!=null)k.style.width=o.width+'px';if(o.height!=null)k.style.height=o.height+'px'}}}
const GH={
 win(o){guiReset();GUI.mode=o.mode==='light'?'light':'dark';GUI.theme=o.theme;
  const w=gel('div','gw');w.innerHTML='<div class="gtb"><span id="gtitle">CTk</span><button type="button" id="gclose" aria-label="close">✕</button></div><div class="gcont" id="gcont" tabindex="0"></div>';
  document.getElementById('guiwin').append(w);gtheme();
  const c=document.getElementById('gcont');c.style.width='400px';c.style.height='300px';if(o.fg)c.style.background=gcol(o.fg);
  document.getElementById('gclose').onclick=()=>gsend('root','close');GUI.els.root=c;document.body.dataset.gui='1'},
 title(o){const t=document.getElementById('gtitle');if(t)t.textContent=o.text},
 size(o){const c=document.getElementById('gcont');if(c){c.style.width=o.w+'px';c.style.height=o.h+'px'}},
 mode(o){GUI.mode=o.mode==='light'?'light':'dark';gtheme()},theme(o){GUI.theme=o.theme;gtheme()},
 new:gnew,
 cfg(o){const e=GUI.els[o.id];if(!e)return;if(o.id==='root'){if(o.props.fg_color)e.style.background=gcol(o.props.fg_color);return}gapply(e,o.props)},
 set(o){const e=GUI.els[o.id];if(e)gset(e,o.value)},
 lay(o){GUI.lay[o.id]={mgr:o.mgr,opts:o.opts||{}};relayout(GUI.par[o.id])},
 unlay(o){delete GUI.lay[o.id];relayout(GUI.par[o.id])},
 gcfg(o){const g=GUI.gc[o.id]=GUI.gc[o.id]||{col:{},row:{}};g[o.axis][o.index]=o.weight;relayout(o.id)},
 del(o){const e=GUI.els[o.id];if(e)e.remove();const p=GUI.par[o.id];delete GUI.els[o.id];delete GUI.lay[o.id];if(GUI.kids[p])GUI.kids[p]=GUI.kids[p].filter(x=>x!==o.id);relayout(p)},
 focus(o){const e=GUI.els[o.id];if(e)(e._in||e).focus()},
 after(o){GUI.timers.push(setTimeout(()=>gsend(o.id,'after'),o.ms))},
 quit(){const w=document.getElementById('guiwin');if(w)w.textContent='';document.body.dataset.gui=''},
 bind(o){const e=GUI.els[o.id];if(!e)return;const m={'<Return>':['keydown','Enter'],'<Escape>':['keydown','Escape'],'<Key>':['keydown'],'<KeyPress>':['keydown'],'<KeyRelease>':['keyup'],'<Button-1>':['click']}[o.seq];if(!m)return;
  (o.id==='root'?e:e).addEventListener(m[0],ev=>{if(m[1]&&ev.key!==m[1])return;gsend(o.id,'bind',{seq:o.seq,keysym:ev.key==='Enter'?'Return':ev.key,char:ev.key&&ev.key.length===1?ev.key:'',x:ev.offsetX||0,y:ev.offsetY||0})})},
 alert(o){const c=document.getElementById('gcont');if(!c)return;const a=gel('div','gal'),b=gel('div'),h=gel('b'),p=gel('p'),ok=gel('button','gbtn');
  h.textContent=o.title;p.textContent=o.text;ok.textContent='OK';ok.onclick=()=>a.remove();b.append(h,p,ok);a.append(b);c.append(a)}
};
function guiOps(ops){for(const o of ops){try{GH[o.op]&&GH[o.op](o)}catch(e){console.error('gui',o.op,e)}}}
