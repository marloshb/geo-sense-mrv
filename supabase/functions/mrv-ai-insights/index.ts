import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create client with user's token to verify authentication
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Authenticated user: ${user.id}`);

    // Verify user has a profile (organization membership)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.organization_id) {
      console.error("Failed to get user profile:", profileError?.message);
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { type, data, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // If territoryId is in context, verify user has access
    if (context?.territoryId) {
      const { data: territory, error: territoryError } = await supabase
        .from('territories')
        .select('organization_id')
        .eq('id', context.territoryId)
        .single();

      if (territoryError || !territory) {
        console.error("Territory not found:", territoryError?.message);
        return new Response(JSON.stringify({ error: 'Territory not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (territory.organization_id !== profile.organization_id) {
        console.error("Access denied: user doesn't have access to this territory");
        return new Response(JSON.stringify({ error: 'Access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "validate_data":
        systemPrompt = `Você é um especialista em MRV (Monitoramento, Reporte e Verificação) de dados ambientais e climáticos. 
Sua função é validar dados operacionais inseridos, detectar inconsistências e sugerir correções.
Responda sempre em português do Brasil. Seja conciso e direto.
Formato de resposta JSON:
{
  "isValid": boolean,
  "warnings": [{"field": "campo", "message": "mensagem", "severity": "low|medium|high"}],
  "suggestions": [{"field": "campo", "suggestedValue": "valor", "reason": "razão"}],
  "confidence": number (0-100)
}`;
        userPrompt = `Valide os seguintes dados operacionais:
${JSON.stringify(data, null, 2)}

Contexto histórico do território/ativo:
${JSON.stringify(context?.historical || {}, null, 2)}

Verifique:
1. Se os valores estão dentro de faixas razoáveis
2. Se há outliers comparados ao histórico
3. Se as unidades estão corretas
4. Se há dados faltantes importantes`;
        break;

      case "generate_insights":
        systemPrompt = `Você é um analista sênior de sustentabilidade e clima, especialista em MRV territorial.
Sua função é analisar métricas e gerar insights acionáveis para gestores.
Responda sempre em português do Brasil.
Formato de resposta JSON:
{
  "insights": [
    {
      "type": "anomaly|trend|recommendation|alert|optimization|risk",
      "title": "título curto",
      "content": "descrição detalhada",
      "severity": "info|warning|critical",
      "actionItems": ["ação 1", "ação 2"]
    }
  ]
}`;
        userPrompt = `Analise as seguintes métricas MRV e gere insights:
${JSON.stringify(data, null, 2)}

Contexto:
- Território: ${context?.territory?.name || 'N/A'}
- Período: ${context?.period || 'N/A'}
- Setor: ${context?.sector || 'N/A'}

Foque em:
1. Tendências de emissões
2. Anomalias e outliers
3. Oportunidades de redução
4. Riscos climáticos
5. Comparações com benchmarks do setor`;
        break;

      case "suggest_emission_factor":
        systemPrompt = `Você é um especialista em fatores de emissão do GHG Protocol e metodologias do IPCC.
Sua função é sugerir o fator de emissão mais adequado para um dado operacional.
Responda sempre em português do Brasil.
Formato de resposta JSON:
{
  "suggestedFactor": {
    "category": "categoria",
    "value": number,
    "unit": "unidade",
    "scope": 1|2|3,
    "source": "fonte de referência",
    "methodology": "metodologia"
  },
  "alternatives": [...],
  "confidence": number (0-100),
  "reasoning": "explicação"
}`;
        userPrompt = `Sugira o fator de emissão mais adequado para:
Tipo de dado: ${data.dataType}
Fonte de energia/combustível: ${data.source}
Localização: ${data.location || 'Brasil'}
Setor: ${data.sector || 'Geral'}

Considere:
1. Fatores brasileiros do MCTI quando disponíveis
2. Fatores do GHG Protocol
3. Valores do IPCC como fallback`;
        break;

      case "risk_assessment":
        systemPrompt = `Você é um especialista em avaliação de riscos climáticos seguindo TCFD e IFRS S2.
Sua função é avaliar riscos físicos e de transição para territórios e ativos.
Responda sempre em português do Brasil.
Formato de resposta JSON:
{
  "physicalRisks": [
    {
      "type": "acute|chronic",
      "category": "categoria",
      "severity": "low|medium|high|critical",
      "likelihood": "rare|unlikely|possible|likely|almost_certain",
      "description": "descrição",
      "potentialImpact": "impacto potencial",
      "mitigationMeasures": ["medida 1", "medida 2"]
    }
  ],
  "transitionRisks": [...],
  "overallRiskScore": number (1-10),
  "recommendations": ["recomendação 1", "recomendação 2"]
}`;
        userPrompt = `Avalie os riscos climáticos para:
Território: ${data.territory?.name}
Tipo: ${data.territory?.type}
Localização: ${JSON.stringify(data.territory?.coordinates)}
Ativos: ${JSON.stringify(data.assets || [])}

Histórico de eventos: ${JSON.stringify(context?.events || [])}
Dados climáticos regionais: ${JSON.stringify(context?.climate || {})}`;
        break;

      default:
        throw new Error(`Unknown insight type: ${type}`);
    }

    console.log(`Processing ${type} request for user ${user.id}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    // Try to parse JSON from the response
    let parsedResult;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      parsedResult = JSON.parse(jsonStr);
    } catch {
      parsedResult = { rawContent: content };
    }

    console.log(`Successfully processed ${type} request for user ${user.id}`);

    return new Response(JSON.stringify({ success: true, result: parsedResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in mrv-ai-insights:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
