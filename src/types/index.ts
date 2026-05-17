export type RiskLevel = string;
export type UseCaseStatus = string;

export interface AIUseCase {
  id: string;
  name: string;
  businessUnit: string;
  businessOwner: string;
  technicalOwner: string;
  aiType: string;
  provider: string;
  status: UseCaseStatus;
  riskLevel: RiskLevel;
  governanceDecision: string;
  nextReview: string;
  description: string;
  dataUsed: string;
  dataSensitivity: string;
  userImpact: string;
  autonomyLevel: string;
}

export interface AIRisk {
  id: string;
  useCaseId: string;
  category: string;
  description: string;
  likelihood: number;
  impact: number;
  score: number;
  level: RiskLevel;
  owner: string;
  status: string;
  dueDate: string;
  residualRisk: string;
  controlEffectiveness: string;
}

export interface GovernanceControl {
  id: string;
  name: string;
  category: string;
  objective: string;
  owner: string;
  status: string;
  evidenceRequired: string;
  evidenceStatus: string;
  lastReview: string;
  nextReview: string;
  effectiveness: string;
}

export interface ComplianceEvidence {
  id: string;
  name: string;
  type: string;
  controlId: string;
  owner: string;
  status: string;
  dueDate: string;
  notes: string;
}

export interface AIVendor {
  id: string;
  name: string;
  service: string;
  dataProcessed: string;
  criticality: string;
  securityReview: string;
  privacyReview: string;
  complianceReview: string;
  dataResidency: string;
  subprocessors: number;
  riskLevel: RiskLevel;
  score: number;
  approvalStatus: string;
  nextReview: string;
}

export interface PolicyException {
  id: string;
  policyArea: string;
  useCaseId: string;
  requestedBy: string;
  justification: string;
  riskImpact: RiskLevel;
  compensatingControls: string;
  approver: string;
  status: string;
  expirationDate: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: string;
  module: string;
  actor: string;
  description: string;
  relatedObject: string;
  severity: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
}
