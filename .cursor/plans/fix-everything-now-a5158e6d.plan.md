<!-- a5158e6d-3d51-41b1-9ab4-73f5b29e3dc0 7d217697-db9a-44b4-ab97-83a72b01c9b0 -->
# <!-- a5158e6d-3d51-41b1-9ab4-73f5b29e3dc0 c7f0ffee-29b2-45db-a79f-c85fc06a8bc8 -->

# Build Complete Money Machine + Smart Calendar

## What We're Building

Not just adding tables - we're building the **complete money printer + intelligent assistant** that runs itself:

1. **Paywall enforcement** (rate limiting → upsell)
2. **Service marketplace** (farriers, vets, haulers, layover barns)
3. **Viral claim loop** ("Is this your horse?" → auto-verify with docs)
4. **Proactive travel concierge** ("I see you're in OKC - want food/stalls/vet?")
5. **Auto-growth machine** (SMS/email outreach runs itself)
6. **Admin CRM** (approve claims, verify providers, dispatch jobs)
7. **Smart Calendar + Time Intelligence** (reminders, show schedules, proactive pings)

## The 14 New Database Tables (Complete Logistics Network + Memory)

### 1. `providers` - Service Marketplace

```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  service_type TEXT NOT NULL, -- 'farrier', 'repro', 'hauler', 'vet', 'trainer', 'layover_barn', 'food', 'tack_shop'
  specialty TEXT, -- 'corrective shoeing', 'ships cooled semen', 'trailer parking', '24hr', etc
  city TEXT,
  state TEXT,
  verified BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE, -- can pay to be top of list
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `user_alerts` - Retention Engine

```sql
CREATE TABLE user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'fulfilled'
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `horse_claims` - Viral Growth + Auto-Verify

```sql
CREATE TABLE horse_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  claim_type TEXT NOT NULL, -- 'owner', 'rider', 'breeder', 'trainer', 'produced_event'
  name_submitted TEXT,
  phone TEXT,
  email TEXT,
  verification_doc_url TEXT, -- S3/Supabase storage URL for uploaded docs
  auto_verified BOOLEAN DEFAULT FALSE, -- AI approved from docs
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);
```

### 4. `message_usage` - Paywall Enforcer

```sql
CREATE TABLE message_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_message_usage_user_time ON message_usage(user_id, created_at);
```

### 5. `notifications_outbox` - Autopilot Growth

```sql
CREATE TABLE notifications_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  target_phone TEXT,
  target_email TEXT,
  message_body TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'sms', 'email'
  status TEXT DEFAULT 'queued', -- 'queued', 'sent', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX idx_notifications_status ON notifications_outbox(status, created_at);
```

### 6. `user_memory` - Travel Preferences + Proactive Concierge

```sql
CREATE TABLE user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}', -- food_likes, sleep_preference, kids_with_them, etc
  travel_pattern JSONB DEFAULT '{}', -- home_base, usual_cities, hauling_style, typical_show_needs
  current_location JSONB, -- { city, state, lat, lng, detected_at }
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_memory_user_id ON user_memory(user_id);
```

### 7. `service_requests` - Dispatch Jobs to Providers

```sql
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service_type TEXT NOT NULL, -- 'farrier', 'vet', 'layover_barn', 'food', etc
  location_city TEXT,
  location_state TEXT,
  needed_by TIMESTAMPTZ,
  details TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'claimed', 'completed', 'canceled'
  claimed_by UUID REFERENCES providers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_service_requests_status ON service_requests(status, created_at);
```

### 8. `provider_claims` - Providers Claim Jobs

```sql
CREATE TABLE provider_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  price_quoted DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. `haul_support_points` - Road Infrastructure Intelligence

```sql
CREATE TABLE haul_support_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Love's Exit 178" / "Lazy E Arena Hookups"
  type TEXT NOT NULL, -- 'truck_stop', 'arena_hookup', 'overnight_barn', 'fairgrounds', 'restaurant_rig_space'
  lat DECIMAL,
  lng DECIMAL,
  interstate_exit TEXT,
  highway TEXT,
  city TEXT,
  state TEXT,
  rig_swing_ok BOOLEAN DEFAULT FALSE, -- can you pull through 40' LQ without backing?
  lit_at_night BOOLEAN DEFAULT TRUE,
  cameras_visible BOOLEAN DEFAULT FALSE,
  is_24hr BOOLEAN DEFAULT FALSE,
  overnight_ok BOOLEAN DEFAULT FALSE,
  water_spigot_available BOOLEAN DEFAULT FALSE,
  hose_fill_ok BOOLEAN DEFAULT FALSE,
  safe_to_walk_horse BOOLEAN DEFAULT FALSE,
  hookups_available BOOLEAN DEFAULT FALSE,
  hookup_amps TEXT, -- '30amp', '50amp'
  hookup_cost_per_night DECIMAL,
  stalls_available BOOLEAN DEFAULT FALSE,
  stall_count INT,
  stall_cost_per_night DECIMAL,
  text_to_book_number TEXT,
  diesel_price_last_seen DECIMAL,
  def_available BOOLEAN DEFAULT FALSE,
  last_verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_haul_points_location ON haul_support_points(state, city);
