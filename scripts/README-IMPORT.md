# 🚀 Data Import Guide

## Step 1: Apply Database Schema

Go to your Supabase Dashboard:
1. Open **SQL Editor**
2. Click **New Query**
3. Copy/paste entire file: `supabase/migrations/20251106001500_business_verification.sql`
4. Click **RUN**

✅ This creates all 8 tables with auto-matching and ranking functions

---

## Step 2: Prepare Your CSV Files

### **Businesses CSV Format** (30K businesses)
```csv
business_name,business_type,contact_email,contact_phone,address,city,state,zip,website,facebook_url,instagram_handle,services,specialties,source
Smith Stallion Service,stallion_breeder,info@smithstallions.com,555-0123,"123 Main St",Dallas,TX,75001,https://smithstallions.com,smithstallions,@smithstallions,"breeding,training","quarter horse,appaloosa",csv_import
```

**Required columns:**
- `business_name` (required)

**Optional columns:**
- `business_type` (stallion_breeder, trainer, vet, farrier, transport, etc.)
- `contact_email`
- `contact_phone`
- `address`, `city`, `state`, `zip`
- `website`, `facebook_url`, `instagram_handle`
- `services` (comma-separated)
- `specialties` (comma-separated)
- `source`

---

### **Users + Horses CSV Format** (200K users)
```csv
full_name,email,phone,user_type,location_city,location_state,location_zip,interests,horse_name,horse_breed,horse_color,horse_gender,horse_year_born,horse_registration_number,horse_registration_org,source
John Smith,john@email.com,555-0100,owner,Austin,TX,78701,"breeding,racing",Spirit,Quarter Horse,Sorrel,gelding,2018,123456,AQHA,csv_import
```

**Required columns:**
- `full_name` (required)
- `email` (required)

**Optional columns:**
- `phone`
- `user_type` (owner, trainer, breeder, buyer, etc.)
- `location_city`, `location_state`, `location_zip`
- `interests` (comma-separated)
- `horse_name`, `horse_breed`, `horse_color`, `horse_gender`
- `horse_year_born` (integer)
- `horse_registration_number`, `horse_registration_org`
- `source`

---

## Step 3: Run Import Scripts

### Install dependencies:
```bash
cd /Users/kinnonpeck/Desktop/horse-ai
npm install csv-parser
```

### Import Businesses:
```bash
npx ts-node scripts/import-businesses.ts path/to/businesses.csv
```

### Import Users + Horses:
```bash
npx ts-node scripts/import-users-horses.ts path/to/users.csv
```

---

## Step 4: Verify Data

Check Supabase Dashboard → **Table Editor**:

```sql
-- Count businesses
SELECT COUNT(*) FROM businesses;

-- Count users
SELECT COUNT(*) FROM users;

-- Count horses
SELECT COUNT(*) FROM horses;

-- Check auto-matching (should happen immediately)
SELECT COUNT(*) FROM uploaded_contacts WHERE matched_user_id IS NOT NULL;
```

---

## Step 5: Send Verification Emails

Once data is imported, you can:

1. **Send verification emails to businesses:**
```sql
SELECT 
  id,
  business_name,
  contact_email,
  verification_token
FROM businesses
WHERE verified = false
  AND contact_email IS NOT NULL
LIMIT 1000; -- Send in batches
```

2. **Send verification emails to users (about their horses):**
```sql
SELECT 
  u.id,
  u.full_name,
  u.email,
  u.verification_token,
  h.horse_name,
  h.breed,
  h.year_born
FROM users u
LEFT JOIN horses h ON h.owner_user_id = u.id
WHERE u.email_verified = false
  AND u.email IS NOT NULL
LIMIT 1000; -- Send in batches
```

---

## Troubleshooting

### "Missing Supabase credentials"
Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### "Duplicate email" errors
The script will skip duplicates automatically. Check for:
```sql
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

### Batch insert failures
The script will retry individual inserts if batch fails. Check console for specific errors.

---

## Next Steps

After data is imported:

1. **Build verification landing page** (`/verify/[token]`)
2. **Send verification email campaigns**
3. **Integrate AI chat** for the conversation flow
4. **Build business dashboard** for rankings
5. **Build CRM upload UI** for businesses

🚀 **You're building a $1B company!**

