# 🚀 HORSEGPT - QUICK START GUIDE

**For complete beginners - step-by-step setup in plain English**

---

## 🎯 GOAL

Get HorseGPT running on your computer in 30 minutes.

---

## ✅ WHAT YOU NEED

1. **Computer** - Mac or PC
2. **Supabase Account** - Free at https://supabase.com
3. **Stripe Account** - Free at https://stripe.com
4. **AI API Keys** - At least Grok (https://x.ai)
5. **Terminal** - Already on your computer

---

## 📋 STEP-BY-STEP SETUP

### **STEP 1: Run Database Migrations (10 minutes)**

**What this does:** Creates all the tables where HorseGPT stores data.

1. Open https://supabase.com
2. Sign in to your account
3. Click on your HorseGPT project
4. Click "SQL Editor" in the left sidebar
5. Click "New Query"
6. Open the file `RUN_THIS_IN_SUPABASE.sql` from your computer
7. Copy ALL the text
8. Paste into Supabase SQL Editor
9. Click "Run" button (bottom right)
10. Wait for "Success" message

**Then run these files ONE AT A TIME:**

File 1: `supabase/migrations/20250128000001_pillars_1_11.sql`
- Copy entire file → Paste in SQL Editor → Run

File 2: `supabase/migrations/20250128000002_pillars_12_22.sql`
- Copy entire file → Paste in SQL Editor → Run

File 3: `supabase/migrations/20250128000003_pillars_23_32.sql`
- Copy entire file → Paste in SQL Editor → Run

**Done!** You now have ~400 database tables.

---

### **STEP 2: Add Your API Keys (5 minutes)**

**What this does:** Connects HorseGPT to AI services and payment processing.

1. Open the file `.env.local` in the `horse-ai` folder
2. Replace the placeholder values with your real keys:

```bash
# Get these from Supabase dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_long_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Get from https://x.ai (required)
GROK_API_KEY=your_grok_key_here

# Get from https://openai.com (optional)
OPENAI_API_KEY=your_openai_key_here

# Get from https://stripe.com → Developers → API Keys
STRIPE_SECRET_KEY=sk_test_your_key_here

# Get from Stripe → Products → Create prices, copy price IDs
STRIPE_STANDARD_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_yyyyyyyyyyyyy

# Your website URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Save the file

---

### **STEP 3: Start the Main App (5 minutes)**

**What this does:** Launches the user-facing HorseGPT website.

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to the horse-ai folder:
   ```bash
   cd /Users/kinnonpeck/Desktop/horse-ai
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Wait for "Ready" message
6. Open browser: http://localhost:3000

**✅ You should see HorseGPT homepage!**

---

### **STEP 4: Start the Admin Dashboard (5 minutes)**

**What this does:** Launches the admin control panel.

1. Open a NEW Terminal window (keep first one running)
2. Navigate to admin-app folder:
   ```bash
   cd /Users/kinnonpeck/Desktop/horse-ai/admin-app
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start admin app:
   ```bash
   npm run dev
   ```
5. Wait for "Ready" message
6. Open browser: http://localhost:3001

**✅ You should see the COMMAND CENTER!**

---

### **STEP 5: Test Everything (5 minutes)**

**Main App (Port 3000):**

1. Go to http://localhost:3000
2. Click "Try Free" → Should see chat interface
3. Type "What is colic?" → Should get AI response
4. Click "My Horses" → Should see horses page
5. Click "Competitions" → Should see competitions
6. Click "Pricing" → Should see 3 pricing tiers

**Admin Dashboard (Port 3001):**

1. Go to http://localhost:3001
2. Should see metrics dashboard
3. Click "Oracle AI" → Opens strategic advisor
4. Click "Research Control" → Shows knowledge gaps
5. Click "Theme Editor" → Edit colors live
6. Click "KILL SWITCH" → Emergency controls

---

## ✅ YOU'RE DONE!

**Both apps are now running:**
- **User App:** http://localhost:3000
- **Admin App:** http://localhost:3001

---

## 🐛 COMMON ISSUES

### **"npm: command not found"**
- **Fix:** Install Node.js from https://nodejs.org

### **"Port 3000 already in use"**
- **Fix:** Close other apps using port 3000, or change port in `package.json`

### **Chat says "demo mode"**
- **Fix:** Add your `GROK_API_KEY` to `.env.local`

### **"Failed to connect to Supabase"**
- **Fix:** Check `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`

### **Stripe checkout fails**
- **Fix:** 
  1. Go to Stripe dashboard
  2. Create products ($9.99 Standard, $19.99 Pro)
  3. Copy price IDs to `.env.local`

---

## 📞 NEED HELP?

**Things are NOT working?**

1. Check Terminal for error messages
2. Read error message carefully
3. Google the error message
4. Check Supabase dashboard → Logs
5. Check browser console (F12) for errors

**Still stuck?**

Take a screenshot of the error and check:
- Is database migration complete? (Step 1)
- Are API keys correct? (Step 2)
- Is `npm install` complete? (Step 3/4)

---

## 🚀 NEXT STEPS

Once everything is working locally:

1. **Test all features**
   - Chat with AI
   - Add a horse
   - Register for competition
   - Try breeding recommendations
   - Test subscription flow

2. **Deploy to production**
   - Use Vercel for main app
   - Use Vercel for admin app
   - Update `NEXT_PUBLIC_APP_URL` to your domain

3. **Go live**
   - Import your 80K leads
   - Send email blast
   - Launch at NFR

---

## 🎉 CONGRATULATIONS!

You just launched an AI-powered platform from scratch.

**No coding experience needed - you did it!** 🐴🚀

