(function(){
'use strict';
var en=document.documentElement.lang.startsWith('en'), input=document.getElementById('query'),status=document.getElementById('search-status'),list=document.getElementById('full-results');
var query=(new URLSearchParams(location.search).get('q')||'').trim().slice(0,200);input.value=query;
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
if(!query){status.textContent=en?'Enter a destination or activity to start.':'Escribe un destino o una actividad para comenzar.';return;}
document.title=(en?'Results for “':'Resultados para «')+query+(en?'”':'»')+' | Dunas & Olas';status.textContent=en?'Searching…':'Buscando…';
fetch(en?'/en/search-index.json':'/search-index.json').then(function(r){if(!r.ok)throw Error();return r.json();}).then(function(data){
var terms=norm(query).split(/\s+/),matches=data.filter(function(item){var text=norm(item.title+' '+item.description+' '+item.keywords);return terms.every(function(t){return text.includes(t);});});
status.textContent=matches.length+(en?' results for “':' resultados para «')+query+(en?'”':'»');
if(!matches.length){var p=document.createElement('p');p.textContent=en?'Try a broader search, such as islands, beach or kitesurf.':'Prueba una búsqueda más general, como islas, playa o kitesurf.';list.appendChild(p);return;}
matches.forEach(function(item){var article=document.createElement('article'),a=document.createElement('a'),img=document.createElement('img'),copy=document.createElement('div'),h=document.createElement('h2'),p=document.createElement('p'),cta=document.createElement('span');a.href=item.url;img.src=item.image||'/images/logo-icon-nav-small.webp';img.alt='';img.loading='lazy';img.width=400;img.height=250;h.textContent=item.title;p.textContent=item.description;cta.textContent=en?'View details →':'Ver detalles →';copy.append(h,p,cta);a.append(img,copy);article.append(a);list.append(article);});
}).catch(function(){status.textContent=en?'Search is temporarily unavailable. Please try again.':'La búsqueda no está disponible en este momento. Inténtalo de nuevo.';});
})();
