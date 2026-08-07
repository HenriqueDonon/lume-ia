const CACHE='lume-v2';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // Requisicoes de outros dominios (Wikipedia, CDN do LLM, pesos do modelo, Firebase):
  // deixa passar direto pela rede. O WebLLM cuida do proprio cache offline.
  if(u.origin!==self.location.origin){return;}
  // App local: cache-first, com fallback para index.html na navegacao
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(e.request.method==='GET'&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
    return res;
  }).catch(()=>caches.match('./index.html'))));
});
