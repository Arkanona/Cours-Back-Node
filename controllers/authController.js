const jwt = require('jsonwebtoken')
const user = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '24h'

// Helper to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: 'Server error during registration', error: err.message })
    }
}
const login = async (req, res) => {

}

module.exports = { register, login }