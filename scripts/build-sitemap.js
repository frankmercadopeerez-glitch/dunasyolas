const fs=require('fs'),path=require('path'),cheerio=require('cheerio');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>['node_modules','tmp','.git','.vercel'].includes(e.name)?[]:e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const pages=new Map();
for(const file of walk('.').filter(f=>f.endsWith('.html'))){
 const $=cheerio.load(fs.readFileSync(file,'utf8'));
 if(($('meta[name="robots"]').attr('content')||'').includes('noindex'))continue;
 const url=$('link[rel="canonical"]').attr('href');if(!url)continue;
 const alternates=$('link[rel="alternate"][hreflang]').map((i,e)=>({lang:$(e).attr('hreflang'),url:$(e).attr('href')})).get();
 pages.set(url,{alternates,file});
}
const entries=[...pages].sort(([a],[b])=>a.localeCompare(b)).map(([url,data])=>{
 const {alternates,file}=data;
 let image='';if(file){const $=cheerio.load(fs.readFileSync(file,'utf8'));image=$('meta[property="og:image"]').attr('content')||'';if(image.startsWith('/'))image='https://dunasyolas.com'+image;}
 return '  <url><loc>'+escape(url)+'</loc>'+alternates.filter(a=>pages.has(a.url)).map(a=>'\n    <xhtml:link rel="alternate" hreflang="'+escape(a.lang)+'" href="'+escape(a.url)+'"/>').join('')+(image?'\n    <image:image><image:loc>'+escape(image)+'</image:loc></image:image>':'')+'\n  </url>';
});
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'+entries.join('\n')+'\n</urlset>\n');
console.log(pages.size+' sitemap URLs with language alternatives');
