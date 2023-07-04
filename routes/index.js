const express = require('express');
const router = express.Router();
const Message = require('../models/message');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find({})
      .populate('author', 'first_name')
      .exec();
    res.render('index', { title: 'Members Only', messages: messages });
  } catch (err) {
    console.log(err);
    res.redirect('/error');
  }
});

module.exports = router;
