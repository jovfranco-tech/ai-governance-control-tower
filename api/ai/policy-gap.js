import { authenticateAndAuthorize, checkAndEnforceRateLimiting, logAIActivity, generateServerMockResponse } from './helper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    organizationId,
    useCaseId,
    title,
    description,
    controlsTally,
    evidenceTally,
    lang
  } = req.body;

  const auth = await authenticateAndAuthorize(req, organizationId, useCaseId);
  if (!auth.authorized) {
    return res.status(403).json({ error: auth.error });
  }

  // Enforce GRC SecOps Rate Limiting
  const rateLimit = await checkAndEnforceRateLimiting(req, res, organizationId, auth.user?.id, 'policy_gap_analysis');
  if (!rateLimit.allowed) {
    return;
  }

  const aiMode = process.env.AI_MODE || 'mock';
  const apiKey = process.env.OPENAI_API_KEY;
  const modelName = process.env.OPENAI_MODEL || 'gpt-4o';

  if (aiMode === 'disabled') {
    return res.status(403).json({ error: 'Generative AI services are disabled under GRC policy controls.' });
  }

  if (aiMode === 'mock' || !apiKey) {
    const mockRes = generateServerMockResponse('policy_gap_analysis', req.body);
    await logAIActivity({
      organizationId,
      useCaseId,
      userId: auth.user?.id,
      taskType: 'policy_gap_analysis',
      provider: 'Mock',
      model: 'Simulated Gap Engine',
      mode: 'mock',
      inputData: req.body,
      outputData: mockRes,
      eventType: 'policy_gap_generated'
    });
    return res.status(200).json(mockRes);
  }

  const systemPrompt = `You are a Senior regulatory reviewer and AI Policy Auditor.
Compare the initiative scope against standard AIMS directives to identify critical gaps and missing proofs.
Ensure you return ONLY a single, valid JSON block.
Format the JSON precisely to match this schema:
{
  "task_type": "policy_gap_analysis",
  "organization_id": "${organizationId}",
  "use_case_id": "${useCaseId || ''}",
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "confidence": 0.0 to 1.0,
  "rationale": "Analysis of the evidence-to-control ratio and gaps",
  "recommended_controls": ["CTL-012", "CTL-013"],
  "limitations": "Analysis scope limitations",
  "human_review_required": true,
  "next_actions": ["Action 1", "Action 2"],
  "language": "${lang === 'es' ? 'es' : 'en'}",
  "generated_at": "ISO-8601 string",
  "detected_gaps": ["Detected Gap 1", "Detected Gap 2"],
  "missing_controls": ["CTL-012", "CTL-013"],
  "policy_risks": ["Risk of regulatory penalties", ...],
  "recommended_remediation": "Remediation plan details"
}`;

  const userPrompt = `Initiative for gap analysis:
Title: ${title}
Description: ${description}
Active controls mapped: ${controlsTally}
Evidence items submitted: ${evidenceTally}
Language: ${lang === 'es' ? 'Spanish' : 'English'}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI responded with status: ${response.status}`);
    }

    const data = await response.json();
    const parsedText = data.choices[0].message.content;
    const jsonOutput = JSON.parse(parsedText);

    const finalResult = {
      ...jsonOutput,
      task_type: 'policy_gap_analysis',
      organization_id: organizationId,
      use_case_id: useCaseId || null,
      generated_at: new Date().toISOString()
    };

    await logAIActivity({
      organizationId,
      useCaseId,
      userId: auth.user?.id,
      taskType: 'policy_gap_analysis',
      provider: 'OpenAI',
      model: modelName,
      mode: 'live',
      inputData: req.body,
      outputData: finalResult,
      eventType: 'policy_gap_generated'
    });

    return res.status(200).json(finalResult);
  } catch (err) {
    console.error('Secure policy gap analysis failed:', err);
    const mockRes = generateServerMockResponse('policy_gap_analysis', req.body);
    return res.status(200).json(mockRes);
  }
}
