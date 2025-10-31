# Competitive Intelligence & Revenue Capture System - Agent Tasks

## OVERVIEW
Implement missing Competitive Intelligence & Revenue Capture System with 20 library files, 7 API routes, and 4 database migrations. All files must be ≤50 lines.

---

## AGENT 1: Core Intelligence - competitiveIntelligence.ts
**File:** `src/lib/competitiveIntelligence.ts` (≤50 lines)

**Requirements:**
- Function: `analyzeEntity(entityId: string, entityType: 'business' | 'person' | 'organization')`
- Analyzes competitive entities (businesses, associations, owners, stallion owners, incentives)
- Extracts: income, financial needs, market position, relationships
- Returns: Competitive intelligence object with financial analysis, market position, threats/opportunities
- Uses Supabase to query `competitive_entities` and `financial_profiles` tables
- Must be ≤50 lines

**Dependencies:** Database migration `competitive_intelligence.sql` must exist first

**Pattern to follow:** Similar to `src/lib/entityIntelligence.ts` but focused on competitive analysis

---

## AGENT 2: Financial Analysis - financialAnalyzer.ts
**File:** `src/lib/financialAnalyzer.ts` (≤50 lines)

**Requirements:**
- Function: `analyzeFinancials(entityId: string)`
- Analyzes entity's financial profile: revenue, expenses, profit margins, financial needs
- Calculates: annual revenue estimate, profit percentage, vulnerability score (how much revenue we can capture)
- Returns: Financial profile with revenue streams, estimated capture potential (target: 8% of industry profit)
- Uses Supabase `financial_profiles` table
- Must be ≤50 lines

**Pattern to follow:** Similar to `src/lib/analytics/useAnalytics.ts` structure

---

## AGENT 3: Revenue Stream Mapping - revenueStreamMapper.ts
**File:** `src/lib/revenueStreamMapper.ts` (≤50 lines)

**Requirements:**
- Function: `mapRevenueStreams(entityId: string)`
- Maps all revenue streams for an entity (competitions, breeding fees, services, products)
- Identifies: Primary revenue sources, secondary streams, estimated values
- Returns: Array of revenue streams with amounts and capture strategies
- Uses Supabase `revenue_streams` table
- Must be ≤50 lines

---

## AGENT 4: Market Position Analysis - marketPositionAnalyzer.ts
**File:** `src/lib/marketPositionAnalyzer.ts` (≤50 lines)

**Requirements:**
- Function: `assessMarketPosition(entityId: string)`
- Assesses entity's market position: dominance, influence, dependency level
- Analyzes: Market share, competitor relationships, strategic value
- Returns: Market position score, influence level, strategic importance
- Must be ≤50 lines

---

## AGENT 5: Revenue Capture Strategies - revenueCaptureStrategies.ts
**File:** `src/lib/revenueCaptureStrategies.ts` (≤50 lines)

**Requirements:**
- Function: `selectStrategy(entityId: string, targetRevenuePercent: number)`
- Selects optimal revenue capture strategy (partnership, disruption, forced integration)
- Strategies: "partnership" (win-win), "disruption" (undercut), "forced" (essential service lock-in)
- Returns: Strategy type, implementation plan, expected revenue capture
- Uses Supabase `capture_strategies` table
- Must be ≤50 lines

---

## AGENT 6: Partnership Engine - partnershipEngine.ts
**File:** `src/lib/partnershipEngine.ts` (≤50 lines)

**Requirements:**
- Function: `createPartnership(entityId: string, strategy: object)`
- Creates partnership proposals and tracks partnership status
- Features: Partnership terms generation, revenue sharing calculations, proposal tracking
- Returns: Partnership proposal object with terms and status
- Must be ≤50 lines

---

## AGENT 7: Disruption Engine - disruptionEngine.ts
**File:** `src/lib/disruptionEngine.ts` (≤50 lines)

**Requirements:**
- Function: `executeDisruption(entityId: string, targetStream: string)`
- Executes disruption strategy to capture market share
- Features: Competitive pricing analysis, service undercutting, market capture tactics
- Returns: Disruption plan with expected impact and revenue capture
- Must be ≤50 lines

