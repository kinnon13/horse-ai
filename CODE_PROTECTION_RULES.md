# 🛡️ CODE PROTECTION RULES

## 🚨 CRITICAL PROTECTION RULES

### **RULE 1: NEVER MODIFY WITHOUT PERMISSION**
These files are **PROTECTED** and require explicit user approval:

```
src/app/chat/page.tsx          - Grok-style chat UI
src/app/dashboard/page.tsx      - Dashboard layout  
src/app/api/chat/route.ts      - Grok API integration
src/lib/supabase.ts            - Authentication
.env.local                     - API keys and config
supabase-schema.sql           - Database schema
```

### **RULE 2: PRESERVE WORKING UI**
- **Chat UI**: Must remain Grok-style centered
- **Dashboard**: Must keep sidebar layout
- **Pricing**: Must show 3 tiers (Free → $9.99 → $19.99)
- **Colors**: Maintain existing color scheme
- **Layout**: Don't change working responsive design

### **RULE 3: PROTECT API INTEGRATIONS**
- **Grok API**: Working integration, don't modify
- **Supabase**: Authentication working, don't break
- **Environment**: Keys are configured, don't change

### **RULE 4: TEST BEFORE COMMIT**
```bash
# Always run these before committing:
npm run dev          # Check dev server works
npm run build        # Check build succeeds
git status          # Check what's changing
```

## ✅ SAFE MODIFICATION ZONES

### **Admin Panel** (`src/app/admin-secret-xyz123/`)
- ✅ Add authentication
- ✅ Add user management
- ✅ Add analytics dashboard
- ✅ Add subscription controls

### **New Features**
- ✅ Additional API endpoints
- ✅ New pages (not modifying existing)
- ✅ Utility functions
- ✅ Documentation

### **Bug Fixes**
- ✅ TypeScript errors
- ✅ Console warnings
- ✅ Linting issues
- ✅ Performance improvements

## 🚫 FORBIDDEN ACTIONS

### **NEVER DO THESE:**
- ❌ Change working chat UI without permission
- ❌ Modify authentication system
- ❌ Alter API integrations
- ❌ Change pricing structure
- ❌ Break responsive design
- ❌ Modify environment variables
- ❌ Change database schema

### **NEVER ASSUME:**
- ❌ "User will like this change"
- ❌ "This is just a small fix"
- ❌ "It's just styling"
- ❌ "It won't break anything"

## 🔍 PRE-CHANGE VALIDATION

### **Checklist Before ANY Change:**
```bash
# 1. Check git status
git status

# 2. Check if file is protected
grep -r "PROTECTED" GUARDRAILS.md

# 3. Test current state
npm run dev

# 4. Ask permission if needed
echo "🚨 PERMISSION REQUEST: [details]"
```

### **Validation Questions:**
- [ ] Is this file in the PROTECTED list?
- [ ] Is this a working feature?
- [ ] Did user ask for this change?
- [ ] Will this break existing functionality?
- [ ] Do I have explicit permission?

## 📋 EMERGENCY PROCEDURES

### **If Something Breaks:**
1. **STOP** immediately
2. **ROLLBACK** to last working state:
   ```bash
   git reset --hard HEAD
   rm -rf .next
   npm run dev
   ```
3. **REPORT** what went wrong
4. **WAIT** for user guidance

### **Recovery Commands:**
```bash
# Full reset to working state
git reset --hard HEAD
pkill -f "next dev"
rm -rf .next
npm run dev

# Check what's working
curl -s http://localhost:3000 | head -1
```

## 🎯 PROTECTION STATUS

### **Currently Protected:**
- ✅ Chat UI (Grok-style)
- ✅ Dashboard layout
- ✅ Authentication system
- ✅ Grok API integration
- ✅ Pricing structure
- ✅ Upload functionality

### **Safe to Modify:**
- ✅ Admin panel features
- ✅ Documentation
- ✅ New pages
- ✅ Bug fixes
- ✅ Performance improvements

---

**Remember:** When in doubt, ASK PERMISSION!
