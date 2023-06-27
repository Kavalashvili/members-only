const User = require('../models/user');
const Messages = require('../models/message');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display sign up form form on GET.
exports.sign_up_get = (req, res) => {
    res.render("sign-up-form");
  };

// Handle sign up form on POST.
exports.watch_create_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year", "Year must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("reference", "Reference must not be empty").trim().isLength({ min: 1 }).escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Watch object with escaped and trimmed data.
    const watch = new Watch({
      name: req.body.name,
      brand: req.body.brand,
      year: req.body.year,
      reference: req.body.reference,
      price: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all brands and categories for form.
      const [allBrands, allCategories] = await Promise.all([
        Brand.find().exec(),
        Category.find().exec(),
      ]);

      res.render("watch_form", {
        title: "Create Watch",
        brands: allBrands,
        categories: allCategories,
        watch: watch,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save watch.
      await watch.save();
      res.redirect(watch.url);
    }
  }),
];

