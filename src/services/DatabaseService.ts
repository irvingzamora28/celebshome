import db from '../lib/bd';
import { Celebrity, type DatabaseRow } from '../models/Celebrity';

export class DatabaseService {
    private static instance: DatabaseService;

    private constructor(private readonly db: sqlite3.Database) {}
  
    public static getInstance(): DatabaseService {
      if (!DatabaseService.instance) {
        DatabaseService.instance = new DatabaseService(db);
      }
      return DatabaseService.instance;
    }
  
    public async getFeaturedCelebrities(limit: number = 10): Promise<Celebrity[]> {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT * FROM celebrities 
          ORDER BY popularity_score DESC 
          LIMIT ?
        `;
        this.db.all(query, [limit], (err, rows: DatabaseRow[]) => {
          if (err) {
            reject(err);
            return;
          }
          const celebrities = rows.map(row => Celebrity.fromDatabaseRow(row));
          resolve(celebrities);
        });
      });
    }

  public async getCelebritiesByZodiac(zodiacSign: string): Promise<Celebrity[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM celebrities 
        WHERE zodiac_sign = ? 
        ORDER BY popularity_score DESC
      `;
      
      this.db.all(query, [zodiacSign], (err, rows: DatabaseRow[]) => {
        if (err) {
          reject(err);
          return;
        }
        const celebrities = rows.map(row => Celebrity.fromDatabaseRow(row));
        resolve(celebrities);
      });
    });
  }

  public async searchCelebrities(searchTerm: string): Promise<Celebrity[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM celebrities 
        WHERE name LIKE ? OR biography LIKE ?
        ORDER BY popularity_score DESC
      `;
      
      const searchPattern = `%${searchTerm}%`;
      this.db.all(query, [searchPattern, searchPattern], (err, rows: DatabaseRow[]) => {
        if (err) {
          reject(err);
          return;
        }
        const celebrities = rows.map(row => Celebrity.fromDatabaseRow(row));
        resolve(celebrities);
      });
    });
  }

  public async getCelebrityBySlug(slug: string): Promise<Celebrity | null> {
    return new Promise((resolve, reject) => {
        console.log(`Searching for celebrity with slug: ${slug}`);
        
        // Find the last occurrence of '-' to separate name and birth date
        // and replace %20 with space
        const [name] = slug.split('-').map((part) => decodeURIComponent(part.replace('%20', ' ')));
        const birthDateMatch = slug.match(/\d{4}-\d{2}-\d{2}/);
        if (!birthDateMatch) {
          reject(new Error(`Invalid slug format: ${slug}`));
          return;
        }
        const birthDate = birthDateMatch[0];
        
        console.log(`Searching for celebrity with name: ${name} and birth date: ${birthDate}`);
        
        const query = `
          SELECT * FROM celebrities 
          WHERE name = ? AND date_of_birth = ?
        `;
        
        this.db.get(query, [name, birthDate], (err, row: DatabaseRow | undefined) => {
          if (err) {
            reject(err);
            return;
          }
          const celebrity = row ? Celebrity.fromDatabaseRow(row) : null;
          resolve(celebrity);
        });
    });
  }
}
