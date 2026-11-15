// پراکسی Cloudflare Worker: کلید API فقط داخل Secrets ورکر می‌ماند و به مرورگر نمی‌رسد.
// تنظیم: Variables → UPSTREAM (آدرس کامل API)، MODEL، AUTH ("anthropic" یا "bearer") و Secret با نام KEY
const ALLOWED_ORIGINS=['https://YOUR-USERNAME.github.io'];
export default{async fetch(req,env){
 const o=req.headers.get('Origin')||'';
 const cors={'Access-Control-Allow-Origin':ALLOWED_ORIGINS.includes(o)?o:ALLOWED_ORIGINS[0],'Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin'};
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST'||!ALLOWED_ORIGINS.includes(o))return new Response('Forbidden',{status:403,headers:cors});
 const raw=await req.text();
 if(raw.length>40000)return new Response('Too large',{status:413,headers:cors});
 let b;try{b=JSON.parse(raw)}catch{return new Response('Bad JSON',{status:400,headers:cors})}
 b.model=env.MODEL;b.max_tokens=Math.min(b.max_tokens||800,800);b.stream=true;
 const h={'content-type':'application/json'};
 if(env.AUTH==='anthropic'){h['x-api-key']=env.KEY;h['anthropic-version']='2023-06-01'}else h.authorization='Bearer '+env.KEY;
 const r=await fetch(env.UPSTREAM,{method:'POST',headers:h,body:JSON.stringify(b)});
 return new Response(r.body,{status:r.status,headers:{...cors,'content-type':r.headers.get('content-type')||'text/event-stream'}})}};
