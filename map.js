const destinations=await fetch('destinations.json?v=20261112-brightmap',{cache:'no-cache'}).then(r=>r.json());
const journalUrl=d=>'index.html?destination='+encodeURIComponent(d.slug);
const latest=d=>d.media.reduce((value,m)=>m.date&&m.date>value?m.date:value,'');
const ordered=[...destinations].sort((a,b)=>latest(b).localeCompare(latest(a))||a.name.localeCompare(b.name));
const photo=d=>d.media.find(m=>m.section==='gallery'&&m.type!=='video')||d.media.find(m=>m.type!=='video');
function journalCard(d,compact=false){
 const a=document.createElement('a');a.href=journalUrl(d);a.className=compact?'map-popup-card':'map-place-card';
 const media=photo(d);if(media){const img=document.createElement('img');img.src=media.src;img.alt='';img.loading='lazy';a.append(img);}
 const copy=document.createElement('span');copy.className='map-place-copy';
 const country=document.createElement('small');country.textContent=d.country;
 const title=document.createElement('strong');title.textContent=d.name+' ↗';
 copy.append(country,title);a.append(copy);return a;
}
const list=document.querySelector('#mapPlaces');
for(const d of ordered)list.append(journalCard(d));
const surface=document.querySelector('#travelMap');
if(window.L){
 const map=L.map(surface,{scrollWheelZoom:true,minZoom:2,zoomControl:false}).setView([30,-25],2);
 L.control.zoom({position:'bottomright'}).addTo(map);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:18}).addTo(map);
 const points=destinations.filter(d=>Number.isFinite(d.lat)&&Number.isFinite(d.lng));
 const fit=items=>{if(items.length)map.fitBounds(L.latLngBounds(items.map(d=>[d.lat,d.lng])),{padding:[45,55],maxZoom:10});};
 const showAll=()=>{fit(points);document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region==='all')));};
 const markerLayer=L.layerGroup().addTo(map);
 function drawPins(){
  markerLayer.clearLayers();
  const groups=[];
  for(const d of points){
   const pixel=map.latLngToLayerPoint([d.lat,d.lng]);
   let group=groups.find(g=>Math.hypot(g.x-pixel.x,g.y-pixel.y)<42);
   if(!group){group={x:pixel.x,y:pixel.y,items:[]};groups.push(group);}
   group.items.push(d);
  }
  for(const {items:group} of groups){
   const lat=group.reduce((sum,d)=>sum+d.lat,0)/group.length;
   const lng=group.reduce((sum,d)=>sum+d.lng,0)/group.length;
   const combined=new Set(group.map(d=>d.lat+','+d.lng)).size>1;
   const name=group.length>3?group.length+' destinations · Zoom in':group.map(d=>d.name).join(' · ');
   const icon=L.divIcon({className:'journey-marker'+(combined?' journey-cluster':''),html:'<span class="journey-pin"><span>'+(group.length>1?group.length:'')+'</span></span>',iconSize:[34,42],iconAnchor:[17,40],popupAnchor:[0,-35]});
   const marker=L.marker([lat,lng],{icon,title:name,riseOnHover:true}).addTo(markerLayer);
   marker.getElement().setAttribute('aria-label',name);
   marker.bindTooltip(name,{direction:'top',offset:[0,-36],className:'journey-tooltip'});
   if(combined)marker.on('click',()=>fit(group));
   else{const popup=document.createElement('div');popup.className='map-popup-gallery';for(const d of group)popup.append(journalCard(d,true));marker.bindPopup(popup,{maxWidth:285,minWidth:230});}
  }
 }
 map.on('zoomend',drawPins);
 document.querySelectorAll('[data-region]').forEach(button=>button.onclick=()=>{
  const region=button.dataset.region;
  if(region==='all')return showAll();
  fit(points.filter(d=>region==='europe'?d.lng>=-15&&d.lng<=40:d.lng< -30));
  document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 });
 showAll();drawPins();const reset=document.querySelector('#resetMap');reset.hidden=false;reset.onclick=showAll;
 new ResizeObserver(()=>map.invalidateSize()).observe(surface);
}else{surface.className='map-unavailable';surface.textContent='The map could not load. Explore every destination using the photographs below.';}
