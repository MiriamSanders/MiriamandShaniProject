const dbPromise = require("../dbConnection");
require('dotenv').config({ path: '../.env' });
const express = require("express");
const bcrypt=require('bcrypt');
const router = express.Router();
const SALT_ROUNDS=10;
router.post('/signup',async (req, res) => {
    const db = await dbPromise;
    const { name, email, userName, phone, password,profilePicture } = req.body;
    bcrypt.hash(password, SALT_ROUNDS)
        .then((hashedPassword) => {
            return db.query(
                `INSERT INTO USER (name, email, userName, phone, profilePicture) VALUES (?, ?, ?, ?, ?)`,
                [name, email, userName, phone, profilePicture]
            ).then(([result]) => {
                const userId = result.insertId;
                return db.query(
                    `INSERT INTO USERPASSWORD (userId, password) VALUES (?, ?)`,
                    [userId, hashedPassword]
                );
            });
        })
        .then(() => {
            res.status(201).json({ message: 'User signed up successfully' });
        })
    .catch((err) => {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Signup failed' });
    });
});
//router.post('/login',);

module.exports = router