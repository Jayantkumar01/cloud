const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crud_db',
    password: 'hehehe',
    port: 5432,
});

app.use(express.json());
app.use(express.static(__dirname)); // Serve the HTML file

// Get all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new user
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
        res.status(201).json({ message: 'User added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
