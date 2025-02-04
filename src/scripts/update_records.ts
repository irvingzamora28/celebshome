import 'dotenv/config';
import { supabase } from '../lib/supabase';
import { readFile } from 'fs/promises';
import path from 'path';
import { DatabaseRow } from '../models/Celebrity';

async function updateRecords() {
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'update_enriched_celebrities.json');
    const data = await readFile(jsonPath, 'utf8');
    const celebrities: DatabaseRow[] = JSON.parse(data);

    let successCount = 0;
    let errorCount = 0;

    for (const celeb of celebrities) {
      try {
        const { error } = await supabase
          .from('celebrities')
          .update({
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
            updated_at: new Date().toISOString(),
          })
          .eq('name', celeb.name)
          .eq('date_of_birth', celeb.date_of_birth);

        if (error) {
          console.error(`Error updating record: ${celeb.name} (${celeb.date_of_birth})`, error);
          errorCount++;
        } else {
          console.log(`Updated record: ${celeb.name} (${celeb.date_of_birth})`);
          successCount++;
        }
      } catch (error) {
        console.error(`Error processing record: ${celeb.name} (${celeb.date_of_birth})`, error);
        errorCount++;
      }

      // Add a small delay between records to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log('\nUpdate Records Summary:');
    console.log(`Successfully updated ${successCount} records`);
    console.log(`Failed to update ${errorCount} records`);
    console.log('Update Records completed');
  } catch (error) {
    console.error('Update Records failed:', error);
  }
}

updateRecords();
