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
      return res.status(200).json({ errors: formattedErrors });
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

    if (user === null) {
      return res.status(200).json({ message: "Incorrect email" });
    }
    // Confirm Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(200).json({ message: "Incorrect Password" });
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
// Get user by id
async function getUserById(req, res, next) {
  try {
    const { id: userId } = req.params;
    if (!userId) return res.status(200).json({ message: "Id cannot be empty" });
    const user = await database.getUserById(userId);
    if (!user) return res.status(200).json({ message: "User does not exist" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Could not fetch the user", error.message);
    next(error);
  }
}
// Update user info
async function updateUserInfo(req, res, next) {
  try {
    const { id: userId } = req.params;
    const updates = req.body;
    const user = await database.updateUserData(userId, updates.updatedFields);
    if (!user)
      return res
        .status(200)
        .json({ message: "User info could not be updated" });
    return res.status(200).json({ user });
  } catch (error) {
    console.log("User data could not be updated", error.message);
    next(error);
  }
}
module.exports = {
  addUser,
  login,
  getUserById,
  updateUserInfo,
};
