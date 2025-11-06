#!/usr/bin/env ts-node
/**
 * Import 30K Businesses from CSV
 * 
 * Usage:
 *   npm install ts-node @types/node csv-parser
 *   ts-node scripts/import-businesses.ts path/to/businesses.csv
 * 
 * CSV Format:
 *   business_name,business_type,contact_email,contact_phone,address,city,state,zip,website,facebook_url,instagram_handle,services,specialties,source
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

interface BusinessRow {
  business_name: string;
  business_type?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  facebook_url?: string;
  instagram_handle?: string;
  services?: string; // comma-separated
  specialties?: string; // comma-separated
  source?: string;
}

async function importBusinesses(csvPath: string) {
  console.log('🚀 Starting business import from:', csvPath);
  
  const businesses: any[] = [];
  let rowCount = 0;
  let errorCount = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: BusinessRow) => {
        rowCount++;
        
        try {
          // Generate verification token
          const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          
          businesses.push({
            business_name: row.business_name?.trim(),
            business_type: row.business_type?.trim()?.toLowerCase() || null,
            contact_email: row.contact_email?.trim()?.toLowerCase() || null,
            contact_phone: row.contact_phone?.trim() || null,
            address: row.address?.trim() || null,
            city: row.city?.trim() || null,
            state: row.state?.trim()?.toUpperCase() || null,
            zip: row.zip?.trim() || null,
            website: row.website?.trim() || null,
            facebook_url: row.facebook_url?.trim() || null,
            instagram_handle: row.instagram_handle?.trim()?.replace('@', '') || null,
            services: row.services ? row.services.split(',').map(s => s.trim()) : [],
            specialties: row.specialties ? row.specialties.split(',').map(s => s.trim()) : [],
            source: row.source?.trim() || 'csv_import',
            verified: false,
            verification_token: token,
            verification_email_sent: false,
            crm_uploaded: false,
            ranking_score: 0,
            profile_views: 0,
            search_matches_30d: 0,
            imported_at: new Date().toISOString(),
          });

          // Batch insert every 500 rows
          if (businesses.length >= 500) {
            insertBatch(businesses.splice(0, 500));
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Error processing row ${rowCount}:`, error);
        }
      })
      .on('end', async () => {
        // Insert remaining businesses
        if (businesses.length > 0) {
          await insertBatch(businesses);
        }
        
        console.log('\n✅ Import complete!');
        console.log(`   Total rows: ${rowCount}`);
        console.log(`   Errors: ${errorCount}`);
        console.log(`   Success: ${rowCount - errorCount}`);
        resolve(true);
      })
      .on('error', (error) => {
        console.error('❌ CSV parsing error:', error);
        reject(error);
      });
  });
}

async function insertBatch(businesses: any[]) {
  console.log(`📝 Inserting batch of ${businesses.length} businesses...`);
  
  const { data, error } = await supabase
    .from('businesses')
    .insert(businesses)
    .select('id, business_name');

  if (error) {
    console.error('❌ Batch insert error:', error.message);
    // Try individual inserts for this batch
    for (const business of businesses) {
      const { error: singleError } = await supabase
        .from('businesses')
        .insert(business);
      
      if (singleError) {
        console.error(`   ❌ Failed to insert ${business.business_name}:`, singleError.message);
      }
    }
  } else {
    console.log(`   ✅ Inserted ${data?.length || businesses.length} businesses`);
  }
}

// Main execution
const csvPath = process.argv[2];

if (!csvPath) {
  console.error('❌ Usage: ts-node import-businesses.ts path/to/businesses.csv');
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error('❌ CSV file not found:', csvPath);
  process.exit(1);
}

importBusinesses(csvPath)
  .then(() => {
    console.log('🎉 Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });

