export interface AIGovernanceResponse {
  task_type: 'risk_assessment' | 'control_recommendation' | 'executive_brief' | 'policy_gap_analysis';
  organization_id: string;
  use_case_id: string | null;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number; // 0.0 to 1.0
  rationale: string;
  recommended_controls: string[];
  limitations: string;
  human_review_required: boolean;
  next_actions: string[];
  language: 'en' | 'es';
  generated_at: string;

  // Optional fields for Executive Briefs
  executive_summary?: string;
  decision_points?: string[];
  risk_position?: string;
  business_value?: string;
  required_actions?: string[];
  board_level_note?: string;

  // Optional fields for Policy Gap Analysis
  detected_gaps?: string[];
  missing_controls?: string[];
  policy_risks?: string[];
  recommended_remediation?: string;

  // Demo status flags
  is_simulated?: boolean;
  ai_mode_status?: string;
}

export interface AIEngineProvider {
  generateRiskAssessment(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    title: string;
    description: string;
    dataSensitivity: string;
    modelType: string;
    businessUnit: string;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse>;

  generateControlRecommendations(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    title: string;
    description: string;
    riskLevel: string;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse>;

  generateExecutiveBrief(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    totalUseCases: number;
    activeUseCases: number;
    totalRisks: number;
    criticalOpenRisks: number;
    missingEvidence: number;
    overdueControls: number;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse>;

  generatePolicyGapAnalysis(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    title: string;
    description: string;
    controlsTally: number;
    evidenceTally: number;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse>;
}
