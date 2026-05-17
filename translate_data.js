const fs = require('fs');
const path = require('path');

const demoDataPath = path.join(__dirname, 'src/data/demoData.ts');
const demoDataEsPath = path.join(__dirname, 'src/data/demoDataEs.ts');
const demoDataEnPath = path.join(__dirname, 'src/data/demoDataEn.ts');

let content = fs.readFileSync(demoDataPath, 'utf-8');
fs.writeFileSync(demoDataEsPath, content);

// Simple dictionary replace for demo data
let contentEn = content
  .replace(/En Producción/g, 'In Production')
  .replace(/Piloto/g, 'Pilot')
  .replace(/Aprobado/g, 'Approved')
  .replace(/Bloqueado/g, 'Blocked')
  .replace(/Crítico/g, 'Critical')
  .replace(/Alto/g, 'High')
  .replace(/Medio/g, 'Medium')
  .replace(/Bajo/g, 'Low')
  .replace(/Abierto/g, 'Open')
  .replace(/Cerrado/g, 'Closed')
  .replace(/Operativo/g, 'Operational')
  .replace(/Vencido/g, 'Overdue')
  .replace(/En Implementación/g, 'In Implementation')
  .replace(/Requiere Revisión/g, 'Requires Review')
  .replace(/Evaluación/g, 'Evaluation')
  .replace(/Aprobado/g, 'Approved')
  .replace(/Privacidad/g, 'Privacy')
  .replace(/Sesgo/g, 'Bias')
  .replace(/Seguridad/g, 'Security')
  .replace(/Regulatorio/g, 'Regulatory')
  .replace(/Operacional/g, 'Operational');

fs.writeFileSync(demoDataEnPath, contentEn);

const proxyContent = `
import { useCases as useCasesEs, risks as risksEs, controls as controlsEs, vendors as vendorsEs, auditEvents as auditEventsEs, policyExceptions as policyExceptionsEs, evidences as evidencesEs, personas as personasEs } from './demoDataEs';
import { useCases as useCasesEn, risks as risksEn, controls as controlsEn, vendors as vendorsEn, auditEvents as auditEventsEn, policyExceptions as policyExceptionsEn, evidences as evidencesEn, personas as personasEn } from './demoDataEn';

const getLang = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('app-lang') || 'es';
  }
  return 'es';
};

function createProxy(esArray, enArray) {
  return new Proxy(esArray, {
    get(target, prop) {
      const lang = getLang();
      const arr = lang === 'en' ? enArray : esArray;
      if (typeof arr[prop] === 'function') {
        return arr[prop].bind(arr);
      }
      return arr[prop];
    }
  });
}

export const useCases = createProxy(useCasesEs, useCasesEn);
export const risks = createProxy(risksEs, risksEn);
export const controls = createProxy(controlsEs, controlsEn);
export const vendors = createProxy(vendorsEs, vendorsEn);
export const auditEvents = createProxy(auditEventsEs, auditEventsEn);
export const policyExceptions = createProxy(policyExceptionsEs, policyExceptionsEn);
export const evidences = createProxy(evidencesEs, evidencesEn);
export const personas = createProxy(personasEs, personasEn);
`;

fs.writeFileSync(demoDataPath, proxyContent);
console.log('Demo data proxy created!');
