export interface AIDecision {
  id: string;
  timestamp: string;
  useCase: string;
  domain: string;
  modelProvider: string;
  requestedAction: string;
  policyOutcome: 'Allow' | 'Review' | 'Block' | 'Audit';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  humanApprovalRequired: boolean;
  owner: string;
  linkedControl: string;
  linkedEvidence: string;
  simulatedHash: string;
  inputSummary: string;
  policyChecksApplied: string[];
  controlsTriggered: string[];
  riskRationale: string;
  evidenceLink: string;
  auditTrailEvents: string[];
  dataSensitivity: string;
  autonomyLevel: string;
  regulationExposure: string;
}

export const decisionLedgerData: AIDecision[] = [
  {
    id: "DEC-83012",
    timestamp: "2026-05-27T11:45:01Z",
    useCase: "AI Resume Screening & Ranking",
    domain: "Human Resources",
    modelProvider: "OpenAI GPT-4o",
    requestedAction: "Sort candidate resumes and recommend top 5 percentile rankings for Tech Lead position.",
    policyOutcome: "Review",
    riskLevel: "High",
    humanApprovalRequired: true,
    owner: "Raquel Kimura",
    linkedControl: "CTL-012 (Algorithmic Bias Testing)",
    linkedEvidence: "EVI-42001-012 (Fairness Audit)",
    simulatedHash: "sha256:7f90c4ba98b0a1d48c89b210cfef4021ab78efc9284cfb78f8c928c94ba83012",
    inputSummary: "Candidate CV pool (n=142), Job Description ID: TD-992, User Profile: Recruiter-X.",
    policyChecksApplied: [
      "Fairness & Demographic Parity checks",
      "Model drift assessment",
      "Suppression of direct identifiers (PII)"
    ],
    controlsTriggered: ["CTL-012", "CTL-014", "CTL-019"],
    riskRationale: "Sorting resumes autonomously triggers high regulatory exposure under EU AI Act rules. Missing approved demographic fairness audit reports in this tenant forces human-in-the-loop review overrides.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "11:45:01.021 - Request submitted to secure API gateway",
      "11:45:01.085 - Multi-tenant RLS session validated successfully",
      "11:45:01.192 - Bias scanner flagged potential demographic mismatch (Confidence: 89%)",
      "11:45:01.205 - Gateway forced transaction status to 'PENDING_HUMAN_REVIEW'"
    ],
    dataSensitivity: "Confidential",
    autonomyLevel: "Semi-autonomous",
    regulationExposure: "High — EU AI Act Annex III"
  },
  {
    id: "DEC-83013",
    timestamp: "2026-05-27T11:21:40Z",
    useCase: "Customer Churn Predictive Scoring",
    domain: "Customer Experience",
    modelProvider: "XGBoost via AWS SageMaker",
    requestedAction: "Identify high-churn potential clients and assign automated retention discounts.",
    policyOutcome: "Allow",
    riskLevel: "Medium",
    humanApprovalRequired: false,
    owner: "Omar Hernández",
    linkedControl: "CTL-007 (Continuous Model Performance)",
    linkedEvidence: "EVI-42001-007 (Performance logs)",
    simulatedHash: "sha256:8a89f92881cf4ba98b0a1d48c89b210cfef4021ab78efc9284cfb78f8c928c94ba83013",
    inputSummary: "Monthly subscription metrics, activity logs, payment history, and region codes.",
    policyChecksApplied: [
      "PII leaks detection",
      "Data minimization limit validations",
      "Input boundary constraint validation"
    ],
    controlsTriggered: ["CTL-007", "CTL-010"],
    riskRationale: "Model acts autonomously but is strictly bounded inside minor budget adjustments ($20 max discount cap). Risk is calculated within Low-to-Medium thresholds. Mapped control EVI-42001-007 is healthy.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "11:21:40.120 - Gateway received prediction batch request",
      "11:21:40.155 - Inputs validated against schema variables",
      "11:21:40.231 - Decision engine registered RLS checks (Tenant: tenant-default)",
      "11:21:40.298 - Predicted output allowed: 12 clients classified as churners, budget within caps"
    ],
    dataSensitivity: "Internal",
    autonomyLevel: "Recommendation system",
    regulationExposure: "Low — Internal Operations"
  },
  {
    id: "DEC-83014",
    timestamp: "2026-05-27T10:59:12Z",
    useCase: "Generative Support Copilot",
    domain: "Customer Experience",
    modelProvider: "OpenAI GPT-4o",
    requestedAction: "Synthesize draft resolution message for client complaint email concerning billing dispute.",
    policyOutcome: "Block",
    riskLevel: "High",
    humanApprovalRequired: true,
    owner: "María González",
    linkedControl: "CTL-013 (Data Boundary Encryption)",
    linkedEvidence: "EVI-42001-013 (Boundary audit logs)",
    simulatedHash: "sha256:efc99a89f92881cf4ba98b0a1d48c89b210cfef4021ab78efc9284cfb7883014",
    inputSummary: "Disputed charge history, billing invoice PDFs, customer support conversation history.",
    policyChecksApplied: [
      "PII pattern screening (Card details, SSN)",
      "Financial data isolation scan",
      "Toxicity / adversarial input checks"
    ],
    controlsTriggered: ["CTL-013", "CTL-015"],
    riskRationale: "Input batch triggered critical PII validation alarms. Credit card primary account numbers (PAN) were detected inside raw unstructured email context blocks. Gateway automatically blocked the completions call.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "10:59:12.302 - API call initiated by SupportAgent-201",
      "10:59:12.385 - SecOps filter executed raw text sanitization check",
      "10:59:12.441 - CRITICAL: Credit card PAN pattern identified in line 44",
      "10:59:12.455 - ACTION: Transaction BLOCKED to prevent legal data breach. Logged as security incident."
    ],
    dataSensitivity: "Highly Confidential",
    autonomyLevel: "Human-in-the-loop",
    regulationExposure: "High — PCI-DSS, GDPR"
  },
  {
    id: "DEC-83015",
    timestamp: "2026-05-27T10:04:55Z",
    useCase: "Dynamic Pricing Optimizer",
    domain: "Finance",
    modelProvider: "Custom RL Pricing Model",
    requestedAction: "Recalculate dynamic enterprise license pricing adjustments for Q3 B2B software package.",
    policyOutcome: "Allow",
    riskLevel: "Low",
    humanApprovalRequired: false,
    owner: "Raquel Kimura",
    linkedControl: "CTL-003 (System Level Policies)",
    linkedEvidence: "EVI-42001-003 (System controls)",
    simulatedHash: "sha256:7f9a89f92881cf4ba98b0a1d48c89b210cfef4021ab78efc9284cfb78f8c928c94ba83015",
    inputSummary: "Client profile history, competitive pricing indicators, historical deal sizing data.",
    policyChecksApplied: [
      "Monopoly pricing protection checks",
      "Input data drift threshold testing",
      "Tenant access parameters validation"
    ],
    controlsTriggered: ["CTL-003", "CTL-008"],
    riskRationale: "Algorithm pricing recommendations fall within strict +/- 10% base pricing bounds. No sensitive personal data processed. Verification systems confirm active model drift safeguards.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "10:04:55.102 - Pricing evaluation requested autonomously",
      "10:04:55.150 - Pricing bounds verified: Q3 adjustments evaluated to +4.2%",
      "10:04:55.201 - Transaction cleared autonomously and pushed to CRM pipeline"
    ],
    dataSensitivity: "Public",
    autonomyLevel: "Recommendation system",
    regulationExposure: "Low — Market Dynamics"
  },
  {
    id: "DEC-83016",
    timestamp: "2026-05-27T09:12:30Z",
    useCase: "Enterprise Fraud & Risk Analyzer",
    domain: "Finance",
    modelProvider: "Custom Random Forest",
    requestedAction: "Flag anomalous procurement invoice for vendor VND-992 and request hold on transaction payout.",
    policyOutcome: "Allow",
    riskLevel: "Medium",
    humanApprovalRequired: true,
    owner: "Raquel Kimura",
    linkedControl: "CTL-004 (Risk Management Framework)",
    linkedEvidence: "EVI-42001-004 (Risk Register logs)",
    simulatedHash: "sha256:92881cf4ba98b0a1d48c89b210cfef4021ab78efc9284cfb78f8c928c94ba83016",
    inputSummary: "Procurement invoice details, matching receipts, historical payout cycle metrics.",
    policyChecksApplied: [
      "Invoice mismatch verification",
      "Historical anomaly variance tests",
      "Dual-sign off requirements check"
    ],
    controlsTriggered: ["CTL-004", "CTL-015"],
    riskRationale: "Model flagged a variance score of 92%, triggering a critical risk hold. While the action is allowed, it triggers a mandatory dual-factor compliance review override before funds are disbursed.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "09:12:30.450 - Procurement pipeline transaction processed",
      "09:12:30.490 - Fraud check triggered; $450,000 disbursement flagged with major receipts mismatch",
      "09:12:30.560 - System placed transaction on hold. Dual-factor review alerted."
    ],
    dataSensitivity: "Confidential",
    autonomyLevel: "Semi-autonomous",
    regulationExposure: "High — SOX Compliance"
  },
  {
    id: "DEC-83017",
    timestamp: "2026-05-27T08:30:15Z",
    useCase: "Third-Party Vendor Analytics Review",
    domain: "IT Operations",
    modelProvider: "Anthropic Claude 3.5 Sonnet",
    requestedAction: "Consolidate performance charts and export vendor SLA auditing logs.",
    policyOutcome: "Audit",
    riskLevel: "Medium",
    humanApprovalRequired: false,
    owner: "María González",
    linkedControl: "CTL-018 (Third Party Model Audit)",
    linkedEvidence: "EVI-42001-018 (Vendor agreements)",
    simulatedHash: "sha256:cfef4021ab78efc9284cfb78f8c928c94ba83017cfef4021ab78efc9284cfb78f8c928c94",
    inputSummary: "Vendor API endpoints, data processing agreements, SLA metrics dashboard.",
    policyChecksApplied: [
      "Third party sub-processor isolation test",
      "Data residency validation check",
      "API request limits checks"
    ],
    controlsTriggered: ["CTL-018", "CTL-020"],
    riskRationale: "Anthropic Claude model exports require cross-border verification. Data residency guidelines require a local audit trail flag whenever bulk files are routed to international processing pipelines.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "08:30:15.080 - Audit compilation query processed",
      "08:30:15.120 - SLA logs consolidated successfully",
      "08:30:15.195 - Cross-border data residency warning flagged. Local copies routed to audit trace bucket."
    ],
    dataSensitivity: "Confidential",
    autonomyLevel: "Recommendation system",
    regulationExposure: "Medium — GDPR Data Transfer"
  },
  {
    id: "DEC-83018",
    timestamp: "2026-05-27T07:44:00Z",
    useCase: "Employee Activity Analytics",
    domain: "Human Resources",
    modelProvider: "Microsoft Graph Insights",
    requestedAction: "Analyze team communication schedules to compute collaborative fatigue indexing.",
    policyOutcome: "Review",
    riskLevel: "Medium",
    humanApprovalRequired: true,
    owner: "Raquel Kimura",
    linkedControl: "CTL-014 (Privacy & Data Protection)",
    linkedEvidence: "EVI-42001-014 (DPIA approval)",
    simulatedHash: "sha256:a1d48c89b210cfef4021ab78efc9284cfb78f8c928c94ba83018ba98b0a1d48c89b210cfef",
    inputSummary: "Aggregated metadata (send times, active hours). No email body content examined.",
    policyChecksApplied: [
      "Anonymization layer checks",
      "Individual profiling checks",
      "Workforce consent validation"
    ],
    controlsTriggered: ["CTL-014", "CTL-019"],
    riskRationale: "Evaluating workforce collaboration patterns requires strict privacy checks. Missing a signed Data Protection Impact Assessment (DPIA) triggers a mandatory review gate under current tenant GRC guidelines.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "07:44:00.601 - collaborative fatiguing query scheduled",
      "07:44:00.665 - Anonymization layers verified successfully",
      "07:44:00.730 - ALERT: Active DPIA compliance certificate expired on 2026-05-20",
      "07:44:00.745 - GRC Gateway intercepted process: 'PENDING_EXECUTIVE_DPIA_RENEWAL'"
    ],
    dataSensitivity: "Confidential",
    autonomyLevel: "Semi-autonomous",
    regulationExposure: "Medium — GDPR Art. 35"
  },
  {
    id: "DEC-83019",
    timestamp: "2026-05-27T06:15:22Z",
    useCase: "Clinical Diagnostics Copilot",
    domain: "Legal & Healthcare",
    modelProvider: "MedPALM-2 Medical Engine",
    requestedAction: "Evaluate patient symptoms history and output draft diagnostic suggestions.",
    policyOutcome: "Block",
    riskLevel: "Critical",
    humanApprovalRequired: true,
    owner: "María González",
    linkedControl: "CTL-015 (Human Oversight Requirements)",
    linkedEvidence: "EVI-42001-015 (HITL logs)",
    simulatedHash: "sha256:ab78efc9284cfb78f8c928c94ba830197f90c4ba98b0a1d48c89b210cfef4021ab78efc9",
    inputSummary: "Patient diagnostic scans, lab reports, historical medication indices.",
    policyChecksApplied: [
      "Clinical validation boundaries check",
      "Direct medical prescription restrictions scan",
      "HIPAA encryption validation"
    ],
    controlsTriggered: ["CTL-015", "CTL-016"],
    riskRationale: "Model requested autonomous diagnostic reporting. Medical/Clinical use cases require 100% human-in-the-loop validation under strict health policy limits. Direct diagnostic suggestion is strictly blocked.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "06:15:22.012 - MedPALM API trigger request received",
      "06:15:22.080 - Medical intake rules executed",
      "06:15:22.145 - CRITICAL: Model requested direct automated diagnostic output without physician approval path",
      "06:15:22.160 - ACTION: Request BLOCKED to satisfy human oversight safety thresholds."
    ],
    dataSensitivity: "Highly Confidential",
    autonomyLevel: "Autonomous",
    regulationExposure: "Critical — EU AI Act Class II (Medical Device)"
  },
  {
    id: "DEC-83020",
    timestamp: "2026-05-27T05:00:10Z",
    useCase: "Autonomous Credit Underwriter",
    domain: "Finance",
    modelProvider: "Custom PyTorch Credit NN",
    requestedAction: "Process credit card credit limit increase request for premium client profile.",
    policyOutcome: "Review",
    riskLevel: "High",
    humanApprovalRequired: true,
    owner: "Raquel Kimura",
    linkedControl: "CTL-012 (Algorithmic Bias Testing)",
    linkedEvidence: "EVI-42001-012 (Fairness Audit)",
    simulatedHash: "sha256:8c928c94ba830207f90c4ba98b0a1d48c89b210cfef4021ab78efc9284cfb78f8c928c94",
    inputSummary: "Credit history, current active limits, debt-to-income metrics, customer age.",
    policyChecksApplied: [
      "Algorithmic discrimination tests (Equal Opportunity)",
      "Adversarial input check",
      "FICO score variance boundary tests"
    ],
    controlsTriggered: ["CTL-012", "CTL-014"],
    riskRationale: "Underwriting operations trigger high algorithmic exposure. Equal opportunity credit tests flagged potential geographical bias in input zip codes. Routed to risk analyst team for manual review.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "05:00:10.501 - Credit application received",
      "05:00:10.540 - Geographical demographic bias audit executed",
      "05:00:10.601 - Geographical flag variance exceeded tolerance limits (+15% threshold)",
      "05:00:10.620 - Transaction routed to manual queue: 'PENDING_EQUAL_OPPORTUNITY_CREDIT_REVIEW'"
    ],
    dataSensitivity: "Highly Confidential",
    autonomyLevel: "Semi-autonomous",
    regulationExposure: "High — Equal Credit Opportunity Act (ECOA)"
  },
  {
    id: "DEC-83021",
    timestamp: "2026-05-27T04:22:11Z",
    useCase: "Cross-Border Data Processor",
    domain: "Legal & Compliance",
    modelProvider: "Cohere Command R+",
    requestedAction: "Consolidate regional compliance reports from European operations to local database.",
    policyOutcome: "Audit",
    riskLevel: "High",
    humanApprovalRequired: false,
    owner: "Raquel Kimura",
    linkedControl: "CTL-019 (Regulatory & Contractual Compliance)",
    linkedEvidence: "EVI-42001-019 (Legal compliance certificates)",
    simulatedHash: "sha256:89b210cfef4021ab78efc9284cfb78f8c928c94ba830217f90c4ba98b0a1d48c89b210cf",
    inputSummary: "European operations summaries, localized customer service summaries.",
    policyChecksApplied: [
      "Data localization compliance check",
      "GDPR cross-border transfer requirements tests",
      "Encryption at rest validation"
    ],
    controlsTriggered: ["CTL-019", "CTL-013"],
    riskRationale: "European data operations require strict GDPR mapping. While the transfer is allowed due to standard contractual clauses, the compliance policy forces a detailed forensic audit logging footprint.",
    evidenceLink: "/evidence",
    auditTrailEvents: [
      "04:22:11.120 - Cross-border sync request processed",
      "04:22:11.165 - Encryption protocols verified (AES-256 enabled)",
      "04:22:11.230 - GDPR SCC compliance certificate active and verified",
      "04:22:11.250 - Pushed detailed transaction log to the global trace vault"
    ],
    dataSensitivity: "Confidential",
    autonomyLevel: "Recommendation system",
    regulationExposure: "High — GDPR Chapter V"
  }
];
