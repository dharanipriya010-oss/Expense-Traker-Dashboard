const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API ENDPOINT: Fetch All Transactions
app.get('/api/transactions', (req, res) => {
    const sql = 'SELECT * FROM transactions ORDER BY date DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// API ENDPOINT: Post New Entry Transaction record
app.post('/api/transactions', (req, res) => {
    const { text, amount, category } = req.body;
    
    if (!text || amount === undefined || !category) {
        return res.status(400).json({ error: 'Please fulfill all target properties description, amount, category.' });
    }

    const sql = 'INSERT INTO transactions (text, amount, category) VALUES (?, ?, ?)';
    const params = [text, amount, category];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Transaction successfully persisted',
            data: { id: this.lastID, text, amount, category }
        });
    });
});

// API ENDPOINT: Delete Record Transaction Entry by Explicit ID
app.delete('/api/transactions/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM transactions WHERE id = ?';

    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Target entry item transaction identity not found.' });
        }
        res.json({ message: 'Deleted entry sequence validated successfully', changes: this.changes });
    });
});

// Start listening execution sequence
app.listen(PORT, () => {
    console.log(`Server running at network hub interface node http://localhost:${PORT}`);
});