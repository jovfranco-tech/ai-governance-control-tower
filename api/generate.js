export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lang, dataContext } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured.' });
  }

  const systemPrompt = `You are an expert AI Governance consultant and executive reporter for a Fortune 500 company. 
Your task is to generate a concise, highly professional executive briefing summarizing the current state of the AI portfolio based on the provided data context.
The response must be in ${lang === 'es' ? 'Spanish' : 'English'}.
Format the response exactly as a professional memo without any markdown headers at the very top (start directly with the summary paragraph). 
Do NOT use markdown headers like '# Executive Summary'. Just provide the text.
Use professional corporate tone.`;

  const userPrompt = `Generate a 3-paragraph executive briefing based on the following AI Governance data:
${JSON.stringify(dataContext)}

Paragraph 1: Overview of the portfolio and overall readiness.
Paragraph 2: Key risks and missing compliance evidence.
Paragraph 3: Required executive decisions and immediate actions.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error from OpenAI API');
    }

    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error('Error generating briefing:', error);
    res.status(500).json({ error: 'Failed to generate briefing.' });
  }
}
