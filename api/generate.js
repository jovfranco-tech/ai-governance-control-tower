export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lang, dataContext } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Dynamic simulated generator for public portfolio deployment without API key exposure
    const totalUseCases = dataContext?.totalUseCases ?? 8;
    const activeUseCases = dataContext?.activeUseCases ?? 4;
    const totalRisks = dataContext?.totalRisks ?? 14;
    const criticalOpenRisks = dataContext?.criticalOpenRisks ?? 5;
    const missingEvidence = dataContext?.missingEvidence ?? 5;
    const overdueControls = dataContext?.overdueControls ?? 4;

    let generatedText = '';

    if (lang === 'es') {
      const p1 = `El portafolio corporativo de IA actualmente comprende ${totalUseCases} iniciativas registradas, de las cuales ${activeUseCases} se encuentran operativas o formalmente aprobadas para producción. Nuestra postura de cumplimiento actual es funcional pero requiere una aceleración estructurada, ya que la plataforma realiza el seguimiento de múltiples controles y excepciones de políticas en diversas líneas de negocio.`;
      const p2 = `Un análisis detallado de nuestra superficie de riesgo revela ${totalRisks} riesgos abiertos, de los cuales ${criticalOpenRisks} están clasificados como de exposición Crítica o Alta, requiriendo supervisión directa del comité. Además, se identifican ${missingEvidence} evidencias de cumplimiento faltantes que representan una brecha de auditoría activa, junto con ${overdueControls} controles fuera de plazo que han superado sus fechas de revisión. Estas brechas se concentran principalmente en privacidad de datos, auditorías de sesgo de modelos y registros de transparencia algorítmica.`;
      const p3 = `Para mitigar estas exposiciones y mantener la alineación con los estándares ISO/IEC 42001, el comité directivo debe ejecutar tres acciones inmediatas: primero, revisar y resolver las iniciativas bloqueadas o de alto riesgo marcadas en el registro; segundo, acelerar la recopilación de evidencias pendientes para cerrar las brechas de preparación de auditoría; y tercero, asignar propietarios de decisiones formales para todas las validaciones pendientes del control humano en el ciclo. La implementación de estas medidas consolidará nuestra postura de gobernanza antes del próximo ciclo de auditoría externa.`;
      generatedText = `${p1}\n${p2}\n${p3}`;
    } else {
      const p1 = `The corporate AI portfolio currently comprises ${totalUseCases} registered initiatives, of which ${activeUseCases} are operational or formally approved for production. Our current compliance posture is functional but requires structured acceleration, as the platform is currently tracking multiple controls and policy exceptions across various business lines.`;
      const p2 = `A detailed review of our risk surface reveals ${totalRisks} open risks, including ${criticalOpenRisks} classified as Critical or High exposure that demand direct committee oversight. Additionally, there are ${missingEvidence} missing compliance evidences representing an active audit gap, alongside ${overdueControls} overdue controls that are past their scheduled review dates. These gaps are primarily concentrated in data privacy, model bias audits, and algorithmic transparency logs.`;
      const p3 = `To mitigate these exposures and maintain alignment with ISO/IEC 42001 standards, the steering committee must execute three immediate actions: first, review and resolve the blocked or high-risk initiatives currently flagged in the registry; second, accelerate the collection of missing evidence to bridge our audit readiness gaps; and third, assign formal decision owners to all pending human-in-the-loop control validations. Implementing these measures will solidify our governance posture prior to the upcoming external audit cycle.`;
      generatedText = `${p1}\n${p2}\n${p3}`;
    }

    // Simulate network delay for organic premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.status(200).json({ text: generatedText, simulated: true });
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
