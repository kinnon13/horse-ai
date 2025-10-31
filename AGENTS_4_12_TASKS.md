# AGENTS 4-12 TASKS - Competitive Intelligence Implementation

## CRITICAL: All files must be ≤50 lines. Split into helpers if needed.

---

## AGENT 4: Market Position Analyzer

**TASK:** Create `src/lib/marketPositionAnalyzer.ts` (≤50 lines)

**Function signature:**
```typescript
export async function assessMarketPosition(entityId: string): Promise<{
  positionScore: number
  influenceLevel: 'high' | 'medium' | 'low'
  strategicImportance: number
  marketShare?: number
  competitorCount?: number
}>
```

**Requirements:**
- Queries `competitive_entities` table for entity data
- Calculates position score (0-100) based on: market share, relationships, revenue
- Determines influence level from position score
- Calculates strategic importance for revenue capture potential
- Returns market position analysis object

**Pattern:** Follow `src/lib/entityIntelligence.ts` structure - use helper for Supabase client

**Verify:**
- File exists: `src/lib/marketPositionAnalyzer.ts`
- Line count: `wc -l src/lib/marketPositionAnalyzer.ts` (must be ≤50)
- Compiles: `npx tsc --noEmit` (no errors)

---

## AGENT 5: Revenue Capture Strategies + API Route

**TASK 1:** Create `src/lib/revenueCaptureStrategies.ts` (≤50 lines)

**Function signature:**
```typescript
export async function selectStrategy(
  entityId: string, 
  targetRevenuePercent: number = 0.08
): Promise<{
  strategyType: 'partnership' | 'disruption' | 'forced'
  implementationPlan: object
  expectedRevenueCapture: number
  confidence: number
}>
```

**Requirements:**
- Analyzes entity's financial profile and market position
- Selects optimal strategy: partnership (win-win), disruption (undercut), forced (lock-in)
- Generates implementation plan JSON
- Calculates expected revenue capture percentage
- Stores strategy in `capture_strategies` table

**TASK 2:** Create `src/app/api/revenue/strategies/route.ts` (≤50 lines)

**Endpoint:** `POST /api/revenue/strategies`

**Request body:**
```json
{
  "entityId": "string",
  "targetRevenuePercent": 0.08
}
```

**Requirements:**
- Calls `selectStrategy()` from `revenueCaptureStrategies.ts`
- Returns strategy recommendation
- Error handling with try/catch
- Uses `NextResponse.json()`

**Pattern:** Follow `src/app/api/entity/business/[id]/route.ts` structure

**Verify:**
- Files exist: `src/lib/revenueCaptureStrategies.ts`, `src/app/api/revenue/strategies/route.ts`
- Line counts ≤50 each
- API compiles and can be called

---

## AGENT 6: Partnership Engine

**TASK:** Create `src/lib/partnershipEngine.ts` (≤50 lines)

**Function signature:**
```typescript
export async function createPartnership(
  entityId: string,
  strategy: { type: string, terms: object }
): Promise<{
  proposalId: string
  terms: object
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected'
  expectedRevenueShare: number
}>
```

**Requirements:**
- Creates partnership proposal with revenue sharing terms
- Stores proposal in database (use `capture_strategies` table with strategy_type='partnership')
- Calculates revenue sharing percentage based on entity value
- Returns partnership proposal object

**Pattern:** Follow existing service patterns in `src/lib/`

**Verify:**
- File exists: `src/lib/partnershipEngine.ts`
- Line count ≤50
- Function exports correctly
- Compiles without errors

---

## AGENT 7: Disruption Engine + Revenue Capture API

**TASK 1:** Create `src/lib/disruptionEngine.ts` (≤50 lines)

**Function signature:**
```typescript
export async function executeDisruption(
  entityId: string,
  targetStream: string
): Promise<{
  disruptionPlan: object
  expectedMarketCapture: number
  expectedRevenueCapture: number
  implementationSteps: string[]
}>
```

**Requirements:**
- Analyzes target revenue stream
- Creates disruption plan: competitive pricing, service undercutting, feature matching
- Calculates expected market share capture
- Generates implementation steps array
- Stores in `capture_strategies` table with strategy_type='disruption'

**TASK 2:** Create `src/app/api/revenue/capture/route.ts` (≤50 lines)

**Endpoint:** `POST /api/revenue/capture`

