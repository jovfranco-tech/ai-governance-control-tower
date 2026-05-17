// ─── Core Enums / Unions ─────────────────────────────────────────────────────

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type UseCaseStatus =
  | 'In Production'
  | 'Pilot'
  | 'Approved'
  | 'In Review'
  | 'Conditional Approval'
  | 'Blocked'
  | 'Retired';

export type ControlStatus =
  | 'Operational'
  | 'In Implementation'
  | 'Overdue'
  | 'Not Started';

export type ControlMaturity =
  | 'Initial'
  | 'Managed'
  | 'Defined'
  | 'Measured'
  | 'Optimized';

export type EvidenceStatus =
  | 'Approved'
  | 'Submitted'
  | 'Missing'
  | 'Requested'
  | 'Overdue';

export type ExceptionStatus =
  | 'Submitted'
  | 'In Review'
  | 'Approved'
  | 'Rejected'
  | 'Expired';

export type AgentStatus =
  | 'Approved'
  | 'In Review'
  | 'Conditional'
  | 'Suspended';

// ─── AI Use Case ──────────────────────────────────────────────────────────────

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
  regulatoryExposure: string;
  businessCriticality: string;
  // Business Value
  estimatedValue: string;
  efficiencyGain: string;
  strategicAlignment: string;
  riskAdjustedPriority: number; // 1-10
  // Linked items
  linkedRisks: string[];
  linkedControls: string[];
}

// ─── AI Risk ─────────────────────────────────────────────────────────────────

export interface AIRisk {
  id: string;
  useCaseId: string;
  category: string;
  description: string;
  likelihood: number;
  impact: number;
  score: number;
  level: RiskLevel;
  inherentRiskScore?: number;
  residualRiskScore?: number;
  residualRisk: string;
  controlEffectiveness: string;
  owner: string;
  mitigationStatus?: string;
  status: string;
  dueDate: string;
  isoControl?: string;
  escalationFlag?: boolean;
}

// ─── Governance Control ───────────────────────────────────────────────────────

export interface GovernanceControl {
  id: string;
  name: string;
  domain?: string;
  category: string;
  objective: string;
  owner: string;
  status: ControlStatus;
  maturity?: ControlMaturity;
  evidenceRequired: string;
  evidenceStatus: string;
  lastReview: string;
  nextReview: string;
  effectiveness: string;
  isoReference?: string;
}

// ─── Compliance Evidence ──────────────────────────────────────────────────────

export interface ComplianceEvidence {
  id: string;
  name: string;
  type?: string;
  controlId: string;
  owner: string;
  status: EvidenceStatus;
  dueDate: string;
  notes?: string;
  reviewStatus?: string;
  auditorNotes?: string;
  gap?: string;
}

// ─── AI Vendor ────────────────────────────────────────────────────────────────

export interface AIVendor {
  id: string;
  name: string;
  service: string;
  dataProcessed: string;
  hostingRegion?: string;
  criticality: string;
  securityPosture?: string;
  modelTransparency?: string;
  contractualRisk?: string;
  privacyRisk?: string;
  slaRisk?: string;
  securityReview: string;
  privacyReview: string;
  complianceReview: string;
  dataResidency: string;
  subprocessors: number;
  riskLevel: RiskLevel;
  score: number;
  approvalStatus: string;
  requiredRemediation?: string;
  nextReview: string;
}

// ─── Policy Exception ─────────────────────────────────────────────────────────

export interface PolicyException {
  id: string;
  policyArea: string;
  relatedControl?: string;
  useCaseId: string;
  requestedBy: string;
  justification: string;
  riskImpact: RiskLevel;
  riskAcceptedBy?: string;
  compensatingControls: string;
  approver: string;
  status: ExceptionStatus;
  expirationDate: string;
}

// ─── AI Agent / Copilot ───────────────────────────────────────────────────────

export interface AIAgent {
  id: string;
  name: string;
  businessOwner: string;
  linkedUseCaseId: string;
  permissions: string[];
  dataAccess: string;
  toolsAllowed: string[];
  riskTier: RiskLevel;
  humanInTheLoop: boolean;
  loggingEnabled: boolean;
  approvalStatus: AgentStatus;
  lastReview: string;
  nextReview: string;
  notes: string;
}

// ─── Audit Event ─────────────────────────────────────────────────────────────

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

// ─── Persona ─────────────────────────────────────────────────────────────────

export interface Persona {
  id: string;
  name: string;
  role: string;
}
