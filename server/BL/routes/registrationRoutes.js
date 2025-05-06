const dbPromise = require("../../dbConnection");
require('dotenv').config({ path: '../.env' });
const express = require("express");
const bcrypt = require('bcrypt');
const { GenericGet, GenericPost } = require("../../DL/genericDL");
const router = express.Router();
const SALT_ROUNDS = 10;
router.post('/signup', async (req, res) => {
    const { password, ...userDetails } = req.body;
    try {
        const checkIfExists = await GenericGet("user", "userName", userDetails.userName);
        if (checkIfExists == null) {
            if (!password || typeof password !== "string") {
                console.error("Invalid password value:", password);
                return res.status(400).json({ error: "Invalid password value" });
            }
            const user = await GenericPost("user", userDetails);
            if (!user) {
                return res.status(500).json({ error: "Failed to save user" });
            }
            console.log("User created:", user);
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const passwordObject = {
                userId: user.id,
                password: hashedPassword
            };
            const userPassword = await GenericPost("userpassword", passwordObject);
            console.log("User password created:", userPassword);
            if (!userPassword) {
                return res.status(500).json({ error: "Failed to save user password" });
            }
            return res.status(201).json(user);
        } else {
            return res.status(409).json({ error: "User already exists" });
        }
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await GenericGet("user", "userName", userName);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User found:", user);
        const userPassword = await GenericGet("userpassword", "userId", user[0].id);
        console.log("User password:", await userPassword);
        if (!userPassword) {
            return res.status(404).json({ error: "Invalid user name or password" });
        }
        const isMatch = await bcrypt.compare(password, userPassword[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid user name or password" });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
);

module.exports = router