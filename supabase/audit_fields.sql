-- AUDIT FIELDS MIGRATION
-- PURPOSE: Add source tracking to all user data tables for legal compliance
-- SAFETY: Every user input is timestamped with source_user_id and source_type
-- LEGAL: Required for App Store compliance and liability protection

-- Add audit fields to provider_feedback table
ALTER TABLE provider_feedback 
ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'self',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add audit fields to stallion_contacts table (create if doesn't exist)
CREATE TABLE IF NOT EXISTS stallion_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stallion_id uuid,
  stallion_name text NOT NULL,
  reported_fee numeric,
  booking_contact_public text,
  source_user_id uuid REFERENCES auth.users(id),
  source_type text DEFAULT 'self',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  replaced_by_id uuid REFERENCES stallion_contacts(id)
);

-- Add audit fields to provider_crm_contacts table
ALTER TABLE provider_crm_contacts 
ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'crm_upload',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add audit fields to haul_support_feedback table
ALTER TABLE haul_support_feedback 
ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'self',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add audit fields to horse_claims table
ALTER TABLE horse_claims 
ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'self',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add audit fields to service_requests table
ALTER TABLE service_requests 
ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'self',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add audit fields to aftercare_pings table
ALTER TABLE aftercare_pings 
ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'system',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add audit fields to provider_dispatches table
ALTER TABLE provider_dispatches 
ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'system',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_feedback_source_user_id ON provider_feedback(source_user_id);
CREATE INDEX IF NOT EXISTS idx_provider_feedback_source_type ON provider_feedback(source_type);
CREATE INDEX IF NOT EXISTS idx_provider_feedback_created_at ON provider_feedback(created_at);

CREATE INDEX IF NOT EXISTS idx_stallion_contacts_source_user_id ON stallion_contacts(source_user_id);
CREATE INDEX IF NOT EXISTS idx_stallion_contacts_source_type ON stallion_contacts(source_type);
CREATE INDEX IF NOT EXISTS idx_stallion_contacts_created_at ON stallion_contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_stallion_contacts_replaced_by_id ON stallion_contacts(replaced_by_id);

CREATE INDEX IF NOT EXISTS idx_provider_crm_contacts_source_user_id ON provider_crm_contacts(source_user_id);
CREATE INDEX IF NOT EXISTS idx_provider_crm_contacts_source_type ON provider_crm_contacts(source_type);
CREATE INDEX IF NOT EXISTS idx_provider_crm_contacts_created_at ON provider_crm_contacts(created_at);

CREATE INDEX IF NOT EXISTS idx_haul_support_feedback_source_user_id ON haul_support_feedback(source_user_id);
CREATE INDEX IF NOT EXISTS idx_haul_support_feedback_source_type ON haul_support_feedback(source_type);
CREATE INDEX IF NOT EXISTS idx_haul_support_feedback_created_at ON haul_support_feedback(created_at);

CREATE INDEX IF NOT EXISTS idx_horse_claims_source_user_id ON horse_claims(source_user_id);
CREATE INDEX IF NOT EXISTS idx_horse_claims_source_type ON horse_claims(source_type);
CREATE INDEX IF NOT EXISTS idx_horse_claims_created_at ON horse_claims(created_at);

CREATE INDEX IF NOT EXISTS idx_service_requests_source_user_id ON service_requests(source_user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_source_type ON service_requests(source_type);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);

-- Comments for legal clarity
COMMENT ON COLUMN provider_feedback.source_user_id IS 'User who provided this feedback - for audit trail';
COMMENT ON COLUMN provider_feedback.source_type IS 'How this feedback was provided: self, crm_upload, public_web, other_user, event_import';
COMMENT ON COLUMN provider_feedback.created_at IS 'When this feedback was provided - immutable timestamp';

COMMENT ON COLUMN stallion_contacts.source_user_id IS 'User who provided this stallion info - for audit trail';
COMMENT ON COLUMN stallion_contacts.source_type IS 'How this info was provided: self, crm_upload, public_web, other_user, event_import';
COMMENT ON COLUMN stallion_contacts.created_at IS 'When this info was provided - immutable timestamp';
COMMENT ON COLUMN stallion_contacts.replaced_by_id IS 'Points to newer version if this info was updated - for versioning';

COMMENT ON COLUMN provider_crm_contacts.source_user_id IS 'User who uploaded this CRM data - for audit trail';
COMMENT ON COLUMN provider_crm_contacts.source_type IS 'How this data was provided: crm_upload, self, public_web, other_user, event_import';
COMMENT ON COLUMN provider_crm_contacts.created_at IS 'When this data was uploaded - immutable timestamp';

COMMENT ON COLUMN haul_support_feedback.source_user_id IS 'User who provided this haul support feedback - for audit trail';
COMMENT ON COLUMN haul_support_feedback.source_type IS 'How this feedback was provided: self, crm_upload, public_web, other_user, event_import';
COMMENT ON COLUMN haul_support_feedback.created_at IS 'When this feedback was provided - immutable timestamp';

COMMENT ON COLUMN horse_claims.source_user_id IS 'User who claimed this horse - for audit trail';
COMMENT ON COLUMN horse_claims.source_type IS 'How this claim was made: self, crm_upload, public_web, other_user, event_import';
COMMENT ON COLUMN horse_claims.created_at IS 'When this claim was made - immutable timestamp';

COMMENT ON COLUMN service_requests.source_user_id IS 'User who requested this service - for audit trail';
COMMENT ON COLUMN service_requests.source_type IS 'How this request was made: self, crm_upload, public_web, other_user, event_import';
COMMENT ON COLUMN service_requests.created_at IS 'When this request was made - immutable timestamp';




