import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OperationalData {
  id: string;
  data_type: string;
  quantity: number;
  unit: string;
  period_start: string;
  period_end: string;
  territory_id: string;
  asset_id?: string;
}

interface EmissionFactor {
  id: string;
  category: string;
  source_type: string;
  factor_value: number;
  unit: string;
  scope: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Authenticated user: ${user.id}`);

    const { operationalDataIds, territoryId, periodStart, periodEnd } = await req.json();

    // Get user's organization from profile
    const { data: profile, error: profileError } = await supabaseAuth
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

    // If territoryId is provided, verify user has access to it
    if (territoryId) {
      const { data: territory, error: territoryError } = await supabaseAuth
        .from('territories')
        .select('organization_id')
        .eq('id', territoryId)
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

    // Use service role for data operations but only after authorization is verified
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch operational data - filter by organization through territory
    let query = supabase
      .from('operational_data')
      .select('*, territories!inner(organization_id)')
      .eq('territories.organization_id', profile.organization_id);

    if (operationalDataIds && operationalDataIds.length > 0) {
      query = query.in('id', operationalDataIds);
    } else if (territoryId) {
      query = query.eq('territory_id', territoryId);
      if (periodStart) query = query.gte('period_start', periodStart);
      if (periodEnd) query = query.lte('period_end', periodEnd);
    }

    const { data: operationalData, error: opError } = await query;

    if (opError) {
      console.error("Error fetching operational data:", opError.message);
      throw new Error(`Error fetching operational data: ${opError.message}`);
    }

    if (!operationalData || operationalData.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        metrics: [],
        summary: { scope1: 0, scope2: 0, scope3: 0, total: 0 }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch emission factors (these are either default or organization-specific)
    const { data: emissionFactors, error: efError } = await supabase
      .from('emission_factors')
      .select('*')
      .or(`is_default.eq.true,organization_id.eq.${profile.organization_id}`);

    if (efError) {
      console.error("Error fetching emission factors:", efError.message);
      throw new Error(`Error fetching emission factors: ${efError.message}`);
    }

    const factorMap = new Map<string, EmissionFactor>();
    emissionFactors?.forEach((ef: EmissionFactor) => {
      factorMap.set(`${ef.category.toLowerCase()}_${ef.source_type}`, ef);
    });

    // Calculate emissions
    const metrics: any[] = [];
    let totalScope1 = 0;
    let totalScope2 = 0;
    let totalScope3 = 0;

    for (const data of operationalData as OperationalData[]) {
      let emissionFactor: EmissionFactor | undefined;
      let emissions = 0;
      let metricType = '';

      switch (data.data_type) {
        case 'energy':
          emissionFactor = factorMap.get('energia elétrica_grid_brazil');
          if (emissionFactor) {
            let quantityMWh = data.quantity;
            if (data.unit === 'kWh') quantityMWh = data.quantity / 1000;
            emissions = quantityMWh * emissionFactor.factor_value;
            metricType = 'emissions_scope2';
            totalScope2 += emissions;
          }
          break;

        case 'fuel':
          const fuelTypes = ['diesel', 'gasolina', 'glp', 'gás natural', 'carvão'];
          for (const fuel of fuelTypes) {
            emissionFactor = factorMap.get(`${fuel}_combustion`);
            if (emissionFactor) break;
          }
          if (!emissionFactor) {
            emissionFactor = factorMap.get('diesel_combustion');
          }
          if (emissionFactor) {
            emissions = data.quantity * emissionFactor.factor_value;
            metricType = 'emissions_scope1';
            totalScope1 += emissions;
          }
          break;

        default:
          continue;
      }

      if (emissions > 0) {
        metrics.push({
          territory_id: data.territory_id,
          asset_id: data.asset_id,
          metric_type: metricType,
          value: Math.round(emissions * 1000) / 1000,
          unit: 'tCO2e',
          period_start: data.period_start,
          period_end: data.period_end,
          methodology_version: 'GHG Protocol v1',
          source_data_ids: [data.id],
          emission_factor_id: emissionFactor?.id,
        });
      }
    }

    const totalEmissions = totalScope1 + totalScope2 + totalScope3;

    // Store metrics in database
    if (metrics.length > 0) {
      const { error: insertError } = await supabase
        .from('mrv_metrics')
        .insert(metrics);

      if (insertError) {
        console.error("Error storing metrics:", insertError);
      }
    }

    console.log(`Calculated emissions for user ${user.id}: Scope1=${totalScope1}, Scope2=${totalScope2}, Total=${totalEmissions}`);

    return new Response(JSON.stringify({
      success: true,
      metrics,
      summary: {
        scope1: Math.round(totalScope1 * 1000) / 1000,
        scope2: Math.round(totalScope2 * 1000) / 1000,
        scope3: Math.round(totalScope3 * 1000) / 1000,
        total: Math.round(totalEmissions * 1000) / 1000,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in calculate-emissions:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
