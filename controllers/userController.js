const User = require('../models/user');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

// Display sign up form form on GET.
exports.sign_up_get = (req, res) => {
    res.render("sign-up-form");
  };

// Handle sign up form on POST.
exports.sign_up_post = [
  // Validate and sanitize fields.
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "E-mail must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a User object with escaped and trimmed data.
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("sign_up_form", {
        title: "Sign up",
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save user.
      await user.save();
      res.redirect('/');
    }
  }),
];


// Display log in form form on GET.
exports.log_in_get = (req, res) => {
  res.render("log-in-form");
};

// Handle log in from on POST
exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/"
});