import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCases as defaultUseCases, risks as defaultRisks, controls as defaultControls, evidences as defaultEvidences, vendors as defaultVendors, policyExceptions as defaultExceptions, auditEvents as defaultEvents, personas as defaultPersonas } from '../data/demoData';
import { AIUseCase, AIRisk, GovernanceControl, ComplianceEvidence, AIVendor, PolicyException, AuditEvent, Persona } from '../types';

interface DataContextType {
  useCases: AIUseCase[];
  addUseCase: (uc: AIUseCase) => void;
  deleteUseCase: (id: string) => void;
  risks: AIRisk[];
  controls: GovernanceControl[];
  evidences: ComplianceEvidence[];
  vendors: AIVendor[];
  policyExceptions: PolicyException[];
  auditEvents: AuditEvent[];
  personas: Persona[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useCases, setUseCases] = useState<AIUseCase[]>(() => {
    const saved = localStorage.getItem('ai-gov-usecases');
    return saved ? JSON.parse(saved) : defaultUseCases;
  });

  const [risks] = useState<AIRisk[]>(defaultRisks);
  const [controls] = useState<GovernanceControl[]>(defaultControls);
  const [evidences] = useState<ComplianceEvidence[]>(defaultEvidences);
  const [vendors] = useState<AIVendor[]>(defaultVendors);
  const [policyExceptions] = useState<PolicyException[]>(defaultExceptions);
  const [auditEvents] = useState<AuditEvent[]>(defaultEvents);
  const [personas] = useState<Persona[]>(defaultPersonas);

  useEffect(() => {
    localStorage.setItem('ai-gov-usecases', JSON.stringify(useCases));
  }, [useCases]);

  const addUseCase = (uc: AIUseCase) => {
    setUseCases([uc, ...useCases]);
  };

  const deleteUseCase = (id: string) => {
    setUseCases(useCases.filter(u => u.id !== id));
  };

  return (
    <DataContext.Provider value={{ useCases, addUseCase, deleteUseCase, risks, controls, evidences, vendors, policyExceptions, auditEvents, personas }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
