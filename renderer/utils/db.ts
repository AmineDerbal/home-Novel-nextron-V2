import sqlite3 from 'sqlite3';

export const closeDb = (db: sqlite3.Database) => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
};

export const serializeDb = () => {
  const db = connectDb();
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS novels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serieName TEXT NOT NULL,
      serieLink TEXT NOT NULL,
      serieImageSrc TEXT NOT NULL,
      authorName TEXT NOT NULL,
      authorLink TEXT NOT NULL,
      lastUpdate TEXT NOT NULL,
      synopsis TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });

  closeDb(db);
};

export const connectDb = () => {
  console.log('Connecting to the SQLite database...');
  const db = new sqlite3.Database('database/mydb.db', (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });

  return db;
};

export default { closeDb, serializeDb, connectDb };
