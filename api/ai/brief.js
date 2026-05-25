import { authenticateAndAuthorize, logAIActivity, generateServerMockResponse } from './helper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    organizationId,
    useCaseId,
    totalUseCases,
    activeUseCases,
    totalRisks,
    criticalOpenRisks,
    missingEvidence,
    overdueControls,
    lang
  } = req.body;

  const auth = await authenticateAndAuthorize(req, organizationId, null);
  if (!auth.authorized) {
    return res.status(403).json({ error: auth.error });
  }

  const aiMode = process.env.AI_MODE || 'mock';
  const apiKey = process.env.OPENAI_API_KEY;
  const modelName = process.env.OPENAI_MODEL || 'gpt-4o';

  if (aiMode === 'disabled') {
    return res.status(403).json({ error: 'Generative AI services are disabled under GRC policy controls.' });
  }

  if (aiMode === 'mock' || !apiKey) {
    const mockRes = generateServerMockResponse('executive_brief', req.body);
    await logAIActivity({
      organizationId,
      useCaseId: null,
      userId: auth.user?.id,
      taskType: 'executive_brief',
      provider: 'Mock',
      model: 'Simulated Executive Brief Writer',
      mode: 'mock',
      inputData: req.body,
      outputData: mockRes,
      eventType: 'ai_run_created'
    });
    return res.status(200).json(mockRes);
  }

  const systemPrompt = `You are a Principal AI Governance Architect and corporate strategist prepared to brief the Board of Directors.
Analyze the aggregated portfolio metrics and generate a high-level summary.
Ensure you return ONLY a single, valid JSON block.
Format the JSON precisely to match this schema:
{
  "task_type": "executive_brief",
  "organization_id": "${organizationId}",
  "use_case_id": null,
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "confidence": 0.0 to 1.0,
  "rationale": "Brief overview of the portfolio auditing methodology",
  "recommended_controls": ["CTL-001", "CTL-012", ...],
  "limitations": "Data points aggregation limits",
  "human_review_required": true,
  "next_actions": ["Board actions"],
  "language": "${lang === 'es' ? 'es' : 'en'}",
  "generated_at": "ISO-8601 string",
  "executive_summary": "3-paragraph professional memo summarizing portfolio size, health, and gaps",
  "decision_points": ["Decision 1", "Decision 2"],
  "risk_position": "Critical exposures overview",
  "business_value": "Safeguarding calculations",
  "required_actions": ["Urgent corporate remediation items"],
  "board_level_note": "Aims risk mitigation projection"
}`;

  const userPrompt = `Aggregated Metrics:
Total AI Use Cases: ${totalUseCases}
Active Operational Use Cases: ${activeUseCases}
Total Open Risks: ${totalRisks}
Critical or High Open Risks: ${criticalOpenRisks}
Missing Compliance Evidences: ${missingEvidence}
Overdue controls past review: ${overdueControls}
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
        temperature: 0.5,
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
      task_type: 'executive_brief',
      organization_id: organizationId,
      use_case_id: null,
      generated_at: new Date().toISOString()
    };

    await logAIActivity({
      organizationId,
      useCaseId: null,
      userId: auth.user?.id,
      taskType: 'executive_brief',
      provider: 'OpenAI',
      model: modelName,
      mode: 'live',
      inputData: req.body,
      outputData: finalResult,
      eventType: 'ai_run_created'
    });

    return res.status(200).json(finalResult);
  } catch (err) {
    console.error('Secure executive briefing generation failed:', err);
    const mockRes = generateServerMockResponse('executive_brief', req.body);
    return res.status(200).json(mockRes);
  }
}
