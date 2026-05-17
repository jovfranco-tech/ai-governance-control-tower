const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const dictionary = [
  // Page Headers
  ['Registro Central de Casos de Uso IA', 'Central AI Use Case Registry'],
  ['Inventario ejecutivo de iniciativas de IA, owners, estado, riesgo y decisión de gobernanza.', 'Executive inventory of AI initiatives, owners, status, risk and governance decision.'],
  ['Buscar por ID, nombre o unidad...', 'Search by ID, name or unit...'],
  ['Filtros', 'Filters'],
  ['Unidad / Owner', 'Unit / Owner'],
  ['Tipo / Proveedor', 'Type / Provider'],
  ['Decisión', 'Decision'],
  ['Librería de Controles y Cumplimiento', 'Control Library & Compliance'],
  ['Catálogo de controles de seguridad, privacidad y ética aplicados a IA.', 'Catalog of security, privacy and ethics controls applied to AI.'],
  ['Buscar por ID o nombre de control...', 'Search by ID or control name...'],
  ['ID / Control', 'ID / Control'],
  ['Categoría / Objetivo', 'Category / Objective'],
  ['Evidencia Requerida', 'Required Evidence'],
  ['Última / Próxima Revisión', 'Last / Next Review'],
  ['Gestor de Evidencia y Auditoría', 'Evidence & Audit Manager'],
  ['Repositorio centralizado de artefactos de cumplimiento y documentación.', 'Centralized repository of compliance artifacts and documentation.'],
  ['Buscar por ID, nombre o owner...', 'Search by ID, name or owner...'],
  ['Tipo / Owner', 'Type / Owner'],
  ['Control Relacionado', 'Related Control'],
  ['Fecha Límite', 'Due Date'],
  ['Riesgo de Proveedores y Terceros', 'Vendor & Third-Party Risk'],
  ['Evaluation y monitoreo de riesgo de modelos fundacionales y plataformas IA.', 'Assessment and risk monitoring of foundational models and AI platforms.'],
  ['Buscar proveedor o servicio...', 'Search vendor or service...'],
  ['Proveedor / Servicio', 'Vendor / Service'],
  ['Datos Procesados', 'Data Processed'],
  ['Evaluation (Sec/Priv/Comp)', 'Assessment (Sec/Priv/Comp)'],
  ['Score', 'Score'],
  ['Excepciones de Política', 'Policy Exceptions'],
  ['Registro de desviaciones aprobadas y controles compensatorios.', 'Register of approved deviations and compensating controls.'],
  ['Área de Política / Caso', 'Policy Area / Case'],
  ['Solicitante / Justificación', 'Requestor / Justification'],
  ['Controles Compensatorios', 'Compensating Controls'],
  ['Aprobador / Expiración', 'Approver / Expiration'],
  ['Registro de Eventos y Auditoría', 'Audit Events Log'],
  ['Trazabilidad inmutable de decisiones, cambios y actualizaciones del sistema.', 'Immutable traceability of decisions, changes and system updates.'],
  ['ID / Fecha', 'ID / Date'],
  ['Tipo / Actor', 'Type / Actor'],
  ['Descripción / Módulo', 'Description / Module'],
  ['Objeto / Gravedad', 'Object / Severity'],
  ['Generador de Briefing Ejecutivo', 'Executive Briefing Generator'],
  ['Resumen auto-generado para el Comité de Dirección sobre el estado del portafolio IA.', 'Auto-generated summary for the Steering Committee on the AI portfolio status.'],
  ['Briefing Ejecutivo Generado', 'Executive Briefing Generated'],
  ['Contexto del Portafolio', 'Portfolio Context'],
  ['Riesgos Principales', 'Main Risks'],
  ['Acciones Requeridas', 'Required Actions'],
  ['Decisiones Pendientes', 'Pending Decisions'],
  ['Acerca del Proyecto', 'About the Project'],
  ['Generar Nuevo Briefing', 'Generate New Briefing'],
  ['ID / Caso de Uso', 'ID / Use Case']
];

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Ensure tLocal is defined in the file
  if (!content.includes('const tLocal =')) {
    content = content.replace(
      'const { lang } = useAppContext();',
      'const { lang } = useAppContext();\n  const tLocal = <T,>(es: T, en: T): T => lang === \'en\' ? en : es;'
    );
  } else {
    // If it is defined but not generic, make it generic
    content = content.replace(
      /const tLocal = \(es: string, en: string\) => lang === 'en' \? en : es;/g,
      "const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;"
    );
  }

  dictionary.forEach(([es, en]) => {
    // Replace in JSX Text: >Text< -> >{tLocal("Text", "TextEN")}<
    const jsxRegex = new RegExp(`>\\s*${es}\\s*<`, 'g');
    content = content.replace(jsxRegex, `>{tLocal("${es}", "${en}")}<`);

    // Replace in Props: title="Text" -> title={tLocal("Text", "TextEN")}
    const propRegex = new RegExp(`title="${es}"`, 'g');
    content = content.replace(propRegex, `title={tLocal("${es}", "${en}")}`);
    
    const subtitleRegex = new RegExp(`subtitle="${es}"`, 'g');
    content = content.replace(subtitleRegex, `subtitle={tLocal("${es}", "${en}")}`);

    const placeholderRegex = new RegExp(`placeholder="${es}"`, 'g');
    content = content.replace(placeholderRegex, `placeholder={tLocal("${es}", "${en}")}`);
  });

  fs.writeFileSync(filePath, content);
});

console.log('UI files translated successfully.');
