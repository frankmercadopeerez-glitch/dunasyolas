const fs=require('fs'),path=require('path'),cheerio=require('cheerio');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>['node_modules','tmp','.git','.vercel'].includes(e.name)?[]:e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const pages=new Map();
for(const file of walk('.').filter(f=>f.endsWith('.html'))){
 const $=cheerio.load(fs.readFileSync(file,'utf8'));
 if(($('meta[name="robots"]').attr('content')||'').includes('noindex'))continue;
 const url=$('link[rel="canonical"]').attr('href');if(!url)continue;
 const alternates=$('link[rel="alternate"][hreflang]').map((i,e)=>({lang:$(e).attr('hreflang'),url:$(e).attr('href')})).get();
 pages.set(url,alternates);
}
const entries=[...pages].sort(([a],[b])=>a.localeCompare(b)).map(([url,alternates])=>'  <url><loc>'+escape(url)+'</loc>'+alternates.filter(a=>pages.has(a.url)).map(a=>'\n    <xhtml:link rel="alternate" hreflang="'+escape(a.lang)+'" href="'+escape(a.url)+'"/>').join('')+'\n  </url>');
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.join('\n')+'\n</urlset>\n');
console.log(pages.size+' sitemap URLs with language alternatives');
