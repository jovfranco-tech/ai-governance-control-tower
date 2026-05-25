import { AIGovernanceResponse } from './provider';
import { validateRiskAssessment, validateExecutiveBrief, validatePolicyGap } from './schemas';

// Regex patterns to block secrets, credentials, and obvious prompt injections
const DANGEROUS_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/i, // OpenAI-style API Key
  /AIzaSy[a-zA-Z0-9-_]{35}/i, // Google API Key
  /password\s*=\s*['"][^'"]+['"]/i, // Passwords in text
  /postgres:\/\/[a-zA-Z0-9_:@.-]+/i, // Postgres connection strings
  /secret_key|client_secret/i, // Generic secrets
  /<\s*script\b[^>]*>/i, // Basic XSS scripts
];

// Context inject block word list
const INJECTION_KEYWORDS = [
  'ignore previous instructions',
  'system prompt',
  'act as root',
  'bypass limits',
  'forget guidelines',
];

export interface GuardrailResult<T> {
  isValid: boolean;
  sanitizedData: T;
  issues: string[];
}

/**
 * Sanitizes input strings by removing dangerous characters or script tags
 */
export function sanitizeInputString(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Validates AI request inputs to ensure they contain no secrets, sensitive parameters, or prompt injections.
 */
export function validateAndSanitizeInput(inputData: {
  title: string;
  description: string;
  dataSensitivity: string;
  modelType: string;
  businessUnit: string;
}): GuardrailResult<typeof inputData> {
  const issues: string[] = [];
  const sanitized = {
    title: sanitizeInputString(inputData.title),
    description: sanitizeInputString(inputData.description),
    dataSensitivity: sanitizeInputString(inputData.dataSensitivity),
    modelType: sanitizeInputString(inputData.modelType),
    businessUnit: sanitizeInputString(inputData.businessUnit),
  };

  const fields = Object.entries(sanitized);
  for (const [key, val] of fields) {
    // 1. Check for secret tokens
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(val)) {
        issues.push(`Sensitive pattern detected in field "${key}"`);
      }
    }

    // 2. Check for injection key phrases
    const valLower = val.toLowerCase();
    for (const phrase of INJECTION_KEYWORDS) {
      if (valLower.includes(phrase)) {
        issues.push(`Potential prompt injection detected in field "${key}" (matches key phrase)`);
      }
    }
  }

  return {
    isValid: issues.length === 0,
    sanitizedData: sanitized,
    issues,
  };
}

/**
 * Validates AI structured output schemas and runs compliance checks based on task types.
 */
export function validateAndSanitizeOutput(output: unknown, taskType: AIGovernanceResponse['task_type']): GuardrailResult<AIGovernanceResponse> {
  const issues: string[] = [];
  const out = output as Record<string, unknown> | null;

  let isValid: boolean;

  // 1. Check task-specific schema conformance
  if (taskType === 'executive_brief') {
    isValid = validateExecutiveBrief(output);
    if (!isValid) issues.push('Response does not match required GRC Executive Brief JSON schema.');
  } else if (taskType === 'policy_gap_analysis') {
    isValid = validatePolicyGap(output);
    if (!isValid) issues.push('Response does not match required GRC Policy Gap JSON schema.');
  } else {
    isValid = validateRiskAssessment(output);
    if (!isValid) issues.push('Response does not match required GRC Risk Assessment JSON schema.');
  }

  // Define fallback values based on task type
  const riskLevel = typeof out?.risk_level === 'string' ? out.risk_level : 'High';
  const finalRiskLevel = ['Critical', 'High', 'Medium', 'Low'].includes(riskLevel) 
    ? (riskLevel as AIGovernanceResponse['risk_level']) 
    : 'High';

  const baseResult: AIGovernanceResponse = {
    task_type: taskType,
    organization_id: typeof out?.organization_id === 'string' ? out.organization_id : 'tenant-default',
    use_case_id: typeof out?.use_case_id === 'string' ? out.use_case_id : null,
    risk_level: finalRiskLevel,
    confidence: typeof out?.confidence === 'number' ? out.confidence : 0.5,
    rationale: sanitizeInputString(typeof out?.rationale === 'string' ? out.rationale : 'Failed GRC validation check.'),
    recommended_controls: Array.isArray(out?.recommended_controls) 
      ? out.recommended_controls.map((c: unknown) => String(c).trim()) 
      : ['CTL-001'],
    limitations: sanitizeInputString(typeof out?.limitations === 'string' ? out.limitations : 'System assessment limitations enforced.'),
    human_review_required: typeof out?.human_review_required === 'boolean' ? out.human_review_required : true,
    next_actions: Array.isArray(out?.next_actions) 
      ? out.next_actions.map((a: unknown) => String(a).trim()) 
      : ['Initiate manual compliance review.'],
    language: (out?.language === 'es' || out?.language === 'en') ? out.language : 'en',
    generated_at: typeof out?.generated_at === 'string' ? out.generated_at : new Date().toISOString(),
  };

  // Hydrate task-specific attributes
  if (taskType === 'executive_brief') {
    baseResult.executive_summary = sanitizeInputString(typeof out?.executive_summary === 'string' ? out.executive_summary : 'Safe summary fallback triggered.');
    baseResult.decision_points = Array.isArray(out?.decision_points) 
      ? out.decision_points.map((d: unknown) => String(d).trim()) 
      : ['Review overdue controls budget.'];
    baseResult.risk_position = sanitizeInputString(typeof out?.risk_position === 'string' ? out.risk_position : 'Safe risk position statement.');
    baseResult.business_value = sanitizeInputString(typeof out?.business_value === 'string' ? out.business_value : 'Safe value statement.');
    baseResult.required_actions = Array.isArray(out?.required_actions) 
      ? out.required_actions.map((a: unknown) => String(a).trim()) 
      : ['Establish standard operating procedures.'];
    baseResult.board_level_note = sanitizeInputString(typeof out?.board_level_note === 'string' ? out.board_level_note : 'Advisory-only GRC memo.');
  } else if (taskType === 'policy_gap_analysis') {
    baseResult.detected_gaps = Array.isArray(out?.detected_gaps) 
      ? out.detected_gaps.map((g: unknown) => String(g).trim()) 
      : ['Lack of formal compliance verification proof.'];
    baseResult.missing_controls = Array.isArray(out?.missing_controls) 
      ? out.missing_controls.map((c: unknown) => String(c).trim()) 
      : ['CTL-012'];
    baseResult.policy_risks = Array.isArray(out?.policy_risks) 
      ? out.policy_risks.map((r: unknown) => String(r).trim()) 
      : ['Potential compliance alignment penalty exposure.'];
    baseResult.recommended_remediation = sanitizeInputString(typeof out?.recommended_remediation === 'string' ? out.recommended_remediation : 'Establish audit logs trails.');
  }

  // 2. Check output fields for credentials or secrets leakage
  const checkTexts = [
    baseResult.rationale, 
    baseResult.limitations, 
    ...baseResult.next_actions,
    baseResult.executive_summary ?? '',
    baseResult.risk_position ?? '',
    baseResult.recommended_remediation ?? ''
  ];

  for (const text of checkTexts) {
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(text)) {
        issues.push('AI output attempted to leak sensitive credentials or tokens. Redacted.');
        baseResult.rationale = '[REDACTED due to sensitive data guardrail breach]';
        break;
      }
    }
  }

  return {
    isValid: issues.length === 0 && isValid,
    sanitizedData: baseResult,
    issues,
  };
}
