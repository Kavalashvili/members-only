const User = require('../models/user');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require('bcryptjs');
require('dotenv').config();


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
  body("confirm_password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("sign-up-form", {
        title: "Sign up",
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Hash the password and save the user.
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          // Handle the error
          console.log(err);
          return res.redirect("/error");
        }

        // Create a User object with escaped and trimmed data.
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
        });

        try {
          // Save the user
          await user.save();
          res.redirect("/");
        } catch (err) {
          // Handle the error
          console.log(err);
          res.redirect("/error");
        }
      });
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

// Handle log out
exports.log_out_get = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

// Display membership form form on GET.
exports.membership_get = (req, res) => {
  const errors = [];
  res.render("membership", { errors: errors });
};

// Handle membership form on POST
exports.membership_post = async (req, res) => {
  const passcode = process.env.MEMBERSHIP_PASSCODE;
  const { membership } = req.body;
  console.log(membership)

  if (membership === passcode) {
    // User's input matches the membership passcode
    // Set isMember to true for the current user
    res.locals.currentUser.isMember = true;
    try {
      await res.locals.currentUser.save();
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.redirect("/error");
    }
  } else {
    // User's input does not match the membership passcode
    const errors = [{ msg: "Invalid passcode" }];
    res.render("membership", { errors: errors });
  }
}