import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { 
  Eye, Trash2, Search, Filter, Plus, X, 
  Cpu, AlertTriangle, ShieldCheck, FileCheck, 
  Sparkles, DollarSign, Clock, UserCheck, Settings, ArrowRight
} from 'lucide-react';
import { AIUseCase, UseCaseStatus, RiskLevel } from '../types';

const UseCaseRegistry = () => {
  const { lang } = useAppContext();
  const { useCases, addUseCase, deleteUseCase, updateUseCase, controls, evidences, personas } = useDataContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string | null>(null);
  
  // Registration Form State
  const [formData, setFormData] = useState<Partial<AIUseCase>>({
    name: '',
    businessUnit: 'Customer Experience',
    businessOwner: 'Omar Hernández',
    technicalOwner: 'María González',
    aiType: 'Generative AI',
    provider: 'OpenAI GPT-4o',
    description: '',
    dataUsed: 'Customer interaction logs, FAQ databases',
    dataSensitivity: 'Confidential',
    autonomyLevel: 'Human-in-the-loop',
    regulatoryExposure: 'Medium — GDPR, CCPA',
    businessCriticality: 'High',
    userImpact: 'High',
    estimatedValue: '$500K/yr value',
    efficiencyGain: '30% time reduction',
    strategicAlignment: 'Customer Care Optimization',
  });

  // Details Modal Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'controls' | 'copilot'>('overview');

  // Human-in-the-loop Decision Form State
  const [decisionStatus, setDecisionStatus] = useState<UseCaseStatus>('In Review');
  const [decisionText, setDecisionText] = useState('');
  const [decisionOwner, setDecisionOwner] = useState('Raquel Kimura');
  const [decisionReviewDate, setDecisionReviewDate] = useState('2026-09-15');

  const selectedUseCase = useCases.find(uc => uc.id === selectedUseCaseId);

  const handleOpenDetails = (uc: AIUseCase) => {
    setSelectedUseCaseId(uc.id);
    setDecisionStatus(uc.status);
    setDecisionText(uc.governanceDecision || '');
    setDecisionOwner(uc.technicalOwner || 'Raquel Kimura');
    setDecisionReviewDate(uc.nextReview || '2026-09-15');
    setActiveTab('overview');
  };

  const handleSaveDecision = () => {
    if (selectedUseCaseId) {
      updateUseCase(selectedUseCaseId, {
        status: decisionStatus,
        governanceDecision: decisionText || 'Approved with Conditions',
        nextReview: decisionReviewDate,
        technicalOwner: decisionOwner // Using technical owner as de facto reviewer/owner in this demo
      });
      setSelectedUseCaseId(null);
    }
  };

  // Dynamic Risk Scoring logic
  const calculateScore = (uc: AIUseCase) => {
    const sensitivityVal: Record<string, number> = { 'Highly Confidential': 3, 'Confidential': 2, 'Internal': 1, 'Public': 0 };
    const criticalityVal: Record<string, number> = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
    const autonomyVal: Record<string, number> = { 'Autonomous': 3, 'Semi-autonomous': 2, 'Human-in-the-loop': 1, 'Recommendation system': 0 };
    const userImpactVal: Record<string, number> = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
    
    // Reg exposure parsing
    let regVal = 1;
    if (uc.regulatoryExposure?.includes('Critical') || uc.regulatoryExposure?.includes('EU AI Act')) regVal = 3;
    else if (uc.regulatoryExposure?.includes('High') || uc.regulatoryExposure?.includes('SOX')) regVal = 2;
    else if (uc.regulatoryExposure?.includes('Medium') || uc.regulatoryExposure?.includes('GDPR')) regVal = 2;
    else if (uc.regulatoryExposure?.includes('Low')) regVal = 0;

    const score = (sensitivityVal[uc.dataSensitivity] || 0) + 
                  (criticalityVal[uc.businessCriticality] || 0) + 
                  (autonomyVal[uc.autonomyLevel] || 0) + 
                  (userImpactVal[uc.userImpact] || 0) + 
                  regVal;

    let level: RiskLevel;
    if (score >= 12) level = 'Critical';
    else if (score >= 9) level = 'High';
    else if (score >= 5) level = 'Medium';
    else level = 'Low';

    return { score, level };
  };

  const getRiskExplanation = (uc: AIUseCase, score: number, level: RiskLevel) => {
    const sens = uc.dataSensitivity;
    const crit = uc.businessCriticality;
    const auto = uc.autonomyLevel;
    const reg = uc.regulatoryExposure;
    
    if (lang === 'en') {
      return `Dynamic Inherent Risk assessment computed at ${score}/15 points. This initiative is categorized as a ${level.toUpperCase()} risk tier, driven primarily by its "${auto}" autonomy profile paired with a "${sens}" data footprint. Due to regulatory exposure risks (${reg}) and a "${crit}" business criticality rating, this model warrants comprehensive control mappings and periodic executive review under ISO/IEC 42001 guidance.`;
    } else {
      const levelEs = level === 'Critical' ? 'CRÍTICO' : level === 'High' ? 'ALTO' : level === 'Medium' ? 'MEDIO' : 'BAJO';
      const autoEs = auto === 'Autonomous' ? 'Autónomo' : auto === 'Semi-autonomous' ? 'Semiautónomo' : auto === 'Human-in-the-loop' ? 'Supervisión Humana' : 'Sistema de Recomendación';
      const sensEs = sens === 'Highly Confidential' ? 'Altamente Confidencial' : sens === 'Confidential' ? 'Confidencial' : sens === 'Internal' ? 'Interno' : 'Público';
      const critEs = crit === 'Critical' ? 'Crítica' : crit === 'High' ? 'Alta' : crit === 'Medium' ? 'Media' : 'Baja';
      return `Evaluación dinámica de riesgo inherente calculada en ${score}/15 puntos. Esta iniciativa se clasifica en el rango de riesgo ${levelEs}, impulsado principalmente por su nivel de autonomía "${autoEs}" y su huella de datos "${sensEs}". Dada la exposición regulatoria (${reg}) y una criticidad corporativa "${critEs}", este modelo requiere una cobertura de controles exhaustiva y auditoría periódica alineada con la norma ISO/IEC 42001.`;
    }
  };

  // Control Recommendation engine
  const getRecommendedControls = (uc: AIUseCase) => {
    const { level } = calculateScore(uc);
    // Return lists of control IDs based on computed risk level
    if (['Critical', 'High'].includes(level)) {
      return ['CTL-001', 'CTL-004', 'CTL-005', 'CTL-007', 'CTL-012', 'CTL-013', 'CTL-015'];
    } else {
      return ['CTL-002', 'CTL-003', 'CTL-006', 'CTL-010', 'CTL-016', 'CTL-018'];
    }
  };

  const handleAdd = () => {
    const newId = `UC-0${useCases.length + 1}`.padStart(6, '0');
    
    // Create new use case, calculate risk level dynamically
    const dummyUC: AIUseCase = {
      id: newId,
      name: formData.name || 'New Use Case',
      businessUnit: formData.businessUnit || 'Customer Experience',
      businessOwner: formData.businessOwner || 'Owner',
      technicalOwner: formData.technicalOwner || 'Tech Owner',
      aiType: formData.aiType || 'Generative AI',
      provider: formData.provider || 'Internal API',
      status: 'In Review' as UseCaseStatus,
      riskLevel: 'Medium' as RiskLevel, // Will update below
      governanceDecision: 'Draft Intake · Awaiting Review Board',
      nextReview: '2026-09-15',
      description: formData.description || '',
      dataUsed: formData.dataUsed || 'Internal logs',
      dataSensitivity: formData.dataSensitivity || 'Confidential',
      autonomyLevel: formData.autonomyLevel || 'Human-in-the-loop',
      regulatoryExposure: formData.regulatoryExposure || 'Medium — GDPR, CCPA',
      businessCriticality: formData.businessCriticality || 'High',
      userImpact: formData.userImpact || 'High',
      estimatedValue: formData.estimatedValue || '$150K/yr',
      efficiencyGain: formData.efficiencyGain || '20%',
      strategicAlignment: formData.strategicAlignment || 'Digital Transformation',
      riskAdjustedPriority: 5,
      linkedRisks: [],
      linkedControls: [],
    };

    const { level } = calculateScore(dummyUC);
    dummyUC.riskLevel = level;
    dummyUC.linkedControls = getRecommendedControls(dummyUC);
    
    // Add linked risk simulation
    if (level === 'Critical' || level === 'High') {
      dummyUC.linkedRisks = ['RSK-001', 'RSK-013'];
      dummyUC.riskAdjustedPriority = 4;
    } else {
      dummyUC.linkedRisks = ['RSK-002'];
      dummyUC.riskAdjustedPriority = 8;
    }

    addUseCase(dummyUC);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      businessUnit: 'Customer Experience',
      businessOwner: 'Omar Hernández',
      technicalOwner: 'María González',
      aiType: 'Generative AI',
      provider: 'OpenAI GPT-4o',
      description: '',
      dataUsed: 'Customer interaction logs, FAQ databases',
      dataSensitivity: 'Confidential',
      autonomyLevel: 'Human-in-the-loop',
      regulatoryExposure: 'Medium — GDPR, CCPA',
      businessCriticality: 'High',
      userImpact: 'High',
      estimatedValue: '$500K/yr value',
      efficiencyGain: '30% time reduction',
      strategicAlignment: 'Customer Care Optimization',
    });
  };

  const filteredUseCases = useCases.filter(uc => 
    uc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    uc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uc.businessUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title={tLocal("Registro Central de Iniciativas de IA", "Central AI Initiative Registry")} 
        subtitle={tLocal("Consola ejecutiva para la catalogación, scoring de riesgo dinámico, mapeo de controles y decisiones del comité.", "Executive console for cataloging, dynamic risk scoring, control mapping, and steering committee decisions.")}
      />

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              placeholder={tLocal("Buscar por ID, nombre o unidad...", "Search by ID, name or unit...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="btn btn-secondary flex items-center gap-1.5 cursor-pointer">
              <Filter className="h-4 w-4 text-slate-500" />
              {tLocal("Filtros", "Filters")}
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary flex items-center gap-1.5 cursor-pointer bg-slate-900 text-white hover:bg-slate-800 border-none dark:bg-indigo-600 dark:hover:bg-indigo-700">
              <Plus className="h-4 w-4" />
              {tLocal("Registrar Iniciativa", "Register Initiative")}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/40">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{tLocal("ID / Iniciativa", "ID / Initiative")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{tLocal("Unidad / Owner", "Unit / Owner")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{tLocal("Tecnología / Proveedor", "Tech / Provider")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{tLocal("Nivel Riesgo", "Risk Level")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">{tLocal("Gobernanza / Decisión", "Governance / Decision")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">{tLocal("Estado", "Status")}</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredUseCases.map((uc) => {
                const { score, level } = calculateScore(uc);
                return (
                  <tr key={uc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-400 font-mono">{uc.id}</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{uc.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 dark:text-slate-200 font-medium">{uc.businessUnit}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{uc.businessOwner}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 dark:text-slate-200">{uc.aiType}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{uc.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        level === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/30' :
                        level === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30' :
                        level === 'Medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30' :
                        'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900/30'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        {level} ({score})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {uc.governanceDecision}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        ['In Production', 'Approved'].includes(uc.status) ? 'badge-success' :
                        ['Blocked', 'Rejected'].includes(uc.status) ? 'badge-danger' :
                        ['In Review', 'Under Review'].includes(uc.status) ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {uc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenDetails(uc)} 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
                          title="Ver evaluación de IA y controles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteUseCase(uc.id)} 
                          className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── ADD USE CASE MODAL ────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-500" />
                  {tLocal("Registrar Nueva Iniciativa de IA", "Register New AI Initiative")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tLocal("Agrega el caso al inventario corporativo para habilitar la gobernanza activa.", "Add the use case to corporate inventory to enable active governance.")}</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Nombre de la Iniciativa", "Initiative Name")}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Sales AI Forecasting Model"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Unidad de Negocio", "Business Unit")}</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={formData.businessUnit}
                    onChange={e => setFormData({...formData, businessUnit: e.target.value})}
                  >
                    {['Customer Experience', 'IT Operations', 'Human Resources', 'Finance', 'Legal', 'Cybersecurity', 'Marketing', 'Sales'].map(bu => (
                      <option key={bu} value={bu}>{bu}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Business Owner", "Business Owner")}</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                    value={formData.businessOwner}
                    onChange={e => setFormData({...formData, businessOwner: e.target.value})}
                  >
                    {personas.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Tipo de IA / Proveedor", "AI Type / Provider")}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. OpenAI GPT-4o via API"
                    value={formData.provider}
                    onChange={e => setFormData({...formData, provider: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Descripción Operativa", "Operational Description")}</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  rows={2}
                  placeholder="Describe qué hace la IA, sus objetivos y su flujo básico..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {tLocal("Parámetros del Scoring de Riesgo IA (Insumos del Motor)", "AI Risk Scoring Parameters (Engine Inputs)")}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Sensibilidad de Datos", "Data Sensitivity")}</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                      value={formData.dataSensitivity}
                      onChange={e => setFormData({...formData, dataSensitivity: e.target.value})}
                    >
                      {['Public', 'Internal', 'Confidential', 'Highly Confidential'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Autonomía del Modelo", "Model Autonomy")}</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                      value={formData.autonomyLevel}
                      onChange={e => setFormData({...formData, autonomyLevel: e.target.value})}
                    >
                      {['Recommendation system', 'Human-in-the-loop', 'Semi-autonomous', 'Autonomous'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Exposición Regulatoria", "Regulatory Exposure")}</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                      value={formData.regulatoryExposure}
                      onChange={e => setFormData({...formData, regulatoryExposure: e.target.value})}
                    >
                      <option value="Low">Low — Internal only</option>
                      <option value="Medium — GDPR, CCPA">Medium — GDPR, CCPA</option>
                      <option value="High — SOX, PCI-DSS">High — SOX, PCI-DSS</option>
                      <option value="Critical — EU AI Act (High Risk)">Critical — EEOC, EU AI Act High Risk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Criticidad Corporativa", "Business Criticality")}</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                      value={formData.businessCriticality}
                      onChange={e => setFormData({...formData, businessCriticality: e.target.value})}
                    >
                      {['Low', 'Medium', 'High', 'Critical'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Impacto en Usuarios Finales", "User Impact")}</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                      value={formData.userImpact}
                      onChange={e => setFormData({...formData, userImpact: e.target.value})}
                    >
                      {['Low', 'Medium', 'High', 'Critical'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tLocal("Retorno Estimado (ROI)", "Estimated Value (ROI)")}</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                      placeholder="e.g. $400K/yr savings"
                      value={formData.estimatedValue}
                      onChange={e => setFormData({...formData, estimatedValue: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary cursor-pointer">{tLocal("Cancelar", "Cancel")}</button>
              <button onClick={handleAdd} className="btn btn-primary cursor-pointer bg-slate-900 text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 border-none">{tLocal("Guardar y Evaluar", "Save & Evaluate")}</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── USE CASE DETAIL & REVIEW BOARD MODAL ──────────────────────────────── */}
      {selectedUseCase && (() => {
        const { score, level } = calculateScore(selectedUseCase);
        const explanation = getRiskExplanation(selectedUseCase, score, level);
        const recommendedIds = getRecommendedControls(selectedUseCase);
        const linkedControlsList = controls.filter(c => recommendedIds.includes(c.id));
        const missingEvidenceCount = evidences.filter(e => recommendedIds.includes(e.controlId) && ['Missing', 'Faltante'].includes(e.status)).length;
        const overdueControlsCount = linkedControlsList.filter(c => ['Overdue', 'Vencido'].includes(c.status)).length;

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex justify-between items-start shrink-0">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 font-mono">{selectedUseCase.id}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedUseCase.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      level === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                      level === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400' :
                      level === 'Medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' :
                      'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {level} ({score}/15)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedUseCase.businessUnit}</span>
                    <span>·</span>
                    <span>{tLocal("Owner de Negocio:", "Business Owner:")} {selectedUseCase.businessOwner}</span>
                    <span>·</span>
                    <span>{tLocal("Líder Técnico:", "Technical Owner:")} {selectedUseCase.technicalOwner}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUseCaseId(null)} 
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs navigation */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 gap-6 shrink-0">
                {(['overview', 'risk', 'controls', 'copilot'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                      activeTab === tab 
                        ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab === 'overview' ? tLocal("General y Comité", "Overview & Decisions") :
                     tab === 'risk' ? tLocal("Motor de Riesgo (IA)", "Risk Scoring Engine") :
                     tab === 'controls' ? tLocal("Controles ISO 42001", "ISO 42001 Controls") :
                     tLocal("Copilot de Gobernanza", "Governance Copilot")}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* ─── TAB: OVERVIEW & COMMITTEE DECISIONS ───────────────────────── */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Operational description card */}
                      <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{tLocal("Descripción y Arquitectura", "Description & Architecture")}</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">{selectedUseCase.description || tLocal("Sin descripción registrada.", "No description registered.")}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 text-xs">
                          <div>
                            <span className="text-slate-400">{tLocal("Tecnología base:", "Base Tech:")}</span>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedUseCase.aiType} ({selectedUseCase.provider})</p>
                          </div>
                          <div>
                            <span className="text-slate-400">{tLocal("Datos procesados:", "Data footprint:")}</span>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate" title={selectedUseCase.dataUsed}>{selectedUseCase.dataUsed}</p>
                          </div>
                        </div>
                      </div>

                      {/* Business value & ROI card */}
                      <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">{tLocal("Valor de Negocio y Alineación", "Business Value & ROI Alignment")}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2.5">
                            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{tLocal("Valor Estimado", "Est. Value")}</span>
                              <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 mt-0.5">{selectedUseCase.estimatedValue}</p>
                            </div>
                          </div>
                          <div className="p-3.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2.5">
                            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{tLocal("Eficiencia", "Efficiency Gain")}</span>
                              <p className="text-xs font-extrabold text-indigo-800 dark:text-indigo-300 mt-0.5">{selectedUseCase.efficiencyGain}</p>
                            </div>
                          </div>
                          <div className="p-3.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-start gap-2.5">
                            <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{tLocal("Alineación", "Alignment")}</span>
                              <p className="text-xs font-extrabold text-purple-800 dark:text-purple-300 mt-0.5 truncate" title={selectedUseCase.strategicAlignment}>{selectedUseCase.strategicAlignment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Human-in-the-loop workflow panel */}
                    <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-indigo-100 dark:border-indigo-950 shadow-md space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <UserCheck className="w-4 h-4" />
                        {tLocal("Control de Aprobación Humana", "Human-in-the-loop Decision")}
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug">
                        {tLocal("Modifica el estado de gobernanza del caso de uso. Los cambios se guardarán localmente para simular el flujo de aprobación.", "Modify the use case's governance status. Edits persist in local state to simulate committee sign-offs.")}
                      </p>

                      <div className="space-y-3 pt-2 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{tLocal("Estado de Gobernanza", "Governance Status")}</label>
                          <select 
                            className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            value={decisionStatus}
                            onChange={e => setDecisionStatus(e.target.value as UseCaseStatus)}
                          >
                            <option value="Draft">{tLocal("Borrador (Draft)", "Draft")}</option>
                            <option value="In Review">{tLocal("En Revisión (In Review)", "In Review")}</option>
                            <option value="Approved">{tLocal("Aprobado (Approved)", "Approved")}</option>
                            <option value="Conditional Approval">{tLocal("Aprobado con Condiciones", "Approved with Conditions")}</option>
                            <option value="Blocked">{tLocal("Bloqueado (Blocked)", "Blocked")}</option>
                            <option value="Retired">{tLocal("Retirado (Retired)", "Retired")}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{tLocal("Líder Auditor de la Decisión", "Audit / Decision Owner")}</label>
                          <select 
                            className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            value={decisionOwner}
                            onChange={e => setDecisionOwner(e.target.value)}
                          >
                            {personas.map(p => (
                              <option key={p.id} value={p.name}>{p.name} ({p.role})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{tLocal("Próxima Fecha de Revisión", "Next Review Date")}</label>
                          <input 
                            type="date"
                            className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            value={decisionReviewDate}
                            onChange={e => setDecisionReviewDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{tLocal("Justificación o Resolución del Comité", "Committee Resolution Rationale")}</label>
                          <textarea 
                            className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans"
                            rows={3}
                            placeholder={tLocal("Indica las condiciones, salvedades o razones para esta decisión...", "Indicate conditions, restrictions, or reasons for this decision...")}
                            value={decisionText}
                            onChange={e => setDecisionText(e.target.value)}
                          ></textarea>
                        </div>

                        <button 
                          onClick={handleSaveDecision}
                          className="w-full btn btn-primary mt-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white border-none py-2 text-xs font-bold tracking-wider"
                        >
                          {tLocal("Persistir Decisión Humana", "Apply & Persist Decision")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB: RISK SCORING ENGINE ──────────────────────────────────── */}
                {activeTab === 'risk' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">{tLocal("Resultados del Motor de Riesgo Inherente IA", "AI Inherent Risk Engine Results")}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">{tLocal("El motor ejecuta cálculos dinámicos basados en la arquitectura operacional, criticidad y volumen de datos de la iniciativa.", "The engine runs dynamic math based on the initiative's operational architecture, business criticality, and data volume.")}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
                        {[
                          { label: tLocal("Datos", "Data"), val: selectedUseCase.dataSensitivity, score: selectedUseCase.dataSensitivity === 'Highly Confidential' ? 3 : selectedUseCase.dataSensitivity === 'Confidential' ? 2 : 1 },
                          { label: tLocal("Criticidad", "Criticality"), val: selectedUseCase.businessCriticality, score: selectedUseCase.businessCriticality === 'Critical' ? 3 : selectedUseCase.businessCriticality === 'High' ? 2 : 1 },
                          { label: tLocal("Autonomía", "Autonomy"), val: selectedUseCase.autonomyLevel, score: selectedUseCase.autonomyLevel === 'Autonomous' ? 3 : selectedUseCase.autonomyLevel === 'Semi-autonomous' ? 2 : 1 },
                          { label: tLocal("Impacto", "User Impact"), val: selectedUseCase.userImpact, score: selectedUseCase.userImpact === 'Critical' ? 3 : selectedUseCase.userImpact === 'High' ? 2 : 1 },
                          { label: tLocal("Regulación", "Regulation"), val: selectedUseCase.regulatoryExposure?.split(' — ')[0] || 'Medium', score: selectedUseCase.regulatoryExposure?.includes('Critical') ? 3 : 2 }
                        ].map((factor, i) => (
                          <div key={i} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/80 text-center flex flex-col justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{factor.label}</span>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-250 mt-1 truncate" title={factor.val}>{factor.val}</p>
                            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mt-2">+{factor.score} pts</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-500 text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                        <div className="font-extrabold text-indigo-800 dark:text-indigo-300 uppercase tracking-widest text-[9px] mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {tLocal("Justificación Técnica Generada por IA", "AI Generated Technical Justification")}
                        </div>
                        {explanation}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">{tLocal("Escalamiento y Umbral de Riesgo", "Escalation & Risk Threshold")}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{tLocal("Canal de Escalamiento:", "Escalation Path:")}</span>
                          <p className="text-slate-500 mt-1">
                            {score >= 12 
                              ? tLocal("Requiere revisión inmediata de la junta de directores, CIO, CISO y Director Legal.", "Requires immediate Board of Directors, CIO, CISO, and General Counsel review.")
                              : score >= 9
                              ? tLocal("Requiere revisión del comité de gobernanza de IA y firma de CISO antes de producción.", "Requires AI Governance Committee sign-off and CISO review prior to production.")
                              : tLocal("Revisión ordinaria trimestral a nivel de Business Unit y AI Governance Lead.", "Ordinary quarterly review at Business Unit and AI Governance Lead level.")}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{tLocal("Límites del Motor Dinámico:", "Dynamic Engine Bounds:")}</span>
                          <p className="text-slate-500 mt-1">
                            {tLocal("Los límites de riesgo dinámico calculan controles compensatorios de forma inteligente. Si el score sube por encima de 10, la prueba de sesgo (CTL-012) se vuelve un control mandatorio bloqueante.", "Dynamic risk bounds intelligently compute compensatory controls. If the score exceeds 10, bias testing (CTL-012) becomes a blocking mandatory control.")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB: CONTROL RECOMMENDATION ENGINE ──────────────────────────── */}
                {activeTab === 'controls' && (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-between shrink-0 flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-indigo-500" />
                          <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">{tLocal("Mapeo de Controles ISO/IEC 42001 Recomendados", "Recommended ISO/IEC 42001 Controls")}</h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tLocal("Controles calculados de forma determinista para mitigar los vectores de riesgo de la iniciativa.", "Controls calculated deterministically to mitigate the initiative's core risk vectors.")}</p>
                      </div>
                      <div className="flex gap-4 text-xs font-bold">
                        <div className="text-red-600 dark:text-red-400">{overdueControlsCount} {tLocal("Vencidos", "Overdue")}</div>
                        <div className="text-amber-600 dark:text-amber-400">{missingEvidenceCount} {tLocal("Evidencias Faltantes", "Missing Evidence")}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {linkedControlsList.map(c => {
                        const linkedEv = evidences.find(e => e.controlId === c.id);
                        return (
                          <div key={c.id} className="bg-white dark:bg-slate-950 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 transition-colors flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0">
                              <span className="text-xs font-bold text-slate-400 font-mono mt-0.5 shrink-0">{c.id}</span>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{c.name}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                                  <span className="font-bold text-indigo-500/80 uppercase tracking-widest text-[9px]">{c.category}</span>
                                  <span>·</span>
                                  <span>{tLocal("Efectividad:", "Effectiveness:")} <strong className="text-slate-600 dark:text-slate-300">{c.effectiveness}</strong></span>
                                  {c.isoReference && (
                                    <>
                                      <span>·</span>
                                      <span className="font-mono text-slate-500">{c.isoReference}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  c.status === 'Operational' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                                  c.status === 'Overdue' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400'
                                }`}>
                                  {c.status}
                                </span>
                                {linkedEv && (
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {tLocal("Evidencia:", "Evidence:")} {linkedEv.status}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── TAB: AI GOVERNANCE COPILOT ─────────────────────────────────── */}
                {activeTab === 'copilot' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Evidence Gaps */}
                      <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <FileCheck className="w-4 h-4 text-indigo-500" />
                          {tLocal("Análisis de Brechas de Evidencia (Gaps)", "Compliance & Evidence Gaps")}
                        </h4>
                        
                        {missingEvidenceCount > 0 ? (
                          <div className="space-y-3.5 mt-2">
                            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{tLocal(`Alerta: ${missingEvidenceCount} evidencias obligatorias están faltantes o pendientes de validación.`, `Alert: ${missingEvidenceCount} required compliance evidences are missing or pending review.`)}</p>
                            <div className="space-y-2">
                              {evidences.filter(e => recommendedIds.includes(e.controlId) && ['Missing', 'Faltante'].includes(e.status)).map(ev => (
                                <div key={ev.id} className="p-3 bg-red-50/40 dark:bg-red-950/10 rounded-lg border border-red-100 dark:border-red-950/30 text-xs">
                                  <div className="flex justify-between items-center font-bold">
                                    <span className="font-mono text-slate-400">{ev.id} · {ev.name}</span>
                                    <span className="text-red-600 dark:text-red-400 uppercase tracking-widest text-[9px]">{ev.status}</span>
                                  </div>
                                  <p className="text-slate-500 mt-1 leading-snug">{ev.notes}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">{tLocal("¡Excelente! Todos los controles recomendados cuentan con evidencias cargadas y aprobadas.", "Excellent! All recommended controls have validated, approved evidence.")}</p>
                        )}
                      </div>

                      {/* Next Recommended Actions */}
                      <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Settings className="w-4 h-4 text-indigo-500" />
                          {tLocal("Siguientes Acciones de Gobernanza Sugeridas", "Prioritized Governance Next Actions")}
                        </h4>
                        <div className="space-y-2 text-xs pt-1">
                          {score >= 9 ? (
                            <>
                              <div className="flex items-start gap-2.5">
                                <span className="h-5 w-5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0">1</span>
                                <div>
                                  <strong className="text-slate-900 dark:text-slate-200">{tLocal("Contratar auditoría de sesgo externa", "Contract external bias audit")}</strong>
                                  <p className="text-slate-500 mt-0.5">{tLocal("Para mitigar el riesgo algorítmico crítico y cumplir con el control CTL-012.", "To mitigate critical algorithmic risk and satisfy control CTL-012.")}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5 mt-2">
                                <span className="h-5 w-5 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0">2</span>
                                <div>
                                  <strong className="text-slate-900 dark:text-slate-200">{tLocal("Completar DPIA de Privacidad", "Complete DPIA Privacy review")}</strong>
                                  <p className="text-slate-500 mt-0.5">{tLocal("El control DPIA (CTL-014) debe ser refrendado por el Oficial de Cumplimiento.", "The DPIA control (CTL-014) must be validated by the Compliance Officer.")}</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-start gap-2.5">
                              <span className="h-5 w-5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0">1</span>
                              <div>
                                <strong className="text-slate-900 dark:text-slate-200">{tLocal("Documentar Model Cards", "Document Model Cards")}</strong>
                                <p className="text-slate-500 mt-0.5">{tLocal("Completa el control CTL-006 cargando las especificaciones de transparencia del modelo.", "Satisfy control CTL-006 by upload model transparency card details.")}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Copilot executive brief */}
                    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xl space-y-4 h-fit relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-60"></div>
                      <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                        <Sparkles className="w-20 h-20" />
                      </div>
                      
                      <div className="relative z-10 space-y-3 text-xs">
                        <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold uppercase tracking-widest text-[9px]">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          {tLocal("Copilot Directivo · AI-Native", "Executive Copilot · AI-Native")}
                        </div>
                        <h4 className="text-sm font-bold text-white">{tLocal("Recomendación de Aprobación de IA", "AI Recommendation Policy")}</h4>
                        
                        <p className="text-slate-400 leading-relaxed text-justify">
                          {score >= 12 
                            ? tLocal("El Copilot aconseja una postura de GOBERNANZA RESTRICCIONISTA. No autorizar producción autónoma. Bloquear hasta que la auditoría externa de sesgo (CTL-012) sea resuelta y los registros de logs (CTL-013) se cierren.", "The Copilot advises a RESTRICTIONIST GOVERNANCE posture. Do not authorize autonomous execution. Keep Blocked until external bias audit (CTL-012) is submitted and log retention (CTL-013) is closed.")
                            : score >= 9
                            ? tLocal("El Copilot aconseja una postura de APROBACIÓN CONDICIONAL. Habilitar paso a producción a condición de: 1) Mantener supervisión humana al 100%, 2) Monitorear métricas de deriva mensualmente (CTL-011).", "The Copilot advises a CONDITIONAL APPROVAL posture. Authorize production release under specific covenants: 1) Enforce 100% human-in-the-loop audit logs, 2) Monthly performance drift reviews (CTL-011).")
                            : tLocal("El Copilot aconseja una postura de APROBACIÓN RÁPIDA. Los riesgos inherentes son mínimos y están cubiertos formalmente por controles operativos robustos.", "The Copilot advises FAST-TRACK APPROVAL. Inherent risks are low and formally mitigated by operational, high-effectiveness controls.")}
                        </p>

                        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                          {tLocal("Evaluación en tiempo real basada en ISO/IEC 42001 · Demostración de portfolio", "Real-time assessment under ISO/IEC 42001 guidelines · Portfolio demonstration")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-end gap-2 shrink-0">
                <button 
                  onClick={() => setSelectedUseCaseId(null)} 
                  className="btn btn-secondary cursor-pointer py-1.5 text-xs"
                >
                  {tLocal("Cerrar Consola", "Close Console")}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default UseCaseRegistry;
