const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const replacements = [
  // Arrays
  { from: /\[\s*'Alto',\s*'Crítico'\s*\]/g, to: "['Alto', 'Crítico', 'High', 'Critical']" },
  { from: /\[\s*'Enviada',\s*'Solicitada'\s*\]/g, to: "['Enviada', 'Solicitada', 'Submitted', 'Requested']" },
  { from: /\[\s*'En Producción',\s*'Piloto',\s*'Aprobado'\s*\]/g, to: "['En Producción', 'Piloto', 'Aprobado', 'In Production', 'Pilot', 'Approved']" },
  
  // Specific literal equality comparisons (needs care with regex)
  // We match things like: r.level === 'Crítico' and change to: ['Crítico', 'Critical'].includes(r.level)
  // Actually, simplest is just literal string replacements if they only appear in logic or jsx where it's safe.
  { from: /=== 'Crítico'/g, to: "=== 'Crítico' || r.level === 'Critical' || c?.level === 'Critical' || u?.level === 'Critical' || v?.level === 'Critical'" }, // Wait, this is dirty.
];

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix arrays first
  content = content.replace(/\[\s*'Alto',\s*'Crítico'\s*\]/g, "['Alto', 'Crítico', 'High', 'Critical']");
  content = content.replace(/\[\s*'Enviada',\s*'Solicitada'\s*\]/g, "['Enviada', 'Solicitada', 'Submitted', 'Requested']");
  
  // Fix strict equality in filters
  content = content.replace(/([a-zA-Z0-9_]+)\.level === 'Crítico'/g, "['Crítico', 'Critical'].includes($1.level)");
  content = content.replace(/([a-zA-Z0-9_]+)\.level === 'Alto'/g, "['Alto', 'High'].includes($1.level)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'Abierto'/g, "['Abierto', 'Open'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'Vencido'/g, "['Vencido', 'Overdue'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'Operativo'/g, "['Operativo', 'Operational'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'En Implementación'/g, "['En Implementación', 'In Implementation'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'Piloto'/g, "['Piloto', 'Pilot'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'Bloqueado'/g, "['Bloqueado', 'Blocked'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'En Revisión'/g, "['En Revisión', 'In Review', 'Requires Review'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'Aprobada'/g, "['Aprobada', 'Approved'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.status === 'Faltante'/g, "['Faltante', 'Missing'].includes($1.status)");
  content = content.replace(/([a-zA-Z0-9_]+)\.approvalStatus === 'Requiere Revisión'/g, "['Requiere Revisión', 'Requires Review'].includes($1.approvalStatus)");

  fs.writeFileSync(filePath, content);
});

console.log('Filters fixed!');
