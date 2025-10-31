-- Table: user_feedback - Feedback collection system
CREATE TABLE public.user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  feedback_type TEXT NOT NULL, -- 'bug', 'feature_request', 'general', 'praise', 'complaint'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  feature TEXT, -- specific feature being used
  urgency TEXT DEFAULT 'low' NOT NULL, -- 'low', 'medium', 'high', 'critical'
  contact_email TEXT,
  user_agent TEXT,
  url TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'new' NOT NULL, -- 'new', 'in_progress', 'resolved', 'closed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can submit feedback" ON public.user_feedback 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own feedback" ON public.user_feedback 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback" ON public.user_feedback 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update feedback" ON public.user_feedback 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Service role can do anything" ON public.user_feedback 
  FOR ALL USING (is_service_role(auth.role()));

-- Indexes for performance
CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX idx_user_feedback_type ON public.user_feedback(feedback_type);
CREATE INDEX idx_user_feedback_status ON public.user_feedback(status);
CREATE INDEX idx_user_feedback_urgency ON public.user_feedback(urgency);
CREATE INDEX idx_user_feedback_created_at ON public.user_feedback(created_at);

-- Helper function for service role (if not already defined)
CREATE OR REPLACE FUNCTION is_service_role(role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN role = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;





