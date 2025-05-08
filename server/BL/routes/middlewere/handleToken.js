const jwt = require('jsonwebtoken');
const router = express.Router();
const SALT_ROUNDS = 10;
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
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