**Request body:**
```json
{
  "entityId": "string",
  "strategyType": "partnership" | "disruption" | "forced",
  "strategy": { /* strategy-specific data */ }
}
```

**Requirements:**
- Routes to appropriate engine: `partnershipEngine.ts`, `disruptionEngine.ts`, or `forcedIntegrationEngine.ts`
- Executes strategy and returns execution plan
- Error handling
- Returns status and execution details

**Pattern:** Use switch statement to route by strategyType

**Verify:**
- Files exist: `src/lib/disruptionEngine.ts`, `src/app/api/revenue/capture/route.ts`
- Line counts ≤50 each
- API routes correctly to engines

---

## AGENT 8: Forced Integration Engine

**TASK:** Create `src/lib/forcedIntegrationEngine.ts` (≤50 lines)

**Function signature:**
```typescript
export async function forceIntegration(
  entityId: string,
  integrationType: 'essential_feature' | 'data_dependency' | 'network_effects'
): Promise<{
  integrationPlan: object
  dependencyStrategy: object
  lockInLevel: 'low' | 'medium' | 'high'
  expectedAdoptionRate: number
}>
```

**Requirements:**
- Creates forced integration strategy by making service essential
- Generates dependency strategy based on integration type
- Calculates lock-in level and expected adoption rate
- Stores in `capture_strategies` table with strategy_type='forced'
- Returns integration plan

**Verify:**
- File exists: `src/lib/forcedIntegrationEngine.ts`
- Line count ≤50
- Compiles and exports correctly

---

## AGENT 9: Psychological Persuasion + Campaigns API

**TASK 1:** Create `src/lib/psychologicalPersuasion.ts` (≤50 lines)

**Function signature:**
```typescript
export async function generatePersuasion(
  entityId: string,
  messageType: 'fomo' | 'fear' | 'social'
): Promise<{
  message: string
  triggers: string[]
  psychologicalProfile: object
  expectedResponseRate: number
}>
```

**Requirements:**
- Generates psychologically persuasive messaging
- Routes to appropriate generator based on messageType
- Returns message with psychological triggers
- Estimates expected response rate

**Pattern:** Follow `src/neo-brain/psychology/emotionalResonance.ts` structure

**TASK 2:** Create `src/app/api/campaigns/create/route.ts` (≤50 lines)

**Endpoint:** `POST /api/campaigns/create`

**Request body:**
```json
{
  "targets": ["entityId1", "entityId2"],
  "campaignType": "partnership" | "disruption" | "integration",
  "messageType": "fomo" | "fear" | "social"
}
```

**Requirements:**
- Calls `outreachCampaign.ts` → `createOutreachCampaign()`
- Uses `psychologicalPersuasion.ts` for message generation
- Creates campaign record in database
- Returns campaign with personalized messages

**Verify:**
- Files exist: `src/lib/psychologicalPersuasion.ts`, `src/app/api/campaigns/create/route.ts`
- Line counts ≤50 each
- API integrates with outreach and psychology modules

---

## AGENT 10: FOMO Generator + Leads Generate API

**TASK 1:** Create `src/lib/fomoGenerator.ts` (≤50 lines)

**Function signature:**
```typescript
export async function generateFOMO(
  entityId: string,
  context: { scarcityLevel?: number, exclusivity?: boolean, timePressure?: number }
): Promise<{
  message: string
  urgencyTriggers: string[]
  scarcityFactors: string[]
  expectedConversionRate: number
}>
```

**Requirements:**
- Generates FOMO (Fear of Missing Out) messaging
- Creates urgency triggers: scarcity, exclusivity, time pressure
- Customizes message based on entity context
- Returns FOMO message with conversion estimate

**Pattern:** Similar to `src/lib/psychologicalPersuasion.ts` but FOMO-focused

**TASK 2:** Create `src/app/api/leads/generate/route.ts` (≤50 lines)

**Endpoint:** `POST /api/leads/generate`

**Request body:**
```json
{
  "criteria": {
    "minRevenue": 100000,
    "marketInfluence": "high",
    "vulnerabilityScore": 0.7
  }
}
```

**Requirements:**
- Calls `leadTargeting.ts` → `identifyHighValueTargets()`
- Calls `contactDiscovery.ts` → `discoverContacts()` for each target
- Returns array of high-value leads with contact information
- Error handling

**Pattern:** Follow existing `src/app/api/lead-generation/route.ts` structure

**Verify:**
- Files exist: `src/lib/fomoGenerator.ts`, `src/app/api/leads/generate/route.ts`
- Line counts ≤50 each
- API returns leads with contacts

