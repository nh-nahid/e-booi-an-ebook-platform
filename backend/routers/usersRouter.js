const express = require('express');
const { addUser } = require('../controllers/usersController');
const { checkLogin } = require('../middlewares/common/checkLogin');
const avatarUpload = require('../middlewares/users/avatarUpload');

const router = express.Router();


// add user
router.post('/', checkLogin, avatarUpload, addUser);

module.exports = router;