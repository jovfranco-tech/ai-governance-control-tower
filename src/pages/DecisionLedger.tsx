import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PageHeader } from '../components/ui/PageHeader';
import { decisionLedgerData } from '../data/decisionLedger';
import { 
  ShieldAlert, Clock, AlertTriangle, ShieldCheck, ArrowRight, Key, ClipboardList
} from 'lucide-react';

const DecisionLedger = () => {
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  const [selectedId, setSelectedId] = useState<string>(decisionLedgerData[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState<string>('All');

  const selectedDecision = decisionLedgerData.find(d => d.id === selectedId) || decisionLedgerData[0];

  // Calculations for KPI cards
  const totalDecisions = decisionLedgerData.length;
  const blockedCount = decisionLedgerData.filter(d => d.policyOutcome === 'Block').length;
  const pendingHumanApprovals = decisionLedgerData.filter(d => d.humanApprovalRequired).length;
  const highRiskCount = decisionLedgerData.filter(d => ['High', 'Critical'].includes(d.riskLevel)).length;
  const auditTracesCount = decisionLedgerData.filter(d => d.simulatedHash).length;

  const filteredDecisions = decisionLedgerData.filter(d => {
    const matchesSearch = 
      d.useCase.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOutcome = filterOutcome === 'All' || d.policyOutcome === filterOutcome;
    
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header premium with simulation disclaimer */}
      <div className="relative">
        <PageHeader 
          title={tLocal("Bitácora de Decisiones IA / Runtime Governance", "AI Decision Ledger / Runtime Governance")} 
          subtitle={tLocal(
            "Registro de gobernanza en runtime para decisiones asistidas por IA, resultados de políticas, aprobaciones humanas y trazabilidad auditable.",
            "Runtime governance log for AI-assisted decisions, policy outcomes, human approvals, and audit-ready evidence traces."
          )}
        />
        
        {/* Simulation Disclaimer Callout */}
        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-start gap-2.5 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>{tLocal("ENTORNO DE DEMOSTRACIÓN:", "DEMOSTRATION ENVIRONMENT:")}</strong>{" "}
            {tLocal(
              "Bitácora de runtime governance simulada para fines de demostración de portafolio. Utiliza datos empresariales sintéticos y firmas criptográficas mockeadas. No representa cumplimiento legal ni normativo real.",
              "Simulated runtime governance ledger for portfolio demonstration. Uses synthetic enterprise data and mocked cryptographic signatures. Does not represent production legal or regulatory compliance."
            )}
          </span>
        </div>
      </div>

      {/* 2. Top-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="card p-4 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {tLocal("Decisiones Registradas", "Decisions Logged")}
            </span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none mt-1">
              {totalDecisions}
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card p-4 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {tLocal("Decisiones Bloqueadas", "Blocked Decisions")}
            </span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 leading-none mt-1">
              {blockedCount}
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="card p-4 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {tLocal("Pendiente Aprobación", "Approvals Pending")}
            </span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 leading-none mt-1">
              {pendingHumanApprovals}
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card p-4 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {tLocal("Decisiones Alto Riesgo", "High-Risk Decisions")}
            </span>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 leading-none mt-1">
              {highRiskCount}
            </p>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="card p-4 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {tLocal("Trazas de Auditoría", "Audit-Ready Traces")}
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none mt-1">
              {auditTracesCount}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Filtering and Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Filter and Feed Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl flex flex-col sm:flex-row gap-3 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                className="block w-full pl-3 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs"
                placeholder={tLocal("Buscar decisión, caso o auditor...", "Search decision, use case or auditor...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-1 overflow-x-auto w-full sm:w-auto justify-start sm:justify-end py-1">
              {(['All', 'Allow', 'Review', 'Block', 'Audit'] as const).map((outcome) => (
                <button
                  key={outcome}
                  onClick={() => setFilterOutcome(outcome)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterOutcome === outcome 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {outcome === 'All' ? tLocal("Todos", "All") : outcome}
                </button>
              ))}
            </div>
          </div>

          {/* Main Decision Feed Table */}
          <div className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/40">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {tLocal("ID / Timestamp", "ID / Timestamp")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {tLocal("Caso de Uso", "Use Case")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {tLocal("Resultado GRC", "GRC Outcome")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {tLocal("Riesgo", "Risk")}
                    </th>
                    <th scope="col" className="relative px-4 py-3"><span className="sr-only">Inspect</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredDecisions.length > 0 ? (
                    filteredDecisions.map((dec) => {
                      const isSelected = dec.id === selectedId;
                      return (
                        <tr 
                          key={dec.id} 
                          onClick={() => setSelectedId(dec.id)}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                            isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                              {dec.id}
                            </div>
                            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                              {new Date(dec.timestamp).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {dec.useCase}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 flex gap-2">
                              <span className="font-semibold text-slate-500">{dec.domain}</span>
                              <span>·</span>
                              <span className="italic font-mono">{dec.modelProvider}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                              dec.policyOutcome === 'Allow' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50' :
                              dec.policyOutcome === 'Review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50' :
                              dec.policyOutcome === 'Block' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50' :
                              'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/50'
                            }`}>
                              {dec.policyOutcome}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                              dec.riskLevel === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                              dec.riskLevel === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400' :
                              dec.riskLevel === 'Medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' :
                              'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400'
                            }`}>
                              {dec.riskLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(dec.id);
                              }}
                              className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                                isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                              }`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {tLocal("No se encontraron registros de decisiones.", "No decision logs matched your filter.")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Drill-Down Forensic Detail Panel */}
        <div className="lg:col-span-1">
          <div className="card bg-slate-900 text-slate-150 border border-slate-800 shadow-xl rounded-xl p-5 space-y-5 sticky top-6">
            
            {/* Header info */}
            <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-widest block uppercase">
                  {tLocal("TRAZA OPERACIONAL FORENSE", "FORENSIC GOVERNANCE TRAIL")}
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  {selectedDecision.id}
                </h4>
              </div>
              
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                selectedDecision.policyOutcome === 'Allow' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60' :
                selectedDecision.policyOutcome === 'Review' ? 'bg-amber-950/60 text-amber-400 border border-amber-900/60' :
                selectedDecision.policyOutcome === 'Block' ? 'bg-rose-950/60 text-rose-400 border border-rose-900/60' :
                'bg-indigo-950/60 text-indigo-400 border border-indigo-900/60'
              }`}>
                {selectedDecision.policyOutcome}
              </span>
            </div>

            {/* General context */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase block tracking-wider">{tLocal("Caso de Uso:", "Use Case:")}</span>
                <p className="font-bold text-white mt-0.5">{selectedDecision.useCase}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] uppercase block tracking-wider">{tLocal("Dominio:", "Domain:")}</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedDecision.domain}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] uppercase block tracking-wider">{tLocal("Proveedor:", "Provider:")}</span>
                  <p className="font-mono text-slate-200 mt-0.5 text-[11px]">{selectedDecision.modelProvider}</p>
                </div>
              </div>
            </div>

            {/* Forensic parameters callout */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest block">{tLocal("ACCIÓN SOLICITADA EN RUNTIME", "REQUESTED RUNTIME ACTION")}</span>
                <p className="text-slate-300 mt-1 italic leading-relaxed">"{selectedDecision.requestedAction}"</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest block">{tLocal("RESUMEN DE DATOS ENTRADA", "INPUT METADATA CONTEXT")}</span>
                <p className="text-slate-300 mt-1">{selectedDecision.inputSummary}</p>
              </div>
            </div>

            {/* Dynamic Policy & Controls checks */}
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1.5">{tLocal("Comprobaciones de Políticas Ejecutadas:", "Policy Safeguard Evaluations:")}</span>
                <ul className="space-y-1 list-disc pl-4 text-slate-300">
                  {selectedDecision.policyChecksApplied.map((check, i) => (
                    <li key={i}>{check}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1.5">{tLocal("Controles ISO 42001 Evaluados:", "Triggered ISO 42001 Controls:")}</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedDecision.controlsTriggered.map((code) => (
                    <span key={code} className="px-2 py-0.5 bg-indigo-950 border border-indigo-900 text-indigo-300 font-mono font-bold rounded text-[10px]">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk callout */}
            <div className="p-3.5 bg-indigo-950/20 border-l-4 border-indigo-500 text-xs text-slate-300 leading-relaxed rounded shadow-inner">
              <div className="font-extrabold text-indigo-400 uppercase tracking-widest text-[9px] mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                {tLocal("Justificación del Motor de Gobernanza", "Governance Engine Assessment")}
              </div>
              <p className="text-justify text-[11px] leading-relaxed mt-1">{selectedDecision.riskRationale}</p>
            </div>

            {/* Real-time audit trail logs */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">{tLocal("Pistas de Auditoría de Transacciones (SecOps):", "Transactional Audit Trails (SecOps):")}</span>
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono text-[9px] text-slate-400 max-h-[140px] overflow-y-auto leading-relaxed">
                {selectedDecision.auditTrailEvents.map((evt, idx) => (
                  <div key={idx} className="truncate" title={evt}>{evt}</div>
                ))}
              </div>
            </div>

            {/* Cryptographic Simulated Signature */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {tLocal("Firma de Integridad Inmutable", "Immutable Integrity Signature")}
                </span>
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-1 py-0.5 rounded tracking-widest uppercase">
                  {tLocal("AUDITADO", "AUDIT READY")}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-850 text-slate-400 font-mono text-[8px] break-all select-all leading-normal text-justify">
                {selectedDecision.simulatedHash}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default DecisionLedger;
