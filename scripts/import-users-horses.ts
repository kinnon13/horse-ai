#!/usr/bin/env ts-node
/**
 * Import 200K Users + Horses from CSV
 * 
 * Usage:
 *   ts-node scripts/import-users-horses.ts path/to/users.csv
 * 
 * CSV Format:
 *   full_name,email,phone,user_type,location_city,location_state,location_zip,interests,horse_name,horse_breed,horse_color,horse_gender,horse_year_born,horse_registration_number,horse_registration_org,source
 */

import * as fs from 'fs';
import * as csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface UserHorseRow {
  full_name: string;
  email: string;
  phone?: string;
  user_type?: string;
  location_city?: string;
  location_state?: string;
  location_zip?: string;
  interests?: string; // comma-separated
  horse_name?: string;
  horse_breed?: string;
  horse_color?: string;
  horse_gender?: string;
  horse_year_born?: string;
  horse_registration_number?: string;
  horse_registration_org?: string;
  source?: string;
}

async function importUsersAndHorses(csvPath: string) {
  console.log('🚀 Starting user + horse import from:', csvPath);
  
  const users: any[] = [];
  const horses: any[] = [];
  const userHorseMap = new Map<string, string>(); // email -> user_id for horse linking
  
  let rowCount = 0;
  let errorCount = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: UserHorseRow) => {
        rowCount++;
        
        try {
          const email = row.email?.trim()?.toLowerCase();
          
          if (!email || !row.full_name) {
            console.warn(`⚠️  Row ${rowCount}: Missing required fields (name or email)`);
            errorCount++;
            return;
          }

          // Generate verification token
          const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          
          // Create user record
          const user = {
            full_name: row.full_name.trim(),
            email: email,
            phone: row.phone?.trim() || null,
            user_type: row.user_type?.trim()?.toLowerCase() || 'owner',
            location_city: row.location_city?.trim() || null,
            location_state: row.location_state?.trim()?.toUpperCase() || null,
            location_zip: row.location_zip?.trim() || null,
            interests: row.interests ? row.interests.split(',').map(s => s.trim()) : [],
            owns_business: false,
            is_subscribed: false,
            subscription_tier: 'free',
            verification_token: token,
            email_verified: false,
            total_searches: 0,
            source: row.source?.trim() || 'csv_import',
            imported_at: new Date().toISOString(),
          };
          
          users.push(user);

          // If horse info exists, prepare horse record (will link after user insert)
          if (row.horse_name?.trim()) {
            const horse = {
              email: email, // Temporary - will replace with owner_user_id after user insert
              horse_name: row.horse_name.trim(),
              breed: row.horse_breed?.trim() || null,
              color: row.horse_color?.trim() || null,
              gender: row.horse_gender?.trim()?.toLowerCase() || null,
              year_born: row.horse_year_born ? parseInt(row.horse_year_born) : null,
              registration_number: row.horse_registration_number?.trim() || null,
              registration_org: row.horse_registration_org?.trim()?.toUpperCase() || null,
              discipline: [],
              info_verified: false,
            };
            
            horses.push(horse);
          }

          // Batch insert every 500 users
          if (users.length >= 500) {
            insertUserBatch(users.splice(0, 500), horses, userHorseMap);
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Error processing row ${rowCount}:`, error);
        }
      })
      .on('end', async () => {
        // Insert remaining users
        if (users.length > 0) {
          await insertUserBatch(users, horses, userHorseMap);
        }
        
        // Now insert all horses with their linked user_ids
        if (horses.length > 0) {
          await insertHorses(horses, userHorseMap);
        }
        
        console.log('\n✅ Import complete!');
        console.log(`   Total rows: ${rowCount}`);
        console.log(`   Users imported: ${users.length}`);
        console.log(`   Horses imported: ${horses.length}`);
        console.log(`   Errors: ${errorCount}`);
        resolve(true);
      })
      .on('error', (error) => {
        console.error('❌ CSV parsing error:', error);
        reject(error);
      });
  });
}

async function insertUserBatch(users: any[], allHorses: any[], userHorseMap: Map<string, string>) {
  console.log(`📝 Inserting batch of ${users.length} users...`);
  
  const { data, error } = await supabase
    .from('users')
    .insert(users)
    .select('id, email');

  if (error) {
    console.error('❌ User batch insert error:', error.message);
  } else {
    console.log(`   ✅ Inserted ${data?.length || 0} users`);
    
    // Map emails to user IDs for horse linking
    data?.forEach(user => {
      userHorseMap.set(user.email, user.id);
    });
  }
}

async function insertHorses(horses: any[], userHorseMap: Map<string, string>) {
  console.log(`🐴 Inserting ${horses.length} horses...`);
  
  // Link horses to users
  const linkedHorses = horses
    .map(horse => {
      const userId = userHorseMap.get(horse.email);
      if (!userId) {
        console.warn(`⚠️  No user found for horse: ${horse.horse_name} (${horse.email})`);
        return null;
      }
      
      const { email, ...horseData } = horse;
      return {
        ...horseData,
        owner_user_id: userId,
      };
    })
    .filter(Boolean);

  // Insert in batches of 500
  for (let i = 0; i < linkedHorses.length; i += 500) {
    const batch = linkedHorses.slice(i, i + 500);
    
    const { data, error } = await supabase
      .from('horses')
      .insert(batch)
      .select('id, horse_name');

    if (error) {
      console.error(`❌ Horse batch insert error (batch ${i / 500 + 1}):`, error.message);
    } else {
      console.log(`   ✅ Inserted ${data?.length || 0} horses`);
    }
  }
}

// Main execution
const csvPath = process.argv[2];

if (!csvPath) {
  console.error('❌ Usage: ts-node import-users-horses.ts path/to/users.csv');
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error('❌ CSV file not found:', csvPath);
  process.exit(1);
}

importUsersAndHorses(csvPath)
  .then(() => {
    console.log('🎉 Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });

