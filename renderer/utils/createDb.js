import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../database/mydb.db');

console.log('creating database...');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS novels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serieName TEXT NOT NULL,
    serieImageSrc TEXT NOT NULL,
    authorName TEXT NOT NULL,
    authorLink TEXT NOT NULL,
    lastUpdate TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database created and tables initialized.');
  }
});
