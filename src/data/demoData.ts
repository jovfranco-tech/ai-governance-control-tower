
import { useCases as useCasesEs, risks as risksEs, controls as controlsEs, vendors as vendorsEs, auditEvents as auditEventsEs, policyExceptions as policyExceptionsEs, evidences as evidencesEs, personas as personasEs } from './demoDataEs';
import { useCases as useCasesEn, risks as risksEn, controls as controlsEn, vendors as vendorsEn, auditEvents as auditEventsEn, policyExceptions as policyExceptionsEn, evidences as evidencesEn, personas as personasEn } from './demoDataEn';

const getLang = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('app-lang') || 'es';
  }
  return 'es';
};

function createProxy(esArray: any[], enArray: any[]) {
  return new Proxy(esArray, {
    get(target, prop) {
      const lang = getLang();
      const arr = lang === 'en' ? enArray : esArray;
      if (typeof arr[prop as any] === 'function') {
        return arr[prop as any].bind(arr);
      }
      return arr[prop as any];
    }
  });
}

export const useCases = createProxy(useCasesEs, useCasesEn) as typeof useCasesEs;
export const risks = createProxy(risksEs, risksEn) as typeof risksEs;
export const controls = createProxy(controlsEs, controlsEn) as typeof controlsEs;
export const vendors = createProxy(vendorsEs, vendorsEn) as typeof vendorsEs;
export const auditEvents = createProxy(auditEventsEs, auditEventsEn) as typeof auditEventsEs;
export const policyExceptions = createProxy(policyExceptionsEs, policyExceptionsEn) as typeof policyExceptionsEs;
export const evidences = createProxy(evidencesEs, evidencesEn) as typeof evidencesEs;
export const personas = createProxy(personasEs, personasEn) as typeof personasEs;
