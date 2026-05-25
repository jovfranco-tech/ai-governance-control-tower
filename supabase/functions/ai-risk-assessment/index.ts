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
      dataSensitivity,
      modelType,
      businessUnit,
      lang
    } = await req.json();

    // 1. Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // 2. Extract and verify user access token JWT
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

    // 3. Validate organization membership
    const { data: membership, error: memErr } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (memErr || !membership) {
      return new Response(JSON.stringify({ error: 'Access Denied: Not a member of this workspace' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 4. Return mock if live mode disabled
    if (aiMode === 'mock' || !openaiKey) {
      // Return server-side mock response
      const mockRes = {
        task_type: 'risk_assessment',
        organization_id: organizationId,
        use_case_id: useCaseId,
        risk_level: 'High',
        confidence: 0.90,
        rationale: lang === 'es' ? 'Evaluación simulada de riesgo.' : 'Simulated assessment.',
        recommended_controls: ['CTL-001'],
        limitations: 'Mock evaluation.',
        human_review_required: true,
        next_actions: ['Manual review'],
        language: lang,
        generated_at: new Date().toISOString()
      };

      // Write telemetry log
      await supabase.from('llm_runs').insert({
        organization_id: organizationId,
        use_case_id: useCaseId || null,
        user_id: user.id,
        provider: 'Mock',
        model: 'Simulated Assessment Model',
        mode: 'mock',
        input_summary: JSON.stringify(req.body),
        output_summary: mockRes.rationale,
        structured_output: mockRes
      });

      return new Response(JSON.stringify(mockRes), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 5. Query OpenAI securely
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
            content: 'You are an AI GRC Auditor. Output risk level (Low, Medium, High, Critical) in structured JSON.'
          },
          {
            role: 'user',
            content: `Use Case: ${title}\nDescription: ${description}\nSensitivity: ${dataSensitivity}\nModel Type: ${modelType}\nBusiness Unit: ${businessUnit}`
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
      task_type: 'risk_assessment',
      organization_id: organizationId,
      use_case_id: useCaseId || null,
      generated_at: new Date().toISOString()
    };

    // Log the transaction
    await supabase.from('llm_runs').insert({
      organization_id: organizationId,
      use_case_id: useCaseId || null,
      user_id: user.id,
      provider: 'OpenAI',
      model: 'gpt-4o',
      mode: 'live',
      input_summary: JSON.stringify({ title, description, modelType, businessUnit }),
      output_summary: finalRes.rationale || 'Risk Assessment generated.',
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
