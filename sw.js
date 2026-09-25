const VERSION='1.7.0';
const C='fakelos-ygeias-'+VERSION;
const F=['./','index.html','i18n.js','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.endsWith('version.json'))return; // πάντα από το δίκτυο
  e.respondWith(fetch(r.url,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('index.html'))));
});
self.addEventListener('notificationclick',e=>{
  const tag=(e.notification.data&&e.notification.data.tag)||e.notification.tag;
  const take=e.action==='take'?tag:null;
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if(take)c.postMessage({take});if('focus' in c)return c.focus()}
    return clients.openWindow(take?'./?take='+encodeURIComponent(take):'./');
  }));
});
