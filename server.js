const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
    user: "Debanjan.Das@citiustech.com",
    host: "citiustech.cbhsbzc4ogd7.eu-north-1.rds.amazonaws.com",
    database: "citiustech",
    password: "Debanjan1997**",
    port: 5432, // PostgreSQL default port
});

// Register User API
app.post("/register", async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [firstName, lastName, email, phone, hashedPassword]
        );
        res.json({ message: "User registered successfully", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "User registration failed" });
    }
});

// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Compare hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                res.json({ message: "Login successful", user });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error during login" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
