const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config.js'); // for importing the database connection

const router = express.Router();


// 1. REGISTER ROUTE (/api/auth/register)

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

        //2-Hash the password securely
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 3- Insert the new user into your MySQL database
        const query = `INSERT INTO users (first_name, last_name, email, password_hash) 
        VALUES (?, ?, ?, ?) `;
        await pool.execute(query, [first_name, last_name, email, password_hash]);

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Database error during registration' });
    }
});


// 2. LOGIN ROUTE (/api/auth/login)

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

module.exports = router;