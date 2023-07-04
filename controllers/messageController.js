const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


// Display new message form on GET.
exports.create_message_get = (req, res) => {
    res.render("create-message");
  };

// Handle new message on POST
exports.create_message_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("create-message", {
        errors: errors.array(),
      });
    } else {
      try {
        // Create a Message object with escaped and trimmed data.
        const message = new Message({
          title: req.body.title,
          text: req.body.text,
          timestamp: Date.now(),
          author: res.locals.currentUser._id,
        });

        // Save the message
        await message.save();
        res.redirect("/");
      } catch (err) {
        // Handle the error
        console.log(err);
        res.redirect("/error");
      }
    }
  }),
];