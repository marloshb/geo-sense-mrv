-- Enable PostGIS for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Organizations (multi-tenant)
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- User profiles with organization
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id),
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'operational', 'analyst', 'executive', 'auditor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Territories (GIS-based)
CREATE TABLE public.territories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mining', 'logistics', 'industrial', 'conservation', 'agriculture', 'energy', 'other')),
  polygon GEOMETRY(Polygon, 4326),
  center_point GEOMETRY(Point, 4326),
  area_hectares NUMERIC,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'alert', 'inactive')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;

-- Assets (linked to territories)
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  coordinates GEOMETRY(Point, 4326),
  operational_status TEXT DEFAULT 'operational',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Emission factors (versioned)
CREATE TABLE public.emission_factors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  category TEXT NOT NULL,
  source_type TEXT NOT NULL,
  factor_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  scope INTEGER NOT NULL CHECK (scope IN (1, 2, 3)),
  methodology TEXT,
  source_reference TEXT,
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;

-- Operational data entries
CREATE TABLE public.operational_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id),
  data_type TEXT NOT NULL CHECK (data_type IN ('energy', 'fuel', 'production', 'transport', 'water', 'waste', 'other')),
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  source TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.operational_data ENABLE ROW LEVEL SECURITY;

-- Calculated metrics (MRV results)
CREATE TABLE public.mrv_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('emissions_scope1', 'emissions_scope2', 'emissions_scope3', 'emissions_total', 'intensity', 'carbon_stock', 'sequestration')),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  methodology_version TEXT,
  source_data_ids UUID[],
  emission_factor_id UUID REFERENCES public.emission_factors(id),
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.mrv_metrics ENABLE ROW LEVEL SECURITY;

-- Climate risk assessments
CREATE TABLE public.climate_risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id),
  risk_type TEXT NOT NULL CHECK (risk_type IN ('physical_acute', 'physical_chronic', 'transition_policy', 'transition_market', 'transition_technology', 'transition_reputation')),
  risk_category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  likelihood TEXT NOT NULL CHECK (likelihood IN ('rare', 'unlikely', 'possible', 'likely', 'almost_certain')),
  description TEXT,
  potential_impact_financial NUMERIC,
  mitigation_measures TEXT,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.climate_risks ENABLE ROW LEVEL SECURITY;

-- AI-generated insights
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  territory_id UUID REFERENCES public.territories(id),
  asset_id UUID REFERENCES public.assets(id),
  insight_type TEXT NOT NULL CHECK (insight_type IN ('anomaly', 'trend', 'recommendation', 'alert', 'optimization', 'risk')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  action_items JSONB DEFAULT '[]',
  related_metrics UUID[],
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Audit trail
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_territories_org ON public.territories(organization_id);
CREATE INDEX idx_territories_status ON public.territories(status);
CREATE INDEX idx_territories_polygon ON public.territories USING GIST(polygon);
CREATE INDEX idx_assets_territory ON public.assets(territory_id);
CREATE INDEX idx_operational_data_territory ON public.operational_data(territory_id);
CREATE INDEX idx_operational_data_period ON public.operational_data(period_start, period_end);
CREATE INDEX idx_mrv_metrics_territory ON public.mrv_metrics(territory_id);
CREATE INDEX idx_mrv_metrics_type ON public.mrv_metrics(metric_type);
CREATE INDEX idx_climate_risks_territory ON public.climate_risks(territory_id);
CREATE INDEX idx_ai_insights_org ON public.ai_insights(organization_id);
CREATE INDEX idx_audit_logs_org ON public.audit_logs(organization_id);

-- RLS Policies

-- Organizations: users can see their own organization
CREATE POLICY "Users can view their organization"
ON public.organizations FOR SELECT
USING (
  id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- Profiles: users can view and update their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- Territories: users can access territories in their organization
CREATE POLICY "Users can view org territories"
ON public.territories FOR SELECT
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can insert org territories"
ON public.territories FOR INSERT
WITH CHECK (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update org territories"
ON public.territories FOR UPDATE
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- Assets: via territory organization
CREATE POLICY "Users can view org assets"
ON public.assets FOR SELECT
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

CREATE POLICY "Users can manage org assets"
ON public.assets FOR ALL
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- Emission factors: org-specific or defaults
CREATE POLICY "Users can view emission factors"
ON public.emission_factors FOR SELECT
USING (
  organization_id IS NULL OR
  organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- Operational data: via territory
CREATE POLICY "Users can view org operational data"
ON public.operational_data FOR SELECT
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

CREATE POLICY "Users can manage org operational data"
ON public.operational_data FOR ALL
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- MRV Metrics: via territory
CREATE POLICY "Users can view org mrv metrics"
ON public.mrv_metrics FOR SELECT
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

CREATE POLICY "Users can manage org mrv metrics"
ON public.mrv_metrics FOR ALL
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- Climate risks: via territory
CREATE POLICY "Users can view org climate risks"
ON public.climate_risks FOR SELECT
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

CREATE POLICY "Users can manage org climate risks"
ON public.climate_risks FOR ALL
USING (
  territory_id IN (
    SELECT id FROM public.territories 
    WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- AI Insights: org-based
CREATE POLICY "Users can view org ai insights"
ON public.ai_insights FOR SELECT
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update org ai insights"
ON public.ai_insights FOR UPDATE
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- Audit logs: org-based, read-only for users
CREATE POLICY "Users can view org audit logs"
ON public.audit_logs FOR SELECT
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create default organization for new user
  INSERT INTO public.organizations (name, slug)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'organization_name', 'Minha Organização'),
    COALESCE(new.raw_user_meta_data->>'organization_slug', 'org-' || substr(new.id::text, 1, 8))
  )
  RETURNING id INTO new_org_id;

  -- Create profile for new user
  INSERT INTO public.profiles (id, organization_id, full_name, role)
  VALUES (
    new.id,
    new_org_id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'admin'
  );

  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_territories_updated_at BEFORE UPDATE ON public.territories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_operational_data_updated_at BEFORE UPDATE ON public.operational_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_climate_risks_updated_at BEFORE UPDATE ON public.climate_risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default emission factors
INSERT INTO public.emission_factors (category, source_type, factor_value, unit, scope, methodology, source_reference, is_default) VALUES
('Energia Elétrica', 'grid_brazil', 0.0617, 'tCO2e/MWh', 2, 'GHG Protocol', 'MCTI Brasil 2023', true),
('Diesel', 'combustion', 2.68, 'tCO2e/m³', 1, 'GHG Protocol', 'IPCC 2006', true),
('Gasolina', 'combustion', 2.21, 'tCO2e/m³', 1, 'GHG Protocol', 'IPCC 2006', true),
('GLP', 'combustion', 1.61, 'tCO2e/m³', 1, 'GHG Protocol', 'IPCC 2006', true),
('Gás Natural', 'combustion', 2.15, 'tCO2e/1000m³', 1, 'GHG Protocol', 'IPCC 2006', true),
('Carvão', 'combustion', 2.42, 'tCO2e/t', 1, 'GHG Protocol', 'IPCC 2006', true);