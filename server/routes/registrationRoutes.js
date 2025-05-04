const db =require('../dbConnection');
const express = require("express");
const bcrypt=require('bcrypt');
const router = express.Router();
const SALT_ROUNDS=10;
router.post('/signup', (req, res) => {
    const { name, email, userName, phone, password,profilePicture } = req.body;

   // const profilePicture = faker.image.avatar(); // or let user upload/provide it

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
router.post('/login',);

module.exports = router