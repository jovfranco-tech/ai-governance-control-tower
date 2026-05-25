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
      useCaseId,
      title,
      description,
      riskLevel,
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

    // Return mock if live mode disabled
    if (aiMode === 'mock' || !openaiKey) {
      const mockRes = {
        task_type: 'control_recommendation',
        organization_id: organizationId,
        use_case_id: useCaseId,
        risk_level: riskLevel,
        confidence: 0.90,
        rationale: lang === 'es' ? 'Controles sugeridos por el comité.' : 'Steering committee suggested controls.',
        recommended_controls: ['CTL-001', 'CTL-004', 'CTL-011'],
        limitations: 'Mock mapping.',
        human_review_required: false,
        next_actions: ['Remediation plan approval'],
        language: lang,
        generated_at: new Date().toISOString()
      };

      await supabase.from('llm_runs').insert({
        organization_id: organizationId,
        use_case_id: useCaseId || null,
        user_id: user.id,
        provider: 'Mock',
        model: 'Simulated Catalog Engine',
        mode: 'mock',
        input_summary: JSON.stringify(req.body),
        output_summary: mockRes.rationale,
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
            content: 'You are an ISO/IEC 42001 Controls Auditor. Output recommended control codes in JSON format.'
          },
          {
            role: 'user',
            content: `Use Case: ${title}\nDescription: ${description}\nRisk: ${riskLevel}`
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    const finalRes = {
      ...parsed,
      task_type: 'control_recommendation',
      organization_id: organizationId,
      use_case_id: useCaseId || null,
      generated_at: new Date().toISOString()
    };

    await supabase.from('llm_runs').insert({
      organization_id: organizationId,
      use_case_id: useCaseId || null,
      user_id: user.id,
      provider: 'OpenAI',
      model: 'gpt-4o',
      mode: 'live',
      input_summary: JSON.stringify({ title, riskLevel }),
      output_summary: finalRes.rationale || 'Controls recommended.',
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
