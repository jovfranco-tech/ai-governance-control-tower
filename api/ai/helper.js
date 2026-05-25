import { createClient } from '@supabase/supabase-js';
import { rateLimitProvider } from './rateLimiter.js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side admin client is strictly server-only and never exposed to the client bundle
export const serverSupabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })
  : null;

/**
 * Verifies the user JWT token from the Authorization header,
 * checks organization membership, and verifies use-case ownership if useCaseId is provided.
 */
export async function authenticateAndAuthorize(req, organizationId, useCaseId) {
  if (!serverSupabase) {
    return { authorized: true, user: null, demo: true }; // Resilient fallback for public local-only portfolio demos
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return { authorized: false, error: 'Authorization header is missing' };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { authorized: false, error: 'Bearer token is missing' };
  }

  try {
    // 1. Get authenticated user from token JWT
    const { data: { user }, error: authError } = await serverSupabase.auth.getUser(token);
    if (authError || !user) {
      return { authorized: false, error: 'Invalid or expired user session JWT' };
    }

    // 2. Validate tenant organization membership
    const { data: membership, error: memError } = await serverSupabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (memError || !membership) {
      return { authorized: false, error: 'Access Denied: You are not a member of this organization' };
    }

    // 3. Optional: Validate that the use case belongs to the organization
    if (useCaseId) {
      const { data: useCase, error: ucError } = await serverSupabase
        .from('ai_use_cases')
        .select('id')
        .eq('id', useCaseId)
        .eq('organization_id', organizationId)
        .single();

      if (ucError || !useCase) {
        return { authorized: false, error: 'Access Denied: AI Initiative does not belong to this organization workspace' };
      }
    }

    return { authorized: true, user, membershipRole: membership.role, demo: false };
  } catch (err) {
    console.error('API authorization check failed:', err);
    return { authorized: false, error: 'Internal gateway security check failed' };
  }
}

/**
 * Enforces per-user and per-organization rate limits before executing LLM workloads.
 */
