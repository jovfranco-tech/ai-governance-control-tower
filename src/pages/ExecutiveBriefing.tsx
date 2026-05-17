import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import React, { useRef, useState, useEffect } from 'react';
import { Printer, Download, Copy, RefreshCw, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

const ExecutiveBriefing = () => {
  const { lang } = useAppContext();
  const { useCases, risks, controls, evidences } = useDataContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);

  // Generate initial report automatically or on demand
  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const activeUseCases = useCases.filter(u => ['En Producción', 'Piloto', 'Aprobado', 'In Production', 'Pilot', 'Approved'].includes(u.status));
      const openRisks = risks.filter(r => ['Abierto', 'Open', 'Mitigando', 'Mitigating'].includes(r.status));
      const criticalRisks = openRisks.filter(r => ['Crítico', 'Critical'].includes(r.level));
      
      const payload = {
        lang: lang,
        dataContext: {
          totalUseCases: useCases.length,
          activeUseCases: activeUseCases.length,
          totalRisks: risks.length,
          criticalOpenRisks: criticalRisks.length,
          missingEvidence: evidences.filter(e => ['Faltante', 'Missing'].includes(e.status)).length,
          overdueControls: controls.filter(c => ['Vencido', 'Overdue'].includes(c.status)).length
        }
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.text) {
        setAiText(data.text);
      }
    } catch (error) {
      console.error("Failed to generate AI report", error);
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
          className="btn btn-secondary relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-600"/> : <Sparkles className="w-4 h-4 mr-2 text-indigo-600"/>} 
          {isGenerating ? tLocal("Generando...", "Generating...") : tLocal("Regenerar Reporte (IA)", "Regenerate Report (AI)")}
        </button>
        <button onClick={handleCopy} className="btn btn-secondary">
          {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500"/> : <Copy className="w-4 h-4 mr-2"/>} 
          {copied ? tLocal("Copiado", "Copied") : tLocal("Copiar Resumen", "Copy Summary")}
        </button>
        <button onClick={handleExportMarkdown} className="btn btn-secondary"><Download className="w-4 h-4 mr-2"/> {tLocal("Exportar Markdown", "Export Markdown")}</button>
        <button onClick={handlePrint} className="btn btn-primary"><Printer className="w-4 h-4 mr-2"/> {tLocal("Vista de Impresión", "Print View")}</button>
      </div>

      <div ref={contentRef} className="card bg-white dark:bg-slate-900 p-10 shadow-xl border-t-8 border-t-slate-900 dark:border-t-indigo-500 print:shadow-none print:border-t-0 print:p-0">
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 mb-8">
          <p className="text-xs font-bold tracking-widest text-red-600 dark:text-red-400 mb-2">{tLocal("CONFIDENCIAL · USO RESTRINGIDO AL COMITÉ EJECUTIVO", "CONFIDENTIAL · RESTRICTED TO EXECUTIVE COMMITTEE")}</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{tLocal("Briefing de Gobernanza de Inteligencia Artificial", "Artificial Intelligence Governance Briefing")}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">AI Governance Control Tower · Enterprise AI & IT Leadership Suite</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">{tLocal("Fecha de emisión:", "Date of issue:")}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">2026</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">{tLocal("Destinatario:", "Recipient:")}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{tLocal("Comité Directivo · CIO / CISO / Director de IA", "Steering Committee · CIO / CISO / AI Director")}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center">
            {tLocal("1. Resumen Ejecutivo", "1. Executive Summary")}
            <span className="ml-3 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </span>
          </h2>
          
          <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-justify bg-slate-50 dark:bg-slate-800/50 p-5 rounded-md border-l-4 border-indigo-600 shadow-sm relative">
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
              <p>
                {tLocal("El portafolio corporativo de IA comprende 8 iniciativas registradas, de las cuales 4 se encuentran operativas o formalmente aprobadas para producción. La preparación de cumplimiento normativo se ubica en 47%, con 5 evidencias pendientes de subsanación que representan una brecha de auditoría activa. Se identifican 4 controles fuera de plazo y 4 iniciativas con exposición Alta o Crítica que requieren acción ejecutiva inmediata. La organización debe priorizar el cierre de brechas de control y la formalización de responsabilidades accountable antes de la próxima revisión del comité.", "The corporate AI portfolio comprises 8 registered initiatives, of which 4 are operational or formally approved for production. Regulatory compliance readiness stands at 47%, with 5 pending evidences representing an active audit gap. 4 overdue controls and 4 initiatives with High or Critical exposure require immediate executive action. The organization must prioritize closing control gaps and formalizing accountable responsibilities before the next committee review.")}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{tLocal("2. Estado del Portafolio IA", "2. AI Portfolio Status")}</h2>
            <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Total Iniciativas Registradas:", "Total Registered Initiatives:")}</span> <span className="font-bold">8</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("En Producción / Aprobadas:", "In Production / Approved:")}</span> <span className="font-bold">4</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("En Validación (Piloto):", "In Validation (Pilot):")}</span> <span className="font-bold">1</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("En Revisión / Aprob. Condicional:", "In Review / Cond. Approval:")}</span> <span className="font-bold">2</span></li>
              <li className="flex justify-between text-red-600 dark:text-red-400"><span className="font-medium">{tLocal("Bloqueadas:", "Blocked:")}</span> <span className="font-bold">1</span></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{tLocal("3. Exposición al Riesgo", "3. Risk Exposure")}</h2>
            <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Riesgos Críticos (Abiertos):", "Critical Risks (Open):")}</span> <span className="font-bold text-red-600 dark:text-red-400">5</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Riesgos Altos (Abiertos):", "High Risks (Open):")}</span> <span className="font-bold text-orange-600 dark:text-orange-400">5</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Riesgos Medios (Abiertos):", "Medium Risks (Open):")}</span> <span className="font-bold">4</span></li>
              <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">{tLocal("Score Promedio de Riesgo:", "Average Risk Score:")}</span> <span className="font-bold">13.2 / 25</span></li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{tLocal("4. Decisiones Requeridas (Comité)", "4. Required Decisions (Committee)")}</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tLocal("Desbloquear, rediseñar o retirar Asistente IA de Cribado de CVs (UC-003)", "Unblock, redesign or retire AI Resume Screening Assistant (UC-003)")}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tLocal("Riesgo crítico de sesgo algorítmico y cumplimiento regulatorio. Auditoría externa pendiente.", "Critical risk of algorithmic bias and regulatory compliance. External audit pending.")}</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tLocal("Resolver excepción de revisión humana de salidas IA (EXC-003)", "Resolve policy exception for human review of AI outputs (EXC-003)")}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tLocal("Impacto en Asistente de Conocimiento Ejecutivo. Requiere balance entre productividad y riesgo de alucinación.", "Impacts Executive Knowledge Assistant. Requires balance between productivity and hallucination risk.")}</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tLocal("Cerrar controles vencidos (CTL-005, CTL-008, CTL-012, CTL-013)", "Close overdue controls (CTL-005, CTL-008, CTL-012, CTL-013)")}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tLocal("Principalmente minimización de datos, revisión de accesos, auditoría de sesgo y retención de logs.", "Mainly data minimization, access reviews, bias audit, and log retention.")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500">{tLocal("Generado automáticamente por AI Governance Control Tower", "Automatically generated by AI Governance Control Tower")}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{tLocal("No contiene datos reales · Fines demostrativos", "Contains no real data · For demonstration purposes")}</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveBriefing;
