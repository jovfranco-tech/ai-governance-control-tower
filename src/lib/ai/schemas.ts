export const AI_SCHEMAS = {
  baseGrc: {
    type: 'object',
    properties: {
      task_type: { type: 'string' },
      organization_id: { type: 'string' },
      use_case_id: { type: ['string', 'null'] },
      risk_level: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
      rationale: { type: 'string' },
      recommended_controls: { type: 'array', items: { type: 'string' } },
      limitations: { type: 'string' },
      human_review_required: { type: 'boolean' },
      next_actions: { type: 'array', items: { type: 'string' } },
      language: { type: 'string', enum: ['en', 'es'] },
      generated_at: { type: 'string' }
    },
    required: [
      'task_type',
      'organization_id',
      'risk_level',
      'confidence',
      'rationale',
      'recommended_controls',
      'limitations',
      'human_review_required',
      'next_actions',
      'language',
      'generated_at'
    ]
  }
};

/**
 * Validates basic GRC properties on a response object
 */
export function validateBaseGrc(d: Record<string, unknown>): boolean {
  if (!d || typeof d !== 'object') return false;

  const validRiskLevels = ['Critical', 'High', 'Medium', 'Low'];
  if (typeof d.task_type !== 'string') return false;
  if (typeof d.organization_id !== 'string') return false;
  if (typeof d.risk_level !== 'string' || !validRiskLevels.includes(d.risk_level)) return false;
  if (typeof d.confidence !== 'number' || d.confidence < 0 || d.confidence > 1) return false;
  if (typeof d.rationale !== 'string' || d.rationale.trim().length === 0) return false;
  if (typeof d.limitations !== 'string') return false;
  if (typeof d.human_review_required !== 'boolean') return false;
  if (d.language !== 'en' && d.language !== 'es') return false;

  if (!Array.isArray(d.recommended_controls) || !d.recommended_controls.every(c => typeof c === 'string')) {
    return false;
  }

  if (!Array.isArray(d.next_actions) || !d.next_actions.every(a => typeof a === 'string')) {
    return false;
  }

  return true;
}

export function validateRiskAssessment(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;

  if (!validateBaseGrc(d)) return false;
  if (d.task_type !== 'risk_assessment' && d.task_type !== 'control_recommendation') return false;

  return true;
}

export function validateExecutiveBrief(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;

  if (!validateBaseGrc(d)) return false;
  if (d.task_type !== 'executive_brief') return false;

  if (typeof d.executive_summary !== 'string' || d.executive_summary.trim().length === 0) return false;
  if (typeof d.risk_position !== 'string') return false;
  if (typeof d.business_value !== 'string') return false;
  if (typeof d.board_level_note !== 'string') return false;

  if (!Array.isArray(d.decision_points) || !d.decision_points.every(p => typeof p === 'string')) {
    return false;
  }

  if (!Array.isArray(d.required_actions) || !d.required_actions.every(a => typeof a === 'string')) {
    return false;
  }

  return true;
}

export function validatePolicyGap(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;

  if (!validateBaseGrc(d)) return false;
  if (d.task_type !== 'policy_gap_analysis') return false;

  if (typeof d.recommended_remediation !== 'string') return false;

  if (!Array.isArray(d.detected_gaps) || !d.detected_gaps.every(g => typeof g === 'string')) {
    return false;
  }

  if (!Array.isArray(d.missing_controls) || !d.missing_controls.every(c => typeof c === 'string')) {
    return false;
  }

  if (!Array.isArray(d.policy_risks) || !d.policy_risks.every(r => typeof r === 'string')) {
    return false;
  }

  return true;
}
