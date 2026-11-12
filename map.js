const destinations=await fetch('destinations.json?v=20261112-mediterranean',{cache:'no-cache'}).then(r=>r.json());
const journalUrl=d=>'index.html?destination='+encodeURIComponent(d.slug);
const list=document.querySelector('#mapPlaces');
for(const d of [...destinations].sort((a,b)=>b.media.reduce((latest,m)=>m.date&&m.date>latest?m.date:latest,'').localeCompare(a.media.reduce((latest,m)=>m.date&&m.date>latest?m.date:latest,''))||a.name.localeCompare(b.name))){const a=document.createElement('a');a.href=journalUrl(d);a.textContent=d.name+' ↗';list.append(a);}
const surface=document.querySelector('#travelMap');
if(window.L){
 const map=L.map(surface,{scrollWheelZoom:true,minZoom:2}).setView([30,-25],2);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:18}).addTo(map);
 const points=destinations.filter(d=>Number.isFinite(d.lat)&&Number.isFinite(d.lng));
 const bounds=L.latLngBounds(points.map(d=>[d.lat,d.lng]));
 const showAll=()=>map.fitBounds(bounds,{padding:[45,45],maxZoom:5});
 const groups=new Map(); for(const d of points){const key=d.lat+','+d.lng;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(d);}
 for(const group of groups.values()){const popup=document.createElement('div');for(const d of group){const label=document.createElement('a');label.href=journalUrl(d);label.className='map-journal-link';label.style.display='block';label.style.margin='8px 0';label.textContent=d.name+' · Open journal ↗';popup.append(label);}L.circleMarker([group[0].lat,group[0].lng],{radius:group.length>1?11:8,color:'#182521',weight:2,fillColor:'#167D8D',fillOpacity:1}).addTo(map).bindTooltip(group.map(d=>d.name).join(' · ')).bindPopup(popup);}
 showAll();const reset=document.querySelector('#resetMap');reset.hidden=false;reset.onclick=showAll;
 new ResizeObserver(()=>map.invalidateSize()).observe(surface);
}else{surface.className='map-unavailable';surface.textContent='The map could not load. Explore every destination using the links below.';}
