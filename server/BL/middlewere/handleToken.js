const jwt = require('jsonwebtoken');
const express=require("express");
const router = express.Router();
require('dotenv').config({ path:  '../../../.env'} );
const SALT_ROUNDS = 10;
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
};
const authenticateToken = (auth) => {
    const token = auth?.split(' ')[1];
    if (!token) return false;
    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return user;
    } catch (err) {
        return false;
    }
};
module.exports = { authenticateToken, generateAccessToken };