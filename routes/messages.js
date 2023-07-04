const express = require('express');
const router = express.Router();

// Require controller modules.
const message_controller = require('../controllers/messageController');

// GET request for new message form
router.get('/create-message', message_controller.create_message_get);

// POST request for new message form
router.post('/create-message', message_controller.create_message_post);

module.exports = router;