---

## AGENT 8: Forced Integration Engine - forcedIntegrationEngine.ts
**File:** `src/lib/forcedIntegrationEngine.ts` (≤50 lines)

**Requirements:**
- Function: `forceIntegration(entityId: string, integrationType: string)`
- Forces entities to join system by making service essential
- Strategies: Essential feature lock-in, data dependency, network effects
- Returns: Integration plan and forced dependency strategy
- Must be ≤50 lines

---

## AGENT 9: Psychological Persuasion - psychologicalPersuasion.ts
**File:** `src/lib/psychologicalPersuasion.ts` (≤50 lines)

**Requirements:**
- Function: `generatePersuasion(entityId: string, messageType: 'fomo' | 'fear' | 'social')`
- Generates psychologically persuasive messaging
- Uses: FOMO triggers, fear-based messaging, social proof
- Returns: Persuasive message object with psychological triggers
- Must be ≤50 lines

**Pattern:** Similar to existing psychology files like `src/neo-brain/psychology/emotionalResonance.ts`

---

## AGENT 10: FOMO Generator - fomoGenerator.ts
**File:** `src/lib/fomoGenerator.ts` (≤50 lines)

**Requirements:**
- Function: `generateFOMO(entityId: string, context: object)`
- Generates FOMO (Fear of Missing Out) messaging
- Triggers: Scarcity, exclusivity, time pressure, competitive advantage
- Returns: FOMO message with urgency triggers
- Must be ≤50 lines

---

## AGENT 11: Fear-Based Messaging - fearBasedMessaging.ts**
**File:** `src/lib/fearBasedMessaging.ts` (≤50 lines)

**Requirements:**
- Function: `createFearCampaign(entityId: string, fearType: string)`
- Creates fear-based messaging campaigns
- Fear types: Competitor advantage, market exclusion, financial loss, missed opportunities
- Returns: Fear campaign object with messaging and triggers
- Must be ≤50 lines

---

## AGENT 12: Social Proof Engine - socialProofEngine.ts
**File:** `src/lib/socialProofEngine.ts` (≤50 lines)

**Requirements:**
- Function: `generateSocialProof(entityId: string, proofType: string)`
- Generates social proof messaging (testimonials, usage stats, competitor adoption)
- Proof types: User counts, competitor adoption, success stories, market dominance
- Returns: Social proof object with statistics and testimonials
- Must be ≤50 lines

**Pattern:** Similar to `src/neo-brain/social/viralEngine.ts`

---

## AGENT 1 (Part 2): Lead Targeting - leadTargeting.ts
**File:** `src/lib/leadTargeting.ts` (≤50 lines)

**Requirements:**
- Function: `identifyHighValueTargets(criteria: object)`
- Identifies high-value targets based on financial profile and market position
- Criteria: Revenue threshold, market influence, vulnerability score, capture potential
- Returns: Array of high-value target entities
- Uses Supabase `competitive_entities` and `financial_profiles` tables
- Must be ≤50 lines

**Pattern:** Similar to existing `src/app/api/lead-generation/LeadGenerationService.ts`

---

## AGENT 2 (Part 2): Contact Discovery - contactDiscovery.ts
**File:** `src/lib/contactDiscovery.ts` (≤50 lines)

**Requirements:**
- Function: `discoverContacts(entityId: string)`
- Discovers contact information for entities (emails, phones, social profiles)
- Sources: Public databases, API integrations, web scraping (via existing services)
- Returns: Contact information object
- Must be ≤50 lines

**Pattern:** Similar to `src/services/LeadCaptureExtractor.ts`

---

## AGENT 3 (Part 2): Outreach Campaign - outreachCampaign.ts
**File:** `src/lib/outreachCampaign.ts` (≤50 lines)

