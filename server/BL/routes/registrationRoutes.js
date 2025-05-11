require('dotenv').config({ path: '../.env' });
const {generateAccessToken}=require("../middlewere/handleToken")
const { GenericGet, GenericPost, writeToLog } = require("../../DL/genericDL");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const SALT_ROUNDS=10;

router.post('/signup', async (req, res) => {
    const { password, ...userDetails } = req.body;
    if (!password || typeof password !== "string") {
        console.error("Invalid password value:", password);
        return res.status(400).json({ error: "Invalid password value" });
    }
    try {
        const existingUser = await GenericGet("user", "userName", userDetails.userName);
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const user = await GenericPost("user", userDetails);
        if (!user) throw new Error("Failed to save user");
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userPassword = await GenericPost("userpassword", {
            userId: user.id,
            password: hashedPassword
        });
        if (!userPassword) {
            throw new Error("Failed to save user password");
        }
       // writeToLog({ "timestamp": new Date(), "action": "succeeded to add user" })//how to write succeeded?
      const token= generateAccessToken(user);
        return res.status(201).json({"user":user,"token":token});
    } catch (error) {
        console.error("Signup error:", error.message);
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
        const userPassword = await GenericGet("userpassword", "userId", user[0].id);
        if (!userPassword) {
            return res.status(404).json({ error: "Invalid user name or password" });
        }
        const isMatch = await bcrypt.compare(password, userPassword[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid user name or password" });
        }
       // writeToLog({ "timestamp": new Date(), "action": "login success", "itemID": user.id });
       const token= generateAccessToken(user[0]);
       return res.status(200).json({"user":user,"token":token});
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
);

module.exports = router