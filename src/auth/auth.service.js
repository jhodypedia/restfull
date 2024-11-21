const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Hash password
const hashPassword = async (password) => await bcrypt.hash(password, 10);

// Verify password
const verifyPassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);

// Generate JWT token
const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// Find user by email
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
};

// Create user
const createUser = (username, email, password, phone) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, email, password, phone], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Update user password
const updatePassword = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(sql, [password, email], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    findUserByEmail,
    createUser,
    updatePassword,
};
