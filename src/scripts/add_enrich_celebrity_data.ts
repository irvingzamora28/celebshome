import * as fs from 'fs/promises';
import * as path from 'path';
import { enrichCelebrity } from './wikipedia';
import { type DatabaseRow } from '../models/Celebrity';

async function main() {
    try {
        
        
        // Read the additional celebrities data
        const addCelebritiesPath = path.join(process.cwd(), 'src', 'data', 'add_celebrities.json');
        const rawData = await fs.readFile(addCelebritiesPath, 'utf-8');
        const celebrities = JSON.parse(rawData);
    
        // Read existing enriched data
        const enrichedPath = path.join(process.cwd(), 'src', 'data', 'enriched_celebrities.json');
        const existingData = await fs.readFile(enrichedPath, 'utf-8');
        const existingCelebrities: DatabaseRow[] = JSON.parse(existingData);

        // Create a Set of existing celebrity names for quick lookup
        const existingNames = new Set(existingCelebrities.map(celeb => celeb.name.toLowerCase()));

        const enrichedData: DatabaseRow[] = [];
        for (const celebrity of celebrities) {
            // Skip if celebrity already exists
            if (existingNames.has(celebrity.toLowerCase())) {
                console.log(`Skipping ${celebrity} - already exists in database`);
                continue;
            }

            const enrichedCelebrity = await enrichCelebrity(celebrity);
            if (enrichedCelebrity) {
                enrichedData.push(enrichedCelebrity);
                console.log(`Successfully enriched data for ${celebrity}`);
            } else {
                console.log(`Failed to enrich data for ${celebrity}`);
            }
        }

        // Combine existing and new data
        const combinedData = [...existingCelebrities, ...enrichedData];

        // Write back to enriched_celebrities.json
        await fs.writeFile(enrichedPath, JSON.stringify(combinedData, null, 2));
        console.log(`Successfully appended ${enrichedData.length} new celebrities to the database`);

    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

// Only run main if this file is the main module
if (require.main === module) {
    main().catch(console.error);
}