**Requirements:**
- Function: `createOutreachCampaign(targets: string[], campaignType: string)`
- Creates personalized outreach campaigns for target entities
- Campaign types: Partnership proposal, disruption warning, integration opportunity
- Features: Message personalization, A/B testing, follow-up scheduling
- Returns: Campaign object with messages and schedule
- Must be ≤50 lines

**Pattern:** Similar to `src/app/admin-secret-xyz123/outreach/OutreachOperations.ts`

---

## AGENT 4 (Part 2): Conversion Funnel - conversionFunnel.ts
**File:** `src/lib/conversionFunnel.ts` (≤50 lines)

**Requirements:**
- Function: `trackConversion(campaignId: string, stage: string, entityId: string)`
- Tracks conversion funnel stages for revenue capture campaigns
- Stages: Contacted, Responded, Negotiating, Partnership Signed, Revenue Captured
- Uses existing `conversion_funnels` table structure
- Returns: Conversion tracking data
- Must be ≤50 lines

**Pattern:** Similar to existing conversion tracking in `supabase/migrations/user_tracking.sql`

---

## AGENT 5: Intelligence API - /api/intelligence/analyze/route.ts**
**File:** `src/app/api/intelligence/analyze/route.ts` (≤50 lines)

**Requirements:**
- POST endpoint: `/api/intelligence/analyze`
- Body: `{ entityId: string, entityType: 'business' | 'person' | 'organization' }`
- Uses: `competitiveIntelligence.ts` → `analyzeEntity()`
- Returns: Competitive intelligence analysis
- Must be ≤50 lines, use helpers if needed

**Pattern:** Similar to `src/app/api/entity/business/[id]/route.ts`

---

## AGENT 6: Financials API - /api/intelligence/financials/route.ts**
**File:** `src/app/api/intelligence/financials/route.ts` (≤50 lines)

**Requirements:**
- POST endpoint: `/api/intelligence/financials`
- Body: `{ entityId: string }`
- Uses: `financialAnalyzer.ts` → `analyzeFinancials()`
- Returns: Financial analysis
- Must be ≤50 lines

---

## AGENT 7: Revenue Strategies API - /api/revenue/strategies/route.ts**
**File:** `src/app/api/revenue/strategies/route.ts` (≤50 lines)

**Requirements:**
- POST endpoint: `/api/revenue/strategies`
- Body: `{ entityId: string, targetRevenuePercent?: number }`
- Uses: `revenueCaptureStrategies.ts` → `selectStrategy()`
- Returns: Recommended capture strategy
- Must be ≤50 lines

---

## AGENT 8: Revenue Capture API - /api/revenue/capture/route.ts**
**File:** `src/app/api/revenue/capture/route.ts` (≤50 lines)

**Requirements:**
- POST endpoint: `/api/revenue/capture`
- Body: `{ entityId: string, strategyType: 'partnership' | 'disruption' | 'forced', strategy: object }`
- Uses: `partnershipEngine.ts`, `disruptionEngine.ts`, or `forcedIntegrationEngine.ts`
- Returns: Execution plan and status
- Must be ≤50 lines

---

## AGENT 9: Campaign API - /api/campaigns/create/route.ts**
**File:** `src/app/api/campaigns/create/route.ts` (≤50 lines)

**Requirements:**
- POST endpoint: `/api/campaigns/create`
- Body: `{ targets: string[], campaignType: string, messageType?: string }`
- Uses: `outreachCampaign.ts`, `fomoGenerator.ts`, `fearBasedMessaging.ts`, `socialProofEngine.ts`
- Returns: Created campaign with messages
- Must be ≤50 lines

---

## AGENT 10: Lead Generation API - /api/leads/generate/route.ts**
**File:** `src/app/api/leads/generate/route.ts` (≤50 lines)

**Requirements:**
- POST endpoint: `/api/leads/generate`
- Body: `{ criteria: object }`
- Uses: `leadTargeting.ts` → `identifyHighValueTargets()`, `contactDiscovery.ts` → `discoverContacts()`
- Returns: High-value leads with contact information
- Must be ≤50 lines

**Pattern:** Similar to existing `src/app/api/lead-generation/route.ts`

