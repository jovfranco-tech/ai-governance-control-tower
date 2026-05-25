import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.10.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openaiKey = Deno.env.get('OPENAI_API_KEY') || '';
const aiMode = Deno.env.get('AI_MODE') || 'mock';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      organizationId,
      totalUseCases,
      activeUseCases,
      totalRisks,
      criticalOpenRisks,
      missingEvidence,
      overdueControls,
      lang
    } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing Bearer Token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user session JWT' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (aiMode === 'mock' || !openaiKey) {
      const mockRes = {
        task_type: 'executive_brief',
        organization_id: organizationId,
        use_case_id: null,
        risk_level: criticalOpenRisks > 0 ? 'High' : 'Medium',
        confidence: 0.94,
        rationale: 'Portfolio summary.',
        recommended_controls: ['CTL-001'],
        limitations: 'Mock brief.',
        human_review_required: true,
        next_actions: ['Board session'],
        language: lang,
        generated_at: new Date().toISOString(),
        executive_summary: lang === 'es' ? 'Resumen directivo de IA.' : 'Executive AI Governance Summary.',
        decision_points: ['Mitigation budget approval.'],
        risk_position: 'Risks concentrated heavily.',
        business_value: 'Calculations.',
        required_actions: ['Remediation plan.'],
        board_level_note: 'Reducing structural risk.'
      };

      await supabase.from('llm_runs').insert({
        organization_id: organizationId,
        use_case_id: null,
        user_id: user.id,
        provider: 'Mock',
        model: 'Simulated Briefing Model',
        mode: 'mock',
        input_summary: JSON.stringify(req.body),
        output_summary: mockRes.executive_summary,
        structured_output: mockRes
      });

      return new Response(JSON.stringify(mockRes), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Query OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an Executive AI strategist. Output board briefs in structured JSON format.'
          },
          {
            role: 'user',
            content: `Total Cases: ${totalUseCases}, Active: ${activeUseCases}, Risks: ${totalRisks}, Critical: ${criticalOpenRisks}, Missing Evidence: ${missingEvidence}, Overdue Controls: ${overdueControls}`
          }
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    const finalRes = {
      ...parsed,
      task_type: 'executive_brief',
      organization_id: organizationId,
      use_case_id: null,
      generated_at: new Date().toISOString()
    };

    await supabase.from('llm_runs').insert({
      organization_id: organizationId,
      use_case_id: null,
      user_id: user.id,
      provider: 'OpenAI',
      model: 'gpt-4o',
      mode: 'live',
      input_summary: JSON.stringify({ totalUseCases, totalRisks, missingEvidence, overdueControls }),
      output_summary: finalRes.executive_summary || 'Executive brief generated.',
      structured_output: finalRes
    });

    return new Response(JSON.stringify(finalRes), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
