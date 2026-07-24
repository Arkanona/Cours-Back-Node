const { sequelize } = require('../config/database')
const User = require('../models/userSeqModel')
const { QueryTypes } = require('sequelize')


// Get all users
exports.getUsers = async (req, res) => {
    try {
        // const users = await User.findAll()
        const users = await sequelize.query('SELECT * FROM "Users"', {
            type: QueryTypes.SELECT
        })
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Create user
exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body
        const newUser = await User.create({
            name,
            email
        })
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}