---

## AGENT 11: Lead Outreach API - /api/leads/outreach/route.ts**
**File:** `src/app/api/leads/outreach/route.ts` (≤50 lines)

**Requirements:**
- POST endpoint: `/api/leads/outreach`
- Body: `{ campaignId: string, targets: string[] }`
- Uses: `outreachCampaign.ts` → `createOutreachCampaign()`
- Returns: Outreach campaign status
- Must be ≤50 lines

---

## AGENT 12: Database Migration - competitive_intelligence.sql**
**File:** `supabase/migrations/competitive_intelligence.sql`

**Requirements:**
- Create `competitive_entities` table:
  - id, entity_id, entity_type, name, description, market_position, influence_score, created_at
- Create `financial_profiles` table:
  - id, entity_id, estimated_revenue, estimated_profit, revenue_streams (JSONB), vulnerability_score, created_at
- Create indexes for performance
- Follow pattern from `supabase/migrations/user_tracking.sql`

---

## AGENT 1 (Part 3): Database Migration - revenue_capture.sql**
**File:** `supabase/migrations/revenue_capture.sql`

**Requirements:**
- Create `revenue_streams` table:
  - id, entity_id, stream_type, estimated_value, capture_potential, created_at
- Create `capture_strategies` table:
  - id, entity_id, strategy_type, implementation_plan (JSONB), expected_revenue, status, created_at
- Create indexes

---

## AGENT 2 (Part 3): Database Migration - psychological_campaigns.sql**
**File:** `supabase/migrations/psychological_campaigns.sql`

**Requirements:**
- Create `psychological_campaigns` table:
  - id, entity_id, campaign_type, message_type, message_content (JSONB), status, created_at
- Create indexes

---

## AGENT 3 (Part 3): Database Migration - lead_generation.sql**
**File:** `supabase/migrations/lead_generation.sql`

**Requirements:**
- Create `lead_targets` table:
  - id, entity_id, target_score, contact_info (JSONB), campaign_id, status, created_at
- Create indexes

---

## VERIFICATION CHECKLIST

After each agent completes:

1. **File exists:** `src/lib/[filename].ts` or `src/app/api/[path]/route.ts`
2. **Line count:** Run `wc -l [file]` - must be ≤50 lines
3. **TypeScript compiles:** Run `npx tsc --noEmit` - no errors
4. **Pattern match:** Follows existing codebase patterns
5. **Exports:** Function(s) properly exported
6. **Imports:** Uses existing Supabase/client utilities
7. **Database:** Migration file created and can be applied

---

## PRIORITY ORDER

**Phase 1 (Foundation):**
1. Agent 12: competitive_intelligence.sql migration
2. Agent 1: competitiveIntelligence.ts
3. Agent 2: financialAnalyzer.ts
4. Agent 5: Intelligence APIs

**Phase 2 (Revenue Capture):**
5. Agent 1 (Part 3): revenue_capture.sql migration
6. Agent 3: revenueStreamMapper.ts
7. Agent 4: marketPositionAnalyzer.ts
8. Agent 5: revenueCaptureStrategies.ts
9. Agent 6-8: Partnership, Disruption, Forced Integration engines
10. Agent 7-8: Revenue APIs

**Phase 3 (Psychology & Leads):**
11. Agent 2 (Part 3): psychological_campaigns.sql migration
12. Agent 9-12: Psychology engines
13. Agent 3 (Part 3): lead_generation.sql migration
14. Agent 1-4 (Part 2): Lead targeting and outreach
15. Agent 9-11: Campaign and Lead APIs

---

## NOTES

- All files MUST be ≤50 lines (split into helpers if needed)
- Use existing patterns from codebase (entityIntelligence, LeadCapture, etc.)
- Use Supabase client: `createClient(cookies())` in API routes, `createClient()` in lib files
- Follow TypeScript patterns from existing code
- Test compilation: `npx tsc --noEmit` after each file
- Integration points: Link to existing lead generation, entity intelligence, and outreach systems

