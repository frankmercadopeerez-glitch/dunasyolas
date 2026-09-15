const fs=require('fs'),assert=require('node:assert/strict'),cheerio=require('cheerio');
const groups=require('../data/locale-routes.json');
function file(route){return route==='/'?'index.html':route.endsWith('/')?route.slice(1)+'index.html':route.slice(1)+'.html';}
let checked=0;
for(const group of Object.values(groups))for(const [lang,route]of Object.entries(group)){
 const target=file(route);assert(fs.existsSync(target),'Missing translation '+target);
 const $=cheerio.load(fs.readFileSync(target,'utf8'));
 assert.equal($('html').attr('lang').slice(0,2),lang,target+' language');
 assert.equal($('link[rel=canonical]').attr('href'),'https://dunasyolas.com'+route,target+' canonical');
 for(const [code,alt]of Object.entries(group))assert.equal($('link[hreflang="'+code+'"]').attr('href'),'https://dunasyolas.com'+alt,target+' reciprocal '+code);
 if(['fr','de'].includes(lang)){
  assert.equal($('h1').length,1,target+' h1');
  assert($('main').text().length>300,target+' complete static content');
  assert.equal($('.intl-language-list a').length,4,target+' language navigation');
  assert(!$('main').text().includes('undefined'),target+' undefined content');
  checked++;
 }
}
assert.equal(checked,52);console.log('International QA: 52 pages, reciprocal language links, canonical URLs and complete static content verified.');
