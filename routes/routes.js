const { Router } = require("express");
const userControl = require("../controllers/userControllers");
const postControl = require("../controllers/postControllers");
const commentController = require("../controllers/commentControllers");
const adminController = require("../controllers/adminController");
const likesController = require("../controllers/likesController");
const authenticateJwt = require("../authentication/authMiddleware");
const router = new Router();

//
//  ========================= USERS ROUTES =========================
//
router.post("/api/register", userControl.addUser);
// Login route

router.post("/api/login/", userControl.login);
//
// ========================== POST ROUTES ========================
//
// Create  a post
router.post("/api/posts", authenticateJwt, postControl.addPost);
//  Get all published posts
router.get("/api/posts", postControl.getAllPosts);

// Get all drafts & Published Post for a particular author
router.get(
  "/api/posts/published",
  authenticateJwt,
  postControl.getAuthorPublishedPost
);
// Drafts
router.get("/api/posts/drafts", authenticateJwt, postControl.getDraftPosts);
// Get post by Id(if published or owner)
router.get("/api/posts/:id", postControl.getPostsById);
router.get("/api/posts/:id/drafts", authenticateJwt, postControl.getDraftById);
// Update the post
router.patch("/api/posts/:id", authenticateJwt, postControl.patchPost);
// Publish or Draft Post
router.patch(
  "/api/posts/:id/publish",
  authenticateJwt,
  postControl.publishPost
);
// Delete post by Id
router.delete("/api/posts/:id", authenticateJwt, postControl.deletePost);
//
// ===========================   COMMENTS ROUTES ==================
//
// Add comments to a post
router.get("/api/posts/:postId/comments", commentController.allComments);

// View comments to a post
router.post(
  "/api/posts/:postId/comments",
  authenticateJwt,
  commentController.addComment
);

// Update & delete a comment
router.patch(
  "/api/comments/:commentId",
  authenticateJwt,
  commentController.patchComment
);

router.delete(
  "/api/comments/:commentId",
  authenticateJwt,
  commentController.deleteComment
);

// ====================== ADMIN ROUTES ======================
// Get my profile
router.get("/api/me", authenticateJwt, adminController.getMyInfo);
// Get all posts
router.get("/api/admin/posts", authenticateJwt, adminController.getAllPosts);
// Get all users
router.get("/api/users", authenticateJwt, adminController.getAllUsers);
// Update users role
router.patch(
  "/api/users/:id/role",
  authenticateJwt,
  adminController.updateRole
);

// ==================== LIKES & SHARES ROUTES =============
// Like a post
router.post(
  "/api/posts/:id/like",
  authenticateJwt,
  likesController.addLikeToPost
);
// Like a comment
router.post(
  "/api/comments/:id/like",
  authenticateJwt,
  likesController.likeComment
);
// Share a post
router.post("/api/posts/:id/share", authenticateJwt, likesController.sharePost);
module.exports = router;
