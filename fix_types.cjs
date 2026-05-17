const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/const tLocal = \(es, en\)/g, "const tLocal = (es: string, en: string)");
  fs.writeFileSync(filePath, content);
});

const demoDataPath = path.join(__dirname, 'src/data/demoData.ts');
let demoData = fs.readFileSync(demoDataPath, 'utf-8');

demoData = demoData.replace(/export const ([a-zA-Z]+) = createProxy\(\1Es, \1En\);/g, "export const $1 = createProxy($1Es, $1En) as typeof $1Es;");

fs.writeFileSync(demoDataPath, demoData);
console.log("Types fixed!");
