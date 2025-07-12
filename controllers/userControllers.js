const validate = require("../validations/validation");
const { validationResult } = require("express-validator");
const database = require("../database/userQueries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registration
const addUser = [
  validate,
  async (req, res, next) => {
    const errors = validationResult(req);
    // Check for errors
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    // Fields
    const { username: name, email, password, role } = req.body;
    // Hash the password

    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await database.addUser(name, email, hash, role);
      if (!user) {
        return res
          .status(500)
          .json({ message: "Connection refused. Try Again" });
      }
      return res.status(201).json({ message: "Registered Successfully", name });
    } catch (error) {
      console.error("Error Happened in the add user middleware", error);
      next(error);
    }
  },
];

// Login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    // Check email
    const user = await database.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Incorrect email" });
    }
    // Confirm Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    // Generate the token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1hr",
      }
    );
    res.status(202).json({ message: "Logged In Successfully", token });
  } catch (error) {
    console.error("Error in the login middleware", error.message);
    next(error);
  }
}

module.exports = {
  addUser,
  login,
};
