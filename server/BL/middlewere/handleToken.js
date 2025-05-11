const jwt = require('jsonwebtoken');
const express=require("express");
const router = express.Router();
require('dotenv').config({ path:  '../../../.env'} );
const SALT_ROUNDS = 10;
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
const authenticateToken = (auth) => {
    
    const token = auth?.split(' ')[1];
    console.log('Token:', token);
    console.log('Access Token Secret:', process.env.ACCESS_TOKEN_SECRET);
    if (!token) return false;

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return user;
    } catch (err) {
        return false;
    }
};
module.exports = { authenticateToken, generateAccessToken };