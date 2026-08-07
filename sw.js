const CACHE='lume-v1';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.includes('wikipedia.org')){e.respondWith(fetch(e.request).catch(()=>new Response('',{status:503})));return}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(e.request.method==='GET'&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
    return res;
  }).catch(()=>caches.match('./index.html'))));
});