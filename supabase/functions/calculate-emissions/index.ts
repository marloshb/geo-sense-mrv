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
    const { operationalDataIds, territoryId, periodStart, periodEnd } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch operational data
    let query = supabase
      .from('operational_data')
      .select('*');

    if (operationalDataIds && operationalDataIds.length > 0) {
      query = query.in('id', operationalDataIds);
    } else if (territoryId) {
      query = query.eq('territory_id', territoryId);
      if (periodStart) query = query.gte('period_start', periodStart);
      if (periodEnd) query = query.lte('period_end', periodEnd);
    }

    const { data: operationalData, error: opError } = await query;

    if (opError) {
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

    // Fetch emission factors
    const { data: emissionFactors, error: efError } = await supabase
      .from('emission_factors')
      .select('*')
      .eq('is_default', true);

    if (efError) {
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
            // Convert quantity to MWh if needed
            let quantityMWh = data.quantity;
            if (data.unit === 'kWh') quantityMWh = data.quantity / 1000;
            emissions = quantityMWh * emissionFactor.factor_value;
            metricType = 'emissions_scope2';
            totalScope2 += emissions;
          }
          break;

        case 'fuel':
          // Try to match fuel type from notes/metadata
          const fuelTypes = ['diesel', 'gasolina', 'glp', 'gás natural', 'carvão'];
          for (const fuel of fuelTypes) {
            emissionFactor = factorMap.get(`${fuel}_combustion`);
            if (emissionFactor) break;
          }
          if (!emissionFactor) {
            emissionFactor = factorMap.get('diesel_combustion'); // Default to diesel
          }
          if (emissionFactor) {
            emissions = data.quantity * emissionFactor.factor_value;
            metricType = 'emissions_scope1';
            totalScope1 += emissions;
          }
          break;

        default:
          // Skip other types for now
          continue;
      }

      if (emissions > 0) {
        metrics.push({
          territory_id: data.territory_id,
          asset_id: data.asset_id,
          metric_type: metricType,
          value: Math.round(emissions * 1000) / 1000, // Round to 3 decimal places
          unit: 'tCO2e',
          period_start: data.period_start,
          period_end: data.period_end,
          methodology_version: 'GHG Protocol v1',
          source_data_ids: [data.id],
          emission_factor_id: emissionFactor?.id,
        });
      }
    }

    // Calculate total emissions
    const totalEmissions = totalScope1 + totalScope2 + totalScope3;

    // Store metrics in database
    if (metrics.length > 0) {
      const { error: insertError } = await supabase
        .from('mrv_metrics')
        .insert(metrics);

      if (insertError) {
        console.error("Error storing metrics:", insertError);
        // Continue anyway - return calculated values
      }
    }

    console.log(`Calculated emissions: Scope1=${totalScope1}, Scope2=${totalScope2}, Total=${totalEmissions}`);

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
