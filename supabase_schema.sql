-- 1. WORKSPACES (agency accounts)
CREATE TABLE workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter','agency','agency_pro')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKSPACE MEMBERS
CREATE TABLE workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner','admin','analyst','client')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- 3. CLIENT WORKSPACES (agency clients)
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  monthly_budget NUMERIC(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTEGRATIONS (ad platform connections)
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads','meta_ads')),
  account_id TEXT NOT NULL,
  account_name TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','expired','error')),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CAMPAIGNS
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  platform_campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active','paused','ended','draft')),
  objective TEXT,
  budget_daily NUMERIC(10,2),
  budget_total NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DAILY METRICS
CREATE TABLE metrics_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  spend NUMERIC(10,2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions NUMERIC(10,2) DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  -- Computed fields
  ctr NUMERIC(6,4) GENERATED ALWAYS AS 
    (CASE WHEN impressions > 0 THEN clicks::NUMERIC/impressions ELSE 0 END) STORED,
  cpc NUMERIC(10,2) GENERATED ALWAYS AS 
    (CASE WHEN clicks > 0 THEN spend/clicks ELSE 0 END) STORED,
  cpa NUMERIC(10,2) GENERATED ALWAYS AS 
    (CASE WHEN conversions > 0 THEN spend/conversions ELSE 0 END) STORED,
  roas NUMERIC(8,2) GENERATED ALWAYS AS 
    (CASE WHEN spend > 0 THEN revenue/spend ELSE 0 END) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- 7. OPPORTUNITIES (AI-detected)
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN (
    'budget_scale','budget_cap','pause_campaign',
    'creative_fatigue','cpa_spike','roas_drop','ctr_drop'
  )),
  severity TEXT CHECK (severity IN ('critical','warning','info')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ai_narrative TEXT,          -- Claude-generated plain English explanation
  metric_value NUMERIC,
  metric_delta NUMERIC,       -- % change vs last period
  status TEXT DEFAULT 'open' CHECK (status IN ('open','actioned','dismissed')),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  actioned_at TIMESTAMPTZ
);

-- 8. REPORTS
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('performance','platform','campaign','weekly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','generating','ready','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REPORT SCHEDULES
CREATE TABLE report_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily','weekly','monthly')),
  send_to_email TEXT NOT NULL,
  next_run_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ROW LEVEL SECURITY (enforce on ALL tables)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "workspace_member_access" ON workspaces
  FOR ALL USING (
    id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_data" ON workspace_members
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "clients_workspace_access" ON clients
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "integrations_workspace_access" ON integrations
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "campaigns_workspace_access" ON campaigns
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "metrics_daily_workspace_access" ON metrics_daily
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "opportunities_workspace_access" ON opportunities
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "reports_workspace_access" ON reports
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "report_schedules_workspace_access" ON report_schedules
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );
