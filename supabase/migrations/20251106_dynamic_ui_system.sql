-- Dynamic UI System Migration
-- Enables no-code admin control over UI, content, features, and emails

-- 1. UI Configuration (Theme, Colors, Fonts, etc)
CREATE TABLE IF NOT EXISTS ui_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  type TEXT NOT NULL, -- 'color', 'text', 'image', 'font', 'number', 'json'
  category TEXT NOT NULL, -- 'branding', 'content', 'layout', 'theme'
  label TEXT NOT NULL, -- Human-readable label for admin UI
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ui_config_category ON ui_config(category);
CREATE INDEX idx_ui_config_type ON ui_config(type);

-- Insert default theme
INSERT INTO ui_config (key, value, type, category, label, description) VALUES
('primary_color', '{"color": "#0ea5e9"}', 'color', 'theme', 'Primary Color', 'Main brand color (turquoise)'),
('secondary_color', '{"color": "#f59e0b"}', 'color', 'theme', 'Secondary Color', 'Accent color (gold)'),
('font_family', '{"font": "Inter"}', 'text', 'theme', 'Font Family', 'Primary font'),
('site_title', '{"text": "HorseGPT"}', 'text', 'branding', 'Site Title', 'Main site title'),
('hero_headline', '{"text": "AI for Horse People"}', 'text', 'content', 'Hero Headline', 'Homepage main headline'),
('chat_placeholder', '{"text": "Ask me anything about horses..."}', 'text', 'content', 'Chat Placeholder', 'Chat input placeholder text')
ON CONFLICT (key) DO NOTHING;

-- 2. Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INT DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  user_segments JSONB DEFAULT '[]', -- ['premium', 'beta_testers', etc]
  config JSONB DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feature_flags_enabled ON feature_flags(is_enabled);

-- Insert default features
INSERT INTO feature_flags (feature_name, is_enabled, description) VALUES
('psychology_engine', true, 'Advanced psychology and emotion detection'),
('vector_search', false, 'Vector database semantic search'),
('breeding_ai', true, 'AI-powered breeding recommendations'),
('voice_input', true, 'Voice recording in chat'),
('admin_dashboard', true, 'Admin command center access'),
('upvote_downvote', true, 'Feedback buttons on chat messages')
ON CONFLICT (feature_name) DO NOTHING;

-- 3. Email Templates (Dynamic)
CREATE TABLE IF NOT EXISTS email_templates_dynamic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  html_template TEXT NOT NULL,
  text_template TEXT,
  variables JSONB DEFAULT '[]', -- Available merge tags: [{name: 'userName', example: 'John'}]
  category TEXT, -- 'transactional', 'marketing', 'system'
  is_active BOOLEAN DEFAULT true,
  test_data JSONB, -- Sample data for preview
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_templates_active ON email_templates_dynamic(is_active);
CREATE INDEX idx_email_templates_category ON email_templates_dynamic(category);

-- Insert default email templates
INSERT INTO email_templates_dynamic (name, subject, html_template, variables, category) VALUES
('welcome_email', 'Welcome to HorseGPT!', '<h1>Welcome {{userName}}!</h1><p>Thanks for joining HorseGPT.</p>', '[{"name": "userName", "example": "John"}]', 'transactional'),
('upgrade_prompt', 'Unlock HorseGPT Pro Features', '<h1>Hi {{userName}},</h1><p>Upgrade to Pro for unlimited AI conversations!</p>', '[{"name": "userName", "example": "John"}]', 'marketing')
ON CONFLICT (name) DO NOTHING;

-- 4. Page Builder (For future drag-drop)
CREATE TABLE IF NOT EXISTS page_builder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  components JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  published_version JSONB,
  draft_version JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_builder_slug ON page_builder(slug);
CREATE INDEX idx_page_builder_published ON page_builder(is_published);

-- 5. Content Blocks (Editable content snippets)
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  content_type TEXT NOT NULL, -- 'text', 'html', 'markdown', 'json'
  page TEXT, -- Which page this belongs to
  section TEXT, -- Which section (hero, features, footer)
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_blocks_page ON content_blocks(page);
CREATE INDEX idx_content_blocks_section ON content_blocks(section);

-- Insert default content blocks
INSERT INTO content_blocks (block_key, content, content_type, page, section) VALUES
('home_hero_title', '{"text": "AI for Horse People"}', 'text', 'home', 'hero'),
('home_hero_subtitle', '{"text": "Your intelligent assistant for training, breeding, and care"}', 'text', 'home', 'hero'),
('chat_welcome_title', '{"text": "Hey there! I''m HorseGPT"}', 'text', 'chat', 'welcome'),
('chat_welcome_subtitle', '{"text": "Your AI expert for all equine disciplines"}', 'text', 'chat', 'welcome')
ON CONFLICT (block_key) DO NOTHING;

-- 6. Admin Activity Log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'theme_update', 'content_edit', 'feature_toggle', etc
  target TEXT NOT NULL, -- What was changed
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_log_admin ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_log_created ON admin_activity_log(created_at DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Dynamic UI System tables created successfully!';
  RAISE NOTICE 'Tables: ui_config, feature_flags, email_templates_dynamic, page_builder, content_blocks, admin_activity_log';
END $$;

