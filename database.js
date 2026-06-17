const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to a local SQLite database file
const dbPath = path.resolve(__dirname, 'expenses.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Setup relational schema schema table initialization
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("Error creating table:", err.message);
    });
});

module.exports = db;