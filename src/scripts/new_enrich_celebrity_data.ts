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

        const enrichedData: DatabaseRow[] = [];
        for (const celebrity of celebrities) {
            const enrichedCelebrity = await enrichCelebrity(celebrity);
            if (enrichedCelebrity) {
                enrichedData.push(enrichedCelebrity);
                console.log(`Successfully enriched data for ${celebrity}`);
            } else {
                console.log(`Failed to enrich data for ${celebrity}`);
            }
        }   

        // Write back to enriched_add_celebrities.json
        const enrichedPath = path.join(process.cwd(), 'src', 'data', 'new_enriched_celebrities.json');
        await fs.writeFile(enrichedPath, JSON.stringify(enrichedData, null, 2));
        console.log(`Successfully enriched ${enrichedData.length} new celebrities in the new_enriched_celebrities.json file`);

    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

// Only run main if this file is the main module
if (require.main === module) {
    main().catch(console.error);
}
