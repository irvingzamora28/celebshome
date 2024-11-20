import { readFile } from 'fs/promises';
import db from '../lib/bd';

interface Celebrity {
    name: string;
    date_of_birth: string;
    date_of_death?: string | null;
    zodiac_sign: string;
    gender: string;
    nationality: string;
    profession: string;
    biography: string;
    image_url: string;
    popularity_score: number;
    additional_data?: Record<string, unknown>;
}

// Function to update celebrity data
async function updateCelebrities(jsonFilePath: string) {
    try {
        console.log('Checking and initializing database schema if necessary...');
        await db.exec('PRAGMA foreign_keys = ON;');

        const fileContent = await readFile(jsonFilePath, 'utf-8');
        const celebrities = JSON.parse(fileContent) as Celebrity[];

        console.log(`Processing ${celebrities.length} celebrities for updates...`);

        // Begin transaction
        await db.exec('BEGIN TRANSACTION');

        // First, let's verify that the data exists
        const checkStmt = db.prepare('SELECT COUNT(*) as count FROM celebrities WHERE name = ? AND date_of_birth = ?');
        const updateStmt = db.prepare(`
            UPDATE celebrities SET
                date_of_death = ?,
                zodiac_sign = ?,
                gender = ?,
                nationality = ?,
                profession = ?,
                biography = ?,
                image_url = ?,
                popularity_score = ?,
                additional_data = ?,
                updated_at = ?
            WHERE name = ? AND date_of_birth = ?
        `);

        let updated = 0;
        for (const celeb of celebrities) {
            const now = new Date().toISOString();
            
            const {
                name, date_of_birth, date_of_death, zodiac_sign,
                gender, nationality, profession, biography,
                image_url, popularity_score,
                additional_data = {} as Record<string, unknown>
            } = celeb;

            try {
                // First check if the celebrity exists
                const exists = checkStmt.get(name, date_of_birth) as unknown as { count: number };
                if (!exists || exists.count === 0) {
                    console.log(`Skipping ${name} (not found in database)`);
                    continue;
                }

                console.log(`Updating ${name}... with date of birth ${date_of_birth}`);
                
                updateStmt.run(
                    date_of_death || null,
                    zodiac_sign,
                    gender,
                    nationality,
                    profession,
                    biography,
                    image_url,
                    popularity_score,
                    JSON.stringify(additional_data),
                    now,
                    name,
                    date_of_birth
                );

                updated++;
                if (updated % 10 === 0) {
                    console.log(`Updated ${updated} celebrities...`);
                }
            } catch (error) {
                console.error(`Error updating ${name}:`, error);
                // Rollback transaction on error
                await db.exec('ROLLBACK');
                throw error;
            }
        }

        // Commit transaction
        await db.exec('COMMIT');
        console.log(`Successfully updated ${updated} celebrities`);
    } catch (error) {
        console.error("Error processing file:", error);
        // Ensure rollback on any error
        await db.exec('ROLLBACK');
        process.exit(1);
    }
}

// Check if file path is provided
if (process.argv.length < 3) {
    console.error("Please provide the path to the JSON file");
    process.exit(1);
}

const jsonFilePath = process.argv[2];
updateCelebrities(jsonFilePath).catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
});
