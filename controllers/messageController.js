const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


// Display new message form on GET.
exports.create_message_get = (req, res) => {
    res.render("create-message");
  };