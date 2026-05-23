import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import React, { useRef, useState } from 'react';
import { Printer, Download, Copy, CheckCircle2, Sparkles, Loader2, Info } from 'lucide-react';

const ExecutiveBriefing = () => {
  const { lang } = useAppContext();
  const { useCases, risks, controls, evidences, policyExceptions } = useDataContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  // Dynamic values calculated from Context
  const totalUseCases = useCases.length;
  const inProductionCount = useCases.filter(u => ['En Producción', 'Aprobado', 'In Production', 'Approved'].includes(u.status)).length;
  const inPilotCount = useCases.filter(u => ['Piloto', 'Pilot'].includes(u.status)).length;
  const inReviewCount = useCases.filter(u => ['Bajo Revisión', 'In Review', 'Aprobado Condicional', 'Approved with Conditions', 'Risk Review Required', 'Revisión de Riesgo Requerida'].includes(u.status)).length;
  const blockedCount = useCases.filter(u => ['Bloqueado', 'Blocked'].includes(u.status)).length;

  const openRisks = risks.filter(r => ['Abierto', 'Open', 'Mitigando', 'Mitigating'].includes(r.status));
  const criticalOpenCount = openRisks.filter(r => ['Crítico', 'Critical'].includes(r.level)).length;
  const highOpenCount = openRisks.filter(r => ['Alto', 'High'].includes(r.level)).length;
  const mediumOpenCount = openRisks.filter(r => ['Medio', 'Medium'].includes(r.level)).length;

  const avgRiskScore = openRisks.length > 0
    ? (openRisks.reduce((sum, r) => sum + r.score, 0) / openRisks.length).toFixed(1)
    : "0.0";

  const overdueControls = controls.filter(c => ['Vencido', 'Overdue'].includes(c.status));
  const missingEvidenceCount = evidences.filter(e => ['Faltante', 'Missing'].includes(e.status)).length;

  const totalEvidences = evidences.length || 1;
  const approvedEvidences = evidences.filter(e => ['Aprobado', 'Approved'].includes(e.status)).length;
  const readinessPercentage = Math.round((approvedEvidences / totalEvidences) * 100);

  const uc003 = useCases.find(u => u.id === 'UC-003');

  // Dynamic local generator
  const getDynamicBriefing = () => {
    const combinedMajorRisks = criticalOpenCount + highOpenCount;
    if (lang === 'es') {
      const p1 = `El portafolio corporativo de IA comprende ${totalUseCases} iniciativas registradas, de las cuales ${inProductionCount} se encuentran operativas o formalmente aprobadas para producción. La preparación de cumplimiento normativo se ubica en el ${readinessPercentage}%, con ${missingEvidenceCount} evidencias pendientes de subsanación que representan una brecha de auditoría activa.`;
      const p2 = `Se identifican ${overdueControls.length} controles fuera de plazo y ${combinedMajorRisks} iniciativas con exposición Alta o Crítica que requieren acción ejecutiva inmediata. Las áreas críticas de riesgo abierto (${openRisks.length} en total) se concentran principalmente en la privacidad de los datos, sesgos algorítmicos y exposición regulatoria a nivel de sistema.`;
      const p3 = `La organización debe priorizar el cierre de brechas de control, resolver las iniciativas marcadas en revisión de riesgo y formalizar responsabilidades de los propietarios de decisiones antes de la próxima revisión semestral del comité directivo de gobernanza.`;
      return `${p1}\n${p2}\n${p3}`;
    } else {
      const p1 = `The corporate AI portfolio comprises ${totalUseCases} registered initiatives, of which ${inProductionCount} are operational or formally approved for production. Regulatory compliance readiness stands at ${readinessPercentage}%, with ${missingEvidenceCount} pending evidences representing an active audit gap.`;
      const p2 = `${overdueControls.length} overdue controls and ${combinedMajorRisks} initiatives with High or Critical exposure require immediate executive action. Key open risk vectors (${openRisks.length} in total) are primarily concentrated in data privacy, model bias audits, and algorithmic transparency logs.`;
      const p3 = `The organization must prioritize closing outstanding control gaps, resolving high-risk flagged use cases, and formalizing accountable decision owners before the next scheduled steering committee review.`;
      return `${p1}\n${p2}\n${p3}`;
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setIsSimulated(false);
    try {
      const payload = {
        lang: lang,
        dataContext: {
          totalUseCases,
          activeUseCases: inProductionCount,
          totalRisks: risks.length,
          criticalOpenRisks: criticalOpenCount,
          missingEvidence: missingEvidenceCount,
          overdueControls: overdueControls.length
        }
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Serverless function responded with status " + response.status);
      }

      const data = await response.json();
      if (data.text) {
        setAiText(data.text);
        if (data.simulated) {
          setIsSimulated(true);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.warn("Failed to generate AI report from serverless function, running local governor engine fallback:", error);
      
      // Simulate organic generation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setAiText(getDynamicBriefing());
      setIsSimulated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportMarkdown = () => {
    if (contentRef.current) {
      const text = contentRef.current.innerText;
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI_Governance_Briefing_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-end space-x-3 mb-4 print:hidden">
        <button 
          onClick={handleRegenerate} 
          disabled={isGenerating}
          className="btn btn-secondary relative overflow-hidden group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-600 dark:text-indigo-400"/> : <Sparkles className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400"/>} 
          {isGenerating ? tLocal("Generando...", "Generating...") : tLocal("Regenerar Reporte (IA)", "Regenerate Report (AI)")}
        </button>
        <button onClick={handleCopy} className="btn btn-secondary border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700">
          {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500"/> : <Copy className="w-4 h-4 mr-2"/>} 
          {copied ? tLocal("Copiado", "Copied") : tLocal("Copiar Resumen", "Copy Summary")}
        </button>
        <button onClick={handleExportMarkdown} className="btn btn-secondary border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700">
          <Download className="w-4 h-4 mr-2"/> {tLocal("Exportar Markdown", "Export Markdown")}
        </button>
        <button onClick={handlePrint} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          <Printer className="w-4 h-4 mr-2"/> {tLocal("Vista de Impresión", "Print View")}
        </button>
      </div>

      <div ref={contentRef} className="card bg-white dark:bg-slate-900 p-10 shadow-xl border-t-8 border-t-slate-950 dark:border-t-indigo-500 print:shadow-none print:border-t-0 print:p-0">
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 mb-8">
          <p className="text-xs font-bold tracking-widest text-red-600 dark:text-red-400 mb-2">{tLocal("CONFIDENCIAL · USO RESTRINGIDO AL COMITÉ EJECUTIVO", "CONFIDENTIAL · RESTRICTED TO EXECUTIVE COMMITTEE")}</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{tLocal("Briefing de Gobernanza de Inteligencia Artificial", "Artificial Intelligence Governance Briefing")}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">AI Governance Control Tower · Enterprise AI & IT Leadership Suite</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">{tLocal("Fecha de emisión:", "Date of issue:")}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {new Date().toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">{tLocal("Destinatario:", "Recipient:")}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{tLocal("Comité Directivo · AI Governance · Risk & Compliance", "Steering Committee · AI Governance · Risk & Compliance")}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
              {tLocal(
                "Los puntajes de riesgo son calculados dinámicamente para demostración de portfolio y representan un modelo simplificado de gobierno.",
                "Risk scores are dynamically computed for portfolio demonstration and represent a simplified governance model."
              )}
            </p>
          </div>
        </div>

        {isSimulated && (
          <div className="mb-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 text-xs flex items-start border border-indigo-100 dark:border-indigo-900/50 print:hidden animate-fade-in">
            <Info className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{tLocal("Simulación de Gobernanza IA Activa", "Active AI Governance Simulation")}</p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                {tLocal(
                  "Este informe ejecutivo se ha generado localmente a partir de las métricas reales del portafolio, garantizando resiliencia y protegiendo las credenciales en producción.",
                  "This executive report was generated locally using real-time portfolio metrics, ensuring demo resilience and safeguarding credentials in production."
                )}
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center">
            {tLocal("1. Resumen Ejecutivo", "1. Executive Summary")}
            <span className="ml-3 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10">
              <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
              AI Generated
            </span>
          </h2>
          
          <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-justify bg-slate-50 dark:bg-slate-800 p-5 rounded-md border-l-4 border-indigo-600 shadow-sm relative">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm text-slate-500 font-medium">{tLocal("Analizando portafolio y sintetizando hallazgos clave...", "Analyzing portfolio and synthesizing key findings...")}</p>
              </div>
            ) : aiText ? (
              <div className="space-y-4">
                {aiText.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {getDynamicBriefing().split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{tLocal("2. Estado del Portafolio IA", "2. AI Portfolio Status")}</h2>
            <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Total Iniciativas Registradas:", "Total Registered Initiatives:")}</span> <span className="font-bold">{totalUseCases}</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("En Producción / Aprobadas:", "In Production / Approved:")}</span> <span className="font-bold">{inProductionCount}</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("En Validación (Piloto):", "In Validation (Pilot):")}</span> <span className="font-bold">{inPilotCount}</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("En Revisión / Aprob. Condicional:", "In Review / Cond. Approval:")}</span> <span className="font-bold">{inReviewCount}</span></li>
              <li className="flex justify-between text-red-600 dark:text-red-400"><span className="font-medium">{tLocal("Bloqueadas:", "Blocked:")}</span> <span className="font-bold">{blockedCount}</span></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{tLocal("3. Exposición al Riesgo", "3. Risk Exposure")}</h2>
            <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Riesgos Críticos (Abiertos):", "Critical Risks (Open):")}</span> <span className="font-bold text-red-600 dark:text-red-400">{criticalOpenCount}</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Riesgos Altos (Abiertos):", "High Risks (Open):")}</span> <span className="font-bold text-orange-600 dark:text-orange-400">{highOpenCount}</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Riesgos Medios (Abiertos):", "Medium Risks (Open):")}</span> <span className="font-bold">{mediumOpenCount}</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Score Promedio de Riesgo:", "Average Risk Score:")}</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{avgRiskScore} / 25</span></li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{tLocal("4. Decisiones Requeridas (Comité)", "4. Required Decisions (Committee)")}</h2>
          <div className="space-y-4">
            {uc003 && ['Bloqueado', 'Blocked'].includes(uc003.status) ? (
              <div className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tLocal("Desbloquear, rediseñar o retirar Asistente IA de Cribado de CVs (UC-003)", "Unblock, redesign or retire AI Resume Screening Assistant (UC-003)")}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tLocal("Riesgo crítico de sesgo algorítmico y cumplimiento regulatorio. Auditoría externa pendiente.", "Critical risk of algorithmic bias and regulatory compliance. External audit pending.")}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 text-slate-500 line-through">{tLocal("Desbloquear Asistente IA de Cribado de CVs (UC-003) - RESUELTO", "Unblock AI Resume Screening Assistant (UC-003) - RESOLVED")}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {tLocal(
                      `El caso de uso ha sido transicionado a "${uc003 ? uc003.status : 'N/A'}" con justificación formal.`,
                      `The use case has been transitioned to "${uc003 ? uc003.status : 'N/A'}" with formal rationale.`
                    )}
                  </p>
                </div>
              </div>
            )}

            {policyExceptions.some(e => e.id === 'EXC-003' && e.status === 'In Review') ? (
              <div className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tLocal("Resolver excepción de revisión humana de salidas IA (EXC-003)", "Resolve policy exception for human review of AI outputs (EXC-003)")}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tLocal("Impacto en Asistente de Conocimiento Ejecutivo. Requiere balance entre productividad y riesgo de alucinación.", "Impacts Executive Knowledge Assistant. Requires balance between productivity and hallucination risk.")}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 text-slate-500 line-through">{tLocal("Excepción EXC-003 de revisión humana - RESUELTA", "Policy exception EXC-003 for human review - RESOLVED")}</h4>
                  <p className="text-sm text-slate-500 mt-1">{tLocal("La excepción de política ha sido formalmente evaluada y cerrada por el comité.", "The policy exception has been formally evaluated and closed by the committee.")}</p>
                </div>
              </div>
            )}

            {overdueControls.length > 0 ? (
              <div className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {tLocal(`Cerrar controles vencidos (${overdueControls.map(c => c.id).join(', ')})`, `Close overdue controls (${overdueControls.map(c => c.id).join(', ')})`)}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tLocal("Principalmente minimización de datos, revisión de accesos, auditoría de sesgo y retención de logs.", "Mainly data minimization, access reviews, bias audit, and log retention.")}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 text-slate-500 line-through">{tLocal("Todos los controles están al día", "All controls are up to date")}</h4>
                  <p className="text-sm text-slate-500 mt-1">{tLocal("No se identifican controles fuera de plazo pendientes de revisión.", "No overdue controls pending review were identified.")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500">{tLocal("Generado dinámicamente por AI Governance Control Tower", "Dynamically generated by AI Governance Control Tower")}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{tLocal("No contiene datos reales · Fines demostrativos", "Contains no real data · For demonstration purposes")}</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveBriefing;
