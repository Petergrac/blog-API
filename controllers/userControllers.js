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
    // Generate access token
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );
    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "7d" }
    );
    res.json({ accessToken,refreshToken });
  } catch (error) {
    console.error("Could not generate the tokens.", error.message);
    next(error);
  }
}

// Refresh token
async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "15m" }
      );
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Could not serve new accessToken", error.message);
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
  refreshToken,
};
