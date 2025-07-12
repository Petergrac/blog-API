const { body } = require("express-validator");
const { checkIfEmailExists } = require("../database/userQueries");
const validate = [
  body("username")
    .trim()
    .isAlpha()
    .withMessage("Username must contain only letters")
    .bail(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .bail()
    .custom(async (value) => {
      const exists = await checkIfEmailExists(value);
      if (exists) {
        throw new Error("Email already exists");
      }
      return true;
    })
    .bail(),
  body("password")
    .trim()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be between 6 and 10 characters")
    .bail()
    .isAlphanumeric()
    .withMessage("Password must be alphanumeric")
    .bail(),
  body("check_password")
    .trim()
    .isLength({ min: 6, max: 10 })
    .withMessage("Confirm password must be between 6 and 10 characters")
    .bail()
    .isAlphanumeric()
    .withMessage("Confirm password must be alphanumeric")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .bail(),
];

module.exports = validate;
