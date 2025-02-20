import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';
import sqlite3 from 'sqlite3';

// Define the paths for the database
const tmpDbPath = join('/tmp', 'celebrities.db');
const localDbPath = './celebrities.db';
const dbPath = process.env.NODE_ENV === 'production' || process.env.VERCEL ? tmpDbPath : localDbPath;
console.log(`Opening database at ${tmpDbPath}`);


// In production, copy or initialize the writable database in `/tmp`
if ((process.env.NODE_ENV === 'production' || process.env.VERCEL) && !existsSync(tmpDbPath)) {
  console.log(`Initializing writable database at ${tmpDbPath}`);
  if (existsSync(localDbPath)) {
    copyFileSync(localDbPath, tmpDbPath);
    console.log('Database copied to /tmp');
  } else {
    console.error('Local database file not found for copying.');
  }
}

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log(`Connected to database at ${dbPath}`);
  }
});

// Initialize the schema if it doesn't exist
const initDatabase = () => {
  db.serialize(() => {
    console.log('Checking and initializing database schema if necessary...');

    // Check if table exists
    db.get('SELECT * FROM celebrities LIMIT 1', (err, row) => {
      if (err) {
        console.error('Error checking table:', err.message);
      } else if (row) {
        console.log('Database schema already exists.');
      } else {
        // Table doesn't exist, create it
        console.log('Creating database schema...');
        
        db.run(`
          CREATE TABLE celebrities (
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
            console.error('Error creating schema:', err.message);
          } else {
            console.log('Database schema initialized successfully.');
          }
        });
      }
    });
  });
};

// Call initialization function
initDatabase();

export default db;
