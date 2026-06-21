const express = require('express');
const { addUser } = require('../controllers/usersController');


const router = express.Router();


// add user
router.post('/', addUser)

module.exports = router;