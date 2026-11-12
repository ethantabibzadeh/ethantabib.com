const destinations=await fetch('destinations.json').then(r=>r.json());
const journalUrl=d=>'index.html?destination='+encodeURIComponent(d.slug);
const list=document.querySelector('#mapPlaces');
for(const d of [...destinations].sort((a,b)=>a.name.localeCompare(b.name))){const a=document.createElement('a');a.href=journalUrl(d);a.textContent=d.name+' ↗';list.append(a);}
const surface=document.querySelector('#travelMap');
if(window.L){
 const map=L.map(surface,{scrollWheelZoom:true,minZoom:2}).setView([30,-25],2);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:18}).addTo(map);
 const points=destinations.filter(d=>Number.isFinite(d.lat)&&Number.isFinite(d.lng));
 const bounds=L.latLngBounds(points.map(d=>[d.lat,d.lng]));
 const showAll=()=>map.fitBounds(bounds,{padding:[45,45],maxZoom:5});
 for(const d of points){const label=document.createElement('a');label.href=journalUrl(d);label.className='map-journal-link';label.textContent=d.name+' · Open journal ↗';L.circleMarker([d.lat,d.lng],{radius:8,color:'#182521',weight:2,fillColor:'#f56637',fillOpacity:1}).addTo(map).bindTooltip(d.name).bindPopup(label);}
 showAll();const reset=document.querySelector('#resetMap');reset.hidden=false;reset.onclick=showAll;
 new ResizeObserver(()=>map.invalidateSize()).observe(surface);
}else{surface.className='map-unavailable';surface.textContent='The map could not load. Explore every destination using the links below.';}
