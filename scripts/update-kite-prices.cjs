const fs=require('fs'),c=require('../data/catalog.json'),en=require('../data/catalog-en.json');
const prices={iniciacion:650000,refuerzo:280000,grupal:250000,foil:450000,rider:2400000,avanzado:2900000,elite:3400000,wingfoil:350000,sup:90000,alquiler_supervisado:220000,alquiler_equipo:200000,supervision:100000,downwind:1250000,fotos:150000};
for(const [id,price] of Object.entries(prices))c.products['kitesurf_'+id].price=price;
c.products.kitesurf_medio={name:'Kitesurf — Curso Medio (4 horas)',price:1310000,unit:'persona'};en.kitesurf_medio=['Kitesurf — Intermediate Course (4 hours)','Four hours of guided kite training with equipment and hydration.'];
fs.writeFileSync('data/catalog.json',JSON.stringify(c,null,2)+'\n');fs.writeFileSync('data/catalog-en.json',JSON.stringify(en,null,2)+'\n');
