import 'dotenv/config';
import { supabase } from '../lib/supabase';
import { readFile } from 'fs/promises';
import path from 'path';
import { DatabaseRow } from '../models/Celebrity';

async function addRecords() {
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'new_enriched_celebrities.json');
    const data = await readFile(jsonPath, 'utf8');
    const celebrities: DatabaseRow[] = JSON.parse(data);

    let successCount = 0;
    let errorCount = 0;

    for (const celeb of celebrities) {
      try {
        const { error } = await supabase
          .from('celebrities')
          .insert({
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
            social_links: celeb.social_links,
            additional_data: {
              ...celeb.additional_data,
            },
            created_at: celeb.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error(`Error inserting record: ${celeb.name} (${celeb.date_of_birth})`, error);
          errorCount++;
        } else {
          console.log(`Inserted record: ${celeb.name} (${celeb.date_of_birth})`);
          successCount++;
        }
      } catch (error) {
        console.error(`Error processing record: ${celeb.name} (${celeb.date_of_birth})`, error);
        errorCount++;
      }

      // Add a small delay between records to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log('\nAdd Records Summary:');
    console.log(`Successfully inserted ${successCount} records`);
    console.log(`Failed to insert ${errorCount} records`);
    console.log('Add Records completed');
  } catch (error) {
    console.error('Add Records failed:', error);
  }
}

addRecords();
