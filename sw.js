// Offline support. Bump V when the app changes so phones pick up the new version.
const V="genlocke-1794839887";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="genlocke-assets").map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const same=new URL(r.url).origin===location.origin;
  if(same){ // the app itself: newest copy when online, saved copy when offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))));
  }else{ // fonts and sprites: saved copy first
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open("genlocke-assets").then(c=>c.put(r,cp));return res;})));
  }
});
