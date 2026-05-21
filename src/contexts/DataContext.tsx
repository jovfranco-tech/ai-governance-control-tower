/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as demoDataEn from '../data/demoDataEn';
import * as demoDataEs from '../data/demoDataEs';
import { agents as agentsEn } from '../data/agents';
import { useAppContext } from './AppContext';
import {
  AIUseCase, AIRisk, GovernanceControl, ComplianceEvidence,
  AIVendor, PolicyException, AuditEvent, Persona, AIAgent
} from '../types';

interface DataContextType {
  useCases: AIUseCase[];
  addUseCase: (uc: AIUseCase) => void;
  deleteUseCase: (id: string) => void;
  updateUseCase: (id: string, updates: Partial<AIUseCase>) => void;
  risks: AIRisk[];
  controls: GovernanceControl[];
  evidences: ComplianceEvidence[];
  vendors: AIVendor[];
  policyExceptions: PolicyException[];
  auditEvents: AuditEvent[];
  personas: Persona[];
  agents: AIAgent[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useAppContext();

  const activeData = lang === 'es' ? demoDataEs : { ...demoDataEn, agents: agentsEn };
  const {
    useCases: defaultUseCases,
    risks: defaultRisks,
    controls: defaultControls,
    evidences: defaultEvidences,
    vendors: defaultVendors,
    policyExceptions: defaultExceptions,
    auditEvents: defaultEvents,
    personas: defaultPersonas,
    agents: defaultAgents
  } = activeData as unknown as {
    useCases: AIUseCase[];
    risks: AIRisk[];
    controls: GovernanceControl[];
    evidences: ComplianceEvidence[];
    vendors: AIVendor[];
    policyExceptions: PolicyException[];
    auditEvents: AuditEvent[];
    personas: Persona[];
    agents: AIAgent[];
  };

  const storageKey = `ai-gov-usecases-v2-${lang}`;

  const [useCases, setUseCases] = useState<AIUseCase[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultUseCases;
    } catch {
      return defaultUseCases;
    }
  });

  const [risks, setRisks] = useState<AIRisk[]>(defaultRisks);
  const [controls, setControls] = useState<GovernanceControl[]>(defaultControls);
  const [evidences, setEvidences] = useState<ComplianceEvidence[]>(defaultEvidences);
  const [vendors, setVendors] = useState<AIVendor[]>(defaultVendors);
  const [policyExceptions, setPolicyExceptions] = useState<PolicyException[]>(defaultExceptions);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(defaultEvents);
  const [personas, setPersonas] = useState<Persona[]>(defaultPersonas);
  const [agents, setAgents] = useState<AIAgent[]>(defaultAgents);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRisks(defaultRisks);
     
    setControls(defaultControls);
     
    setEvidences(defaultEvidences);
     
    setVendors(defaultVendors);
     
    setPolicyExceptions(defaultExceptions);
     
    setAuditEvents(defaultEvents);
     
    setPersonas(defaultPersonas);
     
    setAgents(defaultAgents);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
         
        setUseCases(JSON.parse(saved));
      } else {
         
        setUseCases(defaultUseCases);
      }
    } catch {
       
      setUseCases(defaultUseCases);
    }
  }, [lang, storageKey, defaultRisks, defaultControls, defaultEvidences, defaultVendors, defaultExceptions, defaultEvents, defaultPersonas, defaultAgents, defaultUseCases]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(useCases));
  }, [useCases, storageKey]);

  const addUseCase = (uc: AIUseCase) => setUseCases(prev => [uc, ...prev]);
  const deleteUseCase = (id: string) => setUseCases(prev => prev.filter(u => u.id !== id));
  const updateUseCase = (id: string, updates: Partial<AIUseCase>) => {
    setUseCases(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  return (
    <DataContext.Provider value={{
      useCases, addUseCase, deleteUseCase, updateUseCase,
      risks, controls, evidences, vendors,
      policyExceptions, auditEvents, personas, agents
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};
