import sqlite3 from 'sqlite3';
import { Celebrity, type DatabaseRow } from '@/models/Celebrity';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: sqlite3.Database;

  private constructor() {
    const dbPath = 'celebrities.db';
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Failed to connect to the database:', err.message);
        }
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
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
      const query = `
        SELECT * FROM celebrities 
        WHERE name || '-' || date_of_birth = ?
      `;
      
      this.db.get(query, [slug], (err, row: DatabaseRow) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          resolve(null);
          return;
        }
        resolve(Celebrity.fromDatabaseRow(row));
      });
    });
  }
}
