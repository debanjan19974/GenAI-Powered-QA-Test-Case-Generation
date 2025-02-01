const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",  // Change if you set a password
    database: "citiustech",
    port: 3307, // Important! Since your MySQL is on port 3307
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Register user API
app.post("/register", (req, res) => {
    const { first_name, last_name, email, phone, password } = req.body;
    const sql = "INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [first_name, last_name, email, phone, password], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            res.status(500).json({ message: "Error registering user" });
            return;
        }
        res.json({ message: "User registered successfully!" });
    });
});


// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
