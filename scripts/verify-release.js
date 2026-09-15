/* Usage: node scripts/verify-release.js https://dunasyolas.com */
const fs=require('fs'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:58731';
const normalize=s=>s.replaceAll('\r\n','\n');
async function request(url){let last;for(let i=0;i<3;i++){try{const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});if(r.status<500)return r;last=new Error(url+' '+r.status);}catch(e){last=e;}}throw last;}
(async()=>{
 const urls=[...fs.readFileSync('sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);let checked=0;
 for(let i=0;i<urls.length;i+=6)await Promise.all(urls.slice(i,i+6).map(async url=>{const route=new URL(url).pathname;let file=route.replace(/^\//,'');file=!file?'index.html':fs.existsSync(file)&&fs.statSync(file).isDirectory()?file+'/index.html':file.endsWith('/')?file+'index.html':file.endsWith('.html')?file:file+'.html';const r=await request(base+route);assert.equal(r.status,200,route);assert.equal(normalize(await r.text()),normalize(fs.readFileSync(file,'utf8')),'Content differs: '+route);checked++;}));
 const assets=['css/conversion.css','css/international.css','css/brand-refresh.css','js/international.js','js/catalog.js','js/cart.js','js/cart-en.js','js/currency.js','js/site-refresh.js','favicon.ico','images/favicon-192.png','images/favicon-512.png','images/paratrike-01.webp','images/paratrike-02.webp','images/shakira-real.webp','images/castillo-real.webp','images/plancton-referencia.webp','site.webmanifest'];
 for(const file of assets){const r=await request(base+'/'+file);assert.equal(r.status,200,file);const actual=Buffer.from(await r.arrayBuffer()),expected=fs.readFileSync(file);assert(/\.(js|css|json|webmanifest)$/.test(file)?normalize(actual.toString())===normalize(expected.toString()):actual.equals(expected),'Asset differs: '+file);}
 console.log(JSON.stringify({base,pagesIdentical:checked,assetsIdentical:assets.length},null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