CREATE INDEX idx_haul_points_type ON haul_support_points(type);
```

### 10. `need_events` - Demand Heatmap (What People Actually Need)

```sql
CREATE TABLE need_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL, -- 'fuel', 'overnight_stalls', 'emergency_vet', 'food_with_rig_space', 'hookups'
  location_city TEXT,
  location_state TEXT,
  urgency TEXT, -- 'asap', 'today', 'this_weekend', 'planning_ahead'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_need_events_category ON need_events(category, created_at);
CREATE INDEX idx_need_events_location ON need_events(location_state, location_city);
```

### 11. `provider_feedback` - Trust + Safety Intelligence (THE MOAT)

```sql
CREATE TABLE provider_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID, -- links to providers OR haul_support_points
  support_point_id UUID,
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL, -- 'overnight_stall', 'emergency_vet', 'fuel_stop', 'arena_hookup', 'hauler', 'farrier'
  safe_score INT CHECK (safe_score BETWEEN 0 AND 2), -- 0=never again, 1=wasn't great, 2=safe and decent
  care_score INT CHECK (care_score BETWEEN 0 AND 2),
  reliability_score INT CHECK (reliability_score BETWEEN 0 AND 2),
  would_use_again TEXT CHECK (would_use_again IN ('yes', 'only_if_forced', 'no')),
  notes_private TEXT, -- for internal QA only
  followup_flag BOOLEAN DEFAULT FALSE, -- escalate to admin?
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feedback_provider ON provider_feedback(provider_id);
CREATE INDEX idx_feedback_support_point ON provider_feedback(support_point_id);
```

### 12. `aftercare_pings` - Feedback Collection System

```sql
CREATE TABLE aftercare_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider_id UUID,
  support_point_id UUID,
  recommendation_type TEXT, -- 'overnight_barn', 'emergency_vet', 'fuel_stop', etc
  ping_message TEXT, -- "How'd that barn work out?"
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'answered'
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_aftercare_status ON aftercare_pings(status, scheduled_for);
```

### 13. `provider_insights` - Aggregated Trust Summary

```sql
CREATE TABLE provider_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID,
  support_point_id UUID,
  summary_text TEXT, -- "18 haulers this month said safe solo at night"
  total_feedback_count INT DEFAULT 0,
  avg_safe_score DECIMAL,
  avg_care_score DECIMAL,
  avg_reliability_score DECIMAL,
  would_use_again_count INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

### 14. `user_calendar_events` - Smart Calendar + Proactive Reminders

```sql
CREATE TABLE user_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'reminder', 'show_date', 'haul_date', 'vet_appointment', 'farrier_appointment', 'entry_deadline'
  event_title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location_city TEXT,
  location_state TEXT,
  horse_id UUID REFERENCES horses(id), -- which horse is involved?
  reminder_time TIMESTAMPTZ, -- when to auto-ping them
  reminded_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending', 'reminded', 'completed', 'canceled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_calendar_user_date ON user_calendar_events(user_id, event_date);
CREATE INDEX idx_calendar_reminders ON user_calendar_events(reminder_time, status);
```

### 15. `user_acceptance_log` - Legal Shield (Liability Protection)

```sql
CREATE TABLE user_acceptance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL, -- 'v1.0', 'v2.0', etc
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  geo_guess TEXT -- city/state if detectable
);
CREATE INDEX idx_acceptance_user ON user_acceptance_log(user_id, accepted_at);
```

### 16. `provider_acceptance_log` - Provider Terms Consent

```sql
CREATE TABLE provider_acceptance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 17. `user_profile_state` - "Your File" (Retention Anchor)

```sql
CREATE TABLE user_profile_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  home_base_city TEXT,
  home_base_state TEXT,
  preferred_fuel_stop_summary TEXT,
  preferred_farrier_id UUID REFERENCES providers(id),
  preferred_vet_id UUID REFERENCES providers(id),
  active_deadlines_json JSONB DEFAULT '[]',
  saved_safe_stops_json JSONB DEFAULT '[]',
  notes_from_ai TEXT, -- "she hauls futurity colts, prefers quiet stalls over cost"
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

