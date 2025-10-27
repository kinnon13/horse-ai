# 🔄 ROLLBACK PROCEDURES

## 🚨 EMERGENCY ROLLBACK (Something Broke)

### **IMMEDIATE ACTIONS:**
```bash
# 1. Stop everything
pkill -f "next dev"

# 2. Reset to last working commit
git reset --hard HEAD

# 3. Clear Next.js cache
rm -rf .next

# 4. Restart dev server
npm run dev

# 5. Test that it works
curl -s http://localhost:3000 | head -1
```

### **VERIFY RECOVERY:**
- [ ] Dev server starts without errors
- [ ] Homepage loads (`http://localhost:3000`)
- [ ] Chat works (`http://localhost:3000/chat`)
- [ ] Dashboard loads (`http://localhost:3000/dashboard`)
- [ ] No console errors

## 🔍 DIAGNOSTIC ROLLBACKS

### **Check What Changed:**
```bash
# See what files changed
git status

# See what was modified
git diff

# See commit history
git log --oneline -5

# See specific file changes
git diff HEAD~1 src/app/chat/page.tsx
```

### **Rollback Specific File:**
```bash
# Undo changes to specific file
git checkout HEAD -- src/app/chat/page.tsx

# Undo changes to multiple files
git checkout HEAD -- src/app/chat/page.tsx src/app/dashboard/page.tsx

# Undo all changes (unstaged)
git checkout -- .
```

### **Rollback to Specific Commit:**
```bash
# See commit history
git log --oneline

# Rollback to specific commit
git reset --hard <commit-hash>

# Example: Rollback to initial commit
git reset --hard dbec0fb
```

## 📋 STEP-BY-STEP ROLLBACK

### **Scenario 1: UI Broke**
```bash
# 1. Check what changed
git status
git diff src/app/chat/page.tsx

# 2. Rollback UI files
git checkout HEAD -- src/app/chat/page.tsx
git checkout HEAD -- src/app/dashboard/page.tsx

# 3. Restart and test
pkill -f "next dev"
npm run dev
```

### **Scenario 2: API Broke**
```bash
# 1. Check API changes
git diff src/app/api/

# 2. Rollback API files
git checkout HEAD -- src/app/api/chat/route.ts

# 3. Check environment
cat .env.local | grep GROK

# 4. Restart and test
pkill -f "next dev"
npm run dev
```

### **Scenario 3: Authentication Broke**
```bash
# 1. Check auth changes
git diff src/lib/supabase.ts
git diff src/components/AuthProvider.tsx

# 2. Rollback auth files
git checkout HEAD -- src/lib/supabase.ts
git checkout HEAD -- src/components/AuthProvider.tsx

# 3. Check environment
cat .env.local | grep SUPABASE

# 4. Restart and test
pkill -f "next dev"
npm run dev
```

## 🛠️ ADVANCED ROLLBACK

### **Create Backup Branch:**
```bash
# Before making changes
git checkout -b backup-$(date +%Y%m%d-%H%M%S)
git add .
git commit -m "Backup before changes"

# Switch back to main
git checkout main
```

### **Stash Changes:**
```bash
# Save current changes without committing
git stash push -m "Work in progress"

# Apply stash later
git stash pop

# List stashes
git stash list
```

### **Cherry-pick Specific Commits:**
```bash
# See commit history
git log --oneline

# Apply specific commit
git cherry-pick <commit-hash>
```

## 🔧 TROUBLESHOOTING

### **Common Issues:**

#### **"Working tree is dirty"**
```bash
# Stash changes
git stash

# Or discard changes
git checkout -- .
```

#### **"Branch is ahead"**
```bash
# Reset to remote
git reset --hard origin/main

# Or pull latest
git pull origin main
```

#### **"File not found"**
```bash
# Check if file exists
ls -la src/app/chat/page.tsx

# Restore from git
git checkout HEAD -- src/app/chat/page.tsx
```

### **Nuclear Option (Complete Reset):**
```bash
# WARNING: This deletes ALL changes
git reset --hard HEAD
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

## 📊 ROLLBACK CHECKLIST

### **Before Rollback:**
- [ ] **Identify** what broke
- [ ] **Document** the issue
- [ ] **Check** git status
- [ ] **Backup** current state (git stash)

### **During Rollback:**
- [ ] **Stop** dev server
- [ ] **Reset** git state
- [ ] **Clear** cache
- [ ] **Restart** dev server

### **After Rollback:**
- [ ] **Test** all pages load
- [ ] **Verify** features work
- [ ] **Check** no console errors
- [ ] **Document** what was rolled back

## 🎯 RECOVERY VERIFICATION

### **Test These URLs:**
- ✅ `http://localhost:3000` - Homepage
- ✅ `http://localhost:3000/chat` - Chat (Grok-style)
- ✅ `http://localhost:3000/dashboard` - Dashboard
- ✅ `http://localhost:3000/pricing` - Pricing
- ✅ `http://localhost:3000/upload` - Upload
- ✅ `http://localhost:3000/admin-secret-xyz123` - Admin

### **Check These Features:**
- ✅ **Authentication** works
- ✅ **Grok API** responds
- ✅ **UI** looks correct
- ✅ **No errors** in console
- ✅ **No build** errors

---

**Remember:** Rollback first, ask questions later!
