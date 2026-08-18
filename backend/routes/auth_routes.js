const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config.js'); // for importing the database connection

const router = express.Router();

router.post('/register', async (req, res) => {
    // Extract data sent from the frontend HTML form
    const { first_name, last_name, email, password, phone } = req.body;

    try {
        // Step A: Check if the email already exists in the database
        const [existingUsers] = await pool.execute(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Step B: Hash the password securely
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Step C: Insert the new user into your MySQL database
        const query = `INSERT INTO users (first_name, last_name, email, password_hash) 
        VALUES (?, ?, ?, ?) `;
        await pool.execute(query, [first_name, last_name, email, password_hash]);

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Database error during registration' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Step A: Find the user by their email
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Step B: Compare the typed password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Step C: Generate a JWT (Digital Key) so they stay logged in
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send the token and user data back to the frontend
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Database error during login' });
    }
});

// ==========================================
// NEW: GET CURRENT USER PROFILE
// ==========================================
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user including phone and location from DB
        const [users] = await pool.execute(
            "SELECT user_id, first_name, last_name, email, phone, location, created_at FROM users WHERE user_id = ?",
            [decoded.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const dbUser = users[0];

        const formattedUser = {
            id: dbUser.user_id,
            name: `${dbUser.first_name} ${dbUser.last_name}`,
            first_name: dbUser.first_name,
            last_name: dbUser.last_name,
            email: dbUser.email,
            phone: dbUser.phone || '',       // Send phone to frontend
            location: dbUser.location || '', // Send location to frontend
            created_at: dbUser.created_at
        };

        res.json({ success: true, user: formattedUser });

    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

module.exports = router;


router.put('/update', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { first_name, last_name, phone, location } = req.body;

        await pool.execute(
            `UPDATE users 
             SET first_name = ?, last_name = ?, phone = ?, location = ? 
             WHERE user_id = ?`,
            [first_name, last_name, phone, location, decoded.user_id]
        );

        res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Failed to update profile in database" });
    }
});
