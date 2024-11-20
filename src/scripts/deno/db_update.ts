import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

// Use an absolute path for the database file
const dbPath = join(Deno.cwd(), "celebrities.db");
const db = new DB(dbPath);

console.log(`Opening database at ${dbPath}`);

// Function to update celebrity data
async function updateCelebrities(jsonFilePath: string) {
    let updateStmt;
    try {
        const fileContent = await Deno.readTextFile(jsonFilePath);
        const celebrities = JSON.parse(fileContent);

        console.log(`Processing ${celebrities.length} celebrities for updates...`);

        updateStmt = db.prepareQuery(`
            UPDATE celebrities SET
                date_of_death = :date_of_death,
                zodiac_sign = :zodiac_sign,
                gender = :gender,
                nationality = :nationality,
                profession = :profession,
                biography = :biography,
                image_url = :image_url,
                popularity_score = :popularity_score,
                additional_data = :additional_data,
                updated_at = :updated_at
            WHERE name = :name AND date_of_birth = :date_of_birth
        `);

        let updated = 0;
        for (const celeb of celebrities) {
            const now = new Date().toISOString();
            
            const {
                name, date_of_birth, date_of_death, zodiac_sign,
                gender, nationality, profession, biography,
                image_url, popularity_score,
                ...additionalData
            } = celeb;

            try {
                console.log(`Updating ${name}... and date of birth ${date_of_birth}`);
                
                updateStmt.execute({
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
                    updated_at: now,
                });

                // Use `db.totalChanges` to count affected rows
                if (db.totalChanges > 0) {
                    updated++;
                    if (updated % 10 === 0) {
                        console.log(`Updated ${updated} celebrities...`);
                    }
                }
            } catch (error) {
                console.error(`Error updating ${name}:`, error);
            }
        }

        console.log(`Successfully updated ${updated} celebrities`);
    } catch (error) {
        console.error("Error processing file:", error);
    } finally {
        if (updateStmt) {
            updateStmt.finalize();
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
await updateCelebrities(jsonFilePath);
