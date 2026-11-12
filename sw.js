const C='kodkhane-v2',A=['./','index.html','style.css','script.js','manifest.json','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
 const ok=u.origin===location.origin||/jsdelivr|cdnjs/.test(u.hostname);if(!ok)return;
 e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x.ok)caches.open(C).then(c=>c.put(r,x.clone()));return x}).catch(()=>h)))});
