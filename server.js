const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change with your MySQL username
    password: '', // Change with your MySQL password
    database: 'citiustech' // Change with your database name
	port: 3306
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// POST endpoint to register user
app.post('/register', (req, res) => {
    const { first_name, last_name, email, phone } = req.body;

    // SQL query to insert user data
    const query = 'INSERT INTO users (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)';
    db.query(query, [first_name, last_name, email, phone], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'User registered successfully!' });
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