export async function checkAndEnforceRateLimiting(req, res, organizationId, userId, taskType) {
  if (!serverSupabase) return { allowed: true }; // Offline Demo mode bypass for high portfolio resilience

  try {
    const rateLimit = await rateLimitProvider.checkRateLimit(organizationId, userId, taskType);
    if (!rateLimit.allowed) {
      // 1. Log rate_limited event to compliance audit events trail
      await serverSupabase
        .from('audit_events')
        .insert({
          organization_id: organizationId,
          user_id: userId || null,
          event_type: 'rate_limited',
          entity_type: 'usecase',
          entity_id: null,
          metadata: {
            task_type: taskType,
            limit: rateLimit.limit,
            remaining: 0,
            resetTime: new Date(rateLimit.resetTime).toISOString(),
            reason: rateLimit.reason
          }
        });

      // 2. Respond with standard 429 Too Many Requests
      res.setHeader('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
      res.status(429).json({
        error: rateLimit.reason,
        limit: rateLimit.limit,
        resetTime: rateLimit.resetTime
      });
      
      return { allowed: false };
    }
    
    return { allowed: true, remaining: rateLimit.remaining };
  } catch (err) {
    console.error('Rate limiting enforcement check failed (failing open for resilience):', err);
    return { allowed: true };
  }
}

/**
 * Securely logs the AI completion transaction to llm_runs and audit_events tables
 */
export async function logAIActivity({
  organizationId,
  useCaseId,
  userId,
  taskType,
  provider,
  model,
  mode,
  inputData,
  outputData,
  eventType
}) {
  if (!serverSupabase) return;
  try {
    // 1. Insert into llm_runs
    const { error: llmErr } = await serverSupabase
      .from('llm_runs')
      .insert({
        organization_id: organizationId,
        use_case_id: useCaseId || null,
        user_id: userId || null,
        provider,
        model,
        mode,
        task_type: taskType,
        input_summary: JSON.stringify(inputData),
        output_summary: outputData.rationale || 'Briefing generated.',
        structured_output: outputData,
        risk_flags: outputData.risk_level ? { risk_level: outputData.risk_level } : null
      });

    if (llmErr) console.error('Failed to log LLM run:', llmErr);

    // 2. Insert into audit_events
    const { error: auditErr } = await serverSupabase
      .from('audit_events')
      .insert({
        organization_id: organizationId,
        user_id: userId || null,
        event_type: eventType,
        entity_type: 'usecase',
        entity_id: useCaseId || null,
        metadata: {
          task_type: taskType,
          confidence: outputData.confidence || 1.0,
          risk_level: outputData.risk_level || 'Low'
        }
      });

    if (auditErr) console.error('Failed to log GRC audit event:', auditErr);
  } catch (err) {
    console.error('Failed to execute telemetry audit trail insertion:', err);
  }
}

/**
 * Standard server-side high-fidelity mock generator to bypass OpenAI when keys are missing or when AI_MODE is mock
 */
export function generateServerMockResponse(taskType, payload) {
  const isEs = payload.lang === 'es';
  const orgId = payload.organizationId || 'tenant-default';
  const ucId = payload.useCaseId || null;
  const title = payload.title || 'AI Initiative';

  const generatedAt = new Date().toISOString();

  if (taskType === 'risk_assessment') {
    return {
      task_type: 'risk_assessment',
      organization_id: orgId,
      use_case_id: ucId,
      risk_level: 'High',
      confidence: 0.92,
      rationale: isEs
        ? `[Servidor Mock] Evaluación de la iniciativa "${title}". El modelo y el volumen de datos sensibles procesados requieren validaciones ISO 42001.`
        : `[Server Mock] Assessment of initiative "${title}". The model and sensitivity level of processed data requires direct ISO 42001 verification.`,
      recommended_controls: ['CTL-001', 'CTL-004', 'CTL-012'],
      limitations: isEs ? 'Evaluación simulada de demostración.' : 'Simulated assessment advisory for demonstration purposes.',
      human_review_required: true,
      next_actions: isEs 
        ? ['Revisar controles de cifrado.', 'Establecer bitácora humana.'] 
        : ['Verify encryption controls.', 'Establish human-in-the-loop audit logs.'],
      language: payload.lang,
      generated_at: generatedAt
    };
  }

  if (taskType === 'control_recommendation') {
    return {
      task_type: 'control_recommendation',
      organization_id: orgId,
      use_case_id: ucId,
      risk_level: 'High',
      confidence: 0.90,
      rationale: isEs
        ? `[Servidor Mock] Controles sugeridos para "${title}" basados en su nivel de riesgo y políticas AIMS.`
        : `[Server Mock] Recommended controls for "${title}" mapped against baseline AIMS policies.`,
      recommended_controls: ['CTL-001', 'CTL-007', 'CTL-012', 'CTL-013'],
      limitations: isEs ? 'Mapeo conceptual simulado.' : 'Advisory mapping based on conceptual standards.',
      human_review_required: false,
      next_actions: isEs ? ['Implementar controles en producción.'] : ['Deploy recommended controls into production.'],
      language: payload.lang,
      generated_at: generatedAt
    };
  }

  if (taskType === 'executive_brief') {
    return {
      task_type: 'executive_brief',
      organization_id: orgId,
      use_case_id: null,
      risk_level: 'High',
      confidence: 0.95,
      rationale: '[Server Mock] Executive briefing summary of current system GRC matrices.',
      recommended_controls: ['CTL-001', 'CTL-012'],
      limitations: 'Simulated memo.',
      human_review_required: true,
      next_actions: ['Present brief in executive committee.'],
      language: payload.lang,
      generated_at: generatedAt,
      executive_summary: isEs
        ? `Resumen de Gobernanza de IA: Contamos con ${payload.totalUseCases} casos registrados (${payload.activeUseCases} activos). Se observan ${payload.totalRisks} riesgos abiertos y ${payload.missingEvidence} brechas de evidencia activa.`
        : `AI Governance Summary Memo: Currently tracking ${payload.totalUseCases} initiatives (${payload.activeUseCases} operational). There are ${payload.totalRisks} active risks and ${payload.missingEvidence} outstanding evidence gaps.`,
      decision_points: ['Budget allocation approval.', 'Adoption of ISO 42001 standards.'],
      risk_position: 'Risks concentrated heavily within generative models.',
      business_value: 'Safeguarded regulatory exposure valued at $2.4M.',
      required_actions: ['Close evidence gaps immediately.'],
      board_level_note: 'IA continuous auditing reduces structural penalties exposure by 24%.'
    };
  }

  if (taskType === 'policy_gap_analysis') {
    return {
      task_type: 'policy_gap_analysis',
      organization_id: orgId,
      use_case_id: ucId,
      risk_level: 'High',
      confidence: 0.88,
      rationale: `[Server Mock] Policy gap analysis for "${title}" mapping active controls against AIMS compliance checksheets.`,
      recommended_controls: ['CTL-012', 'CTL-013'],
      limitations: 'Conceptual policy mapping checks only.',
      human_review_required: true,
      next_actions: ['Map missing evidence items.'],
      language: payload.lang,
      generated_at: generatedAt,
      detected_gaps: ['Audit logs tracing missing.', 'Bias testing checkpoints missing.'],
      missing_controls: ['CTL-012', 'CTL-013'],
      policy_risks: ['EU AI Act Article 14 violation risk.'],
      recommended_remediation: 'Initiate continuous logging and schedule external audit checkpoints.'
    };
  }

  return null;
}
