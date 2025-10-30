-- CONVERSATION AUDIT TABLE
-- PURPOSE: Track every user interaction for legal compliance and audit trail
-- SAFETY: Every conversation step is timestamped with source_user_id
-- LEGAL: Required for App Store compliance and liability protection

CREATE TABLE IF NOT EXISTS conversation_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- "onboarding.start", "service.request", "haul.support", "general.answer"
  payload jsonb, -- minimal structured data for audit trail
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- RLS Policies for conversation_audit
ALTER TABLE conversation_audit ENABLE ROW LEVEL SECURITY;

-- Users can only see their own audit records
CREATE POLICY "Users can view own audit records" ON conversation_audit
  FOR SELECT USING (auth.uid() = user_id);

-- Users cannot insert audit records directly (only via API)
CREATE POLICY "No direct user inserts" ON conversation_audit
  FOR INSERT WITH CHECK (false);

-- Only service role can insert audit records
CREATE POLICY "Service role can insert audit records" ON conversation_audit
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversation_audit_user_id ON conversation_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_audit_event_type ON conversation_audit(event_type);
CREATE INDEX IF NOT EXISTS idx_conversation_audit_created_at ON conversation_audit(created_at);

-- Comments for legal clarity
COMMENT ON TABLE conversation_audit IS 'Audit trail of all user conversations for legal compliance';
COMMENT ON COLUMN conversation_audit.user_id IS 'User who initiated the conversation';
COMMENT ON COLUMN conversation_audit.event_type IS 'Type of conversation event (onboarding, service, haul, general)';
COMMENT ON COLUMN conversation_audit.payload IS 'Minimal structured data for audit trail - no personal info';
COMMENT ON COLUMN conversation_audit.created_at IS 'When this conversation event occurred - immutable timestamp';



