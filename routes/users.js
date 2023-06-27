const express = require('express');
const router = express.Router();

// Require controller modules.
const user_controller = require('../controllers/userController');

// GET request for sign up form
router.get('/sign-up-form', user_controller.sign_up_get);

module.exports = router;
