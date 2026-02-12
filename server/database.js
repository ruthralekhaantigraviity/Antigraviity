const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'farmer_friend.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('buyer', 'seller')) NOT NULL,
      mobile TEXT,
      farmer_type TEXT,
      category TEXT,
      experience INTEGER,
      state TEXT,
      district TEXT,
      village TEXT,
      pincode TEXT,
      coins INTEGER DEFAULT 0,
      verified BOOLEAN DEFAULT 0
    )`);

        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      unit TEXT NOT NULL,
      image TEXT,
      farmer_id INTEGER,
      rating REAL DEFAULT 5.0,
      FOREIGN KEY (farmer_id) REFERENCES users(id)
    )`);

        // Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Processing',
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id)
    )`);

        console.log('Database tables initialized.');
    });
}

module.exports = db;
