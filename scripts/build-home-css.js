const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tailwindPath = path.join(root, 'css', 'tailwind-home.css');
const brandPath = path.join(root, 'css', 'brand-refresh.css');
const outputPath = path.join(root, 'css', 'home.css');

const banner = '/* Generated homepage bundle: tailored Tailwind utilities + brand-refresh.css. */\n';
const tailwind = fs.readFileSync(tailwindPath, 'utf8');
const brand = fs.readFileSync(brandPath, 'utf8');

fs.writeFileSync(outputPath, `${banner}${tailwind}\n${brand}`, 'utf8');
console.log(`Homepage CSS: ${path.relative(root, outputPath)}`);
