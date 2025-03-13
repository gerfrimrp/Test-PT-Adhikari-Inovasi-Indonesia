require('dotenv').config()
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.TOKEN_SECRET

const generateToken = (user) => {
    const payload = {
        userId: user.user_id,
        email: user.email,
        name: user.name
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken }