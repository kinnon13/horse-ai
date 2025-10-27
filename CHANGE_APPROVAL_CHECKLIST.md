# 🔒 CHANGE APPROVAL CHECKLIST

## ⚠️ BEFORE MAKING ANY CHANGES

### **STEP 1: CHECK PROTECTION STATUS**
- [ ] Is this a **PROTECTED FILE**? (See GUARDRAILS.md)
- [ ] Is this a **WORKING FEATURE**? 
- [ ] Does user want this changed?

### **STEP 2: ASK PERMISSION**
```
🚨 PERMISSION REQUEST:
File: [filename]
Change: [what I want to do]
Reason: [why it's needed]
Impact: [what might break]

Can I proceed? (YES/NO)
```

### **STEP 3: SAFETY CHECKS**
- [ ] **Git status clean?** (`git status`)
- [ ] **Backup created?** (`git commit` or `git stash`)
- [ ] **Test plan ready?**
- [ ] **Rollback plan ready?**

## ✅ SAFE CHANGES (No Permission Needed)

### **Documentation:**
- [ ] README updates
- [ ] Code comments
- [ ] GUARDRAILS.md updates

### **New Features:**
- [ ] Admin panel improvements
- [ ] New API endpoints
- [ ] Additional pages

### **Bug Fixes:**
- [ ] Console errors
- [ ] TypeScript errors
- [ ] Linting issues

## 🚨 PROTECTED CHANGES (Permission Required)

### **UI/UX Changes:**
- [ ] Chat interface modifications
- [ ] Dashboard layout changes
- [ ] Pricing page updates
- [ ] Navigation changes

### **Core Functionality:**
- [ ] Authentication system
- [ ] API integrations (Grok, Supabase)
- [ ] Database schema
- [ ] Environment variables

### **Working Features:**
- [ ] Any file marked as "WORKING" in GUARDRAILS.md
- [ ] Features user specifically requested
- [ ] Recently fixed issues

## 📋 TESTING CHECKLIST

### **Before Committing:**
- [ ] **Dev server runs** (`npm run dev`)
- [ ] **No build errors** (`npm run build`)
- [ ] **No TypeScript errors**
- [ ] **No linting errors**
- [ ] **Existing features work**

### **After Committing:**
- [ ] **Git commit message** describes changes
- [ ] **Working features** still functional
- [ ] **User can test** the changes
- [ ] **Rollback ready** if needed

## 🔄 ROLLBACK PROCEDURES

### **Quick Rollback:**
```bash
# Undo last commit
git reset --hard HEAD~1

# Undo specific file
git checkout HEAD -- src/app/chat/page.tsx

# Undo all changes
git reset --hard HEAD
```

### **Emergency Recovery:**
```bash
# Stop everything
pkill -f "next dev"

# Reset to working state
git reset --hard HEAD

# Clear cache
rm -rf .next

# Restart
npm run dev
```

## 📞 ESCALATION TRIGGERS

**STOP IMMEDIATELY if:**
- [ ] User says "don't change that"
- [ ] Working feature breaks
- [ ] UI looks different than expected
- [ ] Authentication stops working
- [ ] API calls fail
- [ ] Build errors occur
- [ ] User expresses frustration

**Then:**
1. **STOP** all changes
2. **ROLLBACK** immediately  
3. **EXPLAIN** what went wrong
4. **ASK** for guidance

---

**Remember:** It's better to ask permission than break working code!
