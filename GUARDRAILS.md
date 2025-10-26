# 🛡️ HORSE.AI GUARDRAILS & PROTECTION RULES

## 🚨 CRITICAL: DO NOT TOUCH WITHOUT EXPLICIT PERMISSION

### **PROTECTED WORKING FEATURES:**
- ✅ **Grok-style centered chat UI** (`/chat` page)
- ✅ **Working Supabase authentication** 
- ✅ **Real Grok API integration** (`/api/chat`)
- ✅ **Pricing structure** (Free → $9.99 Mid → $19.99 Pro)
- ✅ **Dashboard Grok-style layout** (`/dashboard`)
- ✅ **Upload functionality** (`/upload`)
- ✅ **Environment variables** (`.env.local`)

### **PROTECTED FILES:**
- `src/app/chat/page.tsx` - Chat UI (Grok-style)
- `src/app/dashboard/page.tsx` - Dashboard layout
- `src/app/api/chat/route.ts` - Grok API integration
- `src/lib/supabase.ts` - Authentication
- `.env.local` - API keys and config
- `supabase-schema.sql` - Database schema

## 🔒 CHANGE APPROVAL PROCESS

### **STEP 1: ASK PERMISSION**
Before ANY change to working code:
1. **Ask**: "Can I modify [specific file/feature]?"
2. **Explain**: What I'm changing and why
3. **Wait**: For explicit "YES" approval
4. **Confirm**: The exact scope of changes

### **STEP 2: SAFE CHANGES**
These are OK without asking:
- ✅ **Bug fixes** (with explanation)
- ✅ **New features** (with approval)
- ✅ **Admin panel** improvements
- ✅ **Documentation** updates
- ✅ **Performance** optimizations

### **STEP 3: TESTING**
- Test changes in isolation
- Verify existing features still work
- Document what was changed

## 📋 ROLLBACK PROCEDURES

### **Git Commands:**
```bash
# Check what changed
git status
git diff

# Rollback specific file
git checkout HEAD -- src/app/chat/page.tsx

# Rollback all changes
git reset --hard HEAD

# See commit history
git log --oneline
```

### **Emergency Recovery:**
1. **Stop dev server**: `pkill -f "next dev"`
2. **Reset to last working state**: `git reset --hard HEAD`
3. **Clear cache**: `rm -rf .next`
4. **Restart**: `npm run dev`

## 🎯 CURRENT WORKING STATE

### **What's Working:**
- ✅ Chat with real Grok AI responses
- ✅ Supabase authentication
- ✅ Grok-style centered UI
- ✅ Pricing pages (3 tiers)
- ✅ Dashboard with sidebar
- ✅ Upload functionality
- ✅ Admin page at `/admin-secret-xyz123`

### **What Needs Work:**
- 🔧 Admin authentication
- 🔧 Admin features (user management, analytics)
- 🔧 Chat accessibility without auth
- 🔧 Mobile responsiveness improvements

## ⚠️ WARNING SIGNS TO STOP

**STOP IMMEDIATELY if:**
- User says "don't change that"
- Working feature breaks
- UI looks different than expected
- Authentication stops working
- API calls fail
- Build errors occur

## 📞 ESCALATION

**If something breaks:**
1. **STOP** all changes
2. **ROLLBACK** immediately
3. **EXPLAIN** what went wrong
4. **ASK** for guidance before proceeding

---

**Last Updated:** $(date)
**Protected By:** AI Assistant Guardrails
**Status:** ACTIVE PROTECTION
