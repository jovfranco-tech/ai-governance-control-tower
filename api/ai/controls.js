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
    riskLevel,
    lang
  } = req.body;

  const auth = await authenticateAndAuthorize(req, organizationId, useCaseId);
  if (!auth.authorized) {
    return res.status(403).json({ error: auth.error });
  }

  // Enforce GRC SecOps Rate Limiting
  const rateLimit = await checkAndEnforceRateLimiting(req, res, organizationId, auth.user?.id, 'control_recommendation');
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
    const mockRes = generateServerMockResponse('control_recommendation', req.body);
    await logAIActivity({
      organizationId,
      useCaseId,
      userId: auth.user?.id,
      taskType: 'control_recommendation',
      provider: 'Mock',
      model: 'Simulated Catalog Engine',
      mode: 'mock',
      inputData: req.body,
      outputData: mockRes,
      eventType: 'control_recommendation_generated'
    });
    return res.status(200).json(mockRes);
  }

  const systemPrompt = `You are an expert ISO/IEC 42001 Lead Auditor and GRC security control assessor.
Analyze the AI use case and the active risk level, then recommend appropriate controls from standard catalog codes (CTL-001 through CTL-020).
Ensure you return ONLY a single, valid JSON block. Do not include markdown wrappers.
Format the JSON precisely to match this schema:
{
  "task_type": "control_recommendation",
  "organization_id": "${organizationId}",
  "use_case_id": "${useCaseId || ''}",
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "confidence": 0.0 to 1.0,
  "rationale": "Justification of recommendations based on risk vectors",
  "recommended_controls": ["CTL-001", "CTL-004", ...],
  "limitations": "Advisory limitations",
  "human_review_required": false,
  "next_actions": ["Next action steps for implementation"],
  "language": "${lang === 'es' ? 'es' : 'en'}",
  "generated_at": "ISO-8601 string"
}`;

  const userPrompt = `AI Use Case Details:
Title: ${title}
Description: ${description}
Current Risk Level: ${riskLevel}
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
        temperature: 0.3,
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
      task_type: 'control_recommendation',
      organization_id: organizationId,
      use_case_id: useCaseId || null,
      generated_at: new Date().toISOString()
    };

    await logAIActivity({
      organizationId,
      useCaseId,
      userId: auth.user?.id,
      taskType: 'control_recommendation',
      provider: 'OpenAI',
      model: modelName,
      mode: 'live',
      inputData: req.body,
      outputData: finalResult,
      eventType: 'control_recommendation_generated'
    });

    return res.status(200).json(finalResult);
  } catch (err) {
    console.error('Secure control recommendation failed:', err);
    const mockRes = generateServerMockResponse('control_recommendation', req.body);
    return res.status(200).json(mockRes);
  }
}
