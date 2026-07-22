const express = require('express')
const router = express.Router()
const { profile, getRecipe } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/profile', authMiddleware, profile)
router.get('/recipe/:humor', getRecipe)

module.exports = router