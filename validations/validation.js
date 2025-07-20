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
];

module.exports = validate;
