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
// Registration  route
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               check_password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/api/register", userControl.addUser);
// Login route
/**
 * @swagger
 *  post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/api/login", userControl.login);

//
// ========================== POST ROUTES ========================
//
// Create & Get all published posts
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post(
  "/api/posts",
  passport.authenticate("jwt", { session: false }),
  postControl.addPost
);
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all published posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Returns all published posts
 */
router.get("/api/posts", postControl.getAllPosts);

// Get all drafts
/**
 * @swagger
 * /api/posts/drafts:
 *   get:
 *     summary: Get all draft posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Returns all draft posts
 */
router.get(
  "/api/posts/drafts",
  passport.authenticate("jwt", { session: false }),
  postControl.getDraftPosts
);
// Get post by Id(if published or owner)
/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the post with the specified ID
 */
router.get("/api/posts/:id", postControl.getPostsById);
/**
 * @swagger
 * /api/posts/{id}/drafts:
 *   get:
 *     summary: Get a draft post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the draft post with the specified ID
 */
router.get(
  "/api/posts/:id/drafts",
  passport.authenticate("jwt", { session: false }),
  postControl.getDraftById
);
// Update the post
/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/api/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postControl.patchPost
);
// Publish Post

/**
 * @swagger
 *  patch:
 *     summary: Publish a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post published successfully
 */
router.patch(
  "/api/posts/:id/publish",
  passport.authenticate("jwt", { session: false }),
  postControl.publishPost
);
// Delete post by Id
/**
 * @swagger
 *  delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete(
  "/api/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postControl.deletePost
);
//
// ===========================   COMMENTS ROUTES ==================
//
// Add comments to a post
/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns all comments for the specified post
 */
router.get("/api/posts/:postId/comments", commentController.allComments);

// View comments to a post
/**
 * @swagger
 *  post:
 *    summary: Add a comment to a post
 *    tags: [Comments]
 *    parameters:
 *      - name: postId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *    responses:
 *      200:
 *        description: Comment added successfully
 *      400:
 *        description: Bad request
 *
 */
router.post(
  "/api/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  commentController.addComment
);

// Update & delete a comment
/**
 * @swagger
 *  patch:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
router.patch(
  "/api/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.patchComment
);

/**
 * @swagger
 *  delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/api/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

// ====================== ADMIN ROUTES ======================
// Get my profile
/**
 * @swagger
 *  get:
 *     summary: Get my profile
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Returns my profile
 */
router.get(
  "/api/me",
  passport.authenticate("jwt", { session: false }),
  adminController.getMyInfo
);
// Get all posts
/**
 * @swagger
 *  get:
 *     summary: Get all posts
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Returns all posts
 */
router.get(
  "/api/admin/posts",
  passport.authenticate("jwt", { session: false }),
  adminController.getAllPosts
);
// Get all users
/**
 * @swagger
 *  get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Returns all users
 */
router.get(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  adminController.getAllUsers
);
// Update users role
/**
 * @swagger
 *  patch:
 *     summary: Update user role
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/api/users/:id/role",
  passport.authenticate("jwt", { session: false }),
  adminController.updateRole
);

// ==================== LIKES & SHARES ROUTES =============
// Like a post
/**
 * @swagger
 *  post:
 *     summary: Like a post
 *     tags: [Likes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked successfully
 */
router.post(
  "/api/posts/:id/like",
  passport.authenticate("jwt", { session: false }),
  likesController.addLikeToPost
);
// Like a comment
/**
 * @swagger
 *  post:
 *     summary: Like a comment
 *     tags: [Likes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment liked successfully
 */
router.post(
  "/api/comments/:id/like",
  passport.authenticate("jwt", { session: false }),
  likesController.likeComment
);
// Share a post
/**
 * @swagger
 *  post:
 *     summary: Share a post
 *     tags: [Shares]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post shared successfully
 */
router.post(
  "/api/posts/:id/share",
  passport.authenticate("jwt", { session: false }),
  likesController.sharePost
);
module.exports = router;
