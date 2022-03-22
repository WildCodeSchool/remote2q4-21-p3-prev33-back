const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJwt = (email, role) => jwt.sign({
    email
}, process.env.JWT_SECRET);

module.exports = {
    generateJwt
};