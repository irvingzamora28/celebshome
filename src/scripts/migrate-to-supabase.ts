import 'dotenv/config';
import { supabase } from '../lib/supabase';
import { readFile } from 'fs/promises';
import path from 'path';
import { DatabaseRow } from '../models/Celebrity';

async function migrateToSupabase() {
  try {
    console.log('Starting migration to Supabase...');
    
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'enriched_celebrities.json');
    console.log(`Reading data from ${jsonPath}`);
    const rawData = await readFile(jsonPath, 'utf-8');
    const celebrities: DatabaseRow[] = JSON.parse(rawData);

    console.log(`Found ${celebrities.length} celebrities to migrate`);

    // Insert data in batches to avoid timeouts
    const BATCH_SIZE = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < celebrities.length; i += BATCH_SIZE) {
      const batch = celebrities.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(celebrities.length / BATCH_SIZE);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)`);

      const { data, error } = await supabase
        .from('celebrities')
        .upsert(
          batch.map(celeb => ({
            name: celeb.name,
            date_of_birth: celeb.date_of_birth,
            date_of_death: celeb.date_of_death || null,
            zodiac_sign: celeb.zodiac_sign,
            gender: celeb.gender,
            nationality: celeb.nationality,
            profession: celeb.profession,
            biography: celeb.biography,
            image_url: celeb.image_url,
            popularity_score: celeb.popularity_score || 0,
            additional_data: {
              ...celeb.additional_data,
              social_links: celeb.social_links
            },
            created_at: celeb.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))
        );

      if (error) {
        console.error(`Error inserting batch ${batchNumber}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`Successfully inserted batch ${batchNumber}`);
        successCount += batch.length;
      }

      // Add a small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\nMigration Summary:');
    console.log(`Total records processed: ${celebrities.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed to migrate: ${errorCount}`);
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateToSupabase();
