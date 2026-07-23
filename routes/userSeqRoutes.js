const express = require('express')
const router = express.Router()
const userSeqController = require('../controllers/userSeqController')

router.get('/', userSeqController.getUsers)
router.post('/', userSeqController.createUser)

module.exports = router