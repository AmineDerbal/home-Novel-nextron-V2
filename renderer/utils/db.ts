// import sqlite3 from 'sqlite3';
const sqlite3 = require('sqlite3').verbose();

const dbConnect = () => {
  console.log('Connecting to the SQLite database...');
  const db = new sqlite3.Database('renderer/database/mydb.db', (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });

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

  return db;
};

export default dbConnect;
