const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const validator = require('validator')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '364d'

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
        const { name, email, password, role} = req.body

        if(!name || !email || !password){
            return res.status(400).json({ message: 'Please provide name, email and password'})
        }
        // On fait les vérifications mot de passe et email
        const isPasswordOK = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        if(!isPassOK){
            return res.status(400).json({ message: 'Password must have 1 lower, 1 upper, 1 number, and 1 symbol and must be at least 6 characters long'})
        }

        // Vérifier si c'est un mail
        const isEmailOK = validator.isEmail(email)

        if(!isEmailOK){
            return res.status(400).json({ message: 'You must provide a valid email' })
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if(existingUser){
            return res.status(400).json({ message: 'Email already in use'})
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        })

        const token = generateToken(user._id)

        res.status(201).json({
            message: 'User register successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration', error: err.message })
    }
}
// @desc    Login user & get token
// @route   POST/api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password){
            return res.status(400).json({ message: 'Please provide email and password '})
        }

        // Find user and explicitly select password field
        const user = await User.findOne({ email }).select('+password')
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        // Check password match
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        const token = generateToken(user._id)

        res.status(200).json({
            message: 'User login successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
        
    } catch (err){
        res.status(500).json({ message: 'Server error during login', error: err.message })
    }
}

module.exports = { register, login }