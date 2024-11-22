import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Celebrity, type DatabaseRow } from '../models/Celebrity';

type CelebrityData = {
    name: string;
    date_of_birth: string;
    date_of_death?: string;
    zodiac_sign: string;
    gender: string;
    nationality: string;
    profession: string;
    biography: string;
    image_url: string;
    popularity_score: number;
    additional_data?: Record<string, any>;
  };
  

class DatabaseService {
    private static instance: DatabaseService;
    private db: Database.Database;
    private initialized: boolean = false;

    private constructor() {
        const dbPath = process.env.VERCEL
            ? path.join('/tmp', 'celebrities.db')
            : path.join(process.cwd(), 'celebrities.db');

        // Ensure the database file exists
        if (process.env.VERCEL && !fs.existsSync(dbPath)) {
            // In Vercel, we need to create a new database for each cold start
            this.db = new Database(dbPath);
            this.initializeSchema();
            // Load the initial data
            const dataPath = path.join(process.cwd(), 'src', 'data', 'enriched_celebrities.json');
            if (fs.existsSync(dataPath)) {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                this.populateDatabase(data);
            }
        } else {
            this.db = new Database(dbPath);
            this.initializeSchema();
        }
    }

    private initializeSchema(): void {
        const createTableSQL = `
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
        `;

        this.db.exec(createTableSQL);
        this.initialized = true;
    }

    private populateDatabase(celebrities: CelebrityData[]): void {
        const insertSQL = `
            INSERT OR REPLACE INTO celebrities (
                name, date_of_birth, date_of_death, zodiac_sign,
                gender, nationality, profession, biography,
                image_url, popularity_score, additional_data,
                created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, datetime('now'), datetime('now')
            )
        `;

        const stmt = this.db.prepare(insertSQL);
        
        this.db.transaction(() => {
            for (const celeb of celebrities) {
                stmt.run(
                    celeb.name,
                    celeb.date_of_birth,
                    celeb.date_of_death || null,
                    celeb.zodiac_sign,
                    celeb.gender,
                    celeb.nationality,
                    celeb.profession,
                    celeb.biography,
                    celeb.image_url,
                    celeb.popularity_score,
                    JSON.stringify(celeb.additional_data || {})
                );
            }
        })();
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public getDb(): Database.Database {
        return this.db;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public async getFeaturedCelebrities(limit: number = 10): Promise<Celebrity[]> {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT * FROM celebrities 
                    ORDER BY popularity_score DESC 
                    LIMIT ?
                `;
                const stmt = this.db.prepare(query);
                const rows = stmt.all(limit) as DatabaseRow[];
                const celebrities = rows.map(row => Celebrity.fromDatabaseRow(row));
                resolve(celebrities);
            } catch (error) {
                reject(error);
            }
        });
    }

    public async getCelebritiesByZodiac(zodiacSign: string): Promise<Celebrity[]> {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT * FROM celebrities 
                    WHERE zodiac_sign = ? 
                    ORDER BY popularity_score DESC
                `;
                const stmt = this.db.prepare(query);
                const rows = stmt.all(zodiacSign) as DatabaseRow[];
                const celebrities = rows.map(row => Celebrity.fromDatabaseRow(row));
                resolve(celebrities);
            } catch (error) {
                reject(error);
            }
        });
    }

    public async searchCelebrities(searchTerm: string): Promise<Celebrity[]> {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT * FROM celebrities 
                    WHERE name LIKE ? OR biography LIKE ?
                    ORDER BY popularity_score DESC
                `;
                const stmt = this.db.prepare(query);
                const searchPattern = `%${searchTerm}%`;
                const rows = stmt.all(searchPattern, searchPattern) as DatabaseRow[];
                const celebrities = rows.map(row => Celebrity.fromDatabaseRow(row));
                resolve(celebrities);
            } catch (error) {
                reject(error);
            }
        });
    }

    public async getCelebrityBySlug(slug: string): Promise<Celebrity | null> {
        return new Promise((resolve, reject) => {
            try {
                const [name, birthDateStr] = slug.split('-birth-');
                if (!name || !birthDateStr) {
                    throw new Error(`Invalid slug format: ${slug}`);
                }

                const query = `
                    SELECT * FROM celebrities 
                    WHERE name = ? AND date_of_birth = ?
                `;
                const stmt = this.db.prepare(query);
                const row = stmt.get(name, birthDateStr) as DatabaseRow | undefined;
                resolve(row ? Celebrity.fromDatabaseRow(row) : null);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default DatabaseService;