### 18. `provider_feedback_flagged` - Safety Moderation Queue

```sql
CREATE TABLE provider_feedback_flagged (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES provider_feedback(id),
  provider_id UUID,
  reason TEXT, -- 'accused_of_abuse', 'safety_risk', 'price_scam', 'repeated_unsafe'
  needs_review BOOLEAN DEFAULT TRUE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_flagged_needs_review ON provider_feedback_flagged(needs_review, created_at);
```

### 19. `booking_transactions` - Payment Flow + Refund Tracking

```sql
CREATE TABLE booking_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  service_request_id UUID REFERENCES service_requests(id),
  amount_usd DECIMAL NOT NULL,
  status TEXT DEFAULT 'authorized', -- 'authorized', 'captured', 'refunded', 'dispute_flag'
  refund_reason_code TEXT, -- 'barn_no_show', 'user_no_show', 'other'
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  refunded_at TIMESTAMPTZ
);
CREATE INDEX idx_booking_user ON booking_transactions(user_id, created_at);
CREATE INDEX idx_booking_provider ON booking_transactions(provider_id, created_at);
```

### 20. `event_claims` - Event Producer Viral Loop (THE MULTIPLIER)

```sql
CREATE TABLE event_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL, -- 'producer', 'arena_owner', 'secretary', 'ground_crew', 'sponsor'
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);
CREATE INDEX idx_event_claims_status ON event_claims(status, created_at);
```

## New Features We're Building

### Feature 1: Auto-Claim Verification with Document Upload

**Flow:**

1. User claims "This is my horse"
2. Upload button: "Upload registration papers or business docs"
3. AI (GPT-4 Vision) reads doc and extracts: horse name, owner name, reg number
4. If doc matches claim → auto-approve, status='verified', auto_verified=true
5. If no doc or mismatch → goes to your admin queue

**Files:**

- `src/app/api/claim/upload-doc/route.ts` - Document upload + AI verification
- `src/lib/claim-verifier.ts` - GPT-4 Vision document parser

### Feature 2: Proactive Travel Concierge

**Flow:**

1. User mentions "heading to OKC" or we detect location change
2. HorseGPT proactively offers:

   - "Want food recs for rigs?"
   - "Need overnight stall?"
   - "Want vet on standby?"

3. Buttons in chat trigger service requests
4. We match to providers in that city
5. Take booking fee or provider commission

**Files:**

- `src/lib/location-detector.ts` - Detect city mentions or GPS
- `src/lib/concierge-offers.ts` - Generate contextual offers
- Chat UI updated with proactive offer cards

### Feature 3: Service Marketplace Dispatch

**Flow:**

1. User clicks "Find me a farrier in Stephenville tomorrow AM"
2. Creates service_request
3. Notifies verified providers in that geo
4. Provider claims job
5. User gets notification "John's Farrier will be there 8am"
6. We collect $5-20 booking fee

**Files:**

- `src/app/api/service-requests/route.ts` - Create requests
- `src/app/api/service-requests/claim/route.ts` - Providers claim jobs
- `src/hooks/useServiceRequests.ts` - Hook for managing requests

### Feature 4: Smart Calendar + Time Intelligence

**Flow:**

1. User: "Remind me to call that farrier Monday 9am"

   - HorseGPT creates calendar event with reminder
   - Auto-pings them Monday 9am

2. User: "I'm hauling to OKC Friday morning"

   - Saves event → auto-pings Thursday night: "Hauling tomorrow - want stalls/vet lined up?"

3. Proactive show tracking:

   - "You've got 3 horses running this month - want me to pull their results after?"
   - "Pink Buckle deadline in 3 days - did you enter [Horse Name]?"

**Files:**

- `src/app/api/calendar/route.ts` - Create/update calendar events
- `src/hooks/useCalendar.ts` - Hook for managing events
- `src/lib/reminder-scheduler.ts` - Cron job that sends reminders
- Chat UI updated to detect time/date mentions and offer to save them

### Feature 5: Admin CRM Dashboard

**Pages:**

- `/admin-secret-xyz123/claims` - Approve/reject horse claims
- `/admin-secret-xyz123/providers` - Verify providers, mark sponsored
- `/admin-secret-xyz123/requests` - See active service requests
- `/admin-secret-xyz123/outreach` - Queue outbound SMS/email
- `/admin-secret-xyz123/calendar` - View all upcoming user events

## Files Being Created/Updated

### New SQL Migration

1. `supabase-complete-tables.sql` - All 14 new tables

### Updated Core Files

