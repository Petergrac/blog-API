const adminDb = require("../database/adminQueries");
const userDb = require("../database/userQueries");
// Get users info
async function getMyInfo(req, res, next) {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.status(200).json({ message: "No data found. Login" });
    }
    if (req.user.role !== "ADMIN") {
      return res.status(400).json({ message: "Cant access this route" });
    }
    const user = await userDb.getUserById(userId);
    if (user) {
      return res.status(200).json({ user });
    }
  } catch (error) {
    console.error("Error obtaining the user", error.message);
    next(error);
  }
}
// Get all users
async function getAllUsers(req, res, next) {
  try {
    const userRole = req.user.role;
    if (userRole !== "ADMIN") {
      return res.status(401).jso({ message: "Unauthorized" });
    }
    const allUsers = await adminDb.getAllUsers();
    if (allUsers) {
      return res.status(200).json({ allUsers });
    }
    return res.status(404).json({ message: "Can't get the users" });
  } catch (error) {
    console.error("Error when getting all the users", error.message);
    next(error);
  }
}
// Get all posts
async function getAllPosts(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const allPosts = await adminDb.getAllPosts();
    if (allPosts) {
      return res.status(200).json({ allPosts });
    }
    return res.status(500).json({ message: "Internal server error" });
  } catch (error) {
    console.error("Error when retrieving the posts", error.message);
    next(error);
  }
}
// Update users role
async function updateRole(req, res, next) {
  try {
    const { id } = req.params;
    const adminRole = req.user.role;
    if (req.user && adminRole !== "ADMIN" && id) {
      return res.status(500).json({ message: "Internal error" });
    }
    const { role } = req.body;
    if (!role) {
      return res.status(404).json({ message: "User role not found" });
    }
    const updatedUser = await adminDb.updateUserRole(id, role.toUpperCase());
    if (updatedUser) {
      return res.status(200).json({ updatedUser });
    }
    return res.status(404).json({ message: "Could not update the users role" });
  } catch (error) {
    console.error("Could not update user's role", error.message);
    next(error);
  }
}
module.exports = {
  getMyInfo,
  getAllPosts,
  getAllUsers,
  updateRole
};
