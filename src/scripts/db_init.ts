import * as fs from 'fs/promises';
import * as path from 'path';
import db from '../lib/bd';

async function initializeDatabase() {
    console.log('Initializing database schema...');

    // Create the celebrities table with a JSON column for additional data
    db.run(`
        CREATE TABLE IF NOT EXISTS celebrities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date_of_birth TEXT NOT NULL,
            date_of_death TEXT,
            zodiac_sign TEXT NOT NULL,
            gender TEXT NOT NULL,
            nationality TEXT NOT NULL,
            profession TEXT NOT NULL,
            biography TEXT NOT NULL,
            image_url TEXT NOT NULL,
            popularity_score INTEGER NOT NULL,
            additional_data TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE(name, date_of_birth)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            process.exit(1);
        }
        console.log('Table created successfully');
    });
}

async function insertCelebrities(jsonFilePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const fileContent = await fs.readFile(jsonFilePath, 'utf8');
            const celebrities = JSON.parse(fileContent);

            console.log(`Processing ${celebrities.length} celebrities...`);

            const stmt = db.prepare(`
                INSERT OR REPLACE INTO celebrities (
                    name, date_of_birth, date_of_death, zodiac_sign,
                    gender, nationality, profession, biography,
                    image_url, popularity_score, additional_data,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                for (const celebrity of celebrities) {
                    const additionalData = {
                        social_links: celebrity.social_links,
                        famous_works: celebrity.famous_works
                    };

                    stmt.run(
                        celebrity.name,
                        celebrity.date_of_birth,
                        celebrity.date_of_death || null,
                        celebrity.zodiac_sign,
                        celebrity.gender,
                        celebrity.nationality,
                        celebrity.profession,
                        celebrity.biography,
                        celebrity.image_url,
                        celebrity.popularity_score,
                        JSON.stringify(additionalData),
                        celebrity.created_at,
                        new Date().toISOString()
                    );
                }

                db.run('COMMIT', (err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                    console.log(`Successfully inserted ${celebrities.length} celebrities`);
                    stmt.finalize();
                    resolve();
                });
            });
        } catch (error) {
            console.error('Error processing celebrities:', error);
            reject(error);
        }
    });
}

async function main() {
    const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'enriched_celebrities.json');

    try {
        await initializeDatabase();
        await insertCelebrities(jsonFilePath);
        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Only run main if this file is the main module
if (require.main === module) {
    main().catch(console.error);
}
