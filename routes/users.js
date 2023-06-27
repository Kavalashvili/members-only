const express = require('express');
const router = express.Router();

// Require controller modules.
const user_controller = require('../controllers/userController');

// GET request for sign up form
router.get('/sign-up-form', user_controller.sign_up_get);

// POST request for sign-up form
router.post('/sign-up-form', user_controller.sign_up_post);

// GET request for log in form
router.get('/log-in-form', user_controller.log_in_get);

// POST request for log in form
router.post('/log-in-form', user_controller.log_in_post);

module.exports = router;
