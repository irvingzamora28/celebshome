import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

// Use an absolute path for the database file
const dbPath = join(Deno.cwd(), "celebrities.db");
const db = new DB(dbPath);

console.log(`Initializing database at ${dbPath}`);

// Create the celebrities table with a JSON column for additional data
db.execute(`
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
`);

console.log("Table created successfully");

// Function to insert celebrity data
async function insertCelebrities(jsonFilePath: string) {
    let insertStmt;
    try {
        const fileContent = await Deno.readTextFile(jsonFilePath);
        const celebrities = JSON.parse(fileContent);

        console.log(`Processing ${celebrities.length} celebrities...`);

        insertStmt = db.prepareQuery(`
            INSERT INTO celebrities (
                name, date_of_birth, date_of_death, zodiac_sign,
                gender, nationality, profession, biography,
                image_url, popularity_score, additional_data,
                created_at, updated_at
            ) VALUES (
                :name, :date_of_birth, :date_of_death, :zodiac_sign,
                :gender, :nationality, :profession, :biography,
                :image_url, :popularity_score, :additional_data,
                :created_at, :updated_at
            ) ON CONFLICT(name, date_of_birth) DO NOTHING
        `);

        let inserted = 0;
        for (const celeb of celebrities) {
            const now = new Date().toISOString();
            
            // Separate core fields from additional data
            const {
                name, date_of_birth, date_of_death, zodiac_sign,
                gender, nationality, profession, biography,
                image_url, popularity_score,
                ...additionalData
            } = celeb;

            try {
                insertStmt.execute({
                    name,
                    date_of_birth,
                    date_of_death: date_of_death || null,
                    zodiac_sign,
                    gender,
                    nationality,
                    profession,
                    biography,
                    image_url,
                    popularity_score,
                    additional_data: JSON.stringify(additionalData),
                    created_at: now,
                    updated_at: now,
                });
                inserted++;
                if (inserted % 10 === 0) {
                    console.log(`Inserted ${inserted} celebrities...`);
                }
            } catch (error) {
                console.error(`Error inserting ${name}:`, error);
            }
        }

        console.log(`Successfully inserted ${inserted} celebrities`);
    } catch (error) {
        console.error("Error processing file:", error);
    } finally {
        if (insertStmt) {
            insertStmt.finalize();
        }
        db.close();
    }
}

// Check if file path is provided
if (Deno.args.length < 1) {
    console.error("Please provide the path to the JSON file");
    Deno.exit(1);
}

const jsonFilePath = Deno.args[0];
await insertCelebrities(jsonFilePath);
