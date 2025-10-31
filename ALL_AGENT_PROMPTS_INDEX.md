# ALL AGENT PROMPTS - COPY-PASTE READY

## Quick Access Index

### CRITICAL PRIORITY (Do First)
- **AGENT_4_PROMPT.md** - Fix PILLAR 8 (missing 10 tables) ⚠️ CRITICAL
- **AGENT_12_PROMPT.md** - Fix PILLAR 32 (missing 16 tables) ⚠️ CRITICAL

### HIGH PRIORITY
- **AGENT_1_PROMPT.md** - Pillars 1-3 (Horses, Users, Providers)
- **AGENT_2_PROMPT.md** - Pillars 4-5 (Transactions, Health)
- **AGENT_6_PROMPT.md** - Pillars 12-13 (Security, Multi-AI)
- **AGENT_7_PROMPT.md** - Pillars 14-15 (Vision/Sound, Breeding)
- **AGENT_9_PROMPT.md** - Pillars 18-19 (Competitions, Financial)
- **AGENT_10_PROMPT.md** - Pillars 20-21 (Feedback, Partnerships)

### STANDARD PRIORITY
- **AGENT_3_PROMPT.md** - Pillar 6 (Social & Community)
- **AGENT_5_PROMPT.md** - Pillars 10-11 (Viral Marketing, Scaling)
- **AGENT_8_PROMPT.md** - Pillars 16-17 (Training, Feed)
- **AGENT_11_PROMPT.md** - Pillars 23-24 (Token Management, Testing)

### SPECIAL TASK
- **AGENT_1_SCHEMA_VERSION_TASK.md** - Create schema_versions table

---

## Usage Instructions

1. Open the prompt file for the agent you want to assign
2. Copy the entire content (between the triple backticks)
3. Paste directly to the agent
4. Agent will execute and report back

---

## Completion Checklist

After all agents complete:
- [ ] All 380 tables exist
- [ ] All foreign keys have indexes
- [ ] All tables have metadata JSONB
- [ ] All tables have extended_data JSONB
- [ ] All tables have schema_version INTEGER
- [ ] schema_versions table created
- [ ] Run Agent 13 re-audit

---

**Total Estimated Time:** 18-20 hours across all agents
**Critical Path:** Agent 4 → Agent 12 → All others

