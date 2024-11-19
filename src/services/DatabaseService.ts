import sqlite3 from 'sqlite3';
import { Celebrity } from '@/models/Celebrity';

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
      
      this.db.all(query, [limit], (err, rows) => {
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
      
      this.db.all(query, [zodiacSign], (err, rows) => {
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
        WHERE name LIKE ? OR profession LIKE ? 
        ORDER BY popularity_score DESC 
        LIMIT 20
      `;
      
      const searchPattern = `%${searchTerm}%`;
      this.db.all(query, [searchPattern, searchPattern], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const celebrities = rows.map(row => Celebrity.fromDatabaseRow(row));
        resolve(celebrities);
      });
    });
  }
}
