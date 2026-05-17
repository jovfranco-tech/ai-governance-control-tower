const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const dict = {
  "Registro de Riesgos de IA": "AI Risk Register",
  "Gestión de exposición por caso de uso, categoría, probabilidad, impacto, controles y riesgo residual.": "Exposure management by use case, category, probability, impact, controls, and residual risk.",
  "Total Riesgos": "Total Risks",
  "Riesgos Críticos": "Critical Risks",
  "Riesgos Altos": "High Risks",
  "Abiertos": "Open",
  "Buscar riesgos...": "Search risks...",
  "Categoría / Descripción": "Category / Description",
  "P x I = Score": "P x I = Score",
  "Nivel": "Level",
  "Estado": "Status",
  "Librería de Controles": "Control Library",
  "Catálogo de controles mitigantes vinculados a riesgos de IA y su estado operativo.": "Catalog of mitigating controls linked to AI risks and their operational status.",
  "Buscar controles...": "Search controls...",
  "Control": "Control",
  "Operativos": "Operational",
  "Vencidos": "Overdue",
  "Iniciativas de IA": "AI Initiatives",
  "Iniciativas Activas": "Active Initiatives",
  "Vista de Comité": "Committee View",
  "Briefing Ejecutivo": "Executive Briefing",
  "Riesgo de Proveedores": "Vendor Risk",
  "Excepciones de Política": "Policy Exceptions",
  "Auditoría y Eventos": "Audit & Events",
  "Evidencia de Cumplimiento": "Compliance Evidence",
  "Sobre el Proyecto": "About Project",
  "Configuración y Estado de Demostración": "Configuration & Demo State",
  "Configuración": "Settings"
};

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip ExecutiveDashboard as it's already translated manually
  if (file === 'ExecutiveDashboard.tsx') return;

  // If already processed, skip
  if (content.includes('const { lang } = useAppContext();')) return;

  // 1. Inject import
  content = content.replace("import React", "import { useAppContext } from '../contexts/AppContext';\nimport React");
  
  // 2. Inject lang variable inside component
  const componentName = file.replace('.tsx', '');
  const componentRegex = new RegExp(`const ${componentName} = \\(\\) => \\{`);
  content = content.replace(componentRegex, `const ${componentName} = () => {\n  const { lang } = useAppContext();\n  const tLocal = (es, en) => lang === 'en' ? en : es;`);

  // 3. Replace strings in JSX (basic replacement for titles and known texts)
  for (const [es, en] of Object.entries(dict)) {
    // Escape quotes in es and en if needed, but they are simple strings here.
    // Replace exact text matches inside JSX. E.g. >Riesgos Altos< or title="Riesgos Altos"
    
    // For props like title="es"
    const propRegex = new RegExp(`(title|subtitle|placeholder)="${es}"`, 'g');
    content = content.replace(propRegex, `$1={tLocal("${es}", "${en}")}`);

    // For inner text like >es<
    const textRegex = new RegExp(`>\\s*${es}\\s*<`, 'g');
    content = content.replace(textRegex, `>{tLocal("${es}", "${en}")}<`);
  }

  // Also replace some general table headers
  const genericHeaders = {
    "ID / Caso": "ID / Case",
    "Categoría": "Category",
    "Descripción": "Description",
    "Nivel": "Level",
    "Estado": "Status",
    "Due Date": "Due Date",
    "Acciones": "Actions"
  };
  
  for (const [es, en] of Object.entries(genericHeaders)) {
     const textRegex = new RegExp(`>\\s*${es}\\s*<`, 'g');
     content = content.replace(textRegex, `>{tLocal("${es}", "${en}")}<`);
  }

  fs.writeFileSync(filePath, content);
});

console.log('Pages translated!');
