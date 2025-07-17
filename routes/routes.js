const { Router } = require("express");
const passport = require("../authentication/jwtStrategy");
const userControl = require("../controllers/userControllers");
const postControl = require("../controllers/postControllers");
const commentController = require("../controllers/commentControllers");
const adminController = require("../controllers/adminController");
const likesController = require("../controllers/likesController");
const router = new Router();

//
//  ========================= USERS ROUTES =========================
//
router.post("/api/register", userControl.addUser);
// Login route

router.post("/api/login", userControl.login);

//
// ========================== POST ROUTES ========================
//
// Create  a post
router.post(
  "/api/posts",
  passport.authenticate("jwt", { session: false }),
  postControl.addPost
);
//  Get all published posts
router.get("/api/posts", postControl.getAllPosts);

// Get all drafts & Published Post for a particular author
router.get(
  "/api/posts/published",
  passport.authenticate("jwt", { session: false }),
  postControl.getAuthorPublishedPost
);
// Drafts
router.get(
  "/api/posts/drafts",
  passport.authenticate("jwt", { session: false }),
  postControl.getDraftPosts
);
// Get post by Id(if published or owner)
router.get("/api/posts/:id", postControl.getPostsById);
router.get(
  "/api/posts/:id/drafts",
  passport.authenticate("jwt", { session: false }),
  postControl.getDraftById
);
// Update the post
router.patch(
  "/api/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postControl.patchPost
);
// Publish or Draft Post
router.patch(
  "/api/posts/:id/publish",
  passport.authenticate("jwt", { session: false }),
  postControl.publishPost
);
// Delete post by Id
router.delete(
  "/api/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postControl.deletePost
);
//
// ===========================   COMMENTS ROUTES ==================
//
// Add comments to a post
router.get("/api/posts/:postId/comments", commentController.allComments);

// View comments to a post
router.post(
  "/api/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  commentController.addComment
);

// Update & delete a comment
router.patch(
  "/api/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.patchComment
);

router.delete(
  "/api/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

// ====================== ADMIN ROUTES ======================
// Get my profile
router.get(
  "/api/me",
  passport.authenticate("jwt", { session: false }),
  adminController.getMyInfo
);
// Get all posts
router.get(
  "/api/admin/posts",
  passport.authenticate("jwt", { session: false }),
  adminController.getAllPosts
);
// Get all users
router.get(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  adminController.getAllUsers
);
// Update users role
router.patch(
  "/api/users/:id/role",
  passport.authenticate("jwt", { session: false }),
  adminController.updateRole
);

// ==================== LIKES & SHARES ROUTES =============
// Like a post
router.post(
  "/api/posts/:id/like",
  passport.authenticate("jwt", { session: false }),
  likesController.addLikeToPost
);
// Like a comment
router.post(
  "/api/comments/:id/like",
  passport.authenticate("jwt", { session: false }),
  likesController.likeComment
);
// Share a post
router.post(
  "/api/posts/:id/share",
  passport.authenticate("jwt", { session: false }),
  likesController.sharePost
);
module.exports = router;
