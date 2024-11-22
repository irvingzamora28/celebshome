import * as fs from 'fs/promises';
import * as path from 'path';
import { enrichCelebrity } from './wikipedia';
import { type DatabaseRow } from '../models/Celebrity';

async function main() {
    try {
        const celebritiesPath = path.join(process.cwd(), 'src', 'data', 'add_celebrities.json');
        const rawData = await fs.readFile(celebritiesPath, 'utf-8');
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

        const outputPath = path.join(process.cwd(), 'src', 'data', 'enriched_celebrities.json');
        await fs.writeFile(outputPath, JSON.stringify(enrichedData, null, 2));
        console.log(`Successfully enriched ${enrichedData.length} celebrities`);

    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

// Only run main if this file is the main module
if (require.main === module) {
    main().catch(console.error);
}