---

## AGENT 11: Fear-Based Messaging + Leads Outreach API

**TASK 1:** Create `src/lib/fearBasedMessaging.ts` (≤50 lines)

**Function signature:**
```typescript
export async function createFearCampaign(
  entityId: string,
  fearType: 'competitor_advantage' | 'market_exclusion' | 'financial_loss' | 'missed_opportunity'
): Promise<{
  campaignId: string
  messages: { subject: string, body: string, triggers: string[] }[]
  fearIntensity: 'low' | 'medium' | 'high'
  expectedResponseRate: number
}>
```

**Requirements:**
- Creates fear-based messaging campaign
- Generates messages based on fear type
- Calculates fear intensity and expected response
- Stores campaign in `psychological_campaigns` table

**TASK 2:** Create `src/app/api/leads/outreach/route.ts` (≤50 lines criterion)

**Endpoint:** `POST /api/leads/outreach`

**Request body:**
```json
{
  "campaignId": "string",
  "targets": ["entityId1", "entityId2"]
}
```

**Requirements:**
- Calls `outreachCampaign.ts` → `createOutreachCampaign()`
- Sends outreach messages to targets
- Tracks campaign status
- Returns outreach status and sent messages

**Pattern:** Follow `src/app/admin-secret-xyz123/outreach/OutreachOperations.ts` structure

**Verify:**
- Files exist: `src/lib/fearBasedMessaging.ts`, `src/app/api/leads/outreach/route.ts`
- Line counts ≤50 each
- API sends outreach and tracks status

---

## AGENT 12: Social Proof Engine + Database Migration

**TASK 1:** Create `src/lib/socialProofEngine.ts` (≤50 lines)

**Function signature:**
```typescript
export async function generateSocialProof(
  entityId: string,
  proofType: 'user_count' | 'competitor_adoption' | 'success_stories' | 'market_dominance'
): Promise<{
  proofMessage: string
  statistics: object
  testimonials?: string[]
  credibilityScore: number
}>
```

**Requirements:**
- Generates social proof messaging based on proof type
- Pulls statistics from database (user counts, adoption rates)
- Returns proof message with credibility score
- Customizes based on entity context

**Pattern:** Follow `src/neo-brain/social/viralEngine.ts` structure

**TASK 2:** Create `supabase/migrations/competitive_intelligence.sql`

**Requirements:**
- Create `competitive_entities` table:
  ```sql
  CREATE TABLE IF NOT EXISTS competitive_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id TEXT NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('business', 'person', 'organization')),
    name TEXT,
    description TEXT,
    market_position TEXT,
    influence_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- Create `financial_profiles` table:
  ```sql
  CREATE TABLE IF NOT EXISTS financial_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id TEXT NOT NULL,
    estimated_revenue NUMERIC,
    estimated_profit NUMERIC,
    revenue_streams JSONB,
    vulnerability_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- Create indexes:
  ```sql
  CREATE INDEX idx_competitive_entities_id ON competitive_entities(entity_id);
  CREATE INDEX idx_financial_profiles_id ON financial_profiles(entity_id);
  ```

**Pattern:** Follow `supabase/migrations/user_tracking.sql` structure

**Verify:**
- Files exist: `src/lib/socialProofEngine.ts`, `supabase/migrations/competitive_intelligence.sql`
- Migration can be applied to database
- Tables created successfully

---

## VERIFICATION CHECKLIST (After Each Agent Completes)

1. **File exists** - Check file path
2. **Line count** - Run: `wc -l [filepath]` - Must be ≤50
3. **TypeScript compiles** - Run: `npx tsc --noEmit` - No errors
4. **Exports function** - Function properly exported
5. **Imports correct** - Uses existing Supabase/client utilities
6. **Pattern matches** - Follows referenced code patterns
7. **API works** (if applicable) - Can call endpoint without errors

---

## DEPENDENCIES

- Agent 12's migration must run FIRST before Agents 4-8 can query tables
- Agent 9's psychologicalPersuasion depends on Agents 10-12 engines
- API routes depend on their corresponding lib files

---

## PRIORITY ORDER

1. **Agent 12** - Database migration (blocks others)
2. **Agents 4-8** - Core revenue capture (can work in parallel after migration)
3. **Agents 9-11** - Psychology and leads (can work in parallel)

---

**STATUS: READY FOR IMPLEMENTATION**