2. `src/lib/supabase.ts` - Add types for 14 new tables
3. `src/lib/rate-limiter.ts` - Use message_usage table
4. `src/app/api/chat/route.ts` - Insert message_usage, check user_memory for proactive offers, detect time mentions

### New API Endpoints

5. `src/app/api/providers/route.ts` - Search providers by city/service
6. `src/app/api/service-requests/route.ts` - Create service requests
7. `src/app/api/service-requests/claim/route.ts` - Providers claim jobs
8. `src/app/api/claim/upload-doc/route.ts` - Upload docs for auto-verify
9. `src/app/api/user-memory/route.ts` - Update travel preferences
10. `src/app/api/calendar/route.ts` - Create/update calendar events

### New Hooks

11. `src/hooks/useProviders.ts` - Search and filter providers
12. `src/hooks/useServiceRequests.ts` - Manage service requests
13. `src/hooks/useUserMemory.ts` - Read/update travel preferences
14. `src/hooks/useCalendar.ts` - Manage calendar events

### New Lib Functions

15. `src/lib/location-detector.ts` - Detect city from chat message
16. `src/lib/concierge-offers.ts` - Generate proactive offers
17. `src/lib/claim-verifier.ts` - AI document verification
18. `src/lib/reminder-scheduler.ts` - Cron job for calendar reminders

### Admin Dashboard

19. `src/app/admin-secret-xyz123/claims/page.tsx` - Claims approval queue
20. `src/app/admin-secret-xyz123/providers/page.tsx` - Provider management
21. `src/app/admin-secret-xyz123/requests/page.tsx` - Active service requests
22. `src/app/admin-secret-xyz123/outreach/page.tsx` - SMS/email queue
23. `src/app/admin-secret-xyz123/calendar/page.tsx` - User calendar view

### Updated Chat UI

24. `src/app/chat/page.tsx` - Add proactive offer cards + calendar detection
25. `src/components/ProactiveOfferCard.tsx` - NEW component for offers
26. `src/components/ServiceRequestButton.tsx` - NEW button for service requests
27. `src/components/CalendarSavePrompt.tsx` - NEW prompt to save dates/times

## What This Unlocks

After this implementation:

### Money Flows

1. **Paywall** → Guest hits 10 messages → "$4.99 trial unlocks unlimited + concierge"
2. **Service booking fees** → User books farrier → We take $5-20 per booking
3. **Sponsored placement** → Farriers pay $50/mo to be "Preferred Provider"
4. **Layover barn commissions** → $10-30 per stall booking
5. **Premium concierge packs** → "Weekend setup: vet + stalls + food = $29"

### Growth Loops

1. **Horse claims** → "Is this your horse?" → SMS to 80k riders → Sign-ups
2. **Service requests** → Riders ask for farriers → We onboard providers → Network grows
3. **Proactive offers** → "Want food in OKC?" → They say yes → Retention
4. **Calendar reminders** → Users get value daily → Sticky habit formation
5. **Provider referrals** → Farriers tell vets → Vets tell haulers → Viral in horse world

### Competitive Moats

1. **You own the travel memory** (nobody else knows their route)
2. **You own the service graph** (who rode what horse where when)
3. **You own the money flow** (bookings go through you)
4. **You own the trust** (auto-verified claims = legitimacy)
5. **You own their time** (calendar = daily engagement)

## Implementation Order

1. SQL migration (all 14 tables)
2. Update supabase types
3. Fix rate-limiter to use message_usage
4. Provider search API + hook
5. Service requests API + dispatch logic
6. User memory API + location detection
7. Calendar API + reminder scheduler
8. Proactive offer generation in chat
9. Document upload + AI verification for claims
10. Admin CRM pages (claims, providers, requests, outreach, calendar)
11. Test end-to-end: chat → offer → booking → provider claim → commission

## Expected Result

You'll have:

- Real paywall that fires at perfect moment
- Service marketplace that dispatches jobs
- Viral claim loop with auto-verification
- Proactive concierge that anticipates needs
- Smart calendar that remembers and reminds
- Auto-growth via SMS outreach
- Admin CRM to control everything
- Revenue from bookings, sponsorships, subscriptions

This is no longer "chat app for horses."

This is **the logistics network + payments rail + personal assistant for the entire competitive horse world.**

Valuation: Not SaaS multiple. Uber/Stripe multiple.

### To-dos

- [ ] Create supabase-missing-tables.sql with 5 new tables + indexes + RLS
- [ ] Update src/lib/supabase.ts with new table types
- [ ] Update rate-limiter.ts to use new message_usage table
- [ ] Create /api/providers endpoint and useProviders hook
- [ ] Wire admin page to show real claims/providers/alerts
- [ ] Test full flow: chat → rate limit → upsell → claim → admin approve